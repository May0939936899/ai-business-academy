'use client'

import Link from 'next/link'
import {
  Clock,
  BarChart2,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'

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

const levelColors: Record<string, string> = {
  BEGINNER: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  INTERMEDIATE: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  ADVANCED: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
}

const categoryGradients: Record<string, string> = {
  'AI Automation': 'from-blue-600 via-blue-500 to-cyan-400',
  'AI & Automation': 'from-blue-600 via-blue-500 to-cyan-400',
  'AI Marketing': 'from-purple-600 via-fuchsia-500 to-pink-400',
  'AI HR': 'from-green-600 via-emerald-500 to-teal-400',
  'AI Productivity': 'from-orange-600 via-amber-500 to-yellow-400',
  'AI Communication': 'from-rose-600 via-pink-500 to-orange-400',
  'AI Management': 'from-amber-600 via-orange-500 to-yellow-400',
  'AI Data': 'from-cyan-600 via-sky-500 to-blue-400',
  'AI Organization': 'from-indigo-600 via-blue-500 to-sky-400',
  'AI Strategy': 'from-violet-600 via-purple-500 to-indigo-400',
  'AI Fundamentals': 'from-sky-600 via-blue-500 to-indigo-400',
  'AI Leadership': 'from-red-600 via-rose-500 to-pink-400',
  'AI Finance': 'from-emerald-600 via-green-500 to-teal-400',
  'AI Entrepreneurship': 'from-fuchsia-600 via-pink-500 to-rose-400',
  default: 'from-blue-600 via-indigo-500 to-purple-400',
}

/* Short label for the pill — strip "AI" prefix if title already contains it */
function shortCategory(cat: string): string {
  return cat.replace(/^AI\s*[&]?\s*/i, '').trim() || cat
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
  const t = useTranslations('coursesPage')
  const tc = useTranslations('common')
  const locale = useLocale()
  const gradientColor = categoryGradients[category] || categoryGradients.default
  const snippet = shortDescription || description

  const levelLabels: Record<string, string> = {
    BEGINNER: t('filterBeginner'),
    INTERMEDIATE: t('filterIntermediate'),
    ADVANCED: t('filterAdvanced'),
  }

  return (
    <Link href={`/${locale}/courses/${slug}`} className="group block h-full">
      <div
        className={cn(
          'relative flex h-full flex-col overflow-hidden rounded-2xl',
          'border border-white/[0.06] bg-[#0c1425]',
          'transition-all duration-300',
          'hover:border-white/[0.15] hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1'
        )}
      >
        {/* ── Gradient Header — title only shows here ── */}
        <div className="relative h-36 shrink-0 overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={cn('absolute inset-0 bg-gradient-to-br', gradientColor)}>
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.07]" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }} />
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/[0.1]" />
              <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/[0.07]" />
            </div>
          )}

          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1425] via-black/30 to-black/10" />

          {/* Top row: category pill + free badge */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="rounded-full bg-white/[0.15] px-2.5 py-0.5 text-[10px] font-semibold text-white/80 backdrop-blur-md">
              {shortCategory(category)}
            </span>

            {isFree && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-emerald-500/25">
                <Sparkles className="h-2.5 w-2.5" />
                {tc('free')}
              </span>
            )}
          </div>

          {/* Title — SINGLE source of truth, no duplication */}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
            <h3 className="text-[17px] font-bold leading-snug text-white drop-shadow-lg line-clamp-2 group-hover:text-white/90">
              {title}
            </h3>
          </div>
        </div>

        {/* ── Content — description only, NO title repeat ── */}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          <p className="mb-auto line-clamp-2 text-[13px] leading-relaxed text-gray-400/90">
            {snippet}
          </p>

          {/* Meta strip */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-[3px] font-medium',
                levelColors[level] || levelColors.BEGINNER
              )}
            >
              <BarChart2 className="mr-1 h-2.5 w-2.5" />
              {levelLabels[level] || level}
            </span>

            <span className="flex items-center gap-1 text-gray-500">
              <Clock className="h-3 w-3" />
              {duration || '-'}
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <BookOpen className="h-3 w-3" />
              {lessonCount} {t('lessons')}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-3 border-t border-white/[0.05] pt-3">
            <span
              className={cn(
                'inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5',
                'bg-white/[0.06] text-[13px] font-semibold text-gray-300',
                'transition-all duration-200',
                'group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/20'
              )}
            >
              {tc('learnMore')}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
