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

// GET /api/admin/quizzes/[quizId] — Fetch quiz with questions
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { quizId } = await params

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: { select: { id: true, title: true } },
        questions: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { attempts: true } },
      },
    })

    if (!quiz) {
      return NextResponse.json({ success: false, error: 'ไม่พบแบบทดสอบ' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: quiz })
  } catch (error) {
    console.error('Get quiz error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}

const updateQuizSchema = z.object({
  title: z.string().min(1).optional(),
  passingScore: z.number().int().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
})

// PUT /api/admin/quizzes/[quizId] — Update quiz title, passingScore, isActive
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { quizId } = await params

    const existing = await db.quiz.findUnique({ where: { id: quizId } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'ไม่พบแบบทดสอบ' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = updateQuizSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const data = parsed.data
    const quiz = await db.quiz.update({
      where: { id: quizId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.passingScore !== undefined && { passingScore: data.passingScore }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        course: { select: { id: true, title: true } },
        _count: { select: { questions: true, attempts: true } },
      },
    })

    return NextResponse.json({ success: true, data: quiz, message: 'อัพเดตแบบทดสอบสำเร็จ' })
  } catch (error) {
    console.error('Update quiz error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการอัพเดตแบบทดสอบ' }, { status: 500 })
  }
}

// DELETE /api/admin/quizzes/[quizId] — Delete quiz (cascade handles questions)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { quizId } = await params

    const existing = await db.quiz.findUnique({ where: { id: quizId } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'ไม่พบแบบทดสอบ' }, { status: 404 })
    }

    await db.quiz.delete({ where: { id: quizId } })

    return NextResponse.json({ success: true, message: 'ลบแบบทดสอบสำเร็จ' })
  } catch (error) {
    console.error('Delete quiz error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการลบแบบทดสอบ' }, { status: 500 })
  }
}

// PATCH /api/admin/quizzes/[quizId] — Toggle isActive
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { quizId } = await params

    const existing = await db.quiz.findUnique({ where: { id: quizId } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'ไม่พบแบบทดสอบ' }, { status: 404 })
    }

    const quiz = await db.quiz.update({
      where: { id: quizId },
      data: { isActive: !existing.isActive },
      include: {
        course: { select: { id: true, title: true } },
        _count: { select: { questions: true, attempts: true } },
      },
    })

    return NextResponse.json({
      success: true,
      data: quiz,
      message: quiz.isActive ? 'เปิดใช้งานแบบทดสอบแล้ว' : 'ปิดใช้งานแบบทดสอบแล้ว',
    })
  } catch (error) {
    console.error('Toggle quiz error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
