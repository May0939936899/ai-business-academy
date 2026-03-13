import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Award,
  ShieldCheck,
  Calendar,
  User,
  BookOpen,
  CheckCircle2,
  XCircle,
  Home,
} from 'lucide-react'
import db from '@/lib/db'
import { formatDate } from '@/lib/utils'
import QRCode from 'qrcode'

interface PageProps {
  params: { certId: string }
}

// ─── Open Graph Metadata ──────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { certId } = await params

  const certificate = await db.certificate.findUnique({
    where: { certificateCode: certId },
    include: {
      user: { select: { fullName: true } },
      course: { select: { title: true } },
    },
  })

  if (!certificate) {
    return {
      title: 'Certificate Not Found | AI Business Academy',
      description: 'ไม่พบ Certificate ที่ค้นหา กรุณาตรวจสอบรหัสอีกครั้ง',
    }
  }

  const title = `ยืนยัน Certificate - ${certificate.user.fullName} | AI Business Academy`
  const description = `Certificate ยืนยันว่า ${certificate.user.fullName} ได้สำเร็จหลักสูตร "${certificate.course.title}" จาก AI Business Academy คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม`
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-academy-lime.vercel.app'
  const verifyUrl = `${baseUrl}/verify/${certificate.certificateCode}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: verifyUrl,
      siteName: 'AI Business Academy',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { certId } = await params

  const certificate = await db.certificate.findUnique({
    where: { certificateCode: certId },
    include: {
      user: { select: { fullName: true } },
      course: {
        select: {
          title: true,
          slug: true,
          certificateTemplate: true,
        },
      },
    },
  })

  // Also fetch global CertificateSettings
  const settings = await db.certificateSettings.findUnique({
    where: { id: 'global' },
  })

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-academy-lime.vercel.app'
  const verifyUrl = `${baseUrl}/verify/${certId}`

  // ── Not Found ─────────────────────────────────────────────────────────────

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#030712]">
        <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          {/* Red icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
            <XCircle className="h-10 w-10 text-red-400" />
          </div>

          <h1 className="mb-3 text-2xl font-bold text-white">
            ไม่พบ Certificate
          </h1>
          <p className="mb-2 text-gray-400">
            รหัส Certificate ที่ค้นหาไม่ถูกต้องหรือไม่มีในระบบ
          </p>

          {/* Searched code */}
          <div className="mx-auto mb-6 inline-block rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2">
            <p className="font-mono text-sm text-gray-500">
              &ldquo;{certId}&rdquo;
            </p>
          </div>

          <p className="mb-8 text-sm leading-relaxed text-gray-500">
            กรุณาตรวจสอบรหัสอีกครั้งว่าถูกต้อง
            หรือติดต่อผู้ดูแลระบบหากคุณเชื่อว่าเกิดข้อผิดพลาด
            รหัส Certificate จะอยู่บนใบประกาศนียบัตร หรือใน QR Code
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110"
          >
            <Home className="h-4 w-4" />
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    )
  }

  // ── Certificate Found ─────────────────────────────────────────────────────

  const template = certificate.course.certificateTemplate
  const completionDate = formatDate(certificate.completionDate)
  const signerName =
    template?.signerName ||
    settings?.signerName ||
    'ผศ.ดร.รวิภา อัครจินดานนท์'
  const signerTitle =
    template?.signerTitle ||
    settings?.signerTitle ||
    'คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม'

  // Generate QR Code as data URL (white on transparent)
  let qrDataUrl: string | null = null
  try {
    qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 160,
      margin: 2,
      color: {
        dark: '#ffffff',
        light: '#00000000',
      },
    })
  } catch {
    // QR generation failed, will skip display
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* AI Business Academy Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/10">
            <Award className="h-6 w-6 text-blue-400" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            AI Business Academy
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
          </p>
        </div>

        {/* Green Valid Banner */}
        <div className="mb-8 flex items-center justify-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 px-6 py-4 backdrop-blur-sm">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-green-400" />
          <div>
            <p className="font-semibold text-green-400">
              &#10003; Certificate ถูกต้อง (Valid)
            </p>
            <p className="text-sm text-gray-400">
              ยืนยันแล้วโดย AI Business Academy มหาวิทยาลัยศรีปทุม
            </p>
          </div>
        </div>

        {/* ── Certificate Card ── */}
        <div className="relative overflow-hidden rounded-3xl">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-500 p-[2px]">
            <div className="h-full w-full rounded-3xl bg-[#0a1628]" />
          </div>

          <div className="relative p-1">
            <div className="rounded-[22px] bg-[#0a1628] p-8 sm:p-12">
              {/* Header */}
              <div className="mb-10 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
                  Certificate of Completion
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                  ประกาศนียบัตร
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  AI Business Academy | คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
                </p>
              </div>

              {/* Divider */}
              <div className="mx-auto mb-10 h-px w-48 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

              {/* Student Name */}
              <div className="mb-10 text-center">
                <p className="mb-2 text-sm text-gray-400">ขอมอบให้แก่</p>
                <h2 className="mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                  {certificate.user.fullName}
                </h2>

                {/* Course Title */}
                <p className="mb-2 text-sm text-gray-400">
                  ที่ได้สำเร็จหลักสูตร
                </p>
                <h3 className="mb-8 text-xl font-semibold text-white sm:text-2xl">
                  {certificate.course.title}
                </h3>

                {/* Info Cards */}
                <div className="mx-auto grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <Calendar className="mx-auto mb-2 h-5 w-5 text-gray-500" />
                    <p className="text-xs text-gray-500">วันที่สำเร็จ</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">
                      {completionDate}
                    </p>
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

              {/* Signature Section */}
              <div className="mb-8 text-center">
                <div className="mx-auto w-48 border-b border-white/[0.2] pb-2">
                  {template?.signatureUrl || settings?.signatureUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={template?.signatureUrl || settings?.signatureUrl || ''}
                      alt="Signature"
                      className="mx-auto h-12 object-contain"
                    />
                  ) : (
                    <div className="h-12" />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-white">
                  {signerName}
                </p>
                <p className="text-xs text-gray-500">{signerTitle}</p>
              </div>

              {/* Certificate Code */}
              <div className="mb-6 text-center">
                <p className="text-xs text-gray-500">รหัส Certificate</p>
                <p className="mt-1 font-mono text-lg font-bold tracking-widest text-blue-400">
                  {certificate.certificateCode}
                </p>
              </div>

              {/* Divider */}
              <div className="mx-auto h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* QR Code & Verification */}
              <div className="mt-6 flex flex-col items-center gap-4">
                {qrDataUrl && (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt="QR Code สำหรับตรวจสอบ Certificate"
                      width={120}
                      height={120}
                      className="block"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span>
                    Certificate ถูกต้อง — ยืนยันโดย AI Business Academy
                  </span>
                </div>
                <p className="break-all text-center font-mono text-[10px] text-gray-600">
                  {verifyUrl}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer — Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <Home className="h-4 w-4" />
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  )
}
