'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function CertificateError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useLocale()

  useEffect(() => {
    console.error('Certificate page error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-white">
          เกิดข้อผิดพลาด
        </h1>
        <p className="mb-2 text-sm text-gray-400">
          ไม่สามารถโหลดหน้า Certificate ได้ กรุณาลองใหม่อีกครั้ง
        </p>
        <p className="mb-8 font-mono text-xs text-gray-600 break-all">
          {error.message}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
          >
            <RefreshCw className="h-4 w-4" />
            ลองใหม่
          </button>
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับ Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
