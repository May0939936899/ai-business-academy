'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  Search,
  ChevronDown,
  Check,
  Building2,
  Target,
  Lightbulb,
  BookOpen,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Constants ───────────────────────────────────────────────────────────────

const COUNTRIES = [
  'ไทย', 'สหรัฐอเมริกา', 'สหราชอาณาจักร', 'ออสเตรเลีย', 'แคนาดา',
  'ญี่ปุ่น', 'จีน', 'เกาหลีใต้', 'สิงคโปร์', 'มาเลเซีย',
  'อินโดนีเซีย', 'ฟิลิปปินส์', 'เวียดนาม', 'อินเดีย', 'เยอรมนี',
  'ฝรั่งเศส', 'อิตาลี', 'สเปน', 'เนเธอร์แลนด์', 'สวีเดน',
  'นอร์เวย์', 'เดนมาร์ก', 'ฟินแลนด์', 'สวิตเซอร์แลนด์', 'เบลเยียม',
  'ออสเตรีย', 'โปรตุเกส', 'กรีซ', 'โปแลนด์', 'เช็กเกีย',
  'ฮังการี', 'โรมาเนีย', 'รัสเซีย', 'ตุรกี', 'ซาอุดีอาระเบีย',
  'สหรัฐอาหรับเอมิเรตส์', 'อิสราเอล', 'อียิปต์', 'แอฟริกาใต้',
  'เม็กซิโก', 'บราซิล', 'นิวซีแลนด์', 'เมียนมาร์', 'กัมพูชา', 'ลาว',
  'ไอร์แลนด์', 'อื่นๆ',
]

const POSITIONS = [
  'นักศึกษา', 'นักศึกษาปริญญาโท', 'นักศึกษาปริญญาเอก',
  'ผู้ประกอบการ / เจ้าของธุรกิจ', 'CEO / ผู้บริหารระดับสูง',
  'CTO / ผู้อำนวยการฝ่ายเทคโนโลยี', 'CMO / ผู้อำนวยการฝ่ายการตลาด',
  'ผู้จัดการทั่วไป', 'ผู้จัดการฝ่ายการตลาด', 'ผู้จัดการฝ่าย HR',
  'ผู้จัดการฝ่ายไอที', 'ผู้จัดการโครงการ',
  'ผู้จัดการผลิตภัณฑ์ (Product Manager)', 'นักการตลาด', 'นักการตลาดดิจิทัล',
  'นักวิเคราะห์ข้อมูล (Data Analyst)', 'วิศวกรซอฟต์แวร์ (Software Engineer)',
  'วิศวกร AI / Machine Learning', 'นักพัฒนาเว็บ (Web Developer)',
  'UI/UX Designer', 'Content Creator / นักสร้างคอนเทนต์',
  'นักวิเคราะห์ธุรกิจ (Business Analyst)', 'ครู / อาจารย์',
  'อาจารย์มหาวิทยาลัย', 'นักวิจัย', 'ฟรีแลนซ์', 'อื่นๆ',
]

const INTEREST_AREAS = [
  { id: 'ai-automation', label: 'AI Automation' },
  { id: 'ai-marketing', label: 'AI Marketing' },
  { id: 'ai-hr', label: 'AI for HR' },
  { id: 'ai-productivity', label: 'AI Productivity' },
  { id: 'ai-analytics', label: 'AI Analytics' },
  { id: 'ai-management', label: 'AI for Management' },
]

const LEARNING_GOALS = [
  { id: 'work', label: 'พัฒนาทักษะเพื่อการทำงาน' },
  { id: 'business', label: 'นำไปใช้กับธุรกิจ' },
  { id: 'teaching', label: 'นำไปสอน / แบ่งปันความรู้' },
  { id: 'personal', label: 'พัฒนาตนเอง' },
]

interface UserProfile {
  id: string
  email: string
  fullName: string
  fullNameForCertificate: string | null
  country: string | null
  organization: string | null
  position: string | null
  interestArea: string[]
  learningGoal: string | null
  image: string | null
}

// ─── SearchableDropdown ──────────────────────────────────────────────────────

