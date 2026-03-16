'use client'

import { useState } from 'react'

/* ── Orbit Items ── */
const ORBIT_ITEMS = [
  {
    id: 'data',
    label: 'Data Intelligence',
    color: '#4FC3F7',
    hoverBg: 'rgba(79,195,247,0.12)',
    hoverBorder: 'rgba(79,195,247,0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="12" width="4" height="9" rx="1" />
        <rect x="10" y="7" width="4" height="14" rx="1" />
        <rect x="17" y="3" width="4" height="18" rx="1" />
      </svg>
    ),
  },
  {
    id: 'ai',
    label: 'AI Engine',
    color: '#A78BFA',
    hoverBg: 'rgba(167,139,250,0.12)',
    hoverBorder: 'rgba(167,139,250,0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6H8.2C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z" />
        <path d="M9 22h6M10 18h4" />
        <circle cx="10" cy="9" r="1" fill="currentColor" /><circle cx="14" cy="9" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'strategy',
    label: 'Strategy',
    color: '#FBBF24',
    hoverBg: 'rgba(251,191,36,0.12)',
    hoverBorder: 'rgba(251,191,36,0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" />
        <path d="M12 3v2m0 14v2M3 12h2m14 0h2" />
      </svg>
    ),
  },
  {
    id: 'marketing',
    label: 'Marketing',
    color: '#E91E8C',
    hoverBg: 'rgba(233,30,140,0.12)',
    hoverBorder: 'rgba(233,30,140,0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: 'finance',
    label: 'Finance',
    color: '#34D399',
    hoverBg: 'rgba(52,211,153,0.12)',
    hoverBorder: 'rgba(52,211,153,0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    id: 'operations',
    label: 'Operations',
    color: '#FB923C',
    hoverBg: 'rgba(251,146,60,0.12)',
    hoverBorder: 'rgba(251,146,60,0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="4" rx="1.5" />
        <rect x="3" y="14" width="7" height="4" rx="1.5" /><rect x="14" y="11" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
]

