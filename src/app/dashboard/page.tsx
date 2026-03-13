import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Award,
  ArrowRight,
  Clock,
  BarChart2,
  Sparkles,
  GraduationCap,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { cn, formatDate } from '@/lib/utils'

/* ── colour maps ──────────────────────────────────────────────────────── */

const categoryColors: Record<string, string> = {
  'AI Automation': 'text-blue-400',
  'AI Marketing': 'text-purple-400',
  'AI HR': 'text-green-400',
  'AI Productivity': 'text-orange-400',
}

const progressBarColors: Record<string, string> = {
  'AI Automation': 'from-blue-500 to-cyan-400',
  'AI Marketing': 'from-purple-500 to-pink-400',
  'AI HR': 'from-green-500 to-emerald-400',
  'AI Productivity': 'from-orange-500 to-yellow-400',
}

const categoryBadgeBg: Record<string, string> = {
  'AI Automation': 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
  'AI Marketing': 'bg-purple-500/10 text-purple-400 ring-purple-500/20',
  'AI HR': 'bg-green-500/10 text-green-400 ring-green-500/20',
  'AI Productivity': 'bg-orange-500/10 text-orange-400 ring-orange-500/20',
}

/* ── greeting helper ──────────────────────────────────────────────────── */

function getGreeting(): { greeting: string; emoji: string; message: string } {
  const hour = new Date().getHours()
  if (hour < 12)
    return {
      greeting: 'สวัสดีตอนเช้า',
      emoji: '',
      message: 'เริ่มต้นวันใหม่กับการเรียนรู้ AI ที่จะพัฒนาศักยภาพของคุณ',
    }
  if (hour < 17)
    return {
      greeting: 'สวัสดีตอนบ่าย',
      emoji: '',
      message: 'ช่วงบ่ายเหมาะสำหรับเรียนรู้ทักษะใหม่ ๆ มาเริ่มกันเลย!',
    }
  return {
    greeting: 'สวัสดีตอนเย็น',
    emoji: '',
    message: 'ช่วงเย็นเป็นเวลาเหมาะสำหรับทบทวนและเรียนรู้เพิ่มเติม',
  }
}

