'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  Sparkles,
  Loader2,
  MapPin,
  Briefcase,
  ChevronRight,
  AlertCircle,
  Search,
  ChevronDown,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Countries ──────────────────────────────────────────────────────────────
const COUNTRIES = [
  'ไทย',
  'สหรัฐอเมริกา',
  'สหราชอาณาจักร',
  'ออสเตรเลีย',
  'แคนาดา',
  'ญี่ปุ่น',
  'จีน',
  'เกาหลีใต้',
  'สิงคโปร์',
  'มาเลเซีย',
  'อินโดนีเซีย',
  'ฟิลิปปินส์',
  'เวียดนาม',
  'อินเดีย',
  'เยอรมนี',
  'ฝรั่งเศส',
  'อิตาลี',
  'สเปน',
  'เนเธอร์แลนด์',
  'สวีเดน',
  'นอร์เวย์',
  'เดนมาร์ก',
  'ฟินแลนด์',
  'สวิตเซอร์แลนด์',
  'เบลเยียม',
  'ออสเตรีย',
  'โปรตุเกส',
  'กรีซ',
  'โปแลนด์',
  'เช็กเกีย',
  'ฮังการี',
  'โรมาเนีย',
  'รัสเซีย',
  'ตุรกี',
  'ซาอุดีอาระเบีย',
  'สหรัฐอาหรับเอมิเรตส์',
  'อิสราเอล',
  'อียิปต์',
  'แอฟริกาใต้',
  'ไนจีเรีย',
  'เคนยา',
  'เอธิโอเปีย',
  'กาน่า',
  'แทนซาเนีย',
  'เม็กซิโก',
  'บราซิล',
  'อาร์เจนตินา',
  'โคลอมเบีย',
  'ชิลี',
  'เปรู',
  'เวเนซุเอลา',
  'เอกวาดอร์',
  'โบลิเวีย',
  'ปารากวัย',
  'อุรุกวัย',
  'นิวซีแลนด์',
  'ปากีสถาน',
  'บังกลาเทศ',
  'ศรีลังกา',
  'เนปาล',
  'เมียนมาร์',
  'กัมพูชา',
  'ลาว',
  'บรูไน',
  'ติมอร์-เลสเต',
  'มองโกเลีย',
  'คาซัคสถาน',
  'อุซเบกิสถาน',
  'อาเซอร์ไบจาน',
  'จอร์เจีย',
  'อาร์เมเนีย',
  'ยูเครน',
  'เบลารุส',
  'มอลโดวา',
  'ลิทัวเนีย',
  'ลัตเวีย',
  'เอสโตเนีย',
  'สโลวาเกีย',
  'สโลวีเนีย',
  'โครเอเชีย',
  'เซอร์เบีย',
  'บอสเนียและเฮอร์เซโกวีนา',
  'แอลเบเนีย',
  'นอร์ทมาซิโดเนีย',
  'มอนเตเนโกร',
  'ลักเซมเบิร์ก',
  'ไอร์แลนด์',
  'ไอซ์แลนด์',
  'มอลตา',
  'ไซปรัส',
  'อิหร่าน',
  'อิรัก',
  'ซีเรีย',
  'เลบานอน',
  'จอร์แดน',
  'คูเวต',
  'กาตาร์',
  'บาห์เรน',
  'โอมาน',
  'เยเมน',
  'ลิเบีย',
  'ตูนิเซีย',
  'แอลจีเรีย',
  'โมร็อกโก',
  'ซูดาน',
  'โมซัมบิก',
  'แองโกลา',
  'ซิมบับเว',
  'แซมเบีย',
  'มาลาวี',
  'โบตสวานา',
  'นามิเบีย',
  'เลโซโท',
  'เอสวาตีนี',
  'มาดากัสการ์',
  'มอริเชียส',
  'เซเชลส์',
  'คอโมโรส',
  'ดิจิบูตี',
  'เอริเทรีย',
  'โซมาเลีย',
  'รวันดา',
  'บุรุนดี',
  'ยูกันดา',
  'ซูดานใต้',
  'สาธารณรัฐแอฟริกากลาง',
  'แคเมอรูน',
  'ชาด',
  'ไนเจอร์',
  'มาลี',
  'บูร์กินาฟาโซ',
  'กินี',
  'กินี-บิสเซา',
  'เซียร์ราลีโอน',
  'ไลบีเรีย',
  'โกตดิวัวร์',
  'โตโก',
  'เบนิน',
  'เซเนกัล',
  'แกมเบีย',
  'กาบูเวร์ดี',
  'เซาตูเมและปรินซิปี',
  'อิเควทอเรียลกินี',
  'กาบอง',
  'คองโก',
  'สาธารณรัฐประชาธิปไตยคองโก',
  'คิวบา',
  'จาเมกา',
  'เฮติ',
  'สาธารณรัฐโดมินิกัน',
  'เปอร์โตริโก',
  'ตรินิแดดและโตเบโก',
  'บาร์เบโดส',
  'กายอานา',
  'ซูรินาม',
  'เบลีซ',
  'กัวเตมาลา',
  'ฮอนดูรัส',
  'เอลซัลวาดอร์',
  'นิการากัว',
  'คอสตาริกา',
  'ปานามา',
  'ปาปัวนิวกินี',
  'ฟิจิ',
  'หมู่เกาะโซโลมอน',
  'วานูอาตู',
  'ซามัว',
  'ตองกา',
  'คิริบาส',
  'ไมโครนีเซีย',
  'หมู่เกาะมาร์แชลล์',
  'นาอูรู',
  'ปาเลา',
  'ตูวาลู',
  'อื่นๆ',
]

