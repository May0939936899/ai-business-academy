import { notFound, redirect } from 'next/navigation'
import db from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import LearnClient from './LearnClient'

interface Props {
  params: { courseSlug: string; lessonId: string }
}

export default async function LearnPage({ params }: Props) {
  const user = await requireAuth()
  const { courseSlug, lessonId } = params

  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    include: {
      lessons: {
        where: { isActive: true },
        orderBy: { lessonOrder: 'asc' },
        include: {
          resources: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
      quizzes: {
        where: { isActive: true },
        select: { id: true },
        take: 1,
      },
    },
  })

  if (!course) notFound()

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  })

  if (!enrollment) {
    redirect(`/courses/${courseSlug}`)
  }

  // Get completed lessons
  const completedProgress = await db.lessonProgress.findMany({
    where: {
      userId: user.id,
      completed: true,
      lesson: {
        courseId: course.id,
        isActive: true,
      },
    },
    select: { lessonId: true },
  })

  const completedLessonIds = completedProgress.map((p) => p.lessonId)

  // Verify lessonId exists
  const currentLesson = course.lessons.find((l) => l.id === lessonId)
  if (!currentLesson) {
    const firstLesson = course.lessons[0]
    if (firstLesson) {
      redirect(`/learn/${courseSlug}/${firstLesson.id}`)
    }
    notFound()
  }

  const quizId = course.quizzes[0]?.id || null

  return (
    <LearnClient
      course={{
        slug: course.slug,
        title: course.title,
      }}
      lessons={course.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        lessonOrder: l.lessonOrder,
        youtubeUrl: l.youtubeUrl,
        description: l.description,
        resources: l.resources.map((r) => ({
          id: r.id,
          fileName: r.fileName,
          fileUrl: r.fileUrl,
          fileType: r.fileType,
        })),
      }))}
      currentLessonId={lessonId}
      completedLessonIds={completedLessonIds}
      quizId={quizId}
    />
  )
}
