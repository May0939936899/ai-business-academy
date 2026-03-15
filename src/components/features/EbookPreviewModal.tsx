'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from 'lucide-react'

interface EbookData {
  title: string
  subtitle: string | null
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
  lesson: LessonInfo
  ebook: EbookData
  settings: EbookSettings
  onClose: () => void
}

export default function EbookPreviewModal({ lesson, ebook, settings, onClose }: Props) {
  const [currentPage, setCurrentPage] = useState(0)
  const [zoom, setZoom] = useState(0.6)
  const [pageHtmls, setPageHtmls] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const loadPages = async () => {
      const { buildCoverPage, buildTOCPage, buildContentPage, buildClosingPage } = await import('@/lib/ebook-pages')
      const accent = settings.accentColor || '#1e40af'

      const tocSections = [
        'บทนำ (Introduction)', 'แนวคิดหลัก (Key Concepts)',
        'การประยุกต์ใช้ในธุรกิจ (Business Use Cases)',
        'เครื่องมือและเทคนิค (Tools & Techniques)',
        'ตัวอย่างปฏิบัติ (Practical Example)', 'บทสรุป (Summary)',
        'สิ่งที่ควรจดจำ (Key Takeaways)', 'คำถามทบทวน (Review Questions)',
      ]

      const sections = [
        { title: 'บทนำ', icon: '📖', content: ebook.introduction },
        { title: 'แนวคิดหลัก', icon: '💡', content: ebook.keyConcepts },
        { title: 'การประยุกต์ใช้ในธุรกิจ', icon: '🏢', content: ebook.businessUseCases },
        { title: 'เครื่องมือและเทคนิค', icon: '🔧', content: ebook.toolsAndTechniques },
        { title: 'ตัวอย่างปฏิบัติ', icon: '⚡', content: ebook.practicalExample },
        { title: 'บทสรุป', icon: '📋', content: ebook.ebookSummary },
        { title: 'สิ่งที่ควรจดจำ', icon: '🎯', content: ebook.ebookKeyTakeaways },
        { title: 'คำถามทบทวน', icon: '❓', content: ebook.reviewQuestions },
      ].filter(s => s.content)

      const pages: string[] = []
      pages.push(buildCoverPage(lesson, ebook, accent))
      pages.push(buildTOCPage(tocSections, accent))
      for (let i = 0; i < sections.length; i++) {
        if (!sections[i].content) continue
        pages.push(buildContentPage(i + 1, sections[i].title, sections[i].icon, sections[i].content!, i + 3, accent, settings))
      }
      pages.push(buildClosingPage(ebook.closingMessage || 'ขอบคุณที่ติดตามศึกษาบทเรียนนี้', accent))

      setPageHtmls(pages)
      setLoading(false)
    }

    // Load Thai font
    if (!document.head.querySelector('link[href*="Sarabun"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap'
      document.head.appendChild(link)
    }

    loadPages()
  }, [lesson, ebook, settings])

  const goNext = () => setCurrentPage(p => Math.min(p + 1, pageHtmls.length - 1))
  const goPrev = () => setCurrentPage(p => Math.max(p - 1, 0))
  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 1.2))
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.3))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === ' ') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [pageHtmls.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0a1628]/90 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-base">📚</span>
          <div>
            <p className="text-sm font-semibold text-white">{ebook.title || lesson.title}</p>
            <p className="text-[10px] text-gray-500">{lesson.courseName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={zoomOut} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-[3rem] text-center text-xs text-gray-400">{Math.round(zoom * 100)}%</span>
          <button onClick={zoomIn} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
            <ZoomIn className="h-4 w-4" />
          </button>

          <div className="mx-2 h-4 w-px bg-white/10" />
          <span className="text-xs text-gray-400">{currentPage + 1} / {pageHtmls.length || '...'}</span>
          <div className="mx-2 h-4 w-px bg-white/10" />

          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div ref={containerRef} className="flex flex-1 items-center justify-center overflow-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">กำลังโหลด E-Book...</p>
          </div>
        ) : pageHtmls[currentPage] ? (
          <div
            className="origin-top rounded-lg shadow-2xl shadow-black/50 ring-1 ring-white/10"
            style={{ transform: `scale(${zoom})`, width: '794px', height: '1123px', flexShrink: 0 }}
            dangerouslySetInnerHTML={{ __html: pageHtmls[currentPage] }}
          />
        ) : null}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-center gap-4 border-t border-white/10 bg-[#0a1628]/90 px-4 py-2.5">
        <button
          onClick={goPrev}
          disabled={currentPage === 0}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          หน้าก่อน
        </button>

        <div className="flex items-center gap-1">
          {pageHtmls.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`h-2 w-2 rounded-full transition-all ${i === currentPage ? 'scale-125 bg-blue-400' : 'bg-gray-600 hover:bg-gray-500'}`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentPage >= pageHtmls.length - 1}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          หน้าถัดไป
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
