'use client'

import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  Download,
  GraduationCap,
  BookOpen,
  Zap,
  Flame,
  Sparkles,
  Award,
  Pencil,
  Bot,
  BrainCircuit,
  BarChart3,
  Megaphone,
  Users,
  Cpu,
  CheckCircle2,
  Lock,
  Camera,
  Trophy,
  X,
  Star,
  Briefcase,
  ImagePlus,
  Upload,
} from 'lucide-react'

interface CardData {
  name: string
  email: string
  image: string | null
  position: string | null
  organization: string | null
  country: string | null
  role: string
  level: number
  levelTitle: string
  levelProgress: number
  xp: number
  xpForNext: number
  xpInLevel: number
  nextLevelTitle: string | null
  certificateCount: number
  courseCount: number
  streak: number
  overallProgress: number
  skills: string[]
  primaryPath: string | null
  studentId: string
  lessonsCompleted: number
  quizzesPassed: number
  memberSince: string
  certificates: { code: string; course: string; category: string }[]
  locale: string
}

/* ── Pixel Avatar Presets (10 female + 6 male = 16) ───────────────────────── */

interface AvatarPreset {
  id: string
  label: string
  gender: 'female' | 'male'
  skin: string
  hair: string
  clothes: string
  accent: string
  bgFrom: string
  bgTo: string
  pixels: number[][]
}

