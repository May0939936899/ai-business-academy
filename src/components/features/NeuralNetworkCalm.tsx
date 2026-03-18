'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

/* ── Node definitions ── */
const NODES = [
  {
    id: 'data',
    label: 'Data Intelligence',
    color: '#4FC3F7',
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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="4" rx="1.5" />
        <rect x="3" y="14" width="7" height="4" rx="1.5" /><rect x="14" y="11" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
]

/* ── Core color cycle: blue -> purple -> pink ── */
const CORE_COLORS = ['#4FC3F7', '#A78BFA', '#E91E8C']

/* ── Float animation configs (unique per node) ── */
const FLOAT_CONFIGS = [
  { ampX: 0, ampY: 6, duration: 3.2, name: 'nnFloat0' },
  { ampX: 4, ampY: 5, duration: 3.8, name: 'nnFloat1' },
  { ampX: -3, ampY: 7, duration: 4.1, name: 'nnFloat2' },
  { ampX: 5, ampY: -4, duration: 3.5, name: 'nnFloat3' },
  { ampX: -4, ampY: 8, duration: 4.4, name: 'nnFloat4' },
  { ampX: 3, ampY: -6, duration: 3.9, name: 'nnFloat5' },
]

/* ── Data pulse lines (indices of nodes that have traveling dots) ── */
const PULSE_LINES = [0, 2, 4] // Data Intelligence, Strategy, Finance

export default function NeuralNetworkCalm() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [coreColor, setCoreColor] = useState(CORE_COLORS[0])
  const colorIdxRef = useRef(0)

  // Cycle core color every 12s with JS-driven transition
  useEffect(() => {
    const interval = setInterval(() => {
      colorIdxRef.current = (colorIdxRef.current + 1) % CORE_COLORS.length
      setCoreColor(CORE_COLORS[colorIdxRef.current])
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  // Compute node positions on a circle (44% radius)
  const nodePositions = useMemo(
    () =>
      NODES.map((_, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180) // start from top
        return {
          x: 50 + 44 * Math.cos(angle),
          y: 50 + 44 * Math.sin(angle),
        }
      }),
    [],
  )

  return (
    <div className="relative h-[380px] w-[380px] sm:h-[460px] sm:w-[460px] lg:h-[500px] lg:w-[500px]">
      {/* ── SVG Connection Lines ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="nn-line-glow">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
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
            stroke="rgba(79,195,247,0.15)"
            strokeWidth="0.3"
            filter="url(#nn-line-glow)"
          />
        ))}

        {/* Data pulse dots traveling along selected lines */}
        {PULSE_LINES.map((lineIdx, pi) => {
          const pos = nodePositions[lineIdx]
          return (
            <circle
              key={`pulse-${pi}`}
              r="0.6"
              fill="#4FC3F7"
              opacity="0.7"
            >
              <animateMotion
                dur={`${3 + pi * 0.8}s`}
                repeatCount="indefinite"
                begin={`${pi * 1.2}s`}
              >
                <mpath xlinkHref={`#nn-path-${lineIdx}`} />
              </animateMotion>
            </circle>
          )
        })}

        {/* Hidden paths for animateMotion */}
        {PULSE_LINES.map((lineIdx) => {
          const pos = nodePositions[lineIdx]
          return (
            <path
              key={`path-${lineIdx}`}
              id={`nn-path-${lineIdx}`}
              d={`M50,50 L${pos.x},${pos.y}`}
              fill="none"
              stroke="none"
            />
          )
        })}
      </svg>

      {/* ── Surrounding Nodes ── */}
      {NODES.map((node, i) => {
        const pos = nodePositions[i]
        const isHovered = hovered === node.id
        const floatClass = `nn-float-${i}`

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: isHovered ? 20 : 10,
            }}
          >
            <div
              className={`group relative cursor-pointer ${floatClass}`}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Node circle */}
              <div
                className="flex items-center justify-center transition-all duration-300"
                style={{
                  width: 'clamp(44px, 10vw, 56px)',
                  height: 'clamp(44px, 10vw, 56px)',
                  borderRadius: '50%',
                  background: isHovered
                    ? `rgba(${hexToRgb(node.color)}, 0.12)`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${
                    isHovered
                      ? `rgba(${hexToRgb(node.color)}, 0.35)`
                      : 'rgba(255,255,255,0.07)'
                  }`,
                  color: node.color,
                  transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                  opacity: isHovered ? 1 : 0.85,
                }}
              >
                <div style={{ width: 'clamp(20px, 5vw, 26px)', height: 'clamp(20px, 5vw, 26px)' }}>
                  {node.icon}
                </div>
              </div>

              {/* Label (always visible, subtle) */}
              <p
                className="absolute left-1/2 whitespace-nowrap text-center transition-all duration-300 pointer-events-none"
                style={{
                  bottom: '-20px',
                  transform: 'translateX(-50%)',
                  fontSize: 'clamp(8px, 2vw, 10px)',
                  color: isHovered ? node.color : 'rgba(255,255,255,0.3)',
                  fontWeight: isHovered ? 600 : 400,
                  opacity: isHovered ? 1 : 0.6,
                }}
              >
                {node.label}
              </p>

              {/* Hover tooltip above node */}
              {isHovered && (
                <div
                  className="absolute left-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 pointer-events-none"
                  style={{
                    top: '-40px',
                    transform: 'translateX(-50%)',
                    background: 'rgba(10,15,30,0.9)',
                    border: `1px solid rgba(${hexToRgb(node.color)}, 0.25)`,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: node.color,
                    animation: 'nnTooltipIn 0.2s ease-out',
                  }}
                >
                  {node.label}
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* ── Center Core Node ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative pointer-events-auto nn-core-pulse">
          {/* Subtle radial glow (opacity only, no blur animation) */}
          <div
            className="absolute -inset-10 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${hexToRgb(coreColor)}, 0.1), transparent 70%)`,
              transition: 'background 2s ease-in-out',
            }}
          />

          {/* Core circle */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 'clamp(72px, 18vw, 100px)',
              height: 'clamp(72px, 18vw, 100px)',
              borderRadius: '50%',
              background: `radial-gradient(circle at 40% 40%, ${coreColor}, ${adjustBrightness(coreColor, -30)})`,
              boxShadow: `0 0 40px rgba(${hexToRgb(coreColor)}, 0.25)`,
              transition: 'background 2s ease-in-out, box-shadow 2s ease-in-out',
            }}
          >
            {/* Briefcase + AI sparkle icon */}
            <svg viewBox="0 0 48 48" fill="none" style={{ width: '58%', height: '58%' }}>
              <rect x="6" y="16" width="36" height="24" rx="4" stroke="white" strokeWidth="2.2" />
              <path d="M16 16V12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" stroke="white" strokeWidth="2.2" />
              <path d="M6 26h36" stroke="white" strokeWidth="1.5" opacity="0.4" />
              <circle cx="24" cy="26" r="3" fill="white" opacity="0.9" />
              <path d="M24 20v-1.5M24 33.5V32M18.5 26H17M31 26h-1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              <path d="M21 23l-.7-.7M27.7 29.7L27 29M27 23l.7-.7M20.3 29.7l.7-.7" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            </svg>
          </div>

          {/* Core label */}
          <div
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1"
            style={{
              bottom: 'clamp(-30px, -5vw, -36px)',
              background: 'rgba(10,15,30,0.8)',
              border: '1px solid rgba(79,195,247,0.15)',
              fontSize: 'clamp(9px, 2.2vw, 11px)',
              fontWeight: 600,
              color: '#4FC3F7',
              letterSpacing: '0.03em',
            }}
          >
            AI SPUBUS Core
          </div>
        </div>
      </div>

      {/* ── Styles ── */}
      <style jsx global>{`
        /* Core subtle pulse: scale 1 -> 1.03 */
        .nn-core-pulse {
          animation: nnCorePulse 5s ease-in-out infinite;
        }

        @keyframes nnCorePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        /* Float animations for each node (unique patterns, 4-8px amplitude) */
        @keyframes nnFloat0 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes nnFloat1 {
          0%, 100% { transform: translate(0, 0); }
          30% { transform: translate(4px, -5px); }
          70% { transform: translate(-2px, 3px); }
        }
        @keyframes nnFloat2 {
          0%, 100% { transform: translate(0, 0); }
          40% { transform: translate(-3px, -7px); }
          80% { transform: translate(2px, 4px); }
        }
        @keyframes nnFloat3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(5px, -4px); }
        }
        @keyframes nnFloat4 {
          0%, 100% { transform: translate(0, 0); }
          35% { transform: translate(-4px, -8px); }
          65% { transform: translate(3px, 4px); }
        }
        @keyframes nnFloat5 {
          0%, 100% { transform: translate(0, 0); }
          45% { transform: translate(3px, -6px); }
          80% { transform: translate(-2px, 4px); }
        }

        .nn-float-0 { animation: nnFloat0 3.2s ease-in-out infinite; }
        .nn-float-1 { animation: nnFloat1 3.8s ease-in-out infinite; }
        .nn-float-2 { animation: nnFloat2 4.1s ease-in-out infinite; }
        .nn-float-3 { animation: nnFloat3 3.5s ease-in-out infinite; }
        .nn-float-4 { animation: nnFloat4 4.4s ease-in-out infinite; }
        .nn-float-5 { animation: nnFloat5 3.9s ease-in-out infinite; }

        @keyframes nnTooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Reduced motion: minimal opacity pulse only */
        @media (prefers-reduced-motion: reduce) {
          .nn-core-pulse {
            animation: nnReducedPulse 5s ease-in-out infinite;
          }
          .nn-float-0, .nn-float-1, .nn-float-2,
          .nn-float-3, .nn-float-4, .nn-float-5 {
            animation: nnReducedPulse 4s ease-in-out infinite;
          }
          @keyframes nnReducedPulse {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 1; }
          }
          /* Stop SVG pulse dot animations */
          svg animateMotion {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

/* ── Utility: hex to r,g,b string ── */
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `${r},${g},${b}`
}

/* ── Utility: darken/lighten a hex color ── */
function adjustBrightness(hex: string, amount: number): string {
  const h = hex.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(h.substring(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(h.substring(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(h.substring(4, 6), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
