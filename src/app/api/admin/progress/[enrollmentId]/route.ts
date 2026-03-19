import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

async function requireAdminApi() {
  const user = await getCurrentUser()
  if (!user) return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) }
  if (user.role !== 'ADMIN') return { error: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }) }
  return { user }
}

// PUT /api/admin/progress/[enrollmentId] — Update enrollment status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { enrollmentId } = await params
    const body = await request.json()
    const { status } = body

    if (!['ENROLLED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'สถานะไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
    })

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบข้อมูลการลงทะเบียน' },
        { status: 404 }
      )
    }

    const updated = await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status,
        ...(status === 'COMPLETED' ? { completedAt: new Date() } : {}),
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'อัปเดตสถานะสำเร็จ',
    })
  } catch (error) {
    console.error('Update enrollment error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/progress/[enrollmentId] — Reset progress
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { enrollmentId } = await params

    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: { select: { id: true } } },
    })

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบข้อมูลการลงทะเบียน' },
        { status: 404 }
      )
    }

    // Delete all lesson progress for this user in this course
    await db.lessonProgress.deleteMany({
      where: {
        userId: enrollment.userId,
        lesson: { courseId: enrollment.courseId },
      },
    })

    // Reset enrollment status to ENROLLED
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'ENROLLED',
        completedAt: null,
        progressPercent: 0,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'รีเซ็ตความก้าวหน้าสำเร็จ',
    })
  } catch (error) {
    console.error('Reset progress error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
