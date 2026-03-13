'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  MoreVertical,
  Eye,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react'

interface CertificateActionsProps {
  certificateCode: string
  previewUrl: string
  verifyUrl: string
}

export default function CertificateActions({
  certificateCode,
  previewUrl,
  verifyUrl,
}: CertificateActionsProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCopy = async () => {
    try {
      const fullUrl = `${window.location.origin}${verifyUrl}`
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const fullUrl = `${window.location.origin}${verifyUrl}`
      const textarea = document.createElement('textarea')
      textarea.value = fullUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
        aria-label={`Actions for ${certificateCode}`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f1d32] shadow-xl shadow-black/40">
          <div className="py-1">
            <Link
              href={previewUrl}
              target="_blank"
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/[0.04] hover:text-white"
              onClick={() => setOpen(false)}
            >
              <Eye className="h-4 w-4 text-blue-400" />
              ดู Preview
            </Link>
            <Link
              href={verifyUrl}
              target="_blank"
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/[0.04] hover:text-white"
              onClick={() => setOpen(false)}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Verification Link
            </Link>
            <button
              onClick={handleCopy}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">คัดลอกแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-purple-400" />
                  คัดลอก Link
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
