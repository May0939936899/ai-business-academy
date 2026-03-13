import { notFound, redirect } from 'next/navigation'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import QuizClient from './QuizClient'

interface PageProps {
  params: { quizId: string }
}

export default async function QuizPage({ params }: PageProps) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const quiz = await db.quiz.findUnique({
    where: { id: params.quizId },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          question: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          sortOrder: true,
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
  })

  if (!quiz) notFound()

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: quiz.course.id,
      },
    },
  })

  if (!enrollment) {
    redirect(`/courses/${quiz.course.slug}`)
  }

  // Check if user already has a certificate for this course
  const existingCertificate = await db.certificate.findFirst({
    where: {
      userId: user.id,
      courseId: quiz.course.id,
    },
    select: {
      id: true,
      certificateCode: true,
    },
  })

  return (
    <QuizClient
      quiz={{
        id: quiz.id,
        title: quiz.title,
        passingScore: quiz.passingScore,
        questions: quiz.questions,
        course: quiz.course,
      }}
      existingCertificateCode={existingCertificate?.certificateCode || null}
    />
  )
}
