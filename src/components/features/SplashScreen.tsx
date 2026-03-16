'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Pixel font data for each character (5x7 grid) ────────────────────────
const PIXEL_FONT: Record<string, number[]> = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11100, 0b10010, 0b10001, 0b10001, 0b10001, 0b10010, 0b11100],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01110],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  J: [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01110, 0b10001, 0b10000, 0b01110, 0b00001, 0b10001, 0b01110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  ' ': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
}

// ─── Build pixel grid for a word ───────────────────────────────────────────
function buildPixelGrid(text: string): boolean[][] {
  const chars = text.toUpperCase().split('')
  const rows: boolean[][] = []
  for (let row = 0; row < 7; row++) {
    const line: boolean[] = []
    chars.forEach((ch, ci) => {
      const glyph = PIXEL_FONT[ch] || PIXEL_FONT[' ']
      for (let col = 4; col >= 0; col--) {
        line.push((glyph[row] & (1 << col)) !== 0)
      }
      // 1px gap between chars (except last)
      if (ci < chars.length - 1) line.push(false)
    })
    rows.push(line)
  }
  return rows
}

// ─── Colors ────────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#5BB7D5',    // SBS light blue
  secondary: '#1A4B8C',  // SBS dark blue
  accent: '#2E9ACC',     // SBS vivid blue
  glow: '#7DD3FC',       // glow highlight
}

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'splash' | 'fadeOut' | 'done'>('splash')
  const [revealProgress, setRevealProgress] = useState(0)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [glitchFrame, setGlitchFrame] = useState(0)
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number; size: number }>>([])

  // Build grids for two lines
  const line1 = buildPixelGrid('AI BUSINESS')
  const line2 = buildPixelGrid('ACADEMY')

  const totalPixelsLine1 = line1[0]?.length || 0
  const totalPixelsLine2 = line2[0]?.length || 0
  const maxCols = Math.max(totalPixelsLine1, totalPixelsLine2)

  // Generate particles once
  useEffect(() => {
    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 3 + 1,
    }))
    setParticles(pts)
  }, [])

  // Animation sequence
  useEffect(() => {
    // Pixel reveal: each column lights up progressively
    const revealInterval = setInterval(() => {
      setRevealProgress(p => {
        if (p >= maxCols) {
          clearInterval(revealInterval)
          return maxCols
        }
        return p + 1
      })
    }, 35)

    // Subtitle appears after pixels
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), maxCols * 35 + 400)

    // Start fade out
    const fadeTimer = setTimeout(() => setPhase('fadeOut'), maxCols * 35 + 1800)

    // Done
    const doneTimer = setTimeout(() => setPhase('done'), maxCols * 35 + 2600)

    return () => {
      clearInterval(revealInterval)
      clearTimeout(subtitleTimer)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [maxCols])

  // Glitch effect on completed text
  const doGlitch = useCallback(() => {
    setGlitchFrame(f => f + 1)
  }, [])

  useEffect(() => {
    if (revealProgress < maxCols) return
    const glitchInterval = setInterval(doGlitch, 120)
    return () => clearInterval(glitchInterval)
  }, [revealProgress, maxCols, doGlitch])

  if (phase === 'done') return <>{children}</>

  return (
    <>
      {/* Splash overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'radial-gradient(ellipse at center, #0a1628 0%, #050d1a 70%, #020509 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.8s ease-out',
          opacity: phase === 'fadeOut' ? 0 : 1,
          pointerEvents: phase === 'fadeOut' ? 'none' : 'auto',
          overflow: 'hidden',
        }}
      >
        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              background: i % 3 === 0 ? COLORS.primary : i % 3 === 1 ? COLORS.accent : COLORS.glow,
              opacity: 0.15 + Math.sin((glitchFrame + i) * 0.1) * 0.15,
              animation: `splash-float ${3 + p.delay}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Scan line overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
            pointerEvents: 'none',
          }}
        />

        {/* Horizontal scan beam */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(to right, transparent, ${COLORS.glow}40, transparent)`,
            animation: 'splash-scanbeam 2.5s linear infinite',
            pointerEvents: 'none',
          }}
        />

        {/* ─── Pixel Text: Line 1 — "AI BUSINESS" ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
          <PixelTextBlock
            grid={line1}
            revealProgress={revealProgress}
            glitchFrame={glitchFrame}
            maxCols={maxCols}
            totalCols={totalPixelsLine1}
          />

          {/* ─── Pixel Text: Line 2 — "ACADEMY" ─── */}
          <div style={{ marginTop: 'clamp(6px, 1.5vw, 14px)' }}>
            <PixelTextBlock
              grid={line2}
              revealProgress={Math.max(0, revealProgress - 4)}
              glitchFrame={glitchFrame}
              maxCols={maxCols}
              totalCols={totalPixelsLine2}
            />
          </div>
        </div>

        {/* Glow bar under text */}
        <div
          style={{
            marginTop: 'clamp(12px, 2vw, 24px)',
            width: `${Math.min(revealProgress / maxCols, 1) * 60}%`,
            maxWidth: '400px',
            height: '2px',
            background: `linear-gradient(to right, transparent, ${COLORS.primary}, ${COLORS.accent}, ${COLORS.primary}, transparent)`,
            boxShadow: `0 0 20px ${COLORS.primary}80, 0 0 40px ${COLORS.accent}40`,
            transition: 'width 0.1s linear',
            borderRadius: '1px',
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            marginTop: 'clamp(14px, 2.5vw, 28px)',
            color: COLORS.glow,
            fontSize: 'clamp(10px, 1.4vw, 16px)',
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            opacity: showSubtitle ? 0.7 : 0,
            transform: showSubtitle ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          School of Business Administration &bull; Sripatum University
        </p>

        {/* Loading dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(24px, 4vw, 48px)',
            display: 'flex',
            gap: '8px',
            opacity: phase === 'fadeOut' ? 0 : 0.6,
            transition: 'opacity 0.3s',
          }}
        >
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: COLORS.accent,
                animation: 'splash-dot 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* CSS animations */}
        <style>{`
          @keyframes splash-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.2); }
          }
          @keyframes splash-scanbeam {
            0% { top: -2px; }
            100% { top: 100%; }
          }
          @keyframes splash-dot {
            0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1.3); }
          }
          @keyframes splash-pixel-glow {
            0%, 100% { filter: brightness(1) drop-shadow(0 0 2px currentColor); }
            50% { filter: brightness(1.4) drop-shadow(0 0 6px currentColor); }
          }
        `}</style>
      </div>

      {/* Pre-render children behind splash so app is ready */}
      <div style={{ opacity: phase === 'fadeOut' ? 1 : 0, transition: 'opacity 0.8s ease-in' }}>
        {children}
      </div>
    </>
  )
}

// ─── Pixel Text Block ─────────────────────────────────────────────────────

function PixelTextBlock({
  grid,
  revealProgress,
  glitchFrame,
  maxCols,
  totalCols,
}: {
  grid: boolean[][]
  revealProgress: number
  glitchFrame: number
  maxCols: number
  totalCols: number
}) {
  const pixelSize = 'clamp(3px, 0.55vw, 6px)'
  const gap = 'clamp(1px, 0.15vw, 2px)'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(7, ${pixelSize})`,
        gridTemplateColumns: `repeat(${totalCols}, ${pixelSize})`,
        gap,
      }}
    >
      {grid.flatMap((row, ri) =>
        row.map((on, ci) => {
          const revealed = ci <= revealProgress
          const isFullyRevealed = revealProgress >= maxCols
          // Glitch: randomly flicker some pixels
          const glitchOff = isFullyRevealed && on && Math.sin(glitchFrame * 7.3 + ri * 13 + ci * 37) > 0.92
          const glitchOn = isFullyRevealed && !on && Math.sin(glitchFrame * 5.1 + ri * 17 + ci * 43) > 0.97

          const active = revealed && ((on && !glitchOff) || glitchOn)
          const brightness = active ? 1 : 0

          // Color varies by position for gradient effect
          const hue = 195 + (ci / totalCols) * 25 // blue range
          const sat = on ? '80%' : '60%'
          const lit = active ? '65%' : '8%'

          return (
            <div
              key={`${ri}-${ci}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                borderRadius: '1px',
                background: active
                  ? `hsl(${hue}, ${sat}, ${lit})`
                  : 'rgba(255,255,255,0.02)',
                opacity: brightness,
                boxShadow: active
                  ? `0 0 ${glitchOn ? '8px' : '4px'} hsl(${hue}, 90%, 70%)`
                  : 'none',
                transition: revealed
                  ? 'background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease'
                  : 'none',
              }}
            />
          )
        })
      )}
    </div>
  )
}
