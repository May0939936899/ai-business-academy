'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Loader2, Maximize2 } from 'lucide-react'

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
    // Prevent background scrolling
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const loadPages = async () => {
      const { buildCoverPage, buildTOCPage, buildContentPage, buildClosingPage } = await import('@/lib/ebook-pages')
      const accent = settings.accentColor || '#1e40af'

      const tocSections = [
        '\u0E1A\u0E17\u0E19\u0E33 (Introduction)',
        '\u0E41\u0E19\u0E27\u0E04\u0E34\u0E14\u0E2B\u0E25\u0E31\u0E01 (Key Concepts)',
        '\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E22\u0E38\u0E01\u0E15\u0E4C\u0E43\u0E0A\u0E49\u0E43\u0E19\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08 (Business Use Cases)',
        '\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E41\u0E25\u0E30\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04 (Tools & Techniques)',
        '\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34 (Practical Example)',
        '\u0E1A\u0E17\u0E2A\u0E23\u0E38\u0E1B (Summary)',
        '\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E08\u0E14\u0E08\u0E33 (Key Takeaways)',
        '\u0E04\u0E33\u0E16\u0E32\u0E21\u0E17\u0E1A\u0E17\u0E27\u0E19 (Review Questions)',
      ]

      const sections: Array<{ title: string; icon: string; content: string | null }> = [
        { title: '\u0E1A\u0E17\u0E19\u0E33', icon: '\u{1F4D6}', content: ebook.introduction },
        { title: '\u0E41\u0E19\u0E27\u0E04\u0E34\u0E14\u0E2B\u0E25\u0E31\u0E01', icon: '\u{1F4A1}', content: ebook.keyConcepts },
        { title: '\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E22\u0E38\u0E01\u0E15\u0E4C\u0E43\u0E0A\u0E49\u0E43\u0E19\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08', icon: '\u{1F3E2}', content: ebook.businessUseCases },
        { title: '\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E41\u0E25\u0E30\u0E40\u0E17\u0E04\u0E19\u0E34\u0E04', icon: '\u{1F527}', content: ebook.toolsAndTechniques },
        { title: '\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34', icon: '\u26A1', content: ebook.practicalExample },
        { title: '\u0E1A\u0E17\u0E2A\u0E23\u0E38\u0E1B', icon: '\u{1F4CB}', content: ebook.ebookSummary },
        { title: '\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E08\u0E14\u0E08\u0E33', icon: '\u{1F3AF}', content: ebook.ebookKeyTakeaways },
        { title: '\u0E04\u0E33\u0E16\u0E32\u0E21\u0E17\u0E1A\u0E17\u0E27\u0E19', icon: '\u2753', content: ebook.reviewQuestions },
      ].filter((s) => s.content)

      const pages: string[] = []
      pages.push(buildCoverPage(lesson, ebook, accent))
      pages.push(buildTOCPage(tocSections, accent))
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i]
        if (!sec.content) continue
        pages.push(buildContentPage(i + 1, sec.title, sec.icon, sec.content, i + 3, accent, settings))
      }
      pages.push(
        buildClosingPage(
          ebook.closingMessage ||
            '\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E15\u0E34\u0E14\u0E15\u0E32\u0E21\u0E28\u0E36\u0E01\u0E29\u0E32\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19\u0E19\u0E35\u0E49',
          accent
        )
      )

      setPageHtmls(pages)
      setLoading(false)
    }

    // Load Google Fonts
    const fontLink = document.createElement('link')
    fontLink.rel = 'stylesheet'
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap'
    if (!document.head.querySelector('link[href*="Sarabun"]')) {
      document.head.appendChild(fontLink)
    }

    loadPages()
  }, [lesson, ebook, settings])

  const goNext = () => setCurrentPage((p) => Math.min(p + 1, pageHtmls.length - 1))
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 0))
  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.2))
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.3))

  // Keyboard nav
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
          <span className="text-base">{'\u{1F4DA}'}</span>
          <div>
            <p className="text-sm font-semibold text-white">{ebook.title || lesson.title}</p>
            <p className="text-[10px] text-gray-500">{lesson.courseName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={zoomOut}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-[3rem] text-center text-xs text-gray-400">{Math.round(zoom * 100)}%</span>
          <button
            onClick={zoomIn}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <div className="mx-2 h-4 w-px bg-white/10" />

          {/* Page nav */}
          <span className="text-xs text-gray-400">
            {currentPage + 1} / {pageHtmls.length || '...'}
          </span>

          <div className="mx-2 h-4 w-px bg-white/10" />

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div ref={containerRef} className="flex flex-1 items-center justify-center overflow-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">{'\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14 E-Book...'}</p>
          </div>
        ) : pageHtmls[currentPage] ? (
          <div
            className="origin-top rounded-lg shadow-2xl shadow-black/50 ring-1 ring-white/10"
            style={{
              transform: `scale(${zoom})`,
              width: '794px',
              height: '1123px',
              flexShrink: 0,
            }}
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
          {'\u0E2B\u0E19\u0E49\u0E32\u0E01\u0E48\u0E2D\u0E19'}
        </button>

        {/* Page dots */}
        <div className="flex items-center gap-1">
          {pageHtmls.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === currentPage ? 'bg-blue-400 scale-125' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentPage >= pageHtmls.length - 1}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          {'\u0E2B\u0E19\u0E49\u0E32\u0E16\u0E31\u0E14\u0E44\u0E1B'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
