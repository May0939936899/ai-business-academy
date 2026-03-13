'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Save,
  ImageIcon,
} from 'lucide-react'

/* ── Types ────────────────────────────────────────────────────────────── */

interface Instructor {
  id: string
  name: string
  title: string
  bio: string | null
  profileImage: string | null
  expertise: string[]
  sortOrder: number
  isActive: boolean
  createdAt: string
  courses: { id: string; course: { id: string; title: string } }[]
}

interface InstructorForm {
  name: string
  title: string
  bio: string
  expertise: string
  profileImage: string
}

const emptyForm: InstructorForm = {
  name: '',
  title: '',
  bio: '',
  expertise: '',
  profileImage: '',
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const t = useTranslations('admin')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<InstructorForm>(emptyForm)

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  /* ── Fetch instructors ─────────────────────────────────────────────── */

  const fetchInstructors = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/instructors')
      const data = await res.json()
      if (data.success) {
        setInstructors(data.data)
      } else {
        setError(data.error || 'Error')
      }
    } catch {
      setError(t('cannotLoad'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInstructors()
  }, [fetchInstructors])

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

  function openEdit(instructor: Instructor) {
    setForm({
      name: instructor.name,
      title: instructor.title,
      bio: instructor.bio || '',
      expertise: instructor.expertise.join(', '),
      profileImage: instructor.profileImage || '',
    })
    setEditingId(instructor.id)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  /* ── Save (create / update) ────────────────────────────────────────── */

  async function handleSave() {
    if (!form.name.trim() || !form.title.trim()) {
      setError(t('fillNamePosition'))
      return
    }

    setSaving(true)
    setError('')

    const body = {
      name: form.name.trim(),
      title: form.title.trim(),
      bio: form.bio.trim() || null,
      expertise: form.expertise
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      profileImage: form.profileImage.trim() || null,
    }

    try {
      let res: Response
      if (editingId) {
        res = await fetch(`/api/admin/instructors/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch('/api/admin/instructors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      const data = await res.json()

      if (data.success) {
        setSuccess(editingId ? t('instructorUpdated') : t('instructorAdded'))
        closeModal()
        fetchInstructors()
      } else {
        setError(data.error || 'Error')
      }
    } catch {
      setError(t('cannotSave'))
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
      const res = await fetch(`/api/admin/instructors/${deleteId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(t('instructorDeleted'))
        setDeleteId(null)
        fetchInstructors()
      } else {
        setError(data.error || 'Error')
      }
    } catch {
      setError(t('cannotDelete'))
    } finally {
      setDeleting(false)
    }
  }

  /* ── Filter ────────────────────────────────────────────────────────── */

  const filtered = instructors.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase()))
  )

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
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{t('instructorsTitle')}</h1>
            <p className="text-sm text-gray-500">
              {t('instructorsDesc')}
            </p>
          </div>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          {t('addInstructor')}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchInstructors')}
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Instructor Grid */}
      {!loading && (
        <>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((instructor) => (
                <div
                  key={instructor.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a1628]/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-400" />

                  {/* Profile */}
                  <div className="mb-4 flex items-start gap-4">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl ring-2 ring-white/[0.08]">
                      {instructor.profileImage ? (
                        <Image
                          src={instructor.profileImage}
                          alt={instructor.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                          <Users className="h-6 w-6 text-purple-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white">{instructor.name}</h3>
                      <p className="text-sm text-gray-400">{instructor.title}</p>
                      {!instructor.isActive && (
                        <span className="mt-1 inline-flex rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 ring-1 ring-red-500/20">
                          {t('inactive')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {instructor.bio && (
                    <p className="mb-3 line-clamp-2 text-xs text-gray-500">
                      {instructor.bio}
                    </p>
                  )}

                  {/* Expertise tags */}
                  {instructor.expertise.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {instructor.expertise.map((exp) => (
                        <span
                          key={exp}
                          className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-400 ring-1 ring-blue-500/20"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Linked courses */}
                  {instructor.courses.length > 0 && (
                    <div className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{t('courseCount', { count: instructor.courses.length })}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(instructor)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-gray-300 transition-all hover:bg-white/[0.08]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => setDeleteId(instructor.id)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a1628]/40 p-12 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-gray-600" />
              <p className="text-lg font-medium text-gray-300">
                {search ? t('noInstructorsFound') : t('noInstructorsFound')}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {search
                  ? t('tryDifferentSearch')
                  : t('startAddingInstructors')}
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
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f172a] shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                {editingId ? t('editInstructor') : t('addNewInstructor')}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="space-y-4 px-6 py-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  {t('fullName')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t('fullNamePlaceholder')}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  {t('positionDept')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={t('positionDeptPlaceholder')}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  {t('briefBio')}
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder={t('briefBioPlaceholder')}
                  rows={3}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Expertise */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  {t('expertiseLabel')}
                </label>
                <input
                  type="text"
                  value={form.expertise}
                  onChange={(e) =>
                    setForm({ ...form, expertise: e.target.value })
                  }
                  placeholder={t('expertisePlaceholder')}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Profile Image */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  {t('profileImageUrl')}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={form.profileImage}
                    onChange={(e) =>
                      setForm({ ...form, profileImage: e.target.value })
                    }
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                  />
                  {form.profileImage && (
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg ring-1 ring-white/[0.08]">
                      <Image
                        src={form.profileImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/[0.08]"
              >
                {t('cancel')}
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
                {editingId ? t('update') : t('saveBtn')}
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
            <h3 className="mb-2 text-lg font-bold text-white">{t('confirmDelete')}</h3>
            <p className="mb-6 text-sm text-gray-400">
              {t('confirmDeleteMsg')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/[0.08]"
              >
                {t('cancel')}
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
                {t('deleteBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
