'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  FileQuestion,
  Users,
  Award,
  BarChart3,
  Globe,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Sparkles,
  Loader2,
  ShieldAlert,
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const t = useTranslations('admin')
  const locale = useLocale()

  // If on admin login page, render children directly (no sidebar/auth)
  const cleanPath = pathname.replace(`/${locale}`, '')
  if (cleanPath === '/admin/login') {
    return <>{children}</>
  }

  const navItems = [
    { href: `/${locale}/admin`, label: t('navDashboard'), icon: LayoutDashboard },
    { href: `/${locale}/admin/courses`, label: t('navCourses'), icon: BookOpen },
    { href: `/${locale}/admin/lessons`, label: t('navLessons'), icon: PlayCircle },
    { href: `/${locale}/admin/quizzes`, label: t('navQuizzes'), icon: FileQuestion },
    { href: `/${locale}/admin/users`, label: t('navUsers'), icon: Users },
    { href: `/${locale}/admin/certificates`, label: t('navCertificates'), icon: Award },
    { href: `/${locale}/admin/analytics`, label: t('navAnalytics'), icon: BarChart3 },
    { href: `/${locale}/admin/content`, label: t('navContent'), icon: Globe },
    { href: `/${locale}/admin/settings`, label: t('navSettings'), icon: Settings },
  ]

  const isActive = (href: string) => {
    // Strip locale prefix for comparison
    const cleanPathname = pathname.replace(`/${locale}`, '')
    const cleanHref = href.replace(`/${locale}`, '')
    if (cleanHref === '/admin') return cleanPathname === '/admin'
    return cleanPathname.startsWith(cleanHref)
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-400">{t('checkingAuth')}</p>
        </div>
      </div>
    )
  }

  // Not authenticated — redirect to login
  if (!session) {
    router.push(`/${locale}/login?callbackUrl=/${locale}/admin`)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-400">{t('redirectingLogin')}</p>
        </div>
      </div>
    )
  }

  // Not admin — redirect to dashboard
  if (session.user.role !== 'ADMIN') {
    router.push(`/${locale}/dashboard`)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
          <ShieldAlert className="h-12 w-12 text-red-400" />
          <p className="text-lg font-medium text-white">{t('noAccess')}</p>
          <p className="text-sm text-gray-400">{t('redirectingDashboard')}</p>
        </div>
      </div>
    )
  }

  const user = session.user
  const initials = (user.fullName || user.name || 'A').charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-[#0a1628]/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">
              AI SPUBUS Academy
            </span>
            <span className="text-[10px] font-medium tracking-wider text-gray-500">
              ADMIN PANEL
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-500" />
                )}
                <Icon
                  className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                    active
                      ? 'text-blue-400'
                      : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-3">
            <p className="text-xs font-medium text-blue-300">
              AI SPUBUS Academy
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500">v1.0.0 Beta</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#030712]/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="relative hidden flex-1 sm:block sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={t('search')}
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-600 outline-none transition-colors focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/20"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <button className="relative rounded-lg p-2.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-[#030712]" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-white/5"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.fullName || 'Admin'}
                    width={32}
                    height={32}
                    className="rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
                    {initials}
                  </div>
                )}
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-gray-200">
                    {user.fullName || user.name}
                  </p>
                  <p className="text-[11px] text-gray-500">{user.email}</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-gray-500 sm:block" />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0f172a] shadow-2xl shadow-black/40">
                    <div className="border-b border-white/[0.06] px-4 py-3">
                      <p className="text-sm font-medium text-white">
                        {user.fullName || user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="mt-1 inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                        Admin
                      </span>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href={`/${locale}/admin/settings`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                      >
                        <Settings className="h-4 w-4" />
                        {t('accountSettings')}
                      </Link>
                      <Link
                        href={`/${locale}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                      >
                        <Globe className="h-4 w-4" />
                        {t('goToWebsite')}
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('signOut')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
