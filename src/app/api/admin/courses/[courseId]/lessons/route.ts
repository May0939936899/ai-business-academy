import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

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

// GET /api/admin/courses/[courseId]/lessons — List lessons for a course
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { courseId } = await params

    const lessons = await db.lesson.findMany({
      where: { courseId },
      orderBy: { lessonOrder: 'asc' },
    })

    return NextResponse.json({ success: true, data: lessons })
  } catch (error) {
    console.error('List lessons error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

const createLessonSchema = z.object({
  title: z.string().min(1, 'กรุณาระบุชื่อบทเรียน'),
  description: z.string().optional(),
  youtubeUrl: z.string().optional(),
  lessonOrder: z.number().int().min(1),
  summary: z.string().optional(),
  isActive: z.boolean().default(true),
})

// POST /api/admin/courses/[courseId]/lessons — Create a new lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { courseId } = await params

    // Verify course exists
    const course = await db.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคอร์สนี้' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = createLessonSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const lesson = await db.lesson.create({
      data: {
        ...parsed.data,
        courseId,
      },
    })

    return NextResponse.json(
      { success: true, data: lesson, message: 'สร้างบทเรียนสำเร็จ' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create lesson error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการสร้างบทเรียน' },
      { status: 500 }
    )
  }
}
