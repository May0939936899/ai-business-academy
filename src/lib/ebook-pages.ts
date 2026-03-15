// Shared E-Book page builders for PDF generation and preview
// Used by both EbookSection (download) and EbookPreviewModal (preview)

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
  BEGINNER: '\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19',
  INTERMEDIATE: '\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E01\u0E25\u0E32\u0E07',
  ADVANCED: '\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E02\u0E31\u0E49\u0E19\u0E2A\u0E39\u0E07',
}

export function buildCoverPage(lesson: LessonInfo, ebook: EbookData, accent: string): string {
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

      <!-- Top bar -->
      <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>

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
            <p style="color:#93c5fd;font-size:11px;margin:0;letter-spacing:2px;font-weight:600;">AI BUSINESS ACADEMY</p>
            <p style="color:#64748b;font-size:10px;margin:0;letter-spacing:1px;">\u0E04\u0E13\u0E30\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08 \u0E21\u0E2B\u0E32\u0E27\u0E34\u0E17\u0E22\u0E32\u0E25\u0E31\u0E22\u0E28\u0E23\u0E35\u0E1B\u0E17\u0E38\u0E21</p>
          </div>
        </div>
        <div style="padding:6px 14px;border-radius:20px;border:1px solid ${accent}40;background:${accent}20;">
          <span style="color:#93c5fd;font-size:10px;font-weight:600;letter-spacing:1px;">${lesson.courseCategory}</span>
        </div>
      </div>

      <!-- Main content -->
      <div style="position:absolute;top:140px;left:60px;right:60px;">
        <div style="display:inline-block;margin-bottom:20px;">
          <div style="display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:6px;background:${accent}30;border:1px solid ${accent}60;">
            <div style="width:8px;height:8px;border-radius:50%;background:${accent};"></div>
            <span style="color:${accent === '#1e40af' ? '#60a5fa' : accent};font-size:11px;font-weight:700;letter-spacing:3px;">E-BOOK | \u0E2A\u0E23\u0E38\u0E1B\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19</span>
          </div>
        </div>

        <p style="color:#475569;font-size:16px;margin:0 0 12px 0;font-weight:500;">\u0E1A\u0E17\u0E17\u0E35\u0E48 ${lesson.lessonOrder}</p>

        <h1 style="color:white;font-size:38px;font-weight:800;line-height:1.2;margin:0 0 16px 0;letter-spacing:-0.5px;">
          ${ebook.title || lesson.title}
        </h1>

        ${ebook.subtitle ? `
        <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 32px 0;max-width:560px;">${ebook.subtitle}</p>
        ` : ''}

        <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
          <div style="flex:1;height:1px;background:linear-gradient(90deg,${accent}80,transparent);"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:${accent};"></div>
        </div>

        <div style="display:flex;gap:24px;flex-wrap:wrap;">
          <div style="padding:14px 20px;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid #ffffff15;">
            <p style="color:#64748b;font-size:10px;margin:0 0 4px 0;letter-spacing:1px;">\u0E23\u0E30\u0E14\u0E31\u0E1A</p>
            <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0;">${level}</p>
          </div>
          <div style="padding:14px 20px;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid #ffffff15;">
            <p style="color:#64748b;font-size:10px;margin:0 0 4px 0;letter-spacing:1px;">\u0E2B\u0E25\u0E31\u0E01\u0E2A\u0E39\u0E15\u0E23</p>
            <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${lesson.courseName}</p>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div style="position:absolute;bottom:60px;left:60px;right:60px;">
        <div style="height:1px;background:linear-gradient(90deg,transparent,#334155,transparent);margin-bottom:20px;"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <p style="color:#334155;font-size:10px;margin:0;letter-spacing:1px;">AI BUSINESS ACADEMY \u2014 E-BOOK SERIES</p>
          <p style="color:#334155;font-size:10px;margin:0;">\u00A9 \u0E04\u0E13\u0E30\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08 \u0E21\u0E2B\u0E32\u0E27\u0E34\u0E17\u0E22\u0E32\u0E25\u0E31\u0E22\u0E28\u0E23\u0E35\u0E1B\u0E17\u0E38\u0E21</p>
        </div>
      </div>

      <div style="position:absolute;bottom:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
    </div>
  `
}

export function buildTOCPage(sections: string[], accent: string): string {
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
          <span style="color:${accent === '#1e40af' ? '#60a5fa' : accent};font-size:11px;font-weight:700;letter-spacing:3px;">\u0E2A\u0E32\u0E23\u0E1A\u0E31\u0E0D</span>
        </div>
        <h2 style="color:white;font-size:28px;font-weight:800;margin:0 0 8px 0;">Table of Contents</h2>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:40px;">
          <div style="width:40px;height:3px;background:${accent};border-radius:2px;"></div>
          <div style="width:20px;height:3px;background:#06b6d4;border-radius:2px;"></div>
        </div>

        ${items}
      </div>

      <div style="position:absolute;bottom:40px;left:72px;right:60px;display:flex;justify-content:space-between;align-items:center;">
        <p style="color:#334155;font-size:10px;margin:0;">AI Business Academy</p>
        <p style="color:#334155;font-size:10px;margin:0;">\u0E2A\u0E32\u0E23\u0E1A\u0E31\u0E0D</p>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
    </div>
  `
}

