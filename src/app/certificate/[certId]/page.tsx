import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft,
  Award,
  ShieldCheck,
  Calendar,
  User,
  BookOpen,
} from 'lucide-react'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: { certId: string }
}

export default async function CertificatePage({ params }: PageProps) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // certId can be a certificateCode (e.g., AIBA-AIMKT-2026-0001) or a DB id
  const certificate = await db.certificate.findFirst({
    where: {
      OR: [
        { certificateCode: params.certId },
        { id: params.certId },
      ],
      userId: user.id, // only show the user's own certificate
    },
    include: {
      user: { select: { id: true, fullName: true, email: true } },
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          certificateTemplate: true,
        },
      },
    },
  })

  if (!certificate) notFound()

  const template = certificate.course.certificateTemplate
  const issuedDate = formatDate(certificate.issuedAt)
  const verifyUrl = `/a/certificate/${certificate.certificateCode}`

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไปหน้า Dashboard
        </Link>

        {/* Certificate Card */}
        <div className="relative overflow-hidden rounded-3xl">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-500 p-[2px]">
            <div className="h-full w-full rounded-3xl bg-[#0a1628]" />
          </div>

          <div className="relative p-1">
            <div className="rounded-[22px] bg-[#0a1628] p-8 sm:p-12">
              {/* Certificate Header */}
              <div className="mb-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <Award className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
                  Certificate of Completion
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">ประกาศนียบัตร</h1>
                <p className="mt-1 text-sm text-gray-500">
                  AI Business Academy | คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
                </p>
              </div>

              {/* Decorative line */}
              <div className="mx-auto mb-10 h-px w-48 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

              {/* Certificate Body */}
              <div className="mb-10 text-center">
                <p className="mb-2 text-sm text-gray-400">ขอมอบให้แก่</p>
                <h2 className="mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                  {certificate.user.fullName}
                </h2>
                <p className="mb-2 text-sm text-gray-400">ที่ได้สำเร็จหลักสูตร</p>
                <h3 className="mb-8 text-xl font-semibold text-white sm:text-2xl">
                  {certificate.course.title}
                </h3>

                {/* Details grid */}
                <div className="mx-auto grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <Calendar className="mx-auto mb-2 h-5 w-5 text-gray-500" />
                    <p className="text-xs text-gray-500">วันที่ออก</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">{issuedDate}</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <User className="mx-auto mb-2 h-5 w-5 text-gray-500" />
                    <p className="text-xs text-gray-500">ผู้เรียน</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">
                      {certificate.user.fullName}
                    </p>
                  </div>
                  <div className="col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:col-span-1">
                    <BookOpen className="mx-auto mb-2 h-5 w-5 text-gray-500" />
                    <p className="text-xs text-gray-500">หลักสูตร</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">
                      {certificate.course.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature */}
              {template && (
                <div className="mb-8 text-center">
                  <div className="mx-auto w-48 border-b border-white/[0.2] pb-2">
                    {template.signatureUrl ? (
                      <img
                        src={template.signatureUrl}
                        alt="Signature"
                        className="mx-auto h-12 object-contain"
                      />
                    ) : (
                      <div className="h-12" />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">{template.signerName}</p>
                  <p className="text-xs text-gray-500">{template.signerTitle}</p>
                </div>
              )}

              {/* Certificate Code */}
              <div className="mb-8 text-center">
                <p className="text-xs text-gray-500">รหัส Certificate</p>
                <p className="mt-1 font-mono text-lg font-bold tracking-widest text-blue-400">
                  {certificate.certificateCode}
                </p>
              </div>

              {/* Decorative line */}
              <div className="mx-auto mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Verification */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>
                  ตรวจสอบความถูกต้องได้ที่{' '}
                  <Link href={verifyUrl} className="text-blue-400 hover:underline">
                    {certificate.certificateCode}
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Info */}
        <div className="mt-8 rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-6 text-center">
          <ShieldCheck className="mx-auto mb-3 h-6 w-6 text-green-400" />
          <h3 className="mb-2 text-sm font-semibold text-white">การตรวจสอบความถูกต้อง</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Certificate นี้ออกโดย AI Business Academy คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
            สามารถตรวจสอบความถูกต้องได้โดยใช้รหัส Certificate ที่หน้ายืนยัน
          </p>
          <Link
            href={verifyUrl}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300"
          >
            <ShieldCheck className="h-4 w-4" />
            ตรวจสอบ Certificate
          </Link>
        </div>
      </div>
    </div>
  )
}
