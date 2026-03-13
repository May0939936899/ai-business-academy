import Link from 'next/link'
import {
  Users,
  UserCheck,
  UserPlus,
  ShieldOff,
  Eye,
  Shield,
} from 'lucide-react'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import { getTranslations, getLocale } from 'next-intl/server'
import ExportButton from '@/components/admin/ExportButton'

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
  },
  SUSPENDED: {
    label: 'Suspended',
    className: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  },
}

const roleConfig: Record<string, { label: string; className: string }> = {
  STUDENT: {
    label: 'Student',
    className: 'bg-blue-500/10 text-blue-400',
  },
  INSTRUCTOR: {
    label: 'Instructor',
    className: 'bg-purple-500/10 text-purple-400',
  },
  ADMIN: {
    label: 'Admin',
    className: 'bg-cyan-500/10 text-cyan-400',
  },
}

export default async function UsersPage() {
  await requireAdmin()
  const t = await getTranslations('admin')
  const locale = await getLocale()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [users, totalCount, activeCount, newThisMonth, suspendedCount] =
    await Promise.all([
      db.user.findMany({
        include: {
          _count: {
            select: {
              enrollments: true,
              certificates: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.user.count(),
      db.user.count({ where: { status: 'ACTIVE' } }),
      db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.user.count({ where: { status: 'SUSPENDED' } }),
    ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('manageUsers')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('manageUsersDesc', { count: totalCount })}
          </p>
        </div>
        <ExportButton exportType="users" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalCount}</p>
              <p className="text-xs text-gray-500">{t('allUsers')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <UserCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <UserPlus className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{newThisMonth}</p>
              <p className="text-xs text-gray-500">{t('newThisMonth')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
              <ShieldOff className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{suspendedCount}</p>
              <p className="text-xs text-gray-500">Suspended</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-20 text-center">
          <Users className="h-8 w-8 text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-300">{t('noUsers')}</h3>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('colName')}
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('colEmail')}
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('colStatus')}
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('colRole')}
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('colCoursesEnrolled')}
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('colCertificates')}
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('colJoinDate')}
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t('colActions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map((user) => {
                  const status = statusConfig[user.status] ?? statusConfig.ACTIVE
                  const role = roleConfig[user.role] ?? roleConfig.STUDENT
                  const initial = (user.fullName || user.email)[0]?.toUpperCase() || '?'

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xs font-bold text-blue-300">
                              {initial}
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-200">
                            {user.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${role.className}`}
                        >
                          {role.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {user._count.enrollments} {t('coursesSuffix')}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {user._count.certificates}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/${locale}/admin/users/${user.id}`}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                            title={t('viewDetails')}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          {user.role !== 'ADMIN' && (
                            <Link
                              href={`/api/admin/users/${user.id}/toggle-role`}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                              title={t('changeRole')}
                            >
                              <Shield className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.06] px-5 py-3.5">
            <p className="text-sm text-gray-500">
              {t('totalUsers2', { count: users.length })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
