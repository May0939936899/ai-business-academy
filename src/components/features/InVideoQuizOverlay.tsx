'use client'

import { CheckCircle2 } from 'lucide-react'

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

interface InVideoQuizOverlayProps {
  quiz: InVideoQuiz
  selectedAnswer: string | null
  isAnswered: boolean
  onAnswer: (letter: string) => void
  onContinue: () => void
}

/**
 * Full-screen quiz overlay that appears when a quiz triggers during video playback.
 * Shows the question, 4 options, feedback, and a continue button.
 */
export default function InVideoQuizOverlay({
  quiz,
  selectedAnswer,
  isAnswered,
  onAnswer,
  onContinue,
}: InVideoQuizOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-fade-in rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-xl">
            💡
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">ทดสอบความเข้าใจ</h3>
            <p className="text-xs text-gray-500">ตอบคำถามก่อน แล้วดูวิดีโอต่อได้เลย</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {/* Question */}
          <p className="mb-5 text-sm font-semibold leading-relaxed text-gray-100">
            {quiz.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {(['A', 'B', 'C', 'D'] as const).map((letter) => {
              const optionKey = `option${letter}` as keyof InVideoQuiz
              const text = quiz[optionKey] as string
              const isSelected = selectedAnswer === letter
              const isCorrect = letter === quiz.correctAnswer
              const showResult = isAnswered

              let borderBg = 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07]'
              if (showResult && isCorrect)
                borderBg = 'border-green-500/50 bg-green-500/15'
              else if (showResult && isSelected && !isCorrect)
                borderBg = 'border-red-500/50 bg-red-500/15'

              let badgeCls = 'bg-white/[0.08] text-gray-300'
              if (showResult && isCorrect) badgeCls = 'bg-green-500 text-white'
              else if (showResult && isSelected && !isCorrect) badgeCls = 'bg-red-500 text-white'

              return (
                <button
                  key={letter}
                  disabled={isAnswered}
                  onClick={() => onAnswer(letter)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${borderBg} ${
                    isAnswered ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${badgeCls}`}
                  >
                    {letter}
                  </span>
                  <span className="text-sm leading-snug text-gray-200">{text}</span>
                </button>
              )
            })}
          </div>

          {/* Explanation (shown after answering) */}
          {isAnswered && quiz.explanation && (
            <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
              <p className="mb-1 text-xs font-semibold text-blue-400">💬 คำอธิบาย</p>
              <p className="text-sm leading-relaxed text-gray-300">{quiz.explanation}</p>
            </div>
          )}

          {/* Result label */}
          {isAnswered && (
            <div
              className={`mt-3 flex items-center gap-2 text-sm font-semibold ${
                selectedAnswer === quiz.correctAnswer
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {selectedAnswer === quiz.correctAnswer ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  ถูกต้อง! 🎉
                </>
              ) : (
                <>
                  <span>✗</span>
                  คำตอบที่ถูกต้องคือ ตัวเลือก {quiz.correctAnswer}
                </>
              )}
            </div>
          )}

          {/* Continue button */}
          {isAnswered && (
            <button
              onClick={onContinue}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-cyan-500 active:scale-[0.98]"
            >
              ▶ ดูวิดีโอต่อ
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