/* ── page ──────────────────────────────────────────────────────────────── */

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { greeting, message } = getGreeting()

  // Fetch all data in parallel
  const [enrollments, certificates, recommendedCourses] = await Promise.all([
    db.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            thumbnail: true,
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    }),
    db.certificate.findMany({
      where: { userId: user.id },
      include: {
        course: { select: { title: true, slug: true, category: true } },
      },
      orderBy: { issuedAt: 'desc' },
    }),
    db.course.findMany({
      where: {
        status: 'PUBLISHED',
        NOT: { enrollments: { some: { userId: user.id } } },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        thumbnail: true,
        level: true,
        shortDescription: true,
        _count: { select: { lessons: true, enrollments: true } },
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  // Calculate completed lessons for each enrollment
  const enrollmentsWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const completedLessons = await db.lessonProgress.count({
        where: {
          userId: user.id,
          lesson: { courseId: enrollment.courseId },
          completed: true,
        },
      })

      const lastProgress = await db.lessonProgress.findFirst({
        where: {
          userId: user.id,
          lesson: { courseId: enrollment.courseId },
        },
        orderBy: { lastViewedAt: 'desc' },
        select: { lastViewedAt: true },
      })

      const nextLesson = await db.lesson.findFirst({
        where: {
          courseId: enrollment.courseId,
          isActive: true,
          NOT: {
            lessonProgress: {
              some: { userId: user.id, completed: true },
            },
          },
        },
        orderBy: { lessonOrder: 'asc' },
        select: { id: true },
      })

      return {
        ...enrollment,
        completedLessons,
        totalLessons: enrollment.course._count.lessons,
        nextLessonId: nextLesson?.id || null,
        lastViewedAt: lastProgress?.lastViewedAt || null,
      }
    })
  )

  const totalEnrolled = enrollments.length
  const inProgressCount = enrollmentsWithProgress.filter(
    (e) => e.completedLessons > 0 && e.completedLessons < e.totalLessons
  ).length
  const completedCount = enrollmentsWithProgress.filter(
    (e) => e.totalLessons > 0 && e.completedLessons >= e.totalLessons
  ).length
  const certCount = certificates.length

  const inProgressCourses = enrollmentsWithProgress.filter(
    (e) => e.completedLessons < e.totalLessons
  )
  const completedCourses = enrollmentsWithProgress.filter(
    (e) => e.totalLessons > 0 && e.completedLessons >= e.totalLessons
  )

  /* ── stat cards config ─────────────────────────────────────────────── */

  const dashboardStats = [
    {
      label: 'คอร์สที่ลงทะเบียน',
      value: totalEnrolled,
      icon: BookOpen,
      gradient: 'from-blue-500/20 to-blue-600/5',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      ring: 'ring-blue-500/20',
    },
    {
      label: 'กำลังเรียน',
      value: inProgressCount,
      icon: PlayCircle,
      gradient: 'from-cyan-500/20 to-cyan-600/5',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
      ring: 'ring-cyan-500/20',
    },
    {
      label: 'เรียนจบแล้ว',
      value: completedCount,
      icon: CheckCircle2,
      gradient: 'from-green-500/20 to-green-600/5',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-400',
      ring: 'ring-green-500/20',
    },
    {
      label: 'Certificate ที่ได้รับ',
      value: certCount,
      icon: Award,
      gradient: 'from-purple-500/20 to-purple-600/5',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      ring: 'ring-purple-500/20',
    },
  ]

  /* ── render ─────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* subtle top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-blue-600/[0.07] via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ───────── Welcome Section ───────── */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {/* profile image */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 opacity-60 blur-md" />
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.fullName || 'Profile'}
                  width={72}
                  height={72}
                  className="relative rounded-full ring-2 ring-white/10"
                  unoptimized
                />
              ) : (
                <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-bold text-white ring-2 ring-white/10">
                  {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-blue-400">{greeting}</p>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {user.fullName || user.name || 'ผู้เรียน'}
              </h1>
              <p className="mt-1 max-w-lg text-sm text-gray-400">{message}</p>
            </div>
          </div>

          <Link
            href="/courses"
            className={cn(
              'inline-flex items-center gap-2 self-start rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200',
              'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25',
              'hover:shadow-blue-500/40 hover:brightness-110'
            )}
          >
            <Sparkles className="h-4 w-4" />
            สำรวจคอร์สเรียน
          </Link>
        </div>

        {/* ───────── Learning Summary Cards ───────── */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border border-white/[0.06] p-5',
                  'bg-[#0a1628]/50 backdrop-blur-sm',
                  'transition-all duration-300 hover:border-white/[0.12] hover:bg-[#0a1628]/80 hover:-translate-y-0.5',
                  'hover:shadow-xl hover:shadow-black/20'
                )}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative">
                  <div
                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ring-1 ${stat.ring}`}
                  >
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ───────── Continue Learning ───────── */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-white">เรียนต่อจากที่ค้างไว้</h2>
            </div>
            <Link
              href="/courses"
              className="flex items-center gap-1 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              ดูคอร์สทั้งหมด
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {inProgressCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {inProgressCourses.map((enrollment) => {
                const progressPercent =
                  enrollment.totalLessons > 0
                    ? Math.round(
                        (enrollment.completedLessons / enrollment.totalLessons) * 100
                      )
                    : 0

                return (
                  <div
                    key={enrollment.id}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border border-white/[0.06]',
                      'bg-[#0a1628]/60 backdrop-blur-sm',
                      'transition-all duration-300 hover:border-white/[0.12] hover:-translate-y-0.5',
                      'hover:shadow-xl hover:shadow-black/20'
                    )}
                  >
                    {/* top gradient accent */}
                    <div
                      className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${
                        progressBarColors[enrollment.course.category] ||
                        'from-blue-500 to-cyan-400'
                      }`}
                    />

                    <div className="p-5">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1',
                              categoryBadgeBg[enrollment.course.category] ||
                                'bg-blue-500/10 text-blue-400 ring-blue-500/20'
                            )}
                          >
                            {enrollment.course.category}
                          </span>
                          <h3 className="mt-2 text-lg font-bold leading-tight text-white">
                            {enrollment.course.title}
                          </h3>
                        </div>
                        <div className="ml-4 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] ring-1 ring-white/[0.08]">
                          <span className="text-lg font-bold text-white">
                            {progressPercent}%
                          </span>
                        </div>
                      </div>

                      {/* meta row */}
                      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {enrollment.completedLessons}/{enrollment.totalLessons}{' '}
                          บทเรียน
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart2 className="h-3.5 w-3.5" />
                          {progressPercent}% สำเร็จ
                        </span>
                        {enrollment.lastViewedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            เข้าดูล่าสุด {formatDate(enrollment.lastViewedAt, 'd MMM yyyy')}
                          </span>
                        )}
                      </div>

                      {/* animated progress bar */}
                      <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={cn(
                            'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
                            progressBarColors[enrollment.course.category] ||
                              'from-blue-500 to-cyan-400'
                          )}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <Link
                        href={
                          enrollment.nextLessonId
                            ? `/learn/${enrollment.course.slug}/${enrollment.nextLessonId}`
                            : `/courses/${enrollment.course.slug}`
                        }
                        className={cn(
                          'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
                          'bg-gradient-to-r from-blue-600 to-cyan-500 text-white',
                          'shadow-lg shadow-blue-500/20 transition-all duration-200',
                          'hover:shadow-blue-500/40 hover:brightness-110'
                        )}
                      >
                        <PlayCircle className="h-4 w-4" />
                        เรียนต่อ
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a1628]/40 p-10 text-center backdrop-blur-sm">
              <Sparkles className="mx-auto mb-3 h-10 w-10 text-gray-600" />
              <p className="text-lg font-medium text-gray-300">
                ยังไม่มีคอร์สที่กำลังเรียน
              </p>
              <p className="mt-1 text-sm text-gray-500">
                เริ่มต้นการเรียนรู้ AI เพื่อพัฒนาศักยภาพทางธุรกิจ
              </p>
              <Link
                href="/courses"
                className={cn(
                  'mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold',
                  'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                )}
              >
                สำรวจคอร์สเรียน
              </Link>
            </div>
          )}
        </section>

        {/* ───────── Completed Courses ───────── */}
        {completedCourses.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">คอร์สที่เรียนจบแล้ว</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedCourses.map((enrollment) => {
                const cert = certificates.find(
                  (c) => c.courseId === enrollment.courseId
                )
                return (
                  <div
                    key={enrollment.id}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border border-white/[0.06]',
                      'bg-[#0a1628]/50 backdrop-blur-sm p-5',
                      'transition-all duration-300 hover:border-green-500/20 hover:-translate-y-0.5',
                      'hover:shadow-xl hover:shadow-black/20'
                    )}
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-green-500 to-emerald-400" />

                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/20">
                        <GraduationCap className="h-6 w-6 text-green-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white leading-tight">
                          {enrollment.course.title}
                        </h3>
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          เรียนครบ {enrollment.totalLessons} บทเรียน
                        </p>
                        {enrollment.completedAt && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            สำเร็จเมื่อ{' '}
                            {formatDate(enrollment.completedAt, 'd MMM yyyy')}
                          </p>
                        )}
                      </div>
                    </div>

                    {cert && (
                      <div className="mt-4">
                        <Link
                          href={`/certificate/${cert.certificateCode}`}
                          className={cn(
                            'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold',
                            'border border-green-500/20 bg-green-500/10 text-green-400',
                            'transition-all hover:bg-green-500/20'
                          )}
                        >
                          <Award className="h-4 w-4" />
                          ดู Certificate
                        </Link>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ───────── My Certificates ───────── */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
              <Award className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Certificate ของฉัน</h2>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border border-white/[0.06]',
                    'bg-[#0a1628]/50 backdrop-blur-sm p-5',
                    'transition-all duration-300 hover:border-purple-500/20 hover:-translate-y-0.5',
                    'hover:shadow-xl hover:shadow-black/20'
                  )}
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-400" />

                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-1 ring-purple-500/20">
                      <Award className="h-7 w-7 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white leading-tight">
                        {cert.course.title}
                      </h3>
                      <p className="mt-1.5 font-mono text-xs text-blue-400 tracking-wider">
                        {cert.certificateCode}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        ออกเมื่อ {formatDate(cert.issuedAt, 'd MMMM yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/certificate/${cert.certificateCode}`}
                      className={cn(
                        'flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold',
                        'border border-purple-500/20 bg-purple-500/10 text-purple-300',
                        'transition-all hover:bg-purple-500/20'
                      )}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      ดู Certificate
                    </Link>
                    <Link
                      href={`/a/certificate/${cert.certificateCode}`}
                      className={cn(
                        'flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold',
                        'border border-white/[0.08] bg-white/[0.04] text-gray-300',
                        'transition-all hover:bg-white/[0.08]'
                      )}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verify
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a1628]/40 p-10 text-center backdrop-blur-sm">
              <Award className="mx-auto mb-3 h-10 w-10 text-gray-600" />
              <p className="text-lg font-medium text-gray-300">
                ยังไม่มี Certificate
              </p>
              <p className="mt-1 text-sm text-gray-500">
                เรียนจบคอร์สเพื่อรับ Certificate รับรองความรู้
              </p>
            </div>
          )}
        </section>

        {/* ───────── Recommended Courses ───────── */}
        {recommendedCourses.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-white">คอร์สแนะนำสำหรับคุณ</h2>
              </div>
              <Link
                href="/courses"
                className="flex items-center gap-1 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                ดูทั้งหมด
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border border-white/[0.06]',
                    'bg-[#0a1628]/50 backdrop-blur-sm',
                    'transition-all duration-300 hover:border-white/[0.12] hover:-translate-y-1',
                    'hover:shadow-xl hover:shadow-black/20'
                  )}
                >
                  {/* thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-900/30 to-purple-900/30">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-10 w-10 text-gray-600" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1',
                        categoryBadgeBg[course.category] ||
                          'bg-blue-500/10 text-blue-400 ring-blue-500/20'
                      )}
                    >
                      {course.category}
                    </span>
                    <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-white">
                      {course.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {course._count.lessons} บทเรียน
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course._count.enrollments} คน
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