// 0=transparent 1=hair 2=skin 3=eyes 4=mouth 5=clothes 6=accessory/blush
const AVATAR_PRESETS: AvatarPreset[] = [
  // ── Female ──────────────────────────────────────────────────
  { id: 'f1', label: 'Sakura', gender: 'female',
    skin: '#FDDCB5', hair: '#2D1B30', clothes: '#E91E8C', accent: '#FF69B4',
    bgFrom: '#2d1053', bgTo: '#4a1e7a',
    pixels: [
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,0,1,2,2,2,2,2,2,1,0,0],
      [0,0,2,2,3,2,2,3,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,0,2,2,4,4,2,2,0,0,0],
      [0,0,0,0,5,5,5,5,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,0,5,5,0,5,5,0,5,5,0,0],
    ] },
  { id: 'f2', label: 'Luna', gender: 'female',
    skin: '#F5C9A8', hair: '#4A2C2A', clothes: '#6366F1', accent: '#818CF8',
    bgFrom: '#0f172a', bgTo: '#312e81',
    pixels: [
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,2,2,2,2,1,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,0,2,2,3,2,2,3,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,0,2,2,4,4,2,2,0,0,0],
      [0,0,0,0,5,5,5,5,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,0,5,0,0,5,5,0,0,5,0,0],
    ] },
  { id: 'f3', label: 'Mia', gender: 'female',
    skin: '#E8B896', hair: '#D4A76A', clothes: '#10B981', accent: '#34D399',
    bgFrom: '#052e16', bgTo: '#065f46',
    pixels: [
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,2,2,2,2,1,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,1,2,2,2,2,2,2,2,2,1,0],
      [0,0,2,2,3,2,2,3,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,0,2,2,4,4,2,2,0,0,0],
      [0,0,0,0,5,5,5,5,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,0,5,5,0,5,5,0,0],
      [0,0,5,0,0,5,5,0,0,5,0,0],
    ] },
  { id: 'f4', label: 'Aria', gender: 'female',
    skin: '#FDDCB5', hair: '#C1440E', clothes: '#F59E0B', accent: '#FBBF24',
    bgFrom: '#451a03', bgTo: '#92400e',
    pixels: [
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,2,2,2,2,1,1,1,0],
      [1,1,1,2,2,2,2,2,2,1,1,1],
      [1,0,2,2,2,2,2,2,2,2,0,1],
      [0,0,2,2,3,2,2,3,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,0,2,2,4,4,2,2,0,0,0],
      [0,0,0,0,5,5,5,5,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,0,5,5,0,5,5,0,5,5,0,0],
    ] },
  { id: 'f5', label: 'Nami', gender: 'female',
    skin: '#D4A373', hair: '#1A1A2E', clothes: '#EC4899', accent: '#F472B6',
    bgFrom: '#1a0a2e', bgTo: '#581c87',
    pixels: [
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,2,2,2,2,1,1,1,0],
      [0,1,2,2,2,2,2,2,2,2,1,0],
      [0,0,2,2,3,2,2,3,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,0,2,2,4,4,2,2,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,5,5,5,5,5,5,5,5,5,5,0],
      [0,5,5,0,0,5,5,0,0,5,5,0],
      [0,0,0,0,0,5,5,0,0,0,0,0],
    ] },
  { id: 'f6', label: 'Yuki', gender: 'female',
    skin: '#FDE8D0', hair: '#F5F5DC', clothes: '#06B6D4', accent: '#22D3EE',
    bgFrom: '#083344', bgTo: '#155e75',
    pixels: [
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,2,2,3,2,2,3,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,0,2,2,4,4,2,2,0,0,0],
      [0,0,0,0,2,2,2,2,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,0,5,0,0,5,5,0,0,5,0,0],
    ] },
  { id: 'f7', label: 'Bella', gender: 'female',
    skin: '#C68642', hair: '#1C1C1C', clothes: '#A855F7', accent: '#C084FC',
    bgFrom: '#1e0a3c', bgTo: '#4c1d95',
    pixels: [
      [0,0,0,1,1,1,1,1,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,2,2,2,2,1,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,0,2,2,3,2,2,3,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,0,2,2,4,4,2,2,0,0,0],
      [0,0,0,0,5,5,5,5,0,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,5,5,5,5,5,5,5,5,5,5,0],
      [0,5,5,0,0,5,5,0,0,5,5,0],
    ] },
  { id: 'f8', label: 'Coco', gender: 'female',
    skin: '#FDDCB5', hair: '#8B4513', clothes: '#F43F5E', accent: '#FB7185',
    bgFrom: '#4c0519', bgTo: '#881337',
    pixels: [
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,2,2,2,2,1,1,1,1],
      [1,1,2,2,2,2,2,2,2,2,1,1],
      [0,1,2,2,2,2,2,2,2,2,1,0],
      [0,0,2,2,3,2,2,3,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,0,2,2,4,4,2,2,0,0,0],
      [0,0,0,0,5,5,5,5,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,0,5,5,0,0,0,0,5,5,0,0],
    ] },
  { id: 'f9', label: 'Lily', gender: 'female',
    skin: '#F5C9A8', hair: '#FF6B6B', clothes: '#38BDF8', accent: '#7DD3FC',
    bgFrom: '#0c1a3d', bgTo: '#1e3a6e',
    pixels: [
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,1,2,2,2,2,2,2,2,2,1,0],
      [0,0,2,2,3,2,2,3,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,0,2,2,4,4,2,2,0,0,0],
      [0,0,0,0,5,5,5,5,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,0,5,5,0,5,5,0,0],
      [0,0,5,0,0,5,5,0,0,5,0,0],
    ] },
  { id: 'f10', label: 'Hana', gender: 'female',
    skin: '#E8B896', hair: '#2C1810', clothes: '#FB923C', accent: '#FDBA74',
    bgFrom: '#431407', bgTo: '#7c2d12',
    pixels: [
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [1,1,2,2,2,2,2,2,2,2,1,1],
      [0,0,2,2,3,2,2,3,2,2,0,0],
      [0,0,2,2,2,2,2,2,2,2,0,0],
      [0,0,0,2,2,4,4,2,2,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,0,5,5,0,5,5,0,5,5,0,0],
      [0,0,5,0,0,0,0,0,0,5,0,0],
    ] },
  // ── Male ────────────────────────────────────────────────────
  { id: 'm1', label: 'Kai', gender: 'male',
    skin: '#FDDCB5', hair: '#1A1A2E', clothes: '#2563EB', accent: '#3B82F6',
    bgFrom: '#0c1929', bgTo: '#1e3a5f',
    pixels: [
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,2,2,2,2,1,1,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,3,2,2,3,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,0,2,4,4,2,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,5,5,5,0,5,5,0,5,5,5,0],
      [0,5,5,0,0,5,5,0,0,5,5,0],
    ] },
  { id: 'm2', label: 'Leo', gender: 'male',
    skin: '#E0B490', hair: '#3D2B1F', clothes: '#0D9488', accent: '#14B8A6',
    bgFrom: '#042f2e', bgTo: '#115e59',
    pixels: [
      [0,0,0,1,1,1,1,1,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,2,2,2,2,2,1,0,0,0],
      [0,0,0,2,2,2,2,2,0,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,3,2,2,3,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,0,2,4,4,2,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,5,5,0,0,5,5,0,0,5,5,0],
      [0,5,0,0,0,5,5,0,0,0,5,0],
    ] },
  { id: 'm3', label: 'Ryu', gender: 'male',
    skin: '#F5C9A8', hair: '#111827', clothes: '#DC2626', accent: '#EF4444',
    bgFrom: '#1c0808', bgTo: '#450a0a',
    pixels: [
      [0,0,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,2,2,2,2,1,1,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,3,2,2,3,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,0,2,4,4,2,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,0,5,5,0,5,5,0,5,5,0,0],
      [0,0,5,0,0,5,5,0,0,5,0,0],
    ] },
  { id: 'm4', label: 'Max', gender: 'male',
    skin: '#FDDCB5', hair: '#D4A76A', clothes: '#7C3AED', accent: '#8B5CF6',
    bgFrom: '#1e0533', bgTo: '#4c1d95',
    pixels: [
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,2,2,2,2,1,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,3,2,2,3,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,0,2,4,4,2,0,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,5,5,5,5,5,5,5,5,5,5,0],
      [0,5,5,0,0,5,5,0,0,5,5,0],
      [0,5,0,0,0,5,5,0,0,0,5,0],
    ] },
  { id: 'm5', label: 'Zen', gender: 'male',
    skin: '#C68642', hair: '#0A0A0A', clothes: '#059669', accent: '#34D399',
    bgFrom: '#022c22', bgTo: '#065f46',
    pixels: [
      [0,0,0,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,0,0],
      [0,0,1,1,2,2,2,2,1,1,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,3,2,2,3,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,0,2,4,4,2,0,0,0,0],
      [0,0,0,5,5,5,5,5,5,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,5,5,5,0,5,5,0,5,5,5,0],
      [0,5,0,0,0,5,5,0,0,0,5,0],
    ] },
  { id: 'm6', label: 'Finn', gender: 'male',
    skin: '#F5C9A8', hair: '#B45309', clothes: '#0EA5E9', accent: '#38BDF8',
    bgFrom: '#0c2744', bgTo: '#0369a1',
    pixels: [
      [0,0,0,1,1,1,1,1,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,2,2,2,2,2,0,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,2,3,2,2,3,2,0,0,0],
      [0,0,0,2,2,2,2,2,2,0,0,0],
      [0,0,0,0,2,4,4,2,0,0,0,0],
      [0,0,5,5,5,5,5,5,5,5,0,0],
      [0,5,5,5,5,5,5,5,5,5,5,0],
      [0,5,5,0,0,5,5,0,0,5,5,0],
      [0,5,0,0,0,5,5,0,0,0,5,0],
    ] },
]

