import Link from 'next/link'
import {
  Plus,
  BookOpen,
  Users,
  Pencil,
  FileText,
  GraduationCap,
} from 'lucide-react'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { formatDate, levelLabels } from '@/lib/utils'

const statusConfig: Record<string, { label: string; className: string }> = {
  PUBLISHED: {
    label: 'Published',
    className:
      'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
  },
  DRAFT: {
    label: 'Draft',
    className: 'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20',
  },
}

export default async function CoursesPage() {
  await requireAdmin()

  const courses = await db.course.findMany({
    include: {
      _count: {
        select: {
          lessons: true,
          enrollments: true,
          quizzes: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">จัดการคอร์สเรียน</h1>
          <p className="mt-1 text-sm text-gray-500">
            จัดการคอร์สเรียนทั้งหมดในระบบ ({courses.length} คอร์ส)
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30"
        >
          <Plus className="h-4 w-4" />
          เพิ่มคอร์ส
        </Link>
      </div>

      {/* Table */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
            <BookOpen className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-300">
            ยังไม่มีคอร์สเรียน
          </h3>
          <p className="mt-1.5 text-sm text-gray-500">
            เริ่มสร้างคอร์สเรียนแรกของคุณเพื่อให้ผู้เรียนสามารถเข้าถึงได้
          </p>
          <Link
            href="/admin/courses/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30"
          >
            <Plus className="h-4 w-4" />
            เพิ่มคอร์สใหม่
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ชื่อคอร์ส
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    หมวดหมู่
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ระดับ
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    สถานะ
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    บทเรียน
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ผู้เรียน
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    วันที่สร้าง
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {courses.map((course) => {
                  const status = statusConfig[course.status] ?? statusConfig.DRAFT

                  return (
                    <tr
                      key={course.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      {/* Title */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                            <BookOpen className="h-5 w-5 text-blue-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-200">
                            {course.title}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {course.category}
                      </td>

                      {/* Level */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {levelLabels[course.level] ?? course.level}
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Lesson count */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          <FileText className="h-3.5 w-3.5 text-gray-500" />
                          {course._count.lessons}
                        </div>
                      </td>

                      {/* Enrollment count */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          <Users className="h-3.5 w-3.5 text-gray-500" />
                          {course._count.enrollments.toLocaleString()}
                        </div>
                      </td>

                      {/* Created date */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(course.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          แก้ไข
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          <div className="border-t border-white/[0.06] px-5 py-3.5">
            <p className="text-sm text-gray-500">
              ทั้งหมด {courses.length} คอร์ส
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
