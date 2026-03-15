'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const THEME_KEY = 'aiba-theme'

type ThemeId = 'theme-midnight' | 'theme-eclipse' | 'theme-parchment' | 'theme-arctic'

interface Theme {
  id: ThemeId
  label: string
  labelTh: string
  swatch: string      // preview color dot
  swatchBorder: string
  icon: string        // emoji icon
}

const THEMES: Theme[] = [
  {
    id: 'theme-midnight',
    label: 'Midnight',
    labelTh: 'มิดไนท์',
    swatch: '#0d1117',
    swatchBorder: '#3b82f6',
    icon: '🌙',
  },
  {
    id: 'theme-eclipse',
    label: 'Eclipse',
    labelTh: 'อีคลิปส์',
    swatch: '#09090b',
    swatchBorder: '#a1a1aa',
    icon: '⚫',
  },
  {
    id: 'theme-parchment',
    label: 'Parchment',
    labelTh: 'ครีม',
    swatch: '#faf7f2',
    swatchBorder: '#d6cfc5',
    icon: '☀️',
  },
  {
    id: 'theme-arctic',
    label: 'Arctic',
    labelTh: 'อาร์กติก',
    swatch: '#f1f5f9',
    swatchBorder: '#94a3b8',
    icon: '🔆',
  },
]

const VALID_IDS = THEMES.map((t) => t.id)

function applyTheme(themeId: ThemeId) {
  const el = document.documentElement
  VALID_IDS.forEach((id) => el.classList.remove(id))
  el.classList.add(themeId)
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>('theme-midnight')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as ThemeId | null
    if (saved && VALID_IDS.includes(saved)) {
      setTheme(saved)
      applyTheme(saved)
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const changeTheme = (id: ThemeId) => {
    setTheme(id)
    applyTheme(id)
    localStorage.setItem(THEME_KEY, id)
    setOpen(false)
  }

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0]
  const isLight = theme === 'theme-parchment' || theme === 'theme-arctic'

  return (
    <div ref={ref} className="fixed right-4 top-24 z-40 flex flex-col items-center gap-1.5">
      {/* ── Main toggle button ─────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        title={`Theme: ${current.label}`}
        aria-label="เปลี่ยนธีม"
        className={cn(
          'group relative flex h-10 w-10 items-center justify-center rounded-full',
          'border shadow-lg backdrop-blur-xl transition-all duration-200',
          open
            ? 'border-blue-500/40 shadow-blue-500/20'
            : 'border-white/10 hover:border-white/20',
          isLight
            ? 'bg-white/80 hover:bg-white'
            : 'bg-[#0a1628]/90 hover:bg-[#0f1d32]/90'
        )}
      >
        {/* Color swatch dot */}
        <span
          className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 transition-all"
          style={{
            backgroundColor: current.swatch,
            borderColor: current.swatchBorder,
          }}
        />
        {/* Icon */}
        <span className="text-sm leading-none">{current.icon}</span>
      </button>

      {/* ── Theme panel ───────────────────────── */}
      {open && (
        <div
          className={cn(
            'flex flex-col gap-1 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl',
            'animate-fade-in',
            isLight
              ? 'border-black/8 bg-white/95'
              : 'border-white/8 bg-[#0a0f1e]/95'
          )}
        >
          {THEMES.map((t) => {
            const isActive = t.id === theme
            const isThemeLight = t.id === 'theme-parchment' || t.id === 'theme-arctic'

            return (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                title={`${t.label} — ${t.labelTh}`}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all duration-150',
                  isActive
                    ? 'bg-blue-500/15 ring-1 ring-blue-500/40'
                    : isLight
                      ? 'hover:bg-black/5'
                      : 'hover:bg-white/[0.06]'
                )}
              >
                {/* Color swatch */}
                <span
                  className="h-5 w-5 flex-shrink-0 rounded-full border-2 shadow-sm transition-transform hover:scale-110"
                  style={{
                    backgroundColor: t.swatch,
                    borderColor: isActive ? '#3b82f6' : t.swatchBorder,
                  }}
                />
                {/* Labels */}
                <span className="flex flex-col leading-tight">
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      isActive
                        ? 'text-blue-400'
                        : isLight
                          ? 'text-slate-700'
                          : 'text-gray-200'
                    )}
                  >
                    {t.label}
                  </span>
                  <span
                    className={cn(
                      'text-[10px]',
                      isLight ? 'text-slate-500' : 'text-gray-500'
                    )}
                  >
                    {t.labelTh}
                  </span>
                </span>

                {/* Active check */}
                {isActive && (
                  <span className="ml-auto text-blue-400 text-xs">✓</span>
                )}
              </button>
            )
          })}

          {/* Research note */}
          <div
            className={cn(
              'mt-1 rounded-xl px-3 py-2 text-[10px] leading-relaxed',
              isLight
                ? 'bg-amber-50 text-amber-700'
                : 'bg-white/[0.03] text-gray-600'
            )}
          >
            ☀️ Parchment สบายตาที่สุดกลางวัน<br />
            🌙 Midnight เหมาะตอนกลางคืน
          </div>
        </div>
      )}
    </div>
  )
}
