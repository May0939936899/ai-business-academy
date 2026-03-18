'use client'

import { useState, useEffect, useMemo, useRef } from 'react'

/* ── Node Items ── */
const NODES = [
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

// 3 colors: blue → purple → pink (12s each)
const CORE_COLORS = [
  { bg: 'linear-gradient(135deg, #2196F3 0%, #4FC3F7 50%, #64B5F6 100%)', shadow: 'rgba(79,195,247,0.35)', glow: 'rgba(79,195,247,0.15)' },
  { bg: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #8B5CF6 100%)', shadow: 'rgba(167,139,250,0.35)', glow: 'rgba(167,139,250,0.15)' },
  { bg: 'linear-gradient(135deg, #BE185D 0%, #E91E8C 50%, #EC4899 100%)', shadow: 'rgba(233,30,140,0.35)', glow: 'rgba(233,30,140,0.15)' },
]

// Data pulse: which connection lines have traveling dots
const PULSE_LINES = [0, 1, 2, 3, 4]

export default function AIOrbitSystem() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [colorIdx, setColorIdx] = useState(0)
  const colorIdxRef = useRef(0)

  // Cycle core color every 12s
  useEffect(() => {
    const interval = setInterval(() => {
      colorIdxRef.current = (colorIdxRef.current + 1) % CORE_COLORS.length
      setColorIdx(colorIdxRef.current)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  const coreColor = CORE_COLORS[colorIdx]

  // Node positions on circle (44% radius, starting from top)
  const nodePositions = useMemo(
    () =>
      NODES.map((_, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180)
        return {
          x: 50 + 44 * Math.cos(angle),
          y: 50 + 44 * Math.sin(angle),
        }
      }),
    [],
  )

  return (
    <div className="relative h-[380px] w-[380px] sm:h-[460px] sm:w-[460px] lg:h-[500px] lg:w-[500px]">

      {/* ── SVG Connection Lines + Data Pulses ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines from center to each node */}
        {nodePositions.map((pos, i) => (
          <line
            key={`line-${i}`}
            x1="50"
            y1="50"
            x2={pos.x}
            y2={pos.y}
            stroke={hovered === NODES[i].id ? NODES[i].color : 'rgba(255,255,255,0.12)'}
            strokeWidth={hovered === NODES[i].id ? '0.4' : '0.3'}
            filter="url(#line-glow)"
            style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
          />
        ))}

        {/* Hidden paths for animateMotion */}
        {PULSE_LINES.map((lineIdx) => {
          const pos = nodePositions[lineIdx]
          return (
            <path
              key={`path-${lineIdx}`}
              id={`pulse-path-${lineIdx}`}
              d={`M50,50 L${pos.x},${pos.y}`}
              fill="none"
              stroke="none"
            />
          )
        })}

        {/* Data pulse dots traveling along selected lines */}
        {PULSE_LINES.map((lineIdx, pi) => (
          <circle
            key={`pulse-${pi}`}
            r="0.5"
            fill={NODES[lineIdx].color}
            opacity="0.6"
          >
            <animateMotion
              dur={`${3.5 + pi * 0.7}s`}
              repeatCount="indefinite"
              begin={`${pi * 1.4}s`}
            >
              <mpath xlinkHref={`#pulse-path-${lineIdx}`} />
            </animateMotion>
          </circle>
        ))}

        {/* Return pulse dots (node → center) for visual rhythm */}
        {PULSE_LINES.map((lineIdx, pi) => {
          const pos = nodePositions[lineIdx]
          return (
            <circle
              key={`pulse-return-${pi}`}
              r="0.35"
              fill={NODES[lineIdx].color}
              opacity="0.35"
            >
              <animateMotion
                dur={`${4 + pi * 0.6}s`}
                repeatCount="indefinite"
                begin={`${pi * 1.4 + 1.8}s`}
                keyPoints="1;0"
                keyTimes="0;1"
                calcMode="linear"
              >
                <mpath xlinkHref={`#pulse-path-${lineIdx}`} />
              </animateMotion>
            </circle>
          )
        })}
      </svg>

      {/* ── Nodes (free-floating, no orbit spin) ── */}
      {NODES.map((item, i) => {
        const pos = nodePositions[i]
        const isHovered = hovered === item.id

        return (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: isHovered ? 20 : 10,
            }}
          >
            <div
              className="group relative cursor-pointer"
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Icon container with independent float */}
              <div
                className={`node-float-${i} flex items-center justify-center transition-all duration-300`}
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
        )
      })}

      {/* ── Center Core ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative pointer-events-auto">
          {/* Glow */}
          <div
            className="absolute -inset-12 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${coreColor.glow}, transparent 70%)`,
              transition: 'background 2s ease-in-out',
            }}
          />

          {/* Pulse ring */}
          <div
            className="absolute -inset-4 rounded-[28px]"
            style={{
              border: `1.5px solid ${coreColor.glow}`,
              animation: 'corePulse 2.5s ease-out infinite',
              transition: 'border-color 2s ease-in-out',
            }}
          />

          {/* Icon */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 'clamp(72px, 18vw, 100px)',
              height: 'clamp(72px, 18vw, 100px)',
              borderRadius: 'clamp(18px, 5vw, 26px)',
              background: coreColor.bg,
              boxShadow: `0 8px 40px ${coreColor.shadow}, 0 0 60px ${coreColor.glow}`,
              transition: 'background 2s ease-in-out, box-shadow 2s ease-in-out',
            }}
          >
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
          key={`dot-${i}`}
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
        /* ── Independent float animations per node (unique natural motion) ── */
        @keyframes nodeFloat0 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(2px, -7px); }
          50% { transform: translate(-1px, -4px); }
          75% { transform: translate(3px, -8px); }
        }
        @keyframes nodeFloat1 {
          0%, 100% { transform: translate(0, 0); }
          30% { transform: translate(-5px, -3px); }
          60% { transform: translate(3px, -6px); }
          85% { transform: translate(-2px, 2px); }
        }
        @keyframes nodeFloat2 {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(4px, 3px); }
          55% { transform: translate(-3px, -5px); }
          80% { transform: translate(1px, -7px); }
        }
        @keyframes nodeFloat3 {
          0%, 100% { transform: translate(0, 0); }
          35% { transform: translate(-4px, -6px); }
          70% { transform: translate(2px, 4px); }
        }
        @keyframes nodeFloat4 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(5px, -2px); }
          50% { transform: translate(-2px, -8px); }
          75% { transform: translate(3px, -4px); }
        }
        @keyframes nodeFloat5 {
          0%, 100% { transform: translate(0, 0); }
          40% { transform: translate(-3px, -5px); }
          65% { transform: translate(4px, 2px); }
          90% { transform: translate(-1px, -6px); }
        }

        .node-float-0 { animation: nodeFloat0 4.2s ease-in-out infinite; }
        .node-float-1 { animation: nodeFloat1 5.0s ease-in-out infinite; }
        .node-float-2 { animation: nodeFloat2 4.6s ease-in-out infinite; }
        .node-float-3 { animation: nodeFloat3 3.8s ease-in-out infinite; }
        .node-float-4 { animation: nodeFloat4 5.4s ease-in-out infinite; }
        .node-float-5 { animation: nodeFloat5 4.0s ease-in-out infinite; }

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

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .node-float-0, .node-float-1, .node-float-2,
          .node-float-3, .node-float-4, .node-float-5 {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
