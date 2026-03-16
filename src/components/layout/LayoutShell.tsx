'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ThemeSwitcher from '@/components/features/ThemeSwitcher'
import SplashScreen from '@/components/features/SplashScreen'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    // Admin has its own layout — no Navbar/Footer
    return <>{children}</>
  }

  // Check if this is the home page (root locale path)
  const segments = pathname.split('/').filter(Boolean)
  const isHomePage = segments.length <= 1 // e.g. "/" or "/th"

  const content = (
    <>
      <Navbar />
      <ThemeSwitcher />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </>
  )

  // Splash screen only on home page
  if (isHomePage) {
    return <SplashScreen>{content}</SplashScreen>
  }

  return content
}