export function buildContentPage(
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
      const clean = line.replace(/^[-\u2022*]\s*/, '')
      if (line.match(/^\d+\.\s/)) {
        const [num, ...rest] = line.split(/\.\s+/)
        return `<div style="display:flex;gap:12px;margin-bottom:12px;align-items:flex-start;">
          <span style="color:${accent === '#1e40af' ? '#60a5fa' : accent};font-weight:700;font-size:14px;flex-shrink:0;min-width:20px;">${num}.</span>
          <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0;">${rest.join('. ')}</p>
        </div>`
      }
      if (line.match(/^[-\u2022*]/)) {
        return `<div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;">
          <div style="width:6px;height:6px;border-radius:50%;background:${accent === '#1e40af' ? '#60a5fa' : accent};flex-shrink:0;margin-top:8px;"></div>
          <p style="color:#cbd5e1;font-size:14px;line-height:1.8;margin:0;">${clean}</p>
        </div>`
      }
      return `<p style="color:#94a3b8;font-size:14px;line-height:1.9;margin-bottom:12px;">${line}</p>`
    })
    .join('')

  // Watermark at bottom center with opacity 0.15
  const watermark = settings.isWatermarkEnabled
    ? `<div style="
        position:absolute;bottom:50px;left:0;right:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        pointer-events:none;overflow:hidden;
      ">
        <p style="
          color:white;font-size:14px;font-weight:600;
          opacity:${settings.watermarkOpacity || 0.15};
          white-space:nowrap;
          font-family:'Sarabun',sans-serif;letter-spacing:2px;
        ">AI Business Academy</p>
        <p style="
          color:white;font-size:11px;font-weight:500;
          opacity:${settings.watermarkOpacity || 0.15};
          white-space:nowrap;
          font-family:'Sarabun',sans-serif;letter-spacing:1px;
          margin-top:2px;
        ">\u0E04\u0E13\u0E30\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08 \u0E21.\u0E28\u0E23\u0E35\u0E1B\u0E17\u0E38\u0E21</p>
      </div>`
    : ''

  return `
    <div style="width:794px;height:1123px;position:relative;overflow:hidden;background:#0d1b2e;font-family:'Sarabun',sans-serif;box-sizing:border-box;">
      ${watermark}

      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
      <div style="position:absolute;top:0;left:0;bottom:0;width:4px;background:linear-gradient(180deg,${accent},#06b6d4);"></div>

      <!-- Header -->
      <div style="
        padding:20px 60px 16px 72px;
        border-bottom:1px solid #1e2d40;
        display:flex;justify-content:space-between;align-items:center;
      ">
        <span style="color:#475569;font-size:10px;letter-spacing:2px;">${settings.headerText}</span>
        <span style="color:#475569;font-size:10px;">\u0E2B\u0E19\u0E49\u0E32 ${pageNum}</span>
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
            <p style="color:#475569;font-size:10px;margin:0 0 3px 0;letter-spacing:2px;font-weight:600;">\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E17\u0E35\u0E48 ${sectionNum}</p>
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

export function buildClosingPage(message: string, accent: string): string {
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
        ">\u2713</div>

        <h2 style="color:white;font-size:30px;font-weight:800;margin:0 0 8px 0;">\u0E08\u0E1A\u0E1A\u0E17\u0E40\u0E23\u0E35\u0E22\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27</h2>
        <p style="color:#60a5fa;font-size:14px;margin:0 0 32px 0;letter-spacing:1px;">Lesson Complete</p>

        <div style="
          padding:28px 32px;border-radius:16px;
          background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
          margin-bottom:36px;
        ">
          <p style="color:#94a3b8;font-size:14px;line-height:1.9;margin:0;white-space:pre-line;">${message}</p>
        </div>

        <div style="height:1px;background:linear-gradient(90deg,transparent,#334155,transparent);margin-bottom:24px;"></div>

        <p style="color:#1e40af;font-size:12px;margin:0 0 4px 0;font-weight:700;letter-spacing:2px;">AI BUSINESS ACADEMY</p>
        <p style="color:#334155;font-size:11px;margin:0;">\u0E04\u0E13\u0E30\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08 \u0E21\u0E2B\u0E32\u0E27\u0E34\u0E17\u0E22\u0E32\u0E25\u0E31\u0E22\u0E28\u0E23\u0E35\u0E1B\u0E17\u0E38\u0E21</p>
      </div>

      <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${accent},#06b6d4,${accent});"></div>
    </div>
  `
}
