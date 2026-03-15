'use client'

import { useState, useCallback } from 'react'
import { BookOpen, Download, Eye, Loader2, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import Button from '@/components/ui/Button'
import EbookPreviewModal from './EbookPreviewModal'

interface Props {
  lessonId: string
  lessonTitle: string
  lessonOrder: number
}

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

const LEVEL_TH: Record<string, string> = {
  BEGINNER: '\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19',
  INTERMEDIATE: '\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E01\u0E25\u0E32\u0E07',
  ADVANCED: '\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E02\u0E31\u0E49\u0E19\u0E2A\u0E39\u0E07',
}

// Count estimated pages based on content sections
function estimatePageCount(ebook: EbookData): number {
  let pages = 2 // cover + TOC
  const sections = [
    ebook.introduction,
    ebook.keyConcepts,
    ebook.businessUseCases,
    ebook.toolsAndTechniques,
    ebook.practicalExample,
    ebook.ebookSummary,
    ebook.ebookKeyTakeaways,
    ebook.reviewQuestions,
  ]
  for (const s of sections) {
    if (s && s.trim()) {
      // Estimate: each 800 chars = 1 page
      const charCount = s.length
      pages += Math.max(1, Math.ceil(charCount / 800))
    }
  }
  pages += 1 // closing page
  return pages
}

// Generate a short summary from ebook content
function generateSummary(ebook: EbookData, lessonTitle: string): string {
  if (ebook.ebookSummary) {
    // Take first 2 sentences
    const sentences = ebook.ebookSummary.split(/[.!?\u0E2F]/).filter(s => s.trim().length > 10)
    if (sentences.length >= 2) {
      return sentences.slice(0, 2).join('. ').trim() + '...'
    }
    if (sentences.length === 1) return sentences[0].trim()
  }
  return `\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19\u0E09\u0E1A\u0E31\u0E1A\u0E40\u0E15\u0E47\u0E21\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1A\u0E17\u0E19\u0E35\u0E49 \u0E2A\u0E23\u0E38\u0E1B\u0E41\u0E19\u0E27\u0E04\u0E34\u0E14 \u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D \u0E41\u0E25\u0E30\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E08\u0E23\u0E34\u0E07\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A ${lessonTitle}`
}

export default function EbookSection({ lessonId, lessonTitle, lessonOrder }: Props) {
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [ebookData, setEbookData] = useState<{
    lesson: LessonInfo
    ebook: EbookData
    settings: EbookSettings
  } | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [summaryText, setSummaryText] = useState<string>('')
  const [fetchedOnce, setFetchedOnce] = useState(false)

  const fetchEbookData = useCallback(async () => {
    if (ebookData) return ebookData
    setLoading(true)
    try {
      const res = await fetch(`/api/ebooks/${lessonId}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setEbookData(data)
      setPageCount(estimatePageCount(data.ebook))
      setSummaryText(generateSummary(data.ebook, lessonTitle))
      setFetchedOnce(true)
      return data
    } catch (err) {
      console.error('Error fetching ebook:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [lessonId, lessonTitle, ebookData])

  // Prefetch on first expand
  const handleExpand = async () => {
    if (!fetchedOnce) {
      await fetchEbookData()
    }
    setExpanded(!expanded)
  }

  const handlePreview = async () => {
    const data = await fetchEbookData()
    if (data) setShowPreview(true)
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const data = await fetchEbookData()
      if (!data) return

      const { lesson, ebook, settings } = data
      if (!ebook.isActive) {
        alert('E-Book \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19')
        return
      }

      // Dynamic import jsPDF + html2canvas
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])

      const accent = settings.accentColor || '#1e40af'
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = 210
      const pageHeight = 297

      const renderPage = async (html: string): Promise<string> => {
        const container = document.createElement('div')
        container.style.cssText =
          'position:fixed;left:-9999px;top:0;width:794px;height:1123px;overflow:hidden;'

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

      // Import page builders from shared module
      const { buildCoverPage, buildTOCPage, buildContentPage, buildClosingPage } = await import('@/lib/ebook-pages')

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

      // Cover
      const coverImg = await renderPage(buildCoverPage(lesson, ebook, accent))
      pdf.addImage(coverImg, 'JPEG', 0, 0, pageWidth, pageHeight)

      // TOC
      const tocImg = await renderPage(buildTOCPage(tocSections, accent))
      pdf.addPage()
      pdf.addImage(tocImg, 'JPEG', 0, 0, pageWidth, pageHeight)

      // Content pages
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i]
        if (!sec.content) continue
        const img = await renderPage(
          buildContentPage(i + 1, sec.title, sec.icon, sec.content, i + 3, accent, settings)
        )
        pdf.addPage()
        pdf.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight)
      }

      // Closing
      const closingImg = await renderPage(
        buildClosingPage(
          ebook.closingMessage ||
            '\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E15\u0E34\u0E14\u0E15\u0E32\u0E21\u0E28\u0E36\u0E01\u0E29\u0E32\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19\u0E19\u0E35\u0E49\n\u0E2B\u0E27\u0E31\u0E07\u0E27\u0E48\u0E32\u0E04\u0E27\u0E32\u0E21\u0E23\u0E39\u0E49\u0E17\u0E35\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E08\u0E30\u0E40\u0E1B\u0E47\u0E19\u0E1B\u0E23\u0E30\u0E42\u0E22\u0E0A\u0E19\u0E4C\u0E43\u0E19\u0E01\u0E32\u0E23\u0E1E\u0E31\u0E12\u0E19\u0E32\u0E15\u0E19\u0E40\u0E2D\u0E07\u0E41\u0E25\u0E30\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13',
          accent
        )
      )
      pdf.addPage()
      pdf.addImage(closingImg, 'JPEG', 0, 0, pageWidth, pageHeight)

      const filename = `ebook-${lesson.title.replace(/[^a-zA-Z0-9\u0E01-\u0E39]/g, '-').slice(0, 40)}.pdf`
      pdf.save(filename)
    } catch (err) {
      console.error('Ebook PDF error:', err)
      alert('\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-[#0a1628] to-cyan-500/5">
        {/* Header */}
        <div className="flex items-start gap-4 p-5">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30">
            <BookOpen className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                E-Book \u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19
              </h3>
              {pageCount && (
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 ring-1 ring-blue-500/20">
                  {pageCount} \u0E2B\u0E19\u0E49\u0E32
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">
              \u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19\u0E09\u0E1A\u0E31\u0E1A\u0E40\u0E15\u0E47\u0E21\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1A\u0E17\u0E19\u0E35\u0E49
              \u0E2A\u0E23\u0E38\u0E1B\u0E41\u0E19\u0E27\u0E04\u0E34\u0E14 \u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D \u0E41\u0E25\u0E30\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E08\u0E23\u0E34\u0E07
              \u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2D\u0E48\u0E32\u0E19\u0E2D\u0E2D\u0E19\u0E44\u0E25\u0E19\u0E4C\u0E2B\u0E23\u0E37\u0E2D\u0E14\u0E32\u0E27\u0E19\u0E4C\u0E42\u0E2B\u0E25\u0E14\u0E40\u0E1B\u0E47\u0E19 PDF \u0E44\u0E14\u0E49
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 border-t border-blue-500/10 px-5 py-3.5 bg-blue-500/[0.03]">
          <button
            onClick={handlePreview}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition-all hover:bg-blue-500/20 hover:text-blue-200 disabled:opacity-50"
          >
            {loading && !downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            Preview E-Book
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? '\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07 PDF...' : 'Download PDF'}
          </button>
        </div>

        {/* Expandable summary */}
        <button
          onClick={handleExpand}
          className="flex w-full items-center justify-between border-t border-blue-500/10 px-5 py-2.5 text-xs text-gray-500 transition-colors hover:bg-white/[0.02] hover:text-gray-400"
        >
          <span className="flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            {expanded ? '\u0E0B\u0E48\u0E2D\u0E19\u0E2A\u0E23\u0E38\u0E1B\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32' : '\u0E14\u0E39\u0E2A\u0E23\u0E38\u0E1B\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32 E-Book'}
          </span>
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {expanded && summaryText && (
          <div className="border-t border-blue-500/10 px-5 py-3">
            <p className="text-xs leading-relaxed text-gray-400">{summaryText}</p>
            {pageCount && (
              <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-500">
                <span>\u0E08\u0E33\u0E19\u0E27\u0E19\u0E2B\u0E19\u0E49\u0E32: ~{pageCount} \u0E2B\u0E19\u0E49\u0E32</span>
                <span>\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07: Cover, \u0E2A\u0E32\u0E23\u0E1A\u0E31\u0E0D, 8 \u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D, \u0E2A\u0E23\u0E38\u0E1B</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && ebookData && (
        <EbookPreviewModal
          lesson={ebookData.lesson}
          ebook={ebookData.ebook}
          settings={ebookData.settings}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  )
}
