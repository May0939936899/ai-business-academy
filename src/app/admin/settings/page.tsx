import {
  Settings,
  Award,
  Shield,
  Building2,
  FileSignature,
  CheckCircle2,
  XCircle,
  ImageIcon,
  PenTool,
} from 'lucide-react'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/utils'

export default async function SettingsPage() {
  await requireAdmin()

  const [courses, templateCount, totalCertificates] = await Promise.all([
    db.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        certificateTemplate: true,
      },
      orderBy: { title: 'asc' },
    }),
    db.certificateTemplate.count(),
    db.certificate.count(),
  ])

  const coursesWithTemplate = courses.filter((c) => c.certificateTemplate)
  const coursesWithoutTemplate = courses.filter((c) => !c.certificateTemplate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">ตั้งค่าระบบ</h1>
        <p className="mt-1 text-sm text-gray-500">
          จัดการตั้งค่า Certificate Template และระบบ
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <FileSignature className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {coursesWithTemplate.length}
              </p>
              <p className="text-xs text-gray-500">คอร์สที่มี Template</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Shield className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {coursesWithoutTemplate.length}
              </p>
              <p className="text-xs text-gray-500">คอร์สที่ยังไม่มี Template</p>
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
                {totalCertificates}
              </p>
              <p className="text-xs text-gray-500">Certificate ออกทั้งหมด</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Templates Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <FileSignature className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">
            Certificate Templates
          </h2>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-20 text-center">
            <Settings className="h-8 w-8 text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-300">
              ยังไม่มีคอร์สที่เผยแพร่
            </h3>
            <p className="mt-1.5 text-sm text-gray-500">
              เพิ่มคอร์สและเผยแพร่เพื่อตั้งค่า Certificate Template
            </p>
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
                      Template
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      ผู้ลงนาม
                    </th>
                    <th className="px-5 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      Logo
                    </th>
                    <th className="px-5 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      ลายเซ็น
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      อัปเดตล่าสุด
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {courses.map((course) => {
                    const template = course.certificateTemplate
                    return (
                      <tr
                        key={course.id}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="whitespace-nowrap px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-200">
                              {course.title}
                            </p>
                            <p className="mt-0.5 font-mono text-xs text-gray-500">
                              {course.courseCode}
                            </p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          {template ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              ตั้งค่าแล้ว
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-2.5 py-1 text-xs font-medium text-gray-500">
                              <XCircle className="h-3.5 w-3.5" />
                              ยังไม่ได้ตั้งค่า
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {template ? (
                            <div>
                              <p className="text-sm text-gray-300">
                                {template.signerName}
                              </p>
                              <p className="mt-0.5 text-xs text-gray-500">
                                {template.signerTitle}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-600">-</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-center">
                          {template?.logoUrl ? (
                            <ImageIcon className="mx-auto h-4 w-4 text-emerald-400" />
                          ) : (
                            <ImageIcon className="mx-auto h-4 w-4 text-gray-600" />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-center">
                          {template?.signatureUrl ? (
                            <PenTool className="mx-auto h-4 w-4 text-emerald-400" />
                          ) : (
                            <PenTool className="mx-auto h-4 w-4 text-gray-600" />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                          {template
                            ? formatDate(template.updatedAt)
                            : '-'}
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
                ทั้งหมด {courses.length} คอร์ส ({coursesWithTemplate.length}{' '}
                มี Template)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Platform Info Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">
            ข้อมูลแพลตฟอร์ม
          </h2>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                ชื่อแพลตฟอร์ม
              </p>
              <p className="mt-1.5 text-sm font-medium text-gray-200">
                AI Business Academy
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                สังกัด
              </p>
              <p className="mt-1.5 text-sm font-medium text-gray-200">
                คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                รูปแบบรหัส Certificate
              </p>
              <p className="mt-1.5 font-mono text-sm font-medium text-blue-400">
                AIBA-&#123;COURSECODE&#125;-&#123;YYYY&#125;-&#123;XXXX&#125;
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                เกณฑ์ผ่านการสอบ
              </p>
              <p className="mt-1.5 text-sm font-medium text-gray-200">
                70%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
