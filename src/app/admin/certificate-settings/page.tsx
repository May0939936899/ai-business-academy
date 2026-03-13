'use client'

import { useEffect, useState, useCallback } from 'react'
import { Settings, Save, Award, Palette, Eye, EyeOff, QrCode } from 'lucide-react'
import { CERTIFICATE_THEMES } from '@/lib/certificate-themes'
import CertificatePreview from '@/components/features/CertificatePreview'
import { cn } from '@/lib/utils'

interface CertificateSettingsData {
  id: string
  signerName: string
  signerTitle: string
  certificatePrefix: string
  defaultThemeId: string
  enabledThemes: string[]
}

export default function CertificateSettingsPage() {
  const [settings, setSettings] = useState<CertificateSettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form state
  const [signerName, setSignerName] = useState('')
  const [signerTitle, setSignerTitle] = useState('')
  const [certificatePrefix, setCertificatePrefix] = useState('')
  const [defaultThemeId, setDefaultThemeId] = useState('executive-navy')
  const [enabledThemes, setEnabledThemes] = useState<string[]>([])
  const [enableQrCode, setEnableQrCode] = useState(true)
  const [verificationBaseUrl, setVerificationBaseUrl] = useState('')

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/certificate-settings')
      const json = await res.json()
      if (json.success && json.data) {
        const data = json.data as CertificateSettingsData
        setSettings(data)
        setSignerName(data.signerName)
        setSignerTitle(data.signerTitle)
        setCertificatePrefix(data.certificatePrefix)
        setDefaultThemeId(data.defaultThemeId)
        setEnabledThemes(data.enabledThemes)
        if ('enableQrCode' in data) setEnableQrCode((data as Record<string, unknown>).enableQrCode as boolean)
        if ('verificationBaseUrl' in data) setVerificationBaseUrl((data as Record<string, unknown>).verificationBaseUrl as string || '')
      }
    } catch {
      setAlert({ type: 'error', message: 'ไม่สามารถโหลดข้อมูลการตั้งค่าได้' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = async () => {
    setSaving(true)
    setAlert(null)
    try {
      const res = await fetch('/api/admin/certificate-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signerName,
          signerTitle,
          certificatePrefix,
          defaultThemeId,
          enabledThemes,
          enableQrCode,
          verificationBaseUrl,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setSettings(json.data)
        setAlert({ type: 'success', message: 'บันทึกการตั้งค่าสำเร็จ' })
      } else {
        setAlert({ type: 'error', message: json.error || 'เกิดข้อผิดพลาด' })
      }
    } catch {
      setAlert({ type: 'error', message: 'ไม่สามารถบันทึกการตั้งค่าได้' })
    } finally {
      setSaving(false)
    }
  }

  const toggleTheme = (themeId: string) => {
    setEnabledThemes((prev) =>
      prev.includes(themeId)
        ? prev.filter((id) => id !== themeId)
        : [...prev, themeId]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">ตั้งค่า Certificate</h1>
        <p className="mt-1 text-sm text-gray-500">
          จัดการข้อมูลผู้ลงนาม, รูปแบบรหัส และธีมของ Certificate
        </p>
      </div>

      {/* Alert */}
      {alert && (
        <div
          className={cn(
            'rounded-xl border px-4 py-3 text-sm',
            alert.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400'
          )}
        >
          {alert.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Left Column: Form */}
        <div className="space-y-6">
          {/* Signer Info */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="mb-5 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">ข้อมูลผู้ลงนาม</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  ชื่อผู้ลงนาม
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-white/[0.06]"
                  placeholder="ผศ.ดร.รวิภา อัครจินดานนท์"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  ตำแหน่งผู้ลงนาม
                </label>
                <input
                  type="text"
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-white/[0.06]"
                  placeholder="คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Certificate Prefix
                </label>
                <input
                  type="text"
                  value={certificatePrefix}
                  onChange={(e) => setCertificatePrefix(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 font-mono text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-white/[0.06]"
                  placeholder="SPUBUS"
                />
                <p className="mt-1.5 text-xs text-gray-600">
                  ใช้เป็นตัวนำหน้ารหัส Certificate เช่น {certificatePrefix || 'SPUBUS'}-AIMKT-2026-0001
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Settings */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="mb-5 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">QR Code บน Certificate</h2>
            </div>

            <div className="space-y-4">
              {/* Enable QR Code Toggle */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.04] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    แสดง QR Code บน Certificate
                  </p>
                  <p className="text-xs text-gray-500">
                    QR Code สำหรับตรวจสอบความถูกต้องจะแสดงที่มุมขวาล่างของ Certificate
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={enableQrCode}
                    onChange={(e) => setEnableQrCode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="h-6 w-11 rounded-full bg-white/10 transition-colors peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500/30" />
                  <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                </div>
              </label>

              {/* Verification Base URL */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Verification Base URL
                </label>
                <input
                  type="url"
                  value={verificationBaseUrl}
                  onChange={(e) => setVerificationBaseUrl(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 font-mono text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-blue-500/50 focus:bg-white/[0.06]"
                  placeholder="https://ai-academy.spu.ac.th"
                  disabled={!enableQrCode}
                />
                <p className="mt-1.5 text-xs text-gray-600">
                  URL หลักสำหรับสร้าง QR Code ยืนยัน เช่น {verificationBaseUrl || 'https://ai-academy.spu.ac.th'}/verify/CERT-CODE
                </p>
              </div>

              {/* QR Preview */}
              {enableQrCode && (
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                    ตัวอย่าง QR Code
                  </p>
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                        `${verificationBaseUrl || 'https://ai-academy.spu.ac.th'}/verify/${certificatePrefix || 'SPUBUS'}-AIMKT-2026-0001`
                      )}`}
                      alt="QR Preview"
                      className="h-20 w-20 rounded"
                    />
                    <div className="text-xs text-gray-500">
                      <p className="mb-1 font-medium text-gray-400">QR จะนำไปสู่:</p>
                      <p className="break-all font-mono">
                        {verificationBaseUrl || 'https://ai-academy.spu.ac.th'}/verify/{certificatePrefix || 'SPUBUS'}-AIMKT-2026-0001
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Theme Settings */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="mb-5 flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">ธีม Certificate</h2>
            </div>

            <div className="space-y-4">
              {/* Default Theme */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  ธีมเริ่มต้น
                </label>
                <select
                  value={defaultThemeId}
                  onChange={(e) => setDefaultThemeId(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors focus:border-blue-500/50 focus:bg-white/[0.06]"
                >
                  {CERTIFICATE_THEMES.map((theme) => (
                    <option key={theme.id} value={theme.id} className="bg-[#0a1628] text-gray-200">
                      {theme.name} ({theme.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Enable/Disable */}
              <div>
                <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  เปิด/ปิด ธีม
                </label>
                <div className="space-y-2">
                  {CERTIFICATE_THEMES.map((theme) => {
                    const isEnabled = enabledThemes.includes(theme.id)
                    return (
                      <label
                        key={theme.id}
                        className={cn(
                          'flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors',
                          isEnabled
                            ? 'border-white/[0.08] bg-white/[0.04]'
                            : 'border-white/[0.04] bg-white/[0.01] opacity-60'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {/* Theme color swatch */}
                          <div
                            className="h-5 w-5 rounded-full ring-1 ring-white/10"
                            style={{ background: theme.primaryColor }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-200">
                              {theme.name}
                            </p>
                            <p className="text-xs text-gray-500">{theme.nameEn}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isEnabled ? (
                            <Eye className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-600" />
                          )}
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={() => toggleTheme(theme.id)}
                            className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0"
                          />
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all',
              saving
                ? 'cursor-not-allowed bg-blue-500/30'
                : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.98]'
            )}
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
          </button>
        </div>

        {/* Right Column: Live Preview */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="mb-5 flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">ตัวอย่าง Certificate</h2>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/[0.06]">
              <CertificatePreview
                studentName="นายสมชาย ใจดี"
                courseName="AI for Marketing Strategy"
                certificateCode={`${certificatePrefix || 'SPUBUS'}-AIMKT-2026-0001`}
                issuedDate="13 มีนาคม 2569"
                themeId={defaultThemeId}
                signerName={signerName}
                signerTitle={signerTitle}
                verificationUrl={
                  enableQrCode
                    ? `${verificationBaseUrl || 'https://ai-academy.spu.ac.th'}/verify/${certificatePrefix || 'SPUBUS'}-AIMKT-2026-0001`
                    : undefined
                }
              />
            </div>

            <p className="mt-3 text-center text-xs text-gray-600">
              ตัวอย่างแสดงผลด้วยข้อมูลจำลอง &middot; ธีม:{' '}
              <span className="text-gray-400">
                {CERTIFICATE_THEMES.find((t) => t.id === defaultThemeId)?.name || defaultThemeId}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
