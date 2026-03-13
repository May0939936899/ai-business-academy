import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Award,
  ShieldCheck,
  Calendar,
  User,
  BookOpen,
  CheckCircle2,
  XCircle,
  Home,
} from 'lucide-react'
import db from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { getTranslations, getLocale } from 'next-intl/server'

interface PageProps {
  params: { certCode: string }
}

export default async function VerifyCertificatePage({ params }: PageProps) {
  const t = await getTranslations('verify')
  const tc = await getTranslations('certificate')
  const locale = await getLocale()

  const certificate = await db.certificate.findUnique({
    where: { certificateCode: params.certCode },
    include: {
      user: { select: { fullName: true } },
      course: {
        select: {
          title: true,
          slug: true,
          certificateTemplate: true,
        },
      },
    },
  })

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#030712]">
        <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-white">{t('notFoundTitle')}</h1>
          <p className="mb-8 text-gray-400">
            {t('notFoundDesc')}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110"
          >
            <Home className="h-4 w-4" />
            {t('backHome')}
          </Link>
        </div>
      </div>
    )
  }

  const template = certificate.course.certificateTemplate
  const issuedDate = formatDate(certificate.issuedAt)

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Verified Banner */}
        <div className="mb-8 flex items-center justify-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 px-6 py-4">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
          <div>
            <p className="font-semibold text-green-400">&#10003; {t('validBanner')}</p>
            <p className="text-sm text-gray-400">
              {t('validBannerDesc')}
            </p>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-500 p-[2px]">
            <div className="h-full w-full rounded-3xl bg-[#0a1628]" />
          </div>

          <div className="relative p-1">
            <div className="rounded-[22px] bg-[#0a1628] p-8 sm:p-12">
              {/* Header */}
              <div className="mb-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <Award className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
                  Certificate of Completion
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t('certificateTitle')}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {t('certificateSubtitle')}
                </p>
              </div>

              <div className="mx-auto mb-10 h-px w-48 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

              {/* Body */}
              <div className="mb-10 text-center">
                <p className="mb-2 text-sm text-gray-400">{tc('presentedTo')}</p>
                <h2 className="mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                  {certificate.user.fullName}
                </h2>
                <p className="mb-2 text-sm text-gray-400">{t('completedCourse')}</p>
                <h3 className="mb-8 text-xl font-semibold text-white sm:text-2xl">
                  {certificate.course.title}
                </h3>

                <div className="mx-auto grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <Calendar className="mx-auto mb-2 h-5 w-5 text-gray-500" />
                    <p className="text-xs text-gray-500">{t('completionDate')}</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">{issuedDate}</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <User className="mx-auto mb-2 h-5 w-5 text-gray-500" />
                    <p className="text-xs text-gray-500">{t('student')}</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">
                      {certificate.user.fullName}
                    </p>
                  </div>
                  <div className="col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:col-span-1">
                    <BookOpen className="mx-auto mb-2 h-5 w-5 text-gray-500" />
                    <p className="text-xs text-gray-500">{t('course')}</p>
                    <p className="mt-1 text-sm font-medium text-gray-200">
                      {certificate.course.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature */}
              {template && (
                <div className="mb-8 text-center">
                  <div className="mx-auto w-48 border-b border-white/[0.2] pb-2">
                    <div className="h-12" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">{template.signerName}</p>
                  <p className="text-xs text-gray-500">{template.signerTitle}</p>
                </div>
              )}

              {/* Certificate Code */}
              <div className="mb-6 text-center">
                <p className="text-xs text-gray-500">{t('certCodeLabel')}</p>
                <p className="mt-1 font-mono text-lg font-bold tracking-widest text-blue-400">
                  {certificate.certificateCode}
                </p>
              </div>

              <div className="mx-auto h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>{t('verifiedBy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer — Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <Home className="h-4 w-4" />
            {t('backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
