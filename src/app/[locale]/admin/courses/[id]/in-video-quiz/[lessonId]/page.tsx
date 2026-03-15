'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface QuizQuestion {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string
  triggerPercent: number
  sortOrder: number
}

type NewQuestion = Omit<QuizQuestion, 'id'> & { id?: string; isNew?: boolean }

// ─── Component ──────────────────────────────────────────────────────────────

export default function InVideoQuizAdminPage() {
  const params = useParams()
  const locale = useLocale()
  const courseId = params.id as string
  const lessonId = params.lessonId as string

  const [questions, setQuestions] = useState<(QuizQuestion | NewQuestion)[]>([])
  const [lessonTitle, setLessonTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // ── Fetch existing questions ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [quizRes, lessonRes] = await Promise.all([
          fetch(`/api/admin/lessons/${lessonId}/in-video-quiz`),
          fetch(`/api/lessons/${lessonId}`),
        ])

        if (quizRes.ok) {
          const data = await quizRes.json()
          setQuestions(data.questions || [])
        }

        if (lessonRes.ok) {
          const data = await lessonRes.json()
          setLessonTitle(data.lesson?.title || data.title || `Lesson ${lessonId}`)
        }
      } catch {
        setMessage({ type: 'error', text: 'โหลดข้อมูลไม่สำเร็จ' })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [lessonId])

  // ── Add new empty question ────────────────────────────────────────────────
  const addQuestion = () => {
    const nextSort = questions.length
    const nextPercent = nextSort === 0 ? 30 : nextSort === 1 ? 65 : 50
    setQuestions([
      ...questions,
      {
        isNew: true,
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
        triggerPercent: nextPercent,
        sortOrder: nextSort,
      },
    ])
  }

  // ── Update a field on a question ──────────────────────────────────────────
  const updateField = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    )
  }

  // ── Delete a question ─────────────────────────────────────────────────────
  const deleteQuestion = async (index: number) => {
    const q = questions[index]
    if ('id' in q && q.id && !('isNew' in q)) {
      // Delete from DB
      try {
        await fetch(
          `/api/admin/lessons/${lessonId}/in-video-quiz?id=${q.id}`,
          { method: 'DELETE' }
        )
      } catch {
        setMessage({ type: 'error', text: 'ลบไม่สำเร็จ' })
        return
      }
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index))
    setMessage({ type: 'success', text: 'ลบคำถามแล้ว' })
    setTimeout(() => setMessage(null), 2000)
  }

  // ── Save all questions ────────────────────────────────────────────────────
  const saveAll = async () => {
    setSaving(true)
    setMessage(null)

    try {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const payload = {
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          triggerPercent: q.triggerPercent,
          sortOrder: i,
        }

        if ('isNew' in q && q.isNew) {
          // Create
          const res = await fetch(
            `/api/admin/lessons/${lessonId}/in-video-quiz`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }
          )
          if (!res.ok) throw new Error('Create failed')
        } else if ('id' in q && q.id) {
          // Update
          const res = await fetch(
            `/api/admin/lessons/${lessonId}/in-video-quiz`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: q.id, ...payload }),
            }
          )
          if (!res.ok) throw new Error('Update failed')
        }
      }

      // Reload fresh data
      const res = await fetch(`/api/admin/lessons/${lessonId}/in-video-quiz`)
      if (res.ok) {
        const data = await res.json()
        setQuestions(data.questions || [])
      }

      setMessage({ type: 'success', text: 'บันทึกสำเร็จ!' })
    } catch {
      setMessage({ type: 'error', text: 'บันทึกไม่สำเร็จ กรุณาลองใหม่' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/${locale}/admin/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าคอร์ส
        </Link>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                In-Video Quiz
              </h1>
              <p className="text-sm text-gray-400">{lessonTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={addQuestion}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-white/[0.08]"
            >
              <Plus className="h-4 w-4" />
              เพิ่มคำถาม
            </button>
            <button
              onClick={saveAll}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
            message.type === 'success'
              ? 'border-green-500/20 bg-green-500/10 text-green-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {message.text}
        </div>
      )}

      {/* Info badge */}
      <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-xs text-blue-300">
        <Lightbulb className="h-4 w-4 flex-shrink-0 text-blue-400" />
        คำถามจะปรากฏขึ้นระหว่างดูวิดีโอ ตาม % ที่กำหนด เช่น 30% = เมื่อดูไปได้
        30% ของวิดีโอ วิดีโอจะหยุดแล้วแสดงคำถาม
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a1628]/50 px-6 py-16 text-center">
          <Lightbulb className="h-8 w-8 text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-300">
            ยังไม่มีคำถาม In-Video Quiz
          </h3>
          <p className="mt-1.5 text-sm text-gray-500">
            กดปุ่ม &quot;เพิ่มคำถาม&quot; เพื่อสร้างคำถามแรก
          </p>
          <button
            onClick={addQuestion}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            เพิ่มคำถาม
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={'id' in q && q.id ? q.id : `new-${index}`}
              className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5"
            >
              {/* Question Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm font-bold text-yellow-400">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">Trigger %</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={q.triggerPercent}
                      onChange={(e) =>
                        updateField(index, 'triggerPercent', parseInt(e.target.value) || 30)
                      }
                      className="w-16 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-center text-sm text-white outline-none focus:border-blue-500/50"
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                  {'isNew' in q && q.isNew && (
                    <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                      NEW
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteQuestion(index)}
                  className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  title="ลบคำถาม"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-3">
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  คำถาม
                </label>
                <textarea
                  value={q.question}
                  onChange={(e) => updateField(index, 'question', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50"
                  placeholder="พิมพ์คำถาม..."
                />
              </div>

              {/* Options Grid */}
              <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                  const key = `option${letter}` as 'optionA' | 'optionB' | 'optionC' | 'optionD'
                  const isCorrect = q.correctAnswer === letter
                  return (
                    <div key={letter} className="flex items-center gap-2">
                      <button
                        onClick={() => updateField(index, 'correctAnswer', letter)}
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          isCorrect
                            ? 'bg-green-500 text-white'
                            : 'bg-white/[0.06] text-gray-400 hover:bg-white/[0.1]'
                        }`}
                        title={isCorrect ? 'คำตอบที่ถูกต้อง' : 'คลิกเพื่อกำหนดเป็นคำตอบที่ถูก'}
                      >
                        {letter}
                      </button>
                      <input
                        value={q[key] as string}
                        onChange={(e) => updateField(index, key, e.target.value)}
                        className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50"
                        placeholder={`ตัวเลือก ${letter}`}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Correct answer indicator */}
              <p className="mb-2 text-xs text-green-400/70">
                ✓ คำตอบที่ถูกต้อง: ตัวเลือก {q.correctAnswer}
                <span className="text-gray-500">
                  {' '}
                  (คลิกที่ตัวอักษร A-D เพื่อเปลี่ยน)
                </span>
              </p>

              {/* Explanation */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  คำอธิบาย (แสดงหลังตอบ)
                </label>
                <textarea
                  value={q.explanation || ''}
                  onChange={(e) => updateField(index, 'explanation', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50"
                  placeholder="อธิบายเพิ่มเติม (ไม่บังคับ)..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
