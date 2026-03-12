import Link from 'next/link'
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
} from 'lucide-react'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { cn, formatDate } from '@/lib/utils'

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

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Fetch all data in parallel
  const [enrollments, certificates] = await Promise.all([
    db.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    }),
    db.certificate.findMany({
      where: { userId: user.id },
      include: {
        course: { select: { title: true, slug: true } },
      },
      orderBy: { issuedAt: 'desc' },
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

      // Find the next incomplete lesson
      const nextLesson = await db.lesson.findFirst({
        where: {
          courseId: enrollment.courseId,
          isActive: true,
          NOT: {
            lessonProgress: {
              some: {
                userId: user.id,
                completed: true,
              },
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

  const dashboardStats = [
    {
      label: 'คอร์สที่ลงทะเบียน',
      value: totalEnrolled,
      icon: BookOpen,
      gradient: 'from-blue-500/20 to-blue-600/5',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'กำลังเรียน',
      value: inProgressCount,
      icon: PlayCircle,
      gradient: 'from-cyan-500/20 to-cyan-600/5',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
    },
    {
      label: 'เรียนจบแล้ว',
      value: completedCount,
      icon: CheckCircle2,
      gradient: 'from-green-500/20 to-green-600/5',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-400',
    },
    {
      label: 'Certificate',
      value: certCount,
      icon: Award,
      gradient: 'from-purple-500/20 to-purple-600/5',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
  ]

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            สวัสดี, {user.fullName || user.name || 'ผู้เรียน'}
          </h1>
          <p className="mt-1 text-gray-400">ติดตามความก้าวหน้าการเรียนรู้ของคุณ</p>
        </div>

        {/* Stats Row */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-[#0a1628]/80"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* In-progress Courses */}
        <div className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">คอร์สที่กำลังเรียน</h2>
            <Link
              href="/courses"
              className="flex items-center gap-1 text-sm text-blue-400 transition-colors hover:text-blue-300"
            >
              ดูคอร์สทั้งหมด
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {inProgressCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {inProgressCourses.map((enrollment) => {
                const progressPercent =
                  enrollment.totalLessons > 0
                    ? Math.round((enrollment.completedLessons / enrollment.totalLessons) * 100)
                    : 0

                return (
                  <div
                    key={enrollment.id}
                    className={cn(
                      'glass rounded-2xl p-5 transition-all duration-300',
                      'glass-hover hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5',
                      'shadow-lg shadow-blue-500/10'
                    )}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p
                          className={`mb-1 text-xs font-semibold uppercase tracking-wider ${
                            categoryColors[enrollment.course.category] || 'text-blue-400'
                          }`}
                        >
                          {enrollment.course.category}
                        </p>
                        <h3 className="text-lg font-bold text-white">{enrollment.course.title}</h3>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                        <span className="text-lg font-bold text-blue-400">{progressPercent}%</span>
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {enrollment.completedLessons}/{enrollment.totalLessons} บทเรียน
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart2 className="h-3.5 w-3.5" />
                        {progressPercent}% เสร็จแล้ว
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${
                          progressBarColors[enrollment.course.category] || 'from-blue-500 to-cyan-400'
                        } transition-all duration-500`}
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
                        'inline-flex w-full items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200',
                        'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110'
                      )}
                    >
                      <PlayCircle className="h-4 w-4" />
                      เรียนต่อ
                    </Link>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-gray-600" />
              <p className="text-gray-400">คุณยังไม่มีคอร์สที่กำลังเรียน</p>
              <Link
                href="/courses"
                className={cn(
                  'mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold',
                  'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                )}
              >
                สำรวจคอร์สเรียน
              </Link>
            </div>
          )}
        </div>

        {/* Certificates */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Certificate ของฉัน</h2>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="glass glass-hover rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <Award className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white">{cert.course.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(cert.issuedAt)}
                      </p>
                      <p className="mt-1 font-mono text-xs text-blue-400">{cert.certificateCode}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/certificate/${cert.certificateCode}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-gray-200 transition-all hover:bg-white/[0.08]"
                    >
                      ดู Certificate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <Award className="mx-auto mb-3 h-8 w-8 text-gray-600" />
              <p className="text-gray-400">
                คุณยังไม่มี Certificate เรียนจบคอร์สเพื่อรับ Certificate
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
