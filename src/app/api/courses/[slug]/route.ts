import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/courses/[slug] - Get single course with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const course = await db.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            profileImage: true,
          },
        },
        lessons: {
          where: { isActive: true },
          orderBy: { lessonOrder: "asc" },
          include: {
            resources: true,
          },
        },
        quizzes: {
          where: { isActive: true },
          include: {
            _count: {
              select: { questions: true },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
            quizzes: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบคอร์สนี้",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Get course error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการดึงข้อมูลคอร์ส",
      },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[slug] - Update course (admin only)
const updateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().optional().nullable(),
  category: z.string().min(1).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  duration: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  isFree: z.boolean().optional(),
  hasCertificate: z.boolean().optional(),
  instructorId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params;

    // Check course exists
    const existingCourse = await db.course.findUnique({
      where: { slug },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: "ไม่พบคอร์สนี้" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = updateCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const course = await db.course.update({
      where: { slug },
      data: parsed.data,
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
            enrollments: true,
            lessons: true,
            quizzes: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: course,
      message: "อัปเดตคอร์สสำเร็จ",
    });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการอัปเดตคอร์ส",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[slug] - Delete course (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params;

    // Check course exists
    const existingCourse = await db.course.findUnique({
      where: { slug },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: "ไม่พบคอร์สนี้" },
        { status: 404 }
      );
    }

    await db.course.delete({
      where: { slug },
    });

    return NextResponse.json({
      success: true,
      message: "ลบคอร์สสำเร็จ",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการลบคอร์ส",
      },
      { status: 500 }
    );
  }
}
