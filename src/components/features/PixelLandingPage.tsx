'use client'

import { useState, useEffect } from 'react'

export default function PixelLandingPage() {
  const [phase, setPhase] = useState<'splash' | 'fadeout' | 'done'>('splash')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const showTimer = setTimeout(() => setPhase('fadeout'), 2500)
    const doneTimer = setTimeout(() => setPhase('done'), 3100)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (!mounted || phase === 'done') return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #020818 0%, #0a0520 50%, #020818 100%)',
        opacity: phase === 'fadeout' ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
        pointerEvents: phase === 'fadeout' ? 'none' : 'auto',
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="neon-particle"
            style={{
              position: 'absolute',
              left: `${(i * 47.3 + 11.7) % 100}%`,
              top: `${(i * 31.9 + 23.1) % 100}%`,
              animationDelay: `${(i * 0.3) % 2}s`,
              background: i % 3 === 0 ? '#ff2d95' : i % 3 === 1 ? '#00e5ff' : '#b44dff',
              width: 3,
              height: 3,
              borderRadius: '50%',
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="relative text-center px-4">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(0,229,255,0.15), rgba(255,45,149,0.1), transparent)',
          }}
        />

        <h1
          className="relative"
          style={{ fontFamily: 'var(--font-pixel), "Press Start 2P", monospace' }}
        >
          <span className="block neon-line neon-line-1 text-[clamp(0.9rem,3.5vw,1.8rem)] tracking-wider text-white">
            AI BUSINESS
          </span>
          <span className="block neon-line neon-line-2 text-[clamp(0.9rem,3.5vw,1.8rem)] tracking-wider text-white mt-3">
            ACADEMY
          </span>
        </h1>

        <div className="relative mt-8 mx-auto w-48 h-1 rounded-full overflow-hidden bg-white/10">
          <div className="neon-loader h-full rounded-full" />
        </div>

        <div className="relative mt-6 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="neon-dot"
              style={{
                animationDelay: `${i * 0.15}s`,
                background: i % 2 === 0 ? '#00e5ff' : '#ff2d95',
                width: 8,
                height: 8,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .neon-particle {
          animation: floatParticle 3s ease-in-out infinite;
          opacity: 0.6;
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
        .neon-line {
          opacity: 0;
          transform: translateX(-30px);
          animation: slideIn 0.6s ease-out forwards;
        }
        .neon-line-1 {
          animation-delay: 0.2s;
          text-shadow: 0 0 10px #00e5ff, 0 0 30px #00e5ff, 0 0 60px #ff2d95, 0 0 100px #ff2d95;
        }
        .neon-line-2 {
          animation-delay: 0.5s;
          text-shadow: 0 0 10px #ff2d95, 0 0 30px #ff2d95, 0 0 60px #b44dff, 0 0 100px #00e5ff;
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .neon-loader {
          background: linear-gradient(90deg, #00e5ff, #ff2d95, #b44dff, #00e5ff);
          background-size: 200% 100%;
          animation: loaderSlide 2s ease-in-out forwards;
          width: 0%;
        }
        @keyframes loaderSlide {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .neon-dot {
          animation: dotPulse 0.8s ease-in-out infinite alternate;
        }
        @keyframes dotPulse {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
