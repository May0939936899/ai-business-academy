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

// GET /api/admin/courses/[courseId] — Get single course with details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { courseId } = await params

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: { orderBy: { lessonOrder: 'asc' } },
        quizzes: {
          include: {
            questions: { orderBy: { sortOrder: 'asc' } },
            _count: { select: { attempts: true } },
          },
        },
        certificateTemplate: true,
        _count: {
          select: { enrollments: true, certificates: true },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคอร์สนี้' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: course })
  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

const updateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  category: z.string().min(1).optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  duration: z.string().optional(),
  thumbnail: z.string().optional(),
  isFree: z.boolean().optional(),
  hasCertificate: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

// PUT /api/admin/courses/[courseId] — Update a course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { courseId } = await params
    const body = await request.json()
    const parsed = updateCourseSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const existing = await db.course.findUnique({ where: { id: courseId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคอร์สนี้' },
        { status: 404 }
      )
    }

    const course = await db.course.update({
      where: { id: courseId },
      data: parsed.data,
    })

    return NextResponse.json({
      success: true,
      data: course,
      message: 'อัปเดตคอร์สสำเร็จ',
    })
  } catch (error) {
    console.error('Update course error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตคอร์ส' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/courses/[courseId] — Delete a course
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { courseId } = await params

    const existing = await db.course.findUnique({
      where: { id: courseId },
      include: { _count: { select: { enrollments: true } } },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคอร์สนี้' },
        { status: 404 }
      )
    }

    if (existing._count.enrollments > 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถลบคอร์สที่มีผู้ลงทะเบียนได้ กรุณาเปลี่ยนสถานะเป็น Archived แทน' },
        { status: 400 }
      )
    }

    await db.course.delete({ where: { id: courseId } })

    return NextResponse.json({
      success: true,
      message: 'ลบคอร์สสำเร็จ',
    })
  } catch (error) {
    console.error('Delete course error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบคอร์ส' },
      { status: 500 }
    )
  }
}
