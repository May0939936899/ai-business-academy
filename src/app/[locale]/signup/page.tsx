'use client'

import { Suspense, useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  AlertCircle,
  Sparkles,
  Loader2,
  Mail,
  Eye,
  EyeOff,
  Lock,
  User,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

function SignupContent() {
  const router = useRouter()
  const { status } = useSession()
  const locale = useLocale()

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  // If already logged in → redirect
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(`/${locale}/dashboard`)
    }
  }, [status, router, locale])

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    await signIn('google', { callbackUrl: `/${locale}/dashboard` })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!fullName.trim()) newErrors.fullName = 'กรุณากรอกชื่อ-นามสกุล'
    if (!email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    }
    if (!password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน'
    } else if (password.length < 8) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
    }
    if (!acceptTerms) newErrors.acceptTerms = 'กรุณายอมรับเงื่อนไขการใช้งาน'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          acceptTerms,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setGlobalError(data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        }
        setIsLoading(false)
        return
      }

      // Success — auto sign-in
      setIsSuccess(true)
      const result = await signIn('user-credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        // Sign-in failed but account was created → go to login
        router.push(`/${locale}/login`)
      } else {
        // Sign-in succeeded → go to complete-profile
        router.push(`/${locale}/complete-profile`)
        router.refresh()
      }
    } catch {
      setGlobalError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
        </div>
        <p className="text-lg font-semibold text-white">สมัครสมาชิกสำเร็จ!</p>
        <p className="text-sm text-gray-400">กำลังนำคุณเข้าสู่ระบบ...</p>
        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md">
      <div
        className={cn(
          'rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl',
          'shadow-2xl shadow-black/20'
        )}
      >
        {/* Header */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">สมัครสมาชิก</h1>
          <p className="mt-1.5 text-sm text-gray-400">
            AI Business Academy — เรียนฟรี รับ Certificate
          </p>
        </div>

        {/* Global error */}
        {globalError && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-300">
              ชื่อ-นามสกุล
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (errors.fullName) setErrors((p) => ({ ...p, fullName: '' }))
                }}
                placeholder="กรอกชื่อ-นามสกุลของคุณ"
                autoFocus
                autoComplete="name"
                className={cn(
                  'w-full rounded-xl border bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all',
                  errors.fullName
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20'
                )}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
              อีเมล
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((p) => ({ ...p, email: '' }))
                }}
                placeholder="example@email.com"
                autoComplete="email"
                className={cn(
                  'w-full rounded-xl border bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all',
                  errors.email
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20'
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
              รหัสผ่าน
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((p) => ({ ...p, password: '' }))
                }}
                placeholder="อย่างน้อย 8 ตัวอักษร"
                autoComplete="new-password"
                className={cn(
                  'w-full rounded-xl border bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm text-white placeholder-gray-500 outline-none transition-all',
                  errors.password
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-300">
              ยืนยันรหัสผ่าน
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' }))
                }}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                autoComplete="new-password"
                className={cn(
                  'w-full rounded-xl border bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm text-white placeholder-gray-500 outline-none transition-all',
                  errors.confirmPassword
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-white/[0.08] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20'
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Accept Terms */}
          <div>
            <label className="flex cursor-pointer items-start gap-3 select-none">
              <div className="relative mt-0.5 flex shrink-0 items-center">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked)
                    if (errors.acceptTerms) setErrors((p) => ({ ...p, acceptTerms: '' }))
                  }}
                  className="sr-only"
                />
                <div
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded border transition-all',
                    acceptTerms
                      ? 'border-blue-500 bg-blue-500'
                      : errors.acceptTerms
                        ? 'border-red-500/50 bg-white/[0.04]'
                        : 'border-white/20 bg-white/[0.04]'
                  )}
                >
                  {acceptTerms && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path
                        d="M1 4l3 3 5-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm leading-relaxed text-gray-400">
                ฉันยอมรับ{' '}
                <a href="/terms" target="_blank" className="text-blue-400 underline hover:text-blue-300">
                  เงื่อนไขการใช้งาน
                </a>{' '}
                และ{' '}
                <a href="/privacy" target="_blank" className="text-blue-400 underline hover:text-blue-300">
                  นโยบายความเป็นส่วนตัว
                </a>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.acceptTerms}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200',
              'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600',
              'shadow-lg shadow-blue-500/20',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'สมัครสมาชิก'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-xs text-gray-500">หรือ</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        {/* Google Sign-Up */}
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200',
            'bg-white text-gray-800 hover:bg-gray-100',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'shadow-lg shadow-white/10'
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          ) : (
            <>
              <GoogleIcon />
              สมัครด้วย Gmail
            </>
          )}
        </button>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          มีบัญชีแล้ว?{' '}
          <Link
            href={`/${locale}/login`}
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            เข้าสู่ระบบ
          </Link>
        </p>

        {/* Bottom divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-xs text-gray-600">คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        }
      >
        <SignupContent />
      </Suspense>
    </div>
  )
}
