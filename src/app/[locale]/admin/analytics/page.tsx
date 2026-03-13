import {
  BarChart3,
  Users,
  BookOpen,
  Award,
  GraduationCap,
  Target,
} from 'lucide-react'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'
import ExportButton from '@/components/admin/ExportButton'

export default async function AnalyticsPage() {
  await requireAdmin()
  const t = await getTranslations('admin')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Fetch all analytics data
  const [
    totalUsers,
    newUsersThisMonth,
    totalEnrollments,
    totalCertificates,
    certsThisMonth,
    courses,
    recentAttempts,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.enrollment.count(),
    db.certificate.count(),
    db.certificate.count({ where: { issuedAt: { gte: startOfMonth } } }),
    db.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        _count: {
          select: {
            enrollments: true,
            certificates: true,
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),
    db.quizAttempt.findMany({
      take: 8,
      orderBy: { attemptedAt: 'desc' },
      include: {
        user: {
          select: { fullName: true, email: true, image: true },
        },
        quiz: {
          select: {
            title: true,
            course: { select: { title: true } },
          },
        },
      },
    }),
  ])

  // Calculate completion rate
  const completedEnrollments = await db.enrollment.count({
    where: { status: 'COMPLETED' },
  })
  const completionRate =
    totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100 * 10) / 10
      : 0

  // Course-level completion data
  const courseStats = await Promise.all(
    courses.map(async (course) => {
      const enrollmentCount = course._count.enrollments
      const completedCount = await db.enrollment.count({
        where: { courseId: course.id, status: 'COMPLETED' },
      })
      const rate =
        enrollmentCount > 0
          ? Math.round((completedCount / enrollmentCount) * 100)
          : 0
      return {
        id: course.id,
        title: course.title,
        category: course.category,
        enrollments: enrollmentCount,
        certificates: course._count.certificates,
        lessons: course._count.lessons,
        completionRate: rate,
      }
    })
  )

  // Sort by enrollments for top courses
  const topCourses = [...courseStats].sort(
    (a, b) => b.enrollments - a.enrollments
  )
  const maxEnrollment = topCourses[0]?.enrollments || 1

  const courseColors = [
    'bg-blue-500',
    'bg-cyan-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-emerald-500',
  ]
  const completionGradients = [
    'from-blue-500 to-blue-400',
    'from-cyan-500 to-cyan-400',
    'from-purple-500 to-purple-400',
    'from-pink-500 to-pink-400',
    'from-emerald-500 to-emerald-400',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('analyticsTitle')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('analyticsDesc')}
          </p>
        </div>
        <ExportButton
          options={[
            { type: 'all', labelKey: 'exportAll' },
            { type: 'enrollments', labelKey: 'exportEnrollments' },
            { type: 'quiz-attempts', labelKey: 'exportQuizAttempts' },
          ]}
        />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          {
            id: 'totalStudents',
            label: t('totalStudents'),
            value: totalUsers.toLocaleString(),
            icon: Users,
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-400',
          },
          {
            id: 'enrolledThisMonth',
            label: t('enrolledThisMonth'),
            value: newUsersThisMonth.toString(),
            icon: GraduationCap,
            iconBg: 'bg-cyan-500/10',
            iconColor: 'text-cyan-400',
          },
          {
            id: 'courseCompletionRate',
            label: t('courseCompletionRate'),
            value: `${completionRate}%`,
            icon: Target,
            iconBg: 'bg-emerald-500/10',
            iconColor: 'text-emerald-400',
          },
          {
            id: 'certsThisMonth',
            label: t('certsThisMonth'),
            value: certsThisMonth.toString(),
            icon: Award,
            iconBg: 'bg-purple-500/10',
            iconColor: 'text-purple-400',
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.id}
              className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5 transition-all hover:border-white/[0.1]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Top Courses */}
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">
                {t('popularCourses')}
              </h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {t('popularCoursesDesc')}
            </p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {topCourses.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                {t('noData')}
              </div>
            ) : (
              topCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : index === 1
                          ? 'bg-gray-400/10 text-gray-400'
                          : index === 2
                            ? 'bg-amber-700/10 text-amber-600'
                            : 'bg-white/[0.04] text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-200">
                      {course.title}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.enrollments} {t('enrolledCount')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {t('completedPercent')} {course.completionRate}%
                      </span>
                    </div>
                  </div>
                  <div className="w-24">
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                      <div
                        className={`h-full rounded-full ${courseColors[index % courseColors.length]}`}
                        style={{
                          width: `${(course.enrollments / maxEnrollment) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completion Rates */}
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">
                {t('completionRates')}
              </h2>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {t('completionRatesDesc')}
            </p>
          </div>
          <div className="space-y-5 p-5">
            {courseStats.length === 0 ? (
              <p className="text-center text-sm text-gray-500">{t('noData')}</p>
            ) : (
              courseStats.map((course, index) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-300">
                      {course.title}
                    </span>
                    <span className="font-bold text-white">
                      {course.completionRate}%
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.04]">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${completionGradients[index % completionGradients.length]} transition-all duration-700`}
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Quiz Results */}
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">
              {t('recentQuizResults')}
            </h2>
          </div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {recentAttempts.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              {t('noQuizResults')}
            </div>
          ) : (
            recentAttempts.map((attempt) => {
              const scoreColor =
                attempt.score >= 90
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : attempt.score >= 70
                    ? 'text-blue-400 bg-blue-500/10'
                    : attempt.score >= 50
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-red-400 bg-red-500/10'

              const initial =
                (attempt.user.fullName || attempt.user.email)[0]?.toUpperCase() || '?'

              return (
                <div
                  key={attempt.id}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  {attempt.user.image ? (
                    <img
                      src={attempt.user.image}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xs font-bold text-blue-300">
                      {initial}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-200">
                      {attempt.user.fullName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {attempt.quiz.title} — {attempt.quiz.course.title}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-bold ${scoreColor}`}
                    >
                      {attempt.score}%
                    </span>
                    <span className="hidden text-xs text-gray-600 sm:block">
                      {attempt.passed ? `✓ ${t('passed')}` : `✗ ${t('failed')}`}
                    </span>
                    <span className="hidden text-xs text-gray-600 md:block">
                      {formatDate(attempt.attemptedAt, 'd MMM yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">{t('summaryOverview')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { id: 'totalUsers', label: t('totalUsersLabel'), value: totalUsers },
            { id: 'publishedCourses', label: t('publishedCourses'), value: courses.length },
            { id: 'totalEnrollments', label: t('totalEnrollments'), value: totalEnrollments },
            { id: 'completedEnrollments', label: t('completedEnrollments'), value: completedEnrollments },
            { id: 'certificatesIssued', label: t('certificatesIssued'), value: totalCertificates },
            { id: 'courseCompletionRate', label: t('courseCompletionRate'), value: `${completionRate}%` },
          ].map((item) => (
            <div key={item.id} className="text-center">
              <p className="text-xl font-bold text-white">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
