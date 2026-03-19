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

// GET /api/admin/lessons/[lessonId] — Get single lesson
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { lessonId } = await params

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: { id: true, title: true },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบบทเรียนนี้' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: lesson })
  } catch (error) {
    console.error('Get lesson error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

const updateLessonSchema = z.object({
  courseId: z.string().min(1).optional(),
  title: z.string().min(1, 'กรุณาระบุชื่อบทเรียน').optional(),
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
})

// PUT /api/admin/lessons/[lessonId] — Update a lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { lessonId } = await params
    const body = await request.json()
    const parsed = updateLessonSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const existing = await db.lesson.findUnique({ where: { id: lessonId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบบทเรียนนี้' },
        { status: 404 }
      )
    }

    // If courseId is being changed, verify the target course exists
    if (parsed.data.courseId && parsed.data.courseId !== existing.courseId) {
      const course = await db.course.findUnique({ where: { id: parsed.data.courseId } })
      if (!course) {
        return NextResponse.json(
          { success: false, error: 'ไม่พบคอร์สที่เลือก' },
          { status: 404 }
        )
      }
    }

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: parsed.data,
      include: {
        course: {
          select: { id: true, title: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: lesson,
      message: 'อัปเดตบทเรียนสำเร็จ',
    })
  } catch (error) {
    console.error('Update lesson error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตบทเรียน' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/lessons/[lessonId] — Delete a lesson
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { lessonId } = await params

    const existing = await db.lesson.findUnique({ where: { id: lessonId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบบทเรียนนี้' },
        { status: 404 }
      )
    }

    await db.lesson.delete({ where: { id: lessonId } })

    return NextResponse.json({
      success: true,
      message: 'ลบบทเรียนสำเร็จ',
    })
  } catch (error) {
    console.error('Delete lesson error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบบทเรียน' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/lessons/[lessonId] — Toggle isActive
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { lessonId } = await params

    const existing = await db.lesson.findUnique({ where: { id: lessonId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบบทเรียนนี้' },
        { status: 404 }
      )
    }

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: { isActive: !existing.isActive },
    })

    return NextResponse.json({
      success: true,
      data: lesson,
      message: lesson.isActive ? 'เปิดใช้งานบทเรียนแล้ว' : 'ปิดใช้งานบทเรียนแล้ว',
    })
  } catch (error) {
    console.error('Toggle lesson error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
