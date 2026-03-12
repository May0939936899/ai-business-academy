import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/utils'

export default async function AdminDashboardPage() {
  await requireAdmin()

  const [userCount, courseCount, enrollmentCount, certCount, recentEnrollments, recentCerts] =
    await Promise.all([
      db.user.count(),
      db.course.count({ where: { status: 'PUBLISHED' } }),
      db.enrollment.count(),
      db.certificate.count(),
      db.enrollment.findMany({
        take: 5,
        orderBy: { enrolledAt: 'desc' },
        include: {
          user: { select: { fullName: true, email: true, image: true } },
          course: { select: { title: true } },
        },
      }),
      db.certificate.findMany({
        take: 5,
        orderBy: { issuedAt: 'desc' },
        include: {
          user: { select: { fullName: true } },
          course: { select: { title: true } },
        },
      }),
    ])

  const stats = [
    {
      label: 'ผู้ใช้งานทั้งหมด',
      value: userCount,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      href: '/admin/users',
    },
    {
      label: 'คอร์สเรียน',
      value: courseCount,
      icon: BookOpen,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      href: '/admin/courses',
    },
    {
      label: 'การลงทะเบียน',
      value: enrollmentCount,
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      href: '/admin/analytics',
    },
    {
      label: 'Certificate ออกแล้ว',
      value: certCount,
      icon: Award,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      href: '/admin/certificates',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">ภาพรวมระบบ AI Business Academy</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-0.5 text-sm text-gray-500">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Enrollments */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">การลงทะเบียนล่าสุด</h2>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
            >
              ดูทั้งหมด <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentEnrollments.length > 0 ? (
            <div className="space-y-3">
              {recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.01] p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                    {enrollment.user.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-200">{enrollment.user.fullName}</p>
                    <p className="truncate text-xs text-gray-500">{enrollment.course.title}</p>
                  </div>
                  <span className="text-xs text-gray-600">{formatDate(enrollment.enrolledAt, 'd MMM')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-gray-600">ยังไม่มีการลงทะเบียน</p>
          )}
        </div>

        {/* Recent Certificates */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Certificate ออกล่าสุด</h2>
            <Link
              href="/admin/certificates"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
            >
              ดูทั้งหมด <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentCerts.length > 0 ? (
            <div className="space-y-3">
              {recentCerts.map((cert) => (
                <div key={cert.id} className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.01] p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10">
                    <Award className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-200">{cert.user.fullName}</p>
                    <p className="truncate text-xs text-gray-500">{cert.course.title}</p>
                  </div>
                  <span className="font-mono text-xs text-blue-400">{cert.certificateCode}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-gray-600">ยังไม่มี Certificate</p>
          )}
        </div>
      </div>
    </div>
  )
}
