/**
 * Seed Expansion: Add lessons 4 & 5 to all 6 courses + InVideo Quiz Questions
 * Run: npx ts-node prisma/seed-expansion.ts
 */
import { PrismaClient, CourseLevel, CorrectAnswer } from "@prisma/client"

const db = new PrismaClient()

// ─── In-Video Quiz Question type ─────────────────────────────────────────────

interface InVideoQ {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: CorrectAnswer
  explanation: string
  triggerPercent: number
  sortOrder: number
}

// ─── Extra lessons for each course ───────────────────────────────────────────

interface ExtraLesson {
  id: string
  title: string
  subtitle: string
  description: string
  youtubeUrl: string
  videoTitle: string
  videoChannel: string
  durationText: string
  lessonLevel: CourseLevel
  lessonOrder: number
  summary: string
  learningOutcomes: string
  keyTakeaways: string
  coverImage: string
}

// ─── In-video quiz data (by lesson id) ───────────────────────────────────────

const inVideoQuizData: Record<string, InVideoQ[]> = {
  // ── COURSE 1: AI Automation ──────────────────────────────────────────────
  "lesson-aut-1": [
    { question: "AI Automation ช่วยธุรกิจในด้านใดเป็นหลัก?", optionA: "ลดงานซ้ำๆ เพิ่มความเร็ว ลดข้อผิดพลาด", optionB: "สร้างผลิตภัณฑ์ใหม่อัตโนมัติ", optionC: "จ้างพนักงานเพิ่มขึ้น", optionD: "ลดขนาดองค์กร", correctAnswer: "A", explanation: "AI Automation เพิ่มประสิทธิภาพโดยทำงานซ้ำๆ แทนคน ลดเวลาและข้อผิดพลาด", triggerPercent: 30, sortOrder: 1 },
    { question: "ขั้นตอนแรกของ Workflow Automation คือ?", optionA: "Trigger — เหตุการณ์ที่เริ่มต้นกระบวนการ", optionB: "Result — ผลลัพธ์สุดท้าย", optionC: "Report — รายงาน", optionD: "Review — ทบทวน", correctAnswer: "A", explanation: "Workflow เริ่มจาก Trigger → Action → Result เสมอ", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-aut-2": [
    { question: "Make (Integromat) คืออะไร?", optionA: "No-code Automation Platform สำหรับสร้าง Workflow", optionB: "โปรแกรมออกแบบกราฟิก", optionC: "ระบบบัญชี", optionD: "Social Media Platform", correctAnswer: "A", explanation: "Make เป็น No-code platform ที่ให้สร้าง Workflow เชื่อมต่อแอปต่างๆ โดยไม่ต้องเขียนโค้ด", triggerPercent: 30, sortOrder: 1 },
    { question: "API มีบทบาทอย่างไรใน Automation?", optionA: "เชื่อมต่อระบบต่างๆ ให้สื่อสารกันได้", optionB: "เป็นฐานข้อมูล", optionC: "สร้าง UI", optionD: "จัดการ Email", correctAnswer: "A", explanation: "API คือ 'ประตู' ที่ให้ระบบต่างๆ ส่งข้อมูลถึงกัน ทำให้ Automation ทำงานข้ามแอปได้", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-aut-3": [
    { question: "Enterprise AI Automation ต่างจาก Personal Automation อย่างไร?", optionA: "ต้องคำนึงถึง Security, Compliance และ Scalability", optionB: "ใช้เครื่องมือเดียวกันทุกอย่าง", optionC: "ไม่มีความแตกต่าง", optionD: "แพงกว่าเท่านั้น", correctAnswer: "A", explanation: "Enterprise ต้องจัดการ Security, Data Governance, Scalability และ Compliance ซึ่งซับซ้อนกว่ามาก", triggerPercent: 30, sortOrder: 1 },
    { question: "ROI ของ AI Automation วัดจากอะไรหลักๆ?", optionA: "เวลาที่ประหยัด + การลดข้อผิดพลาด + รายได้ที่เพิ่ม", optionB: "จำนวน Bot ที่สร้าง", optionC: "ค่าใช้จ่าย Software", optionD: "จำนวนพนักงาน IT", correctAnswer: "A", explanation: "ROI วัดจากผลลัพธ์จริง: เวลาที่ประหยัด, ข้อผิดพลาดที่ลดลง, และรายได้/ประสิทธิภาพที่เพิ่มขึ้น", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-aut-4": [
    { question: "AI Chatbot ช่วยธุรกิจในด้านใด?", optionA: "ตอบคำถามลูกค้าอัตโนมัติตลอด 24 ชั่วโมง", optionB: "ออกแบบสินค้าใหม่", optionC: "จัดการคลังสินค้า", optionD: "วิเคราะห์หุ้น", correctAnswer: "A", explanation: "AI Chatbot รับมือ Customer Support ได้ตลอดเวลา ลดภาระพนักงาน และตอบคำถามที่พบบ่อยได้แม่นยำ", triggerPercent: 30, sortOrder: 1 },
    { question: "NLP ย่อมาจากอะไร และใช้ทำอะไรใน Chatbot?", optionA: "Natural Language Processing — วิเคราะห์และเข้าใจภาษามนุษย์", optionB: "Network Linked Protocol", optionC: "New Learning Platform", optionD: "Normal Language Parser", correctAnswer: "A", explanation: "NLP ช่วยให้ AI เข้าใจภาษาธรรมชาติที่มนุษย์พิมพ์หรือพูด ทำให้ Chatbot ตอบสนองได้อย่างเป็นธรรมชาติ", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-aut-5": [
    { question: "Multi-Agent AI System คืออะไร?", optionA: "ระบบที่ AI หลายตัวทำงานร่วมกันเพื่อเป้าหมายเดียว", optionB: "ซอฟต์แวร์หลายโปรแกรมในคอมพิวเตอร์", optionC: "ทีม IT หลายคน", optionD: "ระบบ Backup ข้อมูล", correctAnswer: "A", explanation: "Multi-Agent System ให้ AI หลาย Agent ทำงานแบ่งหน้าที่กัน เช่น Agent วิจัย + Agent เขียน + Agent ตรวจสอบ", triggerPercent: 30, sortOrder: 1 },
    { question: "LangChain ช่วยอะไรใน AI Agent Development?", optionA: "Framework สำหรับสร้าง AI Application ที่ใช้ LLM", optionB: "เครื่องมือออกแบบ UI", optionC: "ระบบจัดการฐานข้อมูล", optionD: "แพลตฟอร์ม Social Media", correctAnswer: "A", explanation: "LangChain เป็น Framework ที่ช่วยสร้าง AI Application ที่ซับซ้อน เชื่อม LLM กับ Tools, Memory และ Agents", triggerPercent: 65, sortOrder: 2 },
  ],

  // ── COURSE 2: AI Marketing ───────────────────────────────────────────────
  "lesson-mkt-1": [
    { question: "AI ช่วยสร้าง Marketing Content ได้อย่างไร?", optionA: "สร้าง Ad Copy, Blog Post, Caption ได้เร็วขึ้น 10 เท่า", optionB: "ออกแบบโลโก้อัตโนมัติ", optionC: "ยิง Ads อัตโนมัติ", optionD: "ตัดต่อวิดีโอ", correctAnswer: "A", explanation: "ChatGPT และ AI Writing Tools ช่วยเขียน Content ได้เร็วมาก ลด Time-to-Market ของ Campaign", triggerPercent: 30, sortOrder: 1 },
    { question: "Target Audience Analysis ด้วย AI ทำอะไรได้บ้าง?", optionA: "วิเคราะห์พฤติกรรม ความสนใจ และ Demographics แบบลึก", optionB: "เดาอายุลูกค้า", optionC: "สร้าง Persona ด้วยสัญชาตญาณ", optionD: "สำรวจลูกค้าด้วยแบบสอบถาม", correctAnswer: "A", explanation: "AI วิเคราะห์ข้อมูลจำนวนมากเพื่อหา Pattern ของกลุ่มเป้าหมาย ได้ Insight ที่ละเอียดและแม่นยำกว่า Manual Analysis", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-mkt-2": [
    { question: "A/B Testing ด้วย AI ดีกว่า Manual อย่างไร?", optionA: "ทดสอบหลายตัวแปรพร้อมกัน หาผลลัพธ์ดีสุดได้เร็วกว่า", optionB: "ถูกกว่าเท่านั้น", optionC: "ไม่มีความแตกต่าง", optionD: "ต้องใช้นักสถิติน้อยกว่า", correctAnswer: "A", explanation: "AI ทำ Multivariate Testing ได้พร้อมกัน วิเคราะห์ผลลัพธ์ Real-time และปรับแคมเปญอัตโนมัติ", triggerPercent: 30, sortOrder: 1 },
    { question: "Performance Marketing ด้วย AI วัดผลจากอะไร?", optionA: "CPA, ROAS, CTR, Conversion Rate", optionB: "จำนวน Like เท่านั้น", optionC: "จำนวน Follower", optionD: "ชั่วโมงที่ทำงาน", correctAnswer: "A", explanation: "Performance Marketing วัดจาก Metrics ที่สัมพันธ์กับยอดขายจริง: Cost Per Acquisition, Return on Ad Spend, Click-through Rate", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-mkt-3": [
    { question: "Predictive Marketing ใช้ข้อมูลอะไรในการคาดการณ์?", optionA: "ข้อมูลในอดีต + พฤติกรรมลูกค้า + ปัจจัยภายนอก", optionB: "เฉพาะยอดขายปีที่แล้ว", optionC: "ข้อมูลจากคู่แข่ง", optionD: "สัญชาตญาณของทีมการตลาด", correctAnswer: "A", explanation: "Predictive Marketing ใช้ Machine Learning วิเคราะห์ข้อมูลหลายมิติเพื่อคาดการณ์แนวโน้มที่แม่นยำ", triggerPercent: 30, sortOrder: 1 },
    { question: "Omnichannel Strategy หมายถึงอะไร?", optionA: "สร้างประสบการณ์ลูกค้าที่เชื่อมต่อกันทุกช่องทาง", optionB: "ขายสินค้าทุกประเภท", optionC: "ใช้ทุก Social Media Platform", optionD: "โฆษณาหลายภาษา", correctAnswer: "A", explanation: "Omnichannel เชื่อมต่อทุก Touchpoint ให้ลูกค้าได้รับประสบการณ์ที่ต่อเนื่องไม่ว่าจะผ่านช่องทางไหน", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-mkt-4": [
    { question: "AI Content Personalization ทำงานอย่างไร?", optionA: "ปรับ Content ให้ตรงกับแต่ละบุคคลจาก Behavioral Data", optionB: "ส่ง Email ที่มีชื่อลูกค้า", optionC: "สร้าง Content เดียวสำหรับทุกคน", optionD: "โพสต์บ่อยขึ้น", correctAnswer: "A", explanation: "AI วิเคราะห์ประวัติการดู คลิก และซื้อ แล้วแสดง Content ที่ตรงความสนใจของแต่ละคน", triggerPercent: 30, sortOrder: 1 },
    { question: "Influencer Marketing ด้วย AI ช่วยอะไร?", optionA: "หา Influencer ที่ตรงกลุ่มเป้าหมาย วิเคราะห์ ROI", optionB: "ติดต่อ Influencer อัตโนมัติ", optionC: "สร้างเนื้อหาแทน Influencer", optionD: "เพิ่ม Follower ให้ Influencer", correctAnswer: "A", explanation: "AI ช่วยวิเคราะห์ Engagement Rate, Audience Demographics และ ROI ของ Influencer แต่ละคนอย่างแม่นยำ", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-mkt-5": [
    { question: "Marketing Automation ด้วย AI แตกต่างจาก Email Blast อย่างไร?", optionA: "ส่ง Message ที่ถูกเวลา ถูกคน ถูก Content อัตโนมัติ", optionB: "ส่งอีเมลจำนวนมากกว่า", optionC: "ใช้ Template สวยกว่า", optionD: "มีรูปภาพมากกว่า", correctAnswer: "A", explanation: "Marketing Automation วิเคราะห์พฤติกรรมแล้วส่ง Message ที่ Personalize ในเวลาที่เหมาะสมที่สุด", triggerPercent: 30, sortOrder: 1 },
    { question: "Customer Journey Mapping ด้วย AI มีประโยชน์อย่างไร?", optionA: "เข้าใจทุก Touchpoint และ Friction Point ของลูกค้า", optionB: "วาด Diagram สวยๆ", optionC: "นับจำนวนลูกค้า", optionD: "ติดตามพนักงาน", correctAnswer: "A", explanation: "AI วิเคราะห์ข้อมูลจากทุก Touchpoint เพื่อแสดงเส้นทางที่ลูกค้าเดินทาง ช่วยหาจุดที่ต้องปรับปรุง", triggerPercent: 65, sortOrder: 2 },
  ],

  // ── COURSE 3: AI HR ──────────────────────────────────────────────────────
  "lesson-hr-1": [
    { question: "AI ช่วยงาน Recruitment อย่างไร?", optionA: "คัดกรอง Resume, จับคู่ทักษะ, นัดสัมภาษณ์อัตโนมัติ", optionB: "สัมภาษณ์แทนผู้จัดการ", optionC: "เซ็นสัญญาจ้าง", optionD: "กำหนดเงินเดือน", correctAnswer: "A", explanation: "AI ช่วยกรอง Resume จำนวนมาก จับคู่ทักษะกับตำแหน่ง และนัดหมายสัมภาษณ์ได้เร็วกว่ามาก", triggerPercent: 30, sortOrder: 1 },
    { question: "AI Resume Screening มีข้อระวังอะไร?", optionA: "อคติ (Bias) ในข้อมูลฝึกสอน อาจเลือกปฏิบัติได้", optionB: "ช้าเกินไป", optionC: "ราคาแพงเกินไป", optionD: "ไม่มีข้อระวัง", correctAnswer: "A", explanation: "AI ที่ฝึกจากข้อมูลที่มี Bias จะนำ Bias นั้นมาด้วย ต้องตรวจสอบและ Calibrate อย่างสม่ำเสมอ", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-hr-2": [
    { question: "Employee Engagement ด้วย AI วัดอะไร?", optionA: "ความผูกพัน ความพึงพอใจ และ Retention Risk", optionB: "จำนวนวันลา", optionC: "ชั่วโมงทำงานล่วงเวลา", optionD: "รูปลักษณ์ภายนอก", correctAnswer: "A", explanation: "AI วิเคราะห์ Survey, Behavioral Data และ Communication Pattern เพื่อประเมิน Engagement และ Churn Risk", triggerPercent: 30, sortOrder: 1 },
    { question: "People Analytics ช่วยผู้บริหาร HR อย่างไร?", optionA: "ให้ข้อมูลสนับสนุนการตัดสินใจด้านบุคลากร", optionB: "จัดทำ Payroll", optionC: "สรุปวันหยุดพนักงาน", optionD: "ออกแบบสำนักงาน", correctAnswer: "A", explanation: "People Analytics นำ Data ด้านบุคลากรมาวิเคราะห์ หาแนวโน้มการลาออก ความสัมพันธ์ระหว่างการฝึกอบรมกับผลงาน ฯลฯ", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-hr-3": [
    { question: "AI Strategic HR Planning ช่วยอะไร?", optionA: "พยากรณ์ความต้องการบุคลากรและวางแผน Workforce", optionB: "จัดตารางพักกลางวัน", optionC: "จัดซื้ออุปกรณ์สำนักงาน", optionD: "ออกแบบ Uniform", correctAnswer: "A", explanation: "Strategic HR Planning ด้วย AI ช่วยวางแผนว่าต้องการบุคลากรทักษะอะไร จำนวนเท่าใด ในอนาคตกี่ปี", triggerPercent: 30, sortOrder: 1 },
    { question: "Succession Planning ด้วย AI คืออะไร?", optionA: "วางแผนพัฒนาผู้สืบทอดตำแหน่งสำคัญในองค์กร", optionB: "วางแผนเลิกจ้าง", optionC: "โปรแกรมเกษียณอายุ", optionD: "การสรรหาจากภายนอก", correctAnswer: "A", explanation: "AI ช่วยระบุ High Potential Employees วิเคราะห์ช่องว่างทักษะ และออกแบบเส้นทางพัฒนาสำหรับผู้สืบทอด", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-hr-4": [
    { question: "AI Performance Management ช่วยอะไร?", optionA: "ให้ Feedback อย่างต่อเนื่อง วัดผล KPI แบบ Real-time", optionB: "ประเมินผลปีละครั้ง", optionC: "กำหนดเงินเดือนอัตโนมัติ", optionD: "เลือกพนักงานออก", correctAnswer: "A", explanation: "AI Performance Management เปลี่ยนจากการประเมินรายปีมาเป็น Continuous Feedback Loop ที่แม่นยำและเป็นธรรมมากขึ้น", triggerPercent: 30, sortOrder: 1 },
    { question: "360-Degree Feedback ด้วย AI ดีกว่าแบบเดิมอย่างไร?", optionA: "วิเคราะห์ Pattern จาก Feedback ทุกมิติ ลด Bias", optionB: "ให้คะแนนเฉลี่ยอัตโนมัติ", optionC: "ใช้เวลาน้อยกว่า", optionD: "ไม่มีความแตกต่าง", correctAnswer: "A", explanation: "AI ช่วยสังเคราะห์ Feedback จากหลายแหล่ง หา Theme ที่ซ้ำกัน และลด Halo Effect หรือ Recency Bias", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-hr-5": [
    { question: "AI Learning & Development ช่วยการอบรมอย่างไร?", optionA: "ปรับหลักสูตรเฉพาะบุคคลตามทักษะที่ขาด", optionB: "สร้างวิดีโออบรมอัตโนมัติ", optionC: "ออกใบประกาศนียบัตรทุกคน", optionD: "ลดค่าใช้จ่ายการอบรม", correctAnswer: "A", explanation: "AI L&D วิเคราะห์ Skill Gap และสร้าง Learning Path เฉพาะบุคคล ทำให้การอบรมตรงจุดและมีประสิทธิภาพมากขึ้น", triggerPercent: 30, sortOrder: 1 },
    { question: "Skill Gap Analysis ด้วย AI ทำงานอย่างไร?", optionA: "เปรียบเทียบทักษะปัจจุบันกับทักษะที่ต้องการในอนาคต", optionB: "นับจำนวน Certificate พนักงาน", optionC: "ดูประวัติการศึกษา", optionD: "วัดอายุงาน", correctAnswer: "A", explanation: "AI วิเคราะห์ทักษะปัจจุบันของพนักงาน เปรียบเทียบกับ Future Skill Requirements และแนะนำการอบรมที่เหมาะสม", triggerPercent: 65, sortOrder: 2 },
  ],

  // ── COURSE 4: AI Productivity ────────────────────────────────────────────
  "lesson-prd-1": [
    { question: "ChatGPT vs Claude ต่างกันอย่างไร?", optionA: "เน้นจุดแข็งต่างกัน เช่น Reasoning, Safety, Creativity", optionB: "เหมือนกันทุกอย่าง", optionC: "ต่างกันแค่ราคา", optionD: "ต่างกันแค่ภาษาที่รองรับ", correctAnswer: "A", explanation: "ChatGPT เด่น Creativity และ Tool Use, Claude เด่น Long Context และ Safety, Gemini เด่น Google Integration", triggerPercent: 30, sortOrder: 1 },
    { question: "Microsoft Copilot ช่วยงานอะไรได้บ้าง?", optionA: "Word, Excel, PowerPoint, Teams ใน Microsoft 365", optionB: "แค่ตอบคำถาม", optionC: "เฉพาะ Email", optionD: "เฉพาะ Spreadsheet", correctAnswer: "A", explanation: "Microsoft Copilot รวม AI เข้ากับทุก Office App ช่วยเขียน สรุป วิเคราะห์ และสร้าง Content ภายใน Workflow เดิม", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-prd-2": [
    { question: "Prompt Engineering คืออะไร?", optionA: "การเขียนคำสั่ง AI อย่างมีประสิทธิภาพเพื่อได้ผลที่ต้องการ", optionB: "การเขียนโค้ดสำหรับ AI", optionC: "การออกแบบ AI Model", optionD: "การทดสอบ AI", correctAnswer: "A", explanation: "Prompt Engineering คือทักษะการ 'สื่อสาร' กับ AI อย่างชัดเจน มี Context ครบ ได้ผลลัพธ์ที่ตรงจุด", triggerPercent: 30, sortOrder: 1 },
    { question: "AI SOP ช่วยทีมทำงานอย่างไร?", optionA: "สร้างมาตรฐานการใช้ AI ที่ทุกคนในทีมทำได้เหมือนกัน", optionB: "แทนที่ SOP เดิมทั้งหมด", optionC: "ลดขนาดทีม", optionD: "เพิ่มชั่วโมงทำงาน", correctAnswer: "A", explanation: "AI SOP กำหนดว่างานแต่ละขั้นตอนใช้ AI อย่างไร ทำให้ผลลัพธ์สม่ำเสมอและถ่ายทอดได้", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-prd-3": [
    { question: "AI Agent ต่างจาก Chatbot อย่างไร?", optionA: "Agent ทำงานหลายขั้นตอนต่อเนื่อง Chatbot ตอบทีละคำถาม", optionB: "Chatbot ฉลาดกว่า", optionC: "Agent ใช้ภาษาต่างกัน", optionD: "ไม่มีความแตกต่าง", correctAnswer: "A", explanation: "AI Agent มี Memory, Planning, Tool Use ทำงานหลายขั้นตอนต่อเนื่องได้ ไม่ใช่แค่ตอบ-ถาม", triggerPercent: 30, sortOrder: 1 },
    { question: "Custom GPTs ขององค์กรควรมีอะไร?", optionA: "Instructions, Knowledge Base และ Custom Actions", optionB: "แค่ชื่อที่ดูดี", optionC: "รูปภาพ Profile สวยๆ", optionD: "API Key เท่านั้น", correctAnswer: "A", explanation: "Custom GPT ที่ดีมี System Instructions ชัดเจน, Knowledge Base จากข้อมูลองค์กร และ Custom Actions เชื่อมกับระบบ", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-prd-4": [
    { question: "Notion AI ช่วยในการจัดการ Knowledge อย่างไร?", optionA: "สรุป จัดระเบียบ และค้นหาข้อมูลได้อัตโนมัติ", optionB: "แค่สร้างรายการ Todo", optionC: "เฉพาะงานเขียน Blog", optionD: "จัดการ Email เท่านั้น", correctAnswer: "A", explanation: "Notion AI ช่วย Summarize เอกสาร จัด Tag อัตโนมัติ ค้นหา Insight จาก Workspace ทั้งหมด", triggerPercent: 30, sortOrder: 1 },
    { question: "Knowledge Management System ที่ดีควรมีคุณสมบัติอะไร?", optionA: "ค้นหาง่าย อัปเดตได้เร็ว เชื่อมโยงข้อมูลได้", optionB: "มีขนาดใหญ่มากที่สุด", optionC: "เข้าถึงได้แค่ผู้บริหาร", optionD: "ใช้ PDF ทั้งหมด", correctAnswer: "A", explanation: "KMS ที่ดีต้องให้คนเข้าถึงข้อมูลที่ถูกต้อง ทันเวลา ง่ายดาย และสามารถอัปเดตให้ทันสมัยได้ตลอด", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-prd-5": [
    { question: "AI Meeting Assistant ช่วยอะไร?", optionA: "บันทึก ถอดความ สรุป และส่ง Action Items อัตโนมัติ", optionB: "จองห้องประชุมเท่านั้น", optionC: "ส่งอาหาร", optionD: "จัดที่นั่ง", correctAnswer: "A", explanation: "AI Meeting Tools เช่น Otter.ai, Fireflies บันทึกและ Transcribe อัตโนมัติ สรุปประเด็น และ Action Items", triggerPercent: 30, sortOrder: 1 },
    { question: "Deep Work ร่วมกับ AI หมายถึงอะไร?", optionA: "ใช้ AI จัดการงานซ้ำๆ เพื่อให้มีเวลาโฟกัสงานสำคัญ", optionB: "ทำงานตลอด 24 ชั่วโมง", optionC: "ไม่ใช้ AI เลย", optionD: "ทำงานหลายอย่างพร้อมกัน", correctAnswer: "A", explanation: "AI รับมืองาน Routine ทำให้คนมีเวลาและพลังงานสำหรับงานที่ต้องใช้ความคิดสร้างสรรค์และการตัดสินใจสูง", triggerPercent: 65, sortOrder: 2 },
  ],

  // ── COURSE 5: AI Analytics ───────────────────────────────────────────────
  "lesson-dat-1": [
    { question: "Descriptive Analytics บอกอะไร?", optionA: "สิ่งที่เกิดขึ้นแล้ว — เกิดอะไร เมื่อไหร่ ที่ไหน", optionB: "สิ่งที่จะเกิดขึ้นในอนาคต", optionC: "สาเหตุของปัญหา", optionD: "แนวทางแก้ไข", correctAnswer: "A", explanation: "Descriptive คือขั้นแรก อธิบายข้อมูลในอดีต เช่น ยอดขายเดือนที่แล้วเป็นอย่างไร", triggerPercent: 30, sortOrder: 1 },
    { question: "เครื่องมือใดใช้สร้าง Data Visualization ได้ดี?", optionA: "Power BI, Tableau, Google Data Studio, ChatGPT Code", optionB: "Microsoft Word", optionC: "Adobe Photoshop", optionD: "VLC Media Player", correctAnswer: "A", explanation: "เครื่องมือ BI เหล่านี้ช่วยสร้างกราฟ Dashboard แบบ Interactive ได้ดีมาก บาง tool ใช้ AI ช่วยอัตโนมัติ", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-dat-2": [
    { question: "KPI คืออะไร?", optionA: "Key Performance Indicator — ตัวชี้วัดผลงานหลัก", optionB: "Key Product Information", optionC: "Knowledge Process Integration", optionD: "Key Personnel Index", correctAnswer: "A", explanation: "KPI คือตัวชี้วัดที่บอกว่าองค์กรทำงานได้ดีแค่ไหน ต้องเลือกให้สอดคล้องกับเป้าหมายธุรกิจ", triggerPercent: 30, sortOrder: 1 },
    { question: "Real-time Dashboard มีประโยชน์อย่างไร?", optionA: "ตัดสินใจได้ทันทีบนข้อมูลปัจจุบัน ไม่ใช่ข้อมูลเก่า", optionB: "ดูสวยงามกว่า", optionC: "ใช้ข้อมูลน้อยกว่า", optionD: "สร้างได้ง่ายกว่า", correctAnswer: "A", explanation: "Real-time Dashboard ช่วยให้ผู้บริหารและทีมเห็นสถานการณ์ปัจจุบัน ตอบสนองได้ทันที ไม่ต้องรอรายงานรายเดือน", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-dat-3": [
    { question: "Machine Learning Model ต้องการอะไรเป็นหลัก?", optionA: "ข้อมูลคุณภาพดี จำนวนเพียงพอ และ Feature ที่ถูกต้อง", optionB: "คอมพิวเตอร์ที่เร็วที่สุด", optionC: "นักวิทยาศาสตร์ข้อมูลจำนวนมาก", optionD: "งบประมาณสูง", correctAnswer: "A", explanation: "'Garbage In, Garbage Out' — ข้อมูลที่ดีและมีคุณภาพสูงคือรากฐานของ ML Model ที่แม่นยำ", triggerPercent: 30, sortOrder: 1 },
    { question: "Overfitting ใน Machine Learning คืออะไร?", optionA: "Model เรียนรู้ข้อมูลฝึกสอนดีเกินไป ทำนายข้อมูลใหม่ได้แย่", optionB: "Model ฝึกสอนมากเกินไป ใช้เวลานาน", optionC: "ข้อมูลมีมากเกินไป", optionD: "Model มีขนาดใหญ่เกินไป", correctAnswer: "A", explanation: "Overfitting ทำให้ Model แม่นยำกับ Training Data มาก แต่ Generalize กับข้อมูลจริงได้ไม่ดี", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-dat-4": [
    { question: "SQL ใช้ทำอะไรในงาน Data Analytics?", optionA: "ดึง กรอง และรวมข้อมูลจากฐานข้อมูล", optionB: "ออกแบบ UI", optionC: "สร้างกราฟ", optionD: "ส่งอีเมล", correctAnswer: "A", explanation: "SQL เป็นภาษาสำคัญสำหรับ Data Analyst ใช้ Query ข้อมูลจาก Database เพื่อวิเคราะห์", triggerPercent: 30, sortOrder: 1 },
    { question: "Data Cleaning สำคัญอย่างไร?", optionA: "ข้อมูลที่สะอาดนำไปสู่ Insight ที่แม่นยำ ลด Noise", optionB: "ทำให้ไฟล์ขนาดเล็กลง", optionC: "เร็วขึ้นเท่านั้น", optionD: "ไม่สำคัญถ้าใช้ AI วิเคราะห์", correctAnswer: "A", explanation: "ข้อมูลที่มี Error, Missing Values หรือ Inconsistency จะทำให้ผลการวิเคราะห์ผิดพลาด Data Cleaning จึงจำเป็น", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-dat-5": [
    { question: "Natural Language Query ใน BI คืออะไร?", optionA: "ถามคำถามเป็นภาษาพูด AI วิเคราะห์และแสดง Chart ให้", optionB: "พูดคุยกับ Chatbot", optionC: "อ่านเอกสารเป็นเสียง", optionD: "แปลภาษา", correctAnswer: "A", explanation: "BI ยุคใหม่ให้พิมพ์คำถามแบบภาษาพูดเช่น 'ยอดขาย Q1 แต่ละสาขา' แล้ว AI สร้าง Chart ให้อัตโนมัติ", triggerPercent: 30, sortOrder: 1 },
    { question: "Augmented Analytics คืออะไร?", optionA: "AI ช่วยวิเคราะห์ข้อมูลอัตโนมัติ แนะนำ Insight และ Action", optionB: "ใช้ AR/VR ดูข้อมูล", optionC: "เพิ่มข้อมูลให้มากขึ้น", optionD: "รวมข้อมูลจากหลายแหล่ง", correctAnswer: "A", explanation: "Augmented Analytics ใช้ AI/ML ช่วยทำทุกขั้นตอนวิเคราะห์ข้อมูล ตั้งแต่ Data Prep ถึงการแนะนำ Action", triggerPercent: 65, sortOrder: 2 },
  ],

  // ── COURSE 6: AI Management ──────────────────────────────────────────────
  "lesson-mgt-1": [
    { question: "AI Decision Support ต่างจาก AI Making Decision อย่างไร?", optionA: "Support ให้ข้อมูลช่วยคิด Making ตัดสินใจแทนทั้งหมด", optionB: "ไม่มีความแตกต่าง", optionC: "Support ช้ากว่า", optionD: "Making ถูกกว่า", correctAnswer: "A", explanation: "AI Decision Support ให้ข้อมูลและวิเคราะห์ทางเลือก แต่ผู้บริหารเป็นคนตัดสินใจสุดท้าย ซึ่งเป็นแนวทางที่ถูกต้อง", triggerPercent: 30, sortOrder: 1 },
    { question: "Data-Driven Culture สร้างได้อย่างไร?", optionA: "สร้าง Accessibility ให้ข้อมูล ฝึกอบรม และให้ผู้บริหารเป็นตัวอย่าง", optionB: "ซื้อ Software วิเคราะห์ข้อมูลราคาแพง", optionC: "จ้าง Data Scientist เพิ่ม", optionD: "สร้าง Dashboard ให้มากที่สุด", correctAnswer: "A", explanation: "Data Culture ต้องการทั้ง Technology, Skill Building และ Leadership Role Model ที่ใช้ข้อมูลในการตัดสินใจ", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-mgt-2": [
    { question: "Competitive Intelligence ด้วย AI ทำอะไรได้?", optionA: "ติดตามข่าวสาร ราคา และกลยุทธ์คู่แข่งแบบ Real-time", optionB: "ขโมยข้อมูลคู่แข่ง", optionC: "โฆษณาโจมตีคู่แข่ง", optionD: "สอดแนมพนักงาน", correctAnswer: "A", explanation: "AI รวบรวมข้อมูลสาธารณะจากเว็บ ข่าว Social Media เพื่อวิเคราะห์ตลาดและคู่แข่งอย่างเป็นระบบ", triggerPercent: 30, sortOrder: 1 },
    { question: "Scenario Planning ประโยชน์สำหรับองค์กรคืออะไร?", optionA: "เตรียมแผนรับมือสถานการณ์ต่างๆ ลด Uncertainty", optionB: "ทำนายอนาคตได้แม่นยำ 100%", optionC: "ลดงบประมาณการวางแผน", optionD: "ไม่มีประโยชน์ในโลกที่ไม่แน่นอน", correctAnswer: "A", explanation: "Scenario Planning ช่วยองค์กรคิดและเตรียมพร้อมสำหรับหลายอนาคตที่เป็นไปได้ ไม่ใช่ทำนายอนาคตเดียว", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-mgt-3": [
    { question: "AI Governance Framework ควรครอบคลุมอะไร?", optionA: "Ethics, Accountability, Transparency, Privacy, Security", optionB: "แค่กำหนดว่าใครใช้ AI ได้", optionC: "กำหนดราคา AI Software", optionD: "เฉพาะการอนุมัติ AI Projects", correctAnswer: "A", explanation: "AI Governance ที่ครบถ้วนต้องมีหลักจริยธรรม ความรับผิดชอบ ความโปร่งใส การปกป้องข้อมูล และความปลอดภัย", triggerPercent: 30, sortOrder: 1 },
    { question: "Future of Work ในยุค AI หมายถึงอะไร?", optionA: "Human-AI Collaboration คนโฟกัสงานสร้างสรรค์ AI ทำงานซ้ำๆ", optionB: "AI แทนที่คนทั้งหมด", optionC: "คนทำงานน้อยลงโดยไม่ต้องรับผิดชอบ", optionD: "ไม่มีการเปลี่ยนแปลง", correctAnswer: "A", explanation: "อนาคตของงานคือความร่วมมือระหว่างมนุษย์และ AI มนุษย์เพิ่มคุณค่าด้วยความคิดสร้างสรรค์ ความเห็นอกเห็นใจ และการนำทิศทาง", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-mgt-4": [
    { question: "Change Management ใน AI Transformation สำคัญอย่างไร?", optionA: "ช่วยให้พนักงานปรับตัวและยอมรับการเปลี่ยนแปลง", optionB: "เป็นเรื่องของ HR เท่านั้น", optionC: "ทำหลังจาก Deploy AI แล้ว", optionD: "ไม่จำเป็นถ้า AI ดีพอ", correctAnswer: "A", explanation: "การเปลี่ยนแปลงที่สำเร็จต้องจัดการกับ People Side ก่อน ระหว่าง และหลังการ Deploy Technology", triggerPercent: 30, sortOrder: 1 },
    { question: "AI ROI วัดอย่างไรในระดับองค์กร?", optionA: "เปรียบเทียบ Cost ที่ลด + Revenue ที่เพิ่ม กับ Investment ใน AI", optionB: "นับจำนวน AI Tools ที่ใช้", optionC: "วัดจากความพึงพอใจพนักงาน", optionD: "วัดจากคะแนน Press Release", correctAnswer: "A", explanation: "AI ROI = (Benefits - Costs) / Costs × 100% โดย Benefits รวมทั้ง Cost Reduction, Revenue Growth และ Intangible Benefits", triggerPercent: 65, sortOrder: 2 },
  ],
  "lesson-mgt-5": [
    { question: "AI Ethics ในการใช้ AI ขององค์กรคืออะไร?", optionA: "ใช้ AI อย่างรับผิดชอบ ยุติธรรม โปร่งใส ไม่เลือกปฏิบัติ", optionB: "หลีกเลี่ยงการใช้ AI", optionC: "ให้ AI ตัดสินใจทั้งหมด", optionD: "ไม่เปิดเผยข้อมูลการใช้ AI", correctAnswer: "A", explanation: "AI Ethics ครอบคลุม Fairness, Accountability, Transparency และ Privacy ต้องปฏิบัติตามเพื่อความน่าเชื่อถือขององค์กร", triggerPercent: 30, sortOrder: 1 },
    { question: "Digital Transformation Roadmap ควรเริ่มจากอะไร?", optionA: "Assessment ปัจจุบัน กำหนด Vision และ Prioritize Quick Wins", optionB: "ซื้อ Technology ก่อน", optionC: "เลิกจ้างพนักงาน IT เดิม", optionD: "เปลี่ยนทุกอย่างพร้อมกัน", correctAnswer: "A", explanation: "Roadmap ที่ดีเริ่มจากเข้าใจสถานการณ์ปัจจุบัน กำหนดเป้าหมายชัดเจน แล้วค่อยๆ Transform ด้วย Quick Wins", triggerPercent: 65, sortOrder: 2 },
  ],
}

// ─── Extra lessons data ───────────────────────────────────────────────────────

const extraLessons: Record<string, ExtraLesson[]> = {
  "course-ai-automation": [
    {
      id: "lesson-aut-4",
      title: "AI Chatbot & Conversational AI",
      subtitle: "สร้าง Chatbot อัจฉริยะสำหรับธุรกิจ",
      description: "เรียนรู้การสร้าง AI Chatbot สำหรับ Customer Service, Lead Generation และ Internal Support ครอบคลุม ChatGPT API, Dialogflow และ Custom NLP",
      youtubeUrl: "https://www.youtube.com/watch?v=2IK3DFHRFfw",
      videoTitle: "สร้าง AI Chatbot สำหรับธุรกิจ",
      videoChannel: "AI Dev Thailand",
      durationText: "30:00",
      lessonLevel: "INTERMEDIATE",
      lessonOrder: 4,
      summary: "ครอบคลุมการสร้าง AI Chatbot สำหรับธุรกิจ ตั้งแต่ Chatbot พื้นฐานด้วย ChatGPT API จนถึง Conversational AI ที่เข้าใจบริบทและ Intent ของลูกค้า",
      learningOutcomes: "1. เข้าใจสถาปัตยกรรม AI Chatbot\n2. สร้าง Chatbot เบื้องต้นด้วย ChatGPT API ได้\n3. ออกแบบ Conversation Flow ที่มีประสิทธิภาพได้",
      keyTakeaways: "• AI Chatbot ลด Support Cost ได้ 30-80%\n• ต้องออกแบบ Fallback สำหรับกรณีที่ AI ตอบไม่ได้\n• ผสาน Human Handoff เมื่อลูกค้าต้องการ",
      coverImage: "/images/covers/ai-automation-intermediate.svg",
    },
    {
      id: "lesson-aut-5",
      title: "AI Agents & Agentic Workflows",
      subtitle: "สร้าง AI Agent ทำงานแบบอัตโนมัติหลายขั้นตอน",
      description: "ศึกษา AI Agent ที่สามารถวางแผนและดำเนินงานหลายขั้นตอนอัตโนมัติ ครอบคลุม LangChain, AutoGPT, Multi-Agent Systems และ Agentic Architecture",
      youtubeUrl: "https://www.youtube.com/watch?v=UR4f-_uQJv8",
      videoTitle: "AI Agents อธิบายแบบเข้าใจง่าย",
      videoChannel: "Tech Explained Thai",
      durationText: "35:00",
      lessonLevel: "ADVANCED",
      lessonOrder: 5,
      summary: "เจาะลึก AI Agent Architecture ครอบคลุม ReAct Pattern, Tool Use, Memory, Multi-Agent Collaboration และการออกแบบ Agentic Workflow สำหรับธุรกิจ",
      learningOutcomes: "1. เข้าใจหลักการทำงานของ AI Agent\n2. ออกแบบ Multi-Agent Workflow ได้\n3. ประเมินความเหมาะสมของ AI Agent สำหรับงานต่างๆ ได้",
      keyTakeaways: "• AI Agent = Perceive + Think + Act อัตโนมัติ\n• Multi-Agent แบ่งงานกันทำได้ดีกว่า Single Agent\n• ต้องมี Human Oversight ในงานสำคัญ",
      coverImage: "/images/covers/ai-automation-advanced.svg",
    },
  ],
  "course-ai-marketing": [
    {
      id: "lesson-mkt-4",
      title: "AI Content & SEO Strategy",
      subtitle: "AI สร้าง Content และเพิ่ม SEO",
      description: "เรียนรู้การใช้ AI สร้าง Content Strategy ที่ครบวงจร ตั้งแต่ Keyword Research, Content Creation ด้วย AI ไปจนถึง SEO Optimization",
      youtubeUrl: "https://www.youtube.com/watch?v=_vZ0Fa8eNcQ",
      videoTitle: "AI SEO & Content Marketing 2024",
      videoChannel: "Digital Marketing Thai",
      durationText: "32:00",
      lessonLevel: "INTERMEDIATE",
      lessonOrder: 4,
      summary: "ครอบคลุม AI Content Strategy ตั้งแต่วางแผน Content Calendar ด้วย AI, SEO Keyword Research, Content Brief Generation และ AI Writing Optimization",
      learningOutcomes: "1. วาง AI Content Strategy ได้\n2. ใช้ AI ทำ Keyword Research และ SEO ได้\n3. สร้าง High-Quality Content ด้วย AI ได้เร็วขึ้น",
      keyTakeaways: "• AI ช่วยสร้าง Content Scale ได้ แต่ต้องตรวจสอบความถูกต้อง\n• SEO AI Tools ช่วยหา Keyword Gap และ Opportunity\n• Human Creativity + AI Efficiency = Content ที่ดีที่สุด",
      coverImage: "/images/covers/ai-marketing-intermediate.svg",
    },
    {
      id: "lesson-mkt-5",
      title: "Marketing Analytics & Attribution",
      subtitle: "วิเคราะห์ผลการตลาดด้วย AI",
      description: "เรียนรู้การวัดและวิเคราะห์ผลการตลาดด้วย AI ครอบคลุม Multi-touch Attribution, Marketing Mix Modeling, Customer Journey Analytics และ ROI Measurement",
      youtubeUrl: "https://www.youtube.com/watch?v=2Vx5T_j1Z1A",
      videoTitle: "Marketing Analytics สำหรับธุรกิจ",
      videoChannel: "Analytics Academy TH",
      durationText: "36:00",
      lessonLevel: "ADVANCED",
      lessonOrder: 5,
      summary: "ศึกษาการวัดผล Marketing Performance ด้วย AI ครอบคลุม Attribution Modeling, Marketing Mix Model, Incremental Testing และ Customer Lifetime Value Analysis",
      learningOutcomes: "1. เข้าใจ Attribution Models ต่างๆ\n2. วัด ROI ของแต่ละ Marketing Channel ได้\n3. ใช้ AI วิเคราะห์ Customer Journey ได้",
      keyTakeaways: "• Last-click Attribution เข้าใจผิดได้ ควรใช้ Multi-touch\n• Marketing Mix Model ช่วยจัดสรรงบได้ดีขึ้น\n• CLV คือตัวชี้วัดที่สำคัญที่สุดสำหรับการตลาดระยะยาว",
      coverImage: "/images/covers/ai-marketing-advanced.svg",
    },
  ],
  "course-ai-hr": [
    {
      id: "lesson-hr-4",
      title: "AI Performance Management",
      subtitle: "บริหารผลงานด้วย AI",
      description: "เรียนรู้การใช้ AI ในการบริหารผลงานพนักงาน ครอบคลุม Continuous Performance Management, OKR Tracking ด้วย AI, 360-Degree Feedback และ Real-time Coaching",
      youtubeUrl: "https://www.youtube.com/watch?v=MqoRzNhrTnQ",
      videoTitle: "Performance Management ยุคดิจิทัล",
      videoChannel: "HR Innovation TH",
      durationText: "28:00",
      lessonLevel: "INTERMEDIATE",
      lessonOrder: 4,
      summary: "ครอบคลุม Modern Performance Management ด้วย AI ตั้งแต่การกำหนด OKR ที่สอดคล้องกัน Continuous Feedback, Real-time Coaching และ Performance Analytics",
      learningOutcomes: "1. ออกแบบระบบ Continuous Performance Management ได้\n2. ใช้ AI ช่วย OKR Setting และ Tracking\n3. สร้าง 360-Degree Feedback Process ด้วย AI ได้",
      keyTakeaways: "• Continuous Feedback ดีกว่าการประเมินปีละครั้ง\n• AI ช่วยลด Bias ในการประเมินผล\n• Performance Data ต้องนำไปสู่ Action ไม่ใช่แค่บันทึก",
      coverImage: "/images/covers/ai-hr-intermediate.svg",
    },
    {
      id: "lesson-hr-5",
      title: "AI Learning & Development",
      subtitle: "พัฒนาบุคลากรด้วย AI",
      description: "ศึกษาการใช้ AI ยกระดับ Learning & Development ในองค์กร ครอบคลุม Personalized Learning Path, Skill Gap Analysis, AI-Powered LMS และ Microlearning",
      youtubeUrl: "https://www.youtube.com/watch?v=3jZ5_KZv8Ys",
      videoTitle: "AI ในการพัฒนาทรัพยากรมนุษย์",
      videoChannel: "Learning & Dev Academy",
      durationText: "32:00",
      lessonLevel: "ADVANCED",
      lessonOrder: 5,
      summary: "เรียนรู้การสร้างระบบ AI L&D ที่ปรับ Learning Path เฉพาะบุคคล วิเคราะห์ Skill Gap, สร้าง Microlearning Content และวัดผล Learning Impact",
      learningOutcomes: "1. ออกแบบ Personalized Learning System ด้วย AI ได้\n2. ทำ Skill Gap Analysis ในระดับองค์กรได้\n3. วัดผล ROI ของโปรแกรม L&D ได้",
      keyTakeaways: "• Personalized Learning เพิ่มประสิทธิภาพการเรียนรู้ 2-3 เท่า\n• Microlearning เหมาะกับยุคที่คนมีเวลาสั้น\n• ต้องวัด Learning Impact ไม่ใช่แค่ Completion Rate",
      coverImage: "/images/covers/ai-hr-advanced.svg",
    },
  ],
  "course-ai-productivity": [
    {
      id: "lesson-prd-4",
      title: "AI Knowledge Management",
      subtitle: "จัดการความรู้ในองค์กรด้วย AI",
      description: "เรียนรู้การสร้างระบบ Knowledge Management ที่ขับเคลื่อนด้วย AI ครอบคลุม AI-Powered Search, Knowledge Base, Document Intelligence และ Organizational Learning",
      youtubeUrl: "https://www.youtube.com/watch?v=qJ6OkqzSsw4",
      videoTitle: "จัดการ Knowledge ด้วย AI",
      videoChannel: "Knowledge Work AI",
      durationText: "28:00",
      lessonLevel: "INTERMEDIATE",
      lessonOrder: 4,
      summary: "ครอบคลุมการสร้าง AI Knowledge Management System ตั้งแต่ AI Document Search, Knowledge Base Creation, RAG System เบื้องต้น และการวัดผล Knowledge Sharing",
      learningOutcomes: "1. สร้าง AI-Powered Knowledge Base ได้\n2. ออกแบบระบบ Document Intelligence สำหรับองค์กร\n3. วัดผลประสิทธิภาพ Knowledge Sharing ได้",
      keyTakeaways: "• AI Search หา Insight จาก Document ขนาดใหญ่ได้รวดเร็ว\n• RAG ช่วยให้ AI ตอบคำถามจาก Knowledge Base ขององค์กรได้\n• Knowledge ที่ไม่ถูกแชร์คือ Hidden Cost ขององค์กร",
      coverImage: "/images/covers/ai-productivity-intermediate.svg",
    },
    {
      id: "lesson-prd-5",
      title: "AI Meeting & Communication Tools",
      subtitle: "ประชุมและสื่อสารอย่างมีประสิทธิภาพด้วย AI",
      description: "ใช้ AI เพิ่มประสิทธิภาพการประชุมและการสื่อสาร ครอบคลุม AI Meeting Notes, Real-time Translation, Automated Follow-up และ Async Communication ด้วย AI",
      youtubeUrl: "https://www.youtube.com/watch?v=AiAgMpFidgQ",
      videoTitle: "AI Tools สำหรับการประชุมและทำงานร่วมกัน",
      videoChannel: "Productivity Pro TH",
      durationText: "25:00",
      lessonLevel: "BEGINNER",
      lessonOrder: 5,
      summary: "เรียนรู้ AI Tools สำหรับการประชุมที่มีประสิทธิภาพ ครอบคลุม Otter.ai, Fireflies, Zoom AI, Teams Copilot และวิธีสร้าง Async-First Culture",
      learningOutcomes: "1. ใช้ AI Meeting Assistant ได้อย่างมีประสิทธิภาพ\n2. สร้าง Action Items และ Follow-up อัตโนมัติ\n3. ออกแบบ Async Communication ด้วย AI ได้",
      keyTakeaways: "• AI Meeting Notes ประหยัดเวลา 30-45 นาทีต่อการประชุม\n• Async-First ลดจำนวนประชุมที่ไม่จำเป็นได้มาก\n• AI Summary ช่วยคนที่พลาดการประชุมได้รับข้อมูลครบ",
      coverImage: "/images/covers/ai-productivity-beginner.svg",
    },
  ],
  "course-ai-analytics": [
    {
      id: "lesson-dat-4",
      title: "SQL & Python for AI Analytics",
      subtitle: "ทักษะเทคนิคสำหรับนักวิเคราะห์ข้อมูล",
      description: "เรียนรู้ทักษะพื้นฐาน SQL และ Python สำหรับงาน Data Analytics ครอบคลุม SQL Queries, Pandas, Visualization Library และการใช้ ChatGPT ช่วยเขียนโค้ด",
      youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
      videoTitle: "SQL สำหรับ Data Analysis",
      videoChannel: "DataRockie",
      durationText: "40:00",
      lessonLevel: "INTERMEDIATE",
      lessonOrder: 4,
      summary: "ครอบคลุม SQL พื้นฐานสำหรับ Business Analytics, Pandas DataFrame, Python Visualization และเทคนิคการใช้ AI ช่วยเขียน Query และโค้ดวิเคราะห์ข้อมูล",
      learningOutcomes: "1. เขียน SQL Query เพื่อดึงข้อมูลธุรกิจได้\n2. ใช้ Pandas วิเคราะห์ข้อมูลเบื้องต้นได้\n3. ใช้ ChatGPT ช่วยเขียนโค้ดวิเคราะห์ข้อมูลได้",
      keyTakeaways: "• SQL เป็น Must-Have Skill สำหรับ Data Analyst\n• Pandas ช่วยจัดการข้อมูลขนาดใหญ่ได้ดี\n• AI Code Assistant ช่วยคนที่ไม่ใช่นักโปรแกรมได้มาก",
      coverImage: "/images/covers/ai-analytics-intermediate.svg",
    },
    {
      id: "lesson-dat-5",
      title: "AI-Powered BI & Natural Language Analytics",
      subtitle: "BI ยุคใหม่ด้วย AI",
      description: "ศึกษา Business Intelligence ยุคใหม่ที่ขับเคลื่อนด้วย AI ครอบคลุม Natural Language Query, Augmented Analytics, Self-Service BI และ AI-Generated Insights",
      youtubeUrl: "https://www.youtube.com/watch?v=E_AtD5BwV88",
      videoTitle: "AI Business Intelligence ยุคใหม่",
      videoChannel: "BI Future Thailand",
      durationText: "38:00",
      lessonLevel: "ADVANCED",
      lessonOrder: 5,
      summary: "เรียนรู้ Next-gen BI ที่ใช้ AI ตั้งแต่ Natural Language Interface, Automated Insight Generation, Embedded Analytics และ Prescriptive Analytics ที่แนะนำ Action",
      learningOutcomes: "1. ใช้ Natural Language Query กับ BI Tools ได้\n2. ออกแบบ Self-Service Analytics Platform ได้\n3. สร้าง Automated Insight Report ได้",
      keyTakeaways: "• NLQ ทำให้ทุกคนในองค์กรเป็น Data Analyst ได้\n• Self-Service BI ลด Bottleneck ที่ IT Team\n• Augmented Analytics เปลี่ยน BI จาก Reporting เป็น Insights",
      coverImage: "/images/covers/ai-analytics-advanced.svg",
    },
  ],
  "course-ai-management": [
    {
      id: "lesson-mgt-4",
      title: "AI Change Management",
      subtitle: "นำการเปลี่ยนแปลงด้วย AI",
      description: "เรียนรู้การบริหารการเปลี่ยนแปลงองค์กรในยุค AI ครอบคลุม Change Management Framework, AI Adoption Strategy, Resistance Management และการสร้าง AI Culture",
      youtubeUrl: "https://www.youtube.com/watch?v=3KFscVNpNnk",
      videoTitle: "Change Management ในยุค Digital",
      videoChannel: "Leadership Today TH",
      durationText: "32:00",
      lessonLevel: "INTERMEDIATE",
      lessonOrder: 4,
      summary: "ครอบคลุม Change Management Framework (Kotter, ADKAR) ประยุกต์สำหรับ AI Transformation การจัดการความต้านทาน และการสร้าง AI Champions ในองค์กร",
      learningOutcomes: "1. ประยุกต์ Change Management Framework ใน AI Transformation ได้\n2. ออกแบบ AI Adoption Strategy ได้\n3. จัดการ Change Resistance ได้อย่างมีประสิทธิภาพ",
      keyTakeaways: "• การเปลี่ยนแปลงล้มเหลว 70% เพราะ People ไม่ใช่ Technology\n• AI Champions ในแต่ละทีมช่วย Drive Adoption\n• Quick Wins สำคัญมากในช่วงแรกของ Transformation",
      coverImage: "/images/covers/ai-management-intermediate.svg",
    },
    {
      id: "lesson-mgt-5",
      title: "AI Ethics, Governance & Future Leadership",
      subtitle: "จริยธรรม AI และผู้นำในยุคอนาคต",
      description: "ศึกษา AI Ethics ในบริบทธุรกิจ การสร้าง AI Governance Framework และทักษะที่ผู้นำในยุค AI ต้องมี รวมถึง Responsible AI และ Future of Leadership",
      youtubeUrl: "https://www.youtube.com/watch?v=kSoAKN5JeOI",
      videoTitle: "AI Ethics & Responsible AI",
      videoChannel: "Ethics in Tech TH",
      durationText: "38:00",
      lessonLevel: "ADVANCED",
      lessonOrder: 5,
      summary: "ศึกษา Responsible AI Principles, AI Bias & Fairness, Privacy in AI Era, AI Governance Framework และ Leadership Skills ที่จำเป็นสำหรับยุค AI",
      learningOutcomes: "1. สร้าง AI Ethics Policy สำหรับองค์กรได้\n2. ออกแบบ AI Governance Framework ได้\n3. พัฒนาทักษะผู้นำในยุค AI ได้",
      keyTakeaways: "• Responsible AI ไม่ใช่ทางเลือก แต่เป็นสิ่งจำเป็น\n• ผู้นำยุค AI ต้อง Embrace Uncertainty และเรียนรู้ตลอดชีวิต\n• Human Values ต้องเป็นแกนกลางของ AI Strategy",
      coverImage: "/images/covers/ai-management-advanced.svg",
    },
  ],
}

// ─── Also add lesson-hr-1..3 lessonIds for the HR course ─────────────────────
// The HR seed uses "lesson-hr-" prefix, so fix that in inVideoQuizData key names above

// ─── Main seed function ───────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed expansion...")

  // 1. Add extra lessons to all courses
  for (const [courseId, lessons] of Object.entries(extraLessons)) {
    const course = await db.course.findUnique({ where: { id: courseId } })
    if (!course) {
      console.log(`⚠️  Course ${courseId} not found, skipping...`)
      continue
    }

    for (const lesson of lessons) {
      await db.lesson.upsert({
        where: { id: lesson.id },
        update: {
          title: lesson.title,
          subtitle: lesson.subtitle,
          description: lesson.description,
          youtubeUrl: lesson.youtubeUrl,
          videoTitle: lesson.videoTitle,
          videoChannel: lesson.videoChannel,
          durationText: lesson.durationText,
          lessonLevel: lesson.lessonLevel,
          lessonOrder: lesson.lessonOrder,
          summary: lesson.summary,
          learningOutcomes: lesson.learningOutcomes,
          keyTakeaways: lesson.keyTakeaways,
          coverImage: lesson.coverImage,
          isActive: true,
        },
        create: {
          id: lesson.id,
          courseId,
          title: lesson.title,
          subtitle: lesson.subtitle,
          description: lesson.description,
          youtubeUrl: lesson.youtubeUrl,
          videoTitle: lesson.videoTitle,
          videoChannel: lesson.videoChannel,
          durationText: lesson.durationText,
          lessonLevel: lesson.lessonLevel,
          lessonOrder: lesson.lessonOrder,
          summary: lesson.summary,
          learningOutcomes: lesson.learningOutcomes,
          keyTakeaways: lesson.keyTakeaways,
          coverImage: lesson.coverImage,
          isActive: true,
        },
      })
      console.log(`  ✅ Lesson ${lesson.id}: ${lesson.title}`)
    }

    // Update course duration
    await db.course.update({
      where: { id: courseId },
      data: { duration: "5 ชั่วโมง" },
    })
    console.log(`  📝 Updated ${courseId} duration → 5 ชั่วโมง`)
  }

  // 2. Seed in-video quiz questions for all lessons
  // First get all lesson IDs that match our quiz data keys
  const allLessonIds = Object.keys(inVideoQuizData)

  for (const lessonId of allLessonIds) {
    const lesson = await db.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) {
      console.log(`⚠️  Lesson ${lessonId} not found, skipping in-video quiz...`)
      continue
    }

    // Delete existing in-video quizzes for this lesson (for idempotency)
    await db.inVideoQuizQuestion.deleteMany({ where: { lessonId } })

    const questions = inVideoQuizData[lessonId]
    for (const q of questions) {
      await db.inVideoQuizQuestion.create({
        data: {
          lessonId,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          triggerPercent: q.triggerPercent,
          sortOrder: q.sortOrder,
        },
      })
    }
    console.log(`  🎯 In-video quiz for ${lessonId}: ${questions.length} questions`)
  }

  console.log("\n✨ Seed expansion complete!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
