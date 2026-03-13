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
  Lightbulb,
  Target,
  Zap,
  Clock,
  BarChart2,
  Youtube,
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
  subtitle: string | null
  lessonOrder: number
  lessonLevel: string
  youtubeUrl: string | null
  videoTitle: string | null
  videoChannel: string | null
  durationText: string | null
  description: string | null
  summary: string | null
  learningOutcomes: string | null
  keyTakeaways: string | null
  coverImage: string | null
  resources: Resource[]
}

interface LearnClientProps {
  course: { slug: string; title: string }
  lessons: Lesson[]
  currentLessonId: string
  completedLessonIds: string[]
  quizId: string | null
}

const levelColors: Record<string, string> = {
  BEGINNER: 'bg-green-500/10 text-green-400 border-green-500/20',
  INTERMEDIATE: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  ADVANCED: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const levelLabels: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
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

  // Parse multi-line text into bullet points
  const parseLines = (text: string | null) => {
    if (!text) return []
    return text.split('\n').filter((line) => line.trim().length > 0)
  }

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
          {/* Lesson Header */}
          <div className="mb-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                {t('lessonPrefix', { order: currentLesson.lessonOrder })}
              </p>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${levelColors[currentLesson.lessonLevel] || levelColors.BEGINNER}`}>
                {levelLabels[currentLesson.lessonLevel] || currentLesson.lessonLevel}
              </span>
              {currentLesson.durationText && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {currentLesson.durationText}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {currentLesson.title}
            </h2>
            {currentLesson.subtitle && (
              <p className="mt-1 text-sm text-gray-400">{currentLesson.subtitle}</p>
            )}
          </div>

          {/* Video Player */}
          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={currentLesson.videoTitle || currentLesson.title}
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

          {/* Video Info */}
          {(currentLesson.videoTitle || currentLesson.videoChannel) && (
            <div className="mb-6 flex items-center gap-2 text-xs text-gray-500">
              <Youtube className="h-3.5 w-3.5 text-red-400" />
              {currentLesson.videoTitle && <span>{currentLesson.videoTitle}</span>}
              {currentLesson.videoChannel && (
                <>
                  <span className="text-gray-600">|</span>
                  <span>{currentLesson.videoChannel}</span>
                </>
              )}
            </div>
          )}

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

          {/* Summary */}
          {currentLesson.summary && (
            <div className="mb-6 rounded-xl border border-blue-500/10 bg-blue-500/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-400" />
                <h3 className="text-base font-semibold text-white">{t('summary')}</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-300">{currentLesson.summary}</p>
            </div>
          )}

          {/* Learning Outcomes */}
          {currentLesson.learningOutcomes && (
            <div className="mb-6 rounded-xl border border-purple-500/10 bg-purple-500/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-semibold text-white">{t('learningOutcomes')}</h3>
              </div>
              <ul className="space-y-2">
                {parseLines(currentLesson.learningOutcomes).map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" />
                    <span>{line.replace(/^[-•]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Takeaways */}
          {currentLesson.keyTakeaways && (
            <div className="mb-6 rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-semibold text-white">{t('keyTakeaways')}</h3>
              </div>
              <ul className="space-y-2">
                {parseLines(currentLesson.keyTakeaways).map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" />
                    <span>{line.replace(/^[-•]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                          {t('lessonPrefix', { order: lesson.lessonOrder })}
                        </p>
                        <span className={`rounded px-1.5 py-0 text-[9px] font-semibold ${levelColors[lesson.lessonLevel] || levelColors.BEGINNER}`}>
                          {levelLabels[lesson.lessonLevel]?.[0] || 'B'}
                        </span>
                      </div>
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
                      {lesson.durationText && (
                        <p className="mt-0.5 text-[10px] text-gray-600">{lesson.durationText}</p>
                      )}
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
