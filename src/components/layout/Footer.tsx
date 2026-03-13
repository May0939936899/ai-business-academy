import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Youtube, MessageCircle, Phone, MapPin, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const footerSections = [
  {
    title: 'คอร์สเรียน',
    links: [
      { href: '/courses', label: 'คอร์สทั้งหมด' },
      { href: '/courses?category=AI+Automation', label: 'AI Automation' },
      { href: '/courses?category=AI+Marketing', label: 'AI Marketing' },
      { href: '/courses?category=AI+HR', label: 'AI HR' },
    ],
  },
  {
    title: 'เกี่ยวกับ',
    links: [
      { href: '/about', label: 'เกี่ยวกับเรา' },
      { href: '/about#team', label: 'ทีมผู้สอน' },
      { href: '/about#faq', label: 'คำถามที่พบบ่อย' },
    ],
  },
  {
    title: 'ช่วยเหลือ',
    links: [
      { href: '/contact', label: 'ติดต่อเรา' },
      { href: '/privacy', label: 'นโยบายความเป็นส่วนตัว' },
      { href: '/terms', label: 'เงื่อนไขการใช้งาน' },
    ],
  },
]

const socialLinks = [
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: Facebook,
  },
  {
    href: 'https://youtube.com',
    label: 'YouTube',
    icon: Youtube,
  },
  {
    href: 'https://line.me',
    label: 'Line',
    icon: MessageCircle,
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030712]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Main Footer ── */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-3 sm:gap-4">
              <Image
                src="/images/brand/spu-bus-logo.svg"
                alt="SPU BUS Logo"
                width={120}
                height={40}
                className="h-9 w-auto sm:h-10"
              />
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-lg font-extrabold tracking-tight sm:text-xl"
                    style={{
                      background: 'linear-gradient(135deg, #2196F3 0%, #4FC3F7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    AI
                  </span>
                  <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
                    Business Academy
                  </span>
                </div>
                <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-gray-500">
                  คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
                </p>
              </div>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-500">
              แพลตฟอร์มเรียนรู้ AI สำหรับธุรกิจ โดยคณะบริหารธุรกิจ
              มหาวิทยาลัยศรีปทุม เรียนฟรี พร้อมใบประกาศนียบัตร
            </p>

            {/* Contact Info */}
            <div className="mb-5 space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-gray-500">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-600" />
                <span>0 2579 1111 ต่อ 2354</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-gray-500">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-600" />
                <a
                  href="mailto:direct.sbs@spu.ac.th"
                  className="transition-colors hover:text-gray-300"
                >
                  direct.sbs@spu.ac.th
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-gray-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-600" />
                <span>
                  มหาวิทยาลัยศรีปทุม 2410/2 ถนนพหลโยธิน เขตจตุจักร กรุงเทพฯ 10900
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-lg',
                    'border border-white/[0.06] bg-white/[0.03]',
                    'text-gray-500 transition-all duration-200',
                    'hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white'
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors duration-200 hover:text-gray-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/[0.06] py-6">
          <p className="text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} AI Business Academy
            &mdash; คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
          </p>
        </div>
      </div>
    </footer>
  )
}