function SearchableDropdown({
  value, onChange, options, placeholder, icon, label,
}: {
  value: string; onChange: (val: string) => void; options: string[]
  placeholder: string; icon: React.ReactNode; label: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false); setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50) }, [open])

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-xl border py-3 pl-10 pr-4 text-sm transition-all text-left',
          open ? 'border-blue-500/50 bg-white/[0.06] ring-1 ring-blue-500/20'
            : 'border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06]',
          value ? 'text-white' : 'text-gray-500'
        )}
      >
        <span className="absolute left-3 text-gray-500">{icon}</span>
        <span className="flex-1 truncate">{value || placeholder}</span>
        <ChevronDown className={cn('h-4 w-4 text-gray-500 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f1a2e] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2.5">
            <Search className="h-4 w-4 text-gray-500" />
            <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหา..." className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none" />
          </div>
          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-gray-500">ไม่พบข้อมูล</p>
            ) : filtered.map((option) => (
              <button key={option} type="button"
                onClick={() => { onChange(option); setOpen(false); setQuery('') }}
                className={cn('flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors',
                  option === value ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-white/[0.06]')}>
                <span>{option}</span>
                {option === value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Edit Profile Page ───────────────────────────────────────────────────────

export default function EditProfilePage() {
  const router = useRouter()
  const { status } = useSession()
  const locale = useLocale()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const [certName, setCertName] = useState('')
  const [country, setCountry] = useState('')
  const [position, setPosition] = useState('')
  const [organization, setOrganization] = useState('')
  const [interestArea, setInterestArea] = useState<string[]>([])
  const [learningGoal, setLearningGoal] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/${locale}/login`)
  }, [status, router, locale])

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      const json = await res.json()
      if (json.success && json.data) {
        setProfile(json.data)
        setCertName(json.data.fullNameForCertificate || json.data.fullName || '')
        setCountry(json.data.country || '')
        setPosition(json.data.position || '')
        setOrganization(json.data.organization || '')
        setInterestArea(json.data.interestArea || [])
        setLearningGoal(json.data.learningGoal || '')
      }
    } catch { setError('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') fetchProfile()
  }, [status, fetchProfile])

  const handleSave = async () => {
    if (!certName.trim() || certName.trim().length < 2) {
      setError('กรุณากรอกชื่อ-นามสกุลอย่างน้อย 2 ตัวอักษร'); return
    }
    setError(''); setSaving(true); setSaved(false)
    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullNameForCertificate: certName.trim(),
          country: country || null,
          organization: organization.trim() || null,
          position: position || null,
          interestArea,
          learningGoal: learningGoal || null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => router.push(`/${locale}/profile`), 1500)
      } else { setError(data.message || 'เกิดข้อผิดพลาด') }
    } catch { setError('เกิดข้อผิดพลาดในการบันทึก') }
    finally { setSaving(false) }
  }

  const toggleInterest = (id: string) => {
    setInterestArea((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#030712]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-blue-600/[0.06] via-transparent to-transparent" />

      <div className="relative mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {/* Back */}
        <button
          onClick={() => router.push(`/${locale}/profile`)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไปโปรไฟล์
        </button>

        <h1 className="mb-6 text-2xl font-bold text-white">แก้ไขโปรไฟล์</h1>

        {/* Notifications */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}
        {saved && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            บันทึกเรียบร้อย! กำลังกลับไปหน้าโปรไฟล์...
          </div>
        )}

        {/* Certificate Name */}
        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[#0a1628]/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-400" />
            <h2 className="font-semibold text-white">ชื่อสำหรับใบประกาศนียบัตร</h2>
          </div>
          <input
            type="text" value={certName} onChange={(e) => setCertName(e.target.value)}
            placeholder="ชื่อ-นามสกุล ที่จะแสดงบนใบประกาศ" maxLength={100}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 px-4 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
          <p className="mt-1.5 text-xs text-gray-500">ชื่อนี้จะปรากฏบนใบประกาศนียบัตรทุกใบ</p>
        </div>

        {/* Personal Info */}
        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[#0a1628]/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            <h2 className="font-semibold text-white">ข้อมูลส่วนตัว</h2>
          </div>

          <div className="space-y-4">
            {/* Read-only fields */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">ชื่อ-นามสกุล</label>
              <div className="flex items-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 pl-10 pr-4 text-sm text-gray-400 relative">
                <User className="absolute left-3 h-4 w-4 text-gray-600" />
                {profile.fullName}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">อีเมล</label>
              <div className="flex items-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 pl-10 pr-4 text-sm text-gray-400 relative">
                <Mail className="absolute left-3 h-4 w-4 text-gray-600" />
                {profile.email}
              </div>
            </div>

            <SearchableDropdown value={country} onChange={setCountry} options={COUNTRIES}
              placeholder="เลือกประเทศ" icon={<MapPin className="h-4 w-4" />} label="ประเทศ" />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">องค์กร / สถาบัน</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)}
                  placeholder="เช่น มหาวิทยาลัยศรีปทุม" maxLength={100}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all" />
              </div>
            </div>

            <SearchableDropdown value={position} onChange={setPosition} options={POSITIONS}
              placeholder="เลือกตำแหน่งงาน" icon={<Briefcase className="h-4 w-4" />} label="ตำแหน่งงาน" />
          </div>
        </div>

        {/* Interests & Goals */}
        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[#0a1628]/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-cyan-400" />
            <h2 className="font-semibold text-white">ความสนใจและเป้าหมาย</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-300">สิ่งที่สนใจ (เลือกได้หลายข้อ)</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {INTEREST_AREAS.map((area) => (
                  <button key={area.id} type="button" onClick={() => toggleInterest(area.id)}
                    className={cn('flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all',
                      interestArea.includes(area.id)
                        ? 'border-blue-500/40 bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'
                        : 'border-white/[0.08] bg-white/[0.04] text-gray-400 hover:bg-white/[0.06]')}>
                    {interestArea.includes(area.id) ? <Check className="h-3.5 w-3.5" /> : <Target className="h-3.5 w-3.5" />}
                    {area.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-gray-300">เป้าหมายการเรียน</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {LEARNING_GOALS.map((goal) => (
                  <button key={goal.id} type="button" onClick={() => setLearningGoal(goal.id)}
                    className={cn('flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all',
                      learningGoal === goal.id
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20'
                        : 'border-white/[0.08] bg-white/[0.04] text-gray-400 hover:bg-white/[0.06]')}>
                    {learningGoal === goal.id ? <Check className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/${locale}/profile`)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:bg-white/[0.08]"
          >
            <X className="h-4 w-4" />
            ยกเลิก
          </button>
          <button
            onClick={handleSave} disabled={saving}
            className={cn(
              'flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all',
              saving ? 'cursor-not-allowed bg-blue-500/30'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-[0.98]'
            )}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  )
}
