import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { generateCertificate } from '@/lib/certificate-utils'

// POST /api/lessons/[lessonId]/complete — Mark a lesson as complete
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ไม่ได้เข้าสู่ระบบ' },
        { status: 401 }
      )
    }

    const { lessonId } = await params

    // Verify lesson exists
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: {
            _count: { select: { lessons: true } },
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบบทเรียนนี้' },
        { status: 404 }
      )
    }

    // Verify user is enrolled
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: lesson.courseId,
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'คุณยังไม่ได้ลงทะเบียนคอร์สนี้' },
        { status: 403 }
      )
    }

    // Upsert lesson progress
    await db.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
        lastViewedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    })

    // Calculate new progress
    const completedCount = await db.lessonProgress.count({
      where: {
        userId: user.id,
        lesson: { courseId: lesson.courseId },
        completed: true,
      },
    })

    const totalLessons = lesson.course._count.lessons
    const progressPercent = totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0

    // Update enrollment progress
    const isCompleted = completedCount >= totalLessons
    await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPercent,
        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isCompleted ? new Date() : undefined,
      },
    })

    // Auto-generate certificate if all course requirements are met
    // generateCertificate checks lessons + quiz + hasCertificate internally
    let certificate = null
    if (isCompleted && lesson.course.hasCertificate) {
      try {
        certificate = await generateCertificate(user.id, lesson.courseId)
      } catch (certError) {
        console.error('Auto certificate generation after lesson complete:', certError)
        // Don't fail lesson completion if certificate generation fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        completedLessons: completedCount,
        totalLessons,
        progressPercent,
        courseCompleted: isCompleted,
        certificate,
      },
      message: 'บันทึกความก้าวหน้าสำเร็จ',
    })
  } catch (error) {
    console.error('Complete lesson error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการบันทึกความก้าวหน้า' },
      { status: 500 }
    )
  }
}
