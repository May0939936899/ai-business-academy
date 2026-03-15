'use client'

import { useState, useEffect, useCallback } from 'react'
import { BookOpen, Download, Eye, Loader2, FileText, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
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

interface FetchedData {
  lesson: LessonInfo
  ebook: EbookData
  settings: EbookSettings
}

function estimatePageCount(ebook: EbookData): number {
  let pages = 2
  const sections = [
    ebook.introduction, ebook.keyConcepts, ebook.businessUseCases,
    ebook.toolsAndTechniques, ebook.practicalExample, ebook.ebookSummary,
    ebook.ebookKeyTakeaways, ebook.reviewQuestions,
  ]
  for (const s of sections) {
    if (s && s.trim()) pages += Math.max(1, Math.ceil(s.length / 800))
  }
  return pages + 1
}

export default function EbookSection({ lessonId, lessonTitle, lessonOrder }: Props) {
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [ebookData, setEbookData] = useState<FetchedData | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState(false)

  // Reset when lesson changes
  useEffect(() => {
    setEbookData(null)
    setExpanded(false)
    setShowPreview(false)
    setError(false)
  }, [lessonId])

  // Auto-fetch on mount to show page count
  useEffect(() => {
    let cancelled = false
    const prefetch = async () => {
      try {
        const res = await fetch(`/api/ebooks/${lessonId}`)
        if (!res.ok) throw new Error('Failed')
        const data: FetchedData = await res.json()
        if (!cancelled) setEbookData(data)
      } catch {
        if (!cancelled) setError(true)
      }
    }
    prefetch()
    return () => { cancelled = true }
  }, [lessonId])

  const fetchData = useCallback(async (): Promise<FetchedData | null> => {
    if (ebookData && ebookData.lesson.id === lessonId) return ebookData
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/ebooks/${lessonId}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data: FetchedData = await res.json()
      setEbookData(data)
      return data
    } catch (err) {
      console.error('Error fetching ebook:', err)
      setError(true)
      return null
    } finally {
      setLoading(false)
    }
  }, [lessonId, ebookData])

  const handlePreview = async () => {
    const data = await fetchData()
    if (data) setShowPreview(true)
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const data = await fetchData()
      if (!data) return

      const { lesson, ebook, settings } = data
      if (!ebook.isActive) {
        alert('E-Book ยังไม่พร้อมใช้งาน')
        return
      }

      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])
      const { buildCoverPage, buildTOCPage, buildContentPage, buildClosingPage } = await import('@/lib/ebook-pages')

      const accent = settings.accentColor || '#1e40af'
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pw = 210, ph = 297

      const renderPage = async (html: string): Promise<string> => {
        const el = document.createElement('div')
        el.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:1123px;overflow:hidden;'
        if (!document.head.querySelector('link[href*="Sarabun"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap'
          document.head.appendChild(link)
          await new Promise(r => setTimeout(r, 600))
        }
        el.innerHTML = html
        document.body.appendChild(el)
        await new Promise(r => setTimeout(r, 200))
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null, width: 794, height: 1123, logging: false })
        document.body.removeChild(el)
        return canvas.toDataURL('image/jpeg', 0.92)
      }

      const tocSections = ['บทนำ (Introduction)', 'แนวคิดหลัก (Key Concepts)', 'การประยุกต์ใช้ในธุรกิจ (Business Use Cases)', 'เครื่องมือและเทคนิค (Tools & Techniques)', 'ตัวอย่างปฏิบัติ (Practical Example)', 'บทสรุป (Summary)', 'สิ่งที่ควรจดจำ (Key Takeaways)', 'คำถามทบทวน (Review Questions)']

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

      const coverImg = await renderPage(buildCoverPage(lesson, ebook, accent))
      pdf.addImage(coverImg, 'JPEG', 0, 0, pw, ph)

      const tocImg = await renderPage(buildTOCPage(tocSections, accent))
      pdf.addPage()
      pdf.addImage(tocImg, 'JPEG', 0, 0, pw, ph)

      for (let i = 0; i < sections.length; i++) {
        if (!sections[i].content) continue
        const img = await renderPage(buildContentPage(i + 1, sections[i].title, sections[i].icon, sections[i].content!, i + 3, accent, settings))
        pdf.addPage()
        pdf.addImage(img, 'JPEG', 0, 0, pw, ph)
      }

      const closingImg = await renderPage(buildClosingPage(ebook.closingMessage || 'ขอบคุณที่ติดตามศึกษาบทเรียนนี้\nหวังว่าความรู้ที่ได้รับจะเป็นประโยชน์ในการพัฒนาตนเองและองค์กรของคุณ', accent))
      pdf.addPage()
      pdf.addImage(closingImg, 'JPEG', 0, 0, pw, ph)

      pdf.save(`ebook-${lesson.title.replace(/[^a-zA-Z0-9ก-๙]/g, '-').slice(0, 40)}.pdf`)
    } catch (err) {
      console.error('Ebook PDF error:', err)
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setDownloading(false)
    }
  }

  const handleExpand = () => setExpanded(prev => !prev)

  const pageCount = ebookData ? estimatePageCount(ebookData.ebook) : null

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-[#0a1628] to-cyan-500/5">
        {/* Header */}
        <div className="flex items-start gap-4 p-5">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30">
            <BookOpen className="h-6 w-6 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-white">
                E-Book ประกอบบทเรียน
              </h3>
              {pageCount && (
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 ring-1 ring-blue-500/20">
                  ~{pageCount} หน้า
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">
              เอกสารประกอบบทเรียนฉบับเต็มสำหรับบทนี้ สรุปแนวคิด เครื่องมือ และตัวอย่างการใช้งานจริง
            </p>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 border-t border-red-500/10 bg-red-500/5 px-5 py-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>ไม่สามารถโหลด E-Book ได้</span>
            <button onClick={() => fetchData()} className="ml-auto text-red-300 underline hover:text-red-200">ลองอีกครั้ง</button>
          </div>
        )}

        {/* Buttons */}
        {!error && (
          <div className="flex items-center gap-3 border-t border-blue-500/10 bg-blue-500/[0.03] px-5 py-3.5">
            <button
              onClick={handlePreview}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition-all hover:bg-blue-500/20 hover:text-blue-200 disabled:opacity-50"
            >
              {loading && !downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              Preview E-Book
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading || loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {downloading ? 'กำลังสร้าง PDF...' : 'Download PDF'}
            </button>
          </div>
        )}

        {/* Expandable summary */}
        {ebookData && (
          <>
            <button
              onClick={handleExpand}
              className="flex w-full items-center justify-between border-t border-blue-500/10 px-5 py-2.5 text-xs text-gray-500 transition-colors hover:bg-white/[0.02] hover:text-gray-400"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="h-3 w-3" />
                {expanded ? 'ซ่อนสรุปเนื้อหา' : 'ดูสรุปเนื้อหา E-Book'}
              </span>
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {expanded && (
              <div className="border-t border-blue-500/10 px-5 py-3">
                <p className="text-xs leading-relaxed text-gray-400">
                  {ebookData.ebook.ebookSummary
                    ? ebookData.ebook.ebookSummary.split('\n').filter(l => l.trim()).slice(0, 3).join(' ').slice(0, 200) + '...'
                    : `เอกสารประกอบบทเรียนฉบับเต็มสำหรับบทนี้ สรุปแนวคิด เครื่องมือ และตัวอย่างการใช้งานจริงเกี่ยวกับ ${lessonTitle}`
                  }
                </p>
                {pageCount && (
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-500">
                    <span>จำนวนหน้า: ~{pageCount} หน้า</span>
                    <span>โครงสร้าง: Cover, สารบัญ, 8 หัวข้อ, สรุป</span>
                  </div>
                )}
              </div>
            )}
          </>
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
