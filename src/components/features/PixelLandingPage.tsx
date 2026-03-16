'use client'

import { useState, useEffect } from 'react'

export default function PixelLandingPage() {
  const [phase, setPhase] = useState<'splash' | 'fadeout' | 'done'>('splash')

  useEffect(() => {
    const showTimer = setTimeout(() => setPhase('fadeout'), 2800)
    const doneTimer = setTimeout(() => setPhase('done'), 3500)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  // SSR + initial render: always show the splash overlay (prevents homepage flash)
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: '#030712',
        opacity: phase === 'fadeout' ? 0 : 1,
        transition: 'opacity 0.7s ease-out',
        pointerEvents: phase === 'fadeout' ? 'none' : 'auto',
      }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(33,150,243,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(33,150,243,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating particles in CI colors */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="ci-particle"
            style={{
              position: 'absolute',
              left: `${(i * 47.3 + 11.7) % 100}%`,
              top: `${(i * 31.9 + 23.1) % 100}%`,
              animationDelay: `${(i * 0.4) % 2.5}s`,
              background: i % 3 === 0 ? '#2196F3' : i % 3 === 1 ? '#4FC3F7' : '#E91E8C',
              width: i % 4 === 0 ? 4 : 3,
              height: i % 4 === 0 ? 4 : 3,
              borderRadius: '50%',
            }}
          />
        ))}
      </div>

      {/* Ambient glow orbs matching hero section */}
      <div
        className="absolute top-1/4 left-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full blur-[80px] sm:blur-[120px]"
        style={{ background: 'rgba(33,150,243,0.12)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] rounded-full blur-[80px] sm:blur-[100px]"
        style={{ background: 'rgba(233,30,140,0.08)' }}
      />

      {/* Center content */}
      <div className="relative text-center px-6 w-full max-w-lg mx-auto">
        {/* SPU BUS Logo mark (pixel squares) */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          {['#2196F3', '#4FC3F7', '#E91E8C', '#4FC3F7', '#2196F3'].map((color, i) => (
            <div
              key={i}
              className="ci-block"
              style={{
                width: 'clamp(8px, 2vw, 12px)',
                height: 'clamp(8px, 2vw, 12px)',
                background: color,
                borderRadius: 2,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>

        {/* Main title */}
        <h1
          className="relative"
          style={{ fontFamily: 'var(--font-pixel), "Press Start 2P", monospace' }}
        >
          <span className="block ci-text ci-text-1 text-[clamp(0.75rem,3.2vw,1.6rem)] tracking-widest leading-relaxed">
            AI BUSINESS
          </span>
          <span className="block ci-text ci-text-2 text-[clamp(0.75rem,3.2vw,1.6rem)] tracking-widest leading-relaxed mt-2 sm:mt-3">
            ACADEMY
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="ci-subtitle text-[clamp(0.55rem,1.5vw,0.75rem)] tracking-[0.2em] sm:tracking-[0.3em] mt-4 sm:mt-6 uppercase"
          style={{ color: 'rgba(79,195,247,0.6)' }}
        >
          School of Business Administration
        </p>

        {/* Loading bar */}
        <div className="mt-6 sm:mt-8 mx-auto w-32 sm:w-48 h-[3px] rounded-full overflow-hidden bg-white/5">
          <div className="ci-loader h-full rounded-full" />
        </div>

        {/* Animated dots */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-1.5 sm:gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="ci-dot"
              style={{
                animationDelay: `${i * 0.2}s`,
                background: i === 0 ? '#2196F3' : i === 1 ? '#E91E8C' : '#4FC3F7',
                width: 'clamp(5px, 1.5vw, 8px)',
                height: 'clamp(5px, 1.5vw, 8px)',
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .ci-particle {
          animation: particleFloat 4s ease-in-out infinite;
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-15px) scale(1.3); opacity: 0.5; }
        }

        .ci-block {
          opacity: 0;
          transform: scale(0);
          animation: blockPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes blockPop {
          0% { opacity: 0; transform: scale(0); }
          100% { opacity: 1; transform: scale(1); }
        }

        .ci-text {
          opacity: 0;
          color: #ffffff;
          transform: translateY(15px);
          animation: textReveal 0.7s ease-out forwards;
        }
        .ci-text-1 {
          animation-delay: 0.4s;
          text-shadow: 0 0 20px rgba(33,150,243,0.4), 0 0 40px rgba(33,150,243,0.15);
        }
        .ci-text-2 {
          animation-delay: 0.7s;
          text-shadow: 0 0 20px rgba(233,30,140,0.35), 0 0 40px rgba(79,195,247,0.15);
        }
        @keyframes textReveal {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .ci-subtitle {
          opacity: 0;
          animation: fadeIn 0.6s ease-out 1.0s forwards;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .ci-loader {
          background: linear-gradient(90deg, #2196F3, #4FC3F7, #E91E8C, #4FC3F7);
          animation: loaderFill 2.2s ease-in-out forwards;
          width: 0%;
        }
        @keyframes loaderFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .ci-dot {
          animation: dotBounce 1s ease-in-out infinite alternate;
        }
        @keyframes dotBounce {
          0% { opacity: 0.3; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
