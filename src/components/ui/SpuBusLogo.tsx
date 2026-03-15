'use client'

interface SpuBusLogoProps {
  width?: number
  height?: number
  className?: string
}

/**
 * SPU BUS Logo — rendered as inline SVG so it uses web fonts (Inter)
 * that are already loaded by the app. This avoids the "Arial Black not
 * available" problem that caused incomplete rendering with the external SVG.
 */
export default function SpuBusLogo({ width = 130, height = 48, className }: SpuBusLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 155"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="SPU BUS – School of Business Administration"
    >
      {/* Use Inter 900 (Black) which is always loaded via next/font/google */}
      <style>{`
        .logo-main { font-family: var(--font-inter), Inter, 'Arial Black', 'Helvetica Neue', Arial, sans-serif; font-weight: 900; }
        .logo-sub  { font-family: var(--font-inter), Inter, Arial, Helvetica, sans-serif; font-weight: 700; }
      `}</style>

      {/* SPU Text — white */}
      <text x="2" y="92" className="logo-main" fontSize="98" fill="#ffffff" letterSpacing="-4">
        SPU
      </text>

      {/* Pink underline bar beneath SPU */}
      <rect x="2" y="102" width="57" height="8" rx="2" fill="#E91E8C" />

      {/* BUS Text — blue gradient letters */}
      <text x="185" y="92" className="logo-main" fontSize="98" letterSpacing="-4">
        <tspan fill="#4FC3F7">B</tspan>
        <tspan fill="#2196F3">U</tspan>
        <tspan fill="#42A5F5">S</tspan>
      </text>

      {/* SCHOOL OF BUSINESS ADMINISTRATION */}
      <text x="187" y="122" className="logo-sub" fontSize="17" fill="#ffffff" letterSpacing="0.5" opacity="0.9">
        SCHOOL OF
      </text>
      <text x="187" y="145" className="logo-sub" fontSize="17" fill="#ffffff" letterSpacing="0.5" opacity="0.9">
        BUSINESS ADMINISTRATION
      </text>
    </svg>
  )
}
