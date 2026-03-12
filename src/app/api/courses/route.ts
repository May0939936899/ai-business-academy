import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// GET /api/courses - List courses with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const level = searchParams.get("level") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");

    // Build where clause
    const where: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (level && ["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(level)) {
      where.level = level;
    }

    // Get total count
    const total = await db.course.count({ where });

    // Get courses with pagination
    const courses = await db.course.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      success: true,
      data: courses,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("List courses error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการดึงข้อมูลคอร์ส",
      },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create course (admin only)
const createCourseSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อคอร์ส"),
  slug: z.string().optional(),
  courseCode: z.string().max(10).optional(),
  description: z.string().min(1, "กรุณากรอกรายละเอียดคอร์ส"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  duration: z.string().optional(),
  thumbnail: z.string().optional(),
  isFree: z.boolean().default(true),
  hasCertificate: z.boolean().default(true),
  instructorId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
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

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "ไม่มีสิทธิ์เข้าถึง" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = createCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { instructorId, slug: inputSlug, courseCode: inputCode, ...rest } = parsed.data;

    // Generate slug from title if not provided
    const slug = inputSlug || slugify(rest.title);
    const courseCode = inputCode || slug.toUpperCase().replace(/-/g, '').slice(0, 10);

    // Check if slug already exists
    const existingCourse = await db.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug นี้ถูกใช้งานแล้ว",
        },
        { status: 409 }
      );
    }

    const course = await db.course.create({
      data: {
        ...rest,
        slug,
        courseCode,
        ...(instructorId ? { instructor: { connect: { id: instructorId } } } : {}),
      },
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: course,
        message: "สร้างคอร์สสำเร็จ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการสร้างคอร์ส",
      },
      { status: 500 }
    );
  }
}
