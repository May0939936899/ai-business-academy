'use client'

import { useState } from 'react'
import { BookOpen, Download, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'

interface EbookData {
  title: string
  subtitle: string | null
  coverImageUrl: string | null
  introduction: string | null
  keyConcepts: string | null
  businessUseCases: string | null
  toolsAndTechniques: string | null
  practicalExample: string | null
  ebookSummary: string | null
  ebookKeyTakeaways: string | null
  reviewQuestions: string | null
  closingMessage: string | null
  isActive: boolean
}

interface LessonInfo {
  id: string
  title: string
  subtitle: string | null
  lessonOrder: number
  lessonLevel: string
  courseName: string
  courseCategory: string
}

interface EbookSettings {
  watermarkText: string
  watermarkOpacity: number
  headerText: string
  footerText: string
  logoUrl: string | null
  isWatermarkEnabled: boolean
  accentColor: string
}

interface Props {
  lessonId: string
}

const LEVEL_TH: Record<string, string> = {
  BEGINNER: 'ระดับเริ่มต้น',
  INTERMEDIATE: 'ระดับกลาง',
  ADVANCED: 'ระดับขั้นสูง',
}

// ─── HTML Page Builders ────────────────────────────────────────────────────────

function buildCoverPage(lesson: LessonInfo, ebook: EbookData, accent: string): string {
  const level = LEVEL_TH[lesson.lessonLevel] || lesson.lessonLevel
  return `
    <div style="
      width:794px;height:1123px;position:relative;overflow:hidden;
      background:linear-gradient(145deg,#0a1628 0%,#1e3a5f 40%,#0f2d50 100%);
      font-family:'Sarabun',sans-serif;box-sizing:border-box;
    ">
      <!-- Decorative circles -->
      <div style="position:absolute;top:-120px;right:-120px;width:400px;height:400px;border-radius:50%;background:${accent};opacity:0.12;"></div>
      <div style="position:absolute;bottom:-80px;left:-80px;width:300px;height:300px;border-radius:50%;background:${accent};opacity:0.08;"></div>
      <div style="position:absolute;top:200px;left:-60px;width:200px;height:200px;border-radius:50%;background:#06b6d4;opacity:0.06;"></div>

      <!-- Top logo bar -->
      <div style="
        position:absolute;top:0;left:0;right:0;height:6px;
        background:linear-gradient(90deg,${accent},#06b6d4,${accent});
      "></div>

      <!-- University badge -->
      <div style="position:absolute;top:40px;left:60px;right:60px;display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="
            width:44px;height:44px;border-radius:50%;
            background:linear-gradient(135deg,${accent},#06b6d4);
            display:flex;align-items:center;justify-content:center;
          ">
            <span style="color:white;font-size:20px;font-weight:bold;">A</span>
          </div>
          <div>
            <p style="color:#93c5fd;font-size:11px;margin:0;letter-spacing:2px;font-weight:600;">AI SPUBUS ACADEMY</p>
            <p style="color:#64748b;font-size:10px;margin:0;letter-spacing:1px;">คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม</p>
          </div>
        </div>
        <div style="
          padding:6px 14px;border-radius:20px;
          border:1px solid ${accent}40;background:${accent}20;
        ">
          <span style="color:#93c5fd;font-size:10px;font-weight:600;letter-spacing:1px;">${lesson.courseCategory}</span>
        </div>
      </div>

      <!-- Main content area -->
      <div style="position:absolute;top:140px;left:60px;right:60px;">
        <!-- E-BOOK label -->
        <div style="display:inline-block;margin-bottom:20px;">
          <div style="
            display:flex;align-items:center;gap:8px;
            padding:8px 16px;border-radius:6px;
            background:${accent}30;border:1px solid ${accent}60;
          ">
            <div style="width:8px;height:8px;border-radius:50%;background:${accent};"></div>
            <span style="color:${accent === '#1e40af' ? '#60a5fa' : accent};font-size:11px;font-weight:700;letter-spacing:3px;">E-BOOK | สรุปบทเรียน</span>
          </div>
        </div>

        <!-- Lesson number -->
        <p style="color:#475569;font-size:16px;margin:0 0 12px 0;font-weight:500;">
          บทที่ ${lesson.lessonOrder}
        </p>

        <!-- Title -->
        <h1 style="
          color:white;font-size:38px;font-weight:800;line-height:1.2;
          margin:0 0 16px 0;letter-spacing:-0.5px;
        ">${ebook.title || lesson.title}</h1>

        <!-- Subtitle -->
        ${ebook.subtitle ? `
        <p style="
          color:#94a3b8;font-size:16px;line-height:1.6;
          margin:0 0 32px 0;max-width:560px;
        ">${ebook.subtitle}</p>
        ` : ''}

        <!-- Divider -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
          <div style="flex:1;height:1px;background:linear-gradient(90deg,${accent}80,transparent);"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:${accent};"></div>
        </div>

        <!-- Stats row -->
        <div style="display:flex;gap:24px;flex-wrap:wrap;">
          <div style="
            padding:14px 20px;border-radius:12px;
            background:white10;border:1px solid #ffffff15;
            background:rgba(255,255,255,0.05);
          ">
            <p style="color:#64748b;font-size:10px;margin:0 0 4px 0;letter-spacing:1px;">ระดับ</p>
            <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0;">${level}</p>
          </div>
          <div style="
            padding:14px 20px;border-radius:12px;
            background:rgba(255,255,255,0.05);border:1px solid #ffffff15;
          ">
            <p style="color:#64748b;font-size:10px;margin:0 0 4px 0;letter-spacing:1px;">หลักสูตร</p>
            <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${lesson.courseName}</p>
          </div>
        </div>
      </div>

      <!-- Bottom decoration -->
      <div style="position:absolute;bottom:60px;left:60px;right:60px;">
        <div style="height:1px;background:linear-gradient(90deg,transparent,#334155,transparent);margin-bottom:20px;"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <p style="color:#334155;font-size:10px;margin:0;letter-spacing:1px;">AI SPUBUS ACADEMY — E-BOOK SERIES</p>
          <p style="color:#334155;font-size:10px;margin:0;">© คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม</p>
        </div>
      </div>

      <!-- Bottom bar -->
      <div style="position:absolute;bottom:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
    </div>
  `
}

function buildTOCPage(sections: string[], accent: string): string {
  const items = sections.map((s, i) => `
    <div style="display:flex;align-items:center;gap:0;margin-bottom:18px;">
      <div style="
        width:36px;height:36px;border-radius:8px;flex-shrink:0;
        background:${accent}20;border:1px solid ${accent}40;
        display:flex;align-items:center;justify-content:center;
      ">
        <span style="color:${accent === '#1e40af' ? '#60a5fa' : accent};font-size:13px;font-weight:700;">${i + 1}</span>
      </div>
      <div style="flex:1;height:1px;border-bottom:1px dashed #1e2d40;margin:0 16px;"></div>
      <p style="color:#cbd5e1;font-size:14px;font-weight:500;margin:0;max-width:420px;text-align:right;">${s}</p>
    </div>
  `).join('')

  return `
    <div style="width:794px;height:1123px;position:relative;overflow:hidden;background:#0d1b2e;font-family:'Sarabun',sans-serif;box-sizing:border-box;">
      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
      <div style="position:absolute;top:0;left:0;bottom:0;width:4px;background:linear-gradient(180deg,${accent},#06b6d4);"></div>

      <div style="padding:60px 60px 60px 72px;">
        <div style="margin-bottom:10px;">
          <span style="color:${accent === '#1e40af' ? '#60a5fa' : accent};font-size:11px;font-weight:700;letter-spacing:3px;">สารบัญ</span>
        </div>
        <h2 style="color:white;font-size:28px;font-weight:800;margin:0 0 8px 0;">Table of Contents</h2>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:40px;">
          <div style="width:40px;height:3px;background:${accent};border-radius:2px;"></div>
          <div style="width:20px;height:3px;background:#06b6d4;border-radius:2px;"></div>
        </div>

        ${items}
      </div>

      <div style="position:absolute;bottom:40px;left:72px;right:60px;display:flex;justify-content:space-between;align-items:center;">
        <p style="color:#334155;font-size:10px;margin:0;">AI SPUBUS Academy</p>
        <p style="color:#334155;font-size:10px;margin:0;">สารบัญ</p>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
    </div>
  `
}

function buildContentPage(
  sectionNum: number,
  sectionTitle: string,
  sectionIcon: string,
  content: string,
  pageNum: number,
  accent: string,
  settings: EbookSettings
): string {
  const paragraphs = content
    .split('\n')
    .filter((l) => l.trim())
    .map((line) => {
      const clean = line.replace(/^[-•*]\s*/, '')
      if (line.match(/^\d+\.\s/)) {
        const [num, ...rest] = line.split(/\.\s+/)
        return `<div style="display:flex;gap:12px;margin-bottom:12px;align-items:flex-start;">
          <span style="color:${accent === '#1e40af' ? '#60a5fa' : accent};font-weight:700;font-size:14px;flex-shrink:0;min-width:20px;">${num}.</span>
          <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0;">${rest.join('. ')}</p>
        </div>`
      }
      if (line.match(/^[-•*]/)) {
        return `<div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;">
          <div style="width:6px;height:6px;border-radius:50%;background:${accent === '#1e40af' ? '#60a5fa' : accent};flex-shrink:0;margin-top:8px;"></div>
          <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0;">${clean}</p>
        </div>`
      }
      return `<p style="color:#94a3b8;font-size:14px;line-height:1.9;margin-bottom:12px;">${line}</p>`
    })
    .join('')

  const watermark = settings.isWatermarkEnabled
    ? `<div style="
        position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
        pointer-events:none;overflow:hidden;
      ">
        <p style="
          color:white;font-size:18px;font-weight:600;
          opacity:${settings.watermarkOpacity};
          transform:rotate(-30deg);white-space:nowrap;
          font-family:'Sarabun',sans-serif;letter-spacing:2px;
        ">${settings.watermarkText}</p>
      </div>`
    : ''

  return `
    <div style="width:794px;height:1123px;position:relative;overflow:hidden;background:#0d1b2e;font-family:'Sarabun',sans-serif;box-sizing:border-box;">
      ${watermark}

      <!-- Top bar -->
      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
      <div style="position:absolute;top:0;left:0;bottom:0;width:4px;background:linear-gradient(180deg,${accent},#06b6d4);"></div>

      <!-- Header -->
      <div style="
        padding:20px 60px 16px 72px;
        border-bottom:1px solid #1e2d40;
        display:flex;justify-content:space-between;align-items:center;
      ">
        <span style="color:#475569;font-size:10px;letter-spacing:2px;">${settings.headerText}</span>
        <span style="color:#475569;font-size:10px;">หน้า ${pageNum}</span>
      </div>

      <!-- Section header -->
      <div style="padding:28px 60px 0 72px;">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:6px;">
          <div style="
            width:40px;height:40px;border-radius:10px;flex-shrink:0;
            background:${accent}25;border:1px solid ${accent}50;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;
          ">${sectionIcon}</div>
          <div>
            <p style="color:#475569;font-size:10px;margin:0 0 3px 0;letter-spacing:2px;font-weight:600;">หัวข้อที่ ${sectionNum}</p>
            <h3 style="color:white;font-size:20px;font-weight:800;margin:0;">${sectionTitle}</h3>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;margin-top:14px;">
          <div style="width:32px;height:3px;background:${accent};border-radius:2px;"></div>
          <div style="width:16px;height:3px;background:#06b6d4;border-radius:2px;"></div>
        </div>
      </div>

      <!-- Content -->
      <div style="padding:0 60px 20px 72px;overflow:hidden;max-height:850px;">
        ${paragraphs}
      </div>

      <!-- Footer -->
      <div style="
        position:absolute;bottom:0;left:0;right:0;
        border-top:1px solid #1e2d40;padding:12px 60px 16px 72px;
        display:flex;justify-content:space-between;align-items:center;
      ">
        <p style="color:#334155;font-size:10px;margin:0;">${settings.footerText}</p>
        <p style="color:#334155;font-size:10px;margin:0;">${pageNum}</p>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
    </div>
  `
}

function buildClosingPage(message: string, accent: string): string {
  return `
    <div style="
      width:794px;height:1123px;position:relative;overflow:hidden;
      background:linear-gradient(145deg,#0a1628 0%,#1e3a5f 60%,#0f2d50 100%);
      font-family:'Sarabun',sans-serif;box-sizing:border-box;
    ">
      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>

      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;width:600px;">
        <div style="
          width:80px;height:80px;border-radius:50%;margin:0 auto 28px;
          background:linear-gradient(135deg,${accent},#06b6d4);
          display:flex;align-items:center;justify-content:center;
          font-size:36px;
        ">✓</div>

        <h2 style="color:white;font-size:30px;font-weight:800;margin:0 0 8px 0;">จบบทเรียนเรียบร้อยแล้ว</h2>
        <p style="color:#60a5fa;font-size:14px;margin:0 0 32px 0;letter-spacing:1px;">Lesson Complete</p>

        <div style="
          padding:28px 32px;border-radius:16px;
          background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
          margin-bottom:36px;
        ">
          <p style="color:#94a3b8;font-size:14px;line-height:1.9;margin:0;white-space:pre-line;">${message}</p>
        </div>

        <div style="height:1px;background:linear-gradient(90deg,transparent,#334155,transparent);margin-bottom:24px;"></div>

        <p style="color:#1e40af;font-size:12px;margin:0 0 4px 0;font-weight:700;letter-spacing:2px;">AI SPUBUS ACADEMY</p>
        <p style="color:#334155;font-size:11px;margin:0;">คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม</p>
      </div>

      <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
    </div>
  `
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function EbookDownloadButton({ lessonId }: Props) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const generatePDF = async () => {
    setLoading(true)
    setStatus('กำลังดาวน์โหลด...')

    try {
      // 1. Fetch ebook data
      const res = await fetch(`/api/ebooks/${lessonId}`)
      if (!res.ok) throw new Error('Failed to fetch ebook data')
      const data = await res.json()

      const { lesson, ebook, settings } = data as {
        lesson: LessonInfo
        ebook: EbookData
        settings: EbookSettings
      }

      if (!ebook.isActive) {
        alert('E-Book ยังไม่พร้อมใช้งาน')
        return
      }

      const accent = settings.accentColor || '#1e40af'

      // 2. Build page HTMLs
      const tocSections = [
        'บทนำ (Introduction)',
        'แนวคิดหลัก (Key Concepts)',
        'การประยุกต์ใช้ในธุรกิจ (Business Use Cases)',
        'เครื่องมือและเทคนิค (Tools & Techniques)',
        'ตัวอย่างปฏิบัติ (Practical Example)',
        'บทสรุป (Summary)',
        'สิ่งที่ควรจดจำ (Key Takeaways)',
        'คำถามทบทวน (Review Questions)',
      ]

      const sections: Array<{ title: string; icon: string; content: string | null }> = [
        { title: 'บทนำ', icon: '📖', content: ebook.introduction },
        { title: 'แนวคิดหลัก', icon: '💡', content: ebook.keyConcepts },
        { title: 'การประยุกต์ใช้ในธุรกิจ', icon: '🏢', content: ebook.businessUseCases },
        { title: 'เครื่องมือและเทคนิค', icon: '🔧', content: ebook.toolsAndTechniques },
        { title: 'ตัวอย่างปฏิบัติ', icon: '⚡', content: ebook.practicalExample },
        { title: 'บทสรุป', icon: '📋', content: ebook.ebookSummary },
        { title: 'สิ่งที่ควรจดจำ', icon: '🎯', content: ebook.ebookKeyTakeaways },
        { title: 'คำถามทบทวน', icon: '❓', content: ebook.reviewQuestions },
      ].filter((s) => s.content)

      // 3. Dynamically import jsPDF + html2canvas (to keep bundle small)
      setStatus('กำลังดาวน์โหลด...')
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = 210
      const pageHeight = 297

      const renderPage = async (html: string): Promise<string> => {
        const container = document.createElement('div')
        container.style.cssText =
          'position:fixed;left:-9999px;top:0;width:794px;height:1123px;overflow:hidden;'

        // Load Google Fonts for Thai support
        const fontLink = document.createElement('link')
        fontLink.rel = 'stylesheet'
        fontLink.href =
          'https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap'
        if (!document.head.querySelector('link[href*="Sarabun"]')) {
          document.head.appendChild(fontLink)
          await new Promise((r) => setTimeout(r, 600))
        }

        container.innerHTML = html
        document.body.appendChild(container)

        await new Promise((r) => setTimeout(r, 200))

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          width: 794,
          height: 1123,
          logging: false,
        })

        document.body.removeChild(container)
        return canvas.toDataURL('image/jpeg', 0.92)
      }

      // Page 1: Cover
      setStatus('กำลังดาวน์โหลด...')
      const coverImg = await renderPage(buildCoverPage(lesson, ebook, accent))
      pdf.addImage(coverImg, 'JPEG', 0, 0, pageWidth, pageHeight)

      // Page 2: TOC
      setStatus('กำลังดาวน์โหลด...')
      const tocImg = await renderPage(buildTOCPage(tocSections, accent))
      pdf.addPage()
      pdf.addImage(tocImg, 'JPEG', 0, 0, pageWidth, pageHeight)

      // Content pages
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i]
        if (!sec.content) continue
        setStatus('กำลังดาวน์โหลด...')
        const img = await renderPage(
          buildContentPage(i + 1, sec.title, sec.icon, sec.content, i + 3, accent, settings)
        )
        pdf.addPage()
        pdf.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight)
      }

      // Last page: Closing
      setStatus('กำลังดาวน์โหลด...')
      const closingImg = await renderPage(
        buildClosingPage(
          ebook.closingMessage ||
            'ขอบคุณที่ติดตามศึกษาบทเรียนนี้\nหวังว่าความรู้ที่ได้รับจะเป็นประโยชน์ในการพัฒนาตนเองและองค์กรของคุณ',
          accent
        )
      )
      pdf.addPage()
      pdf.addImage(closingImg, 'JPEG', 0, 0, pageWidth, pageHeight)

      // 4. Save
      const filename = `ebook-${lesson.title.replace(/[^a-zA-Z0-9ก-๙]/g, '-').slice(0, 40)}.pdf`
      pdf.save(filename)
      setStatus('')
    } catch (err) {
      console.error('Ebook PDF error:', err)
      setStatus('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setTimeout(() => setStatus(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        size="lg"
        onClick={generatePDF}
        disabled={loading}
        className="w-full border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <BookOpen className="h-5 w-5" />
        )}
        {loading ? status || 'กำลังดาวน์โหลด...' : 'ดาวน์โหลด E-Book'}
        {!loading && <Download className="h-4 w-4" />}
      </Button>
      {loading && status && (
        <p className="text-center text-xs text-blue-400/70 animate-pulse">{status}</p>
      )}
    </div>
  )
}
