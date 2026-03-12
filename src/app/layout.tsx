import type { Metadata } from 'next'
import { Inter, Noto_Sans_Thai } from 'next/font/google'
import AuthProvider from '@/components/providers/AuthProvider'
import LayoutShell from '@/components/layout/LayoutShell'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  variable: '--font-noto-sans-thai',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AI Business Academy',
    template: '%s | AI Business Academy',
  },
  description:
    'เรียนรู้การใช้ AI สำหรับธุรกิจ ฟรี! คอร์สเรียนออนไลน์จาก คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม',
  keywords: [
    'AI',
    'Business',
    'Academy',
    'เรียนออนไลน์',
    'ปัญญาประดิษฐ์',
    'ธุรกิจ',
    'SPU',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${inter.variable} ${notoSansThai.variable}`}>
      <body className="min-h-screen bg-[#030712] font-sans text-gray-100 antialiased">
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  )
}
