'use client'

import { Suspense, useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const t = useTranslations('login')
  const locale = useLocale()
  const callbackUrl = searchParams.get('callbackUrl')
  const errorParam = searchParams.get('error')

  const [isLoading, setIsLoading] = useState(false)

  // If already logged in, redirect
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if (callbackUrl) {
        router.push(callbackUrl)
      } else if (session.user.role === 'ADMIN') {
        router.push(`/${locale}/admin`)
      } else {
        router.push(`/${locale}/dashboard`)
      }
    }
  }, [status, session, router, callbackUrl, locale])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn('google', {
      callbackUrl: callbackUrl || `/${locale}/dashboard`,
    })
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (status === 'authenticated') {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-400">{t('redirecting')}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-sm">
      <div
        className={cn(
          'rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl',
          'shadow-2xl shadow-black/20'
        )}
      >
        {/* Logo */}
        <div className="mb-5 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sbs-logo.png"
            alt="SBS School of Business Administration"
            className="h-12 sm:h-14 object-contain"
          />
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold text-white">AI Business Academy</h1>
          <p className="mt-1.5 text-xs text-gray-400">
            เข้าสู่ระบบหรือสมัครสมาชิกด้วย Google
          </p>
        </div>

        {/* Error */}
        {errorParam && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {errorParam === 'OAuthAccountNotLinked'
              ? t('errors.accountLinked')
              : errorParam === 'suspended'
                ? t('errors.suspended')
                : t('errors.default')}
          </div>
        )}

        {/* Google Sign-In — the only way */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200',
            'bg-white text-gray-800 hover:bg-gray-50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'shadow-md hover:shadow-lg'
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              เข้าสู่ระบบด้วย Google
            </>
          )}
        </button>

        {/* Info text */}
        <p className="mt-5 text-center text-[11px] leading-relaxed text-gray-500">
          หากยังไม่มีบัญชี ระบบจะสมัครสมาชิกให้อัตโนมัติ<br />
          เมื่อเข้าสู่ระบบด้วย Google เป็นครั้งแรก
        </p>

        {/* Divider */}
        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[10px] text-gray-600">คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  )
}
