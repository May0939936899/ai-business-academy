'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  PlayCircle,
  BookOpen,
  CheckCircle,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Save,
  Video,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
} from 'lucide-react'

/* ── Types ────────────────────────────────────────────────────────────── */

interface Course {
  id: string
  title: string
}

interface Lesson {
  id: string
  courseId: string
  title: string
  subtitle: string | null
  description: string | null
  youtubeUrl: string | null
  videoTitle: string | null
  videoChannel: string | null
  durationText: string | null
  lessonOrder: number
  lessonLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  summary: string | null
  learningOutcomes: string | null
  keyTakeaways: string | null
  coverImage: string | null
  isActive: boolean
  createdAt: string
  course: { id: string; title: string }
}

interface LessonForm {
  courseId: string
  title: string
  subtitle: string
  description: string
  youtubeUrl: string
  durationText: string
  lessonOrder: number
  lessonLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  isActive: boolean
}

const emptyForm: LessonForm = {
  courseId: '',
  title: '',
  subtitle: '',
  description: '',
  youtubeUrl: '',
  durationText: '',
  lessonOrder: 1,
  lessonLevel: 'BEGINNER',
  isActive: true,
}

const levelLabels: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}

const levelColors: Record<string, string> = {
  BEGINNER: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  INTERMEDIATE: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
  ADVANCED: 'bg-red-500/10 text-red-400 ring-red-500/20',
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [filterCourse, setFilterCourse] = useState('')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<LessonForm>(emptyForm)

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Toggle loading
  const [togglingId, setTogglingId] = useState<string | null>(null)

  /* ── Fetch lessons ─────────────────────────────────────────────── */

  const fetchLessons = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/lessons')
      const data = await res.json()
      if (data.success) {
        setLessons(data.data)
      } else {
        setError(data.error || 'ไม่สามารถโหลดข้อมูลได้')
      }
    } catch {
      setError('ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/courses')
      const data = await res.json()
      if (data.success) {
        setCourses(data.data.map((c: { id: string; title: string }) => ({ id: c.id, title: c.title })))
      }
    } catch {
      // silent
    }
  }, [])

  useEffect(() => {
    fetchLessons()
    fetchCourses()
  }, [fetchLessons, fetchCourses])

  /* ── Auto-clear messages ───────────────────────────────────────────── */

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  /* ── Open modal ────────────────────────────────────────────────────── */

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setModalOpen(true)
  }

  function openEdit(lesson: Lesson) {
    setForm({
      courseId: lesson.courseId,
      title: lesson.title,
      subtitle: lesson.subtitle || '',
      description: lesson.description || '',
      youtubeUrl: lesson.youtubeUrl || '',
      durationText: lesson.durationText || '',
      lessonOrder: lesson.lessonOrder,
      lessonLevel: lesson.lessonLevel,
      isActive: lesson.isActive,
    })
    setEditingId(lesson.id)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  /* ── Save (create / update) ────────────────────────────────────────── */

  async function handleSave() {
    if (!form.courseId) {
      setError('กรุณาเลือกคอร์ส')
      return
    }
    if (!form.title.trim()) {
      setError('กรุณาระบุชื่อบทเรียน')
      return
    }
    if (form.lessonOrder < 1) {
      setError('ลำดับบทเรียนต้องมากกว่า 0')
      return
    }

    setSaving(true)
    setError('')

    const body = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      description: form.description.trim() || null,
      youtubeUrl: form.youtubeUrl.trim() || null,
      durationText: form.durationText.trim() || null,
      lessonOrder: form.lessonOrder,
      lessonLevel: form.lessonLevel,
      isActive: form.isActive,
      ...(editingId ? { courseId: form.courseId } : {}),
    }

    try {
      let res: Response
      if (editingId) {
        res = await fetch(`/api/admin/lessons/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch(`/api/admin/courses/${form.courseId}/lessons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      const data = await res.json()

      if (data.success) {
        setSuccess(editingId ? 'อัปเดตบทเรียนสำเร็จ' : 'สร้างบทเรียนสำเร็จ')
        closeModal()
        fetchLessons()
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('ไม่สามารถบันทึกได้')
    } finally {
      setSaving(false)
    }
  }

  /* ── Delete ────────────────────────────────────────────────────────── */

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/lessons/${deleteId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('ลบบทเรียนสำเร็จ')
        setDeleteId(null)
        fetchLessons()
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('ไม่สามารถลบได้')
    } finally {
      setDeleting(false)
    }
  }

  /* ── Toggle active ─────────────────────────────────────────────────── */

  async function handleToggle(lessonId: string) {
    setTogglingId(lessonId)
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'PATCH',
      })
      const data = await res.json()
      if (data.success) {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === lessonId ? { ...l, isActive: data.data.isActive } : l
          )
        )
        setSuccess(data.message)
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('เกิดข้อผิดพลาด')
    } finally {
      setTogglingId(null)
    }
  }

  /* ── Filter & group ────────────────────────────────────────────────── */

  const filtered = lessons.filter((l) => {
    const matchesSearch =
      !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.description && l.description.toLowerCase().includes(search.toLowerCase())) ||
      l.course.title.toLowerCase().includes(search.toLowerCase())
    const matchesCourse = !filterCourse || l.courseId === filterCourse
    return matchesSearch && matchesCourse
  })

  // Group by course
  const grouped = filtered.reduce<Record<string, { courseTitle: string; lessons: Lesson[] }>>(
    (acc, lesson) => {
      const key = lesson.courseId
      if (!acc[key]) {
        acc[key] = { courseTitle: lesson.course.title, lessons: [] }
      }
      acc[key].lessons.push(lesson)
      return acc
    },
    {}
  )

  const totalCount = lessons.length
  const activeCount = lessons.filter((l) => l.isActive).length
  const inactiveCount = lessons.filter((l) => !l.isActive).length
  const courseCount = new Set(lessons.map((l) => l.courseId)).size

  /* ── Render ────────────────────────────────────────────────────────── */

  return (
    <div>
      {/* Toast messages */}
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 shadow-lg shadow-purple-500/20">
            <PlayCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">จัดการบทเรียน</h1>
            <p className="text-sm text-gray-500">
              บทเรียนทั้งหมด {totalCount} รายการ
            </p>
          </div>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          เพิ่มบทเรียน
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <PlayCircle className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalCount}</p>
              <p className="text-xs text-gray-500">บทเรียนทั้งหมด</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
              <p className="text-xs text-gray-500">เปิดใช้งาน</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{inactiveCount}</p>
              <p className="text-xs text-gray-500">ปิดใช้งาน</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <BookOpen className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{courseCount}</p>
              <p className="text-xs text-gray-500">คอร์สที่มีบทเรียน</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาบทเรียน..."
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
        <div className="relative">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="appearance-none rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-4 pr-10 text-sm text-gray-300 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          >
            <option value="" className="bg-[#0f172a]">ทุกคอร์ส</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0f172a]">
                {c.title}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Table grouped by course */}
      {!loading && (
        <>
          {filtered.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(grouped).map(([courseId, group]) => (
                <div
                  key={courseId}
                  className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50"
                >
                  {/* Course header */}
                  <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-gray-200">
                      {group.courseTitle}
                    </span>
                    <span className="ml-auto rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs text-gray-400">
                      {group.lessons.length} บทเรียน
                    </span>
                  </div>

                  {/* Lessons table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            ลำดับ
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            ชื่อบทเรียน
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            ระดับ
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            YouTube
                          </th>
                          <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            สถานะ
                          </th>
                          <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                            จัดการ
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {group.lessons.map((lesson) => (
                          <tr
                            key={lesson.id}
                            className="transition-colors hover:bg-white/[0.02]"
                          >
                            <td className="whitespace-nowrap px-5 py-4">
                              <span className="rounded-md bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-medium text-purple-400">
                                {lesson.lessonOrder}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-gray-200">
                                {lesson.title}
                              </p>
                              {lesson.subtitle && (
                                <p className="mt-0.5 max-w-xs truncate text-xs text-gray-500">
                                  {lesson.subtitle}
                                </p>
                              )}
                              {lesson.durationText && (
                                <p className="mt-0.5 text-[10px] text-gray-600">
                                  {lesson.durationText}
                                </p>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ${levelColors[lesson.lessonLevel]}`}
                              >
                                {levelLabels[lesson.lessonLevel]}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-5 py-4">
                              {lesson.youtubeUrl ? (
                                <a
                                  href={lesson.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
                                >
                                  <Video className="h-3.5 w-3.5" />
                                  ดูวิดีโอ
                                </a>
                              ) : (
                                <span className="text-sm text-gray-600">-</span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-5 py-4">
                              <button
                                onClick={() => handleToggle(lesson.id)}
                                disabled={togglingId === lesson.id}
                                className="inline-flex items-center gap-1.5 transition-colors hover:opacity-80 disabled:opacity-50"
                                title={lesson.isActive ? 'คลิกเพื่อปิดใช้งาน' : 'คลิกเพื่อเปิดใช้งาน'}
                              >
                                {togglingId === lesson.id ? (
                                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                ) : lesson.isActive ? (
                                  <ToggleRight className="h-6 w-6 text-emerald-400" />
                                ) : (
                                  <ToggleLeft className="h-6 w-6 text-gray-600" />
                                )}
                                <span
                                  className={`text-xs font-medium ${
                                    lesson.isActive ? 'text-emerald-400' : 'text-gray-500'
                                  }`}
                                >
                                  {lesson.isActive ? 'เปิด' : 'ปิด'}
                                </span>
                              </button>
                            </td>
                            <td className="whitespace-nowrap px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEdit(lesson)}
                                  className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2 text-gray-400 transition-all hover:bg-white/[0.08] hover:text-white"
                                  title="แก้ไข"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteId(lesson.id)}
                                  className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20"
                                  title="ลบ"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="text-sm text-gray-500">
                แสดง {filtered.length} จาก {totalCount} บทเรียน
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-20 text-center">
              <PlayCircle className="h-8 w-8 text-gray-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-300">
                {search || filterCourse
                  ? 'ไม่พบบทเรียนที่ค้นหา'
                  : 'ยังไม่มีบทเรียน'}
              </h3>
              <p className="mt-1.5 text-sm text-gray-500">
                {search || filterCourse
                  ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง'
                  : 'เริ่มต้นสร้างบทเรียนใหม่ได้เลย'}
              </p>
            </div>
          )}
        </>
      )}

      {/* ───────── Create/Edit Modal ───────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f172a] shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียนใหม่'}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="space-y-4 overflow-y-auto px-6 py-5" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              {/* Course */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  คอร์ส <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.courseId}
                    onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                    className="w-full appearance-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                  >
                    <option value="" className="bg-[#0f172a]">
                      -- เลือกคอร์ส --
                    </option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0f172a]">
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  ชื่อบทเรียน <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="เช่น Introduction to AI"
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  ชื่อรอง
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="คำอธิบายสั้น ๆ"
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  รายละเอียด
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="อธิบายเนื้อหาของบทเรียน..."
                  rows={3}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* YouTube URL */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={form.youtubeUrl}
                  onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Duration + Order row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    ความยาว
                  </label>
                  <input
                    type="text"
                    value={form.durationText}
                    onChange={(e) => setForm({ ...form, durationText: e.target.value })}
                    placeholder="เช่น 15 นาที"
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    ลำดับบทเรียน <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.lessonOrder}
                    onChange={(e) =>
                      setForm({ ...form, lessonOrder: parseInt(e.target.value) || 1 })
                    }
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Level + Active row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    ระดับ
                  </label>
                  <div className="relative">
                    <select
                      value={form.lessonLevel}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          lessonLevel: e.target.value as LessonForm['lessonLevel'],
                        })
                      }
                      className="w-full appearance-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                    >
                      <option value="BEGINNER" className="bg-[#0f172a]">
                        Beginner
                      </option>
                      <option value="INTERMEDIATE" className="bg-[#0f172a]">
                        Intermediate
                      </option>
                      <option value="ADVANCED" className="bg-[#0f172a]">
                        Advanced
                      </option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-400">
                    เปิดใช้งาน
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                    className={`mt-1 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                      form.isActive
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/[0.06] bg-white/[0.03] text-gray-400'
                    }`}
                  >
                    {form.isActive ? (
                      <ToggleRight className="h-5 w-5" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                    {form.isActive ? 'เปิด' : 'ปิด'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/[0.08]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editingId ? 'อัปเดต' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────── Delete Confirmation ───────── */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f172a] p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">ยืนยันการลบ</h3>
            <p className="mb-6 text-sm text-gray-400">
              คุณต้องการลบบทเรียนนี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/[0.08]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
