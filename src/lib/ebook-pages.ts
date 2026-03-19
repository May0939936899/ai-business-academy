// ── Shared E-Book page builders for PDF generation and preview ──
// Used by EbookSection (download) and EbookPreviewModal (preview)

interface EbookData {
  title: string
  subtitle: string | null
}

interface LessonInfo {
  title: string
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
  isWatermarkEnabled: boolean
  accentColor: string
}

const LEVEL_TH: Record<string, string> = {
  BEGINNER: 'ระดับเริ่มต้น',
  INTERMEDIATE: 'ระดับกลาง',
  ADVANCED: 'ระดับขั้นสูง',
}

// ── Rich content block parser ──
// Supports [highlight], [trythis], [tools], [skills], [workshop], [casestudy]
function parseRichBlocks(content: string, accent: string): string {
  const accentLight = accent === '#1e40af' ? '#60a5fa' : accent

  // [highlight title="..."]...[/highlight]
  content = content.replace(
    /\[highlight(?:\s+title="([^"]*)")?\]([\s\S]*?)\[\/highlight\]/g,
    (_, title, body) => {
      const lines = body.trim().split('\n').filter((l: string) => l.trim())
        .map((l: string) => `<p style="color:#e2e8f0;font-size:13px;line-height:1.8;margin:0 0 4px 0;">${l.replace(/^[-•*]\s*/, '• ')}</p>`).join('')
      return `<div style="margin:16px 0;padding:16px 20px;border-radius:12px;background:${accent}15;border-left:4px solid ${accent};border:1px solid ${accent}30;">
        ${title ? `<p style="color:${accentLight};font-size:12px;font-weight:700;margin:0 0 8px 0;letter-spacing:1px;">💡 ${title}</p>` : ''}
        ${lines}
      </div>`
    }
  )

  // [trythis]...[/trythis]
  content = content.replace(
    /\[trythis\]([\s\S]*?)\[\/trythis\]/g,
    (_, body) => {
      const lines = body.trim().split('\n').filter((l: string) => l.trim())
        .map((l: string) => `<p style="color:#d1fae5;font-size:13px;line-height:1.7;margin:0 0 4px 0;">${l}</p>`).join('')
      return `<div style="margin:16px 0;padding:16px 20px;border-radius:12px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);">
        <p style="color:#34d399;font-size:12px;font-weight:700;margin:0 0 8px 0;letter-spacing:1px;">🚀 ลองทำดู! (Try This)</p>
        ${lines}
      </div>`
    }
  )

  // [tools]...[/tools] — each line: toolName | description
  content = content.replace(
    /\[tools\]([\s\S]*?)\[\/tools\]/g,
    (_, body) => {
      const tools = body.trim().split('\n').filter((l: string) => l.trim()).map((line: string) => {
        const [name, desc] = line.split('|').map((s: string) => s.trim())
        const icons: Record<string, string> = { ChatGPT: '🤖', 'Canva': '🎨', 'Notion': '📝', 'Make': '⚙️', 'Zapier': '⚡', 'Gemini': '✨', 'Midjourney': '🎭', 'Claude': '🧠', 'Power BI': '📊', 'Tableau': '📈', 'Excel': '📗' }
        const icon = icons[name] || '🔧'
        return `<div style="flex:1;min-width:140px;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
          <p style="color:white;font-size:13px;font-weight:700;margin:0 0 4px 0;">${icon} ${name}</p>
          ${desc ? `<p style="color:#94a3b8;font-size:11px;line-height:1.5;margin:0;">${desc}</p>` : ''}
        </div>`
      }).join('')
      return `<div style="margin:16px 0;">
        <p style="color:${accentLight};font-size:12px;font-weight:700;margin:0 0 10px 0;letter-spacing:1px;">🔧 เครื่องมือแนะนำ</p>
        <div style="display:flex;flex-wrap:wrap;gap:10px;">${tools}</div>
      </div>`
    }
  )

  // [skills]...[/skills] — each line: role | rating(1-5) | description
  content = content.replace(
    /\[skills\]([\s\S]*?)\[\/skills\]/g,
    (_, body) => {
      const items = body.trim().split('\n').filter((l: string) => l.trim()).map((line: string) => {
        const parts = line.split('|').map((s: string) => s.trim())
        const role = parts[0] || ''
        const rating = parseInt(parts[1] || '3')
        const desc = parts[2] || ''
        const stars = Array.from({ length: 5 }, (__, i) =>
          `<span style="color:${i < rating ? '#fbbf24' : '#374151'};font-size:14px;">★</span>`
        ).join('')
        return `<div style="padding:12px 16px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <p style="color:white;font-size:13px;font-weight:700;margin:0;">💼 ${role}</p>
            <div>${stars}</div>
          </div>
          ${desc ? `<p style="color:#94a3b8;font-size:11px;line-height:1.5;margin:0;">${desc}</p>` : ''}
        </div>`
      }).join('')
      return `<div style="margin:16px 0;">
        <p style="color:${accentLight};font-size:12px;font-weight:700;margin:0 0 10px 0;letter-spacing:1px;">🎯 Skills &amp; Career Mapping</p>
        ${items}
      </div>`
    }
  )

  // [workshop]...[/workshop]
  content = content.replace(
    /\[workshop\]([\s\S]*?)\[\/workshop\]/g,
    (_, body) => {
      const lines = body.trim().split('\n').filter((l: string) => l.trim())
        .map((l: string) => `<p style="color:#e2e8f0;font-size:13px;line-height:1.7;margin:0 0 4px 0;">${l}</p>`).join('')
      return `<div style="margin:16px 0;padding:16px 20px;border-radius:12px;background:linear-gradient(135deg,rgba(168,85,247,0.08),rgba(59,130,246,0.08));border:1px solid rgba(168,85,247,0.25);">
        <p style="color:#c084fc;font-size:12px;font-weight:700;margin:0 0 8px 0;letter-spacing:1px;">🛠️ Workshop — ลงมือทำ</p>
        ${lines}
      </div>`
    }
  )

  // [prompt]...[/prompt]
  content = content.replace(
    /\[prompt\]([\s\S]*?)\[\/prompt\]/g,
    (_, body) => {
      return `<div style="margin:12px 0;padding:14px 18px;border-radius:10px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);font-family:monospace;">
        <p style="color:#94a3b8;font-size:10px;font-weight:600;margin:0 0 6px 0;letter-spacing:1px;">📋 PROMPT EXAMPLE</p>
        <p style="color:#a5f3fc;font-size:12px;line-height:1.6;margin:0;white-space:pre-wrap;">${body.trim()}</p>
      </div>`
    }
  )

  // [casestudy]...[/casestudy] — before/after separated by ---
  content = content.replace(
    /\[casestudy\]([\s\S]*?)\[\/casestudy\]/g,
    (_, body) => {
      const [beforeBlock, afterBlock] = body.split('---').map((s: string) => s.trim())
      const formatLines = (text: string) => text.split('\n').filter((l: string) => l.trim())
        .map((l: string) => `<p style="font-size:12px;line-height:1.6;margin:0 0 3px 0;">${l}</p>`).join('')
      return `<div style="margin:16px 0;display:flex;gap:12px;">
        <div style="flex:1;padding:14px 16px;border-radius:10px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);">
          <p style="color:#f87171;font-size:11px;font-weight:700;margin:0 0 8px 0;">❌ BEFORE</p>
          <div style="color:#fca5a5;">${formatLines(beforeBlock || '')}</div>
        </div>
        <div style="flex:1;padding:14px 16px;border-radius:10px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.2);">
          <p style="color:#4ade80;font-size:11px;font-weight:700;margin:0 0 8px 0;">✅ AFTER</p>
          <div style="color:#86efac;">${formatLines(afterBlock || '')}</div>
        </div>
      </div>`
    }
  )

  return content
}

