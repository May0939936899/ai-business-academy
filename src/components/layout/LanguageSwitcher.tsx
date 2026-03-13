'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/lib/navigation'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config'
import { Globe, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(newLocale: Locale) {
    setOpen(false)
    // Persist in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_LOCALE', newLocale)
    }
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm',
          'text-gray-400 transition-colors',
          'hover:bg-white/[0.06] hover:text-white',
          isPending && 'opacity-60'
        )}
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden text-xs font-medium sm:inline">
          {localeFlags[locale]} {localeNames[locale]}
        </span>
        <span className="text-xs sm:hidden">{localeFlags[locale]}</span>
        <ChevronDown
          className={cn(
            'hidden h-3 w-3 transition-transform sm:block',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0f1e]/95 shadow-2xl backdrop-blur-xl">
          <div className="py-1">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  l === locale
                    ? 'bg-[#2196F3]/10 text-[#4FC3F7]'
                    : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                )}
              >
                <span className="text-base">{localeFlags[l]}</span>
                <span className="font-medium">{localeNames[l]}</span>
                {l === locale && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#4FC3F7]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
