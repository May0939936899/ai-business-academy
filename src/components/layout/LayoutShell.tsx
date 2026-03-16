'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ThemeSwitcher from '@/components/features/ThemeSwitcher'
import PixelLandingPage from '@/components/features/PixelLandingPage'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return <>{children}</>
  }

  // Home page: show pixel landing page (full-screen, user clicks to proceed)
  // Only match exact root "/" or locale-only paths "/th", "/en", "/zh", "/ja"
  const LOCALES = ['th', 'en', 'zh', 'ja']
  const segments = pathname.split('/').filter(Boolean)
  const isHomePage = segments.length === 0 || (segments.length === 1 && LOCALES.includes(segments[0]))

  if (isHomePage) {
    return <PixelLandingPage />
  }

  return (
    <>
      <Navbar />
      <ThemeSwitcher />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  )
}