// ── Standard text paragraph renderer ──
function renderParagraphs(content: string, accent: string): string {
  // First parse rich blocks
  const parsed = parseRichBlocks(content, accent)
  const accentLight = accent === '#1e40af' ? '#60a5fa' : accent

  // Then render remaining plain lines
  return parsed
    .split('\n')
    .map(line => {
      const trimmed = line.trim()
      if (!trimmed) return ''
      // Skip lines that are already HTML from rich block parsing
      if (trimmed.startsWith('<div') || trimmed.startsWith('<p') || trimmed.startsWith('</')) return line

      // Numbered list
      if (trimmed.match(/^\d+\.\s/)) {
        const [num, ...rest] = trimmed.split(/\.\s+/)
        return `<div style="display:flex;gap:12px;margin-bottom:10px;align-items:flex-start;">
          <span style="color:${accentLight};font-weight:700;font-size:14px;flex-shrink:0;min-width:20px;">${num}.</span>
          <p style="color:#cbd5e1;font-size:13px;line-height:1.8;margin:0;">${rest.join('. ')}</p>
        </div>`
      }
      // Bullet
      if (trimmed.match(/^[-•*]/)) {
        const clean = trimmed.replace(/^[-•*]\s*/, '')
        return `<div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start;">
          <div style="width:5px;height:5px;border-radius:50%;background:${accentLight};flex-shrink:0;margin-top:8px;"></div>
          <p style="color:#cbd5e1;font-size:13px;line-height:1.8;margin:0;">${clean}</p>
        </div>`
      }
      // Section heading (bold line ending with :)
      if (trimmed.endsWith(':') && trimmed.length < 80) {
        return `<p style="color:white;font-size:14px;font-weight:700;margin:16px 0 8px 0;">${trimmed}</p>`
      }
      // Regular paragraph
      return `<p style="color:#94a3b8;font-size:13px;line-height:1.9;margin-bottom:10px;">${trimmed}</p>`
    })
    .join('')
}