/* ── Pixel Avatar Renderer ────────────────────────────────────────────────── */

function PixelAvatarSVG({ preset, size = 80 }: { preset: AvatarPreset; size?: number }) {
  const colorMap: Record<number, string> = {
    0: 'transparent',
    1: preset.hair,
    2: preset.skin,
    3: '#2C2C2C',
    4: '#E57373',
    5: preset.clothes,
    6: preset.accent,
  }
  const cellSize = size / 12
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={`bg-${preset.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={preset.bgFrom} />
          <stop offset="100%" stopColor={preset.bgTo} />
        </linearGradient>
      </defs>
      <rect width={size} height={size} rx={size * 0.18} fill={`url(#bg-${preset.id})`} />
      {preset.pixels.map((row, y) =>
        row.map((val, x) =>
          val !== 0 ? (
            <rect
              key={`${y}-${x}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize + 0.5}
              height={cellSize + 0.5}
              fill={colorMap[val] || preset.accent}
            />
          ) : null
        )
      )}
    </svg>
  )
}

/* ── Hash-based Pixel Avatar (fallback) ───────────────────────────────────── */

function PixelAvatar({ name, size = 48 }: { name: string; size?: number }) {
  const pixels = useMemo(() => {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
    const grid: boolean[][] = []
    for (let y = 0; y < 5; y++) {
      grid[y] = []
      for (let x = 0; x < 3; x++) {
        hash = ((hash << 5) - hash + (y * 5 + x + 1)) | 0
        grid[y][x] = Math.abs(hash) % 3 !== 0
      }
      grid[y][3] = grid[y][1]; grid[y][4] = grid[y][0]
    }
    return grid
  }, [name])
  const hue = useMemo(() => {
    let h = 0
    for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0
    return Math.abs(h) % 360
  }, [name])
  const cs = size / 7, p = cs
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} rx={size * 0.22} fill={`hsl(${hue},55%,10%)`} />
      {pixels.map((row, y) => row.map((f, x) => f ? (
        <rect key={`${y}-${x}`} x={p + x * cs} y={p + y * cs} width={cs - 0.5} height={cs - 0.5} rx={1}
          fill={`hsl(${hue},65%,${55 + ((x + y) % 3) * 10}%)`} />
      ) : null))}
    </svg>
  )
}

/* ── Avatar Picker Modal ──────────────────────────────────────────────────── */

function AvatarPicker({
  currentImage,
  name,
  onSelect,
  onClose,
}: {
  currentImage: string | null
  name: string
  onSelect: (imageValue: string | null) => void
  onClose: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [tab, setTab] = useState<'pixel' | 'upload'>('pixel')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelectPreset = async (avatarId: string | null) => {
    setSaving(true)
    setUploadError(null)
    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: avatarId ? `pixel:${avatarId}` : null }),
      })
      if (res.ok) {
        onSelect(avatarId ? `pixel:${avatarId}` : null)
        onClose()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleUploadFile = async (file: File) => {
    setUploadError(null)
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setUploadError('รองรับเฉพาะ JPEG, PNG, WebP, GIF')
      return
    }
    if (file.size > 1 * 1024 * 1024) {
      setUploadError('ไฟล์ใหญ่เกินไป (สูงสุด 1MB)')
      return
    }
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/auth/upload-avatar', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success && data.url) {
        onSelect(data.url)
        onClose()
      } else {
        setUploadError(data.error || 'อัพโหลดไม่สำเร็จ')
      }
    } catch {
      setUploadError('เกิดข้อผิดพลาด ลองใหม่อีกครั้ง')
    } finally {
      setSaving(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUploadFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUploadFile(file)
  }

  const isCustomImage = currentImage && !currentImage.startsWith('pixel:') && currentImage !== null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a1628] shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0a1628] border-b border-white/[0.06] px-5 pt-5 pb-3">
          <button onClick={onClose} className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>

          <h3 className="text-lg font-bold text-white">เลือกรูปโปรไฟล์</h3>
          <p className="text-xs text-gray-500 mt-0.5">เลือก Pixel Art หรืออัพโหลดรูปของคุณเอง</p>

          {/* Tabs */}
          <div className="flex gap-1 mt-3 p-1 bg-white/[0.04] rounded-lg">
            <button
              onClick={() => setTab('pixel')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                tab === 'pixel'
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <Sparkles className="h-3.5 w-3.5" /> Pixel Art
            </button>
            <button
              onClick={() => setTab('upload')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                tab === 'upload'
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <ImagePlus className="h-3.5 w-3.5" /> อัพโหลดรูป
            </button>
          </div>
        </div>

        <div className="px-5 pb-5 pt-4">
          {tab === 'pixel' ? (
            <>
              {/* ── Female avatars ── */}
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-400/70 flex items-center gap-2">
                <span className="h-px flex-1 bg-pink-500/10" /> Female <span className="h-px flex-1 bg-pink-500/10" />
              </p>
              <div className="mb-5 grid grid-cols-5 gap-2">
                {AVATAR_PRESETS.filter(a => a.gender === 'female').map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    disabled={saving}
                    className={cn(
                      'group flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all hover:bg-white/[0.06] hover:scale-105',
                      currentImage === `pixel:${preset.id}` && 'ring-2 ring-pink-500 bg-pink-500/10 scale-105'
                    )}
                  >
                    <PixelAvatarSVG preset={preset} size={52} />
                    <span className="text-[8px] font-medium text-gray-600 group-hover:text-gray-300">{preset.label}</span>
                  </button>
                ))}
              </div>

              {/* ── Male avatars ── */}
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400/70 flex items-center gap-2">
                <span className="h-px flex-1 bg-blue-500/10" /> Male <span className="h-px flex-1 bg-blue-500/10" />
              </p>
              <div className="mb-5 grid grid-cols-5 gap-2">
                {AVATAR_PRESETS.filter(a => a.gender === 'male').map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    disabled={saving}
                    className={cn(
                      'group flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all hover:bg-white/[0.06] hover:scale-105',
                      currentImage === `pixel:${preset.id}` && 'ring-2 ring-blue-500 bg-blue-500/10 scale-105'
                    )}
                  >
                    <PixelAvatarSVG preset={preset} size={52} />
                    <span className="text-[8px] font-medium text-gray-600 group-hover:text-gray-300">{preset.label}</span>
                  </button>
                ))}
              </div>

              {/* ── Auto-generated ── */}
              <div className="border-t border-white/[0.06] pt-3">
                <button
                  onClick={() => handleSelectPreset(null)}
                  disabled={saving}
                  className={cn(
                    'flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-white/[0.06] w-full',
                    !currentImage && 'ring-2 ring-amber-500 bg-amber-500/10'
                  )}
                >
                  <PixelAvatar name={name} size={40} />
                  <div className="text-left">
                    <p className="text-xs font-medium text-gray-300">Auto-Generated</p>
                    <p className="text-[10px] text-gray-600">สร้างจากชื่อของคุณอัตโนมัติ</p>
                  </div>
                </button>
              </div>
            </>
          ) : (
            /* ── Upload Tab ── */
            <>
              {/* Show current custom image */}
              {isCustomImage && (
                <div className="mb-4 flex flex-col items-center gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">รูปปัจจุบัน</p>
                  <div className="h-20 w-20 overflow-hidden rounded-2xl ring-2 ring-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentImage} alt="Current" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all',
                  dragOver
                    ? 'border-blue-400 bg-blue-500/10 scale-[1.02]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <div className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
                  dragOver ? 'bg-blue-500/20' : 'bg-white/[0.05]'
                )}>
                  <Upload className={cn('h-6 w-6 transition-colors', dragOver ? 'text-blue-400' : 'text-gray-500')} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-300">
                    {dragOver ? 'วางรูปตรงนี้เลย!' : 'ลากวางรูป หรือคลิกเพื่อเลือก'}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-600">
                    JPEG, PNG, WebP, GIF · สูงสุด 1MB
                  </p>
                </div>
              </div>

              {uploadError && (
                <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400 text-center">
                  {uploadError}
                </div>
              )}

              <p className="mt-4 text-center text-[10px] text-gray-600 leading-relaxed">
                รูปจะถูกเก็บเป็นรูปโปรไฟล์ของคุณ<br />
                แนะนำใช้รูปสี่เหลี่ยมจัตุรัส (1:1) เพื่อความสวยงาม
              </p>
            </>
          )}
        </div>

        {/* Saving overlay */}
        {saving && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
              <span className="text-xs text-blue-300">กำลังบันทึก...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Skill Definitions ───────────────────────────────────────────────────── */

interface CareerMatch {
  role: string
  score: 5 | 4 | 3
  tooltip: string
}

const ALL_SKILLS = [
  { id: 'AI Automation', label: 'AI Automation', icon: Bot,
    gradient: 'from-blue-500 to-cyan-400', glowColor: 'rgba(59,130,246,0.35)',
    cardBg: 'from-blue-500/[0.08] via-blue-500/[0.03] to-transparent',
    text: 'text-blue-400', borderClr: 'border-blue-500/25',
    desc: 'ออกแบบระบบอัตโนมัติด้วย AI', descEn: 'AI-Powered Automation Systems',
    careers: [
      { role: 'Automation Developer', score: 5, tooltip: 'สร้างระบบอัตโนมัติด้วย AI เช่น chatbot, workflow automation' },
      { role: 'Workflow Designer', score: 4, tooltip: 'ออกแบบกระบวนการทำงานอัตโนมัติในองค์กร' },
      { role: 'No-Code AI Builder', score: 3, tooltip: 'สร้างโซลูชัน AI โดยไม่ต้องเขียนโค้ด ใช้เครื่องมือ Low/No-Code' },
    ] as CareerMatch[] },
  { id: 'AI Marketing', label: 'AI Marketing', icon: Megaphone,
    gradient: 'from-purple-500 to-pink-400', glowColor: 'rgba(168,85,247,0.35)',
    cardBg: 'from-purple-500/[0.08] via-purple-500/[0.03] to-transparent',
    text: 'text-purple-400', borderClr: 'border-purple-500/25',
    desc: 'วางกลยุทธ์การตลาดด้วย AI', descEn: 'AI-Driven Marketing Strategy',
    careers: [
      { role: 'AI Marketing Strategist', score: 5, tooltip: 'วางแผนการตลาดด้วย AI ทั้ง content, targeting และ personalization' },
      { role: 'Growth Hacker', score: 4, tooltip: 'ใช้ AI วิเคราะห์ข้อมูลเพื่อเร่งการเติบโตของธุรกิจ' },
      { role: 'Content AI Specialist', score: 3, tooltip: 'สร้างและจัดการ content ด้วย AI tools เช่น ChatGPT, Midjourney' },
    ] as CareerMatch[] },
  { id: 'AI HR', label: 'AI for HR', icon: Users,
    gradient: 'from-green-500 to-emerald-400', glowColor: 'rgba(34,197,94,0.35)',
    cardBg: 'from-green-500/[0.08] via-green-500/[0.03] to-transparent',
    text: 'text-green-400', borderClr: 'border-green-500/25',
    desc: 'บริหารทรัพยากรบุคคลด้วย AI', descEn: 'AI in Human Resources',
    careers: [
      { role: 'HR Tech Specialist', score: 5, tooltip: 'นำ AI มาใช้ในกระบวนการ HR ตั้งแต่สรรหาจนถึงพัฒนาบุคลากร' },
      { role: 'People Analytics Lead', score: 4, tooltip: 'วิเคราะห์ข้อมูลพนักงานเพื่อตัดสินใจด้าน HR อย่างแม่นยำ' },
      { role: 'Talent Acquisition AI', score: 3, tooltip: 'ใช้ AI คัดกรองและสรรหาผู้สมัครงานอย่างมีประสิทธิภาพ' },
    ] as CareerMatch[] },
  { id: 'AI Productivity', label: 'AI Productivity', icon: Cpu,
    gradient: 'from-orange-500 to-yellow-400', glowColor: 'rgba(249,115,22,0.35)',
    cardBg: 'from-orange-500/[0.08] via-orange-500/[0.03] to-transparent',
    text: 'text-orange-400', borderClr: 'border-orange-500/25',
    desc: 'เพิ่มประสิทธิภาพการทำงานด้วย AI', descEn: 'Boost Productivity with AI',
    careers: [
      { role: 'AI Operations Manager', score: 5, tooltip: 'บริหารจัดการงานประจำวันด้วย AI เพิ่มผลผลิตทั้งองค์กร' },
      { role: 'Digital Transformation Lead', score: 4, tooltip: 'นำ AI มาปรับเปลี่ยนกระบวนการทำงานให้ทันสมัย' },
      { role: 'AI Prompt Engineer', score: 3, tooltip: 'ออกแบบ prompt ให้ AI ทำงานได้ตรงตามต้องการ' },
    ] as CareerMatch[] },
  { id: 'AI Analytics', label: 'AI Analytics', icon: BarChart3,
    gradient: 'from-cyan-500 to-teal-400', glowColor: 'rgba(6,182,212,0.35)',
    cardBg: 'from-cyan-500/[0.08] via-cyan-500/[0.03] to-transparent',
    text: 'text-cyan-400', borderClr: 'border-cyan-500/25',
    desc: 'วิเคราะห์ข้อมูลเชิงลึกด้วย AI', descEn: 'Data-Driven AI Analytics',
    careers: [
      { role: 'Business Intelligence Analyst', score: 5, tooltip: 'วิเคราะห์ข้อมูลธุรกิจด้วย AI เพื่อสร้าง insight เชิงลึก' },
      { role: 'Data Storyteller', score: 4, tooltip: 'นำเสนอข้อมูลเชิงวิเคราะห์ให้เข้าใจง่ายด้วย visualization' },
      { role: 'Predictive Analyst', score: 3, tooltip: 'ใช้ AI พยากรณ์แนวโน้มธุรกิจและพฤติกรรมลูกค้า' },
    ] as CareerMatch[] },
  { id: 'AI Management', label: 'AI Management', icon: BrainCircuit,
    gradient: 'from-amber-500 to-yellow-400', glowColor: 'rgba(245,158,11,0.35)',
    cardBg: 'from-amber-500/[0.08] via-amber-500/[0.03] to-transparent',
    text: 'text-amber-400', borderClr: 'border-amber-500/25',
    desc: 'บริหารจัดการองค์กรด้วย AI', descEn: 'AI-Powered Management',
    careers: [
      { role: 'AI Strategy Director', score: 5, tooltip: 'กำหนดวิสัยทัศน์และกลยุทธ์ AI ระดับองค์กร' },
      { role: 'Innovation Manager', score: 4, tooltip: 'ผลักดันนวัตกรรม AI ให้เกิดขึ้นจริงในองค์กร' },
      { role: 'AI Project Lead', score: 3, tooltip: 'บริหารโปรเจกต์ AI ตั้งแต่วางแผนจนถึง deploy' },
    ] as CareerMatch[] },
]

/* ── Level Colors ────────────────────────────────────────────────────────── */
const lvlMeta: Record<number, { text: string; bar: string }> = {
  1: { text: 'text-gray-400', bar: 'from-gray-500 to-gray-400' },
  2: { text: 'text-green-400', bar: 'from-green-500 to-emerald-400' },
  3: { text: 'text-blue-400', bar: 'from-blue-500 to-cyan-400' },
  4: { text: 'text-purple-400', bar: 'from-purple-500 to-violet-400' },
  5: { text: 'text-amber-400', bar: 'from-amber-500 to-yellow-400' },
  6: { text: 'text-rose-400', bar: 'from-rose-500 to-pink-400' },
  7: { text: 'text-cyan-400', bar: 'from-cyan-500 to-teal-400' },
  8: { text: 'text-indigo-400', bar: 'from-indigo-500 to-blue-400' },
  9: { text: 'text-orange-400', bar: 'from-orange-500 to-red-400' },
  10: { text: 'text-yellow-400', bar: 'from-yellow-400 to-amber-300' },
}

/* ── 3D Tilt Hook ────────────────────────────────────────────────────────── */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null)
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (0.5 - y) * 12
    const rotateY = (x - 0.5) * 12
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    el.style.setProperty('--glow-x', `${x * 100}%`)
    el.style.setProperty('--glow-y', `${y * 100}%`)
  }, [])
  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
  }, [])
  return { ref, handleMove, handleLeave }
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function ProfileCard({ data }: { data: CardData }) {
  const allCardsRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [currentImage, setCurrentImage] = useState(data.image)
  useEffect(() => { setMounted(true) }, [])

  const lm = lvlMeta[data.level] || lvlMeta[3]
  const unlockedSet = new Set(data.skills)
  const unlockedCount = data.skills.length

  const handleDownload = async () => {
    if (!allCardsRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(allCardsRef.current, {
        backgroundColor: '#030712', scale: 2, useCORS: true, logging: false,
      })
      const link = document.createElement('a')
      link.download = `${data.name.replace(/\s+/g, '-')}-Skill-Card.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) { console.error(err) }
    finally { setDownloading(false) }
  }

  const memberDate = new Date(data.memberSince).toLocaleDateString('th-TH', { year: 'numeric', month: 'short' })

  // Sort: certified → unlocked → locked
  const sortedSkills = [...ALL_SKILLS].sort((a, b) => {
    const aCert = data.certificates.some((c) => c.category === a.id) ? 2 : unlockedSet.has(a.id) ? 1 : 0
    const bCert = data.certificates.some((c) => c.category === b.id) ? 2 : unlockedSet.has(b.id) ? 1 : 0
    return bCert - aCert
  })

  // Resolve avatar
  const resolvedPreset = currentImage?.startsWith('pixel:')
    ? AVATAR_PRESETS.find(p => p.id === currentImage.replace('pixel:', ''))
    : null

  const renderAvatar = (size: number) => {
    if (resolvedPreset) {
      return <PixelAvatarSVG preset={resolvedPreset} size={size} />
    }
    if (currentImage && !currentImage.startsWith('pixel:')) {
      /* eslint-disable-next-line @next/next/no-img-element */
      return <img src={currentImage} alt={data.name} className="h-full w-full rounded-2xl ring-2 ring-white/10 object-cover" style={{ width: size, height: size }} />
    }
    return <PixelAvatar name={data.name} size={size} />
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Ambient BG blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-600/[0.04] blur-[150px]" />
        <div className="absolute -right-40 top-60 h-[400px] w-[400px] rounded-full bg-purple-600/[0.04] blur-[150px]" />
        <div className="absolute left-1/3 top-[600px] h-[300px] w-[300px] rounded-full bg-cyan-600/[0.03] blur-[120px]" />
      </div>

      {/* ─── Responsive container: mobile → tablet → desktop → wide ─── */}
      <div className="relative mx-auto max-w-lg px-4 py-6 sm:max-w-2xl sm:px-6 md:max-w-3xl md:py-8 lg:max-w-5xl lg:px-8 xl:max-w-6xl 2xl:max-w-7xl">
        {/* Nav */}
        <div className="mb-5 flex items-center justify-between">
          <Link href={`/${data.locale}/dashboard`}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> แดชบอร์ด
          </Link>
          <Link href={`/${data.locale}/profile/edit`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
            <Pencil className="h-3.5 w-3.5" /> แก้ไขโปรไฟล์
          </Link>
        </div>

        <div ref={allCardsRef} className="space-y-4">

          {/* ═══════════ SUMMARY CARD — wider on desktop ═══════════ */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-blue-500/[0.08] to-transparent" />
            <div className="relative flex flex-col sm:flex-row items-stretch">
              {/* Avatar */}
              <div className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-white/[0.06] px-5 py-4 sm:px-6 sm:py-5 lg:px-8">
                <div className="relative">
                  <div className="overflow-hidden rounded-2xl w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
                    {renderAvatar(96)}
                  </div>
                  <div className={cn(
                    'absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black bg-[#0a0f1e] ring-2 ring-white/10',
                    lm.text
                  )}>{data.level}</div>
                </div>
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  className="mt-2 flex items-center gap-1 rounded-md bg-white/[0.05] px-2 py-1 text-[10px] text-gray-400 hover:text-white hover:bg-white/[0.1] transition-colors"
                >
                  <Camera className="h-3 w-3" /> เปลี่ยนรูป
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 px-5 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-blue-400/60">AI SPUBUS Academy</p>
                  <span className="rounded bg-gradient-to-r from-blue-500/15 to-cyan-500/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-400 ring-1 ring-blue-500/20">
                    Card Skill
                  </span>
                </div>
                <h1 className="truncate text-lg font-bold text-white leading-tight sm:text-xl">{data.name}</h1>
                <p className={cn('text-xs font-semibold', lm.text)}>{data.levelTitle} · Lv.{data.level}</p>
                {data.position && (
                  <p className="mt-0.5 truncate text-[11px] text-gray-500">
                    {data.position}{data.organization ? ` · ${data.organization}` : ''}
                  </p>
                )}
                {/* XP */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-400" /> {data.xp.toLocaleString()} XP
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {data.xpForNext > 0 ? `${data.xpInLevel.toLocaleString()}/${data.xpForNext.toLocaleString()}` : 'MAX'}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000', lm.bar)}
                      style={{ width: mounted ? `${data.levelProgress}%` : '0%' }} />
                  </div>
                </div>
                {/* Stats */}
                <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5 text-purple-400" />{data.certificateCount}</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-blue-400" />{data.courseCount}</span>
                  <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-cyan-400" />{data.lessonsCompleted}</span>
                  <span className={cn('flex items-center gap-1', data.streak >= 7 && 'text-orange-400')}>
                    <Flame className="h-3.5 w-3.5 text-orange-400" />{data.streak}d
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.05] px-5 py-2">
              <span className="font-mono text-[10px] font-semibold tracking-widest text-blue-400/50">{data.studentId}</span>
              <span className="text-[10px] text-gray-600">{memberDate}</span>
            </div>
          </div>

          {/* ═══════════ COLLECTION HEADER ═══════════ */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Skill Collection</span>
            </div>
            <div className="flex items-center gap-1.5">
              {ALL_SKILLS.map((s) => (
                <div key={s.id} className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  data.certificates.some(c => c.category === s.id)
                    ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                    : unlockedSet.has(s.id)
                      ? 'bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.3)]'
                      : 'bg-white/10'
                )} />
              ))}
              <span className="ml-1 text-[11px] font-bold text-gray-400">
                {unlockedCount}<span className="text-gray-600">/{ALL_SKILLS.length}</span>
              </span>
            </div>
          </div>

          {/* ═══════════ SKILL CARDS — responsive grid ═══════════ */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:gap-4">
            {sortedSkills.map((skill) => {
              const unlocked = unlockedSet.has(skill.id)
              const cert = data.certificates.find((c) => c.category === skill.id)
              return (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  unlocked={unlocked}
                  cert={cert}
                  mounted={mounted}
                />
              )
            })}
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link href={`/${data.locale}/dashboard`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm px-4 py-3 text-sm font-semibold text-gray-300 hover:bg-white/[0.08] hover:text-white transition-all">
            <BookOpen className="h-4 w-4" /> ดูแดชบอร์ด
          </Link>
          <button onClick={handleDownload} disabled={downloading}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
              'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110',
              downloading && 'opacity-70 cursor-not-allowed'
            )}>
            <Download className="h-4 w-4" />
            {downloading ? 'กำลังดาวน์โหลด...' : 'ดาวน์โหลดการ์ด'}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 lg:p-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white lg:text-base">
            <Zap className="h-4 w-4 text-amber-400" /> สถิติการเรียนรู้
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:gap-3">
            {[
              { v: data.lessonsCompleted, l: 'บทเรียน' },
              { v: data.quizzesPassed, l: 'แบบทดสอบ' },
              { v: data.certificateCount, l: 'ใบ Cert' },
              { v: data.xp.toLocaleString(), l: 'XP' },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-2 py-2 text-center">
                <p className="text-base font-bold text-white">{s.v}</p>
                <p className="text-[10px] text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <AvatarPicker
          currentImage={currentImage}
          name={data.name}
          onSelect={setCurrentImage}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}

      {/* Global shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKILL CARD (Individual)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Star Rating Component ─────────────────────────────────────────────────── */

function StarRating({ score }: { score: 5 | 4 | 3 }) {
  const colorClass = score === 5 ? 'text-amber-400' : score === 4 ? 'text-blue-400' : 'text-gray-500'
  return (
    <div className="flex items-center gap-px">
      {Array.from({ length: score }).map((_, i) => (
        <Star key={i} className={cn('h-2.5 w-2.5 fill-current', colorClass)} />
      ))}
    </div>
  )
}

/* ── Career Role Row with Tooltip ─────────────────────────────────────────── */

function CareerRow({ career, unlocked }: { career: CareerMatch; unlocked: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={cn(
        'flex items-center gap-2 rounded-md px-1.5 py-0.5 transition-colors',
        unlocked ? 'hover:bg-white/[0.04] cursor-default' : ''
      )}>
        <StarRating score={career.score} />
        <span className={cn(
          'text-[11px] leading-tight truncate',
          unlocked
            ? career.score === 5 ? 'text-amber-300/90 font-semibold' : career.score === 4 ? 'text-blue-300/80 font-medium' : 'text-gray-500'
            : 'text-gray-700'
        )}>
          {career.role}
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && unlocked && (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-1.5 animate-in fade-in duration-150">
          <div className="rounded-lg border border-white/10 bg-[#0f1d32] px-3 py-2 shadow-xl">
            <p className="text-[10px] leading-relaxed text-gray-300">{career.tooltip}</p>
            {/* Tooltip arrow */}
            <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 border-b border-r border-white/10 bg-[#0f1d32]" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKILL CARD (Individual)
   ═══════════════════════════════════════════════════════════════════════════ */

function SkillCard({
  skill,
  unlocked,
  cert,
  mounted,
}: {
  skill: typeof ALL_SKILLS[number]
  unlocked: boolean
  cert: { code: string; course: string; category: string } | undefined
  mounted: boolean
}) {
  const { ref, handleMove, handleLeave } = useTilt()
  const Icon = skill.icon
  const isCertified = !!cert

  const tier = isCertified ? 'gold' : unlocked ? 'silver' : 'locked'

  return (
    <div
      ref={ref}
      onMouseMove={unlocked ? handleMove : undefined}
      onMouseLeave={unlocked ? handleLeave : undefined}
      className={cn(
        'group relative overflow-hidden rounded-2xl border transition-all duration-300',
        'will-change-transform',
        tier === 'gold'
          ? `${skill.borderClr} bg-white/[0.04] backdrop-blur-xl hover:border-white/20`
          : tier === 'silver'
            ? `${skill.borderClr} bg-white/[0.03] backdrop-blur-xl hover:border-white/15`
            : 'border-white/[0.04] bg-white/[0.015]'
      )}
      style={
        unlocked
          ? ({ '--glow-x': '50%', '--glow-y': '50%' } as React.CSSProperties)
          : undefined
      }
    >
      {/* Certified: holographic shimmer */}
      {isCertified && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 35%, transparent 50%, rgba(255,255,255,0.3) 65%, transparent 80%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 4s ease-in-out infinite',
          }}
        />
      )}

      {/* Background gradient */}
      {unlocked && (
        <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100', skill.cardBg)} />
      )}

      {/* Cursor-following glow */}
      {unlocked && (
        <div
          className="pointer-events-none absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          style={{
            left: 'var(--glow-x)',
            top: 'var(--glow-y)',
            background: `radial-gradient(circle, ${skill.glowColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Top accent */}
      {unlocked && (
        <div className={cn('absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r', skill.gradient)} />
      )}

      {/* Content */}
      <div className="relative px-4 pt-4 pb-3.5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="relative">
            {unlocked && (
              <div
                className="absolute -inset-1 rounded-xl blur-md opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${skill.glowColor}, transparent)`,
                  animation: isCertified ? 'glow-pulse 3s ease-in-out infinite' : undefined,
                }}
              />
            )}
            <div className={cn(
              'relative flex h-11 w-11 items-center justify-center rounded-xl',
              unlocked
                ? `bg-gradient-to-br ${skill.gradient} shadow-lg`
                : 'bg-white/[0.04] ring-1 ring-white/[0.06]'
            )}>
              {unlocked
                ? <Icon className="h-5 w-5 text-white" />
                : <Lock className="h-4 w-4 text-gray-700" />
              }
            </div>
          </div>

          {/* Tier badge */}
          {isCertified ? (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-400 ring-1 ring-amber-500/25">
              <Award className="h-3 w-3" /> Certified
            </span>
          ) : unlocked ? (
            <span className="flex items-center gap-1 rounded-full bg-white/[0.05] px-2 py-0.5 text-[9px] font-semibold text-blue-400 ring-1 ring-blue-500/15">
              <CheckCircle2 className="h-3 w-3" /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-white/[0.02] px-2 py-0.5 text-[9px] text-gray-700 ring-1 ring-white/[0.04]">
              <Lock className="h-2.5 w-2.5" /> Locked
            </span>
          )}
        </div>

        {/* Skill name */}
        <h3 className={cn(
          'text-base font-bold leading-tight tracking-wide',
          unlocked ? 'text-white' : 'text-gray-700'
        )}>
          {skill.label}
        </h3>

        <p className={cn('text-[11px] mt-0.5', unlocked ? 'text-gray-500' : 'text-gray-800')}>
          {skill.descEn}
        </p>

        <p className={cn('text-xs mt-1 leading-snug', unlocked ? 'text-gray-400' : 'text-gray-700')}>
          {skill.desc}
        </p>

        {/* Certificate info */}
        {cert && (
          <div className="mt-2.5 rounded-lg border border-amber-500/10 bg-amber-500/[0.04] px-2.5 py-2">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-amber-500 to-yellow-400 flex-shrink-0">
                <GraduationCap className="h-3 w-3 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-amber-300/90">{cert.course}</p>
                <p className="font-mono text-[9px] text-amber-500/50">{cert.code}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Top Career Matches ── */}
        <div className={cn(
          'mt-3 rounded-lg border px-2.5 py-2',
          unlocked
            ? 'border-white/[0.06] bg-white/[0.02]'
            : 'border-white/[0.03] bg-white/[0.01]'
        )}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Briefcase className={cn('h-3 w-3', unlocked ? 'text-gray-400' : 'text-gray-700')} />
            <span className={cn('text-[10px] font-semibold uppercase tracking-wider', unlocked ? 'text-gray-400' : 'text-gray-700')}>
              Top Career Matches
            </span>
          </div>
          <div className="space-y-0.5">
            {skill.careers.map((career) => (
              <CareerRow key={career.role} career={career} unlocked={unlocked} />
            ))}
          </div>
        </div>

        {/* Locked hint */}
        {!unlocked && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-gray-700 italic">
            <Sparkles className="h-3 w-3" />
            ลงทะเบียนเรียนเพื่อปลดล็อก
          </div>
        )}
      </div>
    </div>
  )
}
