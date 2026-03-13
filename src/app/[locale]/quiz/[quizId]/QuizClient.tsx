'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  HelpCircle,
  Loader2,
  Clock,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

type AnswerKey = 'A' | 'B' | 'C' | 'D'

interface QuizQuestion {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  sortOrder: number
}

interface QuizResult {
  questionId: string
  userAnswer: string | null
  correctAnswer: string
  isCorrect: boolean
  explanation: string | null
}

interface QuizData {
  id: string
  title: string
  passingScore: number
  questions: QuizQuestion[]
  course: {
    id: string
    title: string
    slug: string
  }
}

interface QuizClientProps {
  quiz: QuizData
  existingCertificateCode: string | null
}

export default function QuizClient({ quiz, existingCertificateCode }: QuizClientProps) {
  const locale = useLocale()
  const t = useTranslations('quiz')

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<QuizResult[]>([])
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [certificateCode, setCertificateCode] = useState<string | null>(existingCertificateCode)
  const [error, setError] = useState<string | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const totalQuestions = quiz.questions.length
  const currentQuestion = quiz.questions[currentIndex]
  const answeredCount = Object.keys(answers).length

  const handleSelectAnswer = (questionId: string, answer: AnswerKey) => {
    if (submitted) return
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/quizzes/${quiz.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      const json = await res.json()

      if (!json.success) {
        setError(json.error || t('error'))
        setSubmitting(false)
        return
      }

      const data = json.data
      setScore(data.score)
      setPassed(data.passed)
      setResults(data.results)
      if (data.certificate?.certificateCode) {
        setCertificateCode(data.certificate.certificateCode)
      }
      setFinalTime(elapsedSeconds)
      if (timerRef.current) clearInterval(timerRef.current)
      setSubmitted(true)
    } catch {
      setError(t('submitError'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
    setResults([])
    setScore(0)
    setPassed(false)
    setError(null)
    setCurrentIndex(0)
    setElapsedSeconds(0)
    setFinalTime(0)
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
  }

  const optionLabels: AnswerKey[] = ['A', 'B', 'C', 'D']
  const optionFields: Record<AnswerKey, keyof QuizQuestion> = {
    A: 'optionA',
    B: 'optionB',
    C: 'optionC',
    D: 'optionD',
  }

  // Results view
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#030712]">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <Card hover={false} className="p-8 text-center">
            <div
              className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
                passed ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}
            >
              {passed ? (
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              ) : (
                <XCircle className="h-10 w-10 text-red-400" />
              )}
            </div>

            <h1 className="mb-2 text-2xl font-bold text-white">
              {passed ? t('congratulations') : t('notPassed')}
            </h1>
            <p className="mb-6 text-gray-400">{quiz.title}</p>

            <div className="mb-8 flex items-center justify-center gap-8">
              <div>
                <p className="text-4xl font-bold text-white">{score}%</p>
                <p className="text-sm text-gray-500">{t('yourScore')}</p>
              </div>
              <div className="h-12 w-px bg-white/[0.1]" />
              <div>
                <p className="text-4xl font-bold text-gray-400">{quiz.passingScore}%</p>
                <p className="text-sm text-gray-500">{t('passingScore')}</p>
              </div>
              <div className="h-12 w-px bg-white/[0.1]" />
              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <p className="text-4xl font-bold text-cyan-400">{formatTime(finalTime)}</p>
                </div>
                <p className="text-sm text-gray-500">{t('timeUsed')}</p>
              </div>
            </div>

            {/* Per-question results */}
            <div className="mb-8 space-y-3 text-left">
              {results.map((r, i) => (
                <div
                  key={r.questionId}
                  className={`rounded-xl border p-4 ${
                    r.isCorrect
                      ? 'border-green-500/20 bg-green-500/5'
                      : 'border-red-500/20 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {r.isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {t('questionPrefix')} {i + 1}: {quiz.questions[i]?.question}
                      </p>
                      {!r.isCorrect && r.explanation && (
                        <p className="mt-1 text-xs text-gray-400">{r.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {passed && certificateCode ? (
                <Link href={`/${locale}/certificate/${certificateCode}`}>
                  <Button variant="primary" size="lg">
                    <Award className="h-5 w-5" />
                    {t('viewCertificate')}
                  </Button>
                </Link>
              ) : !passed ? (
                <Button variant="primary" size="lg" onClick={handleRetry}>
                  <RotateCcw className="h-5 w-5" />
                  {t('retryQuiz')}
                </Button>
              ) : null}
              <Link href={`/${locale}/courses/${quiz.course.slug}`}>
                <Button variant="secondary" size="lg">
                  {t('backToCourse')}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Quiz view
  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/courses/${quiz.course.slug}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToCourse')}
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
              <p className="mt-1 text-sm text-gray-400">{quiz.course.title}</p>
            </div>
            {/* Animated Clock Timer */}
            <div className="flex items-center gap-2.5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-2.5 shadow-lg shadow-cyan-500/5">
              <div className="animate-pulse-bounce">
                <div className="animate-clock-tick">
                  <Clock className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]" />
                </div>
              </div>
              <span className="font-mono text-lg font-bold tabular-nums tracking-wider text-cyan-300">
                {formatTime(elapsedSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">
            {t('questionOf', { current: currentIndex + 1, total: totalQuestions })}
          </span>
          <span className="text-sm text-gray-500">
            {t('answered', { done: answeredCount, total: totalQuestions })}
          </span>
        </div>
        <div className="mb-8 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Question */}
        <Card hover={false} className="mb-6 p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <HelpCircle className="h-4 w-4 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold leading-relaxed text-white">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {optionLabels.map((label) => {
              const fieldKey = optionFields[label]
              const optionText = currentQuestion[fieldKey] as string
              const isSelected = answers[currentQuestion.id] === label

              return (
                <button
                  key={label}
                  onClick={() => handleSelectAnswer(currentQuestion.id, label)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500/50 bg-blue-500/10 ring-1 ring-blue-500/30'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-white/[0.06] text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                  <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {optionText}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
            <ArrowLeft className="h-4 w-4" />
            {t('previous')}
          </Button>

          {currentIndex === totalQuestions - 1 ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={answeredCount < totalQuestions || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                <>
                  {t('submitAnswers')}
                  <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              {t('next')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Question indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {quiz.questions.map((q, i) => {
            const isAnswered = answers[q.id] !== undefined
            const isCurrent = i === currentIndex
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`h-3 w-3 rounded-full transition-all ${
                  isCurrent
                    ? 'scale-125 bg-blue-500'
                    : isAnswered
                    ? 'bg-blue-500/40'
                    : 'bg-white/[0.1]'
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
