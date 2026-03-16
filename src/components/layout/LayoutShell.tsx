'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ThemeSwitcher from '@/components/features/ThemeSwitcher'
import PixelLandingPage from '@/components/features/PixelLandingPage'

const LOCALES = ['th', 'en', 'zh', 'ja']

function stripLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    return '/' + segments.slice(1).join('/')
  }
  return '/' + segments.join('/')
}

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const strippedPath = stripLocale(pathname)

  // Admin routes: render children only (admin has its own layout)
  if (strippedPath.startsWith('/admin')) {
    return <>{children}</>
  }

  // Tool routes: render children only (custom full-screen layout)
  if (strippedPath.startsWith('/image-to-content') || strippedPath.startsWith('/poster-generator')) {
    return <>{children}</>
  }

  // Home page: show splash overlay + normal layout underneath
  const segments = pathname.split('/').filter(Boolean)
  const isHomePage = segments.length === 0 || (segments.length === 1 && LOCALES.includes(segments[0]))

  // All pages (except admin/tools): standard layout with Navbar + Footer
  return (
    <>
      {isHomePage && <PixelLandingPage />}
      <Navbar />
      <ThemeSwitcher />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  )
}
