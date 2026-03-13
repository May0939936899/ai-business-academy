'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  ChevronRight,
  BookOpen,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { getYouTubeEmbedUrl } from '@/lib/utils'

interface Resource {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
}

interface Lesson {
  id: string
  title: string
  lessonOrder: number
  youtubeUrl: string | null
  description: string | null
  resources: Resource[]
}

interface LearnClientProps {
  course: { slug: string; title: string }
  lessons: Lesson[]
  currentLessonId: string
  completedLessonIds: string[]
  quizId: string | null
}

export default function LearnClient({
  course,
  lessons,
  currentLessonId,
  completedLessonIds: initialCompleted,
  quizId,
}: LearnClientProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('learn')
  const [completedLessons, setCompletedLessons] = useState<string[]>(initialCompleted)
  const [marking, setMarking] = useState(false)

  const currentLesson = lessons.find((l) => l.id === currentLessonId)
  const totalLessons = lessons.length
  const completedCount = completedLessons.length
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const handleMarkComplete = async () => {
    if (completedLessons.includes(currentLessonId) || marking) return
    setMarking(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: currentLessonId }),
      })
      if (res.ok) {
        setCompletedLessons([...completedLessons, currentLessonId])
      }
    } catch {
      // ignore
    } finally {
      setMarking(false)
    }
  }

  const navigateToLesson = (lessonId: string) => {
    router.push(`/${locale}/learn/${course.slug}/${lessonId}`)
  }

  if (!currentLesson) return null

  const embedUrl = currentLesson.youtubeUrl
    ? getYouTubeEmbedUrl(currentLesson.youtubeUrl)
    : null

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Top Progress Bar */}
      <div className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a1628]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/courses/${course.slug}`}
              className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t('backToCourse')}</span>
            </Link>
            <div className="hidden h-4 w-px bg-white/[0.1] sm:block" />
            <h1 className="hidden text-sm font-medium text-gray-200 sm:block">
              {course.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {completedCount}/{totalLessons} {t('lessons')}
            </span>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-blue-400">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto flex max-w-screen-2xl flex-col lg:flex-row">
        {/* Left: Video + Content */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="mb-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
              {t('lessonPrefix')} {currentLesson.lessonOrder}
            </p>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {currentLesson.title}
            </h2>
          </div>

          {/* Video Player */}
          <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={currentLesson.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                {t('noVideo')}
              </div>
            )}
          </div>

          {/* Mark Complete */}
          <div className="mb-8">
            {completedLessons.includes(currentLessonId) ? (
              <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-3 text-sm font-medium text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                {t('lessonCompleted')}
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleMarkComplete}
                disabled={marking}
              >
                <CheckCircle2 className="h-5 w-5" />
                {marking ? t('marking') : t('markComplete')}
              </Button>
            )}
          </div>

          {/* Description */}
          {currentLesson.description && (
            <div className="mb-8">
              <h3 className="mb-3 text-lg font-semibold text-white">{t('lessonDescription')}</h3>
              <p className="leading-relaxed text-gray-400">{currentLesson.description}</p>
            </div>
          )}

          {/* Resources */}
          {currentLesson.resources.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {t('resources')}
              </h3>
              <div className="space-y-2">
                {currentLesson.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0f172a]/60 p-4 transition-colors hover:border-white/[0.12]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <FileText className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {resource.fileName}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">
                          {resource.fileType}
                        </p>
                      </div>
                    </div>
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-blue-400 transition-colors hover:text-blue-300"
                    >
                      <Download className="h-4 w-4" />
                      {t('download')}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Lesson Sidebar */}
        <div className="w-full border-t border-white/[0.06] lg:w-96 lg:border-l lg:border-t-0">
          <div className="sticky top-14 max-h-[calc(100vh-56px)] overflow-y-auto">
            <div className="border-b border-white/[0.06] p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">{t('lessonContent')}</h3>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {completedCount} / {totalLessons} {t('lessons')}
              </p>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {lessons.map((lesson) => {
                const isActive = lesson.id === currentLessonId
                const isCompleted = completedLessons.includes(lesson.id)

                return (
                  <button
                    key={lesson.id}
                    onClick={() => navigateToLesson(lesson.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                      isActive
                        ? 'bg-blue-500/10 border-l-2 border-blue-500'
                        : 'hover:bg-white/[0.03] border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : isActive ? (
                        <Play className="h-5 w-5 text-blue-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                        {t('lessonPrefix')} {lesson.lessonOrder}
                      </p>
                      <p
                        className={`text-sm font-medium leading-snug ${
                          isActive
                            ? 'text-white'
                            : isCompleted
                            ? 'text-gray-400'
                            : 'text-gray-300'
                        }`}
                      >
                        {lesson.title}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-blue-400" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Quiz Link */}
            {completedCount === totalLessons && quizId && (
              <div className="p-4">
                <Link href={`/${locale}/quiz/${quizId}`}>
                  <Button variant="primary" size="md" className="w-full">
                    {t('takeQuiz')}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
