'use client'

import { useState, useEffect } from 'react'

/* ── CI Colors ── */
const CI_BLUE = '#2196F3'
const CI_LTBLUE = '#4FC3F7'
const CI_PINK = '#E91E8C'

/* ── Orbiting satellite icons (business / AI themed) ── */
const ORBIT_ICONS = [
  { // Analytics — bar chart
    angle: 0, color: CI_LTBLUE, label: 'Analytics',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>`,
  },
  { // AI Brain
    angle: 60, color: '#a78bfa', label: 'AI',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6H8.2C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/><path d="M9 22h6"/><path d="M10 18h4"/><circle cx="10" cy="9" r="1" fill="currentColor"/><circle cx="14" cy="9" r="1" fill="currentColor"/><path d="M10 12.5s1 1 2 1 2-1 2-1"/></svg>`,
  },
  { // Strategy — target
    angle: 120, color: '#f59e0b', label: 'Strategy',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/><path d="M12 3v2m0 14v2M3 12h2m14 0h2"/></svg>`,
  },
  { // Marketing — megaphone
    angle: 180, color: CI_PINK, label: 'Marketing',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  },
  { // Finance — trending up
    angle: 240, color: '#34d399', label: 'Finance',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  },
  { // Dashboard — grid
    angle: 300, color: '#fb923c', label: 'Dashboard',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="4" rx="1.5"/><rect x="3" y="14" width="7" height="4" rx="1.5"/><rect x="14" y="11" width="7" height="7" rx="1.5"/></svg>`,
  },
]

