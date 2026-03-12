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
  question: z.string().min(1),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().optional(),
  sortOrder: z.number().int().min(1),
})

const createQuizSchema = z.object({
  title: z.string().min(1, 'กรุณาระบุชื่อแบบทดสอบ'),
  passingScore: z.number().int().min(1).max(100).default(70),
  isActive: z.boolean().default(true),
  questions: z.array(questionSchema).optional(),
})

// GET /api/admin/courses/[courseId]/quiz — Get quizzes for a course
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { courseId } = await params

    const quizzes = await db.quiz.findMany({
      where: { courseId },
      include: {
        questions: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { attempts: true } },
      },
    })

    return NextResponse.json({ success: true, data: quizzes })
  } catch (error) {
    console.error('List quizzes error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

// POST /api/admin/courses/[courseId]/quiz — Create a new quiz (optionally with questions)
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
    const parsed = createQuizSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { questions, ...quizData } = parsed.data

    const quiz = await db.quiz.create({
      data: {
        ...quizData,
        courseId,
        questions: questions
          ? {
              create: questions.map((q) => ({
                question: q.question,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                sortOrder: q.sortOrder,
              })),
            }
          : undefined,
      },
      include: {
        questions: { orderBy: { sortOrder: 'asc' } },
      },
    })

    return NextResponse.json(
      { success: true, data: quiz, message: 'สร้างแบบทดสอบสำเร็จ' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create quiz error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการสร้างแบบทดสอบ' },
      { status: 500 }
    )
  }
}
