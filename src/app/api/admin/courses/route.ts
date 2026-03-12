import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { slugify } from '@/lib/utils'

async function requireAdminApi() {
  const user = await getCurrentUser()
  if (!user) {
    return { error: NextResponse.json({ success: false, error: 'ไม่ได้เข้าสู่ระบบ' }, { status: 401 }) }
  }
  if (user.role !== 'ADMIN') {
    return { error: NextResponse.json({ success: false, error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 }) }
  }
  return { user }
}

// GET /api/admin/courses — List all courses
export async function GET() {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const courses = await db.course.findMany({
      include: {
        _count: {
          select: { lessons: true, enrollments: true, quizzes: true, certificates: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: courses })
  } catch (error) {
    console.error('Admin courses list error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลคอร์ส' },
      { status: 500 }
    )
  }
}

const createCourseSchema = z.object({
  title: z.string().min(1, 'กรุณาระบุชื่อคอร์ส'),
  courseCode: z.string().min(1, 'กรุณาระบุรหัสคอร์ส').max(10),
  description: z.string().min(1, 'กรุณาระบุรายละเอียด'),
  shortDescription: z.string().optional(),
  category: z.string().min(1, 'กรุณาระบุหมวดหมู่'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  duration: z.string().optional(),
  thumbnail: z.string().optional(),
  isFree: z.boolean().default(true),
  hasCertificate: z.boolean().default(true),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

// POST /api/admin/courses — Create a new course
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const body = await request.json()
    const parsed = createCourseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const data = parsed.data
    const slug = slugify(data.title)

    // Check for duplicate slug or courseCode
    const existing = await db.course.findFirst({
      where: {
        OR: [{ slug }, { courseCode: data.courseCode }],
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'ชื่อคอร์สหรือรหัสคอร์สซ้ำ' },
        { status: 409 }
      )
    }

    const course = await db.course.create({
      data: {
        ...data,
        slug,
        instructorId: auth.user!.id,
      },
    })

    // Auto-create certificate template
    if (data.hasCertificate) {
      await db.certificateTemplate.create({
        data: { courseId: course.id },
      })
    }

    return NextResponse.json(
      { success: true, data: course, message: 'สร้างคอร์สสำเร็จ' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการสร้างคอร์ส' },
      { status: 500 }
    )
  }
}
