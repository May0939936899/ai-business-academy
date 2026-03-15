'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  Youtube,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import EbookSection from '@/components/features/EbookSection'
import EbookDownloadButton from '@/components/features/EbookDownloadButton'
import InVideoQuizOverlay from '@/components/features/InVideoQuizOverlay'
import QuizTimelineMarkers from '@/components/features/QuizTimelineMarkers'
import { getYouTubeEmbedUrl } from '@/lib/utils'

// ─── YouTube IFrame API Types ─────────────────────────────────────────────

interface YTPlayer {
  getCurrentTime: () => number
  getDuration: () => number
  pauseVideo: () => void
  playVideo: () => void
  destroy: () => void
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId?: string
          width?: number | string
          height?: number | string
          playerVars?: Record<string, number | string>
          events?: {
            onReady?: (e: { target: YTPlayer }) => void
            onStateChange?: (e: { data: number; target: YTPlayer }) => void
          }
        }
      ) => YTPlayer
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number }
    }
    onYouTubeIframeAPIReady: (() => void) | undefined
  }
}

// ─── In-Video Quiz Types ──────────────────────────────────────────────────

interface InVideoQuiz {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string | null
  triggerPercent: number
  sortOrder: number
}

// ─── Domain Types ─────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────

function extractYouTubeVideoId(url: string): string | null {
  // Reuse existing utility to get embed URL, then strip prefix
  const embedUrl = getYouTubeEmbedUrl(url)
  if (!embedUrl) return null
  return embedUrl.replace('https://www.youtube.com/embed/', '').split('?')[0] || null
}

function playDingSound() {
  try {
    type AudioCtxConstructor = typeof AudioContext
    const Ctx: AudioCtxConstructor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioCtxConstructor }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    // Two-tone "ding" — E5 → B5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime)
    osc.frequency.setValueAtTime(987.77, ctx.currentTime + 0.12)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 1.1)
  } catch {
    // Web Audio not supported — silently skip
  }
}