// ─── Positions ───────────────────────────────────────────────────────────────
const POSITIONS = [
  'นักศึกษา',
  'นักศึกษาปริญญาโท',
  'นักศึกษาปริญญาเอก',
  'ผู้ประกอบการ / เจ้าของธุรกิจ',
  'CEO / ผู้บริหารระดับสูง',
  'COO / ผู้อำนวยการฝ่ายปฏิบัติการ',
  'CFO / ผู้อำนวยการฝ่ายการเงิน',
  'CTO / ผู้อำนวยการฝ่ายเทคโนโลยี',
  'CMO / ผู้อำนวยการฝ่ายการตลาด',
  'ผู้จัดการทั่วไป',
  'ผู้จัดการฝ่ายการตลาด',
  'ผู้จัดการฝ่ายขาย',
  'ผู้จัดการฝ่ายปฏิบัติการ',
  'ผู้จัดการฝ่าย HR',
  'ผู้จัดการฝ่ายไอที',
  'ผู้จัดการฝ่ายการเงิน',
  'ผู้จัดการโครงการ',
  'ผู้จัดการผลิตภัณฑ์ (Product Manager)',
  'นักการตลาด',
  'นักการตลาดดิจิทัล',
  'นักวิเคราะห์ข้อมูล (Data Analyst)',
  'นักวิทยาศาสตร์ข้อมูล (Data Scientist)',
  'วิศวกรซอฟต์แวร์ (Software Engineer)',
  'วิศวกร AI / Machine Learning',
  'นักพัฒนาเว็บ (Web Developer)',
  'นักพัฒนาแอป (Mobile Developer)',
  'UI/UX Designer',
  'Graphic Designer',
  'Content Creator / นักสร้างคอนเทนต์',
  'นักเขียนคอนเทนต์',
  'นักวิเคราะห์ธุรกิจ (Business Analyst)',
  'ที่ปรึกษาธุรกิจ (Business Consultant)',
  'นักบัญชี',
  'ทนายความ',
  'แพทย์',
  'พยาบาล',
  'นักจิตวิทยา',
  'ครู / อาจารย์',
  'อาจารย์มหาวิทยาลัย',
  'นักวิจัย',
  'วิศวกร (ทั่วไป)',
  'สถาปนิก',
  'นักออกแบบ (ทั่วไป)',
  'นักบัญชี / ผู้ตรวจสอบบัญชี',
  'นักลงทุน / นักการเงิน',
  'ตัวแทนประกันภัย',
  'เจ้าหน้าที่ธนาคาร',
  'เจ้าหน้าที่ราชการ',
  'ทหาร / ตำรวจ',
  'นักสังคมสงเคราะห์',
  'พนักงานบริการลูกค้า',
  'พนักงานขาย',
  'ฟรีแลนซ์',
  'อื่นๆ',
]

// ─── SearchableDropdown Component ───────────────────────────────────────────
interface SearchableDropdownProps {
  value: string
  onChange: (val: string) => void
  options: string[]
  placeholder: string
  icon: React.ReactNode
  label: string
}

function SearchableDropdown({
  value,
  onChange,
  options,
  placeholder,
  icon,
  label,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  )

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleSelect = (option: string) => {
    onChange(option)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-xl border py-3.5 pl-11 pr-4 text-sm transition-all',
          open
            ? 'border-blue-500/50 bg-white/[0.06] ring-1 ring-blue-500/20'
            : 'border-white/[0.08] bg-white/[0.04] hover:border-white/20',
          value ? 'text-white' : 'text-gray-500'
        )}
      >
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
        <span className="flex-1 truncate text-left">{value || placeholder}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-white/[0.1] bg-[#111827] shadow-xl shadow-black/40">
          {/* Search */}
          <div className="border-b border-white/[0.06] p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหา..."
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] py-2 pl-8 pr-3 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/30"
              />
            </div>
          </div>

          {/* Options */}
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-xs text-gray-500">ไม่พบผลลัพธ์</li>
            ) : (
              filtered.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      'flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs transition-colors',
                      option === value
                        ? 'bg-blue-500/15 text-blue-300'
                        : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                    )}
                  >
                    {option === value && <Check className="h-3.5 w-3.5 shrink-0 text-blue-400" />}
                    <span className={option === value ? 'ml-0' : 'ml-5'}>{option}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Interests & Goals ───────────────────────────────────────────────────────
