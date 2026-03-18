'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { ShieldAlert, LogOut, Mail, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type AccountIssue = 'suspended' | 'inactive' | 'unknown'

const STATUS_CONFIG: Record<
  AccountIssue,
  { title: string; description: string; icon: typeof ShieldAlert; color: string }
> = {
  suspended: {
    title: 'บัญชีถูกระงับ',
    description:
      'บัญชีของคุณถูกระงับการใช้งานชั่วคราว หากคุณเชื่อว่าเป็นข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบเพื่อขอรายละเอียดเพิ่มเติม',
    icon: ShieldAlert,
    color: 'red',
  },
  inactive: {
    title: 'บัญชีไม่ได้ใช้งาน',
    description:
      'บัญชีของคุณถูกปิดการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบหากต้องการเปิดใช้งานอีกครั้ง',
    icon: ShieldAlert,
    color: 'yellow',
  },
  unknown: {
    title: 'ไม่สามารถเข้าสู่ระบบได้',
    description: 'เกิดปัญหากับบัญชีของคุณ กรุณาติดต่อผู้ดูแลระบบ',
    icon: ShieldAlert,
    color: 'gray',
  },
}

export default function AccountStatusPage() {
  const searchParams = useSearchParams()
  const { status: sessionStatus } = useSession()
  const locale = useLocale()
  const reasonParam = searchParams.get('reason') as AccountIssue | null
  const [isSigningOut, setIsSigningOut] = useState(false)

  const reason: AccountIssue = reasonParam && reasonParam in STATUS_CONFIG ? reasonParam : 'suspended'
  const config = STATUS_CONFIG[reason]
  const Icon = config.icon

  const colorMap = {
    red: {
      iconBg: 'bg-red-500/15',
      iconColor: 'text-red-400',
      border: 'border-red-500/20',
      badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    },
    yellow: {
      iconBg: 'bg-yellow-500/15',
      iconColor: 'text-yellow-400',
      border: 'border-yellow-500/20',
      badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    },
    gray: {
      iconBg: 'bg-gray-500/15',
      iconColor: 'text-gray-400',
      border: 'border-gray-500/20',
      badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    },
  }

  const colors = colorMap[config.color as keyof typeof colorMap]

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ callbackUrl: `/${locale}/login` })
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-red-500/[0.04] blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-orange-500/[0.03] blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div
          className={cn(
            'rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 sm:p-10 backdrop-blur-xl',
            'shadow-2xl shadow-black/30 text-center'
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              'mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl',
              colors.iconBg
            )}
          >
            <Icon className={cn('h-10 w-10', colors.iconColor)} />
          </div>

          {/* Status Badge */}
          <div
            className={cn(
              'mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
              colors.badge
            )}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                  config.color === 'red' ? 'bg-red-400' : config.color === 'yellow' ? 'bg-yellow-400' : 'bg-gray-400'
                )}
              />
              <span
                className={cn(
                  'relative inline-flex h-2 w-2 rounded-full',
                  config.color === 'red' ? 'bg-red-500' : config.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-500'
                )}
              />
            </span>
            {reason === 'suspended' ? 'Suspended' : reason === 'inactive' ? 'Inactive' : 'Issue'}
          </div>

          {/* Title & Description */}
          <h1 className="mb-3 text-2xl font-bold text-white">{config.title}</h1>
          <p className="mb-8 text-sm leading-relaxed text-gray-400">{config.description}</p>

          {/* Actions */}
          <div className="space-y-3">
            {/* Contact Admin */}
            <a
              href="mailto:ai-business@spu.ac.th"
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200',
                'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600',
                'shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30',
                'hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]'
              )}
            >
              <Mail className="h-4 w-4" />
              ติดต่อผู้ดูแลระบบ
            </a>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all duration-200',
                'border-white/[0.1] bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-white',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  ออกจากระบบ / เปลี่ยนบัญชี
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.04]" />
            <span className="text-[10px] text-gray-600">AI SPUBUS Academy</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </div>
  )
}
