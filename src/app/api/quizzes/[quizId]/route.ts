import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { generateCertificateCode } from "@/lib/utils";

// GET /api/quizzes/[quizId] - Get quiz with questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            question: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            sortOrder: true,
            // Do NOT include correctAnswer or explanation for students
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบแบบทดสอบนี้",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Get quiz error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการดึงข้อมูลแบบทดสอบ",
      },
      { status: 500 }
    );
  }
}

// POST /api/quizzes/[quizId] - Submit quiz attempt
const submitQuizSchema = z.object({
  answers: z.record(z.string(), z.enum(["A", "B", "C", "D"])),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ไม่ได้เข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const { quizId } = await params;

    const body = await request.json();
    const parsed = submitQuizSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { answers } = parsed.data;

    // Get quiz with questions and correct answers
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { sortOrder: "asc" },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            courseCode: true,
            hasCertificate: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "ไม่พบแบบทดสอบนี้" },
        { status: 404 }
      );
    }

    // Check if user is enrolled in the course
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: quiz.course.id,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: "คุณยังไม่ได้ลงทะเบียนคอร์สนี้" },
        { status: 403 }
      );
    }

    // Calculate score
    const totalQuestions = quiz.questions.length;
    let correctCount = 0;

    const results = quiz.questions.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        userAnswer: userAnswer || null,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const score = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;
    const passed = score >= quiz.passingScore;

    // Save quiz attempt
    const attempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        quizId,
        score,
        passed,
      },
    });

    // Auto-issue certificate if passed and course has certificate
    let certificate = null;
    if (passed && quiz.course.hasCertificate) {
      // Check if certificate already exists
      const existingCertificate = await db.certificate.findFirst({
        where: {
          userId: user.id,
          courseId: quiz.course.id,
        },
      });

      if (!existingCertificate) {
        // Generate certificate code: SPUBUS-COURSECODE-YYYY-XXXX
        const currentYear = new Date().getFullYear();
        const existingCertCount = await db.certificate.count({
          where: {
            courseId: quiz.course.id,
            issuedAt: {
              gte: new Date(`${currentYear}-01-01`),
              lt: new Date(`${currentYear + 1}-01-01`),
            },
          },
        });
        const certCode = generateCertificateCode(
          quiz.course.courseCode,
          currentYear,
          existingCertCount + 1
        );

        certificate = await db.certificate.create({
          data: {
            certificateCode: certCode,
            userId: user.id,
            courseId: quiz.course.id,
          },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        });
      } else {
        certificate = existingCertificate;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        attempt,
        score,
        passed,
        correctCount,
        totalQuestions,
        passingScore: quiz.passingScore,
        results,
        certificate,
      },
      message: passed
        ? "ยินดีด้วย! คุณผ่านแบบทดสอบแล้ว"
        : "คุณยังไม่ผ่านแบบทดสอบ กรุณาลองใหม่อีกครั้ง",
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการส่งแบบทดสอบ",
      },
      { status: 500 }
    );
  }
}
