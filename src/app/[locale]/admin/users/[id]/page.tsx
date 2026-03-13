import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  User,
  ArrowLeft,
  BookOpen,
  Award,
  FileQuestion,
  Mail,
  Calendar,
  Shield,
} from 'lucide-react'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/utils'

const roleConfig: Record<string, { label: string; className: string }> = {
  STUDENT: {
    label: 'Student',
    className: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
  },
  ADMIN: {
    label: 'Admin',
    className: 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20',
  },
  INSTRUCTOR: {
    label: 'Instructor',
    className: 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20',
  },
}

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

const enrollmentStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  ENROLLED: {
    label: 'ลงทะเบียน',
    className: 'bg-blue-500/10 text-blue-400',
  },
  IN_PROGRESS: {
    label: 'กำลังเรียน',
    className: 'bg-amber-500/10 text-amber-400',
  },
  COMPLETED: {
    label: 'เรียนจบ',
    className: 'bg-emerald-500/10 text-emerald-400',
  },
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const user = await db.user.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          course: {
            select: { title: true, slug: true },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      },
      certificates: {
        include: {
          course: {
            select: { title: true },
          },
        },
        orderBy: { issuedAt: 'desc' },
      },
      quizAttempts: {
        include: {
          quiz: {
            select: {
              title: true,
              course: {
                select: { title: true },
              },
            },
          },
        },
        orderBy: { attemptedAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!user) {
    notFound()
  }

  const initial =
    (user.fullName || user.email)[0]?.toUpperCase() || '?'
  const role = roleConfig[user.role] ?? roleConfig.STUDENT
  const status = statusConfig[user.status] ?? statusConfig.ACTIVE

  const enrollmentCount = user.enrollments.length
  const inProgressCount = user.enrollments.filter(
    (e) => e.status === 'IN_PROGRESS'
  ).length
  const completedCount = user.enrollments.filter(
    (e) => e.status === 'COMPLETED'
  ).length
  const certificateCount = user.certificates.length

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับไปหน้ารายชื่อผู้ใช้
      </Link>

      {/* User Profile Card */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="h-20 w-20 flex-shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-2xl font-bold text-blue-300">
              {initial}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                  {user.fullName}
                </h1>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${role.className}`}
                >
                  {role.label}
                </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-400 sm:flex-row sm:items-center sm:gap-5">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-gray-500" />
                {user.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-500" />
                สมาชิกตั้งแต่ {formatDate(user.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-gray-500" />
                เข้าสู่ระบบล่าสุด:{' '}
                {user.lastLoginAt
                  ? formatDate(user.lastLoginAt, 'd MMMM yyyy HH:mm')
                  : 'ยังไม่เคยเข้าสู่ระบบ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {enrollmentCount}
              </p>
              <p className="text-xs text-gray-500">คอร์สที่ลงทะเบียน</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <BookOpen className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {inProgressCount}
              </p>
              <p className="text-xs text-gray-500">กำลังเรียน</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <BookOpen className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {completedCount}
              </p>
              <p className="text-xs text-gray-500">เรียนจบ</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Award className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {certificateCount}
              </p>
              <p className="text-xs text-gray-500">Certificate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollments Section */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <BookOpen className="h-5 w-5 text-blue-400" />
          คอร์สที่ลงทะเบียน
        </h2>
        {user.enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-16 text-center">
            <BookOpen className="h-8 w-8 text-gray-600" />
            <h3 className="mt-4 text-base font-medium text-gray-300">
              ยังไม่ได้ลงทะเบียนคอร์สใดๆ
            </h3>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      คอร์ส
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      สถานะ
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      ความคืบหน้า
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      วันที่ลงทะเบียน
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {user.enrollments.map((enrollment) => {
                    const eStatus =
                      enrollmentStatusConfig[enrollment.status] ??
                      enrollmentStatusConfig.ENROLLED
                    return (
                      <tr
                        key={enrollment.id}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-200">
                          {enrollment.course.title}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${eStatus.className}`}
                          >
                            {eStatus.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{
                                  width: `${Math.min(enrollment.progressPercent, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">
                              {enrollment.progressPercent.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                          {formatDate(enrollment.enrolledAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Certificates Section */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Award className="h-5 w-5 text-purple-400" />
          Certificate
        </h2>
        {user.certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-16 text-center">
            <Award className="h-8 w-8 text-gray-600" />
            <h3 className="mt-4 text-base font-medium text-gray-300">
              ยังไม่มี Certificate
            </h3>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Certificate Code
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      คอร์ส
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      วันที่ออก
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {user.certificates.map((cert) => (
                    <tr
                      key={cert.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="rounded-md bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-medium text-purple-400">
                          {cert.certificateCode}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {cert.course.title}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(cert.issuedAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <Link
                          href={`/a/certificate/${cert.certificateCode}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          ดู Certificate
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recent Quiz Attempts Section */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <FileQuestion className="h-5 w-5 text-amber-400" />
          ประวัติการทำ Quiz ล่าสุด
        </h2>
        {user.quizAttempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-16 text-center">
            <FileQuestion className="h-8 w-8 text-gray-600" />
            <h3 className="mt-4 text-base font-medium text-gray-300">
              ยังไม่เคยทำ Quiz
            </h3>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Quiz
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      คอร์ส
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      คะแนน
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      ผลลัพธ์
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      วันที่ทำ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {user.quizAttempts.map((attempt) => (
                    <tr
                      key={attempt.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-200">
                        {attempt.quiz.title}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {attempt.quiz.course?.title ?? '-'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            attempt.score >= 70
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }`}
                        >
                          {attempt.score} คะแนน
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {attempt.passed ? (
                          <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                            ผ่าน
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 ring-1 ring-red-500/20">
                            ไม่ผ่าน
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(attempt.attemptedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
