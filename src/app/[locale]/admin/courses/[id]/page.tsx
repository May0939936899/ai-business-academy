import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  PlayCircle,
  FileQuestion,
  Users,
  Award,
  Video,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { formatDate, levelLabels } from '@/lib/utils'
import { getTranslations, getLocale } from 'next-intl/server'

const statusConfig: Record<string, { label: string; className: string }> = {
  PUBLISHED: {
    label: 'Published',
    className:
      'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
  },
  DRAFT: {
    label: 'Draft',
    className: 'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20',
  },
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const t = await getTranslations('admin')
  const locale = await getLocale()

  const { id } = await params

  const course = await db.course.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { lessonOrder: 'asc' },
        include: {
          _count: { select: { inVideoQuizzes: true } },
        },
      },
      quizzes: {
        include: {
          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
          certificates: true,
        },
      },
    },
  })

  if (!course) {
    notFound()
  }

  const status = statusConfig[course.status] ?? statusConfig.DRAFT

  return (
    <div className="space-y-6">
      {/* Back link & Header */}
      <div>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('courseDetailBack')}
        </Link>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                  {course.title}
                </h1>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-sm text-gray-500">
                {course.courseCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Info Card */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-6">
        <h2 className="text-lg font-semibold text-white">
          {t('courseInfo')}
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          {course.description}
        </p>

        {/* Meta info */}
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <p className="text-xs text-gray-500">{t('colCategory')}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-300">
              {course.category}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">{t('colLevel')}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-300">
              {levelLabels[course.level] ?? course.level}
            </p>
          </div>
          {course.duration && (
            <div>
              <p className="text-xs text-gray-500">{t('duration')}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-300">
                {course.duration}
              </p>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-500">{t('enrolledStudents')}</span>
            </div>
            <p className="mt-1.5 text-xl font-bold text-white">
              {course._count.enrollments.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-gray-500">Certificate</span>
            </div>
            <p className="mt-1.5 text-xl font-bold text-white">
              {course._count.certificates.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-cyan-400" />
              <span className="text-xs text-gray-500">{t('lessons')}</span>
            </div>
            <p className="mt-1.5 text-xl font-bold text-white">
              {course.lessons.length}
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-gray-500">{t('quizzes')}</span>
            </div>
            <p className="mt-1.5 text-xl font-bold text-white">
              {course.quizzes.length}
            </p>
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">{t('lessons')}</h2>
          <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400">
            {course.lessons.length}
          </span>
        </div>

        {course.lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-16 text-center">
            <PlayCircle className="h-8 w-8 text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-300">
              {t('noLessonsInCourse')}
            </h3>
            <p className="mt-1.5 text-sm text-gray-500">
              {t('noLessonsInCourseDesc')}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('colLessonOrder')}
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('colLessonTitle')}
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('colLevel')}
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      YouTube
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('colStatus')}
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      In-Video Quiz
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      E-Book
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {course.lessons.map((lesson) => (
                    <tr
                      key={lesson.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="rounded-md bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-medium text-purple-400">
                          {lesson.lessonOrder}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-200">
                          {lesson.title}
                        </p>
                        {lesson.subtitle && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            {lesson.subtitle}
                          </p>
                        )}
                        {lesson.durationText && (
                          <p className="mt-0.5 text-[10px] text-gray-600">
                            {lesson.durationText}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          lesson.lessonLevel === 'ADVANCED'
                            ? 'bg-red-500/10 text-red-400'
                            : lesson.lessonLevel === 'INTERMEDIATE'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-green-500/10 text-green-400'
                        }`}>
                          {levelLabels[lesson.lessonLevel] ?? lesson.lessonLevel}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {lesson.youtubeUrl ? (
                          <Link
                            href={lesson.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
                          >
                            <Video className="h-3.5 w-3.5" />
                            {t('watchVideo')}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-600">-</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {lesson.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            <CheckCircle className="h-3 w-3" />
                            {t('enabled')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                            <XCircle className="h-3 w-3" />
                            {t('disabled')}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Link
                          href={`/${locale}/admin/courses/${id}/in-video-quiz/${lesson.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400 transition-colors hover:bg-yellow-500/20 hover:text-yellow-300"
                        >
                          💡 {(lesson as typeof lesson & { _count: { inVideoQuizzes: number } })._count.inVideoQuizzes} ข้อ
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Link
                          href={`/${locale}/admin/courses/${id}/ebook/${lesson.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/20 hover:text-blue-300"
                        >
                          📚 Edit E-Book
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-white/[0.06] px-5 py-3.5">
              <p className="text-sm text-gray-500">
                {t('totalLessonsInCourse', { count: course.lessons.length })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileQuestion className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">{t('quizzes')}</h2>
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
            {course.quizzes.length}
          </span>
        </div>

        {course.quizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-16 text-center">
            <FileQuestion className="h-8 w-8 text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-300">
              {t('noQuizzesInCourse')}
            </h3>
            <p className="mt-1.5 text-sm text-gray-500">
              {t('noQuizzesInCourseDesc')}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('colQuizTitle')}
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('colQuizPassingScore')}
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('colQuizQuestions')}
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('colQuizAttempts')}
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t('colStatus')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {course.quizzes.map((quiz) => (
                    <tr
                      key={quiz.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="text-sm font-medium text-gray-200">
                          {quiz.title}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="rounded-md bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-medium text-amber-400">
                          {quiz.passingScore}%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          <FileQuestion className="h-3.5 w-3.5 text-gray-500" />
                          {quiz._count.questions} {t('questionUnit')}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          <Users className="h-3.5 w-3.5 text-gray-500" />
                          {quiz._count.attempts.toLocaleString()} {t('attemptUnit')}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {quiz.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            <CheckCircle className="h-3 w-3" />
                            {t('enabled')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                            <XCircle className="h-3 w-3" />
                            {t('disabled')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-white/[0.06] px-5 py-3.5">
              <p className="text-sm text-gray-500">
                {t('totalQuizzesInCourse', { count: course.quizzes.length })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
