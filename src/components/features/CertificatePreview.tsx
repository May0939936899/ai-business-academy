'use client'

import React, { forwardRef } from 'react'
import Image from 'next/image'
import { getCertificateTheme, type CertificateTheme, type BorderStyle } from '@/lib/certificate-themes'
import '@/styles/certificate-fonts.css'

// ─── Props ───────────────────────────────────────────────────────────────────

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

// ─── Border Renderers ────────────────────────────────────────────────────────

function DoubleBorder({ theme }: { theme: CertificateTheme }) {
  return (
    <>
      {/* Outer border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ border: `3px solid ${theme.borderColor}` }}
      />
      {/* Inner border with gap */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '6px',
          border: `1.5px solid ${theme.borderColor}`,
          opacity: 0.5,
        }}
      />
      {/* Gold accent line */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '10px',
          border: `0.5px solid ${theme.accentColor}`,
          opacity: 0.3,
        }}
      />
    </>
  )
}

function SolidBorder({ theme }: { theme: CertificateTheme }) {
  // Neon dark themes: use neon glow color for visible border
  if (theme.isDark && theme.neonGlow) {
    return (
      <>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: `1px solid ${theme.neonGlow}55`,
            boxShadow: `inset 0 0 25px ${theme.neonGlow}0A`,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            inset: '8px',
            border: `0.5px solid ${theme.neonGlow}28`,
          }}
        />
      </>
    )
  }
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ border: `2px solid ${theme.borderColor}` }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '8px',
          border: `0.5px solid ${theme.borderColor}`,
          opacity: 0.25,
        }}
      />
    </>
  )
}

function OrnateBorder({ theme }: { theme: CertificateTheme }) {
  // Neon dark themes: use neon glow color for visible ornate border
  if (theme.isDark && theme.neonGlow) {
    const glow = theme.neonGlow
    return (
      <>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: `2px solid ${glow}55`,
            boxShadow: `inset 0 0 30px ${glow}08`,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{ inset: '5px', border: `1px solid ${glow}33` }}
        />
        <div
          className="absolute pointer-events-none"
          style={{ inset: '9px', border: `1px double ${glow}25` }}
        />
        <div
          className="absolute pointer-events-none"
          style={{ inset: '14px', border: `0.5px solid ${glow}18` }}
        />
        {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => {
          const isTop = corner.includes('top')
          const isLeft = corner.includes('left')
          return (
            <div
              key={corner}
              className="absolute pointer-events-none"
              style={{
                [isTop ? 'top' : 'bottom']: '3px',
                [isLeft ? 'left' : 'right']: '3px',
                width: '28px',
                height: '28px',
                borderTop: isTop ? `2px solid ${glow}80` : 'none',
                borderBottom: !isTop ? `2px solid ${glow}80` : 'none',
                borderLeft: isLeft ? `2px solid ${glow}80` : 'none',
                borderRight: !isLeft ? `2px solid ${glow}80` : 'none',
                filter: `drop-shadow(0 0 3px ${glow}60)`,
              }}
            />
          )
        })}
      </>
    )
  }

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
        style={{ inset: '5px', border: `1px solid ${theme.borderColor}`, opacity: 0.6 }}
      />
      {/* Third layer — double effect */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '9px', border: `2px double ${theme.accentColor}`, opacity: 0.4 }}
      />
      {/* Innermost fine line */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: '14px', border: `0.5px solid ${theme.borderColor}`, opacity: 0.2 }}
      />
      {/* Corner accent marks */}
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => {
        const isTop = corner.includes('top')
        const isLeft = corner.includes('left')
        return (
          <div
            key={corner}
            className="absolute pointer-events-none"
            style={{
              [isTop ? 'top' : 'bottom']: '3px',
              [isLeft ? 'left' : 'right']: '3px',
              width: '24px',
              height: '24px',
              borderTop: isTop ? `2.5px solid ${theme.accentColor}` : 'none',
              borderBottom: !isTop ? `2.5px solid ${theme.accentColor}` : 'none',
              borderLeft: isLeft ? `2.5px solid ${theme.accentColor}` : 'none',
              borderRight: !isLeft ? `2.5px solid ${theme.accentColor}` : 'none',
              opacity: 0.5,
            }}
          />
        )
      })}
    </>
  )
}

function BorderRenderer({ borderStyle, theme }: { borderStyle: BorderStyle; theme: CertificateTheme }) {
  switch (borderStyle) {
    case 'double':
      return <DoubleBorder theme={theme} />
    case 'solid':
      return <SolidBorder theme={theme} />
    case 'ornate':
      return <OrnateBorder theme={theme} />
    default:
      return <DoubleBorder theme={theme} />
  }
}

