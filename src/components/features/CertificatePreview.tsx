'use client'

import React, { forwardRef } from 'react'
import Image from 'next/image'
import { getCertificateTheme, type CertificateTheme, type BorderPattern } from '@/lib/certificate-themes'

interface CertificatePreviewProps {
  studentName: string
  courseName: string
  certificateCode: string
  issuedDate: string
  themeId: string
  signerName?: string
  signerTitle?: string
  signatureUrl?: string
  logoUrl?: string
  verificationUrl?: string
}

// ─── Border SVG Patterns ──────────────────────────────────────────────────────

function ClassicBorder({ theme }: { theme: CertificateTheme }) {
  return (
    <>
      {/* Outer border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `4px double ${theme.borderColor}`,
        }}
      />
      {/* Inner decorative border */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '12px',
          border: `1.5px solid ${theme.borderColor}`,
          opacity: 0.5,
        }}
      />
      {/* Innermost fine line */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '16px',
          border: `0.5px solid ${theme.borderColor}`,
          opacity: 0.25,
        }}
      />
    </>
  )
}

function ModernBorder({ theme }: { theme: CertificateTheme }) {
  return (
    <>
      {/* Thick left/top accent */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '6px',
          height: '100%',
          background: `linear-gradient(180deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
        }}
      />
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '100%',
          height: '6px',
          background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
        }}
      />
      {/* Bottom thin line */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '2px',
          background: theme.borderColor,
          opacity: 0.3,
        }}
      />
      {/* Accent corner - top right */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '60px',
          height: '60px',
          borderRight: `6px solid ${theme.accentColor}`,
          borderTop: `6px solid transparent`,
        }}
      />
      {/* Accent corner - bottom left */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: '60px',
          height: '60px',
          borderLeft: `6px solid transparent`,
          borderBottom: `6px solid ${theme.accentColor}`,
        }}
      />
    </>
  )
}

function ElegantBorder({ theme }: { theme: CertificateTheme }) {
  return (
    <>
      {/* Outer gold-style border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `3px solid ${theme.borderColor}`,
        }}
      />
      {/* Ornamental inner border */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '8px',
          border: `1.5px solid ${theme.accentColor}`,
          opacity: 0.7,
        }}
      />
      {/* Inner decorative double line */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '14px',
          border: `2px double ${theme.borderColor}`,
          opacity: 0.4,
        }}
      />
      {/* Corner ornaments */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
        const isTop = corner.includes('top')
        const isLeft = corner.includes('left')
        return (
          <div
            key={corner}
            className="absolute pointer-events-none"
            style={{
              [isTop ? 'top' : 'bottom']: '4px',
              [isLeft ? 'left' : 'right']: '4px',
              width: '30px',
              height: '30px',
              borderTop: isTop ? `3px solid ${theme.accentColor}` : 'none',
              borderBottom: !isTop ? `3px solid ${theme.accentColor}` : 'none',
              borderLeft: isLeft ? `3px solid ${theme.accentColor}` : 'none',
              borderRight: !isLeft ? `3px solid ${theme.accentColor}` : 'none',
            }}
          />
        )
      })}
    </>
  )
}

function MinimalBorder({ theme }: { theme: CertificateTheme }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        border: `1px solid ${theme.borderColor}`,
        opacity: 0.6,
      }}
    />
  )
}

function OrnateBorder({ theme }: { theme: CertificateTheme }) {
  return (
    <>
      {/* Outermost border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ border: `3px solid ${theme.borderColor}` }}
      />
      {/* Second layer */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '6px', border: `1px solid ${theme.borderColor}`, opacity: 0.6 }}
      />
      {/* Third layer - double */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '10px', border: `2px double ${theme.accentColor}`, opacity: 0.5 }}
      />
      {/* Fourth layer */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '16px', border: `1px solid ${theme.borderColor}`, opacity: 0.3 }}
      />
      {/* Innermost */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '20px', border: `0.5px solid ${theme.accentColor}`, opacity: 0.2 }}
      />
      {/* Corner rosettes */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
        const isTop = corner.includes('top')
        const isLeft = corner.includes('left')
        return (
          <div
            key={corner}
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              [isTop ? 'top' : 'bottom']: '6px',
              [isLeft ? 'left' : 'right']: '6px',
              width: '24px',
              height: '24px',
              color: theme.accentColor,
              fontSize: '18px',
              lineHeight: 1,
              opacity: 0.6,
            }}
          >
            ✦
          </div>
        )
      })}
    </>
  )
}

function GeometricBorder({ theme }: { theme: CertificateTheme }) {
  return (
    <>
      {/* Outer border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ border: `2px solid ${theme.borderColor}` }}
      />
      {/* Geometric pattern - top */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '10px',
          background: `repeating-linear-gradient(90deg, ${theme.primaryColor} 0px, ${theme.primaryColor} 8px, transparent 8px, transparent 16px, ${theme.secondaryColor} 16px, ${theme.secondaryColor} 24px, transparent 24px, transparent 32px)`,
          opacity: 0.2,
        }}
      />
      {/* Geometric pattern - bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '10px',
          background: `repeating-linear-gradient(90deg, ${theme.primaryColor} 0px, ${theme.primaryColor} 8px, transparent 8px, transparent 16px, ${theme.secondaryColor} 16px, ${theme.secondaryColor} 24px, transparent 24px, transparent 32px)`,
          opacity: 0.2,
        }}
      />
      {/* Inner border */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '12px', border: `1px solid ${theme.borderColor}`, opacity: 0.3 }}
      />
      {/* Corner diamonds */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
        const isTop = corner.includes('top')
        const isLeft = corner.includes('left')
        return (
          <div
            key={corner}
            className="absolute pointer-events-none"
            style={{
              [isTop ? 'top' : 'bottom']: '2px',
              [isLeft ? 'left' : 'right']: '2px',
              width: '18px',
              height: '18px',
              transform: 'rotate(45deg)',
              border: `1.5px solid ${theme.accentColor}`,
              opacity: 0.4,
            }}
          />
        )
      })}
    </>
  )
}

function AcademicBorder({ theme }: { theme: CertificateTheme }) {
  return (
    <>
      {/* Outer border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ border: `3px solid ${theme.borderColor}` }}
      />
      {/* Inner double border */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '8px', border: `2px double ${theme.borderColor}`, opacity: 0.6 }}
      />
      {/* Innermost line */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '14px', border: `1px solid ${theme.borderColor}`, opacity: 0.3 }}
      />
      {/* Top center scroll ornament */}
      <div
        className="absolute top-[3px] left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1"
        style={{ color: theme.accentColor, opacity: 0.5 }}
      >
        <span style={{ fontSize: '10px' }}>&#9698;</span>
        <span style={{ fontSize: '14px' }}>&#9830;</span>
        <span style={{ fontSize: '10px' }}>&#9699;</span>
      </div>
      {/* Bottom center scroll ornament */}
      <div
        className="absolute bottom-[3px] left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1"
        style={{ color: theme.accentColor, opacity: 0.5 }}
      >
        <span style={{ fontSize: '10px' }}>&#9698;</span>
        <span style={{ fontSize: '14px' }}>&#9830;</span>
        <span style={{ fontSize: '10px' }}>&#9699;</span>
      </div>
      {/* Corner laurel-style marks */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
        const isTop = corner.includes('top')
        const isLeft = corner.includes('left')
        return (
          <div
            key={corner}
            className="absolute pointer-events-none"
            style={{
              [isTop ? 'top' : 'bottom']: '5px',
              [isLeft ? 'left' : 'right']: '5px',
              width: '20px',
              height: '20px',
              borderTop: isTop ? `2.5px solid ${theme.accentColor}` : 'none',
              borderBottom: !isTop ? `2.5px solid ${theme.accentColor}` : 'none',
              borderLeft: isLeft ? `2.5px solid ${theme.accentColor}` : 'none',
              borderRight: !isLeft ? `2.5px solid ${theme.accentColor}` : 'none',
              borderRadius: isTop && isLeft ? '6px 0 0 0' : isTop && !isLeft ? '0 6px 0 0' : !isTop && isLeft ? '0 0 0 6px' : '0 0 6px 0',
              opacity: 0.5,
            }}
          />
        )
      })}
    </>
  )
}

function BorderRenderer({ pattern, theme }: { pattern: BorderPattern; theme: CertificateTheme }) {
  switch (pattern) {
    case 'classic':
      return <ClassicBorder theme={theme} />
    case 'modern':
      return <ModernBorder theme={theme} />
    case 'elegant':
      return <ElegantBorder theme={theme} />
    case 'minimal':
      return <MinimalBorder theme={theme} />
    case 'ornate':
      return <OrnateBorder theme={theme} />
    case 'geometric':
      return <GeometricBorder theme={theme} />
    case 'academic':
      return <AcademicBorder theme={theme} />
    default:
      return <ClassicBorder theme={theme} />
  }
}

// ─── Decorative Divider ───────────────────────────────────────────────────────

function DecorativeDivider({ theme }: { theme: CertificateTheme }) {
  return (
    <div className="flex items-center justify-center gap-2 my-1">
      <div
        className="h-px flex-1 max-w-[80px]"
        style={{
          background: `linear-gradient(to right, transparent, ${theme.accentColor})`,
          opacity: 0.5,
        }}
      />
      <div style={{ color: theme.accentColor, opacity: 0.6, fontSize: '10px' }}>&#9830;</div>
      <div
        className="h-px w-[60px]"
        style={{ background: theme.accentColor, opacity: 0.4 }}
      />
      <div style={{ color: theme.accentColor, opacity: 0.6, fontSize: '10px' }}>&#9830;</div>
      <div
        className="h-px flex-1 max-w-[80px]"
        style={{
          background: `linear-gradient(to left, transparent, ${theme.accentColor})`,
          opacity: 0.5,
        }}
      />
    </div>
  )
}

// ─── Main Certificate Component ───────────────────────────────────────────────

const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  (
    {
      studentName,
      courseName,
      certificateCode,
      issuedDate,
      themeId,
      signerName = 'ผศ.ดร.รวิภา อัครจินดานนท์',
      signerTitle = 'คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม',
      signatureUrl,
      logoUrl,
      verificationUrl,
    },
    ref
  ) => {
    const theme = getCertificateTheme(themeId)
    const isLeftAligned = theme.headerStyle === 'left-aligned'

    return (
      <div
        ref={ref}
        id="certificate-preview"
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '1.414 / 1',
          background: theme.bgGradient,
          fontFamily: '"Sarabun", "Noto Sans Thai", sans-serif',
        }}
      >
        {/* ── Border ── */}
        <BorderRenderer pattern={theme.borderPattern} theme={theme} />

        {/* ── Subtle background watermark pattern ── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(${theme.primaryColor} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* ── Content Container ── */}
        <div
          className="relative z-10 flex flex-col items-center justify-between h-full"
          style={{ padding: '5% 8%' }}
        >
          {/* ── Top: Logo + Academy Name ── */}
          <div
            className={`flex items-center gap-3 w-full ${
              isLeftAligned ? 'justify-start' : 'justify-center'
            }`}
          >
            <div className="relative shrink-0" style={{ width: '48px', height: '48px' }}>
              <Image
                src={logoUrl || '/images/brand/spu-bus-logo.svg'}
                alt="SPU BUS Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className={isLeftAligned ? 'text-left' : 'text-center'}>
              <p
                className="font-bold leading-tight"
                style={{
                  color: theme.headerColor,
                  fontSize: 'clamp(10px, 1.6vw, 18px)',
                  letterSpacing: '0.05em',
                }}
              >
                AI Business Academy
              </p>
              <p
                className="leading-tight"
                style={{
                  color: theme.secondaryColor,
                  fontSize: 'clamp(7px, 1vw, 11px)',
                  opacity: 0.8,
                }}
              >
                คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม &middot; School of Business Administration, Sripatum University
              </p>
            </div>
          </div>

          {/* ── Certificate Title ── */}
          <div className="text-center mt-1">
            <h1
              className="font-bold tracking-widest uppercase"
              style={{
                color: theme.headerColor,
                fontSize: 'clamp(14px, 2.6vw, 30px)',
                letterSpacing: '0.15em',
              }}
            >
              Certificate of Completion
            </h1>
            <p
              className="font-medium"
              style={{
                color: theme.primaryColor,
                fontSize: 'clamp(10px, 1.6vw, 18px)',
                opacity: 0.85,
                marginTop: '2px',
              }}
            >
              ประกาศนียบัตร
            </p>
          </div>

          {/* ── Decorative Divider ── */}
          <DecorativeDivider theme={theme} />

          {/* ── Presented To ── */}
          <div className="text-center w-full">
            <p
              className="mb-1"
              style={{
                color: theme.textColor,
                fontSize: 'clamp(8px, 1.2vw, 13px)',
                opacity: 0.7,
              }}
            >
              ขอมอบให้แก่ &middot; This certificate is proudly presented to
            </p>

            {/* ── Student Name ── */}
            <h2
              className="font-bold"
              style={{
                color: theme.headerColor,
                fontSize: 'clamp(18px, 3.4vw, 40px)',
                lineHeight: 1.2,
                borderBottom: `2px solid ${theme.accentColor}`,
                display: 'inline-block',
                paddingBottom: '4px',
                paddingLeft: '24px',
                paddingRight: '24px',
                minWidth: '40%',
              }}
            >
              {studentName}
            </h2>
          </div>

          {/* ── Course Info ── */}
          <div className="text-center w-full">
            <p
              className="mb-1"
              style={{
                color: theme.textColor,
                fontSize: 'clamp(8px, 1.2vw, 13px)',
                opacity: 0.7,
              }}
            >
              ที่ได้สำเร็จหลักสูตร &middot; for successfully completing the course
            </p>
            <h3
              className="font-semibold"
              style={{
                color: theme.primaryColor,
                fontSize: 'clamp(12px, 2vw, 22px)',
                lineHeight: 1.3,
              }}
            >
              {courseName}
            </h3>
          </div>

          {/* ── Date ── */}
          <p
            className="text-center"
            style={{
              color: theme.textColor,
              fontSize: 'clamp(8px, 1.1vw, 12px)',
              opacity: 0.6,
            }}
          >
            วันที่ออกใบประกาศนียบัตร: {issuedDate}
          </p>

          {/* ── Signature Area ── */}
          <div className="text-center mt-auto">
            {/* Signature image */}
            {signatureUrl && (
              <div className="relative mx-auto mb-1" style={{ width: '100px', height: '36px' }}>
                <Image
                  src={signatureUrl}
                  alt="Signature"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}

            {/* Signature line */}
            <div
              className="mx-auto"
              style={{
                width: 'clamp(120px, 22vw, 240px)',
                height: '1px',
                background:
                  theme.signatureStyle === 'modern'
                    ? `linear-gradient(to right, transparent, ${theme.primaryColor}, transparent)`
                    : theme.primaryColor,
                opacity: theme.signatureStyle === 'minimal' ? 0.3 : 0.5,
              }}
            />

            {/* Signer name */}
            <p
              className="font-semibold mt-1"
              style={{
                color: theme.headerColor,
                fontSize: 'clamp(9px, 1.2vw, 13px)',
              }}
            >
              {signerName}
            </p>

            {/* Signer title */}
            <p
              style={{
                color: theme.textColor,
                fontSize: 'clamp(7px, 1vw, 11px)',
                opacity: 0.6,
              }}
            >
              {signerTitle}
            </p>
          </div>

          {/* ── Certificate Code ── */}
          <p
            className="text-center mt-1"
            style={{
              color: theme.textColor,
              fontSize: 'clamp(6px, 0.8vw, 9px)',
              opacity: 0.4,
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
            }}
          >
            {certificateCode}
          </p>
        </div>

        {/* ── QR Code (bottom-right) ── */}
        {verificationUrl && (
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: '4%',
              right: '4%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}`}
              alt="QR Verification"
              style={{
                width: 'clamp(48px, 8vw, 80px)',
                height: 'clamp(48px, 8vw, 80px)',
                borderRadius: '4px',
              }}
            />
            <span
              style={{
                color: theme.textColor,
                fontSize: 'clamp(4px, 0.6vw, 7px)',
                opacity: 0.4,
                fontFamily: 'monospace',
              }}
            >
              Verify
            </span>
          </div>
        )}
      </div>
    )
  }
)

CertificatePreview.displayName = 'CertificatePreview'

export default CertificatePreview