// ── Cover page ──
export function buildCoverPage(lesson: LessonInfo, ebook: EbookData, accent: string): string {
  const level = LEVEL_TH[lesson.lessonLevel] || lesson.lessonLevel
  return `
    <div style="
      width:794px;height:1123px;position:relative;overflow:hidden;
      background:linear-gradient(145deg,#0a1628 0%,#1e3a5f 40%,#0f2d50 100%);
      font-family:'Sarabun',sans-serif;box-sizing:border-box;
    ">
      <div style="position:absolute;top:-120px;right:-120px;width:400px;height:400px;border-radius:50%;background:${accent};opacity:0.12;"></div>
      <div style="position:absolute;bottom:-80px;left:-80px;width:300px;height:300px;border-radius:50%;background:${accent};opacity:0.08;"></div>
      <div style="position:absolute;top:200px;left:-60px;width:200px;height:200px;border-radius:50%;background:#06b6d4;opacity:0.06;"></div>

      <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>

      <div style="position:absolute;top:40px;left:60px;right:60px;display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,${accent},#06b6d4);display:flex;align-items:center;justify-content:center;">
            <span style="color:white;font-size:20px;font-weight:bold;">A</span>
          </div>
          <div>
            <p style="color:#93c5fd;font-size:11px;margin:0;letter-spacing:2px;font-weight:600;">AI SPUBUS ACADEMY</p>
            <p style="color:#64748b;font-size:10px;margin:0;letter-spacing:1px;">คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม</p>
          </div>
        </div>
        <div style="padding:6px 14px;border-radius:20px;border:1px solid ${accent}40;background:${accent}20;">
          <span style="color:#93c5fd;font-size:10px;font-weight:600;letter-spacing:1px;">${lesson.courseCategory}</span>
        </div>
      </div>

      <div style="position:absolute;top:140px;left:60px;right:60px;">
        <div style="display:inline-block;margin-bottom:20px;">
          <div style="display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:6px;background:${accent}30;border:1px solid ${accent}60;">
            <div style="width:8px;height:8px;border-radius:50%;background:${accent};"></div>
            <span style="color:${accent === '#1e40af' ? '#60a5fa' : accent};font-size:11px;font-weight:700;letter-spacing:3px;">E-BOOK | สรุปบทเรียน</span>
          </div>
        </div>

        <p style="color:#475569;font-size:16px;margin:0 0 12px 0;font-weight:500;">บทที่ ${lesson.lessonOrder}</p>

        <h1 style="color:white;font-size:38px;font-weight:800;line-height:1.2;margin:0 0 16px 0;letter-spacing:-0.5px;">
          ${ebook.title || lesson.title}
        </h1>

        ${ebook.subtitle ? `<p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 32px 0;max-width:560px;">${ebook.subtitle}</p>` : ''}

        <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
          <div style="flex:1;height:1px;background:linear-gradient(90deg,${accent}80,transparent);"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:${accent};"></div>
        </div>

        <div style="display:flex;gap:24px;flex-wrap:wrap;">
          <div style="padding:14px 20px;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid #ffffff15;">
            <p style="color:#64748b;font-size:10px;margin:0 0 4px 0;letter-spacing:1px;">ระดับ</p>
            <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0;">${level}</p>
          </div>
          <div style="padding:14px 20px;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid #ffffff15;">
            <p style="color:#64748b;font-size:10px;margin:0 0 4px 0;letter-spacing:1px;">หลักสูตร</p>
            <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${lesson.courseName}</p>
          </div>
          <div style="padding:14px 20px;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid #ffffff15;">
            <p style="color:#64748b;font-size:10px;margin:0 0 4px 0;letter-spacing:1px;">จำนวนหน้า</p>
            <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0;">10 หน้า</p>
          </div>
        </div>
      </div>

      <div style="position:absolute;bottom:60px;left:60px;right:60px;">
        <div style="height:1px;background:linear-gradient(90deg,transparent,#334155,transparent);margin-bottom:20px;"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <p style="color:#334155;font-size:10px;margin:0;letter-spacing:1px;">AI SPUBUS ACADEMY — E-BOOK SERIES</p>
          <p style="color:#334155;font-size:10px;margin:0;">© คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม</p>
        </div>
      </div>

      <div style="position:absolute;bottom:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
    </div>
  `
}

// ── Table of Contents ──
export function buildTOCPage(sections: string[], accent: string): string {
  const items = sections.map((s, i) => `
    <div style="display:flex;align-items:center;gap:0;margin-bottom:18px;">
      <div style="width:36px;height:36px;border-radius:8px;flex-shrink:0;background:${accent}20;border:1px solid ${accent}40;display:flex;align-items:center;justify-content:center;">
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

// ── Content page (with rich block support) ──
export function buildContentPage(
  sectionNum: number,
  sectionTitle: string,
  sectionIcon: string,
  content: string,
  pageNum: number,
  accent: string,
  settings: EbookSettings
): string {
  const renderedContent = renderParagraphs(content, accent)

  const watermark = settings.isWatermarkEnabled
    ? `<div style="position:absolute;bottom:50px;left:0;right:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;overflow:hidden;">
        <p style="color:white;font-size:14px;font-weight:600;opacity:${settings.watermarkOpacity || 0.15};white-space:nowrap;font-family:'Sarabun',sans-serif;letter-spacing:2px;">AI SPUBUS Academy</p>
        <p style="color:white;font-size:11px;font-weight:500;opacity:${settings.watermarkOpacity || 0.15};white-space:nowrap;font-family:'Sarabun',sans-serif;letter-spacing:1px;margin-top:2px;">คณะบริหารธุรกิจ ม.ศรีปทุม</p>
      </div>`
    : ''

  return `
    <div style="width:794px;height:1123px;position:relative;overflow:hidden;background:#0d1b2e;font-family:'Sarabun',sans-serif;box-sizing:border-box;">
      ${watermark}

      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
      <div style="position:absolute;top:0;left:0;bottom:0;width:4px;background:linear-gradient(180deg,${accent},#06b6d4);"></div>

      <div style="padding:20px 60px 16px 72px;border-bottom:1px solid #1e2d40;display:flex;justify-content:space-between;align-items:center;">
        <span style="color:#475569;font-size:10px;letter-spacing:2px;">${settings.headerText}</span>
        <span style="color:#475569;font-size:10px;">หน้า ${pageNum}</span>
      </div>

      <div style="padding:24px 60px 0 72px;">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:6px;">
          <div style="width:40px;height:40px;border-radius:10px;flex-shrink:0;background:${accent}25;border:1px solid ${accent}50;display:flex;align-items:center;justify-content:center;font-size:18px;">${sectionIcon}</div>
          <div>
            <p style="color:#475569;font-size:10px;margin:0 0 3px 0;letter-spacing:2px;font-weight:600;">หัวข้อที่ ${sectionNum}</p>
            <h3 style="color:white;font-size:20px;font-weight:800;margin:0;">${sectionTitle}</h3>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;margin-top:12px;">
          <div style="width:32px;height:3px;background:${accent};border-radius:2px;"></div>
          <div style="width:16px;height:3px;background:#06b6d4;border-radius:2px;"></div>
        </div>
      </div>

      <div style="padding:0 60px 20px 72px;overflow:hidden;max-height:860px;">
        ${renderedContent}
      </div>

      <div style="position:absolute;bottom:0;left:0;right:0;border-top:1px solid #1e2d40;padding:12px 60px 16px 72px;display:flex;justify-content:space-between;align-items:center;">
        <p style="color:#334155;font-size:10px;margin:0;">${settings.footerText}</p>
        <p style="color:#334155;font-size:10px;margin:0;">${pageNum}</p>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
    </div>
  `
}

// ── Closing page ──
export function buildClosingPage(message: string, accent: string): string {
  return `
    <div style="
      width:794px;height:1123px;position:relative;overflow:hidden;
      background:linear-gradient(145deg,#0a1628 0%,#1e3a5f 60%,#0f2d50 100%);
      font-family:'Sarabun',sans-serif;box-sizing:border-box;
    ">
      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>

      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;width:600px;">
        <div style="width:80px;height:80px;border-radius:50%;margin:0 auto 28px;background:linear-gradient(135deg,${accent},#06b6d4);display:flex;align-items:center;justify-content:center;font-size:36px;">✓</div>

        <h2 style="color:white;font-size:30px;font-weight:800;margin:0 0 8px 0;">จบบทเรียนเรียบร้อยแล้ว</h2>
        <p style="color:#60a5fa;font-size:14px;margin:0 0 32px 0;letter-spacing:1px;">Lesson Complete</p>

        <div style="padding:28px 32px;border-radius:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);margin-bottom:36px;">
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