// ─── Date Formatter ──────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// ─── Main Certificate Component ──────────────────────────────────────────────

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
    const formattedDate = formatDate(issuedDate)

    const isDark = theme.isDark ?? false
    const neonGlow = theme.neonGlow

    return (
      <div
        ref={ref}
        id="certificate-preview"
        className="certificate-font-db relative w-full overflow-hidden"
        style={{
          aspectRatio: '1.414 / 1',
          background: theme.bgGradient,
          maxWidth: '1200px',
          ...(isDark && neonGlow && {
            boxShadow: `0 0 35px ${neonGlow}28, 0 0 70px ${neonGlow}12`,
          }),
        }}
      >
        {/* ── Themed Border ── */}
        <BorderRenderer borderStyle={theme.borderStyle} theme={theme} />

        {/* ── SVG Pattern — Top-Right Corner ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            right: 0,
            width: '35%',
            height: '40%',
            backgroundImage: `url("${theme.patternSvg}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '120px 120px',
            opacity: isDark ? 0.8 : 0.5,
            maskImage: 'linear-gradient(135deg, transparent 10%, black 50%)',
            WebkitMaskImage: 'linear-gradient(135deg, transparent 10%, black 50%)',
          }}
        />

        {/* ── SVG Pattern — Bottom-Left Corner ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 0,
            left: 0,
            width: '35%',
            height: '40%',
            backgroundImage: `url("${theme.patternSvg}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '120px 120px',
            opacity: isDark ? 0.8 : 0.5,
            maskImage: 'linear-gradient(315deg, transparent 10%, black 50%)',
            WebkitMaskImage: 'linear-gradient(315deg, transparent 10%, black 50%)',
          }}
        />

        {/* ── Accent Line (top) ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '18px',
            left: '15%',
            right: '15%',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.accentColor}, transparent)`,
            opacity: isDark ? 0.45 : 0.25,
          }}
        />

        {/* ── Content Container — Safe Area 40px padding ── */}
        <div
          className="relative z-10 flex flex-col h-full"
          style={{ padding: '40px' }}
        >
          {/* ════════════════════════════════════════════════════════════════
              TOP ZONE — Logo + Academy Name + Certificate Title
              ════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col items-center" style={{ flex: '0 0 auto' }}>
            {/* Logo — SPU BUS */}
            <div
              className="relative flex items-center justify-center"
              style={{
                width: 'clamp(180px, 25vw, 320px)',
                height: 'clamp(40px, 6vw, 70px)',
                marginBottom: 'clamp(6px, 1vw, 12px)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl || '/images/spu-bus-logo.png'}
                alt="SPU BUS School of Business Administration"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Academy Name */}
            <p
              className="cert-text-academy text-center"
              style={{
                color: theme.headerColor,
                fontSize: 'clamp(12px, 1.8vw, 20px)',
              }}
            >
              AI SPUBUS Academy
            </p>

            {/* Subtitle — University */}
            <p
              className="cert-text-meta text-center"
              style={{
                color: theme.secondaryColor,
                fontSize: 'clamp(7px, 0.9vw, 11px)',
                opacity: 0.7,
                marginTop: '2px',
              }}
            >
              School of Business Administration, Sripatum University
            </p>

            {/* Certificate Title */}
            <h1
              className="cert-text-title text-center"
              style={{
                color: theme.headerColor,
                fontSize: 'clamp(16px, 2.8vw, 32px)',
                marginTop: 'clamp(8px, 1.5vw, 16px)',
              }}
            >
              Certificate of Completion
            </h1>

            {/* Thai Subtitle */}
            <p
              className="cert-text-body text-center"
              style={{
                color: theme.primaryColor,
                fontSize: 'clamp(9px, 1.4vw, 16px)',
                opacity: 0.75,
                marginTop: '2px',
              }}
            >
              ประกาศนียบัตร
            </p>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              CENTER ZONE — Student Name + Course Title
              ════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col items-center justify-center" style={{ flex: '1 1 auto', minHeight: 0 }}>
            {/* Decorative divider */}
            <div className="flex items-center justify-center w-full" style={{ marginBottom: 'clamp(6px, 1.2vw, 14px)' }}>
              <div
                style={{
                  width: 'clamp(40px, 8vw, 80px)',
                  height: '1px',
                  background: `linear-gradient(to right, transparent, ${theme.accentColor})`,
                  opacity: isDark ? 0.65 : 0.4,
                }}
              />
              <div
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: theme.accentColor,
                  opacity: isDark ? 0.8 : 0.5,
                  margin: '0 8px',
                  ...(isDark && neonGlow && {
                    boxShadow: `0 0 6px ${neonGlow}`,
                  }),
                }}
              />
              <div
                style={{
                  width: 'clamp(40px, 8vw, 80px)',
                  height: '1px',
                  background: `linear-gradient(to left, transparent, ${theme.accentColor})`,
                  opacity: isDark ? 0.65 : 0.4,
                }}
              />
            </div>

            {/* "This certifies that" */}
            <p
              className="cert-text-body text-center"
              style={{
                color: theme.textColor,
                fontSize: 'clamp(8px, 1.1vw, 13px)',
                opacity: 0.6,
                marginBottom: 'clamp(4px, 0.8vw, 8px)',
              }}
            >
              This certifies that
            </p>

            {/* Student Name — LARGEST */}
            <h2
              className="cert-text-student text-center"
              style={{
                color: theme.headerColor,
                fontSize: 'clamp(22px, 4vw, 48px)',
                paddingBottom: 'clamp(4px, 0.6vw, 8px)',
                paddingLeft: 'clamp(16px, 3vw, 40px)',
                paddingRight: 'clamp(16px, 3vw, 40px)',
                borderBottom: `2px solid ${theme.accentColor}`,
                display: 'inline-block',
                minWidth: '40%',
                ...(isDark && neonGlow && {
                  textShadow: `0 0 20px ${neonGlow}50`,
                }),
              }}
            >
              {studentName}
            </h2>

            {/* "has successfully completed the course" */}
            <p
              className="cert-text-body text-center"
              style={{
                color: theme.textColor,
                fontSize: 'clamp(8px, 1.1vw, 13px)',
                opacity: 0.6,
                marginTop: 'clamp(6px, 1vw, 12px)',
                marginBottom: 'clamp(4px, 0.6vw, 6px)',
              }}
            >
              has successfully completed the course
            </p>

            {/* Course Title — Second Largest */}
            <h3
              className="cert-text-course text-center"
              style={{
                color: theme.primaryColor,
                fontSize: 'clamp(14px, 2.2vw, 26px)',
                maxWidth: '80%',
              }}
            >
              {courseName}
            </h3>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              BOTTOM ZONE — 3-Column: Date | Signature | Cert ID + QR
              ════════════════════════════════════════════════════════════════ */}
          <div
            className="grid items-end"
            style={{
              flex: '0 0 auto',
              gridTemplateColumns: '1fr 1.2fr 1fr',
              gap: 'clamp(8px, 1.5vw, 20px)',
              marginTop: 'auto',
            }}
          >
            {/* ── Left Column: Completion Date ── */}
            <div className="text-left">
              <p
                className="cert-text-meta"
                style={{
                  color: theme.textColor,
                  fontSize: 'clamp(6px, 0.8vw, 9px)',
                  opacity: 0.5,
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Completion Date
              </p>
              <p
                className="cert-text-body"
                style={{
                  color: theme.textColor,
                  fontSize: 'clamp(8px, 1.1vw, 13px)',
                  opacity: 0.8,
                }}
              >
                {formattedDate}
              </p>
            </div>

            {/* ── Center Column: Signature ── */}
            <div className="flex flex-col items-center">
              {/* Signature image */}
              {signatureUrl && (
                <div className="relative mx-auto" style={{ width: '100px', height: '36px', marginBottom: '4px' }}>
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
                style={{
                  width: 'clamp(120px, 20vw, 220px)',
                  height: '1px',
                  background: isDark ? theme.accentColor : theme.primaryColor,
                  opacity: isDark ? 0.55 : 0.4,
                }}
              />

              {/* Signer name */}
              <p
                className="cert-text-signer text-center"
                style={{
                  color: theme.headerColor,
                  fontSize: 'clamp(8px, 1.1vw, 13px)',
                  marginTop: '6px',
                }}
              >
                {signerName}
              </p>

              {/* Signer title */}
              <p
                className="cert-text-body text-center"
                style={{
                  color: theme.textColor,
                  fontSize: 'clamp(6px, 0.85vw, 10px)',
                  opacity: 0.55,
                  marginTop: '1px',
                }}
              >
                {signerTitle}
              </p>
            </div>

            {/* ── Right Column: Certificate ID + QR ── */}
            <div className="flex flex-col items-end">
              {/* Certificate ID label */}
              <p
                className="cert-text-meta text-right"
                style={{
                  color: theme.textColor,
                  fontSize: 'clamp(6px, 0.8vw, 9px)',
                  opacity: 0.5,
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Certificate ID
              </p>

              {/* Certificate code */}
              <p
                className="text-right"
                style={{
                  color: theme.textColor,
                  fontSize: 'clamp(6px, 0.8vw, 9px)',
                  opacity: 0.5,
                  fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
                  letterSpacing: '0.05em',
                }}
              >
                {certificateCode}
              </p>

              {/* QR Code */}
              {verificationUrl && (
                <div className="flex flex-col items-center" style={{ marginTop: '6px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}`}
                    alt="QR Verification"
                    style={{
                      width: 'clamp(50px, 8vw, 100px)',
                      height: 'clamp(50px, 8vw, 100px)',
                      borderRadius: '4px',
                      ...(isDark && neonGlow && {
                        outline: `1px solid ${neonGlow}40`,
                        outlineOffset: '2px',
                      }),
                    }}
                  />
                  <span
                    className="cert-text-meta"
                    style={{
                      color: theme.textColor,
                      fontSize: 'clamp(5px, 0.65vw, 8px)',
                      opacity: 0.4,
                      marginTop: '3px',
                    }}
                  >
                    Verify Certificate
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Accent Line (bottom) ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '18px',
            left: '15%',
            right: '15%',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${theme.accentColor}, transparent)`,
            opacity: isDark ? 0.45 : 0.25,
          }}
        />
      </div>
    )
  }
)

CertificatePreview.displayName = 'CertificatePreview'

export default CertificatePreview
