'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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
      if (ci < chars.length - 1) line.push(false)
    })
    rows.push(line)
  }
  return rows
}

const COLORS = {
  primary: '#5BB7D5',
  secondary: '#1A4B8C',
  accent: '#2E9ACC',
  glow: '#7DD3FC',
}

// Fixed pixel size in px — we scale the whole container to fit viewport
const PX = 10
const GAP = 2

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'splash' | 'fadeOut' | 'done'>('splash')
  const [revealProgress, setRevealProgress] = useState(0)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [glitchFrame, setGlitchFrame] = useState(0)
  const [scale, setScale] = useState(1)
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number; size: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const line1 = buildPixelGrid('AI BUSINESS')
  const line2 = buildPixelGrid('ACADEMY')
  const totalPixelsLine1 = line1[0]?.length || 0
  const totalPixelsLine2 = line2[0]?.length || 0
  const maxCols = Math.max(totalPixelsLine1, totalPixelsLine2)

  // Calculate natural width of the widest line (line1)
  const naturalWidth = totalPixelsLine1 * PX + (totalPixelsLine1 - 1) * GAP

  // Auto-scale to fit viewport
  useEffect(() => {
    function calcScale() {
      const vw = window.innerWidth
      const maxW = vw * 0.88 // 88% of viewport
      const s = Math.min(maxW / naturalWidth, 1.2) // cap at 1.2x
      setScale(s)
    }
    calcScale()
    window.addEventListener('resize', calcScale)
    return () => window.removeEventListener('resize', calcScale)
  }, [naturalWidth])

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
    const revealInterval = setInterval(() => {
      setRevealProgress(p => {
        if (p >= maxCols) {
          clearInterval(revealInterval)
          return maxCols
        }
        return p + 1
      })
    }, 25)

    const subtitleTimer = setTimeout(() => setShowSubtitle(true), maxCols * 25 + 400)
    const fadeTimer = setTimeout(() => setPhase('fadeOut'), maxCols * 25 + 1600)
    const doneTimer = setTimeout(() => setPhase('done'), maxCols * 25 + 2400)

    return () => {
      clearInterval(revealInterval)
      clearTimeout(subtitleTimer)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [maxCols])

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

        {/* ─── Scaled Pixel Text Container ─── */}
        <div
          ref={containerRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <PixelTextBlock
            grid={line1}
            revealProgress={revealProgress}
            glitchFrame={glitchFrame}
            maxCols={maxCols}
            totalCols={totalPixelsLine1}
          />
          <div style={{ marginTop: '12px' }}>
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
            marginTop: '20px',
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
            marginTop: '24px',
            color: COLORS.glow,
            fontSize: 'clamp(9px, 1.4vw, 16px)',
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            opacity: showSubtitle ? 0.7 : 0,
            transform: showSubtitle ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            textAlign: 'center',
            padding: '0 16px',
          }}
        >
          School of Business Administration &bull; Sripatum University
        </p>

        {/* Loading dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
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
        `}</style>
      </div>

      {/* Pre-render children behind splash */}
      <div style={{ opacity: phase === 'fadeOut' ? 1 : 0, transition: 'opacity 0.8s ease-in' }}>
        {children}
      </div>
    </>
  )
}

// ─── Pixel Text Block (fixed px size, parent scales) ──────────────────────

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
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(7, ${PX}px)`,
        gridTemplateColumns: `repeat(${totalCols}, ${PX}px)`,
        gap: `${GAP}px`,
      }}
    >
      {grid.flatMap((row, ri) =>
        row.map((on, ci) => {
          const revealed = ci <= revealProgress
          const isFullyRevealed = revealProgress >= maxCols
          const glitchOff = isFullyRevealed && on && Math.sin(glitchFrame * 7.3 + ri * 13 + ci * 37) > 0.92
          const glitchOn = isFullyRevealed && !on && Math.sin(glitchFrame * 5.1 + ri * 17 + ci * 43) > 0.97

          const active = revealed && ((on && !glitchOff) || glitchOn)
          const hue = 195 + (ci / totalCols) * 25

          return (
            <div
              key={`${ri}-${ci}`}
              style={{
                width: `${PX}px`,
                height: `${PX}px`,
                borderRadius: '1.5px',
                background: active
                  ? `hsl(${hue}, 80%, 65%)`
                  : 'rgba(255,255,255,0.02)',
                opacity: active ? 1 : 0,
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