/* ── Tiny floating particles ── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 41.7 + 13.3) % 100,
  y: (i * 29.3 + 7.1) % 100,
  size: i % 3 === 0 ? 3 : 2,
  color: i % 3 === 0 ? CI_BLUE : i % 3 === 1 ? CI_LTBLUE : CI_PINK,
  delay: (i * 0.4) % 3,
  dur: 3 + (i % 3),
}))

export default function PixelLandingPage() {
  const [phase, setPhase] = useState<'splash' | 'fadeout' | 'done'>('splash')

  useEffect(() => {
    document.documentElement.setAttribute('data-splash', '0')
    const t1 = setTimeout(() => setPhase('fadeout'), 3800)
    const t2 = setTimeout(() => {
      setPhase('done')
      document.documentElement.removeAttribute('data-splash')
    }, 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0c1a30 0%, #060d1a 50%, #030712 100%)',
        opacity: phase === 'fadeout' ? 0 : 1,
        transition: 'opacity 0.7s ease-out',
        pointerEvents: phase === 'fadeout' ? 'none' : 'auto',
      }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(33,150,243,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(33,150,243,0.02) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Particles */}
      <div className="absolute inset-0">
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: '50%', background: p.color,
            opacity: 0, animation: `splFloat ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }} />
        ))}
      </div>

      {/* Ambient glow */}
      <div className="absolute" style={{ top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(500px,80vw)', height: 'min(500px,80vw)', background: 'radial-gradient(circle, rgba(33,150,243,0.08), transparent 70%)', borderRadius: '50%' }} />
      <div className="absolute" style={{ top: '60%', left: '55%', transform: 'translate(-50%,-50%)', width: 'min(350px,55vw)', height: 'min(350px,55vw)', background: 'radial-gradient(circle, rgba(233,30,140,0.05), transparent 70%)', borderRadius: '50%' }} />

      {/* ── Center Hub ── */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>

        {/* Orbit rings */}
        <div className="splOrbitRing" style={{ width: 'min(320px, 72vw)', height: 'min(320px, 72vw)', border: '1px dashed rgba(33,150,243,0.12)', borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'splSpin 40s linear infinite' }} />
        <div className="splOrbitRing" style={{ width: 'min(220px, 50vw)', height: 'min(220px, 50vw)', border: '1px dashed rgba(79,195,247,0.08)', borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'splSpin 30s linear infinite reverse' }} />

        {/* Orbiting icons */}
        {ORBIT_ICONS.map((icon, i) => (
          <div
            key={i}
            className="splSatellite"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 'min(320px, 72vw)',
              height: 'min(320px, 72vw)',
              marginLeft: 'calc(min(320px, 72vw) / -2)',
              marginTop: 'calc(min(320px, 72vw) / -2)',
              animation: `splSpin 40s linear infinite`,
              // Each satellite starts at a different angle
            }}
          >
            <div
              style={{
                position: 'absolute',
                // Place icon on the ring at the correct angle
                left: `${50 + 50 * Math.cos((icon.angle * Math.PI) / 180)}%`,
                top: `${50 + 50 * Math.sin((icon.angle * Math.PI) / 180)}%`,
                transform: 'translate(-50%,-50%)',
                opacity: 0,
                animation: `splIconIn 0.5s ease-out ${0.6 + i * 0.15}s forwards`,
              }}
            >
              {/* Counter-rotate so icons stay upright */}
              <div style={{ animation: 'splSpin 40s linear infinite reverse' }}>
                <div style={{
                  width: 'clamp(32px, 8vw, 44px)',
                  height: 'clamp(32px, 8vw, 44px)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${icon.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: icon.color,
                  boxShadow: `0 0 20px ${icon.color}10`,
                  transition: 'transform 0.3s',
                }}>
                  <div style={{ width: 'clamp(16px, 4vw, 22px)', height: 'clamp(16px, 4vw, 22px)' }}
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                </div>
                <p style={{
                  fontSize: 'clamp(6px, 1.5vw, 9px)',
                  color: 'rgba(255,255,255,0.35)',
                  textAlign: 'center',
                  marginTop: 3,
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}>{icon.label}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Center icon — AI Business Hub */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          opacity: 0,
          animation: 'splCenterIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards',
        }}>
          <div style={{
            width: 'clamp(64px, 16vw, 88px)',
            height: 'clamp(64px, 16vw, 88px)',
            borderRadius: 'clamp(16px, 4vw, 22px)',
            background: 'linear-gradient(135deg, #2196F3 0%, #4FC3F7 50%, #42A5F5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 40px rgba(33,150,243,0.3), 0 0 80px rgba(33,150,243,0.1)',
            position: 'relative',
          }}>
            {/* Briefcase + AI spark icon */}
            <svg viewBox="0 0 48 48" fill="none" style={{ width: '60%', height: '60%' }}>
              {/* Briefcase */}
              <rect x="6" y="16" width="36" height="24" rx="4" stroke="white" strokeWidth="2.2" fill="none" />
              <path d="M16 16V12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" stroke="white" strokeWidth="2.2" fill="none" />
              <path d="M6 26h36" stroke="white" strokeWidth="1.5" opacity="0.5" />
              {/* AI sparkle */}
              <circle cx="24" cy="26" r="3" fill="white" opacity="0.9" />
              <path d="M24 20v-2M24 34v-2M18 26h-2M32 26h-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <path d="M20.5 22.5l-1-1M28.5 30.5l-1-1M27.5 22.5l1-1M19.5 30.5l1-1" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            </svg>
            {/* Pulse ring */}
            <div style={{
              position: 'absolute', inset: -6, borderRadius: 'clamp(20px, 5vw, 28px)',
              border: '1.5px solid rgba(33,150,243,0.2)',
              animation: 'splPulse 2.5s ease-out infinite',
            }} />
          </div>
          <p style={{
            textAlign: 'center',
            marginTop: 'clamp(6px, 1.5vw, 10px)',
            fontSize: 'clamp(7px, 1.8vw, 10px)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.6)',
          }}>AI Business</p>
        </div>
      </div>

      {/* Bottom text */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(40px, 8vh, 80px)',
        left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: 0,
        animation: 'splFadeUp 0.6s ease-out 1.6s forwards',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-pixel), "Press Start 2P", monospace',
          fontSize: 'clamp(0.6rem, 2.2vw, 1.15rem)',
          letterSpacing: '0.15em',
          color: '#fff',
          textShadow: '0 0 30px rgba(33,150,243,0.2)',
        }}>
          AI BUSINESS ACADEMY
        </h1>
        <p style={{
          fontSize: 'clamp(0.55rem, 1.3vw, 0.7rem)',
          letterSpacing: '0.2em',
          marginTop: 'clamp(6px, 1vw, 10px)',
          color: 'rgba(79,195,247,0.4)',
          textTransform: 'uppercase',
        }}>
          School of Business Administration · SPU
        </p>

        {/* Loading bar */}
        <div style={{
          marginTop: 'clamp(12px, 2vw, 18px)',
          marginInline: 'auto',
          width: 'clamp(100px, 20vw, 180px)',
          height: 2, borderRadius: 2,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.04)',
        }}>
          <div style={{
            height: '100%', borderRadius: 2,
            background: `linear-gradient(90deg, ${CI_BLUE}, ${CI_LTBLUE}, ${CI_PINK})`,
            width: '0%',
            animation: 'splLoader 3s ease-in-out 0.5s forwards',
          }} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes splFloat {
          0%, 100% { transform: translateY(0); opacity: 0.08; }
          50% { transform: translateY(-15px); opacity: 0.3; }
        }
        @keyframes splSpin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to { transform: translate(-50%,-50%) rotate(360deg); }
        }
        .splSatellite { pointer-events: none; }
        @keyframes splIconIn {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0); }
          100% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes splCenterIn {
          0% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes splPulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes splFadeUp {
          0% { opacity: 0; transform: translateX(-50%) translateY(12px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes splLoader {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
