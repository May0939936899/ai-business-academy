'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Palette,
  ShieldCheck,
  Calendar,
  BookOpen,
  Check,
  ExternalLink,
  Copy,
  CheckCircle,
  Linkedin,
  Facebook,
  Share2,
  Award,
  Info,
} from 'lucide-react'
import CertificatePreview from '@/components/features/CertificatePreview'
import {
  getCertificateTheme,
  CERTIFICATE_THEMES,
} from '@/lib/certificate-themes'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CertificateData {
  id: string
  certificateCode: string
  themeId: string
  issuedAt: string
  completionDate: string
  user: { id: string; fullName: string; email: string }
  course: {
    id: string
    title: string
    slug: string
    certificateTemplate: {
      logoUrl: string | null
      signatureUrl: string | null
      signerName: string
      signerTitle: string
    } | null
  }
}

interface CertificateSettingsData {
  logoUrl: string | null
  signatureUrl: string | null
  signerName: string
  signerTitle: string
  defaultThemeId: string
  enabledThemes: string[]
}

interface Props {
  certificate: CertificateData
  settings: CertificateSettingsData
  formattedDate: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CertificatePageClient({
  certificate,
  settings,
  formattedDate,
}: Props) {
  const [selectedThemeId, setSelectedThemeId] = useState(certificate.themeId)
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [verificationUrl, setVerificationUrl] = useState(
    `/verify/${certificate.certificateCode}`
  )
  const certRef = useRef<HTMLDivElement>(null)
  const themeSectionRef = useRef<HTMLDivElement>(null)

  // Build full verification URL on client
  useEffect(() => {
    setVerificationUrl(
      `${window.location.origin}/verify/${certificate.certificateCode}`
    )
  }, [certificate.certificateCode])

  const template = certificate.course.certificateTemplate

  // Available themes filtered by settings
  const availableThemes = CERTIFICATE_THEMES.filter((t) =>
    settings.enabledThemes.includes(t.id)
  )

  // ── Handlers ────────────────────────────────────────────────────────────────

  const saveTheme = useCallback(
    async (themeId: string) => {
      setSaving(true)
      try {
        await fetch(`/api/certificates/${certificate.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeId }),
        })
      } catch (err) {
        console.error('Failed to save theme:', err)
      } finally {
        setSaving(false)
      }
    },
    [certificate.id]
  )

  const handleThemeSelect = (themeId: string) => {
    setSelectedThemeId(themeId)
    saveTheme(themeId)
  }

  const handleDownload = async () => {
    if (!certRef.current) return
    setDownloading(true)

    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      // A4 landscape dimensions in mm
      const pdfWidth = 297
      const pdfHeight = 210

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      // Scale to fit and center
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const w = imgWidth * ratio
      const h = imgHeight * ratio
      const x = (pdfWidth - w) / 2
      const y = (pdfHeight - h) / 2

      pdf.addImage(imgData, 'PNG', x, y, w, h)
      pdf.save(`certificate-${certificate.certificateCode}.pdf`)
    } catch (err) {
      console.error('Failed to download certificate:', err)
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = verificationUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(verificationUrl)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      'linkedin-share',
      'width=600,height=500'
    )
  }

  const handleShareFacebook = () => {
    const url = encodeURIComponent(verificationUrl)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      'facebook-share',
      'width=600,height=500'
    )
  }

  const scrollToThemes = () => {
    themeSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไปหน้า Dashboard
        </Link>

        {/* ── Theme Selector ── */}
        <div
          ref={themeSectionRef}
          className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">
              เลือกธีม Certificate
            </h2>
            {saving && (
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                กำลังบันทึก...
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {availableThemes.map((theme) => {
              const isSelected = theme.id === selectedThemeId
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className="group relative flex flex-col items-center gap-2"
                  title={`${theme.name} (${theme.nameEn})`}
                >
                  {/* Color swatch */}
                  <div
                    className={`relative h-12 w-full rounded-xl transition-all ${
                      isSelected
                        ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#030712] scale-105'
                        : 'ring-1 ring-white/10 group-hover:ring-white/30 group-hover:scale-105'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    }}
                  >
                    {/* Accent stripe */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-xl"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                    {/* Checkmark */}
                    {isSelected && (
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/40">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Theme name */}
                  <span
                    className={`text-[10px] leading-tight transition-colors ${
                      isSelected
                        ? 'text-blue-400 font-medium'
                        : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  >
                    {theme.nameEn}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Certificate Preview ── */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm sm:p-6">
          <div className="mx-auto" style={{ maxWidth: '900px' }}>
            <CertificatePreview
              ref={certRef}
              studentName={certificate.user.fullName}
              courseName={certificate.course.title}
              certificateCode={certificate.certificateCode}
              issuedDate={formattedDate}
              themeId={selectedThemeId}
              signerName={template?.signerName ?? settings.signerName}
              signerTitle={template?.signerTitle ?? settings.signerTitle}
              signatureUrl={
                template?.signatureUrl ?? settings.signatureUrl ?? undefined
              }
              logoUrl={template?.logoUrl ?? settings.logoUrl ?? undefined}
              verificationUrl={verificationUrl}
            />
          </div>
        </div>

        {/* ── Action Buttons Row ── */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {/* Download PDF */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download className="h-4.5 w-4.5" />
            {downloading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}
          </button>

          {/* Verify */}
          <a
            href={`/verify/${certificate.certificateCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-gray-200 transition-all hover:bg-white/[0.08] hover:text-white"
          >
            <ShieldCheck className="h-4.5 w-4.5" />
            ตรวจสอบ Certificate
            <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
          </a>

          {/* Scroll to Theme Selector */}
          <button
            onClick={scrollToThemes}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-gray-200 transition-all hover:bg-white/[0.08] hover:text-white"
          >
            <Palette className="h-4.5 w-4.5" />
            เลือกธีม
          </button>
        </div>

        {/* ── Certificate Info Cards ── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2 text-gray-400">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium uppercase tracking-wider">
                รหัส Certificate
              </span>
            </div>
            <p className="font-mono text-lg font-bold tracking-wider text-blue-400">
              {certificate.certificateCode}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-medium uppercase tracking-wider">
                วันที่สำเร็จหลักสูตร
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-200">
              {formattedDate}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2 text-gray-400">
              <BookOpen className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-medium uppercase tracking-wider">
                หลักสูตร
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-200">
              {certificate.course.title}
            </p>
          </div>
        </div>

        {/* ── Share Section ── */}
        <div className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">
              แชร์ Certificate
            </h2>
          </div>
          <p className="mb-4 text-xs text-gray-500">
            คัดลอก URL สำหรับยืนยัน Certificate
            หรือแชร์ผ่านโซเชียลมีเดียเพื่อให้ผู้อื่นตรวจสอบ
          </p>

          {/* Copy URL */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2.5">
              <p className="truncate font-mono text-xs text-gray-400">
                {verificationUrl}
              </p>
            </div>
            <button
              onClick={handleCopyUrl}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-4 py-2.5 text-xs font-medium transition-all ${
                copied
                  ? 'border-green-500/30 bg-green-500/10 text-green-400'
                  : 'border-white/[0.08] bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  คัดลอกแล้ว
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  คัดลอก
                </>
              )}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleShareLinkedIn}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0077B5]/10 px-4 py-2.5 text-xs font-medium text-[#0077B5] transition-all hover:bg-[#0077B5]/20 hover:text-[#00A0DC]"
            >
              <Linkedin className="h-4 w-4" />
              Share on LinkedIn
            </button>
            <button
              onClick={handleShareFacebook}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#1877F2]/10 px-4 py-2.5 text-xs font-medium text-[#1877F2] transition-all hover:bg-[#1877F2]/20 hover:text-[#4599FF]"
            >
              <Facebook className="h-4 w-4" />
              Share on Facebook
            </button>
          </div>
        </div>

        {/* ── Verification Info ── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center backdrop-blur-sm">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <Award className="h-5 w-5 text-green-400" />
          </div>
          <h3 className="mb-2 text-sm font-semibold text-white">
            การรับรองจาก AI Business Academy
          </h3>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-400">
            Certificate นี้ออกโดย AI Business Academy คณะบริหารธุรกิจ
            มหาวิทยาลัยศรีปทุม
            สามารถตรวจสอบความถูกต้องได้ตลอดเวลาผ่านระบบยืนยันออนไลน์
            โดยใช้รหัส Certificate หรือ QR Code บนใบประกาศ
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <Info className="h-3.5 w-3.5" />
            <span>
              Issued and verified by AI Business Academy, Sripatum University
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