export default function AIOrbitSystem() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="relative h-[380px] w-[380px] sm:h-[460px] sm:w-[460px] lg:h-[500px] lg:w-[500px]">

      {/* ── Orbit Rings ── */}
      <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.04]" />
      <div className="absolute inset-10 sm:inset-12 rounded-full border border-white/[0.06]" />
      <div className="absolute inset-20 sm:inset-24 rounded-full border border-dashed border-white/[0.04]" />

      {/* ── Rotating Orbit Container ── */}
      <div className="orbit-spin absolute inset-0">
        {ORBIT_ITEMS.map((item, i) => {
          const angle = (i * 60) * (Math.PI / 180) // 60deg apart
          // Position on circle: 50% + 46% * cos/sin
          const x = 50 + 44 * Math.cos(angle)
          const y = 50 + 44 * Math.sin(angle)
          const isHovered = hovered === item.id

          return (
            <div
              key={item.id}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isHovered ? 20 : 10,
              }}
            >
              {/* Counter-rotate to keep icons upright */}
              <div className="orbit-counter-spin">
                <div
                  className="group relative cursor-pointer"
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Icon container */}
                  <div
                    className="orbit-float flex items-center justify-center transition-all duration-300"
                    style={{
                      width: 'clamp(44px, 10vw, 56px)',
                      height: 'clamp(44px, 10vw, 56px)',
                      borderRadius: 'clamp(12px, 3vw, 16px)',
                      background: isHovered ? item.hoverBg : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isHovered ? item.hoverBorder : 'rgba(255,255,255,0.07)'}`,
                      backdropFilter: 'blur(12px)',
                      color: item.color,
                      boxShadow: isHovered
                        ? `0 0 24px ${item.color}20, 0 4px 16px rgba(0,0,0,0.2)`
                        : '0 2px 8px rgba(0,0,0,0.15)',
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                      animationDelay: `${i * 0.4}s`,
                    }}
                  >
                    <div style={{ width: 'clamp(20px, 5vw, 26px)', height: 'clamp(20px, 5vw, 26px)' }}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Label */}
                  <p
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-all duration-300"
                    style={{
                      fontSize: 'clamp(8px, 2vw, 10px)',
                      color: isHovered ? item.color : 'rgba(255,255,255,0.3)',
                      fontWeight: isHovered ? 600 : 400,
                      transform: `translateX(-50%) ${isHovered ? 'translateY(2px)' : ''}`,
                      opacity: isHovered ? 1 : 0.6,
                    }}
                  >
                    {item.label}
                  </p>

                  {/* Hover tooltip */}
                  {isHovered && (
                    <div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1.5"
                      style={{
                        background: 'rgba(10,15,30,0.9)',
                        border: `1px solid ${item.color}40`,
                        fontSize: '11px',
                        fontWeight: 600,
                        color: item.color,
                        backdropFilter: 'blur(8px)',
                        boxShadow: `0 4px 12px rgba(0,0,0,0.3), 0 0 12px ${item.color}15`,
                        animation: 'tooltipIn 0.2s ease-out',
                      }}
                    >
                      {item.label}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Center Core ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative pointer-events-auto">
          {/* Glow */}
          <div
            className="absolute -inset-12 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(33,150,243,0.15), transparent 70%)' }}
          />

          {/* Pulse ring */}
          <div
            className="absolute -inset-4 rounded-[28px]"
            style={{
              border: '1.5px solid rgba(33,150,243,0.15)',
              animation: 'corePulse 2.5s ease-out infinite',
            }}
          />

          {/* Icon */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 'clamp(72px, 18vw, 100px)',
              height: 'clamp(72px, 18vw, 100px)',
              borderRadius: 'clamp(18px, 5vw, 26px)',
              background: 'linear-gradient(135deg, #2196F3 0%, #4FC3F7 50%, #42A5F5 100%)',
              boxShadow: '0 8px 40px rgba(33,150,243,0.35), 0 0 60px rgba(33,150,243,0.12)',
            }}
          >
            {/* Briefcase + AI sparkle */}
            <svg viewBox="0 0 48 48" fill="none" style={{ width: '58%', height: '58%' }}>
              <rect x="6" y="16" width="36" height="24" rx="4" stroke="white" strokeWidth="2.2" />
              <path d="M16 16V12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" stroke="white" strokeWidth="2.2" />
              <path d="M6 26h36" stroke="white" strokeWidth="1.5" opacity="0.4" />
              <circle cx="24" cy="26" r="3" fill="white" opacity="0.9" />
              <path d="M24 20v-1.5M24 33.5V32M18.5 26H17M31 26h-1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              <path d="M21 23l-.7-.7M27.7 29.7L27 29M27 23l.7-.7M20.3 29.7l.7-.7" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            </svg>
          </div>

          {/* Label */}
          <div
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1"
            style={{
              bottom: 'clamp(-30px, -5vw, -36px)',
              background: 'rgba(10,15,30,0.8)',
              border: '1px solid rgba(79,195,247,0.15)',
              backdropFilter: 'blur(8px)',
              fontSize: 'clamp(9px, 2.2vw, 11px)',
              fontWeight: 600,
              color: '#4FC3F7',
              letterSpacing: '0.03em',
            }}
          >
            AI Business Core
          </div>
        </div>
      </div>

      {/* ── Accent dots ── */}
      {[
        { x: 25, y: 8, size: 6, color: '#2196F3', delay: 0 },
        { x: 78, y: 15, size: 4, color: '#E91E8C', delay: 1.5 },
        { x: 12, y: 65, size: 5, color: '#4FC3F7', delay: 0.8 },
        { x: 85, y: 70, size: 4, color: '#A78BFA', delay: 2 },
        { x: 40, y: 92, size: 3, color: '#34D399', delay: 1.2 },
      ].map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            background: dot.color,
            opacity: 0.4,
            animation: `dotFloat 3s ease-in-out ${dot.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* ── Styles ── */}
      <style jsx global>{`
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbitCounterSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .orbit-spin {
          animation: orbitSpin 35s linear infinite;
        }
        .orbit-counter-spin {
          animation: orbitCounterSpin 35s linear infinite;
        }
        .orbit-spin:hover,
        .orbit-spin:has(.group:hover) {
          animation-play-state: paused;
        }
        .orbit-spin:hover .orbit-counter-spin,
        .orbit-spin:has(.group:hover) .orbit-counter-spin {
          animation-play-state: paused;
        }
        @keyframes orbitFloat {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.03) translateY(-2px); }
        }
        .orbit-float {
          animation: orbitFloat 3s ease-in-out infinite;
        }
        @keyframes corePulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes dotFloat {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
