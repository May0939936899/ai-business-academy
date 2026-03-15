'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { BookOpen, GraduationCap, Trophy, ChevronRight, Clock, Users, CheckCircle2 } from 'lucide-react'

interface CourseItem {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  category: string
  level: string
  duration: string | null
  lessonCount: number
  enrollmentCount: number
  userProgress: { status: string; percent: number } | null
}

interface PathGroup {
  group: string
  meta: { label: string; labelTh: string; description: string; color: string; icon: string }
  courses: CourseItem[]
}

interface Props {
  groups: PathGroup[]
  totalCourses: number
  totalLessons: number
  userCompletedCourses: number
  isLoggedIn: boolean
}

export default function LearningPathClient({
  groups,
  totalCourses,
  totalLessons,
  userCompletedCourses,
  isLoggedIn,
}: Props) {
  const locale = useLocale()

  const masterPercent = totalCourses > 0 ? Math.round((userCompletedCourses / totalCourses) * 100) : 0

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06] py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D47A1]/20 via-transparent to-[#E91E63]/10" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400 mb-6">
            <GraduationCap className="h-4 w-4" />
            Learning Path
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
            เส้นทางการเรียนรู้{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI for Business
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            {totalCourses} คอร์ส · {totalLessons} บทเรียน · เรียนจบทั้งหมดรับ AI Business Master Certificate
          </p>

          {/* Stats */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: BookOpen, label: 'คอร์สทั้งหมด', value: totalCourses, color: '#2196F3' },
              { icon: GraduationCap, label: 'บทเรียน', value: totalLessons, color: '#4CAF50' },
              { icon: Trophy, label: 'เรียนจบแล้ว', value: userCompletedCourses, color: '#FF9800' },
              { icon: CheckCircle2, label: 'ความก้าวหน้า', value: `${masterPercent}%`, color: '#E91E63' },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center backdrop-blur"
              >
                <s.icon className="mx-auto h-5 w-5 mb-2" style={{ color: s.color }} />
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Path Groups */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="space-y-16">
          {groups.map((g, gi) => (
            <div key={g.group}>
              {/* Group Header */}
              <div className="flex items-center gap-4 mb-8">
                {/* Level Connector */}
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg"
                    style={{ backgroundColor: g.meta.color + '20', boxShadow: `0 0 24px ${g.meta.color}30` }}
                  >
                    {g.meta.icon}
                  </div>
                  {gi < groups.length - 1 && (
                    <div className="mt-2 h-8 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider"
                      style={{ backgroundColor: g.meta.color + '20', color: g.meta.color }}
                    >
                      Level {gi + 1}
                    </span>
                    <h2 className="text-xl font-bold text-white sm:text-2xl">
                      {g.meta.labelTh}
                      <span className="ml-2 text-sm font-normal text-gray-500">({g.meta.label})</span>
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">{g.meta.description}</p>
                </div>
              </div>

              {/* Course Cards */}
              <div className="ml-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.courses.map((c) => {
                  const isCompleted = c.userProgress?.status === 'COMPLETED'
                  const inProgress = c.userProgress && !isCompleted
                  const percent = c.userProgress?.percent ?? 0

                  return (
                    <Link
                      key={c.id}
                      href={`/${locale}/courses/${c.slug}`}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
                    >
                      {/* Completed badge */}
                      {isCompleted && (
                        <div className="absolute right-3 top-3">
                          <CheckCircle2 className="h-6 w-6 text-green-400" />
                        </div>
                      )}

                      {/* Category + Level */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                          style={{ backgroundColor: g.meta.color + '15', color: g.meta.color }}
                        >
                          {c.level}
                        </span>
                        <span className="text-[10px] text-gray-500">{c.category}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors">
                        {c.title}
                      </h3>

                      {/* Description */}
                      {c.shortDescription && (
                        <p className="mt-2 text-xs text-gray-500 line-clamp-2">{c.shortDescription}</p>
                      )}

                      {/* Meta */}
                      <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> {c.lessonCount} บท
                        </span>
                        {c.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {c.duration}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {c.enrollmentCount}
                        </span>
                      </div>

                      {/* Progress bar */}
                      {inProgress && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-cyan-400">กำลังเรียน</span>
                            <span className="text-gray-500">{Math.round(percent)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Arrow */}
                      <ChevronRight className="absolute bottom-5 right-4 h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Tiers */}
        <div className="mt-20 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-8">
          <h2 className="text-center text-2xl font-bold text-white mb-2">🏆 ระดับ Certificate</h2>
          <p className="text-center text-sm text-gray-400 mb-8">เรียนจบตามเงื่อนไข รับใบประกาศนียบัตรแต่ละระดับ</p>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Course Certificate',
                desc: 'จบ 1 คอร์ส + ผ่าน Quiz 70%',
                icon: '📜',
                color: '#4FC3F7',
              },
              {
                title: 'Professional Certificate',
                desc: 'จบคอร์สทั้ง Level ใดก็ได้',
                icon: '🎖️',
                color: '#FF9800',
              },
              {
                title: 'AI Business Master',
                desc: 'จบทุกคอร์ส ทุก Level',
                icon: '👑',
                color: '#E91E63',
              },
            ].map((cert, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
              >
                <div className="text-4xl mb-3">{cert.icon}</div>
                <h3 className="font-bold text-white" style={{ color: cert.color }}>
                  {cert.title}
                </h3>
                <p className="mt-2 text-xs text-gray-400">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
