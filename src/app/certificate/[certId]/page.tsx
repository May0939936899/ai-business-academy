import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import CertificatePageClient from './CertificatePageClient'

interface PageProps {
  params: { certId: string }
}

// ─── Open Graph Metadata ──────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { certId } = await params

  const certificate = await db.certificate.findFirst({
    where: {
      OR: [
        { certificateCode: certId },
        { id: certId },
      ],
    },
    include: {
      user: { select: { fullName: true } },
      course: { select: { title: true } },
    },
  })

  if (!certificate) {
    return { title: 'Certificate Not Found | AI Business Academy' }
  }

  const title = `Certificate - ${certificate.user.fullName} | AI Business Academy`
  const description = `${certificate.user.fullName} ได้รับ Certificate จากหลักสูตร "${certificate.course.title}" โดย AI Business Academy คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม`
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-academy-lime.vercel.app'
  const verifyUrl = `${baseUrl}/verify/${certificate.certificateCode}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: verifyUrl,
      siteName: 'AI Business Academy',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function CertificatePage({ params }: PageProps) {
  const { certId } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // certId can be a certificateCode (e.g., SPUBUS-AIHR-2026-0001) or a DB id
  const certificate = await db.certificate.findFirst({
    where: {
      OR: [
        { certificateCode: certId },
        { id: certId },
      ],
      userId: user.id,
    },
    include: {
      user: { select: { id: true, fullName: true, email: true } },
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

  if (!certificate) notFound()

  // Fetch global certificate settings (fallback defaults)
  const settings = await db.certificateSettings.findFirst() ?? {
    logoUrl: null,
    signatureUrl: null,
    signerName: 'ผศ.ดร.รวิภา อัครจินดานนท์',
    signerTitle: 'คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม',
    defaultThemeId: 'executive-navy',
    enabledThemes: [
      'executive-navy',
      'royal-blue-data',
      'elegant-gold',
      'minimal-white',
      'academic-crimson',
      'ai-circuit',
      'business-flow',
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
    user: certificate.user,
    course: certificate.course,
  }

  const settingsData = {
    logoUrl: settings.logoUrl,
    signatureUrl: settings.signatureUrl,
    signerName: settings.signerName,
    signerTitle: settings.signerTitle,
    defaultThemeId: settings.defaultThemeId,
    enabledThemes: settings.enabledThemes,
  }

  return (
    <CertificatePageClient
      certificate={certificateData}
      settings={settingsData}
      formattedDate={formattedDate}
    />
  )
}
