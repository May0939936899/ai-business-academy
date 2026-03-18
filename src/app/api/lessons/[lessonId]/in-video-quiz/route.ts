import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;

    const questions = await db.inVideoQuizQuestion.findMany({
      where: { lessonId },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        question: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        correctAnswer: true,
        explanation: true,
        triggerPercent: true,
        sortOrder: true,
      },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('[IN_VIDEO_QUIZ_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
