import { Suspense } from 'react'
import Link from 'next/link'
import {
  Award,
  Calendar,
  BookOpen,
  Users,
} from 'lucide-react'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import { CERTIFICATE_THEMES } from '@/lib/certificate-themes'
import CertificateActions from '@/components/admin/CertificateActions'
import CertificateSearch from '@/components/admin/CertificateSearch'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function CertificatesPage({ searchParams }: PageProps) {
  await requireAdmin()

  const { q } = await searchParams
  const searchQuery = q?.trim() || ''

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Build search where clause
  const whereClause = searchQuery
    ? {
        OR: [
          { certificateCode: { contains: searchQuery, mode: 'insensitive' as const } },
          { user: { fullName: { contains: searchQuery, mode: 'insensitive' as const } } },
          { user: { email: { contains: searchQuery, mode: 'insensitive' as const } } },
          { course: { title: { contains: searchQuery, mode: 'insensitive' as const } } },
        ],
      }
    : {}

  const [
    certificates,
    totalCount,
    thisMonthCount,
    uniqueCoursesCount,
    uniqueStudentsCount,
    filteredCount,
  ] = await Promise.all([
    db.certificate.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            image: true,
          },
        },
        course: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    }),
    db.certificate.count(),
    db.certificate.count({
      where: { issuedAt: { gte: startOfMonth } },
    }),
    db.certificate.groupBy({
      by: ['courseId'],
      _count: true,
    }).then((groups) => groups.length),
    db.certificate.groupBy({
      by: ['userId'],
      _count: true,
    }).then((groups) => groups.length),
    searchQuery ? db.certificate.count({ where: whereClause }) : null,
  ])

  // Build theme lookup map
  const themeMap = new Map(CERTIFICATE_THEMES.map((t) => [t.id, t]))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">จัดการ Certificate</h1>
        <p className="mt-1 text-sm text-gray-500">
          ดูและจัดการ Certificate ที่ออกให้ผู้เรียน
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Certificates */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Award className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalCount}</p>
              <p className="text-xs text-gray-500">ออกทั้งหมด</p>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <Calendar className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{thisMonthCount}</p>
              <p className="text-xs text-gray-500">เดือนนี้</p>
            </div>
          </div>
        </div>

        {/* Unique Courses */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <BookOpen className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{uniqueCoursesCount}</p>
              <p className="text-xs text-gray-500">คอร์สที่มี Certificate</p>
            </div>
          </div>
        </div>

        {/* Unique Students */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Users className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{uniqueStudentsCount}</p>
              <p className="text-xs text-gray-500">ผู้เรียนที่ได้รับ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Suspense fallback={
        <div className="h-[50px] animate-pulse rounded-xl border border-white/[0.06] bg-[#0a1628]/50" />
      }>
        <CertificateSearch />
      </Suspense>

      {/* Search result indicator */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>
            ผลการค้นหา &quot;{searchQuery}&quot; &mdash; พบ{' '}
            <span className="font-medium text-white">{filteredCount}</span> รายการ
          </span>
        </div>
      )}

      {/* Table */}
      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-20 text-center">
          <Award className="h-8 w-8 text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-300">
            {searchQuery ? 'ไม่พบผลลัพธ์' : 'ยังไม่มี Certificate'}
          </h3>
          <p className="mt-1.5 text-sm text-gray-500">
            {searchQuery
              ? `ไม่พบ Certificate ที่ตรงกับ "${searchQuery}"`
              : 'Certificate จะออกให้อัตโนมัติเมื่อผู้เรียนสอบผ่าน'}
          </p>
          {searchQuery && (
            <Link
              href="/admin/certificates"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/[0.1] hover:text-white"
            >
              ล้างการค้นหา
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Certificate ID
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ผู้เรียน
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    คอร์ส
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ธีม
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
                {certificates.map((cert) => {
                  const initial =
                    (cert.user.fullName || cert.user.email)[0]?.toUpperCase() || '?'
                  const theme = themeMap.get(cert.themeId)

                  return (
                    <tr
                      key={cert.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      {/* Certificate ID */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="rounded-md bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-medium text-purple-400">
                          {cert.certificateCode}
                        </span>
                      </td>

                      {/* Student */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          {cert.user.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={cert.user.image}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xs font-bold text-blue-300">
                              {initial}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-200">
                              {cert.user.fullName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cert.user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="max-w-[200px] truncate whitespace-nowrap px-5 py-4 text-sm text-gray-400">
                        {cert.course.title}
                      </td>

                      {/* Theme */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full ring-1 ring-white/10"
                            style={{
                              backgroundColor: theme?.primaryColor || '#6D28D9',
                            }}
                          />
                          <span className="text-xs text-gray-400">
                            {theme?.nameEn || cert.themeId}
                          </span>
                        </div>
                      </td>

                      {/* Issued Date */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {formatDate(cert.issuedAt)}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex items-center justify-end">
                          <CertificateActions
                            certificateCode={cert.certificateCode}
                            previewUrl={`/certificate/${cert.certificateCode}`}
                            verifyUrl={`/verify/${cert.certificateCode}`}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5">
            <p className="text-sm text-gray-500">
              {searchQuery ? (
                <>
                  แสดง {certificates.length} จาก {totalCount} รายการ
                </>
              ) : (
                <>ทั้งหมด {certificates.length} รายการ</>
              )}
            </p>
            <div className="text-xs text-gray-600">
              {/* Pagination placeholder — ready for future implementation */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
