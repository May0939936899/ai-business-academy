import { PrismaClient, CourseLevel, CorrectAnswer } from "@prisma/client"

const db = new PrismaClient()

/* ═══════════════════════════════════════════════════════════════
   COURSE DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */

interface LessonData {
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

interface QuizQuestionData {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: CorrectAnswer
  explanation: string
  difficulty: CourseLevel
  sortOrder: number
}

interface CourseData {
  id: string
  title: string
  slug: string
  courseCode: string
  description: string
  shortDescription: string
  category: string
  level: CourseLevel
  duration: string
  lessons: LessonData[]
  quizQuestions: QuizQuestionData[]
}

const courses: CourseData[] = [
  /* ──────────────────────────────────────
     COURSE 1: AI Automation
     ────────────────────────────────────── */
  {
    id: "course-ai-automation",
    title: "AI Automation for Business",
    slug: "ai-automation",
    courseCode: "AIAUT-001",
    description: "เรียนรู้การใช้ AI Automation เพื่อเพิ่มประสิทธิภาพธุรกิจ ตั้งแต่พื้นฐาน Workflow Automation ไปจนถึงการสร้างระบบ Automation ระดับองค์กร ครอบคลุม ChatGPT, Make, Zapier, n8n และเครื่องมือ AI อื่นๆ",
    shortDescription: "เรียนรู้ AI Automation ตั้งแต่พื้นฐานจนถึงระดับองค์กร",
    category: "AI Automation",
    level: "BEGINNER",
    duration: "3 ชั่วโมง",
    lessons: [
      {
        id: "lesson-aut-1",
        title: "Introduction to AI Automation",
        subtitle: "ปูพื้นฐาน AI Automation สำหรับธุรกิจ",
        description: "เริ่มต้นทำความเข้าใจ AI Automation ว่าคืออะไร ทำงานอย่างไร และสามารถช่วยธุรกิจได้อย่างไร พร้อมตัวอย่างการใช้งานจริง",
        youtubeUrl: "https://www.youtube.com/watch?v=pUHkHFnXNKE",
        videoTitle: "AI Automation คืออะไร? ทำความเข้าใจ AI สำหรับธุรกิจ",
        videoChannel: "สอนสร้างเว็บ AI",
        durationText: "25:00",
        lessonLevel: "BEGINNER",
        lessonOrder: 1,
        summary: "บทเรียนนี้ครอบคลุมพื้นฐาน AI Automation ได้แก่ ความหมายของ AI Automation, ประเภทของ Automation, เครื่องมือที่นิยมใช้ และกรณีศึกษาจากธุรกิจจริง",
        learningOutcomes: "1. อธิบายความหมายของ AI Automation ได้\n2. ระบุประเภทของ Automation ที่ใช้ในธุรกิจได้\n3. เลือกเครื่องมือ AI Automation ที่เหมาะกับงานได้",
        keyTakeaways: "• AI Automation = การใช้ AI ทำงานซ้ำๆ แทนคน\n• ช่วยลดเวลา ลดต้นทุน เพิ่มความแม่นยำ\n• เริ่มต้นได้จากงานง่ายๆ เช่น อีเมล, รายงาน",
        coverImage: "/images/covers/ai-automation-beginner.svg",
      },
      {
        id: "lesson-aut-2",
        title: "AI Workflow & Integration",
        subtitle: "เชื่อมต่อระบบ AI กับเครื่องมือต่างๆ",
        description: "เรียนรู้การสร้าง Workflow อัตโนมัติด้วย AI เชื่อมต่อเครื่องมือต่างๆ เข้าด้วยกัน เช่น Make, Zapier, n8n เพื่อสร้างระบบทำงานอัตโนมัติ",
        youtubeUrl: "https://www.youtube.com/watch?v=V_rnR2VLPPY",
        videoTitle: "สอน Make (Integromat) ต่อ Automation ธุรกิจ",
        videoChannel: "Digital Tips Academy",
        durationText: "35:00",
        lessonLevel: "INTERMEDIATE",
        lessonOrder: 2,
        summary: "เรียนรู้การสร้าง Workflow Automation ด้วยเครื่องมือ Low-code/No-code เช่น Make, Zapier การเชื่อมต่อ API และการออกแบบ Workflow ที่มีประสิทธิภาพ",
        learningOutcomes: "1. สร้าง Workflow Automation อย่างง่ายได้\n2. เชื่อมต่อเครื่องมือต่างๆ ผ่าน API ได้\n3. แก้ปัญหาเบื้องต้นเมื่อ Workflow ทำงานผิดพลาดได้",
        keyTakeaways: "• Workflow = ลำดับขั้นตอนการทำงานอัตโนมัติ\n• Make/Zapier เป็นเครื่องมือ No-code ยอดนิยม\n• เริ่มจาก Trigger → Action → Result",
        coverImage: "/images/covers/ai-automation-intermediate.svg",
      },
      {
        id: "lesson-aut-3",
        title: "Enterprise AI Automation",
        subtitle: "AI Automation ระดับองค์กร",
        description: "เจาะลึกการใช้ AI Automation ในระดับองค์กร การออกแบบระบบ Automation ขนาดใหญ่ การจัดการ Data Pipeline และ Best Practices สำหรับ Enterprise",
        youtubeUrl: "https://www.youtube.com/watch?v=TnNzinDQPBc",
        videoTitle: "AI Transformation สำหรับองค์กร",
        videoChannel: "Tech Talk Thai",
        durationText: "40:00",
        lessonLevel: "ADVANCED",
        lessonOrder: 3,
        summary: "ศึกษาการนำ AI Automation ไปใช้ในระดับองค์กร ครอบคลุม Enterprise Architecture, Data Pipeline, Security และการวัดผล ROI ของ AI Automation",
        learningOutcomes: "1. ออกแบบ AI Automation Architecture สำหรับองค์กรได้\n2. ประเมิน ROI ของ AI Automation ได้\n3. วางแผน AI Transformation Roadmap ได้",
        keyTakeaways: "• Enterprise AI ต้องคำนึงถึง Security และ Governance\n• ROI วัดจากเวลาที่ประหยัด, ลดข้อผิดพลาด, เพิ่มรายได้\n• ต้องมี Change Management ควบคู่กับ Technology",
        coverImage: "/images/covers/ai-automation-advanced.svg",
      },
    ],
    quizQuestions: [
      { question: "AI Automation หมายถึงอะไร?", optionA: "การใช้ AI ทำงานซ้ำๆ แทนมนุษย์โดยอัตโนมัติ", optionB: "การเขียนโค้ดด้วย AI เท่านั้น", optionC: "การใช้หุ่นยนต์ในโรงงาน", optionD: "การสร้างเว็บไซต์ด้วย AI", correctAnswer: "A", explanation: "AI Automation คือการใช้เทคโนโลยี AI ในการทำงานที่ซ้ำซากโดยอัตโนมัติ ไม่จำกัดเฉพาะการเขียนโค้ดหรือหุ่นยนต์", difficulty: "BEGINNER", sortOrder: 1 },
      { question: "เครื่องมือใดเป็น No-code Automation Platform?", optionA: "Visual Studio Code", optionB: "Make (Integromat)", optionC: "Photoshop", optionD: "Excel", correctAnswer: "B", explanation: "Make (เดิมชื่อ Integromat) เป็น No-code Automation Platform ที่ช่วยสร้าง Workflow อัตโนมัติโดยไม่ต้องเขียนโค้ด", difficulty: "BEGINNER", sortOrder: 2 },
      { question: "Workflow Automation เริ่มต้นจากอะไร?", optionA: "Result", optionB: "Action", optionC: "Trigger", optionD: "Feedback", correctAnswer: "C", explanation: "Workflow Automation เริ่มจาก Trigger (เหตุการณ์ที่กระตุ้น) → Action (การกระทำ) → Result (ผลลัพธ์)", difficulty: "BEGINNER", sortOrder: 3 },
      { question: "API ในบริบท Automation หมายถึงอะไร?", optionA: "Application Programming Interface — ช่องทางเชื่อมต่อระบบต่างๆ", optionB: "Automated Process Integration", optionC: "AI Powered Intelligence", optionD: "Advanced Programming Interface", correctAnswer: "A", explanation: "API (Application Programming Interface) คือช่องทางที่ระบบต่างๆ ใช้สื่อสารกัน ทำให้เชื่อมต่อเครื่องมือหลายตัวเข้าด้วยกันได้", difficulty: "INTERMEDIATE", sortOrder: 4 },
      { question: "ข้อใดเป็นตัวอย่างของ AI Automation ในงานธุรกิจ?", optionA: "ส่งอีเมลตอบกลับลูกค้าอัตโนมัติตามเนื้อหา", optionB: "พิมพ์เอกสารด้วยมือ", optionC: "ประชุมแบบ face-to-face", optionD: "จดบันทึกด้วยกระดาษ", correctAnswer: "A", explanation: "การส่งอีเมลตอบกลับอัตโนมัติโดยใช้ AI วิเคราะห์เนื้อหาเป็นตัวอย่างที่ดีของ AI Automation ในธุรกิจ", difficulty: "INTERMEDIATE", sortOrder: 5 },
      { question: "การเลือก Trigger ที่ดีสำหรับ Workflow ควรคำนึงถึงอะไร?", optionA: "ความถี่ที่เหตุการณ์เกิดขึ้นและความสำคัญของงาน", optionB: "ราคาของเครื่องมือเท่านั้น", optionC: "จำนวนพนักงาน", optionD: "ขนาดบริษัท", correctAnswer: "A", explanation: "Trigger ที่ดีควรพิจารณาจากความถี่ที่เหตุการณ์เกิดขึ้น ความสำคัญของงาน และผลกระทบต่อธุรกิจ", difficulty: "INTERMEDIATE", sortOrder: 6 },
      { question: "Enterprise AI Automation ต่างจาก Personal Automation อย่างไร?", optionA: "ต้องคำนึงถึง Security, Governance และ Scalability", optionB: "ใช้เครื่องมือเดียวกันแต่จ่ายแพงกว่า", optionC: "ไม่มีความแตกต่าง", optionD: "ใช้เฉพาะ ChatGPT", correctAnswer: "A", explanation: "Enterprise AI Automation ต้องคำนึงถึง Security, Data Governance, Scalability และ Compliance ซึ่งซับซ้อนกว่า Personal Automation", difficulty: "ADVANCED", sortOrder: 7 },
      { question: "ROI ของ AI Automation วัดจากอะไร?", optionA: "จำนวน Automation ที่สร้าง", optionB: "เวลาที่ประหยัด, ลดข้อผิดพลาด, เพิ่มรายได้", optionC: "ราคาซอฟต์แวร์", optionD: "จำนวนพนักงาน IT", correctAnswer: "B", explanation: "ROI ของ AI Automation วัดจากหลายมิติ ได้แก่ เวลาที่ประหยัดได้ การลดข้อผิดพลาด และรายได้ที่เพิ่มขึ้น", difficulty: "ADVANCED", sortOrder: 8 },
      { question: "Change Management สำคัญกับ AI Transformation อย่างไร?", optionA: "ไม่สำคัญ เพราะ AI ทำงานแทนคน", optionB: "ช่วยให้พนักงานปรับตัวและยอมรับเทคโนโลยีใหม่", optionC: "เป็นเรื่องของฝ่าย IT เท่านั้น", optionD: "ต้องทำหลังจาก Deploy ระบบเสร็จ", correctAnswer: "B", explanation: "Change Management ช่วยให้พนักงานเข้าใจ ยอมรับ และปรับตัวกับเทคโนโลยีใหม่ ควรทำควบคู่กับการ Deploy ไม่ใช่ทำทีหลัง", difficulty: "ADVANCED", sortOrder: 9 },
      { question: "Data Pipeline ใน Enterprise Automation ทำหน้าที่อะไร?", optionA: "เชื่อมต่อ Social Media", optionB: "จัดการการไหลของข้อมูลระหว่างระบบต่างๆ อย่างเป็นระบบ", optionC: "สร้างกราฟิก", optionD: "บริหารบุคลากร", correctAnswer: "B", explanation: "Data Pipeline จัดการการไหลของข้อมูลจากแหล่งต่างๆ ผ่านการประมวลผลไปยังปลายทาง เป็นหัวใจสำคัญของ Enterprise Automation", difficulty: "ADVANCED", sortOrder: 10 },
    ],
  },

  /* ──────────────────────────────────────
     COURSE 2: AI Marketing
     ────────────────────────────────────── */
  {
    id: "course-ai-marketing",
    title: "AI Marketing Strategy",
    slug: "ai-marketing",
    courseCode: "AIMKT-001",
    description: "เรียนรู้การใช้ AI ในงานการตลาดดิจิทัล ตั้งแต่พื้นฐาน AI Marketing ไปจนถึงกลยุทธ์ขั้นสูง ครอบคลุม Content Creation, Campaign Optimization และ Data-Driven Marketing",
    shortDescription: "ใช้ AI ยกระดับการตลาดดิจิทัลของคุณ",
    category: "AI Marketing",
    level: "BEGINNER",
    duration: "3 ชั่วโมง",
    lessons: [
      {
        id: "lesson-mkt-1",
        title: "AI for Digital Marketing Basics",
        subtitle: "AI สำหรับการตลาดดิจิทัลเบื้องต้น",
        description: "เริ่มต้นเรียนรู้การใช้ AI ในงานการตลาด ทำความเข้าใจ AI Marketing, เครื่องมือสำคัญ และวิธีนำไปใช้กับธุรกิจจริง",
        youtubeUrl: "https://www.youtube.com/watch?v=L6E1BRGA1QQ",
        videoTitle: "AI Marketing คืออะไร? เริ่มต้นใช้ AI ทำการตลาด",
        videoChannel: "การตลาดวันละตอน",
        durationText: "28:00",
        lessonLevel: "BEGINNER",
        lessonOrder: 1,
        summary: "ครอบคลุมพื้นฐาน AI Marketing ได้แก่ การใช้ ChatGPT สร้าง Content, AI Tools สำหรับ Social Media และการวิเคราะห์กลุ่มเป้าหมาย",
        learningOutcomes: "1. เข้าใจแนวคิด AI Marketing\n2. ใช้ ChatGPT สร้าง Marketing Content ได้\n3. รู้จักเครื่องมือ AI สำหรับการตลาด",
        keyTakeaways: "• AI Marketing ช่วยสร้าง Content เร็วขึ้น 10 เท่า\n• ChatGPT ช่วยเขียน Copy, วิเคราะห์ตลาด, สร้างไอเดีย\n• เริ่มจากงานที่ทำซ้ำๆ แล้วค่อยขยาย",
        coverImage: "/images/covers/ai-marketing-beginner.svg",
      },
      {
        id: "lesson-mkt-2",
        title: "AI Campaign Optimization",
        subtitle: "การใช้ AI เพิ่มประสิทธิภาพแคมเปญ",
        description: "เรียนรู้การใช้ AI วิเคราะห์และเพิ่มประสิทธิภาพแคมเปญการตลาด A/B Testing ด้วย AI และ Performance Marketing",
        youtubeUrl: "https://www.youtube.com/watch?v=5j1GFkaO-0s",
        videoTitle: "สอนทำ Digital Marketing ด้วย AI",
        videoChannel: "Moo Marketer",
        durationText: "32:00",
        lessonLevel: "INTERMEDIATE",
        lessonOrder: 2,
        summary: "เจาะลึกการใช้ AI วิเคราะห์ Campaign Performance, การทำ A/B Testing อัตโนมัติ และการใช้ Data วิเคราะห์กลุ่มเป้าหมาย",
        learningOutcomes: "1. วิเคราะห์ Campaign Performance ด้วย AI ได้\n2. ตั้งค่า A/B Testing อัตโนมัติได้\n3. ใช้ Data-Driven Approach ในการตลาดได้",
        keyTakeaways: "• A/B Testing ด้วย AI ช่วยหาสิ่งที่ดีที่สุดเร็วขึ้น\n• AI วิเคราะห์ Customer Behavior ได้แม่นยำ\n• Personalization คือกุญแจสำคัญของ AI Marketing",
        coverImage: "/images/covers/ai-marketing-intermediate.svg",
      },
      {
        id: "lesson-mkt-3",
        title: "AI Marketing Strategy",
        subtitle: "กลยุทธ์การตลาด AI ขั้นสูง",
        description: "วางกลยุทธ์การตลาดด้วย AI ระดับองค์กร Predictive Marketing, Customer Lifetime Value และการสร้าง Marketing Automation System",
        youtubeUrl: "https://www.youtube.com/watch?v=bx7LT0L2E90",
        videoTitle: "Marketing Strategy ด้วย AI & Data",
        videoChannel: "Marketing Oops!",
        durationText: "38:00",
        lessonLevel: "ADVANCED",
        lessonOrder: 3,
        summary: "ศึกษากลยุทธ์การตลาดขั้นสูงที่ใช้ AI ครอบคลุม Predictive Analytics, CLV Analysis, Omnichannel Strategy และ Marketing Automation",
        learningOutcomes: "1. วางแผน AI Marketing Strategy ได้\n2. วิเคราะห์ Customer Lifetime Value ด้วย AI\n3. ออกแบบ Omnichannel Marketing System ได้",
        keyTakeaways: "• Predictive Marketing ช่วยคาดการณ์พฤติกรรมลูกค้า\n• CLV Analysis ช่วยจัดสรรงบการตลาดอย่างมีประสิทธิภาพ\n• Omnichannel = ประสบการณ์ลูกค้าที่เชื่อมต่อกัน",
        coverImage: "/images/covers/ai-marketing-advanced.svg",
      },
    ],
    quizQuestions: [
      { question: "AI Marketing ช่วยธุรกิจในด้านใดมากที่สุด?", optionA: "สร้าง Content และวิเคราะห์กลุ่มเป้าหมายได้เร็วและแม่นยำขึ้น", optionB: "ทดแทนนักการตลาดทั้งหมด", optionC: "ลดจำนวนพนักงาน", optionD: "สร้างผลิตภัณฑ์ใหม่", correctAnswer: "A", explanation: "AI Marketing ช่วยในด้านการสร้าง Content ได้เร็วขึ้น วิเคราะห์กลุ่มเป้าหมายแม่นยำ แต่ยังต้องมีนักการตลาดกำกับทิศทาง", difficulty: "BEGINNER", sortOrder: 1 },
      { question: "ChatGPT สามารถช่วยนักการตลาดทำอะไรได้?", optionA: "เขียน Ad Copy, สร้างไอเดีย Content, วิเคราะห์ตลาด", optionB: "ยิง Ads โดยอัตโนมัติ", optionC: "สร้างวิดีโอโฆษณา", optionD: "จัดส่งสินค้า", correctAnswer: "A", explanation: "ChatGPT ช่วยเขียน Copy, Brainstorm ไอเดีย, วิเคราะห์ข้อมูลตลาด แต่ยังไม่สามารถยิง Ads หรือสร้างวิดีโอได้โดยตรง", difficulty: "BEGINNER", sortOrder: 2 },
      { question: "เครื่องมือ AI ใดเหมาะสำหรับสร้าง Social Media Content?", optionA: "ChatGPT, Canva AI, Copy.ai", optionB: "Excel, PowerPoint", optionC: "SAP, Oracle", optionD: "AutoCAD", correctAnswer: "A", explanation: "ChatGPT ช่วยเขียนข้อความ, Canva AI ช่วยออกแบบกราฟิก, Copy.ai ช่วยเขียน Marketing Copy โดยเฉพาะ", difficulty: "BEGINNER", sortOrder: 3 },
      { question: "A/B Testing ด้วย AI ดีกว่าแบบดั้งเดิมอย่างไร?", optionA: "AI สามารถทดสอบหลายตัวแปรพร้อมกันและหาผลลัพธ์ที่ดีที่สุดได้เร็วกว่า", optionB: "ไม่มีความแตกต่าง", optionC: "ถูกกว่า", optionD: "ใช้เวลานานกว่าแต่แม่นยำกว่า", correctAnswer: "A", explanation: "AI สามารถทำ Multivariate Testing ทดสอบหลายตัวแปรพร้อมกัน วิเคราะห์ผลลัพธ์แบบ Real-time และปรับแคมเปญได้อัตโนมัติ", difficulty: "INTERMEDIATE", sortOrder: 4 },
      { question: "Data-Driven Marketing หมายถึงอะไร?", optionA: "การตลาดที่ใช้ข้อมูลเป็นฐานในการตัดสินใจ", optionB: "การตลาดที่ใช้แต่ Social Media", optionC: "การตลาดแบบ Door-to-door", optionD: "การตลาดที่ไม่ต้องใช้เทคโนโลยี", correctAnswer: "A", explanation: "Data-Driven Marketing คือแนวทางการตลาดที่ใช้ข้อมูลจริงจากลูกค้า ตลาด และ Campaign เป็นฐานในการตัดสินใจ", difficulty: "INTERMEDIATE", sortOrder: 5 },
      { question: "Personalization ในการตลาดด้วย AI คืออะไร?", optionA: "การส่งข้อความเดียวกันให้ทุกคน", optionB: "การปรับ Content และข้อเสนอให้ตรงกับแต่ละบุคคล", optionC: "การใช้ชื่อลูกค้าในอีเมลเท่านั้น", optionD: "การลดราคาให้ทุกคน", correctAnswer: "B", explanation: "Personalization คือการใช้ AI วิเคราะห์ข้อมูลลูกค้า แล้วปรับ Content, ข้อเสนอ, และประสบการณ์ให้เหมาะกับแต่ละบุคคล", difficulty: "INTERMEDIATE", sortOrder: 6 },
      { question: "Predictive Marketing ใช้ AI ทำอะไร?", optionA: "คาดการณ์พฤติกรรมลูกค้าและแนวโน้มตลาดในอนาคต", optionB: "ทำนายสภาพอากาศ", optionC: "พยากรณ์หุ้น", optionD: "ทำนายผลฟุตบอล", correctAnswer: "A", explanation: "Predictive Marketing ใช้ AI วิเคราะห์ข้อมูลในอดีตเพื่อคาดการณ์พฤติกรรมลูกค้า แนวโน้มการซื้อ และ Churn Rate", difficulty: "ADVANCED", sortOrder: 7 },
      { question: "Customer Lifetime Value (CLV) สำคัญกับ AI Marketing อย่างไร?", optionA: "ช่วยจัดสรรงบการตลาดให้กับลูกค้าที่มีมูลค่าสูง", optionB: "ไม่สำคัญ ใช้ AI แทนได้", optionC: "ใช้วัดจำนวนพนักงาน", optionD: "ใช้คำนวณภาษี", correctAnswer: "A", explanation: "CLV ช่วยให้เข้าใจมูลค่าของลูกค้าแต่ละกลุ่ม ทำให้สามารถจัดสรรงบการตลาดได้อย่างมีประสิทธิภาพ ลงทุนกับลูกค้าที่คุ้มค่า", difficulty: "ADVANCED", sortOrder: 8 },
      { question: "Omnichannel Marketing ด้วย AI หมายถึงอะไร?", optionA: "การตลาดเฉพาะบน Online", optionB: "การสร้างประสบการณ์ลูกค้าที่เชื่อมต่อกันในทุกช่องทาง", optionC: "การใช้ทุกช่องทางแยกกัน", optionD: "การตลาดเฉพาะบน Social Media", correctAnswer: "B", explanation: "Omnichannel ใช้ AI เชื่อมต่อประสบการณ์ลูกค้าในทุกช่องทาง ทั้ง Online และ Offline ให้เป็นหนึ่งเดียวกัน", difficulty: "ADVANCED", sortOrder: 9 },
      { question: "การวัดความสำเร็จของ AI Marketing ควรดูจากอะไร?", optionA: "Conversion Rate, ROAS, CAC, CLV", optionB: "จำนวน Like และ Share เท่านั้น", optionC: "จำนวนโพสต์ต่อวัน", optionD: "จำนวนเครื่องมือที่ใช้", correctAnswer: "A", explanation: "ควรวัดจาก Metrics ที่สัมพันธ์กับธุรกิจจริง เช่น Conversion Rate, Return on Ad Spend, Customer Acquisition Cost และ CLV", difficulty: "ADVANCED", sortOrder: 10 },
    ],
  },

  /* ──────────────────────────────────────
     COURSE 3: AI HR
     ────────────────────────────────────── */
  {
    id: "course-ai-hr",
    title: "AI for Human Resources",
    slug: "ai-hr",
    courseCode: "AIHR-001",
    description: "เรียนรู้การใช้ AI ในงาน HR ตั้งแต่การสรรหาบุคลากรด้วย AI ไปจนถึงการบริหารทรัพยากรมนุษย์เชิงกลยุทธ์ ครอบคลุม AI Recruitment, Talent Management และ Workforce Planning",
    shortDescription: "AI สำหรับงาน HR และบริหารทรัพยากรมนุษย์",
    category: "AI HR",
    level: "BEGINNER",
    duration: "3 ชั่วโมง",
    lessons: [
      {
        id: "lesson-hr-1",
        title: "AI for Recruitment",
        subtitle: "AI สำหรับการสรรหาบุคลากร",
        description: "เรียนรู้การใช้ AI ในกระบวนการสรรหาบุคลากร ตั้งแต่การคัดกรอง Resume, การสัมภาษณ์ด้วย AI ไปจนถึง Candidate Matching",
        youtubeUrl: "https://www.youtube.com/watch?v=DfKMdJWtyOk",
        videoTitle: "AI กับงาน HR ยุคใหม่",
        videoChannel: "HR Society",
        durationText: "30:00",
        lessonLevel: "BEGINNER",
        lessonOrder: 1,
        summary: "ครอบคลุมการใช้ AI ในกระบวนการสรรหา ได้แก่ AI Resume Screening, Chatbot สำหรับ Pre-screening และ Candidate Matching Algorithm",
        learningOutcomes: "1. เข้าใจกระบวนการ AI Recruitment\n2. ใช้เครื่องมือ AI คัดกรอง Resume ได้\n3. ออกแบบ Recruitment Flow ที่มี AI ช่วยได้",
        keyTakeaways: "• AI ช่วยคัดกรอง Resume ได้เร็วขึ้น 10 เท่า\n• Chatbot ช่วย Pre-screening ผู้สมัคร 24/7\n• ยังต้องมี Human Touch ในขั้นตอนสำคัญ",
        coverImage: "/images/covers/ai-hr-beginner.svg",
      },
      {
        id: "lesson-hr-2",
        title: "AI Talent Management",
        subtitle: "AI บริหารจัดการความสามารถ",
        description: "การใช้ AI ในการบริหาร Talent พนักงาน ทั้ง Performance Management, Learning & Development และ Employee Engagement",
        youtubeUrl: "https://www.youtube.com/watch?v=xvfHdxRFGxs",
        videoTitle: "People Analytics กับงาน HR",
        videoChannel: "PMAT Thailand",
        durationText: "35:00",
        lessonLevel: "INTERMEDIATE",
        lessonOrder: 2,
        summary: "เรียนรู้ People Analytics, AI-powered Performance Management, Skill Gap Analysis และ Personalized Learning Path สำหรับพนักงาน",
        learningOutcomes: "1. วิเคราะห์ข้อมูลพนักงานด้วย People Analytics\n2. ออกแบบ Performance Management ด้วย AI\n3. สร้าง Learning Path ส่วนบุคคลได้",
        keyTakeaways: "• People Analytics เปลี่ยน HR จาก Intuition เป็น Data-driven\n• AI ช่วยหา Skill Gap และแนะนำการพัฒนา\n• Employee Engagement วัดได้ด้วย AI Sentiment Analysis",
        coverImage: "/images/covers/ai-hr-intermediate.svg",
      },
      {
        id: "lesson-hr-3",
        title: "AI Workforce Strategy",
        subtitle: "กลยุทธ์ AI สำหรับกำลังคน",
        description: "วางกลยุทธ์ Workforce Planning ด้วย AI การพยากรณ์อัตรากำลัง การวิเคราะห์ Turnover Risk และ Strategic HR",
        youtubeUrl: "https://www.youtube.com/watch?v=T_HkFEBgMq4",
        videoTitle: "HR Transformation ด้วย AI",
        videoChannel: "CHRO Thailand",
        durationText: "42:00",
        lessonLevel: "ADVANCED",
        lessonOrder: 3,
        summary: "ศึกษาการใช้ AI ในระดับกลยุทธ์ HR ครอบคลุม Workforce Planning, Predictive Turnover, Succession Planning และ HR Transformation",
        learningOutcomes: "1. วางแผน Workforce ด้วย AI ได้\n2. พยากรณ์ Employee Turnover ได้\n3. สร้าง HR Transformation Roadmap ได้",
        keyTakeaways: "• AI Workforce Planning ช่วยคาดการณ์อัตรากำลังล่วงหน้า\n• Predictive Turnover ช่วยลดอัตราการลาออก\n• HR Transformation ต้องเริ่มจากวัฒนธรรมองค์กร",
        coverImage: "/images/covers/ai-hr-advanced.svg",
      },
    ],
    quizQuestions: [
      { question: "AI Resume Screening ทำงานอย่างไร?", optionA: "วิเคราะห์คำสำคัญและคุณสมบัติจาก Resume โดยอัตโนมัติ", optionB: "สุ่มเลือก Resume", optionC: "ดูเฉพาะรูปถ่าย", optionD: "อ่านเฉพาะชื่อสถาบัน", correctAnswer: "A", explanation: "AI Resume Screening ใช้ NLP วิเคราะห์คำสำคัญ ทักษะ และคุณสมบัติจาก Resume แล้วจับคู่กับ Job Description", difficulty: "BEGINNER", sortOrder: 1 },
      { question: "Chatbot ในงาน HR Recruitment ช่วยอะไรได้?", optionA: "Pre-screening ผู้สมัครและตอบคำถามเบื้องต้น 24/7", optionB: "ตัดสินใจจ้างแทน HR", optionC: "ลงโทษพนักงาน", optionD: "คำนวณเงินเดือน", correctAnswer: "A", explanation: "HR Chatbot ช่วย Pre-screening ผู้สมัคร ตอบคำถามที่พบบ่อย นัดหมายสัมภาษณ์ ทำงานได้ตลอด 24/7", difficulty: "BEGINNER", sortOrder: 2 },
      { question: "ข้อใดคือข้อจำกัดของ AI ในงาน Recruitment?", optionA: "ไม่สามารถประเมิน Culture Fit ได้ดีเท่ามนุษย์", optionB: "ไม่มีข้อจำกัด", optionC: "ทำได้ทุกอย่าง", optionD: "ช้ากว่าคน", correctAnswer: "A", explanation: "AI ยังไม่สามารถประเมิน Culture Fit, Soft Skills และ Emotional Intelligence ได้ดีเท่ามนุษย์ จึงยังต้องมี Human Touch", difficulty: "BEGINNER", sortOrder: 3 },
      { question: "People Analytics คืออะไร?", optionA: "การใช้ข้อมูลและ AI วิเคราะห์เพื่อการตัดสินใจด้าน HR", optionB: "การนับจำนวนพนักงาน", optionC: "การจ่ายเงินเดือน", optionD: "การประเมินผลงานแบบดั้งเดิม", correctAnswer: "A", explanation: "People Analytics ใช้ Data Science และ AI วิเคราะห์ข้อมูลพนักงานเพื่อสนับสนุนการตัดสินใจด้าน HR อย่างมีหลักฐาน", difficulty: "INTERMEDIATE", sortOrder: 4 },
      { question: "Skill Gap Analysis ด้วย AI ช่วยองค์กรอย่างไร?", optionA: "ระบุทักษะที่ขาดและแนะนำแนวทางพัฒนาที่เหมาะสม", optionB: "ลดเงินเดือนพนักงาน", optionC: "จ้างพนักงานใหม่แทนเสมอ", optionD: "ไม่ช่วยอะไร", correctAnswer: "A", explanation: "AI วิเคราะห์ทักษะปัจจุบันเทียบกับทักษะที่ต้องการ แล้วแนะนำ Training หรือ Learning Path ที่เหมาะสมให้แต่ละคน", difficulty: "INTERMEDIATE", sortOrder: 5 },
      { question: "AI Sentiment Analysis ใน HR ใช้ทำอะไร?", optionA: "วิเคราะห์ความรู้สึกของพนักงานจาก Survey, Chat และ Feedback", optionB: "ตรวจจับการโกง", optionC: "วิเคราะห์ตลาดหุ้น", optionD: "ออกแบบสำนักงาน", correctAnswer: "A", explanation: "AI Sentiment Analysis วิเคราะห์ข้อความจาก Survey, ช่องทางสื่อสาร และ Feedback เพื่อวัด Employee Engagement และความพึงพอใจ", difficulty: "INTERMEDIATE", sortOrder: 6 },
      { question: "Predictive Turnover Model ทำนายอะไร?", optionA: "ความเสี่ยงที่พนักงานจะลาออก", optionB: "ยอดขาย", optionC: "สภาพอากาศ", optionD: "ราคาหุ้น", correctAnswer: "A", explanation: "Predictive Turnover Model ใช้ AI วิเคราะห์ปัจจัยต่างๆ เพื่อทำนายความเสี่ยงที่พนักงานจะลาออก ช่วยให้ HR ดำเนินการป้องกันได้ทัน", difficulty: "ADVANCED", sortOrder: 7 },
      { question: "Workforce Planning ด้วย AI ดีกว่าแบบดั้งเดิมอย่างไร?", optionA: "คาดการณ์อัตรากำลังได้แม่นยำ โดยพิจารณาหลายปัจจัยพร้อมกัน", optionB: "ไม่มีความแตกต่าง", optionC: "ใช้เวลานานกว่า", optionD: "แพงกว่าเท่านั้น", correctAnswer: "A", explanation: "AI สามารถพิจารณาหลายปัจจัยพร้อมกัน เช่น Turnover Rate, Growth Plan, Market Trends เพื่อคาดการณ์อัตรากำลังได้แม่นยำ", difficulty: "ADVANCED", sortOrder: 8 },
      { question: "Succession Planning ด้วย AI คืออะไร?", optionA: "การใช้ AI ระบุและเตรียมผู้สืบทอดตำแหน่งสำคัญ", optionB: "การเลิกจ้างพนักงาน", optionC: "การจ่ายโบนัส", optionD: "การจัดงานเลี้ยง", correctAnswer: "A", explanation: "AI Succession Planning วิเคราะห์ Performance, Potential และ Readiness ของพนักงาน เพื่อระบุผู้ที่เหมาะสมจะสืบทอดตำแหน่งสำคัญ", difficulty: "ADVANCED", sortOrder: 9 },
      { question: "HR Transformation ด้วย AI ควรเริ่มจากอะไร?", optionA: "เข้าใจปัญหาปัจจุบัน วาง Roadmap และสร้าง Data Culture", optionB: "ซื้อซอฟต์แวร์แพงที่สุด", optionC: "เลิกจ้าง HR ทั้งหมด", optionD: "รอให้เทคโนโลยีพร้อม 100%", correctAnswer: "A", explanation: "HR Transformation ต้องเริ่มจากการเข้าใจปัญหา วาง Roadmap ที่ชัดเจน และสร้าง Data Culture ในองค์กรก่อน แล้วค่อยเลือกเทคโนโลยี", difficulty: "ADVANCED", sortOrder: 10 },
    ],
  },

  /* ──────────────────────────────────────
     COURSE 4: AI Productivity
     ────────────────────────────────────── */
  {
    id: "course-ai-productivity",
    title: "AI Productivity Tools",
    slug: "ai-productivity",
    courseCode: "AIPRD-001",
    description: "เรียนรู้การใช้ AI เพิ่มประสิทธิภาพการทำงาน ตั้งแต่เครื่องมือ AI พื้นฐานไปจนถึงระบบ AI Productivity ขั้นสูง ครอบคลุม ChatGPT, Notion AI, และ AI Assistant ต่างๆ",
    shortDescription: "ใช้ AI เพิ่มประสิทธิภาพการทำงาน 10 เท่า",
    category: "AI Productivity",
    level: "BEGINNER",
    duration: "3 ชั่วโมง",
    lessons: [
      {
        id: "lesson-prd-1",
        title: "AI Productivity Tools",
        subtitle: "เครื่องมือ AI เพิ่มประสิทธิภาพ",
        description: "แนะนำเครื่องมือ AI ที่ช่วยเพิ่มประสิทธิภาพการทำงาน ตั้งแต่ ChatGPT, Claude, Gemini ไปจนถึง AI Tools เฉพาะทาง",
        youtubeUrl: "https://www.youtube.com/watch?v=QFEwWbV6F2o",
        videoTitle: "รวมเครื่องมือ AI เพิ่มประสิทธิภาพทำงาน",
        videoChannel: "ลงทุนแมน",
        durationText: "22:00",
        lessonLevel: "BEGINNER",
        lessonOrder: 1,
        summary: "แนะนำเครื่องมือ AI สำหรับการทำงาน ครอบคลุม ChatGPT, Claude, Gemini, Notion AI, Microsoft Copilot และวิธีเลือกเครื่องมือที่เหมาะกับงาน",
        learningOutcomes: "1. รู้จักเครื่องมือ AI Productivity หลัก\n2. เลือกเครื่องมือที่เหมาะกับประเภทงานได้\n3. ใช้ ChatGPT เพิ่มประสิทธิภาพงานเบื้องต้นได้",
        keyTakeaways: "• ChatGPT/Claude เหมาะกับงานเขียน วิเคราะห์ สรุป\n• Notion AI เหมาะกับ Project Management\n• เลือกเครื่องมือตามประเภทงาน ไม่ใช่ตามกระแส",
        coverImage: "/images/covers/ai-productivity-beginner.svg",
      },
      {
        id: "lesson-prd-2",
        title: "AI Workflow Productivity",
        subtitle: "AI Workflow เพิ่มประสิทธิภาพ",
        description: "สร้าง Workflow การทำงานที่มี AI เป็นตัวช่วย การออกแบบ Prompt Template, AI Routine และ Standard Operating Procedure ด้วย AI",
        youtubeUrl: "https://www.youtube.com/watch?v=aPBBT3IpDzI",
        videoTitle: "สร้าง Workflow ทำงานด้วย AI",
        videoChannel: "AI by ดร.เอ็ม",
        durationText: "30:00",
        lessonLevel: "INTERMEDIATE",
        lessonOrder: 2,
        summary: "เรียนรู้การออกแบบ AI Workflow สำหรับการทำงาน ครอบคลุม Prompt Engineering, AI Template, SOP ด้วย AI และ Workflow Optimization",
        learningOutcomes: "1. ออกแบบ AI Workflow สำหรับทีมได้\n2. สร้าง Prompt Template ที่มีประสิทธิภาพ\n3. เพิ่มผลผลิตของทีมด้วย AI ได้",
        keyTakeaways: "• Prompt Template ช่วยให้ได้ผลลัพธ์สม่ำเสมอ\n• AI SOP ช่วยทำให้งานเป็นมาตรฐาน\n• ทำ Daily AI Routine เพิ่มประสิทธิภาพ 3-5 เท่า",
        coverImage: "/images/covers/ai-productivity-intermediate.svg",
      },
      {
        id: "lesson-prd-3",
        title: "AI Productivity Systems",
        subtitle: "ระบบ AI Productivity ขั้นสูง",
        description: "สร้างระบบ AI Productivity ระดับองค์กร การใช้ AI Agent, Custom GPTs และ Enterprise AI Productivity Platform",
        youtubeUrl: "https://www.youtube.com/watch?v=OwgZWJt3RMU",
        videoTitle: "AI Agent สร้างระบบทำงานอัตโนมัติ",
        videoChannel: "Tech Business Thai",
        durationText: "38:00",
        lessonLevel: "ADVANCED",
        lessonOrder: 3,
        summary: "ศึกษาการสร้างระบบ AI Productivity ขั้นสูง ครอบคลุม AI Agent, Custom GPTs, Enterprise AI Platform และการวัดผล Productivity",
        learningOutcomes: "1. สร้าง AI Agent สำหรับงานเฉพาะทางได้\n2. ออกแบบ Enterprise AI Productivity System ได้\n3. วัดผลการเพิ่มประสิทธิภาพด้วย AI ได้",
        keyTakeaways: "• AI Agent ทำงานแทนได้หลายขั้นตอน\n• Custom GPTs ปรับแต่งตามความต้องการองค์กร\n• วัดผลจาก Time Saved, Quality, Output Volume",
        coverImage: "/images/covers/ai-productivity-advanced.svg",
      },
    ],
    quizQuestions: [
      { question: "ChatGPT เหมาะกับงานประเภทใดมากที่สุด?", optionA: "งานเขียน สรุป วิเคราะห์ และ Brainstorm", optionB: "งานออกแบบกราฟิก", optionC: "งานตัดต่อวิดีโอ", optionD: "งานบัญชีทั้งหมด", correctAnswer: "A", explanation: "ChatGPT เป็น Large Language Model ที่เก่งด้านภาษา จึงเหมาะกับงานเขียน สรุป วิเคราะห์ข้อความ และ Brainstorm ไอเดีย", difficulty: "BEGINNER", sortOrder: 1 },
      { question: "การเลือกเครื่องมือ AI ควรพิจารณาอะไรเป็นหลัก?", optionA: "ประเภทงานที่ต้องทำและผลลัพธ์ที่ต้องการ", optionB: "ราคาถูกที่สุด", optionC: "ยอดนิยมมากที่สุด", optionD: "ฟีเจอร์มากที่สุด", correctAnswer: "A", explanation: "ควรเลือกเครื่องมือตามลักษณะงานจริงที่ต้องทำ ไม่ใช่ตามราคาหรือกระแส เพราะแต่ละเครื่องมือเก่งคนละด้าน", difficulty: "BEGINNER", sortOrder: 2 },
      { question: "Notion AI ช่วยในด้านใด?", optionA: "จัดการโปรเจกต์ สรุปเนื้อหา และเขียน Content", optionB: "ตัดต่อวิดีโอเท่านั้น", optionC: "คำนวณภาษี", optionD: "ออกแบบโลโก้", correctAnswer: "A", explanation: "Notion AI ผสาน AI เข้ากับ Workspace ช่วยจัดการโปรเจกต์ สรุปเนื้อหา เขียน Content และ Brainstorm ได้ภายในแพลตฟอร์มเดียว", difficulty: "BEGINNER", sortOrder: 3 },
      { question: "Prompt Template คืออะไร?", optionA: "คำสั่งสำเร็จรูปที่ออกแบบมาให้ได้ผลลัพธ์สม่ำเสมอ", optionB: "Template สำหรับพิมพ์เอกสาร", optionC: "โค้ดสำหรับเขียนโปรแกรม", optionD: "Template อีเมล", correctAnswer: "A", explanation: "Prompt Template คือชุดคำสั่งที่ออกแบบมาแล้วสำหรับงานเฉพาะ ช่วยให้ได้ผลลัพธ์ที่สม่ำเสมอและมีคุณภาพ ไม่ต้องคิด Prompt ใหม่ทุกครั้ง", difficulty: "INTERMEDIATE", sortOrder: 4 },
      { question: "AI SOP (Standard Operating Procedure) มีประโยชน์อย่างไร?", optionA: "สร้างมาตรฐานการทำงานที่รวม AI ไว้ในทุกขั้นตอน", optionB: "ทดแทนพนักงานทั้งหมด", optionC: "ลดเงินเดือน", optionD: "ไม่มีประโยชน์", correctAnswer: "A", explanation: "AI SOP คือขั้นตอนการทำงานมาตรฐานที่ระบุว่าขั้นตอนใดใช้ AI ช่วย อย่างไร ช่วยให้ทีมทำงานเป็นมาตรฐานเดียวกัน", difficulty: "INTERMEDIATE", sortOrder: 5 },
      { question: "Daily AI Routine ช่วยเพิ่มประสิทธิภาพอย่างไร?", optionA: "สร้างนิสัยการใช้ AI ในงานประจำวันอย่างเป็นระบบ", optionB: "ใช้ AI ตลอดเวลาทุกนาที", optionC: "ใช้ AI แทนการคิดทั้งหมด", optionD: "ไม่ช่วย", correctAnswer: "A", explanation: "Daily AI Routine คือการกำหนดจุดที่ใช้ AI ในแต่ละวันอย่างเป็นระบบ เช่น สรุปอีเมลเช้า, ช่วยเขียน Content บ่าย ช่วยเพิ่มประสิทธิภาพ 3-5 เท่า", difficulty: "INTERMEDIATE", sortOrder: 6 },
      { question: "AI Agent คืออะไร?", optionA: "AI ที่ทำงานหลายขั้นตอนต่อเนื่องได้โดยอัตโนมัติ", optionB: "ตัวแทนจำหน่าย AI", optionC: "พนักงานที่ใช้ AI", optionD: "โปรแกรม Chatbot ธรรมดา", correctAnswer: "A", explanation: "AI Agent คือระบบ AI ที่สามารถรับมอบหมายงาน วิเคราะห์สถานการณ์ วางแผน และดำเนินการหลายขั้นตอนต่อเนื่องได้โดยอัตโนมัติ", difficulty: "ADVANCED", sortOrder: 7 },
      { question: "Custom GPTs ดีกว่า ChatGPT ปกติอย่างไร?", optionA: "ปรับแต่งเฉพาะทางสำหรับงานองค์กร มี Context เฉพาะ", optionB: "เร็วกว่า", optionC: "ถูกกว่า", optionD: "ไม่แตกต่าง", correctAnswer: "A", explanation: "Custom GPTs สามารถปรับแต่ง Instruction, Knowledge Base และ Actions เฉพาะสำหรับงานขององค์กร ทำให้ได้ผลลัพธ์ที่ตรงประเด็นมากขึ้น", difficulty: "ADVANCED", sortOrder: 8 },
      { question: "การวัดผล AI Productivity ควรดูจากอะไร?", optionA: "เวลาที่ประหยัด คุณภาพงาน และปริมาณผลงาน", optionB: "จำนวนเครื่องมือ AI ที่ใช้", optionC: "ค่าใช้จ่ายด้าน AI", optionD: "จำนวน Prompt ที่ใช้", correctAnswer: "A", explanation: "การวัดผลที่แท้จริงต้องดูจาก Time Saved (เวลาที่ประหยัด), Quality (คุณภาพงาน) และ Output Volume (ปริมาณผลงาน)", difficulty: "ADVANCED", sortOrder: 9 },
      { question: "Enterprise AI Productivity Platform ควรมีคุณสมบัติอะไร?", optionA: "Security, Integration, Scalability และ Analytics", optionB: "ราคาถูกเท่านั้น", optionC: "ใช้งานง่ายอย่างเดียว", optionD: "มี Feature มากที่สุด", correctAnswer: "A", explanation: "Enterprise Platform ต้องรองรับ Security & Compliance, Integration กับระบบเดิม, Scalability และมี Analytics เพื่อวัดผลการใช้งาน", difficulty: "ADVANCED", sortOrder: 10 },
    ],
  },

  /* ──────────────────────────────────────
     COURSE 5: AI Analytics
     ────────────────────────────────────── */
  {
    id: "course-ai-analytics",
    title: "AI Data Analytics",
    slug: "ai-analytics",
    courseCode: "AIDAT-001",
    description: "เรียนรู้การใช้ AI ในการวิเคราะห์ข้อมูลธุรกิจ ตั้งแต่พื้นฐาน Data Analytics ไปจนถึง Predictive Analytics ครอบคลุม Dashboard, Data Visualization และ Business Intelligence",
    shortDescription: "ใช้ AI วิเคราะห์ข้อมูลธุรกิจอย่างมืออาชีพ",
    category: "AI Analytics",
    level: "BEGINNER",
    duration: "3 ชั่วโมง",
    lessons: [
      {
        id: "lesson-dat-1",
        title: "Introduction to AI Data Analytics",
        subtitle: "AI วิเคราะห์ข้อมูลเบื้องต้น",
        description: "เริ่มต้นเรียนรู้การใช้ AI วิเคราะห์ข้อมูล ทำความเข้าใจ Data Analytics, Data Visualization และเครื่องมือ AI สำหรับวิเคราะห์ข้อมูล",
        youtubeUrl: "https://www.youtube.com/watch?v=ua-CiDNNj30",
        videoTitle: "Data Analytics เบื้องต้นสำหรับธุรกิจ",
        videoChannel: "DataRockie",
        durationText: "28:00",
        lessonLevel: "BEGINNER",
        lessonOrder: 1,
        summary: "ครอบคลุมพื้นฐาน Data Analytics ได้แก่ ประเภทของ Data Analytics, เครื่องมือ AI สำหรับวิเคราะห์ข้อมูล และวิธีเริ่มต้นวิเคราะห์ข้อมูลธุรกิจ",
        learningOutcomes: "1. เข้าใจประเภทของ Data Analytics\n2. ใช้เครื่องมือ AI วิเคราะห์ข้อมูลเบื้องต้นได้\n3. สร้าง Data Visualization ง่ายๆ ได้",
        keyTakeaways: "• Data Analytics แบ่งเป็น Descriptive, Diagnostic, Predictive, Prescriptive\n• AI ช่วยวิเคราะห์ข้อมูลเร็วขึ้น 100 เท่า\n• เริ่มต้นจากข้อมูลที่มีอยู่แล้วในองค์กร",
        coverImage: "/images/covers/ai-analytics-beginner.svg",
      },
      {
        id: "lesson-dat-2",
        title: "AI Business Analytics",
        subtitle: "AI วิเคราะห์ธุรกิจ",
        description: "เจาะลึกการใช้ AI วิเคราะห์ข้อมูลธุรกิจ สร้าง Dashboard, KPI Tracking และ Business Intelligence ด้วย AI",
        youtubeUrl: "https://www.youtube.com/watch?v=yZvFH7B6gKI",
        videoTitle: "Business Intelligence ด้วย AI",
        videoChannel: "BI & Data Thai",
        durationText: "35:00",
        lessonLevel: "INTERMEDIATE",
        lessonOrder: 2,
        summary: "เรียนรู้การสร้าง Business Dashboard, KPI Tracking System และ BI Report ด้วย AI ครอบคลุม Power BI, Google Data Studio และ AI Analytics Tools",
        learningOutcomes: "1. สร้าง Business Dashboard ด้วย AI ได้\n2. ติดตาม KPI แบบ Real-time ได้\n3. วิเคราะห์ Business Insight จาก Data ได้",
        keyTakeaways: "• Dashboard ที่ดีต้องตอบคำถามธุรกิจได้ทันที\n• KPI Tracking ช่วยตัดสินใจเร็วขึ้น\n• AI ช่วยหา Insight ที่มนุษย์อาจมองข้าม",
        coverImage: "/images/covers/ai-analytics-intermediate.svg",
      },
      {
        id: "lesson-dat-3",
        title: "AI Predictive Analytics",
        subtitle: "AI พยากรณ์เชิงวิเคราะห์",
        description: "ศึกษา Predictive Analytics ด้วย AI การพยากรณ์แนวโน้มธุรกิจ Customer Behavior Prediction และ AI-Driven Decision Making",
        youtubeUrl: "https://www.youtube.com/watch?v=Z2yagPm2Ybg",
        videoTitle: "Predictive Analytics สำหรับธุรกิจ",
        videoChannel: "Data Science Thailand",
        durationText: "40:00",
        lessonLevel: "ADVANCED",
        lessonOrder: 3,
        summary: "ศึกษาการใช้ Predictive Analytics ในธุรกิจ ครอบคลุม Forecasting, Customer Behavior Prediction, Risk Analysis และ AI-Driven Decision Making",
        learningOutcomes: "1. เข้าใจหลักการ Predictive Analytics\n2. สร้าง Prediction Model เบื้องต้นได้\n3. ใช้ AI ช่วยตัดสินใจทางธุรกิจได้",
        keyTakeaways: "• Predictive Analytics ช่วยมองเห็นอนาคตจากข้อมูล\n• ต้องมีข้อมูลที่ดีก่อนจึงจะพยากรณ์แม่นยำ\n• ใช้ร่วมกับ Business Judgment ไม่ใช่ทดแทน",
        coverImage: "/images/covers/ai-analytics-advanced.svg",
      },
    ],
    quizQuestions: [
      { question: "Data Analytics 4 ประเภทหลักคืออะไร?", optionA: "Descriptive, Diagnostic, Predictive, Prescriptive", optionB: "Simple, Medium, Hard, Expert", optionC: "Basic, Standard, Premium, Enterprise", optionD: "Input, Process, Output, Feedback", correctAnswer: "A", explanation: "Data Analytics แบ่งเป็น 4 ประเภท: Descriptive (เกิดอะไรขึ้น), Diagnostic (ทำไมถึงเกิด), Predictive (จะเกิดอะไร), Prescriptive (ควรทำอะไร)", difficulty: "BEGINNER", sortOrder: 1 },
      { question: "เครื่องมือ AI ใดเหมาะสำหรับวิเคราะห์ข้อมูลเบื้องต้น?", optionA: "ChatGPT Advanced Data Analysis, Google Sheets AI", optionB: "Photoshop", optionC: "AutoCAD", optionD: "Premiere Pro", correctAnswer: "A", explanation: "ChatGPT Advanced Data Analysis สามารถวิเคราะห์ข้อมูลจากไฟล์ สร้างกราฟ และหา Insight ได้ Google Sheets มี AI ช่วยวิเคราะห์เช่นกัน", difficulty: "BEGINNER", sortOrder: 2 },
      { question: "Data Visualization สำคัญอย่างไร?", optionA: "ช่วยให้เข้าใจข้อมูลเร็วขึ้นผ่านภาพ กราฟ และ Chart", optionB: "ทำให้รายงานสวยเท่านั้น", optionC: "ไม่สำคัญ ดูตัวเลขก็พอ", optionD: "ใช้แค่ตอนนำเสนอ", correctAnswer: "A", explanation: "Data Visualization ช่วยให้เข้าใจข้อมูลที่ซับซ้อนได้อย่างรวดเร็วผ่านภาพ ทำให้ตัดสินใจได้เร็วและแม่นยำขึ้น", difficulty: "BEGINNER", sortOrder: 3 },
      { question: "Business Dashboard ที่ดีควรมีคุณสมบัติอะไร?", optionA: "ตอบคำถามธุรกิจได้ทันที แสดงข้อมูล Real-time", optionB: "มีสีสันสวยงาม", optionC: "มีกราฟเยอะที่สุด", optionD: "ใส่ข้อมูลทุกอย่างลงไป", correctAnswer: "A", explanation: "Dashboard ที่ดีต้องออกแบบให้ตอบคำถามธุรกิจสำคัญได้ทันที แสดงข้อมูลที่เกี่ยวข้องแบบ Real-time ไม่ใช่ใส่ข้อมูลทุกอย่าง", difficulty: "INTERMEDIATE", sortOrder: 4 },
      { question: "KPI Tracking ด้วย AI ดีกว่า Manual อย่างไร?", optionA: "อัปเดตอัตโนมัติ แจ้งเตือนเมื่อ KPI ผิดปกติ", optionB: "ถูกกว่า", optionC: "สวยกว่า", optionD: "ไม่มีความแตกต่าง", correctAnswer: "A", explanation: "AI KPI Tracking อัปเดตข้อมูลอัตโนมัติแบบ Real-time สามารถแจ้งเตือนเมื่อ KPI ผิดปกติ และวิเคราะห์สาเหตุเบื้องต้นได้", difficulty: "INTERMEDIATE", sortOrder: 5 },
      { question: "AI ช่วยหา Insight ที่มนุษย์มองข้ามได้อย่างไร?", optionA: "วิเคราะห์ Pattern จากข้อมูลจำนวนมากที่มนุษย์ไม่สามารถทำได้", optionB: "เดาสุ่ม", optionC: "ถามผู้เชี่ยวชาญ", optionD: "ใช้สูตรเดิม", correctAnswer: "A", explanation: "AI สามารถวิเคราะห์ Pattern, Correlation และ Anomaly จากข้อมูลจำนวนมหาศาลที่มนุษย์ไม่สามารถประมวลผลด้วยตาเปล่าได้", difficulty: "INTERMEDIATE", sortOrder: 6 },
      { question: "Predictive Analytics ต่างจาก Descriptive Analytics อย่างไร?", optionA: "Predictive มองไปข้างหน้า ส่วน Descriptive อธิบายสิ่งที่เกิดแล้ว", optionB: "ไม่มีความแตกต่าง", optionC: "Predictive ถูกกว่า", optionD: "Descriptive แม่นยำกว่า", correctAnswer: "A", explanation: "Descriptive Analytics อธิบายว่าเกิดอะไรขึ้น (Past) ส่วน Predictive Analytics คาดการณ์ว่าจะเกิดอะไรขึ้น (Future) โดยใช้ข้อมูลอดีต", difficulty: "ADVANCED", sortOrder: 7 },
      { question: "การพยากรณ์ยอดขายด้วย AI ต้องใช้ข้อมูลอะไร?", optionA: "ยอดขายในอดีต ปัจจัยภายนอก และ Seasonal Trend", optionB: "เฉพาะยอดขายเดือนที่แล้ว", optionC: "ความเห็นของ CEO", optionD: "เฉพาะข้อมูลคู่แข่ง", correctAnswer: "A", explanation: "การพยากรณ์ที่แม่นยำต้องใช้ข้อมูลหลายมิติ: ยอดขายในอดีต, ปัจจัยภายนอก (เศรษฐกิจ, คู่แข่ง), Seasonal Pattern และ Market Trends", difficulty: "ADVANCED", sortOrder: 8 },
      { question: "Risk Analysis ด้วย AI ใช้ในธุรกิจอย่างไร?", optionA: "ประเมินความเสี่ยงทางธุรกิจจากข้อมูลหลายแหล่ง", optionB: "ทำนายหุ้นเท่านั้น", optionC: "ประเมินพนักงาน", optionD: "วิเคราะห์คู่แข่ง", correctAnswer: "A", explanation: "AI Risk Analysis ประเมินความเสี่ยงทางธุรกิจจากข้อมูลหลายแหล่ง เช่น การเงิน ตลาด ลูกค้า ช่วยให้ตัดสินใจบนข้อมูลจริง", difficulty: "ADVANCED", sortOrder: 9 },
      { question: "AI-Driven Decision Making ควรใช้ร่วมกับอะไร?", optionA: "Business Judgment และประสบการณ์ของผู้บริหาร", optionB: "ใช้ AI อย่างเดียวเพียงพอ", optionC: "โหวตเสียงข้างมาก", optionD: "สุ่มเลือก", correctAnswer: "A", explanation: "AI ให้ข้อมูลเชิงลึกและคาดการณ์ แต่การตัดสินใจทางธุรกิจยังต้องใช้ Business Judgment, ประสบการณ์ และ Context ที่ AI อาจไม่มี", difficulty: "ADVANCED", sortOrder: 10 },
    ],
  },

  /* ──────────────────────────────────────
     COURSE 6: AI for Management
     ────────────────────────────────────── */
  {
    id: "course-ai-management",
    title: "AI for Management",
    slug: "ai-management",
    courseCode: "AIMGT-001",
    description: "เรียนรู้การใช้ AI ในการบริหารจัดการองค์กร ตั้งแต่การตัดสินใจทางธุรกิจด้วย AI ไปจนถึง AI Leadership และ Digital Transformation",
    shortDescription: "AI สำหรับผู้บริหารและการจัดการองค์กร",
    category: "AI for Management",
    level: "BEGINNER",
    duration: "3 ชั่วโมง",
    lessons: [
      {
        id: "lesson-mgt-1",
        title: "AI for Business Decision Making",
        subtitle: "AI สำหรับการตัดสินใจธุรกิจ",
        description: "เรียนรู้การใช้ AI ช่วยตัดสินใจทางธุรกิจ ทำความเข้าใจ AI Decision Support System และวิธีใช้ข้อมูลประกอบการตัดสินใจ",
        youtubeUrl: "https://www.youtube.com/watch?v=4W6YCHCXkZw",
        videoTitle: "AI สำหรับผู้บริหาร — การตัดสินใจด้วยข้อมูล",
        videoChannel: "CEO Wisdom",
        durationText: "30:00",
        lessonLevel: "BEGINNER",
        lessonOrder: 1,
        summary: "ครอบคลุมการใช้ AI ช่วยตัดสินใจทางธุรกิจ ได้แก่ AI Decision Support System, Data-Driven Decision Making และ Framework การใช้ AI ในการบริหาร",
        learningOutcomes: "1. เข้าใจ AI Decision Support System\n2. ใช้ AI ช่วยวิเคราะห์ข้อมูลก่อนตัดสินใจได้\n3. รู้ข้อจำกัดของ AI ในการตัดสินใจ",
        keyTakeaways: "• AI ช่วยให้ตัดสินใจบนข้อมูล ไม่ใช่สัญชาตญาณอย่างเดียว\n• AI เป็นผู้ช่วย ไม่ใช่ผู้ตัดสินใจแทน\n• ผู้บริหารต้องเข้าใจ AI เพื่อถามคำถามที่ถูกต้อง",
        coverImage: "/images/covers/ai-management-beginner.svg",
      },
      {
        id: "lesson-mgt-2",
        title: "AI Strategic Planning",
        subtitle: "AI วางแผนกลยุทธ์",
        description: "การใช้ AI ในการวางแผนกลยุทธ์องค์กร Competitive Analysis ด้วย AI, Scenario Planning และ Strategic Forecasting",
        youtubeUrl: "https://www.youtube.com/watch?v=zFOBiSOJuvY",
        videoTitle: "วางกลยุทธ์ธุรกิจด้วย AI",
        videoChannel: "Business Plus Online",
        durationText: "35:00",
        lessonLevel: "INTERMEDIATE",
        lessonOrder: 2,
        summary: "เรียนรู้การใช้ AI ในการวางแผนกลยุทธ์ ครอบคลุม Competitive Intelligence, Scenario Planning, Market Analysis และ Strategic Forecasting",
        learningOutcomes: "1. ใช้ AI วิเคราะห์สถานการณ์การแข่งขันได้\n2. สร้าง Scenario Planning ด้วย AI ได้\n3. วางแผนกลยุทธ์ที่มี Data สนับสนุน",
        keyTakeaways: "• AI Competitive Intelligence ช่วยติดตามคู่แข่งอัตโนมัติ\n• Scenario Planning ด้วย AI จำลองสถานการณ์ได้หลายแบบ\n• กลยุทธ์ที่ดีต้อง Data-Informed ไม่ใช่ Data-Obsessed",
        coverImage: "/images/covers/ai-management-intermediate.svg",
      },
      {
        id: "lesson-mgt-3",
        title: "AI Leadership & Transformation",
        subtitle: "AI ผู้นำและการเปลี่ยนแปลง",
        description: "ศึกษาบทบาทของ AI ในการเปลี่ยนแปลงองค์กร Digital Transformation Strategy, AI Governance และ Future of Work",
        youtubeUrl: "https://www.youtube.com/watch?v=9EH7JY8aTJA",
        videoTitle: "Digital Transformation ด้วย AI สำหรับผู้บริหาร",
        videoChannel: "Digital CEO",
        durationText: "45:00",
        lessonLevel: "ADVANCED",
        lessonOrder: 3,
        summary: "ศึกษาการนำ AI มาเปลี่ยนแปลงองค์กร ครอบคลุม Digital Transformation Strategy, AI Governance, Ethics, Change Management และ Future of Work",
        learningOutcomes: "1. วาง Digital Transformation Strategy ได้\n2. สร้าง AI Governance Framework ได้\n3. เป็นผู้นำการเปลี่ยนแปลงด้วย AI ได้",
        keyTakeaways: "• Digital Transformation เริ่มจากคน ไม่ใช่เทคโนโลยี\n• AI Governance ต้องคำนึงถึง Ethics, Privacy, Fairness\n• Future of Work = Human + AI Collaboration",
        coverImage: "/images/covers/ai-management-advanced.svg",
      },
    ],
    quizQuestions: [
      { question: "AI Decision Support System ช่วยผู้บริหารอย่างไร?", optionA: "ให้ข้อมูลเชิงลึกประกอบการตัดสินใจ", optionB: "ตัดสินใจแทนผู้บริหารทั้งหมด", optionC: "ลดจำนวนพนักงาน", optionD: "สร้างรายงานสวยๆ เท่านั้น", correctAnswer: "A", explanation: "AI Decision Support System ให้ข้อมูลเชิงลึก วิเคราะห์ทางเลือก และคาดการณ์ผลลัพธ์ แต่การตัดสินใจสุดท้ายยังเป็นของผู้บริหาร", difficulty: "BEGINNER", sortOrder: 1 },
      { question: "ผู้บริหารควรมี AI Literacy ระดับใด?", optionA: "เข้าใจหลักการ ข้อจำกัด และวิธีถามคำถามที่ถูกต้องกับ AI", optionB: "ต้องเขียนโค้ดได้", optionC: "ไม่จำเป็นต้องรู้อะไร", optionD: "รู้แค่ชื่อเครื่องมือ", correctAnswer: "A", explanation: "ผู้บริหารไม่จำเป็นต้องเขียนโค้ด แต่ต้องเข้าใจหลักการทำงานของ AI ข้อจำกัด และวิธีตั้งคำถามที่ถูกต้องเพื่อได้ประโยชน์สูงสุด", difficulty: "BEGINNER", sortOrder: 2 },
      { question: "ข้อจำกัดสำคัญของ AI ในการตัดสินใจคืออะไร?", optionA: "ไม่เข้าใจ Context, วัฒนธรรม และ Emotional Intelligence", optionB: "ไม่มีข้อจำกัด", optionC: "ช้าเกินไป", optionD: "แพงเกินไป", correctAnswer: "A", explanation: "AI ยังไม่เข้าใจ Context เฉพาะขององค์กร วัฒนธรรม ความสัมพันธ์ระหว่างบุคคล และ Emotional Intelligence ที่จำเป็นในการตัดสินใจบางเรื่อง", difficulty: "BEGINNER", sortOrder: 3 },
      { question: "AI Competitive Intelligence คืออะไร?", optionA: "การใช้ AI ติดตามและวิเคราะห์สถานการณ์การแข่งขัน", optionB: "การแข่งขันระหว่าง AI", optionC: "การสอบแข่งขัน", optionD: "การเปรียบเทียบราคา AI", correctAnswer: "A", explanation: "AI Competitive Intelligence ใช้ AI ติดตามข่าวสาร ผลิตภัณฑ์ กลยุทธ์ของคู่แข่ง และวิเคราะห์แนวโน้มตลาดอัตโนมัติ", difficulty: "INTERMEDIATE", sortOrder: 4 },
      { question: "Scenario Planning ด้วย AI ดีกว่าแบบดั้งเดิมอย่างไร?", optionA: "จำลองสถานการณ์ได้มากกว่า เร็วกว่า และใช้ข้อมูลจริงมากกว่า", optionB: "ถูกกว่า", optionC: "ง่ายกว่า", optionD: "ไม่ดีกว่า", correctAnswer: "A", explanation: "AI สามารถจำลองสถานการณ์ได้หลายร้อยแบบพร้อมกัน ใช้ข้อมูลจริงเป็นฐาน และอัปเดตเมื่อมีข้อมูลใหม่ ทำให้แม่นยำกว่า", difficulty: "INTERMEDIATE", sortOrder: 5 },
      { question: "กลยุทธ์ที่ Data-Informed ต่างจาก Data-Obsessed อย่างไร?", optionA: "Data-Informed ใช้ข้อมูลประกอบ ส่วน Data-Obsessed ตามข้อมูลอย่างเดียว", optionB: "ไม่มีความแตกต่าง", optionC: "Data-Obsessed ดีกว่า", optionD: "Data-Informed ไม่ใช้ข้อมูลเลย", correctAnswer: "A", explanation: "Data-Informed ใช้ข้อมูลเป็นส่วนประกอบร่วมกับ Business Judgment ส่วน Data-Obsessed ยึดติดกับข้อมูลจนมองข้าม Context และ Intuition", difficulty: "INTERMEDIATE", sortOrder: 6 },
      { question: "Digital Transformation ควรเริ่มจากอะไร?", optionA: "คน (People) — สร้างวัฒนธรรมและความพร้อม", optionB: "ซื้อเทคโนโลยีแพงที่สุด", optionC: "จ้าง IT มาทำ", optionD: "รอให้คู่แข่งทำก่อน", correctAnswer: "A", explanation: "Digital Transformation ที่สำเร็จเริ่มจาก People: สร้างวัฒนธรรม Digital, ฝึกอบรมพนักงาน, สร้าง Change Champions ก่อนลงทุนเทคโนโลยี", difficulty: "ADVANCED", sortOrder: 7 },
      { question: "AI Governance Framework ควรครอบคลุมอะไร?", optionA: "Ethics, Privacy, Fairness, Transparency, Accountability", optionB: "แค่ Security เท่านั้น", optionC: "งบประมาณเท่านั้น", optionD: "จำนวน AI ที่ใช้", correctAnswer: "A", explanation: "AI Governance ครอบคลุม Ethics (จริยธรรม), Privacy (ความเป็นส่วนตัว), Fairness (ความเป็นธรรม), Transparency (โปร่งใส), Accountability (รับผิดชอบ)", difficulty: "ADVANCED", sortOrder: 8 },
      { question: "Future of Work ในยุค AI เป็นอย่างไร?", optionA: "Human + AI Collaboration — คนและ AI ทำงานร่วมกัน", optionB: "AI ทำงานแทนคนทั้งหมด", optionC: "ไม่มีการเปลี่ยนแปลง", optionD: "กลับไปใช้วิธีดั้งเดิม", correctAnswer: "A", explanation: "Future of Work เน้น Human + AI Collaboration: คนทำงานที่ต้องใช้ Creativity, Judgment, Empathy ส่วน AI ทำงานที่เป็นข้อมูล ซ้ำซาก และวิเคราะห์", difficulty: "ADVANCED", sortOrder: 9 },
      { question: "ผู้นำการเปลี่ยนแปลงด้วย AI ต้องมีทักษะอะไร?", optionA: "AI Literacy, Change Management, Strategic Thinking, Communication", optionB: "เขียนโค้ดเป็นอย่างเดียว", optionC: "ใช้ ChatGPT เป็น", optionD: "ไม่ต้องมีทักษะพิเศษ", correctAnswer: "A", explanation: "ผู้นำ AI Transformation ต้องมี AI Literacy (เข้าใจ AI), Change Management (บริหารการเปลี่ยนแปลง), Strategic Thinking และ Communication Skills", difficulty: "ADVANCED", sortOrder: 10 },
    ],
  },
]

/* ═══════════════════════════════════════════════════════════════
   MAIN SEED FUNCTION
   ═══════════════════════════════════════════════════════════════ */

async function main() {
  console.log("🚀 Seeding 6 courses, 18 lessons, 60 quiz questions...\n")

  for (const courseData of courses) {
    console.log(`📚 Course: ${courseData.title}`)

    // Upsert course
    const course = await db.course.upsert({
      where: { id: courseData.id },
      update: {
        title: courseData.title,
        slug: courseData.slug,
        courseCode: courseData.courseCode,
        description: courseData.description,
        shortDescription: courseData.shortDescription,
        category: courseData.category,
        level: courseData.level,
        duration: courseData.duration,
        status: "PUBLISHED",
        isFree: true,
        hasCertificate: true,
      },
      create: {
        id: courseData.id,
        title: courseData.title,
        slug: courseData.slug,
        courseCode: courseData.courseCode,
        description: courseData.description,
        shortDescription: courseData.shortDescription,
        category: courseData.category,
        level: courseData.level,
        duration: courseData.duration,
        status: "PUBLISHED",
        isFree: true,
        hasCertificate: true,
      },
    })

    // Upsert lessons
    for (const lessonData of courseData.lessons) {
      await db.lesson.upsert({
        where: { id: lessonData.id },
        update: {
          courseId: course.id,
          title: lessonData.title,
          subtitle: lessonData.subtitle,
          description: lessonData.description,
          youtubeUrl: lessonData.youtubeUrl,
          videoTitle: lessonData.videoTitle,
          videoChannel: lessonData.videoChannel,
          durationText: lessonData.durationText,
          lessonLevel: lessonData.lessonLevel,
          lessonOrder: lessonData.lessonOrder,
          summary: lessonData.summary,
          learningOutcomes: lessonData.learningOutcomes,
          keyTakeaways: lessonData.keyTakeaways,
          coverImage: lessonData.coverImage,
          isActive: true,
        },
        create: {
          id: lessonData.id,
          courseId: course.id,
          title: lessonData.title,
          subtitle: lessonData.subtitle,
          description: lessonData.description,
          youtubeUrl: lessonData.youtubeUrl,
          videoTitle: lessonData.videoTitle,
          videoChannel: lessonData.videoChannel,
          durationText: lessonData.durationText,
          lessonLevel: lessonData.lessonLevel,
          lessonOrder: lessonData.lessonOrder,
          summary: lessonData.summary,
          learningOutcomes: lessonData.learningOutcomes,
          keyTakeaways: lessonData.keyTakeaways,
          coverImage: lessonData.coverImage,
          isActive: true,
        },
      })
      console.log(`  ✅ Lesson: ${lessonData.title} (${lessonData.lessonLevel})`)
    }

    // Upsert quiz
    const quizId = `quiz-${courseData.slug}`
    const quiz = await db.quiz.upsert({
      where: { id: quizId },
      update: {
        courseId: course.id,
        title: `แบบทดสอบ ${courseData.title}`,
        passingScore: 70,
        isActive: true,
      },
      create: {
        id: quizId,
        courseId: course.id,
        title: `แบบทดสอบ ${courseData.title}`,
        passingScore: 70,
        isActive: true,
      },
    })

    // Delete existing questions for this quiz then create new ones
    await db.quizQuestion.deleteMany({ where: { quizId: quiz.id } })

    for (const q of courseData.quizQuestions) {
      await db.quizQuestion.create({
        data: {
          quizId: quiz.id,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer as CorrectAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty as CourseLevel,
          sortOrder: q.sortOrder,
        },
      })
    }
    console.log(`  📝 Quiz: ${courseData.quizQuestions.length} questions\n`)
  }

  console.log("✨ Done! Seeded 6 courses, 18 lessons, 60 quiz questions.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
