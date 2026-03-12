import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { calculateProgress } from "@/lib/utils";

const progressSchema = z.object({
  lessonId: z.string().min(1, "กรุณาระบุบทเรียน"),
});

// POST /api/progress - Mark lesson as completed
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ไม่ได้เข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = progressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { lessonId } = parsed.data;

    // Get the lesson and its course
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: { id: true },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "ไม่พบบทเรียนนี้" },
        { status: 404 }
      );
    }

    // Check if user is enrolled in the course
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: lesson.course.id,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: "คุณยังไม่ได้ลงทะเบียนคอร์สนี้" },
        { status: 403 }
      );
    }

    // Upsert lesson progress
    const lessonProgress = await db.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      create: {
        userId: user.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
      update: {
        completed: true,
        completedAt: new Date(),
        lastViewedAt: new Date(),
      },
    });

    // Calculate and update enrollment progress
    const totalLessons = await db.lesson.count({
      where: {
        courseId: lesson.course.id,
        isActive: true,
      },
    });

    const completedLessons = await db.lessonProgress.count({
      where: {
        userId: user.id,
        completed: true,
        lesson: {
          courseId: lesson.course.id,
          isActive: true,
        },
      },
    });

    const progressPercent = calculateProgress(completedLessons, totalLessons);

    // Update enrollment progress and status
    const updatedEnrollment = await db.enrollment.update({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: lesson.course.id,
        },
      },
      data: {
        progressPercent,
        status:
          progressPercent >= 100
            ? "COMPLETED"
            : progressPercent > 0
              ? "IN_PROGRESS"
              : "ENROLLED",
        completedAt: progressPercent >= 100 ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        lessonProgress,
        enrollment: updatedEnrollment,
        completedLessons,
        totalLessons,
        progressPercent,
      },
      message: "บันทึกความก้าวหน้าสำเร็จ",
    });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการบันทึกความก้าวหน้า",
      },
      { status: 500 }
    );
  }
}
