import db from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import LearningPathClient from './LearningPathClient'

export const dynamic = "force-dynamic";

export const metadata = { title: 'Learning Path' }

const PATH_ORDER = ['FOUNDATION', 'CORE', 'APPLIED', 'ADVANCED'] as const

const PATH_META: Record<string, { label: string; labelTh: string; description: string; color: string; icon: string }> = {
  FOUNDATION: { label: 'Foundation', labelTh: 'พื้นฐาน', description: 'ทำความเข้าใจ AI เบื้องต้น Prompt Engineering และจริยธรรม', color: '#2196F3', icon: '🏗️' },
  CORE:       { label: 'Core Skills', labelTh: 'ทักษะหลัก', description: 'AI Productivity, Marketing, Analytics, HR, เครื่องมือสำหรับผู้บริหาร', color: '#4CAF50', icon: '⚡' },
  APPLIED:    { label: 'Applied', labelTh: 'ประยุกต์ใช้', description: 'Automation, Finance, Entrepreneurship, Digital Organization', color: '#FF9800', icon: '🚀' },
  ADVANCED:   { label: 'Advanced', labelTh: 'ขั้นสูง', description: 'Decision-Making, Communication, Strategy, Digital Transformation', color: '#E91E63', icon: '🎯' },
}

export default async function LearningPathPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  // Fetch all published courses grouped by path
  const courses = await db.course.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
      ...(userId ? {
        enrollments: {
          where: { userId },
          select: { status: true, progressPercent: true },
        },
      } : {}),
    },
    orderBy: { pathOrder: 'asc' },
  })

  // Group by pathGroup
  const grouped = PATH_ORDER.map((group) => ({
    group,
    meta: PATH_META[group],
    courses: courses
      .filter((c) => c.pathGroup === group)
      .map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        shortDescription: c.shortDescription,
        category: c.category,
        level: c.level,
        duration: c.duration,
        lessonCount: c._count.lessons,
        enrollmentCount: c._count.enrollments,
        userProgress: userId && (c as any).enrollments?.[0]
          ? {
              status: (c as any).enrollments[0].status as string,
              percent: (c as any).enrollments[0].progressPercent as number,
            }
          : null,
      })),
  }))

  // Stats
  const totalCourses = courses.length
  const totalLessons = courses.reduce((sum, c) => sum + c._count.lessons, 0)

  let userCompletedCourses = 0
  if (userId) {
    userCompletedCourses = courses.filter(
      (c) => (c as any).enrollments?.[0]?.status === 'COMPLETED'
    ).length
  }

  return (
    <LearningPathClient
      groups={grouped}
      totalCourses={totalCourses}
      totalLessons={totalLessons}
      userCompletedCourses={userCompletedCourses}
      isLoggedIn={!!userId}
    />
  )
}
