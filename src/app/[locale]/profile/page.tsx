'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  User,
  Save,
  Mail,
  MapPin,
  Briefcase,
  Award,
  Loader2,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserProfile {
  id: string
  email: string
  fullName: string
  fullNameForCertificate: string | null
  country: string | null
  position: string | null
  image: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const { status } = useSession()
  const locale = useLocale()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // Editable fields
  const [certName, setCertName] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`)
    }
  }, [status, router, locale])

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      const json = await res.json()
      if (json.success && json.data) {
        setProfile(json.data)
        setCertName(json.data.fullNameForCertificate || json.data.fullName || '')
      }
    } catch {
      setError('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, fetchProfile])

  const handleSave = async () => {
    if (!certName.trim() || certName.trim().length < 2) {
      setError('กรุณากรอกชื่อ-นามสกุลอย่างน้อย 2 ตัวอักษร')
      return
    }
    if (certName.trim().length > 100) {
      setError('ชื่อ-นามสกุลต้องไม่เกิน 100 ตัวอักษร')
      return
    }

    setError('')
    setSaving(true)
    setSaved(false)

    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullNameForCertificate: certName.trim(),
          country: profile?.country,
          position: profile?.position,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(data.message || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-blue-600/[0.06] via-transparent to-transparent" />

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {/* Back */}
        <button
          onClick={() => router.push(`/${locale}/dashboard`)}
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไปแดชบอร์ด
        </button>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          {profile.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={profile.image}
              alt={profile.fullName}
              className="h-16 w-16 rounded-full ring-2 ring-white/10"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-xl font-bold text-white ring-2 ring-white/10">
              {(profile.fullName || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">โปรไฟล์ของฉัน</h1>
            <p className="text-sm text-gray-400">จัดการข้อมูลส่วนตัวและชื่อสำหรับใบประกาศ</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Success */}
        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            บันทึกข้อมูลเรียบร้อยแล้ว
          </div>
        )}

        {/* Certificate Name — Editable */}
        <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
          <div className="mb-5 flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">ชื่อสำหรับใบประกาศนียบัตร</h2>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              ชื่อ – นามสกุล (สำหรับใบประกาศ)
            </label>
            <input
              type="text"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              placeholder="กรอกชื่อ-นามสกุลที่ต้องการให้แสดงบนใบประกาศ"
              maxLength={100}
              className={cn(
                'w-full rounded-xl border py-3.5 pl-4 pr-4 text-sm transition-all',
                'border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-500',
                'focus:border-blue-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
              )}
            />
            <p className="mt-1.5 text-xs text-gray-500">
              ชื่อนี้จะแสดงบนใบประกาศนียบัตรทุกใบของคุณ
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all',
              saving
                ? 'cursor-not-allowed bg-blue-500/30'
                : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.98]'
            )}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>

        {/* Read-Only Info */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
          <div className="mb-5 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">ข้อมูลบัญชี</h2>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">
                <User className="h-3.5 w-3.5" />
                ชื่อ-นามสกุล
              </div>
              <p className="text-sm text-gray-200">{profile.fullName}</p>
            </div>

            {/* Email */}
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">
                <Mail className="h-3.5 w-3.5" />
                อีเมล
              </div>
              <p className="text-sm text-gray-200">{profile.email}</p>
            </div>

            {/* Country */}
            {profile.country && (
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  ประเทศ
                </div>
                <p className="text-sm text-gray-200">{profile.country}</p>
              </div>
            )}

            {/* Position */}
            {profile.position && (
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <Briefcase className="h-3.5 w-3.5" />
                  ตำแหน่งงาน
                </div>
                <p className="text-sm text-gray-200">{profile.position}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
