'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import {
  Home,
  BookOpen,
  Search,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Brain,
  CircuitBoard,
  ShieldCheck,
} from 'lucide-react'

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function NotFound() {
  const t = useTranslations('notFound')
  const tc = useTranslations('common')
  const tf = useTranslations('footer')
  const locale = useLocale()

  const quickLinks = [
    {
      href: `/${locale}`,
      icon: Home,
      label: tc('home'),
      desc: t('homeDesc'),
      color: 'from-blue-500 to-cyan-400',
      iconColor: 'text-blue-400',
    },
    {
      href: `/${locale}/courses`,
      icon: BookOpen,
      label: tc('courses'),
      desc: t('coursesDesc'),
      color: 'from-purple-500 to-pink-400',
      iconColor: 'text-purple-400',
    },
    {
      href: `/${locale}/dashboard`,
      icon: GraduationCap,
      label: t('dashboard'),
      desc: t('dashboardDesc'),
      color: 'from-emerald-500 to-teal-400',
      iconColor: 'text-emerald-400',
    },
    {
      href: `/${locale}/instructors`,
      icon: Sparkles,
      label: t('instructors'),
      desc: t('instructorsDesc'),
      color: 'from-orange-500 to-amber-400',
      iconColor: 'text-orange-400',
    },
  ]

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* ── Animated Background Orbs ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 animate-[float1_8s_ease-in-out_infinite] rounded-full bg-blue-600/[0.07] blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 animate-[float2_10s_ease-in-out_infinite] rounded-full bg-purple-600/[0.07] blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 animate-[float3_12s_ease-in-out_infinite] rounded-full bg-cyan-500/[0.05] blur-3xl" />
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        {/* Animated 404 + AI icon cluster */}
        <div className="relative mb-6">
          {/* Pulsing ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-44 w-44 animate-[pulse_3s_ease-in-out_infinite] rounded-full border border-blue-500/20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-56 w-56 animate-[pulse_4s_ease-in-out_infinite_0.5s] rounded-full border border-cyan-500/10" />
          </div>

          {/* Center icon */}
          <div className="relative flex h-36 w-36 items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-500/20 backdrop-blur-sm" />
            <div className="absolute inset-[1px] rounded-3xl border border-white/[0.08]" />
            <div className="relative flex flex-col items-center gap-1">
              <Brain className="h-12 w-12 text-blue-400 animate-[pulse_2s_ease-in-out_infinite]" />
              <span className="text-xs font-medium text-blue-300/60">AI</span>
            </div>
          </div>

          {/* Floating satellite icons */}
          <div className="absolute -right-4 -top-2 flex h-10 w-10 animate-[float1_6s_ease-in-out_infinite] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
            <CircuitBoard className="h-5 w-5 text-cyan-400/70" />
          </div>
          <div className="absolute -bottom-2 -left-4 flex h-10 w-10 animate-[float2_7s_ease-in-out_infinite] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
            <Search className="h-5 w-5 text-purple-400/70" />
          </div>
          <div className="absolute -right-6 bottom-4 flex h-8 w-8 animate-[float3_5s_ease-in-out_infinite] items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-400/70" />
          </div>
        </div>

        {/* 404 Number */}
        <h1 className="mb-3 bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-8xl font-black tracking-tighter text-transparent sm:text-9xl">
          404
        </h1>

        {/* Heading */}
        <h2 className="mb-2 text-xl font-semibold text-white sm:text-2xl">
          {t('title')}
        </h2>

        {/* Description */}
        <p className="mb-8 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base">
          {t('description')}
          <br />
          <span className="text-gray-500">
            {t('hint')}
          </span>
        </p>

        {/* Primary CTA */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-110"
          >
            <Home className="h-4 w-4" />
            {t('backHome')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-gray-200 backdrop-blur-sm transition-all hover:border-white/[0.15] hover:bg-white/[0.07]"
          >
            <BookOpen className="h-4 w-4 text-purple-400" />
            {t('exploreCourses')}
          </Link>
        </div>

        {/* Quick Links Grid */}
        <div className="w-full max-w-lg">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gray-500">
            {t('quickLinks')}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
                {/* Gradient hover glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 transition-opacity group-hover:opacity-[0.04]`}
                />

                <div className="relative">
                  <div className={`mb-2 ${link.iconColor}`}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {link.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {link.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-10 text-xs text-gray-600">
          {tf('copyright')}
        </p>
      </div>
    </div>
  )
}
