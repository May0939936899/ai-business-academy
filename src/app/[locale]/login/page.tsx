'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type TabMode = 'login' | 'register'

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const t = useTranslations('login')
  const locale = useLocale()
  const callbackUrl = searchParams.get('callbackUrl')
  const errorParam = searchParams.get('error')

  // If suspended error param, redirect to account-status page
  useEffect(() => {
    if (errorParam === 'suspended') {
      router.replace(`/${locale}/account-status?reason=suspended`)
    }
  }, [errorParam, router, locale])

  const [tab, setTab] = useState<TabMode>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [successMsg, setSuccessMsg] = useState('')

  // Login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Register fields
  const [regName, setRegName] = useState('')
  const [regCertName, setRegCertName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirm, setShowRegConfirm] = useState(false)

  // Prevent race condition: once we start redirecting, block other redirects
  const isRedirecting = useRef(false)

  // If already logged in, redirect
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !isRedirecting.current) {
      isRedirecting.current = true
      if (callbackUrl) {
        router.push(callbackUrl)
      } else if (!session.user.isProfileCompleted) {
        router.push(`/${locale}/complete-profile`)
      } else if (session.user.role === 'ADMIN') {
        router.push(`/${locale}/admin`)
      } else {
        router.push(`/${locale}/dashboard`)
      }
    }
  }, [status, session, router, callbackUrl, locale])

  // Clear errors when switching tabs
  useEffect(() => {
    setError('')
    setFieldErrors({})
    setSuccessMsg('')
  }, [tab])

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError('')
    try {
      await signIn('google', {
        callbackUrl: callbackUrl || `/${locale}/dashboard`,
      })
    } catch {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google')
      setIsGoogleLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    // Validate
    const errs: Record<string, string> = {}
    const emailVal = email.trim().toLowerCase()
    if (!emailVal) {
      errs.email = 'กรุณากรอกอีเมล'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      errs.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    }
    if (!password) {
      errs.password = 'กรุณากรอกรหัสผ่าน'
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      return
    }

    setIsLoading(true)
    try {
      const result = await signIn('user-credentials', {
        email: emailVal,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
        } else {
          setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
        }
        setIsLoading(false)
      } else if (result?.ok) {
        isRedirecting.current = true
        // Wait briefly for session to refresh, then redirect
        // The useEffect will handle the redirect once session is authenticated
        router.push(callbackUrl || `/${locale}/dashboard`)
        router.refresh()
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    // Client-side validation (must match server-side)
    const errs: Record<string, string> = {}
    if (!regName.trim()) errs.fullName = 'กรุณากรอกชื่อ-นามสกุล'

    const emailVal = regEmail.trim().toLowerCase()
    if (!emailVal) {
      errs.email = 'กรุณากรอกอีเมล'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      errs.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    }

    if (!regPassword) {
      errs.password = 'กรุณากรอกรหัสผ่าน'
    } else if (regPassword.length < 6) {
      errs.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    }

    if (!regConfirm) {
      errs.confirmPassword = 'กรุณายืนยันรหัสผ่าน'
    } else if (regPassword !== regConfirm) {
      errs.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      return
    }

    setIsLoading(true)
    try {
      // Step 1: Register
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regName.trim(),
          fullNameForCertificate: regCertName.trim() || regName.trim(),
          email: emailVal,
          password: regPassword,
          confirmPassword: regConfirm,
          acceptTerms: true,
        }),
      })
      const data = await res.json()

      if (!data.success) {
        if (data.errors) {
          setFieldErrors(data.errors)
        } else {
          setError(data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
        }
        setIsLoading(false)
        return
      }

      // Step 2: Auto sign-in after successful registration
      const signInResult = await signIn('user-credentials', {
        email: emailVal,
        password: regPassword,
        redirect: false,
      })

      if (signInResult?.ok) {
        isRedirecting.current = true
        router.push(`/${locale}/complete-profile`)
        router.refresh()
      } else {
        // Fallback: registration succeeded but auto-login failed
        // Switch to login tab with pre-filled email
        setTab('login')
        setEmail(regEmail)
        setPassword('')
        setSuccessMsg('สมัครสำเร็จ! กรุณาเข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่ตั้งไว้')
        setIsLoading(false)
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setIsLoading(false)
    }
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
    <div className="relative w-full max-w-[420px]">
      <div
        className={cn(
          'rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 sm:p-10 backdrop-blur-xl',
          'shadow-2xl shadow-black/30'
        )}
      >
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI
            </span>{' '}
            <span className="text-white">Business</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Academy
            </span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
          <button
            type="button"
            onClick={() => setTab('register')}
            className={cn(
              'flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200',
              tab === 'register'
                ? 'bg-white/[0.1] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            สมัครสมาชิก
          </button>
          <button
            type="button"
            onClick={() => setTab('login')}
            className={cn(
              'flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200',
              tab === 'login'
                ? 'bg-white/[0.1] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            เข้าสู่ระบบ
          </button>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error */}
        {(error || errorParam) && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {error ||
                (errorParam === 'OAuthAccountNotLinked'
                  ? t('errors.accountLinked')
                  : errorParam === 'suspended'
                    ? t('errors.suspended')
                    : t('errors.default'))}
            </span>
          </div>
        )}

        {/* ── Login Form ── */}
        {tab === 'login' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Gmail / Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                autoComplete="email"
                className={cn(
                  'w-full rounded-xl border py-3 px-4 text-sm transition-all',
                  'bg-white/[0.04] text-white placeholder-gray-500',
                  fieldErrors.email
                    ? 'border-red-500/50 focus:border-red-500/70'
                    : 'border-white/[0.08] focus:border-blue-500/50',
                  'focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
                )}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  autoComplete="current-password"
                  className={cn(
                    'w-full rounded-xl border py-3 pl-4 pr-11 text-sm transition-all',
                    'bg-white/[0.04] text-white placeholder-gray-500',
                    fieldErrors.password
                      ? 'border-red-500/50 focus:border-red-500/70'
                      : 'border-white/[0.08] focus:border-blue-500/50',
                    'focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200',
                'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
                'shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]'
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>
          </form>
        )}

        {/* ── Register Form ── */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                ชื่อ - นามสกุล
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="กรอกชื่อ-นามสกุล"
                autoComplete="name"
                className={cn(
                  'w-full rounded-xl border py-3 px-4 text-sm transition-all',
                  'bg-white/[0.04] text-white placeholder-gray-500',
                  fieldErrors.fullName
                    ? 'border-red-500/50 focus:border-red-500/70'
                    : 'border-white/[0.08] focus:border-blue-500/50',
                  'focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
                )}
              />
              {fieldErrors.fullName && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Certificate Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                ชื่อที่แสดงบน Certificate
              </label>
              <input
                type="text"
                value={regCertName}
                onChange={(e) => setRegCertName(e.target.value)}
                placeholder="ชื่อ-นามสกุล สำหรับใบประกาศนียบัตร"
                className={cn(
                  'w-full rounded-xl border py-3 px-4 text-sm transition-all',
                  'bg-white/[0.04] text-white placeholder-gray-500',
                  'border-white/[0.08] focus:border-blue-500/50',
                  'focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
                )}
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Gmail / Email
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="example@gmail.com"
                autoComplete="email"
                className={cn(
                  'w-full rounded-xl border py-3 px-4 text-sm transition-all',
                  'bg-white/[0.04] text-white placeholder-gray-500',
                  fieldErrors.email
                    ? 'border-red-500/50 focus:border-red-500/70'
                    : 'border-white/[0.08] focus:border-blue-500/50',
                  'focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
                )}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  autoComplete="new-password"
                  className={cn(
                    'w-full rounded-xl border py-3 pl-4 pr-11 text-sm transition-all',
                    'bg-white/[0.04] text-white placeholder-gray-500',
                    fieldErrors.password
                      ? 'border-red-500/50 focus:border-red-500/70'
                      : 'border-white/[0.08] focus:border-blue-500/50',
                    'focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showRegConfirm ? 'text' : 'password'}
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="ยืนยันรหัสผ่าน"
                  autoComplete="new-password"
                  className={cn(
                    'w-full rounded-xl border py-3 pl-4 pr-11 text-sm transition-all',
                    'bg-white/[0.04] text-white placeholder-gray-500',
                    fieldErrors.confirmPassword
                      ? 'border-red-500/50 focus:border-red-500/70'
                      : 'border-white/[0.08] focus:border-blue-500/50',
                    'focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirm(!showRegConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showRegConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200',
                'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
                'shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]'
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'สมัครสมาชิก'
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[11px] text-gray-500">หรือ</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-xl border px-6 py-3 text-sm font-medium transition-all duration-200',
            'border-white/[0.1] bg-white/[0.03] text-gray-300 hover:bg-white/[0.06] hover:text-white',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]'
          )}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
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

        {/* Footer */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.04]" />
          <span className="text-[10px] text-gray-600">คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม</span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-blue-500/[0.07] blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-[100px]" />
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
