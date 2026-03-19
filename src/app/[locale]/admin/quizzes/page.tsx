'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FileQuestion,
  HelpCircle,
  Users,
  CheckCircle,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Save,
} from 'lucide-react'

/* ── Types ─────────────────────────────────────────────────────────── */

interface Course {
  id: string
  title: string
}

interface QuizQuestion {
  id: string
  quizId: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string | null
  difficulty: string
  sortOrder: number
}

interface Quiz {
  id: string
  courseId: string
  title: string
  passingScore: number
  isActive: boolean
  createdAt: string
  course: { id: string; title: string }
  _count: { questions: number; attempts: number }
  passRate: number
}

interface Stats {
  totalQuizzes: number
  totalQuestions: number
  totalAttempts: number
  avgPassRate: number
}

interface QuizForm {
  courseId: string
  title: string
  passingScore: number
}

interface QuestionForm {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string
}

const emptyQuizForm: QuizForm = { courseId: '', title: '', passingScore: 70 }
const emptyQuestionForm: QuestionForm = {
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: 'A',
  explanation: '',
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [stats, setStats] = useState<Stats>({ totalQuizzes: 0, totalQuestions: 0, totalAttempts: 0, avgPassRate: 0 })
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Quiz modal
  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null)
  const [quizForm, setQuizForm] = useState<QuizForm>(emptyQuizForm)

  // Delete quiz confirmation
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Questions panel
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(false)

  // Question modal
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [questionForm, setQuestionForm] = useState<QuestionForm>(emptyQuestionForm)
  const [questionSaving, setQuestionSaving] = useState(false)

  // Delete question
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null)
  const [questionDeleting, setQuestionDeleting] = useState(false)

  /* ── Auto-dismiss alerts ───────────────────────────────────────── */
  useEffect(() => {
    if (error) { const t = setTimeout(() => setError(''), 4000); return () => clearTimeout(t) }
  }, [error])
  useEffect(() => {
    if (success) { const t = setTimeout(() => setSuccess(''), 3000); return () => clearTimeout(t) }
  }, [success])

  /* ── Fetch quizzes ─────────────────────────────────────────────── */
  const fetchQuizzes = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/quizzes')
      const json = await res.json()
      if (json.success) {
        setQuizzes(json.data)
        setStats(json.stats)
      }
    } catch {
      setError('ไม่สามารถโหลดข้อมูลแบบทดสอบได้')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/courses')
      const json = await res.json()
      if (json.success) setCourses(json.data)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchQuizzes(); fetchCourses() }, [fetchQuizzes, fetchCourses])

  /* ── Quiz CRUD ─────────────────────────────────────────────────── */
  const openCreateQuiz = () => {
    setEditingQuizId(null)
    setQuizForm(emptyQuizForm)
    setQuizModalOpen(true)
  }

  const openEditQuiz = (quiz: Quiz) => {
    setEditingQuizId(quiz.id)
    setQuizForm({ courseId: quiz.courseId, title: quiz.title, passingScore: quiz.passingScore })
    setQuizModalOpen(true)
  }

  const saveQuiz = async () => {
    if (!quizForm.title.trim()) { setError('กรุณาระบุชื่อแบบทดสอบ'); return }
    if (!editingQuizId && !quizForm.courseId) { setError('กรุณาเลือกคอร์ส'); return }

    setSaving(true)
    try {
      const url = editingQuizId ? `/api/admin/quizzes/${editingQuizId}` : '/api/admin/quizzes'
      const method = editingQuizId ? 'PUT' : 'POST'
      const body = editingQuizId
        ? { title: quizForm.title, passingScore: quizForm.passingScore }
        : quizForm

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.success) {
        setSuccess(editingQuizId ? 'อัพเดตแบบทดสอบสำเร็จ' : 'สร้างแบบทดสอบสำเร็จ')
        setQuizModalOpen(false)
        fetchQuizzes()
      } else {
        setError(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  const deleteQuiz = async () => {
    if (!deleteQuizId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/quizzes/${deleteQuizId}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setSuccess('ลบแบบทดสอบสำเร็จ')
        setDeleteQuizId(null)
        if (expandedQuizId === deleteQuizId) setExpandedQuizId(null)
        fetchQuizzes()
      } else {
        setError(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('เกิดข้อผิดพลาด')
    } finally {
      setDeleting(false)
    }
  }

  const toggleQuizActive = async (quizId: string) => {
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}`, { method: 'PATCH' })
      const json = await res.json()
      if (json.success) {
        setSuccess(json.message)
        fetchQuizzes()
      } else {
        setError(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('เกิดข้อผิดพลาด')
    }
  }

  /* ── Questions CRUD ────────────────────────────────────────────── */
  const toggleQuestions = async (quizId: string) => {
    if (expandedQuizId === quizId) {
      setExpandedQuizId(null)
      return
    }
    setExpandedQuizId(quizId)
    setQuestionsLoading(true)
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}/questions`)
      const json = await res.json()
      if (json.success) setQuestions(json.data)
    } catch {
      setError('ไม่สามารถโหลดคำถามได้')
    } finally {
      setQuestionsLoading(false)
    }
  }

  const refreshQuestions = async (quizId: string) => {
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}/questions`)
      const json = await res.json()
      if (json.success) setQuestions(json.data)
    } catch { /* ignore */ }
    fetchQuizzes()
  }

  const openCreateQuestion = () => {
    setEditingQuestionId(null)
    setQuestionForm(emptyQuestionForm)
    setQuestionModalOpen(true)
  }

  const openEditQuestion = (q: QuizQuestion) => {
    setEditingQuestionId(q.id)
    setQuestionForm({
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
    })
    setQuestionModalOpen(true)
  }

  const saveQuestion = async () => {
    if (!expandedQuizId) return
    if (!questionForm.question.trim()) { setError('กรุณาระบุคำถาม'); return }
    if (!questionForm.optionA.trim() || !questionForm.optionB.trim() || !questionForm.optionC.trim() || !questionForm.optionD.trim()) {
      setError('กรุณาระบุตัวเลือกทั้ง 4 ข้อ'); return
    }

    setQuestionSaving(true)
    try {
      const url = `/api/admin/quizzes/${expandedQuizId}/questions`
      const method = editingQuestionId ? 'PUT' : 'POST'
      const body = editingQuestionId
        ? { questionId: editingQuestionId, ...questionForm }
        : questionForm

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.success) {
        setSuccess(editingQuestionId ? 'อัพเดตคำถามสำเร็จ' : 'เพิ่มคำถามสำเร็จ')
        setQuestionModalOpen(false)
        refreshQuestions(expandedQuizId)
      } else {
        setError(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('เกิดข้อผิดพลาด')
    } finally {
      setQuestionSaving(false)
    }
  }

  const deleteQuestion = async () => {
    if (!expandedQuizId || !deleteQuestionId) return
    setQuestionDeleting(true)
    try {
      const res = await fetch(`/api/admin/quizzes/${expandedQuizId}/questions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: deleteQuestionId }),
      })
      const json = await res.json()
      if (json.success) {
        setSuccess('ลบคำถามสำเร็จ')
        setDeleteQuestionId(null)
        refreshQuestions(expandedQuizId)
      } else {
        setError(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      setError('เกิดข้อผิดพลาด')
    } finally {
      setQuestionDeleting(false)
    }
  }

  /* ── Render ────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">จัดการแบบทดสอบ</h1>
          <p className="mt-1 text-sm text-gray-500">
            ทั้งหมด {stats.totalQuizzes} แบบทดสอบ
          </p>
        </div>
        <button
          onClick={openCreateQuiz}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
        >
          <Plus className="h-4 w-4" />
          สร้างแบบทดสอบ
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <FileQuestion className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalQuizzes}</p>
              <p className="text-xs text-gray-500">แบบทดสอบทั้งหมด</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <HelpCircle className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalQuestions}</p>
              <p className="text-xs text-gray-500">คำถามทั้งหมด</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalAttempts}</p>
              <p className="text-xs text-gray-500">ทำแบบทดสอบทั้งหมด</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgPassRate}%</p>
              <p className="text-xs text-gray-500">อัตราผ่านเฉลี่ย</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-20 text-center">
          <FileQuestion className="h-8 w-8 text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-300">ยังไม่มีแบบทดสอบ</h3>
          <p className="mt-1.5 text-sm text-gray-500">เริ่มสร้างแบบทดสอบสำหรับคอร์สของคุณ</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ชื่อแบบทดสอบ</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">คอร์ส</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">คำถาม</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">คะแนนผ่าน</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ครั้งทำ</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">อัตราผ่าน</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">สถานะ</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {quizzes.map((quiz) => (
                  <QuizRow
                    key={quiz.id}
                    quiz={quiz}
                    isExpanded={expandedQuizId === quiz.id}
                    questions={expandedQuizId === quiz.id ? questions : []}
                    questionsLoading={expandedQuizId === quiz.id && questionsLoading}
                    onToggleExpand={() => toggleQuestions(quiz.id)}
                    onEdit={() => openEditQuiz(quiz)}
                    onDelete={() => setDeleteQuizId(quiz.id)}
                    onToggleActive={() => toggleQuizActive(quiz.id)}
                    onAddQuestion={openCreateQuestion}
                    onEditQuestion={openEditQuestion}
                    onDeleteQuestion={(qId) => setDeleteQuestionId(qId)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/[0.06] px-5 py-3.5">
            <p className="text-sm text-gray-500">ทั้งหมด {quizzes.length} รายการ</p>
          </div>
        </div>
      )}

      {/* ── Quiz Create/Edit Modal ───────────────────────────────── */}
      {quizModalOpen && (
        <Modal onClose={() => setQuizModalOpen(false)} title={editingQuizId ? 'แก้ไขแบบทดสอบ' : 'สร้างแบบทดสอบใหม่'}>
          <div className="space-y-4">
            {!editingQuizId && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">คอร์ส</label>
                <select
                  value={quizForm.courseId}
                  onChange={(e) => setQuizForm((f) => ({ ...f, courseId: e.target.value }))}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                >
                  <option value="">-- เลือกคอร์ส --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">ชื่อแบบทดสอบ</label>
              <input
                type="text"
                value={quizForm.title}
                onChange={(e) => setQuizForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="เช่น แบบทดสอบท้ายบท"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">คะแนนผ่าน (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={quizForm.passingScore}
                onChange={(e) => setQuizForm((f) => ({ ...f, passingScore: parseInt(e.target.value) || 70 }))}
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setQuizModalOpen(false)}
                className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-gray-400 hover:bg-white/[0.04]"
              >
                ยกเลิก
              </button>
              <button
                onClick={saveQuiz}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingQuizId ? 'บันทึก' : 'สร้าง'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Question Create/Edit Modal ───────────────────────────── */}
      {questionModalOpen && (
        <Modal onClose={() => setQuestionModalOpen(false)} title={editingQuestionId ? 'แก้ไขคำถาม' : 'เพิ่มคำถามใหม่'}>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">คำถาม</label>
              <textarea
                value={questionForm.question}
                onChange={(e) => setQuestionForm((f) => ({ ...f, question: e.target.value }))}
                rows={3}
                placeholder="พิมพ์คำถาม..."
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
              />
            </div>
            {(['A', 'B', 'C', 'D'] as const).map((opt) => (
              <div key={opt}>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  ตัวเลือก {opt}
                  {questionForm.correctAnswer === opt && (
                    <span className="ml-2 text-xs text-emerald-400">(คำตอบที่ถูกต้อง)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={questionForm[`option${opt}` as keyof QuestionForm] as string}
                  onChange={(e) => setQuestionForm((f) => ({ ...f, [`option${opt}`]: e.target.value }))}
                  placeholder={`ตัวเลือก ${opt}`}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                />
              </div>
            ))}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">คำตอบที่ถูกต้อง</label>
              <div className="flex gap-3">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setQuestionForm((f) => ({ ...f, correctAnswer: opt }))}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
                      questionForm.correctAnswer === opt
                        ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                        : 'border-white/[0.08] bg-white/[0.04] text-gray-400 hover:bg-white/[0.06]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">คำอธิบาย (ไม่บังคับ)</label>
              <textarea
                value={questionForm.explanation}
                onChange={(e) => setQuestionForm((f) => ({ ...f, explanation: e.target.value }))}
                rows={2}
                placeholder="อธิบายเพิ่มเติม..."
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setQuestionModalOpen(false)}
                className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-gray-400 hover:bg-white/[0.04]"
              >
                ยกเลิก
              </button>
              <button
                onClick={saveQuestion}
                disabled={questionSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50"
              >
                {questionSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingQuestionId ? 'บันทึก' : 'เพิ่ม'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Quiz Confirmation ─────────────────────────────── */}
      {deleteQuizId && (
        <Modal onClose={() => setDeleteQuizId(null)} title="ยืนยันการลบแบบทดสอบ">
          <p className="text-sm text-gray-400">
            คุณแน่ใจหรือไม่ว่าต้องการลบแบบทดสอบนี้? คำถามและข้อมูลการทำแบบทดสอบทั้งหมดจะถูกลบด้วย
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setDeleteQuizId(null)}
              className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-gray-400 hover:bg-white/[0.04]"
            >
              ยกเลิก
            </button>
            <button
              onClick={deleteQuiz}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              ลบ
            </button>
          </div>
        </Modal>
      )}

      {/* ── Delete Question Confirmation ──────────────────────────── */}
      {deleteQuestionId && (
        <Modal onClose={() => setDeleteQuestionId(null)} title="ยืนยันการลบคำถาม">
          <p className="text-sm text-gray-400">คุณแน่ใจหรือไม่ว่าต้องการลบคำถามนี้?</p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setDeleteQuestionId(null)}
              className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-gray-400 hover:bg-white/[0.04]"
            >
              ยกเลิก
            </button>
            <button
              onClick={deleteQuestion}
              disabled={questionDeleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
            >
              {questionDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              ลบ
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ── Quiz Row Component ──────────────────────────────────────────── */

function QuizRow({
  quiz,
  isExpanded,
  questions,
  questionsLoading,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleActive,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: {
  quiz: Quiz
  isExpanded: boolean
  questions: QuizQuestion[]
  questionsLoading: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
  onAddQuestion: () => void
  onEditQuestion: (q: QuizQuestion) => void
  onDeleteQuestion: (qId: string) => void
}) {
  return (
    <>
      <tr className="transition-colors hover:bg-white/[0.02]">
        <td className="whitespace-nowrap px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
              <FileQuestion className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-gray-200">{quiz.title}</span>
          </div>
        </td>
        <td className="whitespace-nowrap px-5 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-gray-500" />
            <span className="max-w-[180px] truncate text-sm text-gray-400">{quiz.course.title}</span>
          </div>
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
          {quiz._count.questions} ข้อ
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
          {quiz.passingScore}%
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-400">
          {quiz._count.attempts} ครั้ง
        </td>
        <td className="whitespace-nowrap px-5 py-4">
          {quiz._count.attempts > 0 ? (
            <span className={`text-sm font-medium ${quiz.passRate >= 70 ? 'text-emerald-400' : quiz.passRate >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
              {quiz.passRate}%
            </span>
          ) : (
            <span className="text-sm text-gray-600">-</span>
          )}
        </td>
        <td className="whitespace-nowrap px-5 py-4">
          {quiz.isActive ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              เปิดใช้งาน
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/10 px-2.5 py-0.5 text-xs font-medium text-gray-500">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
              ปิดใช้งาน
            </span>
          )}
        </td>
        <td className="whitespace-nowrap px-5 py-4">
          <div className="flex items-center gap-1">
            <button onClick={onToggleExpand} title="จัดการคำถาม" className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-cyan-400">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button onClick={onEdit} title="แก้ไข" className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-blue-400">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={onToggleActive} title={quiz.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'} className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-amber-400">
              {quiz.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            </button>
            <button onClick={onDelete} title="ลบ" className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Questions Panel */}
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-white/[0.01] px-5 py-4">
            <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300">
                  <HelpCircle className="mr-1.5 inline h-4 w-4 text-cyan-400" />
                  คำถาม ({questions.length} ข้อ)
                </h3>
                <button
                  onClick={onAddQuestion}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600/80 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cyan-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                  เพิ่มคำถาม
                </button>
              </div>

              {questionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                </div>
              ) : questions.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-600">ยังไม่มีคำถาม</p>
              ) : (
                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-200">
                            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-xs text-purple-300">
                              {idx + 1}
                            </span>
                            {q.question}
                          </p>
                          <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                            {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                              <div
                                key={opt}
                                className={`rounded-md px-2.5 py-1.5 text-xs ${
                                  q.correctAnswer === opt
                                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                    : 'bg-white/[0.03] text-gray-500'
                                }`}
                              >
                                <span className="font-bold">{opt}.</span> {q[`option${opt}` as keyof QuizQuestion] as string}
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <p className="mt-2 text-xs text-gray-500">
                              <span className="font-medium text-gray-400">คำอธิบาย:</span> {q.explanation}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => onEditQuestion(q)} className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-blue-400">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => onDeleteQuestion(q.id)} className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-red-400">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

/* ── Modal Component ─────────────────────────────────────────────── */

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0d1b2a] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-500 hover:bg-white/[0.06] hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
