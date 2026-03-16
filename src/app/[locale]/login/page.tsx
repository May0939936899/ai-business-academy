'use client'

import { Suspense, useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { AlertCircle, Loader2, Mail, Eye, EyeOff, Lock, LogIn } from 'lucide-react'
import Link from 'next/link'
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

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

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('กรุณากรอกอีเมล')
      return
    }
    if (!password.trim()) {
      setError('กรุณากรอกรหัสผ่าน')
      return
    }

    setIsLoading(true)

    const result = await signIn('user-credentials', {
      email: email.trim(),
      password: password.trim(),
      redirect: false,
    })

    if (result?.error) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      setIsLoading(false)
      return
    }

    router.push(callbackUrl || `/${locale}/dashboard`)
    router.refresh()
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
        {/* Header — compact */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-white">เข้าสู่ระบบ</h1>
          <p className="mt-1 text-xs text-gray-400">AI Business Academy</p>
        </div>

        {/* Error */}
        {(error || errorParam) && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error ||
              (errorParam === 'OAuthAccountNotLinked'
                ? t('errors.accountLinked')
                : errorParam === 'suspended'
                  ? t('errors.suspended')
                  : t('errors.default'))}
          </div>
        )}

        {/* Google Sign-In — primary action */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200',
            'bg-white text-gray-800 hover:bg-gray-100',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'shadow-md'
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

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-xs text-gray-500">หรือใช้อีเมล</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        {/* Email + Password — single form */}
        <form onSubmit={handlePasswordSignIn} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="อีเมล"
              autoComplete="email"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="รหัสผ่าน"
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-11 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200',
              'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600',
              'shadow-lg shadow-blue-500/20',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                เข้าสู่ระบบ
              </>
            )}
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-5 text-center text-sm text-gray-400">
          ยังไม่มีบัญชี?{' '}
          <Link
            href={`/${locale}/signup`}
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            สมัครสมาชิก
          </Link>
        </p>
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
