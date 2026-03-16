import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter, Noto_Sans_Thai, Noto_Sans_SC, Noto_Sans_JP, Press_Start_2P } from 'next/font/google'
import { routing } from '@/i18n/routing'
import AuthProvider from '@/components/providers/AuthProvider'
import LayoutShell from '@/components/layout/LayoutShell'
import ThemeScript from '@/components/features/ThemeScript'
import '../../app/globals.css'

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

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
  weight: ['400', '500', '700'],
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
  weight: ['400', '500', '700'],
})

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
  weight: '400',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const ogLocaleMap: Record<string, string> = {
  th: 'th_TH',
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: {
      default: 'AI Business Academy',
      template: '%s | AI Business Academy',
    },
    description:
      locale === 'th'
        ? 'เรียนรู้การใช้ AI สำหรับธุรกิจ ฟรี! คอร์สเรียนออนไลน์จาก คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม'
        : locale === 'zh'
          ? '免费学习商务AI！来自斯巴顿大学商学院的在线课程'
          : locale === 'ja'
            ? 'ビジネスAIを無料で学ぶ！スリパトゥム大学経営学部のオンラインコース'
            : 'Learn AI for business — free! Online courses from School of Business Administration, Sripatum University',
    keywords: ['AI', 'Business', 'Academy', 'SPU'],
    openGraph: {
      locale: ogLocaleMap[locale] || 'th_TH',
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoSansThai.variable} ${notoSansSC.variable} ${notoSansJP.variable} ${pressStart2P.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <LayoutShell>{children}</LayoutShell>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
