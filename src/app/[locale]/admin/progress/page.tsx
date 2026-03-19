import Link from 'next/link'

import { redirect } from 'next/navigation'
import {
  BarChart3,
  Search,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Users,
  TrendingUp,
  ArrowUpDown,
} from 'lucide-react'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { cn, formatDate } from '@/lib/utils'
import ProgressActions from '@/components/admin/ProgressActions'

export const dynamic = "force-dynamic";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  ENROLLED: {
    label: 'ลงทะเบียนแล้ว',
    color: 'text-gray-400',
    bg: 'bg-gray-500/10 ring-gray-500/20',
    icon: BookOpen,
  },
  IN_PROGRESS: {
    label: 'กำลังเรียน',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 ring-cyan-500/20',
    icon: PlayCircle,
  },
  COMPLETED: {
    label: 'เรียนจบ',
    color: 'text-green-400',
    bg: 'bg-green-500/10 ring-green-500/20',
    icon: CheckCircle2,
  },
}

function getProgressBarColor(percent: number): string {
  if (percent >= 100) return 'from-green-500 to-emerald-400'
  if (percent >= 60) return 'from-blue-500 to-cyan-400'
  if (percent >= 30) return 'from-yellow-500 to-orange-400'
  return 'from-red-500 to-pink-400'
}

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default async function AdminProgressPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'ADMIN') redirect('/')

  const params = await searchParams
  const search = params.q || ''
  const statusFilter = params.status || ''

  // Build where clause
  const where: Record<string, unknown> = {}

  if (statusFilter && statusFilter !== 'ALL') {
    where.status = statusFilter
  }

  if (search) {
    where.OR = [
      { user: { fullName: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { course: { title: { contains: search, mode: 'insensitive' } } },
    ]
  }

  const [enrollments, totalCount, statusCounts] = await Promise.all([
    db.enrollment.findMany({
      where,
      include: {
        user: { select: { id: true, fullName: true, email: true, image: true } },
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
      take: 100,
    }),
    db.enrollment.count({ where }),
    db.enrollment.groupBy({
      by: ['status'],
      _count: true,
    }),
  ])

  // Calculate real progress for each enrollment
  const enrollmentsWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const completedLessons = await db.lessonProgress.count({
        where: {
          userId: enrollment.userId,
          lesson: { courseId: enrollment.courseId },
          completed: true,
        },
      })

      const lastActivity = await db.lessonProgress.findFirst({
        where: {
          userId: enrollment.userId,
          lesson: { courseId: enrollment.courseId },
        },
        orderBy: { lastViewedAt: 'desc' },
        select: { lastViewedAt: true },
      })

      const totalLessons = enrollment.course._count.lessons
      const progressPercent =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

      return {
        ...enrollment,
        completedLessons,
        totalLessons,
        progressPercent,
        lastActivity: lastActivity?.lastViewedAt || null,
      }
    })
  )

  // Summary stats
  const enrolledCount =
    statusCounts.find((s) => s.status === 'ENROLLED')?._count || 0
  const inProgressStatusCount =
    statusCounts.find((s) => s.status === 'IN_PROGRESS')?._count || 0
  const completedStatusCount =
    statusCounts.find((s) => s.status === 'COMPLETED')?._count || 0
  const totalAll = statusCounts.reduce((sum, s) => sum + s._count, 0)

  const summaryStats = [
    {
      label: 'ทั้งหมด',
      value: totalAll,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'ลงทะเบียน',
      value: enrolledCount,
      icon: BookOpen,
      color: 'text-gray-400',
      bg: 'bg-gray-500/10',
    },
    {
      label: 'กำลังเรียน',
      value: inProgressStatusCount,
      icon: PlayCircle,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'เรียนจบ',
      value: completedStatusCount,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">ความก้าวหน้าผู้เรียน</h1>
            <p className="text-sm text-gray-500">
              ติดตามสถานะการเรียนของผู้ใช้ทั้งหมด
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summaryStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-4"
            >
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form className="relative flex-1" action="/admin/progress" method="GET">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="ค้นหาชื่อผู้เรียน, อีเมล, หรือชื่อคอร์ส..."
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
          {statusFilter && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
        </form>

        <div className="flex gap-2">
          {['ALL', 'ENROLLED', 'IN_PROGRESS', 'COMPLETED'].map((s) => {
            const isActive =
              s === 'ALL' ? !statusFilter || statusFilter === 'ALL' : statusFilter === s
            const label =
              s === 'ALL'
                ? 'ทั้งหมด'
                : statusConfig[s]?.label || s
            return (
              <Link
                key={s}
                href={`/admin/progress?${new URLSearchParams({
                  ...(search ? { q: search } : {}),
                  ...(s !== 'ALL' ? { status: s } : {}),
                }).toString()}`}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
                    : 'text-gray-500 hover:bg-white/[0.04] hover:text-gray-300'
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a1628]/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  ผู้เรียน
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  คอร์ส
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  ความก้าวหน้า
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  สถานะ
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  เข้าเรียนล่าสุด
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {enrollmentsWithProgress.length > 0 ? (
                enrollmentsWithProgress.map((enrollment) => {
                  const statusInfo =
                    statusConfig[enrollment.status] || statusConfig.ENROLLED

                  return (
                    <tr
                      key={enrollment.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xs font-bold text-blue-400">
                            {(enrollment.user.fullName || 'U')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {enrollment.user.fullName}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {enrollment.user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-200">
                          {enrollment.course.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {enrollment.course.category}
                        </p>
                      </td>

                      {/* Progress */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className={cn(
                                'h-full rounded-full bg-gradient-to-r transition-all',
                                getProgressBarColor(enrollment.progressPercent)
                              )}
                              style={{
                                width: `${enrollment.progressPercent}%`,
                              }}
                            />
                          </div>
                          <span className="min-w-[3rem] text-xs font-medium text-gray-400">
                            {enrollment.progressPercent}%
                          </span>
                          <span className="text-[11px] text-gray-600">
                            ({enrollment.completedLessons}/{enrollment.totalLessons})
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1',
                            statusInfo.bg,
                            statusInfo.color
                          )}
                        >
                          <statusInfo.icon className="h-3 w-3" />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="px-5 py-4">
                        {enrollment.lastActivity ? (
                          <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(enrollment.lastActivity, 'd MMM yyyy HH:mm')}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <ProgressActions
                          enrollmentId={enrollment.id}
                          currentStatus={enrollment.status}
                        />
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <AlertCircle className="mx-auto mb-3 h-8 w-8 text-gray-600" />
                    <p className="text-sm text-gray-400">
                      {search || statusFilter
                        ? 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข'
                        : 'ยังไม่มีข้อมูลการลงทะเบียน'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {totalCount > 0 && (
          <div className="border-t border-white/[0.06] px-5 py-3">
            <p className="text-xs text-gray-500">
              แสดง {enrollmentsWithProgress.length} จาก {totalCount} รายการ
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
