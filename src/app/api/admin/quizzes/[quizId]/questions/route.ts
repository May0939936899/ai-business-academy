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

const questionSchema = z.object({
  question: z.string().min(1, 'กรุณาระบุคำถาม'),
  optionA: z.string().min(1, 'กรุณาระบุตัวเลือก A'),
  optionB: z.string().min(1, 'กรุณาระบุตัวเลือก B'),
  optionC: z.string().min(1, 'กรุณาระบุตัวเลือก C'),
  optionD: z.string().min(1, 'กรุณาระบุตัวเลือก D'),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  sortOrder: z.number().int().min(0).optional(),
})

// GET /api/admin/quizzes/[quizId]/questions — List questions for a quiz
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { quizId } = await params

    const quiz = await db.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) {
      return NextResponse.json({ success: false, error: 'ไม่พบแบบทดสอบ' }, { status: 404 })
    }

    const questions = await db.quizQuestion.findMany({
      where: { quizId },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ success: true, data: questions })
  } catch (error) {
    console.error('List questions error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}

// POST /api/admin/quizzes/[quizId]/questions — Add a question to a quiz
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { quizId } = await params

    const quiz = await db.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) {
      return NextResponse.json({ success: false, error: 'ไม่พบแบบทดสอบ' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = questionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    // Auto-assign sortOrder if not provided
    if (parsed.data.sortOrder === undefined) {
      const maxOrder = await db.quizQuestion.findFirst({
        where: { quizId },
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      })
      parsed.data.sortOrder = (maxOrder?.sortOrder ?? 0) + 1
    }

    const question = await db.quizQuestion.create({
      data: {
        quizId,
        question: parsed.data.question,
        optionA: parsed.data.optionA,
        optionB: parsed.data.optionB,
        optionC: parsed.data.optionC,
        optionD: parsed.data.optionD,
        correctAnswer: parsed.data.correctAnswer,
        explanation: parsed.data.explanation,
        difficulty: parsed.data.difficulty,
        sortOrder: parsed.data.sortOrder,
      },
    })

    return NextResponse.json(
      { success: true, data: question, message: 'เพิ่มคำถามสำเร็จ' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Add question error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการเพิ่มคำถาม' }, { status: 500 })
  }
}

const updateQuestionSchema = z.object({
  questionId: z.string().min(1, 'กรุณาระบุ ID คำถาม'),
  question: z.string().min(1).optional(),
  optionA: z.string().min(1).optional(),
  optionB: z.string().min(1).optional(),
  optionC: z.string().min(1).optional(),
  optionD: z.string().min(1).optional(),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']).optional(),
  explanation: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  sortOrder: z.number().int().min(0).optional(),
})

// PUT /api/admin/quizzes/[quizId]/questions — Update a question (questionId in body)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { quizId } = await params

    const body = await request.json()
    const parsed = updateQuestionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { questionId, ...updateData } = parsed.data

    // Verify question belongs to this quiz
    const existing = await db.quizQuestion.findFirst({
      where: { id: questionId, quizId },
    })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'ไม่พบคำถามนี้' }, { status: 404 })
    }

    const question = await db.quizQuestion.update({
      where: { id: questionId },
      data: {
        ...(updateData.question !== undefined && { question: updateData.question }),
        ...(updateData.optionA !== undefined && { optionA: updateData.optionA }),
        ...(updateData.optionB !== undefined && { optionB: updateData.optionB }),
        ...(updateData.optionC !== undefined && { optionC: updateData.optionC }),
        ...(updateData.optionD !== undefined && { optionD: updateData.optionD }),
        ...(updateData.correctAnswer !== undefined && { correctAnswer: updateData.correctAnswer }),
        ...(updateData.explanation !== undefined && { explanation: updateData.explanation }),
        ...(updateData.difficulty !== undefined && { difficulty: updateData.difficulty }),
        ...(updateData.sortOrder !== undefined && { sortOrder: updateData.sortOrder }),
      },
    })

    return NextResponse.json({ success: true, data: question, message: 'อัพเดตคำถามสำเร็จ' })
  } catch (error) {
    console.error('Update question error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการอัพเดตคำถาม' }, { status: 500 })
  }
}

const deleteQuestionSchema = z.object({
  questionId: z.string().min(1, 'กรุณาระบุ ID คำถาม'),
})

// DELETE /api/admin/quizzes/[quizId]/questions — Delete a question (questionId in body)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { quizId } = await params

    const body = await request.json()
    const parsed = deleteQuestionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { questionId } = parsed.data

    // Verify question belongs to this quiz
    const existing = await db.quizQuestion.findFirst({
      where: { id: questionId, quizId },
    })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'ไม่พบคำถามนี้' }, { status: 404 })
    }

    await db.quizQuestion.delete({ where: { id: questionId } })

    return NextResponse.json({ success: true, message: 'ลบคำถามสำเร็จ' })
  } catch (error) {
    console.error('Delete question error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการลบคำถาม' }, { status: 500 })
  }
}
