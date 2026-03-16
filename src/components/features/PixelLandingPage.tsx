'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ImageIcon, Palette, Sparkles, ChevronRight } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// ROBOT SPRITE (12x16 pixel art, 2 frames)
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
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/').filter(Boolean)[0] || 'th'

  // Phase: 'intro' → 'transition' → 'home'
  const [phase, setPhase] = useState<'intro' | 'transition' | 'home'>('intro')

  // Intro animations
  const [frame, setFrame] = useState(0)
  const [robotX, setRobotX] = useState(-12)
  const [showTitle, setShowTitle] = useState(false)
  const [showLine2, setShowLine2] = useState(false)
  const [showUI, setShowUI] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const windowsRef = useRef<boolean[]>([])

  // Home animations
  const [homeReady, setHomeReady] = useState(false)

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

  // Staggered reveal
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

  // Transition to home
  const goToHome = useCallback(() => {
    setPhase('transition')
    setTimeout(() => {
      setPhase('home')
      setTimeout(() => setHomeReady(true), 100)
    }, 600)
  }, [])

  const navigateTo = (path: string) => {
    router.push(`/${locale}${path}`)
  }

  const sprite = frame === 0 ? ROBOT_A : ROBOT_B
  const charPx = typeof window !== 'undefined' ? (window.innerWidth < 500 ? 3 : window.innerWidth < 800 ? 4 : 5) : 4

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, overflow: 'hidden' }}>
      {/* ═══════════ PHASE: INTRO ═══════════ */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #020818 0%, #0a1628 30%, #0d1f3c 60%, #112a4a 100%)',
          display: 'flex', flexDirection: 'column',
          opacity: phase === 'intro' ? 1 : 0,
          transition: 'opacity 0.6s ease-out',
          pointerEvents: phase === 'intro' ? 'auto' : 'none',
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

        {/* ── CONTENT ── */}
        <div style={{
          position: 'relative', zIndex: 10, flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '20px 16px 0', textAlign: 'center',
        }}>
          <h1
            className={`px-title-line ${showTitle ? 'px-revealed' : ''} ${glitch ? 'px-glitch' : ''}`}
            style={{
              fontFamily: 'var(--font-pixel), "Press Start 2P", monospace',
              fontSize: 'clamp(24px, 5vw, 56px)',
              color: '#5BB7D5', letterSpacing: '0.12em',
              margin: 0, lineHeight: 1.2,
            }}
          >
            AI BUSINESS
          </h1>

          <h1
            className={`px-title-line ${showLine2 ? 'px-revealed' : ''} ${glitch ? 'px-glitch' : ''}`}
            style={{
              fontFamily: 'var(--font-pixel), "Press Start 2P", monospace',
              fontSize: 'clamp(22px, 4.5vw, 50px)',
              color: '#2E9ACC', letterSpacing: '0.15em',
              margin: '8px 0 0', lineHeight: 1.2,
            }}
          >
            ACADEMY
          </h1>

          <div className={`px-divider ${showLine2 ? 'px-revealed' : ''}`} />

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

            <button onClick={goToHome} className="px-btn-primary">
              <Sparkles size={18} style={{ marginRight: 8, display: 'inline' }} />
              เข้าสู่แพลตฟอร์ม
            </button>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={goToHome}
          className={`px-skip ${showUI ? 'px-revealed' : ''}`}
          style={{
            position: 'absolute', top: '20px', right: '20px', zIndex: 100,
            color: '#64748B', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
            padding: '6px 14px', fontSize: '13px', cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          ข้าม →
        </button>

        {/* ── CITYSCAPE ── */}
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

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(to right, transparent, #5BB7D530, #2E9ACC40, #5BB7D530, transparent)',
          }} />

          <div style={{
            position: 'absolute', bottom: '5px', left: `${robotX}%`,
            transition: 'left 0.2s linear', zIndex: 20,
            filter: 'drop-shadow(0 0 8px #5BB7D560)',
          }}>
            <Sprite data={sprite} px={charPx} />
          </div>

          <div style={{
            position: 'absolute', bottom: '3px',
            left: `${((robotX * 0.55 + 55) % 125) - 12}%`,
            transition: 'left 0.2s linear', zIndex: 15, opacity: 0.4,
          }}>
            <Sprite data={sprite} px={Math.max(2, charPx - 1)} />
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px',
          background: 'linear-gradient(to top, #0d1f3c, transparent)',
          zIndex: 5, pointerEvents: 'none',
        }} />
      </div>

      {/* ═══════════ PHASE: HOME ═══════════ */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #020818 0%, #0a1628 35%, #0d1f3c 70%, #0f2847 100%)',
          opacity: phase === 'home' ? 1 : 0,
          transition: 'opacity 0.6s ease-in',
          pointerEvents: phase === 'home' ? 'auto' : 'none',
          overflowY: 'auto',
        }}
      >
        {/* Subtle stars in background */}
        {stars.slice(0, 25).map((s, i) => (
          <div key={`hs${i}`} className="px-star" style={{
            position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.s * 0.6}px`, height: `${s.s * 0.6}px`, borderRadius: '50%',
            background: s.c, opacity: 0.3,
            animationDuration: `${3 + s.d}s`, animationDelay: `${s.d}s`,
          }} />
        ))}

        {/* Grid overlay (subtle) */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: `
            linear-gradient(rgba(91,183,213,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,183,213,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* HOME CONTENT */}
        <div style={{
          position: 'relative', zIndex: 10,
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px 20px',
        }}>
          {/* Brand Header */}
          <div className={`px-home-header ${homeReady ? 'px-revealed' : ''}`} style={{
            textAlign: 'center', marginBottom: '12px',
          }}>
            <h1 style={{
              fontFamily: 'var(--font-pixel), "Press Start 2P", monospace',
              fontSize: 'clamp(16px, 3vw, 32px)',
              color: '#5BB7D5', letterSpacing: '0.1em',
              margin: 0, lineHeight: 1.3,
              textShadow: '0 0 20px #5BB7D540, 0 0 40px #2E9ACC20',
            }}>
              AI BUSINESS ACADEMY
            </h1>
          </div>

          <p className={`px-home-sub ${homeReady ? 'px-revealed' : ''}`} style={{
            color: '#94A3B8', fontSize: 'clamp(14px, 1.8vw, 20px)',
            textAlign: 'center', marginBottom: '8px', opacity: 0.8,
            maxWidth: '600px', lineHeight: 1.6,
          }}>
            แพลตฟอร์มเรียนรู้ AI สำหรับธุรกิจยุคใหม่
          </p>
          <p className={`px-home-sub ${homeReady ? 'px-revealed' : ''}`} style={{
            color: '#64748B', fontSize: 'clamp(11px, 1.2vw, 14px)',
            textAlign: 'center', marginBottom: '48px', opacity: 0.6,
          }}>
            เลือกเครื่องมือที่ต้องการใช้งาน
          </p>

          {/* ── TOOL CARDS ── */}
          <div className="px-cards-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '24px',
            width: '100%',
            maxWidth: '780px',
          }}>
            {/* Card 1: Image to Content */}
            <div
              className={`px-tool-card ${homeReady ? 'px-revealed' : ''}`}
              onClick={() => navigateTo('/image-to-content')}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="px-card-icon-wrap" style={{ background: 'linear-gradient(135deg, #5BB7D520, #2E9ACC15)' }}>
                <ImageIcon size={32} color="#5BB7D5" />
              </div>
              <h2 className="px-card-title">ทำคอนเทนต์จากภาพ</h2>
              <p className="px-card-desc">
                อัปโหลดภาพเพื่อช่วยสร้างข้อความ คำอธิบาย หรือคอนเทนต์สำหรับงานธุรกิจ การตลาด และโซเชียลมีเดีย
              </p>
              <button className="px-card-btn">
                เริ่มใช้งาน <ChevronRight size={16} />
              </button>
            </div>

            {/* Card 2: Poster Generator */}
            <div
              className={`px-tool-card ${homeReady ? 'px-revealed' : ''}`}
              onClick={() => navigateTo('/poster-generator')}
              style={{ animationDelay: '0.25s' }}
            >
              <div className="px-card-icon-wrap" style={{ background: 'linear-gradient(135deg, #A78BFA20, #8B5CF615)' }}>
                <Palette size={32} color="#A78BFA" />
              </div>
              <h2 className="px-card-title">สร้างภาพ / โปสเตอร์</h2>
              <p className="px-card-desc">
                สร้างภาพและโปสเตอร์สำหรับงานนำเสนอ การตลาด หรือคอนเทนต์ออนไลน์ให้ดูมืออาชีพมากขึ้น
              </p>
              <button className="px-card-btn px-card-btn-purple">
                เริ่มสร้าง <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Bottom links */}
          <div className={`px-home-footer ${homeReady ? 'px-revealed' : ''}`} style={{
            marginTop: '48px', display: 'flex', gap: '24px', flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <button onClick={() => navigateTo('/courses')} className="px-link-btn">
              📚 คอร์สเรียน AI
            </button>
            <button onClick={() => navigateTo('/login')} className="px-link-btn">
              🔑 เข้าสู่ระบบ
            </button>
          </div>

          {/* Footer text */}
          <p className={`px-home-footer ${homeReady ? 'px-revealed' : ''}`} style={{
            color: '#475569', fontSize: '12px', marginTop: '32px',
            textAlign: 'center', opacity: 0.5,
          }}>
            คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
          </p>
        </div>
      </div>

      {/* ═══════════ ALL CSS ═══════════ */}
      <style>{`
        /* ── Stars & Icons ── */
        .px-star { animation: pxTwinkle ease-in-out infinite; }
        .px-icon { animation: pxFloat ease-in-out infinite; }
        .px-blink { animation: pxBlink 2s ease-in-out infinite; }
        .px-window { animation: pxWin 4s ease-in-out infinite; }

        /* ── Intro Title Reveal ── */
        .px-title-line {
          opacity: 0; transform: translateY(15px) scale(0.95);
          filter: blur(8px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          text-shadow: none;
        }
        .px-title-line.px-revealed {
          opacity: 1; transform: translateY(0) scale(1); filter: blur(0);
          text-shadow: 0 0 10px #5BB7D580, 0 0 30px #2E9ACC40, 0 0 60px #1A4B8C30, 2px 2px 0 #0a1628;
        }
        .px-title-line.px-glitch { animation: pxGlitch 0.08s steps(2) 1; }

        /* ── Divider ── */
        .px-divider {
          margin-top: 16px; width: 0; height: 2px; border-radius: 1px;
          background: linear-gradient(to right, transparent, #5BB7D5, #2E9ACC, #5BB7D5, transparent);
          box-shadow: 0 0 15px #5BB7D580, 0 0 30px #2E9ACC40;
          transition: width 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
        }
        .px-divider.px-revealed { width: min(50%, 350px); }

        /* ── Intro UI ── */
        .px-ui {
          opacity: 0; transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 20px; display: flex; flex-direction: column; align-items: center;
        }
        .px-ui.px-revealed { opacity: 1; transform: translateY(0); }

        /* ── Skip ── */
        .px-skip {
          opacity: 0; transition: all 0.4s ease;
        }
        .px-skip.px-revealed { opacity: 1; }
        .px-skip:hover { color: #94A3B8; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }

        /* ── Intro Button ── */
        .px-btn-primary {
          padding: 14px 36px; font-size: clamp(15px, 1.6vw, 18px);
          font-weight: 600; color: #0a1628;
          background: linear-gradient(135deg, #5BB7D5, #2E9ACC);
          border: 2px solid #7DD3FC; border-radius: 10px;
          cursor: pointer; letter-spacing: 0.04em;
          box-shadow: 0 0 25px #5BB7D540, 0 4px 20px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .px-btn-primary:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 0 40px #5BB7D570, 0 6px 25px rgba(0,0,0,0.4);
        }

        /* ── Home Phase ── */
        .px-home-header, .px-home-sub, .px-home-footer {
          opacity: 0; transform: translateY(20px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .px-home-header.px-revealed, .px-home-sub.px-revealed, .px-home-footer.px-revealed {
          opacity: 1; transform: translateY(0);
        }
        .px-home-sub { transition-delay: 0.15s; }
        .px-home-footer { transition-delay: 0.5s; }

        /* ── Tool Cards ── */
        .px-tool-card {
          background: linear-gradient(145deg, rgba(15, 40, 71, 0.8), rgba(10, 30, 61, 0.6));
          border: 1px solid rgba(91, 183, 213, 0.15);
          border-radius: 16px;
          padding: 32px 28px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0; transform: translateY(30px);
          position: relative; overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .px-tool-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(91,183,213,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .px-tool-card.px-revealed {
          opacity: 1; transform: translateY(0);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .px-tool-card:hover {
          transform: translateY(-6px) !important;
          border-color: rgba(91, 183, 213, 0.35);
          box-shadow: 0 8px 40px rgba(91, 183, 213, 0.15), 0 0 60px rgba(91, 183, 213, 0.05);
        }
        .px-tool-card:active { transform: translateY(-2px) !important; }

        .px-card-icon-wrap {
          width: 60px; height: 60px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .px-card-title {
          font-size: clamp(18px, 2.2vw, 22px); font-weight: 700;
          color: #E2E8F0; margin: 0 0 12px; letter-spacing: -0.01em;
        }
        .px-card-desc {
          color: #94A3B8; font-size: clamp(13px, 1.4vw, 15px);
          line-height: 1.7; margin: 0 0 24px; opacity: 0.85;
        }

        /* ── Card Buttons ── */
        .px-card-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px; font-size: 14px; font-weight: 600;
          color: #0a1628;
          background: linear-gradient(135deg, #5BB7D5, #2E9ACC);
          border: none; border-radius: 8px;
          cursor: pointer; transition: all 0.3s;
          box-shadow: 0 2px 12px rgba(91, 183, 213, 0.3);
        }
        .px-card-btn:hover {
          box-shadow: 0 4px 20px rgba(91, 183, 213, 0.45);
          transform: translateX(2px);
        }
        .px-card-btn-purple {
          background: linear-gradient(135deg, #A78BFA, #8B5CF6);
          box-shadow: 0 2px 12px rgba(167, 139, 250, 0.3);
        }
        .px-card-btn-purple:hover {
          box-shadow: 0 4px 20px rgba(167, 139, 250, 0.45);
        }

        /* ── Link Buttons ── */
        .px-link-btn {
          color: #7DD3FC; background: rgba(91,183,213,0.08);
          border: 1px solid rgba(91,183,213,0.2); border-radius: 8px;
          padding: 10px 20px; font-size: 14px; cursor: pointer;
          transition: all 0.3s;
        }
        .px-link-btn:hover {
          background: rgba(91,183,213,0.15);
          border-color: rgba(91,183,213,0.4);
          transform: translateY(-1px);
        }

        /* ── Keyframes ── */
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

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .px-cards-grid { padding: 0 4px; }
          .px-tool-card { padding: 24px 20px; }
          .px-card-icon-wrap { width: 50px; height: 50px; }
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