const INTERESTS = [
  { id: 'ai_automation', label: 'AI Automation' },
  { id: 'ai_marketing', label: 'AI Marketing' },
  { id: 'ai_hr', label: 'AI for HR' },
  { id: 'ai_productivity', label: 'AI Productivity' },
  { id: 'ai_analytics', label: 'AI Analytics' },
  { id: 'ai_management', label: 'AI Management' },
]

const GOALS = [
  { id: 'work', label: 'พัฒนางาน', emoji: '💼' },
  { id: 'business', label: 'ขยายธุรกิจ', emoji: '🚀' },
  { id: 'teach', label: 'นำไปสอน', emoji: '👨‍🏫' },
  { id: 'personal', label: 'พัฒนาตัวเอง', emoji: '🌱' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CompleteProfilePage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const locale = useLocale()

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [fullNameForCertificate, setFullNameForCertificate] = useState('')
  const [country, setCountry] = useState('')
  const [position, setPosition] = useState('')
  const [interestArea, setInterestArea] = useState<string[]>([])
  const [learningGoal, setLearningGoal] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`)
    }
  }, [status, router, locale])

  // Pre-fill certificate name from session
  useEffect(() => {
    if (session?.user?.name) {
      setFullNameForCertificate(session.user.name)
    }
  }, [session?.user?.name])

  const toggleInterest = (id: string) => {
    setInterestArea((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    setError('')
    setIsSaving(true)

    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullNameForCertificate, country, position, interestArea, learningGoal }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        setIsSaving(false)
        return
      }

      // Refresh session token so middleware sees isProfileCompleted=true
      await update()
      router.push(`/${locale}/dashboard`)
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      setIsSaving(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div
          className={cn(
            'rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl',
            'shadow-2xl shadow-black/20'
          )}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              ขั้นตอนที่ 2 จาก 2
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white">
              ยินดีต้อนรับ{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="mt-1.5 text-sm text-gray-400">
              เพิ่มข้อมูลเพื่อให้เราแนะนำคอร์สที่เหมาะกับคุณ
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Full Name for Certificate */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                ชื่อ – นามสกุล (สำหรับใบประกาศ)
              </label>
              <input
                type="text"
                value={fullNameForCertificate}
                onChange={(e) => setFullNameForCertificate(e.target.value)}
                placeholder="กรอกชื่อ-นามสกุลที่ต้องการให้แสดงบนใบประกาศ"
                minLength={2}
                maxLength={100}
                required
                className={cn(
                  'w-full rounded-xl border py-3.5 pl-4 pr-4 text-sm transition-all',
                  'border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-500',
                  'focus:border-blue-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
                )}
              />
              <p className="mt-1.5 text-xs text-gray-500">
                ชื่อนี้จะถูกนำไปใช้บนใบประกาศนียบัตร
              </p>
            </div>

            {/* Country */}
            <SearchableDropdown
              label="ประเทศ"
              value={country}
              onChange={setCountry}
              options={COUNTRIES}
              placeholder="เลือกประเทศของคุณ"
              icon={<MapPin className="h-4 w-4" />}
            />

            {/* Position */}
            <SearchableDropdown
              label="ตำแหน่งงาน"
              value={position}
              onChange={setPosition}
              options={POSITIONS}
              placeholder="เลือกตำแหน่งงานของคุณ"
              icon={<Briefcase className="h-4 w-4" />}
            />

            {/* Interest Areas */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-300">
                สาขาที่สนใจ{' '}
                <span className="text-xs font-normal text-gray-500">(เลือกได้หลายรายการ)</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {INTERESTS.map((item) => {
                  const selected = interestArea.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={cn(
                        'rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-150',
                        selected
                          ? 'border-blue-500/60 bg-blue-500/15 text-blue-300'
                          : 'border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-gray-200'
                      )}
                    >
                      {selected && <span className="mr-1">✓</span>}
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Learning Goal */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-300">
                เป้าหมายการเรียนรู้
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map((goal) => {
                  const selected = learningGoal === goal.id
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setLearningGoal(selected ? '' : goal.id)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150',
                        selected
                          ? 'border-blue-500/60 bg-blue-500/15 text-blue-300'
                          : 'border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-gray-200'
                      )}
                    >
                      <span className="text-base leading-none">{goal.emoji}</span>
                      {goal.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200',
                'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600',
                'shadow-lg shadow-blue-500/20',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {isSaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  บันทึกและดำเนินการต่อ
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Bottom note */}
          <p className="mt-4 text-center text-xs text-gray-600">
            คุณสามารถแก้ไขข้อมูลได้ภายหลังในหน้าโปรไฟล์
          </p>
        </div>
      </div>
    </div>
  )
}
