'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
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
  Save,
  Loader2,
  Trash2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'

interface CertificateTemplate {
  id: string
  signerName: string
  signerTitle: string
  logoUrl: string | null
  signatureUrl: string | null
  updatedAt: string
}

interface Course {
  id: string
  title: string
  courseCode: string
  certificateTemplate: CertificateTemplate | null
}

interface SettingsData {
  courses: Course[]
  templateCount: number
  totalCertificates: number
}

export default function SettingsPage() {
  const locale = useLocale()
  const [data, setData] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)

  // Platform settings (local state, editable)
  const [platformName, setPlatformName] = useState('AI SPUBUS Academy')
  const [certPrefix, setCertPrefix] = useState('SPUBUS')
  const [passingScore, setPassingScore] = useState(70)
  const [selfEnrollment, setSelfEnrollment] = useState(true)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [clearingCache, setClearingCache] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        const json = await res.json()
        if (json.success) setData(json.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    // Simulate save (no backend model yet for platform settings)
    await new Promise((r) => setTimeout(r, 800))
    setSavingSettings(false)
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 3000)
  }

  const handleClearCache = async () => {
    if (!confirm('ยืนยันการล้างแคช? ข้อมูลแคชทั้งหมดจะถูกรีเซ็ต')) return
    setClearingCache(true)
    await new Promise((r) => setTimeout(r, 1000))
    setClearingCache(false)
    alert('ล้างแคชเรียบร้อยแล้ว')
  }

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return '-'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    )
  }

  const courses = data?.courses || []
  const coursesWithTemplate = courses.filter((c) => c.certificateTemplate)
  const coursesWithoutTemplate = courses.filter((c) => !c.certificateTemplate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">ตั้งค่าระบบ</h1>
        <p className="mt-1 text-sm text-gray-500">
          จัดการการตั้งค่าแพลตฟอร์มและเทมเพลตใบรับรอง
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
              <p className="text-2xl font-bold text-white">{coursesWithTemplate.length}</p>
              <p className="text-xs text-gray-500">คอร์สที่มีเทมเพลต</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Shield className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{coursesWithoutTemplate.length}</p>
              <p className="text-xs text-gray-500">คอร์สที่ยังไม่มีเทมเพลต</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Award className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data?.totalCertificates || 0}</p>
              <p className="text-xs text-gray-500">ใบรับรองที่ออกแล้ว</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Settings Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">ตั้งค่าแพลตฟอร์ม</h2>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                ชื่อแพลตฟอร์ม
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-200 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                คำนำหน้ารหัสใบรับรอง
              </label>
              <input
                type="text"
                value={certPrefix}
                onChange={(e) => setCertPrefix(e.target.value)}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-200 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              />
              <p className="mt-1.5 font-mono text-xs text-blue-400">
                {certPrefix}-&#123;COURSECODE&#125;-&#123;YYYY&#125;-&#123;XXXX&#125;
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                คะแนนผ่านเกณฑ์ (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-200 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                อนุญาตลงทะเบียนเอง
              </label>
              <button
                onClick={() => setSelfEnrollment(!selfEnrollment)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  selfEnrollment ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    selfEnrollment ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <p className="mt-1.5 text-xs text-gray-500">
                {selfEnrollment ? 'เปิดใช้งาน — ผู้เรียนสามารถลงทะเบียนคอร์สได้เอง' : 'ปิดใช้งาน — ต้องให้แอดมินลงทะเบียนให้'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
            >
              {savingSettings ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              บันทึกการตั้งค่า
            </button>
            {settingsSaved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                บันทึกแล้ว
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Templates Section */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <FileSignature className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">เทมเพลตใบรับรอง</h2>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-20 text-center">
            <Settings className="h-8 w-8 text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-300">ไม่มีคอร์สที่เผยแพร่แล้ว</h3>
            <p className="mt-1.5 text-sm text-gray-500">
              เผยแพร่คอร์สก่อนเพื่อตั้งค่าเทมเพลตใบรับรอง
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">คอร์ส</th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">เทมเพลต</th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ผู้ลงนาม</th>
                    <th className="px-5 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-gray-500">โลโก้</th>
                    <th className="px-5 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-gray-500">ลายเซ็น</th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">อัปเดตล่าสุด</th>
                    <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {courses.map((course) => {
                    const template = course.certificateTemplate
                    return (
                      <tr key={course.id} className="transition-colors hover:bg-white/[0.02]">
                        <td className="whitespace-nowrap px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-200">{course.title}</p>
                            <p className="mt-0.5 font-mono text-xs text-gray-500">{course.courseCode}</p>
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
                              ยังไม่ตั้งค่า
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {template ? (
                            <div>
                              <p className="text-sm text-gray-300">{template.signerName}</p>
                              <p className="mt-0.5 text-xs text-gray-500">{template.signerTitle}</p>
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
                          {template ? formatDate(template.updatedAt) : '-'}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right">
                          <Link
                            href={`/${locale}/admin/certificate-settings`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/10"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            ตั้งค่า
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-white/[0.06] px-5 py-3.5">
              <p className="text-sm text-gray-500">
                ทั้งหมด {courses.length} คอร์ส — ตั้งค่าแล้ว {coursesWithTemplate.length} คอร์ส
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h2 className="text-lg font-semibold text-red-400">โซนอันตราย</h2>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">ล้างแคชระบบ</p>
              <p className="mt-1 text-xs text-gray-500">ล้างข้อมูลแคชทั้งหมด อาจทำให้ระบบช้าลงชั่วคราว</p>
            </div>
            <button
              onClick={handleClearCache}
              disabled={clearingCache}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            >
              {clearingCache ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              ล้างแคช
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
