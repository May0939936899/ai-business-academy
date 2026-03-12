import Link from 'next/link'
import {
  PlayCircle,
  BookOpen,
  CheckCircle,
  XCircle,
  Video,
} from 'lucide-react'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/utils'

export default async function LessonsPage() {
  await requireAdmin()

  const [lessons, totalCount, activeCount, inactiveCount, coursesWithLessons] =
    await Promise.all([
      db.lesson.findMany({
        include: {
          course: {
            select: {
              title: true,
            },
          },
        },
        orderBy: [{ course: { title: 'asc' } }, { lessonOrder: 'asc' }],
      }),
      db.lesson.count(),
      db.lesson.count({ where: { isActive: true } }),
      db.lesson.count({ where: { isActive: false } }),
      db.lesson.groupBy({
        by: ['courseId'],
      }).then((groups) => groups.length),
    ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">จัดการบทเรียน</h1>
        <p className="mt-1 text-sm text-gray-500">
          ดูและจัดการบทเรียนทั้งหมดในระบบ ({totalCount} รายการ)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <PlayCircle className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalCount}</p>
              <p className="text-xs text-gray-500">บทเรียนทั้งหมด</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
              <p className="text-xs text-gray-500">เปิดใช้งาน</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{inactiveCount}</p>
              <p className="text-xs text-gray-500">ปิดใช้งาน</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <BookOpen className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {coursesWithLessons}
              </p>
              <p className="text-xs text-gray-500">คอร์สที่มีบทเรียน</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-20 text-center">
          <PlayCircle className="h-8 w-8 text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-300">
            ยังไม่มีบทเรียน
          </h3>
          <p className="mt-1.5 text-sm text-gray-500">
            เพิ่มบทเรียนในแต่ละคอร์สเพื่อเริ่มต้นใช้งาน
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ลำดับ
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ชื่อบทเรียน
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    คอร์ส
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    YouTube
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    สถานะ
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    วันที่สร้าง
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {lessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-md bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-medium text-purple-400">
                        {lesson.lessonOrder}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="text-sm font-medium text-gray-200">
                        {lesson.title}
                      </p>
                      {lesson.description && (
                        <p className="mt-0.5 max-w-xs truncate text-xs text-gray-500">
                          {lesson.description}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                      {lesson.course.title}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {lesson.youtubeUrl ? (
                        <Link
                          href={lesson.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
                        >
                          <Video className="h-3.5 w-3.5" />
                          ดูวิดีโอ
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-600">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {lesson.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                          <CheckCircle className="h-3 w-3" />
                          เปิดใช้งาน
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                          <XCircle className="h-3 w-3" />
                          ปิดใช้งาน
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {formatDate(lesson.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.06] px-5 py-3.5">
            <p className="text-sm text-gray-500">
              ทั้งหมด {lessons.length} รายการ
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
