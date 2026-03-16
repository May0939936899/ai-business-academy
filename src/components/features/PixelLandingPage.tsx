'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'

// ═══════════════════════════════════════════════════════════════════════════
// ROBOT SPRITE (12×16 pixel art, 2 frames)
// ═══════════════════════════════════════════════════════════════════════════
const _ = 'transparent'
const b1 = '#5BB7D5', b2 = '#1A4B8C', b3 = '#2E9ACC', w = '#fff', gl = '#7DD3FC', y = '#FBBF24'

const ROBOT_A: string[][] = [
  [_, _, _, b2, b2, b2, b2, b2, _, _, _, _],
  [_, _, b2, b3, b3, b3, b3, b3, b2, _, _, _],
  [_, _, b2, w, w, b3, w, w, b2, _, _, _],
  [_, _, b2, gl, w, b3, gl, w, b2, _, _, _],
  [_, _, _, b2, b3, b3, b3, b2, _, _, _, _],
  [_, _, _, _, b2, y, b2, _, _, _, _, _],
  [_, _, b1, b1, b1, b1, b1, b1, b1, _, _, _],
  [_, b1, b1, b2, b2, b2, b2, b2, b1, b1, _, _],
  [_, b1, b1, b2, gl, gl, gl, b2, b1, b1, _, _],
  [_, b1, b1, b2, b2, b2, b2, b2, b1, b1, _, _],
  [_, _, b1, b1, b1, b1, b1, b1, b1, _, _, _],
  [_, _, _, b2, b2, _, b2, b2, _, _, _, _],
  [_, _, _, b2, b2, _, _, b2, b2, _, _, _],
  [_, _, b2, b2, _, _, _, _, b2, b2, _, _],
  [_, _, b3, b3, _, _, _, _, b3, b3, _, _],
  [_, _, b1, b1, _, _, _, _, b1, b1, _, _],
]
const ROBOT_B: string[][] = [
  [_, _, _, b2, b2, b2, b2, b2, _, _, _, _],
  [_, _, b2, b3, b3, b3, b3, b3, b2, _, _, _],
  [_, _, b2, w, w, b3, w, w, b2, _, _, _],
  [_, _, b2, w, gl, b3, w, gl, b2, _, _, _],
  [_, _, _, b2, b3, b3, b3, b2, _, _, _, _],
  [_, _, _, _, b2, y, b2, _, _, _, _, _],
  [_, _, b1, b1, b1, b1, b1, b1, b1, _, _, _],
  [_, b1, b1, b2, b2, b2, b2, b2, b1, b1, _, _],
  [_, b1, b1, b2, gl, gl, gl, b2, b1, b1, _, _],
  [_, b1, b1, b2, b2, b2, b2, b2, b1, b1, _, _],
  [_, _, b1, b1, b1, b1, b1, b1, b1, _, _, _],
  [_, _, _, b2, b2, _, b2, b2, _, _, _, _],
  [_, _, b2, b2, _, _, b2, b2, _, _, _, _],
  [_, b2, b2, _, _, _, _, b2, b2, _, _, _],
  [_, b3, b3, _, _, _, _, b3, b3, _, _, _],
  [_, b1, b1, _, _, _, _, b1, b1, _, _, _],
]

