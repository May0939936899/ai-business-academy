'use client'

import { useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Palette,
  ShieldCheck,
  Calendar,
  BookOpen,
  Check,
} from 'lucide-react'
import CertificatePreview from '@/components/features/CertificatePreview'
import {
  getCertificateTheme,
  CERTIFICATE_THEMES,
  type CertificateTheme,
} from '@/lib/certificate-themes'

interface CertificateData {
  id: string
  certificateCode: string
  themeId: string
  issuedAt: string
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

export default function CertificatePageClient({
  certificate,
  settings,
  formattedDate,
}: Props) {
  const [selectedThemeId, setSelectedThemeId] = useState(certificate.themeId)
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const certRef = useRef<HTMLDivElement>(null)

  const template = certificate.course.certificateTemplate
  const verifyUrl = `/a/certificate/${certificate.certificateCode}`

  // Available themes filtered by settings
  const availableThemes = CERTIFICATE_THEMES.filter((t) =>
    settings.enabledThemes.includes(t.id)
  )

  const selectedTheme = getCertificateTheme(selectedThemeId)

  // Save theme choice to DB
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

  // Download as PDF using html2canvas + jsPDF
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

      // Scale to fit
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

        {/* Theme Selector */}
        <div className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">เลือกธีม Certificate</h2>
            {saving && (
              <span className="ml-2 text-xs text-gray-500">กำลังบันทึก...</span>
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
                        ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#030712]'
                        : 'ring-1 ring-white/10 group-hover:ring-white/30'
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
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Theme name */}
                  <span className="text-[10px] leading-tight text-gray-500 group-hover:text-gray-300">
                    {theme.nameEn}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-6">
          <div className="mx-auto" style={{ maxWidth: '800px' }}>
            <CertificatePreview
              ref={certRef}
              studentName={certificate.user.fullName}
              courseName={certificate.course.title}
              certificateCode={certificate.certificateCode}
              issuedDate={formattedDate}
              themeId={selectedThemeId}
              signerName={template?.signerName ?? settings.signerName}
              signerTitle={template?.signerTitle ?? settings.signerTitle}
              signatureUrl={template?.signatureUrl ?? settings.signatureUrl ?? undefined}
              logoUrl={template?.logoUrl ?? settings.logoUrl ?? undefined}
            />
          </div>
        </div>

        {/* Download Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 disabled:opacity-60"
          >
            <Download className="h-5 w-5" />
            {downloading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}
          </button>
        </div>

        {/* Certificate Info Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-2 flex items-center gap-2 text-gray-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">รหัส Certificate</span>
            </div>
            <p className="font-mono text-lg font-bold tracking-wider text-blue-400">
              {certificate.certificateCode}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-2 flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">วันที่ออก</span>
            </div>
            <p className="text-lg font-semibold text-gray-200">{formattedDate}</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-2 flex items-center gap-2 text-gray-400">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">หลักสูตร</span>
            </div>
            <p className="text-lg font-semibold text-gray-200">{certificate.course.title}</p>
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
