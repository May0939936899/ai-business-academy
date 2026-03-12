'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, LogIn, LogOut, LayoutDashboard, Award, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

const navLinks = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/courses', label: 'คอร์สเรียน' },
  { href: '/about', label: 'เกี่ยวกับ' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const isLoggedIn = status === 'authenticated' && session?.user

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'bg-[#030712]/80 backdrop-blur-xl',
        'border-b border-white/[0.06]'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-[10px] font-bold leading-tight text-white shadow-md">
              SPU
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 text-[10px] font-bold leading-tight text-white shadow-md">
              AI
            </div>
          </div>
          <span className="hidden text-lg font-bold tracking-tight text-white sm:inline-block">
            <span className="gradient-text-blue">AI</span>{' '}
            <span className="text-gray-100">Business Academy</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200',
                isActive(link.href)
                  ? 'bg-white/[0.06] text-white'
                  : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-white/[0.06]"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ''}
                    width={32}
                    height={32}
                    className="rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">
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
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/[0.08] bg-[#0a0f1e]/95 py-2 shadow-2xl backdrop-blur-xl">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    แดชบอร์ด
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Award className="h-4 w-4" />
                    ใบประกาศนียบัตร
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-cyan-400 transition-colors hover:bg-white/[0.06] hover:text-cyan-300"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      แอดมิน
                    </Link>
                  )}
                  <div className="my-1 border-t border-white/[0.06]" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-white/[0.06] hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button variant="secondary" size="sm">
                <LogIn className="h-4 w-4" />
                เข้าสู่ระบบ
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
            aria-label={mobileMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
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
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    แดชบอร์ด
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-cyan-400 hover:bg-white/[0.06]"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      แอดมิน
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-400 hover:bg-white/[0.06]"
                  >
                    <LogOut className="h-4 w-4" />
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="secondary" size="sm" className="w-full">
                    <LogIn className="h-4 w-4" />
                    เข้าสู่ระบบ
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
