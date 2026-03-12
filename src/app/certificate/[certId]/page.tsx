import { notFound, redirect } from 'next/navigation'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import CertificatePageClient from './CertificatePageClient'

interface PageProps {
  params: { certId: string }
}

export default async function CertificatePage({ params }: PageProps) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // certId can be a certificateCode (e.g., SPUBUS-AIHR-2026-0001) or a DB id
  const certificate = await db.certificate.findFirst({
    where: {
      OR: [
        { certificateCode: params.certId },
        { id: params.certId },
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
    defaultThemeId: 'royal-blue',
    enabledThemes: [
      'royal-blue',
      'executive-navy',
      'elegant-gold',
      'modern-cyan',
      'academic-crimson',
      'premium-purple',
      'minimal-bw',
    ],
  }

  const formattedDate = formatDate(certificate.issuedAt)

  // Serialize for client component
  const certificateData = {
    id: certificate.id,
    certificateCode: certificate.certificateCode,
    themeId: certificate.themeId,
    issuedAt: certificate.issuedAt.toISOString(),
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
