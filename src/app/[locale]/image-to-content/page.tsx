'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ImageIcon, ArrowLeft, Upload, Sparkles } from 'lucide-react'

export default function ImageToContentPage() {
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
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5BB7D5]/20 to-[#2E9ACC]/10 border border-[#5BB7D5]/20 flex items-center justify-center mb-8">
          <ImageIcon size={32} className="text-[#5BB7D5]" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#5BB7D5] to-[#2E9ACC] bg-clip-text text-transparent">
          ทำคอนเทนต์จากภาพ
        </h1>

        <p className="text-slate-400 text-lg mb-12 max-w-lg leading-relaxed">
          อัปโหลดภาพเพื่อช่วยสร้างข้อความ คำอธิบาย หรือคอนเทนต์สำหรับงานธุรกิจ การตลาด และโซเชียลมีเดีย
        </p>

        {/* Upload area placeholder */}
        <div className="w-full max-w-md border-2 border-dashed border-[#5BB7D5]/30 rounded-2xl p-12 flex flex-col items-center gap-4 bg-[#5BB7D5]/5 hover:bg-[#5BB7D5]/8 transition-colors cursor-pointer">
          <Upload size={40} className="text-[#5BB7D5]/60" />
          <p className="text-slate-300 font-medium">ลากไฟล์มาวางที่นี่</p>
          <p className="text-slate-500 text-sm">หรือคลิกเพื่อเลือกภาพ</p>
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
