import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/lessons/[lessonId] - Get lesson with resources
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        resources: {
          orderBy: { createdAt: "asc" },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบบทเรียนนี้",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error("Get lesson error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการดึงข้อมูลบทเรียน",
      },
      { status: 500 }
    );
  }
}

// PUT /api/lessons/[lessonId] - Update lesson (admin only)
const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  videoTitle: z.string().optional().nullable(),
  videoChannel: z.string().optional().nullable(),
  durationText: z.string().optional().nullable(),
  lessonOrder: z.number().int().min(1).optional(),
  lessonLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  summary: z.string().optional().nullable(),
  learningOutcomes: z.string().optional().nullable(),
  keyTakeaways: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ไม่ได้เข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "ไม่มีสิทธิ์เข้าถึง" },
        { status: 403 }
      );
    }

    const { lessonId } = await params;

    // Check lesson exists
    const existingLesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { success: false, error: "ไม่พบบทเรียนนี้" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = updateLessonSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: parsed.data,
      include: {
        resources: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: lesson,
      message: "อัปเดตบทเรียนสำเร็จ",
    });
  } catch (error) {
    console.error("Update lesson error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการอัปเดตบทเรียน",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/lessons/[lessonId] - Delete lesson (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ไม่ได้เข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "ไม่มีสิทธิ์เข้าถึง" },
        { status: 403 }
      );
    }

    const { lessonId } = await params;

    // Check lesson exists
    const existingLesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { success: false, error: "ไม่พบบทเรียนนี้" },
        { status: 404 }
      );
    }

    await db.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({
      success: true,
      message: "ลบบทเรียนสำเร็จ",
    });
  } catch (error) {
    console.error("Delete lesson error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการลบบทเรียน",
      },
      { status: 500 }
    );
  }
}
