'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, LogIn, LogOut, LayoutDashboard, Award, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('navbar')
  const locale = useLocale()

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/courses`, label: t('courses') },
    { href: `/${locale}/instructors`, label: t('instructors') },
    { href: `/${locale}/about`, label: t('about') },
  ]

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  // Close user menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (href: string) => {
    const normalizedHref = href.replace(/\/$/, '')
    const normalizedPathname = pathname.replace(/\/$/, '')
    if (normalizedHref === `/${locale}`) return normalizedPathname === `/${locale}` || normalizedPathname === ''
    return normalizedPathname.startsWith(normalizedHref)
  }

  const isLoggedIn = status === 'authenticated' && session?.user

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'bg-[#030712]/80 backdrop-blur-xl',
        'border-b border-transparent'
      )}
      style={{
        borderImage: 'linear-gradient(90deg, transparent 0%, #2196F3 25%, #4FC3F7 50%, #E91E8C 75%, transparent 100%) 1',
      }}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" style={{ height: '72px' }}>
        {/* Logo + Brand */}
        <Link href={`/${locale}`} className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/images/brand/spu-bus-logo.svg"
            alt="SPU BUS Logo"
            width={120}
            height={40}
            className="h-8 w-auto shrink-0 sm:h-10"
            priority
          />
          <div className="hidden sm:block">
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-xl font-extrabold tracking-tight sm:text-2xl"
                style={{
                  background: 'linear-gradient(135deg, #2196F3 0%, #4FC3F7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AI
              </span>
              <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Business Academy
              </span>
            </div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
              School of Business Administration
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                isActive(link.href)
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #2196F3, #4FC3F7)',
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {isLoggedIn ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.06]"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ''}
                    width={34}
                    height={34}
                    className="rounded-full ring-2 ring-white/10"
                    unoptimized
                  />
                ) : (
                  <div
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white/10"
                    style={{
                      background: 'linear-gradient(135deg, #2196F3, #4FC3F7)',
                    }}
                  >
                    {(session.user.fullName || session.user.name || 'U')[0]}
                  </div>
                )}
                <span className="max-w-[120px] truncate text-sm font-medium text-gray-200">
                  {session.user.fullName || session.user.name}
                </span>
                <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', userMenuOpen && 'rotate-180')} />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0f1e]/95 shadow-2xl backdrop-blur-xl">
                  <div className="py-2">
                    <Link
                      href={`/${locale}/dashboard`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {t('dashboard')}
                    </Link>
                    <Link
                      href={`/${locale}/dashboard`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <Award className="h-4 w-4" />
                      {t('certificates')}
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href={`/${locale}/admin`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-cyan-400 transition-colors hover:bg-white/[0.06] hover:text-cyan-300"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t('admin')}
                      </Link>
                    )}
                    <div className="my-1 border-t border-white/[0.06]" />
                    <button
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-white/[0.06] hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href={`/${locale}/login`} className="hidden md:block">
              <Button variant="secondary" size="sm">
                <LogIn className="h-4 w-4" />
                {t('login')}
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className={cn(
              'inline-flex items-center justify-center rounded-lg p-2 md:hidden',
              'text-gray-400 transition-colors',
              'hover:bg-white/[0.06] hover:text-white'
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/[0.06] bg-[#030712]/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200',
                  isActive(link.href)
                    ? 'bg-white/[0.06] text-white'
                    : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              {isLoggedIn ? (
                <div className="space-y-1">
                  <Link
                    href={`/${locale}/dashboard`}
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t('dashboard')}
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href={`/${locale}/admin`}
                      className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-cyan-400 hover:bg-white/[0.06]"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {t('admin')}
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: `/${locale}` })}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-400 hover:bg-white/[0.06]"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <Link href={`/${locale}/login`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    <LogIn className="h-4 w-4" />
                    {t('login')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
