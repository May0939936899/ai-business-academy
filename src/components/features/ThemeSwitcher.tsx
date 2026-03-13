'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

const THEME_KEY = 'aiba-theme'
const THEME_CLASSES = ['theme-navy', 'theme-dark', 'theme-light'] as const
type ThemeId = (typeof THEME_CLASSES)[number]

const themes: { id: ThemeId; label: string; icon: typeof Sun; preview: string }[] = [
  { id: 'theme-navy', label: 'Navy', icon: Monitor, preview: '#0f172a' },
  { id: 'theme-dark', label: 'Dark', icon: Moon, preview: '#000000' },
  { id: 'theme-light', label: 'Light', icon: Sun, preview: '#f8fafc' },
]

function applyTheme(themeId: ThemeId) {
  const el = document.documentElement
  THEME_CLASSES.forEach((c) => el.classList.remove(c))
  el.classList.add(themeId)
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>('theme-navy')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) || 'theme-navy') as ThemeId
    if (THEME_CLASSES.includes(saved)) {
      setTheme(saved)
      applyTheme(saved)
    }
  }, [])

  const changeTheme = (newTheme: ThemeId) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem(THEME_KEY, newTheme)
    setOpen(false)
  }

  const CurrentIcon = themes.find((t) => t.id === theme)?.icon || Monitor

  return (
    <div className="fixed right-4 top-24 z-40">
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          'border border-white/[0.1] bg-[#0a1628]/90 shadow-lg backdrop-blur-xl',
          'text-gray-400 transition-all duration-200',
          'hover:border-white/[0.2] hover:text-white',
          open && 'border-cyan-500/30 text-cyan-400'
        )}
        aria-label="เปลี่ยนธีม"
      >
        <CurrentIcon className="h-4 w-4" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="mt-2 flex flex-col gap-1.5 rounded-xl border border-white/[0.08] bg-[#0a0f1e]/95 p-2 shadow-2xl backdrop-blur-xl animate-fade-in">
          {themes.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                  theme === t.id
                    ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50'
                    : 'text-gray-500 hover:bg-white/[0.06] hover:text-gray-300'
                )}
                title={t.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
