'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, CheckCircle2, Loader2 } from 'lucide-react'

interface ProgressActionsProps {
  enrollmentId: string
  currentStatus: string
}

export default function ProgressActions({ enrollmentId, currentStatus }: ProgressActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleMarkComplete = async () => {
    if (!confirm('ยืนยันเปลี่ยนสถานะเป็น "เรียนจบ"?')) return
    setLoading('complete')
    try {
      const res = await fetch(`/api/admin/progress/${enrollmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })
      const json = await res.json()
      if (json.success) {
        router.refresh()
      } else {
        alert(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(null)
    }
  }

  const handleResetProgress = async () => {
    if (!confirm('ยืนยันรีเซ็ตความก้าวหน้า? ข้อมูลบทเรียนที่เรียนจะถูกลบทั้งหมด')) return
    setLoading('reset')
    try {
      const res = await fetch(`/api/admin/progress/${enrollmentId}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (json.success) {
        router.refresh()
      } else {
        alert(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {currentStatus !== 'COMPLETED' && (
        <button
          onClick={handleMarkComplete}
          disabled={loading !== null}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 disabled:opacity-50"
          title="เรียนจบ"
        >
          {loading === 'complete' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
        </button>
      )}
      <button
        onClick={handleResetProgress}
        disabled={loading !== null}
        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
        title="รีเซ็ตความก้าวหน้า"
      >
        {loading === 'reset' ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <RotateCcw className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  )
}
