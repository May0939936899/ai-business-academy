'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Loader2 } from 'lucide-react'

export default function CourseActions({
  courseId,
  courseTitle,
  locale,
}: {
  courseId: string
  courseTitle: string
  locale: string
}) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'ลบคอร์สไม่สำเร็จ')
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <a
          href={`/${locale}/admin/courses/${courseId}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          แก้ไข
        </a>
        <button
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
          ลบ
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl border border-white/[0.08] bg-[#0f1d32] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">ยืนยันการลบคอร์ส</h3>
            <p className="mt-2 text-sm text-gray-400">
              คุณต้องการลบคอร์ส <span className="font-medium text-white">&quot;{courseTitle}&quot;</span> หรือไม่?
              <br />
              <span className="text-red-400">การดำเนินการนี้จะลบบทเรียน แบบทดสอบ และข้อมูลการลงทะเบียนทั้งหมดที่เกี่ยวข้อง ไม่สามารถย้อนกลับได้</span>
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    กำลังลบ...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    ลบคอร์ส
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
