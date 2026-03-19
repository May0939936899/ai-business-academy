'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Star,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Save,
  Eye,
  EyeOff,
  MessageSquare,
  FileText,
} from 'lucide-react'

/* ── Types ──────────────────────────────────────────────────────────────── */

interface Testimonial {
  id: string
  name: string
  role: string
  companyOrStatus: string
  message: string
  avatarUrl: string | null
  isActive: boolean
  sortOrder: number
}

interface FAQ {
  id: string
  question: string
  answer: string
  sortOrder: number
  isActive: boolean
}

interface TestimonialForm {
  name: string
  role: string
  companyOrStatus: string
  message: string
  avatarUrl: string
  sortOrder: string
  isActive: boolean
}

interface FAQForm {
  question: string
  answer: string
  sortOrder: string
  isActive: boolean
}

const emptyTestimonialForm: TestimonialForm = {
  name: '',
  role: '',
  companyOrStatus: '',
  message: '',
  avatarUrl: '',
  sortOrder: '',
  isActive: true,
}

const emptyFAQForm: FAQForm = {
  question: '',
  answer: '',
  sortOrder: '',
  isActive: true,
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'testimonials' | 'faqs'>('testimonials')

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loadingT, setLoadingT] = useState(true)
  const [savingT, setSavingT] = useState(false)
  const [modalT, setModalT] = useState(false)
  const [editingT, setEditingT] = useState<string | null>(null)
  const [formT, setFormT] = useState<TestimonialForm>(emptyTestimonialForm)
  const [deleteT, setDeleteT] = useState<string | null>(null)
  const [deletingT, setDeletingT] = useState(false)

  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loadingF, setLoadingF] = useState(true)
  const [savingF, setSavingF] = useState(false)
  const [modalF, setModalF] = useState(false)
  const [editingF, setEditingF] = useState<string | null>(null)
  const [formF, setFormF] = useState<FAQForm>(emptyFAQForm)
  const [deleteF, setDeleteF] = useState<string | null>(null)
  const [deletingF, setDeletingF] = useState(false)

  // Messages
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  /* ── Fetch data ──────────────────────────────────────────────────────── */

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoadingT(true)
      const res = await fetch('/api/admin/content/testimonials')
      const data = await res.json()
      if (data.success) setTestimonials(data.data)
      else setError(data.error || 'โหลดข้อมูลรีวิวไม่สำเร็จ')
    } catch {
      setError('ไม่สามารถโหลดข้อมูลรีวิวได้')
    } finally {
      setLoadingT(false)
    }
  }, [])

  const fetchFAQs = useCallback(async () => {
    try {
      setLoadingF(true)
      const res = await fetch('/api/admin/content/faqs')
      const data = await res.json()
      if (data.success) setFaqs(data.data)
      else setError(data.error || 'โหลดข้อมูล FAQ ไม่สำเร็จ')
    } catch {
      setError('ไม่สามารถโหลดข้อมูล FAQ ได้')
    } finally {
      setLoadingF(false)
    }
  }, [])

  useEffect(() => {
    fetchTestimonials()
    fetchFAQs()
  }, [fetchTestimonials, fetchFAQs])

  /* ── Auto-clear messages ─────────────────────────────────────────────── */

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(t)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(t)
    }
  }, [error])

  /* ── Testimonial CRUD ────────────────────────────────────────────────── */

  function openCreateT() {
    setFormT(emptyTestimonialForm)
    setEditingT(null)
    setModalT(true)
  }

  function openEditT(t: Testimonial) {
    setFormT({
      name: t.name,
      role: t.role,
      companyOrStatus: t.companyOrStatus,
      message: t.message,
      avatarUrl: t.avatarUrl || '',
      sortOrder: String(t.sortOrder),
      isActive: t.isActive,
    })
    setEditingT(t.id)
    setModalT(true)
  }

  function closeModalT() {
    setModalT(false)
    setEditingT(null)
    setFormT(emptyTestimonialForm)
  }

  async function handleSaveT() {
    if (!formT.name.trim() || !formT.role.trim() || !formT.companyOrStatus.trim() || !formT.message.trim()) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบ')
      return
    }

    setSavingT(true)
    setError('')

    const body = {
      name: formT.name.trim(),
      role: formT.role.trim(),
      companyOrStatus: formT.companyOrStatus.trim(),
      message: formT.message.trim(),
      avatarUrl: formT.avatarUrl.trim() || null,
      isActive: formT.isActive,
      ...(formT.sortOrder.trim() && { sortOrder: parseInt(formT.sortOrder) }),
    }

    try {
      const url = editingT
        ? `/api/admin/content/testimonials/${editingT}`
        : '/api/admin/content/testimonials'
      const res = await fetch(url, {
        method: editingT ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(editingT ? 'อัพเดตรีวิวสำเร็จ' : 'เพิ่มรีวิวสำเร็จ')
        closeModalT()
        fetchTestimonials()
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('ไม่สามารถบันทึกได้')
    } finally {
      setSavingT(false)
    }
  }

  async function handleDeleteT() {
    if (!deleteT) return
    setDeletingT(true)
    try {
      const res = await fetch(`/api/admin/content/testimonials/${deleteT}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setSuccess('ลบรีวิวสำเร็จ')
        setDeleteT(null)
        fetchTestimonials()
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('ไม่สามารถลบได้')
    } finally {
      setDeletingT(false)
    }
  }

  async function toggleT(id: string) {
    try {
      const res = await fetch(`/api/admin/content/testimonials/${id}`, { method: 'PATCH' })
      const data = await res.json()
      if (data.success) {
        setSuccess(data.message)
        fetchTestimonials()
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('ไม่สามารถสลับสถานะได้')
    }
  }

  /* ── FAQ CRUD ────────────────────────────────────────────────────────── */

  function openCreateF() {
    setFormF(emptyFAQForm)
    setEditingF(null)
    setModalF(true)
  }

  function openEditF(f: FAQ) {
    setFormF({
      question: f.question,
      answer: f.answer,
      sortOrder: String(f.sortOrder),
      isActive: f.isActive,
    })
    setEditingF(f.id)
    setModalF(true)
  }

  function closeModalF() {
    setModalF(false)
    setEditingF(null)
    setFormF(emptyFAQForm)
  }

  async function handleSaveF() {
    if (!formF.question.trim() || !formF.answer.trim()) {
      setError('กรุณากรอกคำถามและคำตอบ')
      return
    }

    setSavingF(true)
    setError('')

    const body = {
      question: formF.question.trim(),
      answer: formF.answer.trim(),
      isActive: formF.isActive,
      ...(formF.sortOrder.trim() && { sortOrder: parseInt(formF.sortOrder) }),
    }

    try {
      const url = editingF
        ? `/api/admin/content/faqs/${editingF}`
        : '/api/admin/content/faqs'
      const res = await fetch(url, {
        method: editingF ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(editingF ? 'อัพเดต FAQ สำเร็จ' : 'เพิ่ม FAQ สำเร็จ')
        closeModalF()
        fetchFAQs()
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('ไม่สามารถบันทึกได้')
    } finally {
      setSavingF(false)
    }
  }

  async function handleDeleteF() {
    if (!deleteF) return
    setDeletingF(true)
    try {
      const res = await fetch(`/api/admin/content/faqs/${deleteF}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setSuccess('ลบ FAQ สำเร็จ')
        setDeleteF(null)
        fetchFAQs()
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('ไม่สามารถลบได้')
    } finally {
      setDeletingF(false)
    }
  }

  async function toggleF(id: string) {
    try {
      const res = await fetch(`/api/admin/content/faqs/${id}`, { method: 'PATCH' })
      const data = await res.json()
      if (data.success) {
        setSuccess(data.message)
        fetchFAQs()
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('ไม่สามารถสลับสถานะได้')
    }
  }

  /* ── Computed stats ──────────────────────────────────────────────────── */

  const totalT = testimonials.length
  const activeT = testimonials.filter((t) => t.isActive).length
  const hiddenT = totalT - activeT

  const totalF = faqs.length
  const activeF = faqs.filter((f) => f.isActive).length
  const hiddenF = totalF - activeF

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div>
      {/* Toast */}
      {success && (
        <div className="fixed right-4 top-20 z-[100] flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400 shadow-xl backdrop-blur-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}
      {error && (
        <div className="fixed right-4 top-20 z-[100] flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 shadow-xl backdrop-blur-sm animate-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 shadow-lg shadow-amber-500/20">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">จัดการเนื้อหา</h1>
            <p className="text-sm text-gray-500">จัดการรีวิวและคำถามที่พบบ่อย</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-1">
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
            activeTab === 'testimonials'
              ? 'bg-white/[0.08] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Star className="h-4 w-4" />
          รีวิว
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
            {totalT}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
            activeTab === 'faqs'
              ? 'bg-white/[0.08] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          คำถามที่พบบ่อย
          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
            {totalF}
          </span>
        </button>
      </div>

      {/* ═══════════ TESTIMONIALS TAB ═══════════ */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Star className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalT}</p>
                  <p className="text-xs text-gray-500">รีวิวทั้งหมด</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Eye className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{activeT}</p>
                  <p className="text-xs text-gray-500">กำลังแสดง</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                  <EyeOff className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{hiddenT}</p>
                  <p className="text-xs text-gray-500">ซ่อนอยู่</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add button */}
          <div className="flex justify-end">
            <button
              onClick={openCreateT}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              เพิ่มรีวิว
            </button>
          </div>

          {/* List */}
          {loadingT ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a1628]/40 p-12 text-center">
              <Star className="mx-auto mb-3 h-10 w-10 text-gray-600" />
              <p className="text-lg font-medium text-gray-300">ยังไม่มีรีวิว</p>
              <p className="mt-1 text-sm text-gray-500">เพิ่มรีวิวจากผู้เรียนเพื่อแสดงในหน้าเว็บ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="group rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5 transition-all hover:border-white/[0.12]"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt=""
                        className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-white/[0.08]"
                      />
                    ) : (
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-sm font-bold text-amber-300 ring-2 ring-white/[0.08]">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-200">{t.name}</p>
                        {t.isActive ? (
                          <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                            แสดง
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-500/10 px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-gray-500/20">
                            ซ่อน
                          </span>
                        )}
                        <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-gray-500">
                          #{t.sortOrder}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {t.role} &middot; {t.companyOrStatus}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                        &ldquo;{t.message}&rdquo;
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => toggleT(t.id)}
                        title={t.isActive ? 'ซ่อน' : 'แสดง'}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
                      >
                        {t.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => openEditT(t)}
                        title="แก้ไข"
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteT(t.id)}
                        title="ลบ"
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════ FAQS TAB ═══════════ */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <HelpCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalF}</p>
                  <p className="text-xs text-gray-500">FAQ ทั้งหมด</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Eye className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{activeF}</p>
                  <p className="text-xs text-gray-500">กำลังแสดง</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                  <EyeOff className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{hiddenF}</p>
                  <p className="text-xs text-gray-500">ซ่อนอยู่</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add button */}
          <div className="flex justify-end">
            <button
              onClick={openCreateF}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              เพิ่ม FAQ
            </button>
          </div>

          {/* List */}
          {loadingF ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a1628]/40 p-12 text-center">
              <HelpCircle className="mx-auto mb-3 h-10 w-10 text-gray-600" />
              <p className="text-lg font-medium text-gray-300">ยังไม่มี FAQ</p>
              <p className="mt-1 text-sm text-gray-500">เพิ่มคำถามที่พบบ่อยเพื่อแสดงในหน้าเว็บ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((f) => (
                <div
                  key={f.id}
                  className="group rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5 transition-all hover:border-white/[0.12]"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-400">
                      Q
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-200 line-clamp-1">{f.question}</p>
                        {f.isActive ? (
                          <span className="inline-flex flex-shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                            แสดง
                          </span>
                        ) : (
                          <span className="inline-flex flex-shrink-0 rounded-full bg-gray-500/10 px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-gray-500/20">
                            ซ่อน
                          </span>
                        )}
                        <span className="flex-shrink-0 rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-gray-500">
                          #{f.sortOrder}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-400">{f.answer}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => toggleF(f.id)}
                        title={f.isActive ? 'ซ่อน' : 'แสดง'}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
                      >
                        {f.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => openEditF(f)}
                        title="แก้ไข"
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteF(f.id)}
                        title="ลบ"
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════ TESTIMONIAL MODAL ═══════════ */}
      {modalT && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModalT} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f172a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                {editingT ? 'แก้ไขรีวิว' : 'เพิ่มรีวิวใหม่'}
              </h2>
              <button
                onClick={closeModalT}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  ชื่อ <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formT.name}
                  onChange={(e) => setFormT({ ...formT, name: e.target.value })}
                  placeholder="ชื่อผู้รีวิว"
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  ตำแหน่ง <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formT.role}
                  onChange={(e) => setFormT({ ...formT, role: e.target.value })}
                  placeholder="เช่น นักศึกษา, นักพัฒนา"
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Company/Status */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  บริษัท/สถานะ <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formT.companyOrStatus}
                  onChange={(e) => setFormT({ ...formT, companyOrStatus: e.target.value })}
                  placeholder="เช่น บริษัท ABC, จบคอร์สแล้ว"
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  ข้อความรีวิว <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formT.message}
                  onChange={(e) => setFormT({ ...formT, message: e.target.value })}
                  placeholder="ข้อความรีวิวจากผู้เรียน"
                  rows={4}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  URL รูปโปรไฟล์
                </label>
                <input
                  type="text"
                  value={formT.avatarUrl}
                  onChange={(e) => setFormT({ ...formT, avatarUrl: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Sort order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    ลำดับการแสดง
                  </label>
                  <input
                    type="number"
                    value={formT.sortOrder}
                    onChange={(e) => setFormT({ ...formT, sortOrder: e.target.value })}
                    placeholder="อัตโนมัติ"
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    สถานะ
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormT({ ...formT, isActive: !formT.isActive })}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      formT.isActive
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/[0.06] bg-white/[0.03] text-gray-400'
                    }`}
                  >
                    {formT.isActive ? (
                      <>
                        <Eye className="h-4 w-4" /> แสดง
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" /> ซ่อน
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
              <button
                onClick={closeModalT}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/[0.08]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveT}
                disabled={savingT}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 hover:brightness-110 disabled:opacity-50"
              >
                {savingT ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingT ? 'อัพเดต' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ FAQ MODAL ═══════════ */}
      {modalF && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModalF} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f172a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                {editingF ? 'แก้ไข FAQ' : 'เพิ่ม FAQ ใหม่'}
              </h2>
              <button
                onClick={closeModalF}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
              {/* Question */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  คำถาม <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formF.question}
                  onChange={(e) => setFormF({ ...formF, question: e.target.value })}
                  placeholder="คำถามที่พบบ่อย"
                  rows={2}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  คำตอบ <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formF.answer}
                  onChange={(e) => setFormF({ ...formF, answer: e.target.value })}
                  placeholder="คำตอบ"
                  rows={4}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Sort order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    ลำดับการแสดง
                  </label>
                  <input
                    type="number"
                    value={formF.sortOrder}
                    onChange={(e) => setFormF({ ...formF, sortOrder: e.target.value })}
                    placeholder="อัตโนมัติ"
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    สถานะ
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormF({ ...formF, isActive: !formF.isActive })}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      formF.isActive
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/[0.06] bg-white/[0.03] text-gray-400'
                    }`}
                  >
                    {formF.isActive ? (
                      <>
                        <Eye className="h-4 w-4" /> แสดง
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" /> ซ่อน
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
              <button
                onClick={closeModalF}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/[0.08]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveF}
                disabled={savingF}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110 disabled:opacity-50"
              >
                {savingF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingF ? 'อัพเดต' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ DELETE TESTIMONIAL CONFIRM ═══════════ */}
      {deleteT && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteT(null)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f172a] p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">ยืนยันการลบ</h3>
            <p className="mb-6 text-sm text-gray-400">
              คุณต้องการลบรีวิวนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteT(null)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/[0.08]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteT}
                disabled={deletingT}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-500 disabled:opacity-50"
              >
                {deletingT ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ DELETE FAQ CONFIRM ═══════════ */}
      {deleteF && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteF(null)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f172a] p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">ยืนยันการลบ</h3>
            <p className="mb-6 text-sm text-gray-400">
              คุณต้องการลบ FAQ นี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteF(null)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/[0.08]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteF}
                disabled={deletingF}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-500 disabled:opacity-50"
              >
                {deletingF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
