'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Palette, ArrowLeft, Wand2, Sparkles } from 'lucide-react'

export default function PosterGeneratorPage() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/').filter(Boolean)[0] || 'th'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020818] via-[#0a1628] to-[#0d1f3c] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push(`/${locale}`)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            กลับหน้าหลัก
          </button>
          <div className="h-4 w-px bg-white/20" />
          <span className="text-xs text-slate-500 font-mono tracking-wider">AI BUSINESS ACADEMY</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A78BFA]/20 to-[#8B5CF6]/10 border border-[#A78BFA]/20 flex items-center justify-center mb-8">
          <Palette size={32} className="text-[#A78BFA]" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent">
          สร้างภาพ / โปสเตอร์
        </h1>

        <p className="text-slate-400 text-lg mb-12 max-w-lg leading-relaxed">
          สร้างภาพและโปสเตอร์สำหรับงานนำเสนอ การตลาด หรือคอนเทนต์ออนไลน์ให้ดูมืออาชีพมากขึ้น
        </p>

        {/* Generator placeholder */}
        <div className="w-full max-w-md border-2 border-dashed border-[#A78BFA]/30 rounded-2xl p-12 flex flex-col items-center gap-4 bg-[#A78BFA]/5 hover:bg-[#A78BFA]/8 transition-colors cursor-pointer">
          <Wand2 size={40} className="text-[#A78BFA]/60" />
          <p className="text-slate-300 font-medium">พิมพ์คำอธิบายภาพที่ต้องการ</p>
          <p className="text-slate-500 text-sm">AI จะสร้างภาพให้อัตโนมัติ</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
            <Sparkles size={12} />
            <span>เร็วๆ นี้</span>
          </div>
        </div>

        <div className="mt-16 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-500">
          ฟีเจอร์นี้กำลังอยู่ระหว่างการพัฒนา — พร้อมใช้งานเร็วๆ นี้
        </div>
      </main>
    </div>
  )
}
