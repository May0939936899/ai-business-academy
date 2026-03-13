'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Download, ChevronDown, FileSpreadsheet, Loader2 } from 'lucide-react'

interface ExportOption {
  type: string
  labelKey: string
}

interface ExportButtonProps {
  /** Single export type — renders a simple button */
  exportType?: string
  /** Multiple export options — renders a dropdown button */
  options?: ExportOption[]
}

export default function ExportButton({ exportType, options }: ExportButtonProps) {
  const t = useTranslations('admin')
  const [exporting, setExporting] = useState(false)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = async (type: string) => {
    setExporting(true)
    setOpen(false)
    try {
      const res = await fetch(`/api/admin/export?type=${type}`)
      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const disposition = res.headers.get('content-disposition')
      const filename = disposition
        ? disposition.split('filename="')[1]?.replace('"', '') || 'export.xlsx'
        : 'export.xlsx'
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Export error:', err)
    } finally {
      setExporting(false)
    }
  }

  // Simple single-type button
  if (exportType && !options) {
    return (
      <button
        onClick={() => handleExport(exportType)}
        disabled={exporting}
        className="inline-flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-400 transition-all hover:bg-green-500/20 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        {exporting ? t('exporting') : t('exportExcel')}
      </button>
    )
  }

  // Dropdown with multiple options
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={exporting}
        className="inline-flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-400 transition-all hover:bg-green-500/20 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {exporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {exporting ? t('exporting') : t('exportExcel')}
        {!exporting && <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-white/[0.08] bg-[#111827] p-1.5 shadow-2xl shadow-black/40">
          {options?.map((opt) => (
            <button
              key={opt.type}
              onClick={() => handleExport(opt.type)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-400" />
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
