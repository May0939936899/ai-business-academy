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

// GET /api/admin/quizzes — List all quizzes with course info and counts
export async function GET() {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const quizzes = await db.quiz.findMany({
      include: {
        course: { select: { id: true, title: true } },
        _count: { select: { questions: true, attempts: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get pass counts grouped by quiz
    const quizIds = quizzes.map((q) => q.id)
    const passedByQuiz = await db.quizAttempt.groupBy({
      by: ['quizId'],
      where: { quizId: { in: quizIds }, passed: true },
      _count: { id: true },
    })
    const passedMap = new Map(passedByQuiz.map((p) => [p.quizId, p._count.id]))

    // Aggregate stats
    const [totalQuizzes, totalQuestions, totalAttempts, passedAttempts] = await Promise.all([
      db.quiz.count(),
      db.quizQuestion.count(),
      db.quizAttempt.count(),
      db.quizAttempt.count({ where: { passed: true } }),
    ])

    const avgPassRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0

    const data = quizzes.map((quiz) => {
      const passedCount = passedMap.get(quiz.id) || 0
      const attemptCount = quiz._count.attempts
      const passRate = attemptCount > 0 ? Math.round((passedCount / attemptCount) * 100) : 0
      return { ...quiz, passRate }
    })

    return NextResponse.json({
      success: true,
      data,
      stats: { totalQuizzes, totalQuestions, totalAttempts, avgPassRate },
    })
  } catch (error) {
    console.error('Admin quizzes list error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลแบบทดสอบ' }, { status: 500 })
  }
}

const createQuizSchema = z.object({
  courseId: z.string().min(1, 'กรุณาเลือกคอร์ส'),
  title: z.string().min(1, 'กรุณาระบุชื่อแบบทดสอบ'),
  passingScore: z.number().int().min(1).max(100).default(70),
})

// POST /api/admin/quizzes — Create a new quiz
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const body = await request.json()
    const parsed = createQuizSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { courseId, title, passingScore } = parsed.data

    // Verify course exists
    const course = await db.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return NextResponse.json({ success: false, error: 'ไม่พบคอร์สนี้' }, { status: 404 })
    }

    const quiz = await db.quiz.create({
      data: { courseId, title, passingScore },
      include: {
        course: { select: { id: true, title: true } },
        _count: { select: { questions: true, attempts: true } },
      },
    })

    return NextResponse.json(
      { success: true, data: quiz, message: 'สร้างแบบทดสอบสำเร็จ' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create quiz error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการสร้างแบบทดสอบ' }, { status: 500 })
  }
}
