'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, X } from 'lucide-react'

export default function CertificateSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(currentQuery)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value)
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set('q', value.trim())
      } else {
        params.delete('q')
      }
      router.push(`/admin/certificates?${params.toString()}`)
    })
  }

  const handleClear = () => {
    setQuery('')
    startTransition(() => {
      router.push('/admin/certificates')
    })
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className={`h-4 w-4 ${isPending ? 'animate-pulse text-blue-400' : 'text-gray-500'}`} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="ค้นหาด้วยรหัส Certificate, ชื่อผู้เรียน หรือชื่อคอร์ส..."
        className="w-full rounded-xl border border-white/[0.06] bg-[#0a1628]/50 py-3 pl-11 pr-10 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-blue-500/30 focus:bg-[#0a1628]/70"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
