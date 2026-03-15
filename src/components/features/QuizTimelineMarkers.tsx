'use client'

import { useState } from 'react'

interface QuizMarker {
  id: string
  triggerPercent: number
  question: string
}

interface QuizTimelineMarkersProps {
  quizzes: QuizMarker[]
  answeredIds: Set<string>
  currentPercent: number
}

/**
 * Visual timeline bar with ⭐ star markers at quiz trigger points.
 * Placed below the YouTube video to show where quizzes will appear.
 */
export default function QuizTimelineMarkers({
  quizzes,
  answeredIds,
  currentPercent,
}: QuizTimelineMarkersProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (quizzes.length === 0) return null

  return (
    <div className="relative mt-1 mb-2 px-1">
      {/* Label */}
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-[10px] text-yellow-500/70">⭐ Quiz Points</span>
        <span className="text-[10px] text-gray-600">
          ({quizzes.filter((q) => answeredIds.has(q.id)).length}/{quizzes.length} ตอบแล้ว)
        </span>
      </div>

      {/* Timeline Bar */}
      <div className="relative h-3 w-full rounded-full bg-white/[0.06] border border-white/[0.08]">
        {/* Progress fill */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30 transition-all duration-1000"
          style={{ width: `${Math.min(currentPercent, 100)}%` }}
        />

        {/* Star Markers */}
        {quizzes.map((quiz) => {
          const isAnswered = answeredIds.has(quiz.id)
          const isHovered = hoveredId === quiz.id
          const isPast = currentPercent >= quiz.triggerPercent

          return (
            <div
              key={quiz.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
              style={{ left: `${quiz.triggerPercent}%` }}
              onMouseEnter={() => setHoveredId(quiz.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Star icon */}
              <div
                className={`flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isHovered ? 'scale-150' : 'scale-100'
                }`}
                style={{ fontSize: '12px' }}
              >
                {isAnswered ? (
                  <span className="opacity-60">✅</span>
                ) : isPast ? (
                  <span className="opacity-50">⭐</span>
                ) : (
                  <span
                    className="drop-shadow-[0_0_4px_rgba(234,179,8,0.6)]"
                    style={{
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  >
                    ⭐
                  </span>
                )}
              </div>

              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#0f172a] px-3 py-1.5 shadow-xl">
                  <p className="text-[10px] font-semibold text-yellow-400">
                    Quiz @ {quiz.triggerPercent}%
                  </p>
                  <p className="max-w-[200px] truncate text-[10px] text-gray-400">
                    {quiz.question}
                  </p>
                  {isAnswered && (
                    <p className="text-[10px] text-green-400">✓ ตอบแล้ว</p>
                  )}
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0f172a]" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
