import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/enrollments - Get user's enrollments
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ไม่ได้เข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                fullName: true,
                profileImage: true,
              },
            },
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการดึงข้อมูลการลงทะเบียน",
      },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Enroll in a course
const enrollSchema = z.object({
  courseId: z.string().min(1, "กรุณาระบุคอร์ส"),
});

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
    const parsed = enrollSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { courseId } = parsed.data;

    // Check course exists and is published
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "ไม่พบคอร์สนี้" },
        { status: 404 }
      );
    }

    if (course.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, error: "คอร์สนี้ยังไม่เปิดให้ลงทะเบียน" },
        { status: 400 }
      );
    }

    // Check if already enrolled (prevent duplicate)
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        {
          success: false,
          error: "คุณลงทะเบียนคอร์สนี้แล้ว",
        },
        { status: 409 }
      );
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId: user.id,
        courseId,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                fullName: true,
                profileImage: true,
              },
            },
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: enrollment,
        message: "ลงทะเบียนคอร์สสำเร็จ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enroll error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการลงทะเบียน",
      },
      { status: 500 }
    );
  }
}
