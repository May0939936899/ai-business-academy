import Link from 'next/link'
import {
  Clock,
  BarChart2,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CourseCardProps {
  title: string
  slug: string
  category: string
  level: string
  duration?: string | null
  shortDescription?: string | null
  description?: string | null
  isFree?: boolean
  thumbnail?: string | null
  lessonCount?: number
}

const levelLabels: Record<string, string> = {
  BEGINNER: 'เริ่มต้น',
  INTERMEDIATE: 'ปานกลาง',
  ADVANCED: 'ขั้นสูง',
  'เริ่มต้น': 'เริ่มต้น',
  'ปานกลาง': 'ปานกลาง',
  'ขั้นสูง': 'ขั้นสูง',
}

const levelColors: Record<string, string> = {
  BEGINNER: 'bg-green-500/20 text-green-400 border-green-500/30',
  INTERMEDIATE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ADVANCED: 'bg-red-500/20 text-red-400 border-red-500/30',
  'เริ่มต้น': 'bg-green-500/20 text-green-400 border-green-500/30',
  'ปานกลาง': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'ขั้นสูง': 'bg-red-500/20 text-red-400 border-red-500/30',
}

const categoryGradients: Record<string, string> = {
  'AI Automation': 'from-blue-500 to-cyan-400',
  'AI Marketing': 'from-purple-500 to-pink-400',
  'AI HR': 'from-green-500 to-emerald-400',
  'AI Productivity': 'from-orange-500 to-yellow-400',
  default: 'from-blue-500 to-purple-500',
}

export default function CourseCard({
  title,
  slug,
  category,
  level,
  duration,
  shortDescription,
  description,
  isFree = true,
  thumbnail,
  lessonCount = 0,
}: CourseCardProps) {
  const gradientColor = categoryGradients[category] || categoryGradients.default
  const snippet = shortDescription || description

  return (
    <Link href={`/courses/${slug}`} className="group block">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl',
          'border border-white/[0.06] bg-[#0f172a]/60 backdrop-blur-sm',
          'transition-all duration-300',
          'hover:border-white/[0.12] hover:bg-[#0f172a]/80',
          'hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1'
        )}
      >
        {/* ── Gradient Header ── */}
        <div className="relative h-44 overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br',
                gradientColor
              )}
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/10" />
              <div className="absolute bottom-8 right-12 h-16 w-16 rounded-full bg-white/10" />
            </div>
          )}

          {thumbnail && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
          )}

          {/* Category badge */}
          <div className="absolute left-3 top-3">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1',
                'bg-black/50 text-xs font-semibold text-white backdrop-blur-sm'
              )}
            >
              {category}
            </span>
          </div>

          {/* Free badge */}
          {isFree && (
            <div className="absolute right-3 top-3">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1',
                  'bg-green-500/90 text-xs font-bold text-white shadow-lg'
                )}
              >
                <Sparkles className="h-3 w-3" />
                เรียนฟรี
              </span>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="p-5">
          <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-blue-300">
            {title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-400">
            {snippet}
          </p>

          {/* Level indicator */}
          <div className="mb-4">
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                levelColors[level] || levelColors.BEGINNER
              )}
            >
              <BarChart2 className="mr-1 h-3 w-3" />
              {levelLabels[level] || level}
            </span>
          </div>

          {/* Meta info */}
          <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
            {duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {duration}
              </span>
            )}
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {lessonCount} บทเรียน
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-end border-t border-white/[0.06] pt-4">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-4 py-2',
                'bg-gradient-to-r from-blue-600 to-cyan-500',
                'text-sm font-semibold text-white shadow-lg shadow-blue-500/25',
                'transition-all duration-200',
                'group-hover:shadow-blue-500/40 group-hover:brightness-110'
              )}
            >
              เรียนเลย
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