// ═══════════════════════════════════════════════════════════════════════════
// BUILDINGS
// ═══════════════════════════════════════════════════════════════════════════
const BLDS = [
  { x: 0, w: 60, h: 180, c: '#0F2847' },
  { x: 7, w: 45, h: 240, c: '#122D52', ant: true },
  { x: 13, w: 55, h: 160, c: '#0D2240' },
  { x: 20, w: 40, h: 200, c: '#15325A' },
  { x: 26, w: 70, h: 280, c: '#0A1E3D', ant: true },
  { x: 34, w: 50, h: 150, c: '#132B4F' },
  { x: 40, w: 60, h: 220, c: '#0E2444' },
  { x: 48, w: 45, h: 190, c: '#162F55' },
  { x: 54, w: 65, h: 260, c: '#0B2040', ant: true },
  { x: 62, w: 50, h: 170, c: '#122A4D' },
  { x: 68, w: 55, h: 230, c: '#0D2342' },
  { x: 75, w: 40, h: 150, c: '#153058' },
  { x: 80, w: 60, h: 200, c: '#0A1D3B' },
  { x: 87, w: 50, h: 270, c: '#112848', ant: true },
  { x: 93, w: 55, h: 180, c: '#0E2545' },
]

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function PixelLandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const [frame, setFrame] = useState(0)
  const [robotX, setRobotX] = useState(-12)
  const [showTitle, setShowTitle] = useState(false)
  const [showLine2, setShowLine2] = useState(false)
  const [showUI, setShowUI] = useState(false)
  const [entered, setEntered] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const windowsRef = useRef<boolean[]>([])

  const [stars] = useState(() =>
    Array.from({ length: 50 }, () => ({
      x: Math.random() * 100, y: Math.random() * 55,
      s: Math.random() * 2.5 + 1, d: Math.random() * 4,
      c: ['#5BB7D5', '#7DD3FC', '#fff', '#FBBF24', '#A78BFA'][Math.floor(Math.random() * 5)],
    }))
  )
  const [icons] = useState(() => [
    { x: 6, y: 10, i: '🤖', d: 0, sp: 3.5 },
    { x: 88, y: 16, i: '📊', d: 1, sp: 4 },
    { x: 12, y: 40, i: '💡', d: 0.5, sp: 3 },
    { x: 80, y: 6, i: '⚡', d: 1.5, sp: 3.8 },
    { x: 93, y: 38, i: '🎯', d: 2, sp: 4.2 },
    { x: 4, y: 55, i: '📈', d: 0.8, sp: 3.2 },
    { x: 50, y: 5, i: '🧠', d: 1.2, sp: 3.6 },
    { x: 74, y: 50, i: '💼', d: 2.5, sp: 4.5 },
  ])

  const locale = pathname.split('/').filter(Boolean)[0] || 'th'

  // Init windows
  useEffect(() => {
    if (windowsRef.current.length === 0) {
      windowsRef.current = Array.from({ length: 300 }, () => Math.random() > 0.35)
    }
  }, [])

  // Robot walk
  useEffect(() => {
    const t = setInterval(() => {
      setFrame(f => 1 - f)
      setRobotX(x => (x > 108 ? -12 : x + 0.5))
    }, 200)
    return () => clearInterval(t)
  }, [])

  // Staggered reveal: title → line2 → UI
  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 300)
    const t2 = setTimeout(() => setShowLine2(true), 900)
    const t3 = setTimeout(() => setShowUI(true), 1500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Glitch effect
  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 80)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(t)
  }, [])

  // Navigation
  const handleEnter = () => {
    setEntered(true)
    setTimeout(() => {
      if (status === 'authenticated' && (session?.user as any)?.role === 'admin') {
        router.push(`/${locale}/admin`)
      } else {
        router.push(`/${locale}/courses`)
      }
    }, 500)
  }
  const handleLogin = () => {
    setEntered(true)
    setTimeout(() => router.push(`/${locale}/login`), 500)
  }

  const sprite = frame === 0 ? ROBOT_A : ROBOT_B
  const charPx = typeof window !== 'undefined' ? (window.innerWidth < 500 ? 3 : window.innerWidth < 800 ? 4 : 5) : 4

  return (
    <div
      className="px-landing"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999, overflow: 'hidden',
        background: 'linear-gradient(180deg, #020818 0%, #0a1628 30%, #0d1f3c 60%, #112a4a 100%)',
        display: 'flex', flexDirection: 'column',
        opacity: entered ? 0 : 1, transition: 'opacity 0.5s ease-out',
      }}
    >
      {/* Stars */}
      {stars.map((s, i) => (
        <div key={i} className="px-star" style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: `${s.s}px`, height: `${s.s}px`, borderRadius: '50%',
          background: s.c, animationDuration: `${2 + s.d}s`,
          animationDelay: `${s.d}s`,
        }} />
      ))}

      {/* Floating icons */}
      {icons.map((ic, i) => (
        <div key={`ic${i}`} className="px-icon" style={{
          position: 'absolute', left: `${ic.x}%`, top: `${ic.y}%`,
          fontSize: 'clamp(14px, 2.5vw, 26px)', opacity: 0.35,
          animationDuration: `${ic.sp}s`, animationDelay: `${ic.d}s`,
          pointerEvents: 'none', zIndex: 1,
        }}>{ic.i}</div>
      ))}

      {/* Scan lines + grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: `
          repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 6px),
          linear-gradient(rgba(91,183,213,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(91,183,213,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
      }} />

      {/* ═══ CONTENT ═══ */}
      <div style={{
        position: 'relative', zIndex: 10, flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px 0', textAlign: 'center',
      }}>
        {/* ── PIXEL TITLE: AI BUSINESS ── */}
        <h1
          className={`px-title-line ${showTitle ? 'px-revealed' : ''} ${glitch ? 'px-glitch' : ''}`}
          style={{
            fontFamily: 'var(--font-pixel), "Press Start 2P", monospace',
            fontSize: 'clamp(24px, 5vw, 56px)',
            color: '#5BB7D5',
            letterSpacing: '0.12em',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          AI BUSINESS
        </h1>

        {/* ── PIXEL TITLE: ACADEMY ── */}
        <h1
          className={`px-title-line ${showLine2 ? 'px-revealed' : ''} ${glitch ? 'px-glitch' : ''}`}
          style={{
            fontFamily: 'var(--font-pixel), "Press Start 2P", monospace',
            fontSize: 'clamp(22px, 4.5vw, 50px)',
            color: '#2E9ACC',
            letterSpacing: '0.15em',
            margin: '8px 0 0',
            lineHeight: 1.2,
          }}
        >
          ACADEMY
        </h1>

        {/* ── Glow divider ── */}
        <div className={`px-divider ${showLine2 ? 'px-revealed' : ''}`} />

        {/* ── Subtitle + Buttons ── */}
        <div className={`px-ui ${showUI ? 'px-revealed' : ''}`}>
          <p style={{
            color: '#7DD3FC', fontSize: 'clamp(9px, 1.2vw, 14px)',
            letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.8,
            fontFamily: '"Inter", sans-serif',
          }}>School of Business Administration</p>
          <p style={{
            color: '#94A3B8', fontSize: 'clamp(14px, 2vw, 22px)',
            margin: '8px 0 4px', lineHeight: 1.5, opacity: 0.7,
          }}>แพลตฟอร์มเรียนรู้ AI สำหรับธุรกิจยุคใหม่</p>
          <p style={{
            color: '#64748B', fontSize: 'clamp(10px, 1.2vw, 14px)',
            opacity: 0.5, marginBottom: '28px',
          }}>มหาวิทยาลัยศรีปทุม</p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={handleEnter} className="px-btn-primary">
              🚀 เริ่มต้นเรียนรู้
            </button>
            <button onClick={handleLogin} className="px-btn-ghost">
              {status === 'authenticated' ? '📚 เข้าสู่ห้องเรียน' : '🔑 เข้าสู่ระบบ'}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ CITYSCAPE ═══ */}
      <div style={{
        position: 'relative', width: '100%',
        height: 'clamp(100px, 22vh, 220px)', flexShrink: 0,
      }}>
        {BLDS.map((bd, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${bd.x}%`, bottom: 0,
            width: `${bd.w}px`, height: `${bd.h}px`,
            background: bd.c, borderRadius: '2px 2px 0 0',
          }}>
            {bd.ant && <>
              <div style={{
                position: 'absolute', top: '-18px', left: '50%',
                transform: 'translateX(-50%)', width: '2px', height: '18px',
                background: '#1A4B8C',
              }} />
              <div className="px-blink" style={{
                position: 'absolute', top: '-22px', left: '50%',
                transform: 'translateX(-50%)', width: '5px', height: '5px',
                borderRadius: '50%', background: '#EF4444',
                animationDelay: `${i * 0.4}s`,
              }} />
            </>}
            {/* Windows */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.floor(bd.w / 15)}, 6px)`,
              gap: '5px', padding: '10px 6px', justifyContent: 'center',
            }}>
              {Array.from({ length: Math.min(Math.floor(bd.w / 15) * Math.floor(bd.h / 22), 25) }).map((_, wi) => {
                const isOn = windowsRef.current[i * 15 + wi] ?? true
                return (
                  <div key={wi} className="px-window" style={{
                    width: '6px', height: '6px', borderRadius: '1px',
                    background: isOn ? '#FBBF2440' : '#5BB7D518',
                    animationDelay: `${(wi * 0.37) % 5}s`,
                  }} />
                )
              })}
            </div>
          </div>
        ))}

        {/* Ground glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(to right, transparent, #5BB7D530, #2E9ACC40, #5BB7D530, transparent)',
        }} />

        {/* Robot 1 */}
        <div style={{
          position: 'absolute', bottom: '5px', left: `${robotX}%`,
          transition: 'left 0.2s linear', zIndex: 20,
          filter: 'drop-shadow(0 0 8px #5BB7D560)',
        }}>
          <Sprite data={sprite} px={charPx} />
        </div>

        {/* Robot 2 (background) */}
        <div style={{
          position: 'absolute', bottom: '3px',
          left: `${((robotX * 0.55 + 55) % 125) - 12}%`,
          transition: 'left 0.2s linear', zIndex: 15, opacity: 0.4,
        }}>
          <Sprite data={sprite} px={Math.max(2, charPx - 1)} />
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px',
        background: 'linear-gradient(to top, #0d1f3c, transparent)',
        zIndex: 5, pointerEvents: 'none',
      }} />

      {/* ═══ CSS ═══ */}
      <style>{`
        .px-star {
          animation: pxTwinkle ease-in-out infinite;
        }
        .px-icon {
          animation: pxFloat ease-in-out infinite;
        }
        .px-blink {
          animation: pxBlink 2s ease-in-out infinite;
        }
        .px-window {
          animation: pxWin 4s ease-in-out infinite;
        }

        /* Title reveal */
        .px-title-line {
          opacity: 0;
          transform: translateY(15px) scale(0.95);
          filter: blur(8px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          text-shadow: none;
        }
        .px-title-line.px-revealed {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
          text-shadow:
            0 0 10px #5BB7D580,
            0 0 30px #2E9ACC40,
            0 0 60px #1A4B8C30,
            2px 2px 0 #0a1628;
        }

        /* Glitch effect */
        .px-title-line.px-glitch {
          animation: pxGlitch 0.08s steps(2) 1;
        }

        /* Divider */
        .px-divider {
          margin-top: 16px;
          width: 0;
          height: 2px;
          border-radius: 1px;
          background: linear-gradient(to right, transparent, #5BB7D5, #2E9ACC, #5BB7D5, transparent);
          box-shadow: 0 0 15px #5BB7D580, 0 0 30px #2E9ACC40;
          transition: width 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
        }
        .px-divider.px-revealed {
          width: min(50%, 350px);
        }

        /* UI */
        .px-ui {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .px-ui.px-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Buttons */
        .px-btn-primary {
          padding: 13px 32px;
          font-size: clamp(14px, 1.6vw, 18px);
          font-weight: 600;
          color: #0a1628;
          background: linear-gradient(135deg, #5BB7D5, #2E9ACC);
          border: 2px solid #7DD3FC;
          border-radius: 8px;
          cursor: pointer;
          letter-spacing: 0.04em;
          box-shadow: 0 0 20px #5BB7D540, 0 4px 15px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }
        .px-btn-primary:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 0 35px #5BB7D570, 0 6px 20px rgba(0,0,0,0.4);
        }
        .px-btn-ghost {
          padding: 13px 32px;
          font-size: clamp(14px, 1.6vw, 18px);
          font-weight: 500;
          color: #7DD3FC;
          background: rgba(91,183,213,0.08);
          border: 1.5px solid rgba(91,183,213,0.3);
          border-radius: 8px;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.3s ease;
        }
        .px-btn-ghost:hover {
          background: rgba(91,183,213,0.15);
          border-color: rgba(91,183,213,0.5);
          transform: translateY(-2px);
        }

        @keyframes pxTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes pxFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-14px) rotate(5deg); }
          75% { transform: translateY(10px) rotate(-3deg); }
        }
        @keyframes pxBlink {
          0%, 70%, 100% { opacity: 0.3; }
          75%, 95% { opacity: 1; }
        }
        @keyframes pxWin {
          0%, 100% { opacity: 0.3; }
          30% { opacity: 0.8; }
          50% { opacity: 0.15; }
          80% { opacity: 0.6; }
        }
        @keyframes pxGlitch {
          0% { transform: translate(-2px, 1px) skewX(-2deg); filter: hue-rotate(30deg); }
          50% { transform: translate(2px, -1px) skewX(2deg); filter: hue-rotate(-30deg); }
          100% { transform: translate(0, 0) skewX(0deg); filter: hue-rotate(0deg); }
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SPRITE RENDERER
// ═══════════════════════════════════════════════════════════════════════════
function Sprite({ data, px }: { data: string[][]; px: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: `repeat(${data.length}, ${px}px)`,
      gridTemplateColumns: `repeat(${data[0]?.length || 0}, ${px}px)`,
    }}>
      {data.flatMap((row, ri) =>
        row.map((c, ci) => (
          <div key={`${ri}-${ci}`} style={{ width: px, height: px, background: c }} />
        ))
      )}
    </div>
  )
}
