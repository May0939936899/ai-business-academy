import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import { getLocale } from 'next-intl/server'
import CertificatePageClient from './CertificatePageClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ certId: string; locale: string }>
}

// ─── Open Graph Metadata ──────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { certId } = await params

  try {
    const certificate = await db.certificate.findFirst({
      where: {
        OR: [
          { certificateCode: certId },
          { id: certId },
        ],
      },
      include: {
        user: { select: { fullName: true, fullNameForCertificate: true } },
        course: { select: { title: true } },
      },
    })

    if (!certificate) {
      return { title: 'Certificate Not Found | AI SPUBUS Academy' }
    }

    const displayName = certificate.user.fullNameForCertificate || certificate.user.fullName
    const title = `Certificate - ${displayName} | AI SPUBUS Academy`
    const description = `${displayName} ได้รับ Certificate จากหลักสูตร "${certificate.course.title}" โดย AI SPUBUS Academy คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม`
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-academy-lime.vercel.app'
    const verifyUrl = `${baseUrl}/verify/${certificate.certificateCode}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: verifyUrl,
        siteName: 'AI SPUBUS Academy',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    }
  } catch (error) {
    console.error('Certificate metadata error:', error)
    return { title: 'Certificate | AI SPUBUS Academy' }
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function CertificatePage({ params }: PageProps) {
  const { certId } = await params
  const user = await getCurrentUser()
  const locale = await getLocale()
  if (!user) redirect(`/${locale}/login`)

  // certId can be a certificateCode (e.g., SPUBUS-AIHR-2026-0001) or a DB id
  // Allow any authenticated user to view (so shared links work)
  let certificate
  try {
    certificate = await db.certificate.findFirst({
      where: {
        OR: [
          { certificateCode: certId },
          { id: certId },
        ],
      },
      include: {
        user: { select: { id: true, fullName: true, fullNameForCertificate: true, email: true } },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            certificateTemplate: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('Certificate DB query error:', error)
  }

  if (!certificate) notFound()

  // Fetch global certificate settings (fallback defaults)
  let settings
  try {
    settings = await db.certificateSettings.findFirst()
  } catch (error) {
    console.error('CertificateSettings query error:', error)
  }

  const effectiveSettings = settings ?? {
    logoUrl: null as string | null,
    signatureUrl: null as string | null,
    signerName: 'ผศ.ดร.รวิภา อัครจินดานนท์',
    signerTitle: 'คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม',
    defaultThemeId: 'royal-blue',
    enabledThemes: [
      'royal-blue',
      'sky-gradient',
      'navy-executive',
      'ocean-tech',
      'pure-white',
      'blue-white',
      'blue-gold',
      'pink-blue-pastel',
      'blue-purple-pastel',
      'neon-sapphire',
      'midnight-azure',
    ],
  }

  const formattedDate = formatDate(certificate.completionDate)

  // Serialize dates as ISO strings for client component
  const certificateData = {
    id: certificate.id,
    certificateCode: certificate.certificateCode,
    themeId: certificate.themeId,
    issuedAt: certificate.issuedAt.toISOString(),
    completionDate: certificate.completionDate.toISOString(),
    user: {
      ...certificate.user,
      fullName: certificate.user.fullNameForCertificate || certificate.user.fullName,
    },
    course: {
      id: certificate.course.id,
      title: certificate.course.title,
      slug: certificate.course.slug,
      certificateTemplate: certificate.course.certificateTemplate
        ? {
            logoUrl: certificate.course.certificateTemplate.logoUrl,
            signatureUrl: certificate.course.certificateTemplate.signatureUrl,
            signerName: certificate.course.certificateTemplate.signerName,
            signerTitle: certificate.course.certificateTemplate.signerTitle,
            backgroundTemplate: certificate.course.certificateTemplate.backgroundTemplate,
          }
        : null,
    },
  }

  const settingsData = {
    logoUrl: effectiveSettings.logoUrl,
    signatureUrl: effectiveSettings.signatureUrl,
    signerName: effectiveSettings.signerName,
    signerTitle: effectiveSettings.signerTitle,
    defaultThemeId: effectiveSettings.defaultThemeId,
    enabledThemes: effectiveSettings.enabledThemes,
  }

  return (
    <CertificatePageClient
      certificate={certificateData}
      settings={settingsData}
      formattedDate={formattedDate}
    />
  )
}
