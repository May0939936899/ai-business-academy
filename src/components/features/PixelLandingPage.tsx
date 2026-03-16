'use client'

import { useState, useEffect } from 'react'

/* ── Pixel art letter patterns (7 rows × variable cols) ── */
const LETTERS: Record<string, number[][]> = {
  A: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  I: [
    [1,1,1],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [1,1,1],
  ],
  B: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  U: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  S: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
}

/* ── CI Color palette from SPU BUS logo ── */
const CI_BLUE    = '#2196F3'
const CI_LTBLUE  = '#4FC3F7'
const CI_MEDBLUE = '#42A5F5'
const CI_PINK    = '#E91E8C'

/* Lerp between two hex colors */
function lerpColor(a: string, b: string, t: number): string {
  const pa = [parseInt(a.slice(1,3),16), parseInt(a.slice(3,5),16), parseInt(a.slice(5,7),16)]
  const pb = [parseInt(b.slice(1,3),16), parseInt(b.slice(3,5),16), parseInt(b.slice(5,7),16)]
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t)
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t)
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bl.toString(16).padStart(2,'0')}`
}

/* Build all pixel positions for "AI BUS" — first pass to get geometry */
function buildPixels() {
  const word1 = ['A', 'I']        // "AI"
  const word2 = ['B', 'U', 'S']   // "BUS"
  const GAP_LETTER = 1
  const GAP_WORD = 3
  const raw: { x: number; y: number; idx: number }[] = []

  let cursorX = 0
  let idx = 0

  const addLetter = (letter: string) => {
    const grid = LETTERS[letter]
    if (!grid) return
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c]) {
          raw.push({ x: cursorX + c, y: r, idx: idx++ })
        }
      }
    }
    cursorX += grid[0].length + GAP_LETTER
  }

  word1.forEach((l) => addLetter(l))
  cursorX += GAP_WORD - GAP_LETTER
  word2.forEach((l) => addLetter(l))

  const totalCols = cursorX - GAP_LETTER

  // Apply gradient: blue → light blue → pink based on x position (left→right)
  const pixels = raw.map((p) => {
    const t = totalCols > 1 ? p.x / (totalCols - 1) : 0 // 0=left(blue), 1=right(pink)
    let color: string
    if (t <= 0.5) {
      color = lerpColor(CI_BLUE, CI_LTBLUE, t * 2)       // blue → light blue
    } else {
      color = lerpColor(CI_LTBLUE, CI_PINK, (t - 0.5) * 2) // light blue → pink
    }
    return { ...p, color }
  })

  return { pixels, totalCols, totalRows: 7 }
}

const { pixels, totalCols, totalRows } = buildPixels()

/* ── Floating particles (deterministic positions) ── */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 41.7 + 13.3) % 100,
  y: (i * 29.3 + 7.1) % 100,
  size: i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
  color: i % 3 === 0 ? CI_BLUE : i % 3 === 1 ? CI_LTBLUE : CI_PINK,
  delay: (i * 0.37) % 3,
  duration: 3 + (i % 3),
}))

export default function PixelLandingPage() {
  const [phase, setPhase] = useState<'splash' | 'fadeout' | 'done'>('splash')

  useEffect(() => {
    document.documentElement.setAttribute('data-splash', '0')
    const t1 = setTimeout(() => setPhase('fadeout'), 3500)
    const t2 = setTimeout(() => {
      setPhase('done')
      document.documentElement.removeAttribute('data-splash')
    }, 4200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #030712 0%, #0a1628 50%, #030712 100%)',
        opacity: phase === 'fadeout' ? 0 : 1,
        transition: 'opacity 0.7s ease-out',
        pointerEvents: phase === 'fadeout' ? 'none' : 'auto',
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(33,150,243,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(33,150,243,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: p.size > 3 ? 2 : '50%',
              background: p.color,
              opacity: 0,
              animation: `pxFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '20%', left: '15%', width: 'min(350px, 60vw)', height: 'min(350px, 60vw)', background: 'rgba(33,150,243,0.08)', filter: 'blur(120px)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 'min(280px, 45vw)', height: 'min(280px, 45vw)', background: 'rgba(233,30,140,0.06)', filter: 'blur(100px)', borderRadius: '50%' }} />

      {/* Center content — absolute center to avoid flex interference */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: 'min(600px, 92vw)', padding: '0 16px' }}>
        {/* ── Pixel Art "AI BUS" ── */}
        <div
          className="mx-auto mb-4 sm:mb-6"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${totalCols}, 1fr)`,
            gridTemplateRows: `repeat(${totalRows}, 1fr)`,
            gap: 'clamp(1px, 0.35vw, 3px)',
            width: 'clamp(180px, 48vw, 400px)',
            maxWidth: '85vw',
            aspectRatio: `${totalCols} / ${totalRows}`,
          }}
        >
          {/* Empty grid cells filled by positioned blocks */}
          {pixels.map((p, i) => (
            <div
              key={i}
              style={{
                gridColumn: p.x + 1,
                gridRow: p.y + 1,
                background: p.color,
                borderRadius: 'clamp(1px, 0.2vw, 2px)',
                opacity: 0,
                transform: 'scale(0) rotate(180deg)',
                animation: `pxBlockIn 0.35s cubic-bezier(0.34,1.56,0.64,1) ${0.3 + p.idx * 0.012}s forwards`,
                boxShadow: `0 0 clamp(2px, 0.5vw, 6px) ${p.color}40`,
              }}
            />
          ))}
        </div>

        {/* "ACADEMY" in pixel font */}
        <div
          style={{
            fontFamily: 'var(--font-pixel), "Press Start 2P", monospace',
            fontSize: 'clamp(0.55rem, 2vw, 1.1rem)',
            letterSpacing: '0.2em',
            color: '#fff',
            opacity: 0,
            transform: 'translateY(8px)',
            animation: 'pxTextIn 0.6s ease-out 1.8s forwards',
            textShadow: '0 0 20px rgba(33,150,243,0.25)',
          }}
        >
          ACADEMY
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(0.45rem, 1.1vw, 0.65rem)',
            letterSpacing: '0.25em',
            marginTop: 'clamp(8px, 1.5vw, 16px)',
            color: 'rgba(79,195,247,0.5)',
            textTransform: 'uppercase',
            opacity: 0,
            animation: 'pxFadeIn 0.5s ease-out 2.2s forwards',
          }}
        >
          School of Business Administration · SPU
        </p>

        {/* Loading bar */}
        <div
          style={{
            marginTop: 'clamp(14px, 2.5vw, 24px)',
            marginInline: 'auto',
            width: 'clamp(80px, 25vw, 160px)',
            height: 'clamp(2px, 0.4vw, 3px)',
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 4,
              background: `linear-gradient(90deg, ${CI_BLUE}, ${CI_LTBLUE}, ${CI_PINK}, ${CI_MEDBLUE})`,
              width: '0%',
              animation: 'pxLoaderFill 2.8s ease-in-out 0.5s forwards',
            }}
          />
        </div>

        {/* Bouncing dots */}
        <div className="flex justify-center gap-1.5" style={{ marginTop: 'clamp(10px, 1.5vw, 16px)' }}>
          {[CI_BLUE, CI_PINK, CI_LTBLUE].map((c, i) => (
            <div
              key={i}
              style={{
                width: 'clamp(3px, 0.8vw, 6px)',
                height: 'clamp(3px, 0.8vw, 6px)',
                borderRadius: 1,
                background: c,
                animation: `pxDot 0.7s ease-in-out ${i * 0.12}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes pxFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.1; }
          50% { transform: translateY(-18px) scale(1.4); opacity: 0.45; }
        }
        @keyframes pxBlockIn {
          0% { opacity: 0; transform: scale(0) rotate(180deg); }
          60% { opacity: 1; transform: scale(1.15) rotate(0deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes pxTextIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pxFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes pxLoaderFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes pxDot {
          0% { opacity: 0.25; transform: scale(0.6); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
