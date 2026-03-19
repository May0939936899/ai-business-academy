import { NextResponse } from 'next/server'
import db from '@/lib/db'

// ── Auto-generate rich ebook content (10-page standard) ──
function autoGenerateEbook(lesson: {
  title: string
  subtitle: string | null
  description: string | null
  summary: string | null
  learningOutcomes: string | null
  keyTakeaways: string | null
  lessonLevel: string
  course: { title: string; category: string }
}) {
  const level =
    lesson.lessonLevel === 'BEGINNER'
      ? 'ระดับเริ่มต้น'
      : lesson.lessonLevel === 'INTERMEDIATE'
      ? 'ระดับกลาง'
      : 'ระดับขั้นสูง'

  const title = lesson.title
  const courseName = lesson.course.title
  const category = lesson.course.category
  const desc = lesson.description || ''
  const summary = lesson.summary || ''
  const outcomes = lesson.learningOutcomes || ''
  const takeaways = lesson.keyTakeaways || ''

  return {
    title: lesson.title,
    subtitle: lesson.subtitle || `คู่มือประกอบการเรียนรู้ | หลักสูตร ${courseName} | ${category}`,

    // Page 2: Introduction
    introduction: [
      `ยินดีต้อนรับสู่ E-Book "${title}" 🚀`,
      `ซึ่งเป็นส่วนหนึ่งของหลักสูตร "${courseName}" (${level}) จัดทำโดย AI SPUBUS Academy`,
      ``,
      desc ? desc : `บทเรียนนี้จะพาคุณทำความเข้าใจเกี่ยวกับ ${title} ตั้งแต่แนวคิดพื้นฐาน ไปจนถึงการนำไปประยุกต์ใช้จริงในบริบทธุรกิจ`,
      ``,
      `[highlight title="สิ่งที่คุณจะได้เรียนรู้"]`,
      outcomes
        ? outcomes
        : `- เข้าใจแนวคิดหลักและความสำคัญของ ${title}\n- วิเคราะห์และเชื่อมโยงทฤษฎีกับการปฏิบัติจริงได้\n- นำ ${title} ไปประยุกต์ใช้กับองค์กรหรือโปรเจกต์ของตนเอง\n- เรียนรู้เครื่องมือและเทคนิคที่ทันสมัย`,
      `[/highlight]`,
      ``,
      `E-Book เล่มนี้รวบรวมเนื้อหาสำคัญจากบทเรียน พร้อมตัวอย่าง กรณีศึกษา และ Workshop ลงมือทำ เพื่อให้คุณใช้เป็นคู่มือทบทวนและอ้างอิงได้ตลอดเวลา`,
    ].join('\n'),

    // Page 3: Key Concepts (What is AI / What is this topic)
    keyConcepts: [
      summary ? summary : `${title} คือแนวคิดสำคัญในสาขา ${category} ที่กำลังเปลี่ยนแปลงโลกธุรกิจ`,
      ``,
      `[highlight title="Key Insight"]`,
      `${title} ไม่ใช่แค่เทคโนโลยี — แต่เป็นวิธีคิดและกระบวนการใหม่ที่ช่วยให้ธุรกิจทำงานได้ดีขึ้น เร็วขึ้น และฉลาดขึ้น`,
      `[/highlight]`,
      ``,
      `แนวคิดสำคัญ 4 ด้าน:`,
      ``,
      `1. ความหมายและขอบเขต — ${title} ครอบคลุมแนวคิด กระบวนการ และเครื่องมือที่ช่วยให้ธุรกิจปรับตัวในยุคดิจิทัล ผู้เรียนจะได้เข้าใจคำนิยามและพัฒนาการจนถึงปัจจุบัน`,
      ``,
      `2. ความสำคัญต่อธุรกิจ — ช่วยเพิ่มขีดความสามารถในการแข่งขัน ลดต้นทุน และสร้างมูลค่าเพิ่มทั้งระดับปฏิบัติการและระดับกลยุทธ์`,
      ``,
      `3. หลักการพื้นฐาน — ประกอบด้วยทฤษฎี โมเดล และ Framework ที่ได้รับการยอมรับในวงวิชาการและอุตสาหกรรม`,
      ``,
      `4. แนวโน้มและทิศทาง — ${category} กำลังเปลี่ยนแปลงด้วย AI, Cloud Computing, Data Analytics และ Automation`,
      ``,
      `[trythis]`,
      `ลองถามตัวเอง: "${title} จะเปลี่ยนวิธีการทำงานในอุตสาหกรรมของฉันอย่างไร?"`,
      `จดคำตอบสั้นๆ 3 ข้อ เพื่อเชื่อมโยงกับบริบทของตัวเอง`,
      `[/trythis]`,
    ].join('\n'),

    // Page 4: Business Use Cases (AI in Business — 4 areas)
    businessUseCases: [
      `การประยุกต์ใช้ ${title} ใน 4 ด้านหลักของธุรกิจ:`,
      ``,
      `1. 📣 Marketing & Sales`,
      `   ใช้ AI วิเคราะห์พฤติกรรมลูกค้า สร้าง Content อัตโนมัติ Personalize ข้อเสนอ และเพิ่ม Conversion Rate ตัวอย่าง: ใช้ ChatGPT เขียน Ad Copy แล้ว A/B Test ได้เร็วขึ้น 10 เท่า`,
      ``,
      `2. 👥 HR & People Management`,
      `   Screening Resume อัตโนมัติ, สร้าง JD, วิเคราะห์ Employee Engagement, และวางแผน Training ตัวอย่าง: ใช้ AI คัดกรองใบสมัคร 500 ฉบับเหลือ Top 20 ภายใน 5 นาที`,
      ``,
      `3. ⚙️ Operations & Automation`,
      `   Workflow Automation, ลดงาน Manual, เพิ่มความเร็วกระบวนการ ตัวอย่าง: ใช้ Make/Zapier เชื่อมระบบให้รายงานยอดขายรายวันส่งเข้า LINE Group อัตโนมัติ`,
      ``,
      `4. 📊 Data & Analytics`,
      `   วิเคราะห์ข้อมูล สร้าง Dashboard อัตโนมัติ ทำนายแนวโน้ม ตัวอย่าง: ใช้ Power BI + AI Insights ดู Sales Trend แล้วพยากรณ์รายได้เดือนถัดไปอัตโนมัติ`,
      ``,
      `[highlight title="ธุรกิจ SME ไทยก็ทำได้!"]`,
      `ไม่ต้องเป็นบริษัทใหญ่ก็ใช้ AI ได้ ร้านกาแฟใช้ ChatGPT เขียน Social Post, โรงงานเล็กใช้ Zapier จัดการออเดอร์, ร้านออนไลน์ใช้ Canva AI ออกแบบภาพสินค้า — เริ่มเล็กๆ วันนี้!`,
      `[/highlight]`,
    ].join('\n'),

    // Page 5: Case Study (Before vs After)
    practicalExample: [
      `กรณีศึกษา: บริษัท TechGrow ใช้ ${title} เปลี่ยนธุรกิจ`,
      ``,
      `บริษัท TechGrow Co., Ltd. เป็นธุรกิจ E-Commerce ขนาดกลาง มีพนักงาน 80 คน ยอดขายเดือนละ 5 ล้านบาท ต้องการเพิ่มประสิทธิภาพด้วย ${title}`,
      ``,
      `[casestudy]`,
      `ทำ Content เอง 2 ชิ้น/สัปดาห์`,
      `ตอบแชทลูกค้าล่าช้า 2-3 ชม.`,
      `วิเคราะห์ข้อมูลด้วย Excel ใช้เวลา 2 วัน`,
      `รายงานยอดขายทำ Manual ทุกเดือน`,
      `---`,
      `Content 15 ชิ้น/สัปดาห์ ด้วย AI`,
      `ตอบแชท Auto ภายใน 30 วินาที`,
      `Dashboard Real-time ดูได้ทันที`,
      `รายงานอัตโนมัติส่งทุกเช้า 8:00`,
      `[/casestudy]`,
      ``,
      `ผลลัพธ์หลัง 3 เดือน:`,
      `- ยอดขายเพิ่ม 35%`,
      `- ลดต้นทุนดำเนินงาน 20%`,
      `- คะแนน CSAT เพิ่มจาก 72% เป็น 91%`,
      `- ทีมงานมีเวลาทำงานเชิงกลยุทธ์มากขึ้น`,
      ``,
      `[highlight title="บทเรียนสำคัญ"]`,
      `เริ่มจากปัญหาที่เจ็บที่สุดก่อน → ทำ Pilot เล็กๆ → วัดผล → ขยายผล`,
      `[/highlight]`,
    ].join('\n'),

    // Page 6: How to Start (Step-by-step)
    ebookSummary: [
      `วิธีเริ่มต้นใช้ ${title} ใน 5 ขั้นตอน:`,
      ``,
      `1. 🎯 กำหนดเป้าหมาย`,
      `   ระบุให้ชัดว่าต้องการแก้ปัญหาอะไร? ลดต้นทุน? เพิ่มยอดขาย? ปรับปรุง CX?`,
      `   ตั้ง KPI ที่วัดผลได้ เช่น "ลดเวลาตอบลูกค้าจาก 2 ชม. เหลือ 15 นาที"`,
      ``,
      `2. 🔍 เลือกเครื่องมือที่เหมาะ`,
      `   ไม่ต้องใช้ทุกอย่าง เลือก 1-2 เครื่องมือที่ตอบโจทย์มากที่สุด`,
      `   เริ่มจากเครื่องมือฟรีก่อน เช่น ChatGPT Free, Canva Free, Google Analytics`,
      ``,
      `3. 🧪 ทำ Pilot Project`,
      `   ทดลองกับทีมเล็กๆ หรือโปรเจกต์เดียวก่อน อย่าเปลี่ยนทั้งองค์กรทีเดียว`,
      `   กำหนดระยะเวลาชัดเจน เช่น ทดลอง 2 สัปดาห์`,
      ``,
      `4. 📏 วัดผลและปรับปรุง`,
      `   เทียบผลก่อน-หลัง ด้วยตัวเลขจริง`,
      `   เก็บ Feedback จากทีมและลูกค้า`,
      ``,
      `5. 📈 ขยายผล`,
      `   เมื่อเห็นผลดี ค่อยๆ ขยายไปแผนกอื่น`,
      `   สร้าง SOP และ Training สำหรับทีม`,
      ``,
      `[trythis]`,
      `วันนี้ลองทำ 1 อย่าง: เปิด ChatGPT แล้วลองใช้กับงานที่ทำอยู่ 1 งาน`,
      `เช่น สรุปรายงาน, เขียนอีเมล, หา Idea ใหม่ — แล้วดูว่าเร็วขึ้นแค่ไหน!`,
      `[/trythis]`,
    ].join('\n'),

    // Page 7: Tools & Techniques
    toolsAndTechniques: [
      `เครื่องมือ AI ที่แนะนำสำหรับ ${title}:`,
      ``,
      `[tools]`,
      `ChatGPT | เขียน Content, สรุปข้อมูล, ตอบคำถาม, Brainstorm ไอเดีย`,
      `Canva | ออกแบบกราฟิก, สร้าง Presentation, แก้ไขรูปภาพด้วย AI`,
      `Notion | จัดการโปรเจกต์, สร้าง Wiki, ฐานข้อมูลทีม, AI Writing`,
      `Make | สร้าง Workflow อัตโนมัติ เชื่อมต่อแอปหลายร้อยตัว`,
      `[/tools]`,
      ``,
      `เทคนิคการใช้งานให้ได้ผลดี:`,
      ``,
      `- 🎯 Prompt Engineering — เขียนคำสั่งให้ชัดเจน ระบุบทบาท บริบท และ Output ที่ต้องการ`,
      `- 🔄 Iterative Approach — ทำทีละ Step ปรับ Prompt จากผลลัพธ์`,
      `- 🤝 Human + AI — ให้ AI ช่วยร่าง แต่มนุษย์ตรวจสอบและตัดสินใจ`,
      `- 📋 Template System — สร้าง Prompt Template สำหรับงานที่ทำซ้ำ`,
      ``,
      `[prompt]`,
      `คุณเป็นผู้เชี่ยวชาญด้าน ${category}`,
      `ช่วยวิเคราะห์ [ใส่หัวข้อ] ให้หน่อย`,
      `โดยครอบคลุม: 1) สถานการณ์ปัจจุบัน 2) ปัญหา 3) แนวทางแก้ไข`,
      `ตอบเป็นภาษาไทย กระชับ ใช้ Bullet points`,
      `[/prompt]`,
    ].join('\n'),

    // Page 8: Skills & Career Mapping
    ebookKeyTakeaways: [
      `ทักษะที่จำเป็นและเส้นทางอาชีพที่เกี่ยวข้องกับ ${title}:`,
      ``,
      `[skills]`,
      `AI Business Strategist | 4 | วางกลยุทธ์ AI สำหรับองค์กร วิเคราะห์โอกาสทางธุรกิจ`,
      `Data Analyst | 4 | วิเคราะห์ข้อมูล สร้าง Dashboard ทำ Business Intelligence`,
      `AI Content Creator | 3 | สร้าง Content ด้วย AI ทั้งข้อความ ภาพ และวิดีโอ`,
      `[/skills]`,
      ``,
      `ทักษะพื้นฐานที่ควรพัฒนา:`,
      `- Critical Thinking — คิดวิเคราะห์ ตั้งคำถามกับข้อมูล`,
      `- Prompt Engineering — เขียนคำสั่ง AI ให้ได้ผลตามต้องการ`,
      `- Data Literacy — อ่านและตีความข้อมูลเบื้องต้น`,
      `- Digital Communication — สื่อสารผ่านเครื่องมือดิจิทัล`,
      `- Adaptability — ปรับตัวกับเทคโนโลยีใหม่`,
      ``,
      `[highlight title="เส้นทางการเรียนรู้ต่อ"]`,
      `จบบทนี้แล้ว → ลองทำ Workshop → ทำ Quiz → เรียนบทถัดไป → สะสม Certificate!`,
      `[/highlight]`,
    ].join('\n'),

    // Page 9: Workshop
    reviewQuestions: [
      `Workshop: ลงมือทำจริง! 🛠️`,
      ``,
      `[workshop]`,
      `โจทย์: ใช้ AI วิเคราะห์และวางแผนสำหรับธุรกิจของคุณ`,
      ``,
      `ขั้นตอน:`,
      `1. เลือกปัญหา 1 อย่างในงานของคุณที่อยากแก้`,
      `2. เปิด ChatGPT (หรือ AI ที่ชอบ)`,
      `3. ใช้ Prompt ด้านล่างนี้`,
      `4. อ่านผลลัพธ์และปรับ Prompt ให้ตรงประเด็นมากขึ้น`,
      `5. จดสรุป 3 ข้อที่นำไปใช้ได้จริง`,
      `[/workshop]`,
      ``,
      `ตัวอย่าง Prompt ที่ใช้ได้เลย:`,
      ``,
      `[prompt]`,
      `ฉันทำธุรกิจ [ประเภทธุรกิจ] มีพนักงาน [จำนวน] คน`,
      `ปัญหาหลักตอนนี้คือ [อธิบายปัญหา]`,
      ``,
      `ช่วยวิเคราะห์และเสนอแนวทางแก้ไขโดยใช้ ${title}`,
      `โดยแบ่งเป็น:`,
      `1. Quick Win (ทำได้ภายใน 1 สัปดาห์)`,
      `2. Medium-term (1-3 เดือน)`,
      `3. Long-term (3-6 เดือน)`,
      ``,
      `ระบุเครื่องมือที่แนะนำและ ROI ที่คาดหวังด้วย`,
      `[/prompt]`,
      ``,
      `[trythis]`,
      `ลอง Copy prompt ด้านบนไปใช้จริงตอนนี้เลย!`,
      `แล้วแชร์ผลลัพธ์กับเพื่อนร่วมทีม หรือโพสต์ใน Community ของ SPUBUS Academy`,
      `[/trythis]`,
    ].join('\n'),

    // Page 10: Summary + Next Step
    closingMessage: `ขอแสดงความยินดีที่คุณได้ศึกษา "${title}" จนจบ! 🎉\n\n📌 สิ่งสำคัญที่ได้เรียนรู้:\n• แนวคิดพื้นฐานและความสำคัญของ ${title}\n• การประยุกต์ใช้ใน 4 ด้านหลักของธุรกิจ\n• เครื่องมือ AI ที่ใช้ได้จริงวันนี้\n• ทักษะและเส้นทางอาชีพที่เกี่ยวข้อง\n\n🚀 Next Steps:\n1. ทำ Workshop ที่ให้ไว้ในบทนี้\n2. ทำแบบทดสอบท้ายบท\n3. เรียนบทถัดไปเพื่อต่อยอดความรู้\n4. สะสม Certificate เมื่อเรียนครบ!\n\n— ทีมงาน AI SPUBUS Academy\nคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม`,
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: { select: { title: true, category: true } },
        ebook: true,
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Return DB ebook if exists, otherwise auto-generate
    const ebookData = lesson.ebook
      ? {
          title: lesson.ebook.title || lesson.title,
          subtitle: lesson.ebook.subtitle,
          coverImageUrl: lesson.ebook.coverImageUrl,
          introduction: lesson.ebook.introduction,
          keyConcepts: lesson.ebook.keyConcepts,
          businessUseCases: lesson.ebook.businessUseCases,
          toolsAndTechniques: lesson.ebook.toolsAndTechniques,
          practicalExample: lesson.ebook.practicalExample,
          ebookSummary: lesson.ebook.ebookSummary,
          ebookKeyTakeaways: lesson.ebook.ebookKeyTakeaways,
          reviewQuestions: lesson.ebook.reviewQuestions,
          closingMessage: lesson.ebook.closingMessage,
          pdfUrl: lesson.ebook.pdfUrl,
          isActive: lesson.ebook.isActive,
          isCustom: true,
        }
      : { ...autoGenerateEbook(lesson), pdfUrl: null, isActive: true, isCustom: false }

    // Get global settings
    let settings = await db.ebookSettings.findUnique({ where: { id: 'global' } })
    if (!settings) {
      settings = await db.ebookSettings.upsert({
        where: { id: 'global' },
        create: {
          id: 'global',
          watermarkText: 'AI SPUBUS Academy | คณะบริหารธุรกิจ ม.ศรีปทุม',
          watermarkOpacity: 0.15,
          headerText: 'AI SPUBUS Academy',
          footerText: 'คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม',
          isWatermarkEnabled: true,
          accentColor: '#1e40af',
        },
        update: {},
      })
    }

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        subtitle: lesson.subtitle,
        lessonOrder: lesson.lessonOrder,
        lessonLevel: lesson.lessonLevel,
        courseName: lesson.course.title,
        courseCategory: lesson.course.category,
      },
      ebook: ebookData,
      settings: {
        watermarkText: settings.watermarkText,
        watermarkOpacity: settings.watermarkOpacity,
        headerText: settings.headerText,
        footerText: settings.footerText,
        logoUrl: settings.logoUrl,
        isWatermarkEnabled: settings.isWatermarkEnabled,
        accentColor: settings.accentColor,
      },
    })
  } catch (error) {
    console.error('Ebook API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