// ─── Component ────────────────────────────────────────────────────────────

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

  // ── Existing state ──────────────────────────────────────────────────────
  const [completedLessons, setCompletedLessons] = useState<string[]>(initialCompleted)
  const [marking, setMarking] = useState(false)

  // ── In-video quiz state ─────────────────────────────────────────────────
  const [inVideoQuizzes, setInVideoQuizzes] = useState<InVideoQuiz[]>([])
  const [activeQuiz, setActiveQuiz] = useState<InVideoQuiz | null>(null)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [videoPercent, setVideoPercent] = useState(0)

  // ── Refs (avoid stale closures inside polling interval) ─────────────────
  const playerRef = useRef<YTPlayer | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const quizzesRef = useRef<InVideoQuiz[]>([])
  const triggeredRef = useRef<Set<string>>(new Set())

  // ── Derived values ──────────────────────────────────────────────────────
  const currentLesson = lessons.find((l) => l.id === currentLessonId)
  const totalLessons = lessons.length
  const completedCount = completedLessons.length
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const videoId = currentLesson?.youtubeUrl
    ? extractYouTubeVideoId(currentLesson.youtubeUrl)
    : null

  // ── Polling helpers ─────────────────────────────────────────────────────
  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const startPolling = useCallback(() => {
    stopPolling()
    pollRef.current = setInterval(() => {
      if (!playerRef.current) return
      try {
        const currentTime = playerRef.current.getCurrentTime()
        const duration = playerRef.current.getDuration()
        if (!duration || duration < 1) return
        const percent = Math.floor((currentTime / duration) * 100)
        setVideoPercent(percent)

        // Log every 5 seconds to show polling is active
        if (percent % 5 === 0) {
          console.log(`[Quiz Poll] ${percent}% — ${quizzesRef.current.length} quizzes loaded, ${triggeredRef.current.size} triggered`)
        }

        for (const quiz of quizzesRef.current) {
          if (!triggeredRef.current.has(quiz.id) && percent >= quiz.triggerPercent) {
            console.log(`[Quiz] Triggering quiz at ${percent}% (target: ${quiz.triggerPercent}%)`, quiz.question)
            triggeredRef.current.add(quiz.id)
            playerRef.current.pauseVideo()
            stopPolling()
            playDingSound()
            setActiveQuiz(quiz)
            setSelectedAnswer(null)
            setIsAnswered(false)
            setShowQuizModal(true)
            break // only one quiz at a time
          }
        }
      } catch {
        // player not ready yet — ignore
      }
    }, 1000)
  }, [stopPolling])

  // ── Fetch quiz questions whenever lesson changes ─────────────────────────
  useEffect(() => {
    // Reset quiz state
    setInVideoQuizzes([])
    setActiveQuiz(null)
    setShowQuizModal(false)
    setSelectedAnswer(null)
    setIsAnswered(false)
    quizzesRef.current = []
    triggeredRef.current = new Set()

    fetch(`/api/lessons/${currentLessonId}/in-video-quiz`)
      .then((r) => {
        console.log('[Quiz] Fetch status:', r.status)
        return r.json()
      })
      .then((data) => {
        console.log('[Quiz] Loaded questions:', data.questions?.length ?? 0, data)
        if (Array.isArray(data.questions)) {
          setInVideoQuizzes(data.questions)
          quizzesRef.current = data.questions
        }
      })
      .catch((err) => {
        console.error('[Quiz] Fetch error:', err)
      })
  }, [currentLessonId])

  // ── YouTube IFrame Player setup ─────────────────────────────────────────
  useEffect(() => {
    if (!videoId) return

    let destroyed = false
    let retryTimer: ReturnType<typeof setTimeout> | null = null

    const createPlayer = () => {
      if (destroyed) return
      const elId = `yt-player-${currentLessonId}`
      const container = document.getElementById(elId)
      if (!container) {
        // DOM not ready yet — retry after a short delay (up to a few attempts)
        console.warn('[YT] container not found, retrying...', elId)
        retryTimer = setTimeout(createPlayer, 200)
        return
      }

      // Destroy existing player before creating a new one
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { /* ignore */ }
        playerRef.current = null
      }

      console.log('[YT] Creating player for videoId:', videoId)
      playerRef.current = new window.YT.Player(elId, {
        width: '100%',
        height: '100%',
        videoId,
        playerVars: {
          autoplay: 0,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            console.log('[YT] Player ready — quiz polling will start on PLAY')
          },
          onStateChange: (e) => {
            console.log('[YT] State change:', e.data, '(1=PLAYING)')
            if (e.data === 1) startPolling() // PLAYING
            else stopPolling()
          },
        },
      })
    }

    const waitForYTAndCreate = () => {
      if (destroyed) return
      if (window.YT?.Player) {
        createPlayer()
      } else {
        // API not loaded yet — wait and retry
        retryTimer = setTimeout(waitForYTAndCreate, 300)
      }
    }

    // Inject YouTube IFrame API script only once
    if (!document.getElementById('yt-iframe-api')) {
      const s = document.createElement('script')
      s.id = 'yt-iframe-api'
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    }

    // Defer to next tick so React has finished painting the DOM, then wait for YT API
    const initTimer = setTimeout(waitForYTAndCreate, 100)

    return () => {
      destroyed = true
      clearTimeout(initTimer)
      if (retryTimer) clearTimeout(retryTimer)
      stopPolling()
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { /* ignore */ }
        playerRef.current = null
      }
    }
  }, [currentLessonId, videoId, startPolling, stopPolling])

  // ── Mark lesson complete ────────────────────────────────────────────────
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

  // ── Quiz interactions ───────────────────────────────────────────────────
  const handleAnswer = (letter: string) => {
    if (isAnswered) return
    setSelectedAnswer(letter)
    setIsAnswered(true)
  }

  const handleContinueVideo = () => {
    setShowQuizModal(false)
    setActiveQuiz(null)
    if (playerRef.current) {
      try { playerRef.current.playVideo() } catch { /* ignore */ }
    }
    startPolling()
  }

  // ── Parse multi-line text ───────────────────────────────────────────────
  const parseLines = (text: string | null) => {
    if (!text) return []
    return text.split('\n').filter((line) => line.trim().length > 0)
  }

  if (!currentLesson) return null

  // ── Render ──────────────────────────────────────────────────────────────
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
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${levelColors[currentLesson.lessonLevel] || levelColors.BEGINNER}`}
              >
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

          {/* Video Player (YouTube IFrame API) */}
          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]">
            {videoId ? (
              <>
                {/*
                  YouTube API *replaces* the div with an <iframe> — Tailwind classes
                  don't transfer. Force the generated iframe to fill 100% via a scoped
                  <style> tag that targets the same element ID.
                */}
                <style>{`
                  #yt-player-${currentLessonId} {
                    position: absolute !important;
                    top: 0 !important; left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                  }
                `}</style>
                <div id={`yt-player-${currentLessonId}`} />
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                {t('noVideo')}
              </div>
            )}
          </div>

          {/* Timeline Star Markers — shows ⭐ at quiz trigger points */}
          {inVideoQuizzes.length > 0 && (
            <QuizTimelineMarkers
              quizzes={inVideoQuizzes}
              answeredIds={triggeredRef.current}
              currentPercent={videoPercent}
            />
          )}

          {/* In-video quiz badge */}
          {inVideoQuizzes.length > 0 && (
            <div className="mb-3 flex items-center gap-2 text-xs text-yellow-400/80">
              <span>💡</span>
              <span>
                บทเรียนนี้มีแบบทดสอบระหว่างวิดีโอ {inVideoQuizzes.length} ข้อ
                — วิดีโอจะหยุดชั่วคราวเพื่อให้ตอบคำถาม
              </span>
            </div>
          )}

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

          {/* 📚 E-Book ประกอบบทเรียน */}
          <EbookSection
            lessonId={currentLessonId}
            lessonTitle={currentLesson.title}
            lessonOrder={currentLesson.lessonOrder}
          />

          {/* Resources */}
          {currentLesson.resources.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">{t('resources')}</h3>
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
                        <p className="text-sm font-medium text-gray-200">{resource.fileName}</p>
                        <p className="text-xs uppercase text-gray-500">{resource.fileType}</p>
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
                        ? 'border-l-2 border-blue-500 bg-blue-500/10'
                        : 'border-l-2 border-transparent hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : isActive ? (
                        <Play className="h-5 w-5 text-blue-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                          {t('lessonPrefix', { order: lesson.lessonOrder })}
                        </p>
                        <span
                          className={`rounded px-1.5 py-0 text-[9px] font-semibold ${levelColors[lesson.lessonLevel] || levelColors.BEGINNER}`}
                        >
                          {levelLabels[lesson.lessonLevel]?.[0] || 'B'}
                        </span>
                      </div>
                      <p
                        className={`text-sm font-medium leading-snug line-clamp-2 ${
                          isActive ? 'text-white' : isCompleted ? 'text-gray-400' : 'text-gray-300'
                        }`}
                      >
                        {lesson.title}
                      </p>
                      {lesson.durationText && (
                        <p className="mt-0.5 text-[10px] text-gray-500">{lesson.durationText}</p>
                      )}
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4 flex-shrink-0 text-blue-400" />}
                  </button>
                )
              })}
            </div>

            {/* E-Book Quick Download (sidebar) */}
            <div className="border-t border-white/[0.06] p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm">📚</span>
                <p className="text-xs font-semibold text-white">E-Book</p>
              </div>
              <EbookDownloadButton lessonId={currentLessonId} />
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

      {/* ── In-Video Quiz Modal (extracted component) ─────────────────────── */}
      {showQuizModal && activeQuiz && (
        <InVideoQuizOverlay
          quiz={activeQuiz}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          onAnswer={handleAnswer}
          onContinue={handleContinueVideo}
        />
      )}
    </div>
  )
}
