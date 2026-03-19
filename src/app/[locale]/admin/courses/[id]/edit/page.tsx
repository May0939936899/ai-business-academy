'use client'

import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Upload,
  Save,
  Send,
  Eye,
  X,
  Loader2,
  ImageIcon,
  Trash2,
} from 'lucide-react'

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [form, setForm] = useState({
    title: '',
    courseCode: '',
    description: '',
    shortDescription: '',
    category: '',
    level: 'BEGINNER',
    duration: '',
    isFree: true,
    hasCertificate: true,
    status: 'DRAFT',
    thumbnail: '',
  })

  // Load course data
  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/admin/courses/${id}`)
        const data = await res.json()
        if (data.success && data.data) {
          const c = data.data
          setForm({
            title: c.title || '',
            courseCode: c.courseCode || '',
            description: c.description || '',
            shortDescription: c.shortDescription || '',
            category: c.category || '',
            level: c.level || 'BEGINNER',
            duration: c.duration || '',
            isFree: c.isFree ?? true,
            hasCertificate: c.hasCertificate ?? true,
            status: c.status || 'DRAFT',
            thumbnail: c.thumbnail || '',
          })
        } else {
          setError('ไม่พบคอร์สนี้')
        }
      } catch {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = (field: 'isFree' | 'hasCertificate') => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('ไฟล์ขนาดใหญ่เกิน 2MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        setForm((prev) => ({ ...prev, thumbnail: data.url }))
      } else {
        setError(data.error || 'อัปโหลดไม่สำเร็จ')
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการอัปโหลด')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (status?: string) => {
    setError('')
    setSuccess('')

    if (!form.title.trim()) { setError('กรุณาระบุชื่อคอร์ส'); return }
    if (!form.description.trim()) { setError('กรุณาระบุรายละเอียดคอร์ส'); return }

    setSaving(true)

    try {
      const payload = { ...form }
      if (status) payload.status = status

      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess('บันทึกสำเร็จ!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        router.push('/admin/courses')
      } else {
        setError(data.error || 'ไม่สามารถลบได้')
        setShowDeleteConfirm(false)
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการลบ')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-3 text-gray-400">กำลังโหลดข้อมูลคอร์ส...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">แก้ไขคอร์ส</h1>
            <p className="mt-0.5 text-sm text-gray-500">{form.title}</p>
          </div>
        </div>
        <button onClick={() => setShowDeleteConfirm(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">
          <Trash2 className="h-4 w-4" /> ลบคอร์ส
        </button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-300">คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
          <div className="mt-3 flex gap-2">
            <button onClick={handleDelete} disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-50">
              {deleting ? 'กำลังลบ...' : 'ยืนยันลบ'}
            </button>
            <button onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg border border-white/[0.06] px-4 py-2 text-sm text-gray-400 hover:text-white">
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">{success}</div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Basic Info */}
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-white">ข้อมูลพื้นฐาน</h2>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">ชื่อคอร์ส <span className="text-red-400">*</span></label>
                  <input type="text" name="title" value={form.title} onChange={handleChange}
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">รหัสคอร์ส</label>
                  <input type="text" name="courseCode" value={form.courseCode} onChange={handleChange}
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">คำอธิบายสั้น</label>
                <input type="text" name="shortDescription" value={form.shortDescription} onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">รายละเอียดคอร์ส <span className="text-red-400">*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={5}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-white">รายละเอียดเพิ่มเติม</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">หมวดหมู่</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-400 outline-none focus:border-blue-500/50">
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="Automation">Automation</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="Finance">Finance</option>
                  <option value="Management">Management</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">ระดับ</label>
                <select name="level" value={form.level} onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-400 outline-none focus:border-blue-500/50">
                  <option value="BEGINNER">เริ่มต้น (Beginner)</option>
                  <option value="INTERMEDIATE">ปานกลาง (Intermediate)</option>
                  <option value="ADVANCED">สูง (Advanced)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">ระยะเวลา</label>
                <input type="text" name="duration" value={form.duration} onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">สถานะ</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-400 outline-none focus:border-blue-500/50">
                  <option value="DRAFT">ฉบับร่าง</option>
                  <option value="PUBLISHED">เผยแพร่แล้ว</option>
                  <option value="ARCHIVED">เก็บถาวร</option>
                </select>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-white">Thumbnail</h2>
            </div>
            <div className="p-5">
              {form.thumbnail ? (
                <div className="relative inline-block">
                  <div className="h-48 w-80 overflow-hidden rounded-lg border border-white/[0.06]">
                    <Image src={form.thumbnail} alt="Thumbnail" width={320} height={192}
                      className="h-full w-full object-cover" unoptimized />
                  </div>
                  <button onClick={() => setForm((prev) => ({ ...prev, thumbnail: '' }))}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-12 hover:border-blue-500/30 hover:bg-blue-500/[0.02]">
                  {uploading ? (
                    <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-400" />
                  ) : (
                    <Upload className="mb-3 h-8 w-8 text-gray-600" />
                  )}
                  <p className="text-sm font-medium text-gray-400">{uploading ? 'กำลังอัปโหลด...' : 'คลิกเพื่ออัพโหลดรูปภาพ'}</p>
                  <p className="mt-1 text-xs text-gray-600">PNG, JPG, WebP ขนาดไม่เกิน 2MB</p>
                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp"
                    className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-white">ตั้งค่าเพิ่มเติม</h2>
            </div>
            <div className="divide-y divide-white/[0.04] p-5">
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-300">เรียนฟรี</p>
                  <p className="text-xs text-gray-500">เปิดให้ผู้เรียนทุกคนเข้าถึงได้โดยไม่เสียค่าใช้จ่าย</p>
                </div>
                <button onClick={() => handleToggle('isFree')}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.isFree ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${form.isFree ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-300">มี Certificate</p>
                  <p className="text-xs text-gray-500">ออก Certificate ให้ผู้เรียนที่จบคอร์สเรียบร้อย</p>
                </div>
                <button onClick={() => handleToggle('hasCertificate')}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.hasCertificate ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${form.hasCertificate ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button onClick={() => handleSave()} disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              บันทึก
            </button>
            <button onClick={() => handleSave('PUBLISHED')} disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              เผยแพร่
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-24 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-4">
              <Eye className="h-4 w-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-white">ตัวอย่าง</h2>
            </div>
            <div className="p-5">
              <div className="mb-4 overflow-hidden rounded-lg border border-white/[0.06]">
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  {form.thumbnail ? (
                    <Image src={form.thumbnail} alt="Preview" width={400} height={225}
                      className="h-full w-full object-cover" unoptimized />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-700" />
                      <p className="mt-2 text-xs text-gray-600">ยังไม่มี Thumbnail</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {form.category && (
                  <span className="inline-block rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">{form.category}</span>
                )}
                <h3 className="text-lg font-bold text-white">{form.title || <span className="text-gray-600">ชื่อคอร์ส</span>}</h3>
                <p className="text-sm text-gray-400">{form.shortDescription || <span className="text-gray-700">คำอธิบายสั้น</span>}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-md bg-white/[0.04] px-2 py-1 text-xs text-gray-400">
                    {form.level === 'BEGINNER' ? 'เริ่มต้น' : form.level === 'INTERMEDIATE' ? 'ปานกลาง' : 'สูง'}
                  </span>
                  {form.duration && <span className="rounded-md bg-white/[0.04] px-2 py-1 text-xs text-gray-400">{form.duration}</span>}
                  {form.isFree && <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">เรียนฟรี</span>}
                  {form.hasCertificate && <span className="rounded-md bg-purple-500/10 px-2 py-1 text-xs text-purple-400">Certificate</span>}
                </div>
                <div className="border-t border-white/[0.06] pt-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    form.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                    : form.status === 'ARCHIVED' ? 'bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20'
                  }`}>
                    {form.status === 'PUBLISHED' ? 'เผยแพร่แล้ว' : form.status === 'ARCHIVED' ? 'เก็บถาวร' : 'ฉบับร่าง'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
