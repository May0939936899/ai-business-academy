import {
  FileQuestion,
  BookOpen,
  HelpCircle,
  CheckCircle,
  Users,
} from 'lucide-react'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/utils'

export default async function QuizzesPage() {
  await requireAdmin()

  const [quizzes, totalQuizzes, totalQuestions, totalAttempts, passedAttempts] =
    await Promise.all([
      db.quiz.findMany({
        include: {
          course: {
            select: {
              title: true,
            },
          },
          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.quiz.count(),
      db.quizQuestion.count(),
      db.quizAttempt.count(),
      db.quizAttempt.count({
        where: { passed: true },
      }),
    ])

  // Calculate per-quiz pass rates
  const quizIds = quizzes.map((q) => q.id)
  const passedByQuiz = await db.quizAttempt.groupBy({
    by: ['quizId'],
    where: { quizId: { in: quizIds }, passed: true },
    _count: { id: true },
  })
  const passedMap = new Map(
    passedByQuiz.map((p) => [p.quizId, p._count.id])
  )

  const avgPassRate =
    totalAttempts > 0
      ? Math.round((passedAttempts / totalAttempts) * 100)
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">จัดการแบบทดสอบ</h1>
        <p className="mt-1 text-sm text-gray-500">
          ดูและจัดการแบบทดสอบทั้งหมดในระบบ ({totalQuizzes} รายการ)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <FileQuestion className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalQuizzes}</p>
              <p className="text-xs text-gray-500">แบบทดสอบทั้งหมด</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <HelpCircle className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalQuestions}</p>
              <p className="text-xs text-gray-500">คำถามทั้งหมด</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalAttempts}</p>
              <p className="text-xs text-gray-500">ทำแบบทดสอบทั้งหมด</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{avgPassRate}%</p>
              <p className="text-xs text-gray-500">อัตราผ่านเฉลี่ย</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-20 text-center">
          <FileQuestion className="h-8 w-8 text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-300">
            ยังไม่มีแบบทดสอบ
          </h3>
          <p className="mt-1.5 text-sm text-gray-500">
            แบบทดสอบจะแสดงที่นี่เมื่อมีการสร้างในคอร์สต่างๆ
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ชื่อแบบทดสอบ
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    คอร์ส
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    จำนวนคำถาม
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    คะแนนผ่าน
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    จำนวนทำ
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    อัตราผ่าน
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
                {quizzes.map((quiz) => {
                  const passedCount = passedMap.get(quiz.id) || 0
                  const attemptCount = quiz._count.attempts
                  const passRate =
                    attemptCount > 0
                      ? Math.round((passedCount / attemptCount) * 100)
                      : 0

                  return (
                    <tr
                      key={quiz.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                            <FileQuestion className="h-4 w-4 text-purple-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-200">
                            {quiz.title}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-sm text-gray-400">
                            {quiz.course.title}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {quiz._count.questions} ข้อ
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {quiz.passingScore}%
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {attemptCount} ครั้ง
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {attemptCount > 0 ? (
                          <span
                            className={`text-sm font-medium ${
                              passRate >= 70
                                ? 'text-emerald-400'
                                : passRate >= 40
                                  ? 'text-amber-400'
                                  : 'text-red-400'
                            }`}
                          >
                            {passRate}%
                          </span>
                        ) : (
                          <span className="text-sm text-gray-600">-</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {quiz.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            เปิดใช้งาน
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/10 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                            ปิดใช้งาน
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(quiz.createdAt)}
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
              ทั้งหมด {quizzes.length} รายการ
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
