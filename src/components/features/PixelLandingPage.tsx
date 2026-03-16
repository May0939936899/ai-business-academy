'use client'

import { useState, useEffect } from 'react'

export default function PixelLandingPage() {
  const [phase, setPhase] = useState<'splash' | 'fadeout' | 'done'>('splash')

  useEffect(() => {
    // Remove CSS cover once React splash is rendering
    document.documentElement.setAttribute('data-splash', '0')
    const showTimer = setTimeout(() => setPhase('fadeout'), 2800)
    const doneTimer = setTimeout(() => {
      setPhase('done')
      document.documentElement.removeAttribute('data-splash')
    }, 3500)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

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
            'linear-gradient(rgba(33,150,243,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(33,150,243,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating particles in CI colors */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i * 47.3 + 11.7) % 100}%`,
              top: `${(i * 31.9 + 23.1) % 100}%`,
              width: i % 3 === 0 ? 4 : 3,
              height: i % 3 === 0 ? 4 : 3,
              borderRadius: '50%',
              background: i % 3 === 0 ? '#2196F3' : i % 3 === 1 ? '#4FC3F7' : '#E91E8C',
              animation: `splashFloat 4s ease-in-out ${(i * 0.4) % 2.5}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow orbs — CI blue & pink */}
      <div
        className="absolute rounded-full"
        style={{
          top: '25%', left: '20%',
          width: 'min(300px, 50vw)', height: 'min(300px, 50vw)',
          background: 'rgba(33,150,243,0.1)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: '25%', right: '20%',
          width: 'min(250px, 40vw)', height: 'min(250px, 40vw)',
          background: 'rgba(233,30,140,0.07)',
          filter: 'blur(80px)',
        }}
      />

      {/* Center content */}
      <div className="relative text-center px-4 sm:px-6 w-full max-w-xl mx-auto">
        {/* Logo pixel blocks — CI colors */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-7">
          {['#2196F3', '#4FC3F7', '#E91E8C', '#42A5F5', '#2196F3'].map((color, i) => (
            <div
              key={i}
              style={{
                width: 'clamp(6px, 1.8vw, 10px)',
                height: 'clamp(6px, 1.8vw, 10px)',
                background: color,
                borderRadius: 2,
                opacity: 0,
                transform: 'scale(0)',
                animation: `splashBlockPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s forwards`,
              }}
            />
          ))}
        </div>

        {/* Main title — pixel font */}
        <h1 style={{ fontFamily: 'var(--font-pixel), "Press Start 2P", monospace' }}>
          <span
            className="block"
            style={{
              fontSize: 'clamp(0.7rem, 3vw, 1.5rem)',
              letterSpacing: '0.15em',
              lineHeight: 1.6,
              color: '#fff',
              opacity: 0,
              transform: 'translateY(12px)',
              animation: 'splashTextIn 0.6s ease-out 0.35s forwards',
              textShadow: '0 0 30px rgba(33,150,243,0.3)',
            }}
          >
            AI BUSINESS
          </span>
          <span
            className="block"
            style={{
              fontSize: 'clamp(0.7rem, 3vw, 1.5rem)',
              letterSpacing: '0.15em',
              lineHeight: 1.6,
              marginTop: 'clamp(6px, 1.5vw, 12px)',
              color: '#fff',
              opacity: 0,
              transform: 'translateY(12px)',
              animation: 'splashTextIn 0.6s ease-out 0.6s forwards',
              textShadow: '0 0 30px rgba(233,30,140,0.25)',
            }}
          >
            ACADEMY
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(0.5rem, 1.3vw, 0.7rem)',
            letterSpacing: '0.25em',
            marginTop: 'clamp(12px, 2vw, 20px)',
            color: 'rgba(79,195,247,0.55)',
            textTransform: 'uppercase',
            opacity: 0,
            animation: 'splashFadeIn 0.5s ease-out 0.9s forwards',
          }}
        >
          School of Business Administration
        </p>

        {/* Loading bar */}
        <div
          style={{
            marginTop: 'clamp(16px, 3vw, 28px)',
            marginInline: 'auto',
            width: 'clamp(100px, 30vw, 180px)',
            height: 3,
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 4,
              background: 'linear-gradient(90deg, #2196F3, #4FC3F7, #E91E8C, #42A5F5)',
              width: '0%',
              animation: 'splashLoaderFill 2.2s ease-in-out forwards',
            }}
          />
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-1.5 sm:gap-2" style={{ marginTop: 'clamp(12px, 2vw, 20px)' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 'clamp(4px, 1.2vw, 7px)',
                height: 'clamp(4px, 1.2vw, 7px)',
                borderRadius: 2,
                background: i === 0 ? '#2196F3' : i === 1 ? '#E91E8C' : '#4FC3F7',
                animation: `splashDotBounce 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      {/* All animations in global style */}
      <style jsx global>{`
        @keyframes splashFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-12px) scale(1.2); opacity: 0.4; }
        }
        @keyframes splashBlockPop {
          0% { opacity: 0; transform: scale(0); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes splashTextIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes splashLoaderFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes splashDotBounce {
          0% { opacity: 0.3; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
