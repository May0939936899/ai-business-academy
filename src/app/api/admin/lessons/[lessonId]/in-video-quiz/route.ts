import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import db from '@/lib/db'

// ─── GET — list all in-video quiz questions for a lesson ────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    await requireAdmin()
    const { lessonId } = await params

    const questions = await db.inVideoQuizQuestion.findMany({
      where: { lessonId },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ questions })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error
    console.error('[ADMIN_IN_VIDEO_QUIZ_GET]', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

// ─── POST — create a new in-video quiz question ────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    await requireAdmin()
    const { lessonId } = await params
    const body = await req.json()

    const {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
      triggerPercent,
      sortOrder,
    } = body

    if (!question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
      return NextResponse.json({ error: 'correctAnswer must be A, B, C, or D' }, { status: 400 })
    }

    const created = await db.inVideoQuizQuestion.create({
      data: {
        lessonId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation: explanation || null,
        triggerPercent: Number(triggerPercent) || 50,
        sortOrder: Number(sortOrder) || 0,
      },
    })

    return NextResponse.json({ question: created }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error
    console.error('[ADMIN_IN_VIDEO_QUIZ_POST]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── PUT — update an existing question ─────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    await requireAdmin()
    const { lessonId } = await params
    const body = await req.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing question id' }, { status: 400 })
    }

    // Verify the question belongs to this lesson
    const existing = await db.inVideoQuizQuestion.findFirst({
      where: { id, lessonId },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const updated = await db.inVideoQuizQuestion.update({
      where: { id },
      data: {
        ...(data.question !== undefined && { question: data.question }),
        ...(data.optionA !== undefined && { optionA: data.optionA }),
        ...(data.optionB !== undefined && { optionB: data.optionB }),
        ...(data.optionC !== undefined && { optionC: data.optionC }),
        ...(data.optionD !== undefined && { optionD: data.optionD }),
        ...(data.correctAnswer !== undefined && { correctAnswer: data.correctAnswer }),
        ...(data.explanation !== undefined && { explanation: data.explanation || null }),
        ...(data.triggerPercent !== undefined && { triggerPercent: Number(data.triggerPercent) }),
        ...(data.sortOrder !== undefined && { sortOrder: Number(data.sortOrder) }),
      },
    })

    return NextResponse.json({ question: updated })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error
    console.error('[ADMIN_IN_VIDEO_QUIZ_PUT]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── DELETE — remove a question ────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    await requireAdmin()
    const { lessonId } = await params
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing question id' }, { status: 400 })
    }

    // Verify belongs to this lesson
    const existing = await db.inVideoQuizQuestion.findFirst({
      where: { id, lessonId },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    await db.inVideoQuizQuestion.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error
    console.error('[ADMIN_IN_VIDEO_QUIZ_DELETE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
