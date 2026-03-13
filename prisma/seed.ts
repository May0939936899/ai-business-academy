import { PrismaClient, CourseLevel, CourseStatus, CorrectAnswer } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Types ───────────────────────────────────────────────────────────────────

interface CourseSeed {
  courseCode: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: CourseLevel;
  duration: string;
  lessons: LessonSeed[];
  quiz: QuizSeed;
}

interface LessonSeed {
  title: string;
  description: string;
  youtubeUrl: string | null;
  lessonOrder: number;
}

interface QuizSeed {
  title: string;
  passingScore: number;
  questions: QuizQuestionSeed[];
}

interface QuizQuestionSeed {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswer;
  explanation: string;
  sortOrder: number;
}

// ─── Course Definitions ──────────────────────────────────────────────────────

const courses: CourseSeed[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. AI for HR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    courseCode: "AIHR",
    slug: "ai-for-hr",
    title: "AI for HR",
    shortDescription: "เรียนรู้การนำ AI มาประยุกต์ใช้ในงาน HR ยุคใหม่",
    description:
      "หลักสูตรนี้ออกแบบมาเพื่อผู้เชี่ยวชาญด้านทรัพยากรบุคคลที่ต้องการนำเทคโนโลยี AI มาใช้เพิ่มประสิทธิภาพการทำงาน ตั้งแต่การสรรหาบุคลากร การคัดกรองใบสมัคร การวิเคราะห์ข้อมูลพนักงาน ไปจนถึงการพัฒนาบุคลากรด้วย AI ผู้เรียนจะได้ลงมือปฏิบัติจริงกับเครื่องมือ AI ที่ใช้ได้จริงในงาน HR ทุกขั้นตอน",
    category: "AI HR",
    level: CourseLevel.BEGINNER,
    duration: "5 ชั่วโมง",
    lessons: [
      {
        title: "แนะนำ AI ในงานทรัพยากรบุคคล",
        description: "ภาพรวมของ AI ที่กำลังเปลี่ยนแปลงวงการ HR ตั้งแต่การสรรหาบุคลากรไปจนถึงการพัฒนาองค์กร เข้าใจแนวคิดหลักและโอกาสในการนำ AI มาใช้",
        youtubeUrl: "https://www.youtube.com/watch?v=2ePf9rue1Ao",
        lessonOrder: 1,
      },
      {
        title: "AI กับการสรรหาและคัดกรองผู้สมัคร",
        description: "เรียนรู้การใช้ AI ช่วยเขียน Job Description การคัดกรอง Resume อัตโนมัติ และการใช้ ChatGPT สร้างคำถามสัมภาษณ์ที่มีประสิทธิภาพ",
        youtubeUrl: "https://www.youtube.com/watch?v=nB4cOfn0xAs",
        lessonOrder: 2,
      },
      {
        title: "การวิเคราะห์ข้อมูลพนักงานด้วย AI",
        description: "ใช้ AI วิเคราะห์ข้อมูล HR Analytics เช่น อัตราการลาออก ความพึงพอใจพนักงาน และ Predictive Analytics เพื่อวางแผนกำลังคน",
        youtubeUrl: null,
        lessonOrder: 3,
      },
      {
        title: "AI สำหรับการฝึกอบรมและพัฒนาบุคลากร",
        description: "การใช้ AI ออกแบบหลักสูตรฝึกอบรม สร้างเนื้อหาการเรียนรู้แบบ Personalized Learning และการประเมินผลด้วย AI",
        youtubeUrl: null,
        lessonOrder: 4,
      },
      {
        title: "จริยธรรมและอนาคตของ AI ในงาน HR",
        description: "ประเด็นจริยธรรมในการใช้ AI กับข้อมูลพนักงาน ความเป็นส่วนตัว Bias ใน AI และแนวทางการใช้ AI อย่างรับผิดชอบในองค์กร",
        youtubeUrl: null,
        lessonOrder: 5,
      },
    ],
    quiz: {
      title: "แบบทดสอบ: AI for HR",
      passingScore: 60,
      questions: [
        {
          question: "AI สามารถช่วยงาน HR ในด้านใดได้มากที่สุดในขั้นตอนการสรรหาบุคลากร?",
          optionA: "การคัดกรอง Resume อัตโนมัติ",
          optionB: "การจ่ายเงินเดือน",
          optionC: "การจัดตารางวันหยุด",
          optionD: "การออกแบบสำนักงาน",
          correctAnswer: CorrectAnswer.A,
          explanation: "AI มีความสามารถในการคัดกรอง Resume จำนวนมากได้อย่างรวดเร็วและแม่นยำ โดยใช้ NLP วิเคราะห์คุณสมบัติผู้สมัครเทียบกับ Job Description",
          sortOrder: 1,
        },
        {
          question: "HR Analytics คืออะไร?",
          optionA: "ซอฟต์แวร์บัญชีเงินเดือน",
          optionB: "การวิเคราะห์ข้อมูลด้านทรัพยากรบุคคลเพื่อตัดสินใจเชิงกลยุทธ์",
          optionC: "ระบบลงเวลาทำงาน",
          optionD: "โปรแกรมจัดอบรม",
          correctAnswer: CorrectAnswer.B,
          explanation: "HR Analytics คือการใช้ข้อมูลและการวิเคราะห์ทางสถิติ เพื่อช่วยในการตัดสินใจด้าน HR อย่างมีหลักฐานรองรับ เช่น การทำนายอัตราการลาออก",
          sortOrder: 2,
        },
        {
          question: "Bias ใน AI Recruitment หมายถึงอะไร?",
          optionA: "ระบบทำงานช้า",
          optionB: "AI มีอคติในการคัดเลือกผู้สมัครจากข้อมูลที่ใช้ฝึกสอน",
          optionC: "ค่าใช้จ่ายสูง",
          optionD: "ระบบไม่รองรับภาษาไทย",
          correctAnswer: CorrectAnswer.B,
          explanation: "Bias ใน AI Recruitment เกิดจากข้อมูลที่ใช้ฝึกสอน AI อาจมีอคติฝังอยู่ เช่น ข้อมูลในอดีตที่เอนเอียงไปทางเพศหรือเชื้อชาติใดเชื้อชาติหนึ่ง",
          sortOrder: 3,
        },
        {
          question: "Personalized Learning ด้วย AI ในการพัฒนาบุคลากร หมายถึงอะไร?",
          optionA: "ให้พนักงานทุกคนเรียนหลักสูตรเดียวกัน",
          optionB: "AI ปรับเนื้อหาการเรียนรู้ให้เหมาะสมกับแต่ละบุคคล",
          optionC: "ใช้ AI แทนผู้สอนทั้งหมด",
          optionD: "การเรียนผ่านวิดีโอเท่านั้น",
          correctAnswer: CorrectAnswer.B,
          explanation: "Personalized Learning ใช้ AI วิเคราะห์จุดแข็ง-จุดอ่อน และรูปแบบการเรียนรู้ของพนักงานแต่ละคน แล้วปรับเนื้อหาให้เหมาะสม",
          sortOrder: 4,
        },
        {
          question: "ข้อใดเป็นแนวปฏิบัติที่ดีในการใช้ AI ในงาน HR?",
          optionA: "ปล่อยให้ AI ตัดสินใจทุกอย่างแทนมนุษย์",
          optionB: "ไม่ต้องแจ้งพนักงานว่าใช้ AI",
          optionC: "ใช้ AI เป็นเครื่องมือช่วย แต่มนุษย์ตัดสินใจสุดท้าย",
          optionD: "เก็บข้อมูลพนักงานให้มากที่สุดโดยไม่ต้องขออนุญาต",
          correctAnswer: CorrectAnswer.C,
          explanation: "แนวปฏิบัติที่ดีคือใช้ AI เป็นเครื่องมือสนับสนุนการตัดสินใจ (Augmented Intelligence) โดยมีมนุษย์เป็นผู้ตัดสินใจขั้นสุดท้าย ควบคู่กับความโปร่งใสและจริยธรรม",
          sortOrder: 5,
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. AI Productivity for Modern Work
  // ═══════════════════════════════════════════════════════════════════════════
  {
    courseCode: "AIPRO",
    slug: "ai-productivity-modern-work",
    title: "AI Productivity for Modern Work",
    shortDescription: "เพิ่มผลิตภาพการทำงานด้วยเครื่องมือ AI ที่ทันสมัย",
    description:
      "เรียนรู้การใช้เครื่องมือ AI เพื่อเพิ่มประสิทธิภาพการทำงานในยุคดิจิทัล ตั้งแต่ ChatGPT, Copilot, Notion AI, Gamma ไปจนถึงเครื่องมือ AI อื่นๆ ที่ช่วยให้ทำงานได้เร็วขึ้น ดีขึ้น ทั้งงานเอกสาร งานนำเสนอ การวิจัย และการสื่อสาร",
    category: "AI Productivity",
    level: CourseLevel.BEGINNER,
    duration: "6 ชั่วโมง",
    lessons: [
      {
        title: "เริ่มต้นใช้งาน ChatGPT อย่างมืออาชีพ",
        description: "แนะนำ ChatGPT ตั้งแต่พื้นฐาน การสมัครใช้งาน ฟีเจอร์สำคัญ และเทคนิคการใช้งานเบื้องต้นสำหรับคนทำงาน",
        youtubeUrl: "https://www.youtube.com/watch?v=o4q2qsGKIgc",
        lessonOrder: 1,
      },
      {
        title: "Microsoft Copilot สำหรับงานออฟฟิศ",
        description: "การใช้ AI Copilot ใน Word, Excel, PowerPoint และ Outlook เพื่อเร่งความเร็วในการทำงานเอกสารและอีเมล",
        youtubeUrl: "https://www.youtube.com/watch?v=S7xTBa93TX8",
        lessonOrder: 2,
      },
      {
        title: "Notion AI และเครื่องมือจัดการงาน",
        description: "ใช้ Notion AI ช่วยจดบันทึก สรุปเนื้อหา เขียน Template และจัดระเบียบข้อมูลอย่างมีประสิทธิภาพ",
        youtubeUrl: null,
        lessonOrder: 3,
      },
      {
        title: "AI สร้างงานนำเสนอด้วย Gamma & Canva AI",
        description: "สร้าง Presentation สวยงามในไม่กี่นาทีด้วย Gamma, Canva AI และ Beautiful.ai พร้อมเทคนิคการใช้งานจริง",
        youtubeUrl: null,
        lessonOrder: 4,
      },
      {
        title: "สร้างระบบทำงานอัตโนมัติส่วนตัวด้วย AI",
        description: "ออกแบบ Workflow การทำงานส่วนตัวโดยผสาน AI เข้ากับเครื่องมือต่างๆ เช่น Zapier, Make.com และ Google Workspace",
        youtubeUrl: null,
        lessonOrder: 5,
      },
    ],
    quiz: {
      title: "แบบทดสอบ: AI Productivity for Modern Work",
      passingScore: 60,
      questions: [
        {
          question: "ChatGPT เป็น AI ประเภทใด?",
          optionA: "AI สร้างภาพ (Image Generation)",
          optionB: "AI ประมวลผลภาษา (Large Language Model)",
          optionC: "AI หุ่นยนต์ (Robotics AI)",
          optionD: "AI จดจำใบหน้า (Face Recognition)",
          correctAnswer: CorrectAnswer.B,
          explanation: "ChatGPT เป็น Large Language Model (LLM) พัฒนาโดย OpenAI ที่ใช้ Deep Learning ในการเข้าใจและสร้างข้อความภาษาธรรมชาติ",
          sortOrder: 1,
        },
        {
          question: "Microsoft Copilot สามารถช่วยงานใดได้โดยตรง?",
          optionA: "เขียนโค้ดเว็บไซต์เท่านั้น",
          optionB: "ช่วยสรุปเอกสาร สร้างสไลด์ และเขียนอีเมลใน Microsoft 365",
          optionC: "ตัดต่อวิดีโอ",
          optionD: "ออกแบบ 3D Model",
          correctAnswer: CorrectAnswer.B,
          explanation: "Microsoft Copilot ถูกออกแบบมาให้ทำงานร่วมกับ Microsoft 365 (Word, Excel, PowerPoint, Outlook) โดยช่วยสรุป สร้าง และปรับปรุงเนื้อหาได้อัตโนมัติ",
          sortOrder: 2,
        },
        {
          question: "เครื่องมือใดใช้สร้าง Presentation ด้วย AI ได้?",
          optionA: "Gamma",
          optionB: "Photoshop",
          optionC: "VS Code",
          optionD: "Postman",
          correctAnswer: CorrectAnswer.A,
          explanation: "Gamma เป็นเครื่องมือ AI ที่สร้าง Presentation ได้จาก Prompt โดยออกแบบ Layout และเนื้อหาให้อัตโนมัติ",
          sortOrder: 3,
        },
        {
          question: "Zapier และ Make.com ใช้ทำอะไรเป็นหลัก?",
          optionA: "สร้างเว็บไซต์",
          optionB: "เชื่อมต่อแอปต่างๆ เพื่อทำ Workflow อัตโนมัติ",
          optionC: "ตัดต่อวิดีโอ",
          optionD: "ออกแบบกราฟิก",
          correctAnswer: CorrectAnswer.B,
          explanation: "Zapier และ Make.com เป็น No-code Automation Platform ที่เชื่อมต่อแอปต่างๆ เข้าด้วยกัน เพื่อสร้าง Workflow อัตโนมัติโดยไม่ต้องเขียนโค้ด",
          sortOrder: 4,
        },
        {
          question: "ข้อใดเป็นแนวทางที่ดีในการใช้ AI เพิ่ม Productivity?",
          optionA: "ให้ AI ทำทุกอย่างแทนโดยไม่ตรวจสอบ",
          optionB: "ใช้ AI เฉพาะงานซ้ำซ้อน แล้วตรวจสอบผลลัพธ์ก่อนใช้งาน",
          optionC: "ไม่ต้องเรียนรู้เพิ่ม เพราะ AI ฉลาดพอ",
          optionD: "ใช้ AI เฉพาะเรื่องส่วนตัว ไม่ใช่เรื่องงาน",
          correctAnswer: CorrectAnswer.B,
          explanation: "แนวทางที่ดีคือใช้ AI ช่วยงานซ้ำซ้อน (Repetitive Tasks) เพื่อประหยัดเวลา แต่ต้องตรวจสอบผลลัพธ์ (Human-in-the-loop) เพื่อความถูกต้องเสมอ",
          sortOrder: 5,
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. AI Marketing Strategy
  // ═══════════════════════════════════════════════════════════════════════════
  {
    courseCode: "AIMKT",
    slug: "ai-marketing-strategy",
    title: "AI Marketing Strategy",
    shortDescription: "วางกลยุทธ์การตลาดด้วย AI อย่างมีประสิทธิภาพ",
    description:
      "เรียนรู้การนำ AI มาใช้ในงานการตลาดดิจิทัลแบบครบวงจร ตั้งแต่การวิเคราะห์ตลาดและลูกค้า การสร้างคอนเทนต์ด้วย AI การทำ Personalization การวิเคราะห์ผลแคมเปญ และการใช้ AI Chatbot เพื่อเพิ่มยอดขาย เหมาะสำหรับนักการตลาดที่ต้องการยกระดับกลยุทธ์ด้วย AI",
    category: "AI Marketing",
    level: CourseLevel.INTERMEDIATE,
    duration: "7 ชั่วโมง",
    lessons: [
      {
        title: "AI กับการวิเคราะห์ตลาดและพฤติกรรมลูกค้า",
        description: "ใช้ AI วิเคราะห์ข้อมูลตลาด (Market Intelligence) เข้าใจพฤติกรรมลูกค้าผ่าน AI-powered Analytics และสร้าง Customer Persona ด้วย AI",
        youtubeUrl: "https://www.youtube.com/watch?v=l_bgSUjqJwI",
        lessonOrder: 1,
      },
      {
        title: "Content Marketing ด้วย Generative AI",
        description: "สร้างคอนเทนต์การตลาดด้วย AI ทั้งบทความ โพสต์โซเชียลมีเดีย สคริปต์วิดีโอ และ Email Marketing ด้วย ChatGPT และ Claude",
        youtubeUrl: "https://www.youtube.com/watch?v=yCSmPlXrRPE",
        lessonOrder: 2,
      },
      {
        title: "AI สำหรับ SEO และ Performance Marketing",
        description: "ใช้ AI ปรับปรุง SEO เขียน Ad Copy ที่มีประสิทธิภาพ A/B Testing ด้วย AI และวิเคราะห์ ROI ของแคมเปญอัตโนมัติ",
        youtubeUrl: null,
        lessonOrder: 3,
      },
      {
        title: "Personalization และ AI Chatbot ในงานขาย",
        description: "การทำ Hyper-personalization ด้วย AI เพื่อเพิ่ม Conversion Rate และการสร้าง AI Chatbot สำหรับ Customer Service",
        youtubeUrl: null,
        lessonOrder: 4,
      },
      {
        title: "สร้างแผนการตลาด AI แบบบูรณาการ",
        description: "Workshop สร้างแผนการตลาดที่ใช้ AI แบบครบวงจร ตั้งแต่การวางกลยุทธ์ เลือกเครื่องมือ วัดผล และปรับปรุงอย่างต่อเนื่อง",
        youtubeUrl: null,
        lessonOrder: 5,
      },
    ],
    quiz: {
      title: "แบบทดสอบ: AI Marketing Strategy",
      passingScore: 60,
      questions: [
        {
          question: "Customer Persona ที่สร้างด้วย AI แตกต่างจากแบบดั้งเดิมอย่างไร?",
          optionA: "ไม่มีความแตกต่าง",
          optionB: "ใช้ข้อมูลจริงจากพฤติกรรมลูกค้าจำนวนมากในการสร้าง",
          optionC: "ใช้ได้เฉพาะตลาดออนไลน์",
          optionD: "ต้องใช้งบประมาณสูงมาก",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI สร้าง Customer Persona จากข้อมูลพฤติกรรมจริงของลูกค้าจำนวนมาก (Big Data) ทำให้แม่นยำกว่าการคาดเดาจากการสำรวจกลุ่มตัวอย่างเล็กๆ",
          sortOrder: 1,
        },
        {
          question: "Generative AI ช่วยงาน Content Marketing อย่างไร?",
          optionA: "สร้างเนื้อหาได้หลากหลายรูปแบบอย่างรวดเร็ว",
          optionB: "ทดแทนทีมการตลาดทั้งหมด",
          optionC: "ไม่จำเป็นต้องตรวจสอบเนื้อหาที่ AI สร้าง",
          optionD: "สร้างได้เฉพาะภาษาอังกฤษ",
          correctAnswer: CorrectAnswer.A,
          explanation: "Generative AI สามารถสร้างเนื้อหาได้หลากหลาย ทั้งบทความ โพสต์ อีเมล และสคริปต์ ช่วยประหยัดเวลา แต่ยังต้องมีมนุษย์ตรวจสอบคุณภาพ",
          sortOrder: 2,
        },
        {
          question: "Hyper-personalization ในการตลาดด้วย AI หมายถึงอะไร?",
          optionA: "ส่งข้อความเหมือนกันถึงลูกค้าทุกคน",
          optionB: "ปรับแต่งเนื้อหาและข้อเสนอให้ตรงกับลูกค้าแต่ละรายแบบ Real-time",
          optionC: "ใช้ชื่อลูกค้าในอีเมลเท่านั้น",
          optionD: "ทำการตลาดเฉพาะบนโซเชียลมีเดีย",
          correctAnswer: CorrectAnswer.B,
          explanation: "Hyper-personalization ใช้ AI วิเคราะห์พฤติกรรมลูกค้าแบบ Real-time เพื่อนำเสนอเนื้อหา ข้อเสนอ และประสบการณ์ที่ตรงใจรายบุคคล",
          sortOrder: 3,
        },
        {
          question: "A/B Testing ด้วย AI มีข้อดีอย่างไร?",
          optionA: "ไม่ต้องทดสอบจริง AI คาดเดาได้หมด",
          optionB: "ทดสอบตัวแปรได้หลายตัวพร้อมกันและหาชุดที่ดีที่สุดได้เร็วขึ้น",
          optionC: "ใช้ได้เฉพาะกับโฆษณา Google",
          optionD: "ไม่แตกต่างจาก A/B Testing แบบปกติ",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI-powered A/B Testing สามารถทดสอบหลายตัวแปร (Multivariate) และปรับ Traffic ไปยังตัวเลือกที่ดีกว่าแบบอัตโนมัติ ช่วยให้ได้ผลลัพธ์เร็วขึ้น",
          sortOrder: 4,
        },
        {
          question: "ข้อใดเป็นข้อจำกัดสำคัญของ AI ในการทำการตลาด?",
          optionA: "AI ไม่สามารถสร้างเนื้อหาได้",
          optionB: "AI อาจสร้างเนื้อหาที่ไม่ถูกต้องหรือไม่เหมาะสมกับบริบทท้องถิ่น",
          optionC: "AI ใช้ได้เฉพาะกับธุรกิจขนาดใหญ่",
          optionD: "AI ไม่รองรับภาษาไทย",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI อาจสร้างเนื้อหาที่ดูดี แต่ไม่เข้าใจบริบทวัฒนธรรมท้องถิ่น อาจมี Hallucination (สร้างข้อมูลไม่จริง) จึงต้องมีผู้เชี่ยวชาญตรวจสอบเสมอ",
          sortOrder: 5,
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. AI Automation for Business
  // ═══════════════════════════════════════════════════════════════════════════
  {
    courseCode: "AIAUTO",
    slug: "ai-automation-for-business",
    title: "AI Automation for Business",
    shortDescription: "สร้าง Workflow อัตโนมัติด้วย AI สำหรับธุรกิจ",
    description:
      "หลักสูตรเชิงปฏิบัติการสร้างระบบอัตโนมัติสำหรับธุรกิจด้วย AI ตั้งแต่พื้นฐาน No-code Automation ด้วย Make.com และ n8n ไปจนถึงการใช้ AI Agent อัตโนมัติ เชื่อมต่อระบบต่างๆ ในองค์กรเพื่อลดงานซ้ำซ้อนและเพิ่มประสิทธิภาพ",
    category: "AI Automation",
    level: CourseLevel.INTERMEDIATE,
    duration: "8 ชั่วโมง",
    lessons: [
      {
        title: "พื้นฐาน Business Automation และ AI",
        description: "เข้าใจแนวคิด Business Process Automation (BPA) ประเภทของ Automation และบทบาทของ AI ในการยกระดับระบบอัตโนมัติ",
        youtubeUrl: "https://www.youtube.com/watch?v=ad79nYk2keg",
        lessonOrder: 1,
      },
      {
        title: "สร้าง Workflow อัตโนมัติด้วย Make.com",
        description: "ลงมือสร้าง Workflow อัตโนมัติด้วย Make.com ตั้งแต่พื้นฐาน เชื่อมต่อ Google Sheets, Email, LINE และเครื่องมืออื่นๆ",
        youtubeUrl: "https://www.youtube.com/watch?v=lArPdAb2MXo",
        lessonOrder: 2,
      },
      {
        title: "n8n สำหรับ AI Automation",
        description: "ใช้ n8n สร้าง Automation ที่มี AI อยู่ในกระบวนการ เช่น การวิเคราะห์อีเมลอัตโนมัติ การจัดหมวดหมู่ข้อมูล และ AI Chatbot",
        youtubeUrl: "https://www.youtube.com/watch?v=JpkQgvAlYHs",
        lessonOrder: 3,
      },
      {
        title: "AI Agent และ Autonomous Workflow",
        description: "แนะนำ AI Agent ที่สามารถตัดสินใจและดำเนินงานอัตโนมัติ รวมถึง AutoGPT, CrewAI และแนวคิด Multi-Agent System",
        youtubeUrl: null,
        lessonOrder: 4,
      },
      {
        title: "Case Study: ออกแบบระบบอัตโนมัติสำหรับธุรกิจ SME",
        description: "Workshop ออกแบบและสร้างระบบอัตโนมัติจริงสำหรับธุรกิจ SME ตั้งแต่การรับออเดอร์ การแจ้งเตือน จนถึงการรายงาน",
        youtubeUrl: null,
        lessonOrder: 5,
      },
    ],
    quiz: {
      title: "แบบทดสอบ: AI Automation for Business",
      passingScore: 60,
      questions: [
        {
          question: "No-code Automation หมายถึงอะไร?",
          optionA: "ระบบที่ไม่ต้องใช้คอมพิวเตอร์",
          optionB: "การสร้างระบบอัตโนมัติโดยไม่ต้องเขียนโค้ด",
          optionC: "ซอฟต์แวร์ที่ไม่มีบั๊ก",
          optionD: "การเขียนโค้ดโดย AI เท่านั้น",
          correctAnswer: CorrectAnswer.B,
          explanation: "No-code Automation คือการสร้างระบบอัตโนมัติผ่าน Visual Interface โดยไม่ต้องเขียนโค้ด เช่น Make.com, Zapier, n8n",
          sortOrder: 1,
        },
        {
          question: "Make.com (เดิมชื่อ Integromat) ใช้ทำอะไร?",
          optionA: "ออกแบบเว็บไซต์",
          optionB: "สร้างภาพด้วย AI",
          optionC: "เชื่อมต่อแอปต่างๆ และสร้าง Workflow อัตโนมัติ",
          optionD: "จัดการฐานข้อมูล SQL",
          correctAnswer: CorrectAnswer.C,
          explanation: "Make.com เป็นแพลตฟอร์ม No-code ที่เชื่อมต่อแอปต่างๆ (เช่น Google Sheets, Slack, Email) เข้าด้วยกันเพื่อสร้าง Workflow อัตโนมัติ",
          sortOrder: 2,
        },
        {
          question: "AI Agent แตกต่างจาก Chatbot ทั่วไปอย่างไร?",
          optionA: "ไม่มีความแตกต่าง",
          optionB: "AI Agent สามารถตัดสินใจและดำเนินการ (Action) ได้ด้วยตัวเอง",
          optionC: "Chatbot ฉลาดกว่า AI Agent",
          optionD: "AI Agent ใช้ได้เฉพาะภาษาอังกฤษ",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI Agent สามารถวางแผน ตัดสินใจ และดำเนินการ (Take Actions) ได้อัตโนมัติ ต่างจาก Chatbot ที่เพียงตอบคำถาม",
          sortOrder: 3,
        },
        {
          question: "ข้อใดเป็น Trigger ที่ดีในการเริ่มต้น Automation?",
          optionA: "เมื่อลูกค้ากรอกฟอร์มบนเว็บไซต์",
          optionB: "เมื่อคอมพิวเตอร์เปิดเครื่อง",
          optionC: "เมื่ออากาศเปลี่ยนแปลง",
          optionD: "ทุก 1 วินาที",
          correctAnswer: CorrectAnswer.A,
          explanation: "Trigger ที่ดีควรเป็น Event ที่มีความหมายทางธุรกิจ เช่น การกรอกฟอร์ม การชำระเงิน หรือการสั่งซื้อ เพื่อเริ่มกระบวนการอัตโนมัติที่เกี่ยวข้อง",
          sortOrder: 4,
        },
        {
          question: "RPA (Robotic Process Automation) ต่างจาก AI Automation อย่างไร?",
          optionA: "RPA ทำได้เฉพาะงานตามกฎที่กำหนดไว้ AI Automation สามารถเรียนรู้และปรับตัวได้",
          optionB: "RPA ดีกว่า AI Automation ทุกด้าน",
          optionC: "ไม่มีความแตกต่าง ชื่อเรียกต่างกัน",
          optionD: "AI Automation ใช้ได้เฉพาะบน Cloud",
          correctAnswer: CorrectAnswer.A,
          explanation: "RPA ทำงานตามกฎ (Rule-based) ที่กำหนดไว้ล่วงหน้า ส่วน AI Automation ใช้ Machine Learning เรียนรู้จากข้อมูลและตัดสินใจในสถานการณ์ที่ไม่ได้กำหนดกฎไว้",
          sortOrder: 5,
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Prompt Design for Business
  // ═══════════════════════════════════════════════════════════════════════════
  {
    courseCode: "AIPMT",
    slug: "prompt-design-for-business",
    title: "Prompt Design for Business",
    shortDescription: "เทคนิคเขียน Prompt ให้ได้ผลลัพธ์ดีเยี่ยมสำหรับงานธุรกิจ",
    description:
      "เจาะลึกศาสตร์และศิลป์ของการเขียน Prompt สำหรับ AI ในบริบทธุรกิจ ตั้งแต่หลักการพื้นฐานของ Prompt Engineering ไปจนถึงเทคนิคขั้นสูง เช่น Chain-of-Thought, Few-shot Learning และการสร้าง System Prompt สำหรับงานเฉพาะทาง",
    category: "AI Productivity",
    level: CourseLevel.BEGINNER,
    duration: "5 ชั่วโมง",
    lessons: [
      {
        title: "พื้นฐาน Prompt Engineering",
        description: "เข้าใจหลักการทำงานของ LLM และเทคนิคการเขียน Prompt พื้นฐาน ได้แก่ ความชัดเจน บริบท รูปแบบ และตัวอย่าง",
        youtubeUrl: "https://www.youtube.com/watch?v=jC4v5AS4RIM",
        lessonOrder: 1,
      },
      {
        title: "เทคนิค Prompt สำหรับงานเขียนธุรกิจ",
        description: "เขียน Prompt สำหรับงานเขียนธุรกิจ เช่น อีเมล รายงาน ข้อเสนอ และเอกสารทางการ ด้วยเทคนิค Role Playing และ Template",
        youtubeUrl: "https://www.youtube.com/watch?v=pGOyw_M1mNE",
        lessonOrder: 2,
      },
      {
        title: "Chain-of-Thought และ Step-by-Step Prompting",
        description: "เทคนิคขั้นสูงที่ทำให้ AI คิดเป็นขั้นตอน ช่วยในการวิเคราะห์ปัญหาซับซ้อน การตัดสินใจ และการแก้ปัญหาธุรกิจ",
        youtubeUrl: null,
        lessonOrder: 3,
      },
      {
        title: "Few-shot Learning และการใช้ตัวอย่าง",
        description: "การให้ตัวอย่าง (Examples) ใน Prompt เพื่อให้ AI เข้าใจรูปแบบที่ต้องการ ใช้กับงาน Classification, Extraction และ Formatting",
        youtubeUrl: null,
        lessonOrder: 4,
      },
      {
        title: "สร้าง Prompt Library สำหรับองค์กร",
        description: "ออกแบบและสร้างคลัง Prompt สำหรับทีมและองค์กร รวมถึง System Prompt การทำ Prompt Testing และ Version Control",
        youtubeUrl: null,
        lessonOrder: 5,
      },
    ],
    quiz: {
      title: "แบบทดสอบ: Prompt Design for Business",
      passingScore: 60,
      questions: [
        {
          question: "หลักการสำคัญที่สุดในการเขียน Prompt ที่ดีคืออะไร?",
          optionA: "เขียนให้ยาวที่สุด",
          optionB: "ใช้ภาษาเทคนิคเท่านั้น",
          optionC: "ชัดเจน มีบริบท และระบุรูปแบบผลลัพธ์ที่ต้องการ",
          optionD: "ใช้ภาษาอังกฤษเท่านั้น",
          correctAnswer: CorrectAnswer.C,
          explanation: "Prompt ที่ดีต้องมี 3 องค์ประกอบหลัก: ความชัดเจน (Clarity) บริบท (Context) และรูปแบบผลลัพธ์ (Output Format) เพื่อให้ AI เข้าใจและตอบได้ตรงจุด",
          sortOrder: 1,
        },
        {
          question: "Chain-of-Thought Prompting คือเทคนิคอะไร?",
          optionA: "การเขียน Prompt หลายอันต่อกัน",
          optionB: "การให้ AI แสดงขั้นตอนการคิดก่อนสรุปคำตอบ",
          optionC: "การเชื่อมหลาย AI เข้าด้วยกัน",
          optionD: "การใช้ AI สร้าง Prompt",
          correctAnswer: CorrectAnswer.B,
          explanation: "Chain-of-Thought Prompting คือเทคนิคที่สั่งให้ AI แสดงกระบวนการคิดเป็นขั้นตอน (Step-by-step reasoning) ก่อนให้คำตอบสุดท้าย ช่วยให้ได้คำตอบที่แม่นยำขึ้น",
          sortOrder: 2,
        },
        {
          question: "Few-shot Learning ใน Prompt หมายถึงอะไร?",
          optionA: "การใช้ AI ที่ยังเรียนรู้ไม่เสร็จ",
          optionB: "การให้ตัวอย่างผลลัพธ์ที่ต้องการไม่กี่ตัวอย่างใน Prompt",
          optionC: "การใช้ Prompt สั้นๆ เท่านั้น",
          optionD: "การใช้ AI หลายตัวพร้อมกัน",
          correctAnswer: CorrectAnswer.B,
          explanation: "Few-shot Learning คือการให้ตัวอย่าง Input-Output ที่ต้องการไม่กี่ตัวอย่างใน Prompt เพื่อให้ AI เข้าใจรูปแบบและสร้างผลลัพธ์ตามที่ต้องการ",
          sortOrder: 3,
        },
        {
          question: "System Prompt มีหน้าที่อะไร?",
          optionA: "แก้ไขข้อผิดพลาดของ AI",
          optionB: "กำหนดบทบาท พฤติกรรม และกรอบการทำงานของ AI ตลอดบทสนทนา",
          optionC: "เป็น Prompt สุดท้ายที่ส่งให้ AI",
          optionD: "ใช้เฉพาะกับ ChatGPT เท่านั้น",
          correctAnswer: CorrectAnswer.B,
          explanation: "System Prompt กำหนดบทบาท บุคลิก กฎเกณฑ์ และกรอบการทำงานของ AI ตลอดทั้ง Session ทำให้ AI ตอบอย่างสม่ำเสมอตามที่กำหนด",
          sortOrder: 4,
        },
        {
          question: "ข้อใดเป็นเทคนิค Prompt ที่ช่วยลดปัญหา AI Hallucination?",
          optionA: "สั่งให้ AI ตอบยาวๆ",
          optionB: "สั่งให้ AI บอกว่า 'ไม่ทราบ' เมื่อไม่มั่นใจ และอ้างอิงแหล่งข้อมูล",
          optionC: "ใช้ Prompt ภาษาอังกฤษเท่านั้น",
          optionD: "ไม่ระบุบริบท",
          correctAnswer: CorrectAnswer.B,
          explanation: "การระบุใน Prompt ว่า 'หากไม่มั่นใจให้บอกว่าไม่ทราบ' และ 'อ้างอิงแหล่งข้อมูล' ช่วยลดปัญหา Hallucination เพราะ AI จะไม่แต่งข้อมูลขึ้นมาเอง",
          sortOrder: 5,
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. AI Presentation & Communication
  // ═══════════════════════════════════════════════════════════════════════════
  {
    courseCode: "AIPRES",
    slug: "ai-presentation-communication",
    title: "AI Presentation & Communication",
    shortDescription: "สร้างงานนำเสนอและสื่อสารอย่างมืออาชีพด้วย AI",
    description:
      "เรียนรู้การใช้ AI สร้างงานนำเสนอที่น่าสนใจและสื่อสารอย่างมีประสิทธิภาพ ตั้งแต่การใช้ AI ช่วยวางโครงสร้าง สร้างสไลด์ ออกแบบ Infographic ไปจนถึงเทคนิคการนำเสนอด้วย AI Teleprompter และ AI Voice",
    category: "AI Communication",
    level: CourseLevel.BEGINNER,
    duration: "5 ชั่วโมง",
    lessons: [
      {
        title: "วางโครงสร้างงานนำเสนอด้วย AI",
        description: "ใช้ ChatGPT และ Claude ช่วยวางโครงสร้าง Presentation Outline จัดลำดับเนื้อหา และสร้าง Storytelling ที่น่าสนใจ",
        youtubeUrl: null,
        lessonOrder: 1,
      },
      {
        title: "สร้างสไลด์ด้วย Gamma, Canva AI และ SlidesGo",
        description: "ลงมือสร้าง Presentation ด้วยเครื่องมือ AI ต่างๆ เปรียบเทียบจุดเด่นของแต่ละเครื่องมือ และเทคนิคการปรับแต่ง",
        youtubeUrl: "https://www.youtube.com/watch?v=gd-KSH7GMGY",
        lessonOrder: 2,
      },
      {
        title: "ออกแบบ Infographic และ Visual ด้วย AI",
        description: "ใช้ AI สร้าง Infographic, Diagram และ Visual Content เพื่อนำเสนอข้อมูลอย่างเข้าใจง่าย ด้วย Napkin AI และ Canva",
        youtubeUrl: null,
        lessonOrder: 3,
      },
      {
        title: "AI สำหรับการสื่อสารทางธุรกิจ",
        description: "ใช้ AI ช่วยเขียนอีเมลธุรกิจ สรุปการประชุม สร้าง Meeting Notes และเตรียมสคริปต์การพูด",
        youtubeUrl: null,
        lessonOrder: 4,
      },
      {
        title: "เทคนิคการนำเสนอและ AI Voice",
        description: "ใช้ AI Teleprompter, Text-to-Speech และเครื่องมือฝึกซ้อมการนำเสนอ พร้อมเทคนิคการพูดในที่ชุมชน",
        youtubeUrl: null,
        lessonOrder: 5,
      },
    ],
    quiz: {
      title: "แบบทดสอบ: AI Presentation & Communication",
      passingScore: 60,
      questions: [
        {
          question: "เครื่องมือ AI ใดเหมาะสำหรับสร้าง Presentation จาก Prompt?",
          optionA: "Gamma.app",
          optionB: "Photoshop",
          optionC: "Excel",
          optionD: "AutoCAD",
          correctAnswer: CorrectAnswer.A,
          explanation: "Gamma.app เป็นเครื่องมือ AI ที่ออกแบบมาเพื่อสร้าง Presentation โดยเฉพาะ สามารถสร้างสไลด์จาก Text Prompt ได้อัตโนมัติ พร้อม Layout สวยงาม",
          sortOrder: 1,
        },
        {
          question: "หลัก Storytelling ในงานนำเสนอที่ AI ช่วยได้ คืออะไร?",
          optionA: "เล่านิทานให้ยาวที่สุด",
          optionB: "จัดลำดับเนื้อหาเป็น ปัญหา-ทางออก-ผลลัพธ์ เพื่อดึงดูดผู้ฟัง",
          optionC: "ใส่ข้อมูลให้มากที่สุดในทุกสไลด์",
          optionD: "ใช้แต่ตัวเลขไม่ต้องมีภาพ",
          correctAnswer: CorrectAnswer.B,
          explanation: "Storytelling ที่ดีจัดลำดับเนื้อหาเป็น Problem-Solution-Result ซึ่ง AI สามารถช่วยวาง Narrative Structure และเรียงลำดับเนื้อหาให้น่าติดตาม",
          sortOrder: 2,
        },
        {
          question: "Infographic ที่ดีควรมีลักษณะอย่างไร?",
          optionA: "มีข้อความยาวมากที่สุด",
          optionB: "นำเสนอข้อมูลซับซ้อนให้เข้าใจง่ายด้วย Visual",
          optionC: "ใช้สีเดียวทั้งหมด",
          optionD: "ไม่ต้องมีตัวเลข",
          correctAnswer: CorrectAnswer.B,
          explanation: "Infographic ที่ดีแปลงข้อมูลซับซ้อนให้เป็นภาพที่เข้าใจง่าย โดยใช้ Icon, Chart, Layout ที่เหมาะสม ซึ่ง AI สามารถช่วยสร้างได้อัตโนมัติ",
          sortOrder: 3,
        },
        {
          question: "AI สามารถช่วยสรุปการประชุม (Meeting Notes) อย่างไร?",
          optionA: "ถ่ายรูปห้องประชุมอัตโนมัติ",
          optionB: "แปลงเสียงพูดเป็นข้อความ แล้วสรุปประเด็นสำคัญและ Action Items",
          optionC: "จองห้องประชุมอัตโนมัติ",
          optionD: "ส่งอีเมลเชิญประชุมเท่านั้น",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI ใช้ Speech-to-Text แปลงเสียงเป็นข้อความ จากนั้นสรุปประเด็นสำคัญ ผู้รับผิดชอบ และ Action Items อัตโนมัติ เช่น Otter.ai, Notta",
          sortOrder: 4,
        },
        {
          question: "Text-to-Speech AI ใช้ประโยชน์อะไรในงานนำเสนอ?",
          optionA: "แปลงข้อความเป็นเสียงพูดสำหรับ Voice-over วิดีโอหรือ Podcast",
          optionB: "ใช้แทนที่ผู้นำเสนอจริง",
          optionC: "แปลงภาพเป็นเสียง",
          optionD: "ใช้ได้เฉพาะภาษาอังกฤษ",
          correctAnswer: CorrectAnswer.A,
          explanation: "Text-to-Speech AI สร้างเสียงพูดจากข้อความได้หลายภาษา ใช้ทำ Voice-over สำหรับวิดีโอ Presentation, Podcast หรือสื่อการเรียนรู้",
          sortOrder: 5,
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. AI Tools for Managers
  // ═══════════════════════════════════════════════════════════════════════════
  {
    courseCode: "AIMGR",
    slug: "ai-tools-for-managers",
    title: "AI Tools for Managers",
    shortDescription: "เครื่องมือ AI สำหรับผู้บริหารและหัวหน้าทีมยุคใหม่",
    description:
      "หลักสูตรสำหรับผู้บริหารและหัวหน้าทีมที่ต้องการนำ AI มาใช้ในการบริหารจัดการ ตั้งแต่การวางแผนกลยุทธ์ การตัดสินใจเชิงข้อมูล การบริหารทีม การจัดการโปรเจกต์ ไปจนถึงการสื่อสารกับ Stakeholders อย่างมีประสิทธิภาพ",
    category: "AI Management",
    level: CourseLevel.INTERMEDIATE,
    duration: "6 ชั่วโมง",
    lessons: [
      {
        title: "AI สำหรับการวางแผนกลยุทธ์และตัดสินใจ",
        description: "ใช้ AI ช่วยวิเคราะห์ SWOT, PESTEL, Porter's Five Forces และสร้าง Strategic Options เพื่อสนับสนุนการตัดสินใจ",
        youtubeUrl: null,
        lessonOrder: 1,
      },
      {
        title: "การบริหารโปรเจกต์ด้วย AI",
        description: "ใช้ AI ช่วยวางแผนโปรเจกต์ ติดตามความคืบหน้า จัดลำดับความสำคัญ และพยากรณ์ความเสี่ยง",
        youtubeUrl: null,
        lessonOrder: 2,
      },
      {
        title: "AI สำหรับการบริหารทีมและ Performance",
        description: "ใช้ AI ช่วยให้ Feedback พัฒนาทีม วิเคราะห์ Team Dynamics และสร้าง Performance Dashboard",
        youtubeUrl: null,
        lessonOrder: 3,
      },
      {
        title: "Dashboard และ Reporting ด้วย AI",
        description: "สร้าง Executive Dashboard ด้วย AI วิเคราะห์ข้อมูล KPI อัตโนมัติ และสร้างรายงานผู้บริหารด้วย AI",
        youtubeUrl: "https://www.youtube.com/watch?v=K3MYnrXBqEk",
        lessonOrder: 4,
      },
      {
        title: "ภาวะผู้นำในยุค AI",
        description: "ทักษะผู้นำที่จำเป็นในยุค AI การนำ AI มาใช้ในองค์กรอย่างมีจริยธรรม และการเตรียมทีมรับมือกับ AI Transformation",
        youtubeUrl: null,
        lessonOrder: 5,
      },
    ],
    quiz: {
      title: "แบบทดสอบ: AI Tools for Managers",
      passingScore: 60,
      questions: [
        {
          question: "AI ช่วยผู้บริหารในการตัดสินใจอย่างไร?",
          optionA: "ตัดสินใจแทนผู้บริหารทั้งหมด",
          optionB: "วิเคราะห์ข้อมูลจำนวนมากและนำเสนอ Insight เพื่อสนับสนุนการตัดสินใจ",
          optionC: "ลดจำนวนผู้บริหารในองค์กร",
          optionD: "ใช้ได้เฉพาะการตัดสินใจทางการเงิน",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI ช่วยวิเคราะห์ข้อมูลขนาดใหญ่ ค้นหา Pattern และนำเสนอ Insight เพื่อสนับสนุนการตัดสินใจของผู้บริหาร ไม่ใช่ทดแทนวิจารณญาณมนุษย์",
          sortOrder: 1,
        },
        {
          question: "SWOT Analysis ด้วย AI มีข้อดีอย่างไร?",
          optionA: "ไม่มีข้อดีเพิ่มเติม",
          optionB: "AI สามารถดึงข้อมูลตลาดและคู่แข่งมาวิเคราะห์ได้ครอบคลุมกว่า",
          optionC: "ทำ SWOT ได้เฉพาะธุรกิจเทคโนโลยี",
          optionD: "ไม่ต้องมีข้อมูลใดๆ เลย",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI สามารถวิเคราะห์ข้อมูลจากหลายแหล่ง ทั้งรายงานตลาด ข้อมูลคู่แข่ง และ Trend ต่างๆ ทำให้ SWOT Analysis ครอบคลุมและอิงข้อมูลจริงมากขึ้น",
          sortOrder: 2,
        },
        {
          question: "AI-powered Project Management ช่วยเรื่องใดได้ดี?",
          optionA: "ทำงานแทนทีมงานทั้งหมด",
          optionB: "พยากรณ์ความเสี่ยงและแนะนำการจัดสรรทรัพยากร",
          optionC: "ออกแบบผลิตภัณฑ์เท่านั้น",
          optionD: "จ่ายเงินเดือนพนักงาน",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI ช่วย Project Management โดยวิเคราะห์ข้อมูลจากโปรเจกต์ก่อนหน้า ทำนายความเสี่ยง (Bottleneck, Delay) และแนะนำการจัดสรรทรัพยากรที่เหมาะสม",
          sortOrder: 3,
        },
        {
          question: "Executive Dashboard ที่ดีควรมีลักษณะอย่างไร?",
          optionA: "แสดงข้อมูลดิบทั้งหมดโดยไม่สรุป",
          optionB: "แสดง KPI สำคัญ แนวโน้ม และ Insight ที่ช่วยตัดสินใจในหน้าเดียว",
          optionC: "มีรายละเอียดทุกอย่างมากที่สุด",
          optionD: "แสดงเฉพาะข้อมูลย้อนหลัง 5 ปี",
          correctAnswer: CorrectAnswer.B,
          explanation: "Executive Dashboard ที่ดีสรุป KPI สำคัญ แนวโน้ม และ Insight ที่ช่วยตัดสินใจ โดยออกแบบให้อ่านเข้าใจง่ายในหน้าเดียว (Single View)",
          sortOrder: 4,
        },
        {
          question: "ทักษะใดสำคัญที่สุดสำหรับผู้นำในยุค AI?",
          optionA: "เขียนโค้ดได้",
          optionB: "AI Literacy ผสมกับ Critical Thinking และ Ethical Leadership",
          optionC: "ใช้ AI ได้ทุกเครื่องมือ",
          optionD: "ไม่ต้องเรียนรู้ AI เพราะมีทีม IT",
          correctAnswer: CorrectAnswer.B,
          explanation: "ผู้นำยุค AI ต้องมี AI Literacy (เข้าใจ AI), Critical Thinking (ประเมินผลลัพธ์ AI), Ethical Leadership (ใช้ AI อย่างมีจริยธรรม) ไม่จำเป็นต้องเขียนโค้ดได้",
          sortOrder: 5,
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. AI Business Data Analysis
  // ═══════════════════════════════════════════════════════════════════════════
  {
    courseCode: "AIDATA",
    slug: "ai-business-data-analysis",
    title: "AI Business Data Analysis",
    shortDescription: "วิเคราะห์ข้อมูลธุรกิจด้วย AI อย่างมืออาชีพ",
    description:
      "เรียนรู้การใช้ AI วิเคราะห์ข้อมูลธุรกิจสำหรับผู้ที่ไม่มีพื้นฐาน Data Science ตั้งแต่การใช้ ChatGPT วิเคราะห์ข้อมูล Excel การใช้ AI สร้างกราฟและ Dashboard ไปจนถึง Predictive Analytics เบื้องต้นสำหรับการพยากรณ์ยอดขายและแนวโน้มธุรกิจ",
    category: "AI Data",
    level: CourseLevel.INTERMEDIATE,
    duration: "7 ชั่วโมง",
    lessons: [
      {
        title: "พื้นฐาน Data Literacy สำหรับคนทำธุรกิจ",
        description: "เข้าใจแนวคิด Data-driven Decision Making ประเภทข้อมูลธุรกิจ และความสำคัญของการวิเคราะห์ข้อมูลในยุค AI",
        youtubeUrl: null,
        lessonOrder: 1,
      },
      {
        title: "วิเคราะห์ข้อมูล Excel ด้วย ChatGPT",
        description: "ใช้ ChatGPT Code Interpreter วิเคราะห์ข้อมูล Excel ทำ Pivot Table สร้างสูตร และแก้ปัญหาข้อมูลแบบ Real-time",
        youtubeUrl: "https://www.youtube.com/watch?v=0E0YMoxAXf4",
        lessonOrder: 2,
      },
      {
        title: "สร้าง Dashboard และ Visualization ด้วย AI",
        description: "ใช้ AI สร้างกราฟ แผนภูมิ และ Interactive Dashboard จากข้อมูลธุรกิจ ด้วยเครื่องมือเช่น ChatGPT, Julius AI",
        youtubeUrl: "https://www.youtube.com/watch?v=VuLSFzlQ8wk",
        lessonOrder: 3,
      },
      {
        title: "Predictive Analytics สำหรับธุรกิจ",
        description: "พื้นฐาน Predictive Analytics ด้วย AI เพื่อพยากรณ์ยอดขาย วิเคราะห์แนวโน้ม และทำนายพฤติกรรมลูกค้า",
        youtubeUrl: null,
        lessonOrder: 4,
      },
      {
        title: "Case Study: Data-driven Decision Making",
        description: "กรณีศึกษาจริงจากธุรกิจไทย ลงมือวิเคราะห์ข้อมูลด้วย AI และนำเสนอ Insight เพื่อตัดสินใจทางธุรกิจ",
        youtubeUrl: null,
        lessonOrder: 5,
      },
    ],
    quiz: {
      title: "แบบทดสอบ: AI Business Data Analysis",
      passingScore: 60,
      questions: [
        {
          question: "Data-driven Decision Making หมายถึงอะไร?",
          optionA: "การตัดสินใจจากสัญชาตญาณเท่านั้น",
          optionB: "การตัดสินใจโดยอิงจากการวิเคราะห์ข้อมูลและหลักฐาน",
          optionC: "การใช้ Big Data ทุกชนิด",
          optionD: "การเก็บข้อมูลไว้แต่ไม่ใช้",
          correctAnswer: CorrectAnswer.B,
          explanation: "Data-driven Decision Making คือการตัดสินใจทางธุรกิจโดยอิงจากข้อมูลและการวิเคราะห์ แทนที่จะใช้แค่ประสบการณ์หรือสัญชาตญาณเพียงอย่างเดียว",
          sortOrder: 1,
        },
        {
          question: "ChatGPT Code Interpreter ใช้วิเคราะห์ข้อมูลอย่างไร?",
          optionA: "พิมพ์คำถามเกี่ยวกับข้อมูลที่อัปโหลดแล้ว AI วิเคราะห์และสร้างกราฟให้",
          optionB: "ใช้ได้เฉพาะกับข้อมูลภาษาอังกฤษ",
          optionC: "ต้องเขียนโค้ด Python เท่านั้น",
          optionD: "วิเคราะห์ได้เฉพาะไฟล์ CSV",
          correctAnswer: CorrectAnswer.A,
          explanation: "ChatGPT Code Interpreter รับไฟล์ Excel/CSV แล้วผู้ใช้สามารถถามคำถามเป็นภาษาธรรมชาติ AI จะเขียนโค้ดวิเคราะห์ข้อมูลและสร้างกราฟให้อัตโนมัติ",
          sortOrder: 2,
        },
        {
          question: "Predictive Analytics ต่างจาก Descriptive Analytics อย่างไร?",
          optionA: "ไม่แตกต่างกัน",
          optionB: "Descriptive บอกว่าเกิดอะไรขึ้น Predictive บอกว่าจะเกิดอะไรในอนาคต",
          optionC: "Predictive ใช้กับข้อมูลน้อยกว่า",
          optionD: "Descriptive แม่นยำกว่า Predictive เสมอ",
          correctAnswer: CorrectAnswer.B,
          explanation: "Descriptive Analytics สรุปสิ่งที่เกิดขึ้นแล้ว (What happened?) ส่วน Predictive Analytics ใช้ข้อมูลในอดีตทำนายอนาคต (What will happen?)",
          sortOrder: 3,
        },
        {
          question: "Dashboard ที่ดีสำหรับผู้บริหารควรมีลักษณะอย่างไร?",
          optionA: "มีข้อมูลดิบทุกรายการ",
          optionB: "สรุป KPI สำคัญ แสดงแนวโน้ม และ Highlight ประเด็นที่ต้องดำเนินการ",
          optionC: "ใช้ตารางตัวเลขเท่านั้น ไม่ต้องมีกราฟ",
          optionD: "อัปเดตปีละครั้ง",
          correctAnswer: CorrectAnswer.B,
          explanation: "Dashboard สำหรับผู้บริหารควรสรุป KPI สำคัญ แสดง Trend และ Alert ประเด็นที่ต้องดำเนินการ เข้าใจได้ใน 5 วินาที (5-second rule)",
          sortOrder: 4,
        },
        {
          question: "ข้อใดเป็นข้อควรระวังในการใช้ AI วิเคราะห์ข้อมูลธุรกิจ?",
          optionA: "AI วิเคราะห์ถูกต้อง 100% เสมอ",
          optionB: "ข้อมูลที่ป้อนเข้า AI ต้องมีคุณภาพ (Garbage in, Garbage out)",
          optionC: "ไม่ต้องเข้าใจข้อมูล เพราะ AI ทำให้หมด",
          optionD: "ยิ่งข้อมูลมากยิ่งดีเสมอ",
          correctAnswer: CorrectAnswer.B,
          explanation: "หลัก Garbage in, Garbage out หมายถึง หากข้อมูลที่ป้อนให้ AI มีคุณภาพต่ำ ผลลัพธ์จะไม่ถูกต้อง จึงต้องตรวจสอบคุณภาพข้อมูลก่อนเสมอ",
          sortOrder: 5,
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. AI in Digital Organization
  // ═══════════════════════════════════════════════════════════════════════════
  {
    courseCode: "AIORG",
    slug: "ai-digital-organization",
    title: "AI in Digital Organization",
    shortDescription: "สร้างองค์กรดิจิทัลด้วย AI อย่างยั่งยืน",
    description:
      "หลักสูตรขั้นสูงสำหรับผู้บริหารและ Change Agents ที่ต้องการขับเคลื่อนองค์กรสู่ Digital Organization ด้วย AI ครอบคลุมตั้งแต่การจัดการองค์ความรู้ (Knowledge Management) การสร้าง AI-ready Culture ไปจนถึงกลยุทธ์การนำ AI มาใช้ในองค์กรอย่างเป็นระบบ",
    category: "AI Organization",
    level: CourseLevel.ADVANCED,
    duration: "8 ชั่วโมง",
    lessons: [
      {
        title: "แนวคิด Digital Organization และบทบาทของ AI",
        description: "เข้าใจ Framework ของ Digital Organization, Digital Maturity Model และบทบาทของ AI ในการยกระดับองค์กรดิจิทัล",
        youtubeUrl: null,
        lessonOrder: 1,
      },
      {
        title: "Knowledge Management ด้วย AI",
        description: "ใช้ AI จัดการองค์ความรู้ สร้าง Internal Knowledge Base, AI-powered Search และ Chatbot สำหรับองค์กร",
        youtubeUrl: null,
        lessonOrder: 2,
      },
      {
        title: "AI-ready Culture และ Change Management",
        description: "สร้างวัฒนธรรมองค์กรที่พร้อมรับ AI การจัดการการเปลี่ยนแปลง Upskilling พนักงาน และการสื่อสารเพื่อลดแรงต้าน",
        youtubeUrl: null,
        lessonOrder: 3,
      },
      {
        title: "AI Governance และกรอบจริยธรรม",
        description: "สร้าง AI Governance Framework สำหรับองค์กร ครอบคลุม Data Privacy, AI Ethics, Risk Management และ Compliance",
        youtubeUrl: null,
        lessonOrder: 4,
      },
      {
        title: "วางแผน AI Strategy สำหรับองค์กร",
        description: "Workshop ออกแบบ AI Strategy Roadmap สำหรับองค์กร ตั้งแต่การประเมินความพร้อม เลือก Use Cases ไปจนถึงการวัดผลและขยายผล",
        youtubeUrl: null,
        lessonOrder: 5,
      },
    ],
    quiz: {
      title: "แบบทดสอบ: AI in Digital Organization",
      passingScore: 60,
      questions: [
        {
          question: "Digital Maturity Model ใช้ประเมินอะไร?",
          optionA: "อายุขององค์กร",
          optionB: "ระดับความพร้อมทางดิจิทัลขององค์กร",
          optionC: "จำนวนคอมพิวเตอร์ในองค์กร",
          optionD: "ยอดขายออนไลน์",
          correctAnswer: CorrectAnswer.B,
          explanation: "Digital Maturity Model ประเมินระดับความพร้อมทางดิจิทัลขององค์กร ครอบคลุมด้านกลยุทธ์ วัฒนธรรม เทคโนโลยี ข้อมูล และบุคลากร",
          sortOrder: 1,
        },
        {
          question: "Knowledge Management ด้วย AI ช่วยองค์กรอย่างไร?",
          optionA: "ลดจำนวนพนักงาน",
          optionB: "จัดเก็บ ค้นหา และแบ่งปันความรู้ในองค์กรอย่างมีประสิทธิภาพ",
          optionC: "สร้างเว็บไซต์องค์กรเท่านั้น",
          optionD: "ใช้แทนการฝึกอบรม",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI-powered Knowledge Management ช่วยจัดเก็บองค์ความรู้อย่างเป็นระบบ ค้นหาข้อมูลได้เร็ว (Semantic Search) และแนะนำความรู้ที่เกี่ยวข้องให้พนักงาน",
          sortOrder: 2,
        },
        {
          question: "อุปสรรคสำคัญที่สุดในการนำ AI มาใช้ในองค์กรคืออะไร?",
          optionA: "AI มีราคาแพงเกินไป",
          optionB: "การต่อต้านการเปลี่ยนแปลงจากพนักงานและวัฒนธรรมองค์กร",
          optionC: "เทคโนโลยี AI ยังไม่พร้อม",
          optionD: "ขาดอินเทอร์เน็ต",
          correctAnswer: CorrectAnswer.B,
          explanation: "การวิจัยชี้ว่าอุปสรรคสำคัญที่สุดคือ People & Culture ไม่ใช่เทคโนโลยี การจัดการ Change Management และสร้าง AI-ready Culture จึงเป็นกุญแจสำคัญ",
          sortOrder: 3,
        },
        {
          question: "AI Governance Framework ควรครอบคลุมเรื่องใด?",
          optionA: "เฉพาะงบประมาณ IT",
          optionB: "Data Privacy, AI Ethics, Risk Management และ Compliance",
          optionC: "เฉพาะการเลือกซื้อซอฟต์แวร์",
          optionD: "เฉพาะการฝึกอบรม AI",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI Governance Framework ควรครอบคลุม 4 ด้านหลัก: การคุ้มครองข้อมูลส่วนบุคคล, จริยธรรม AI, การจัดการความเสี่ยง และการปฏิบัติตามกฎหมาย",
          sortOrder: 4,
        },
        {
          question: "การเลือก AI Use Case ที่ดีสำหรับเริ่มต้นในองค์กร ควรมีลักษณะอย่างไร?",
          optionA: "เลือกโปรเจกต์ที่ใหญ่ที่สุดและซับซ้อนที่สุด",
          optionB: "เลือกที่มีผลกระทบสูง ความเป็นไปได้สูง และมีข้อมูลพร้อม",
          optionC: "เลือกแบบสุ่ม",
          optionD: "เลือกตามที่คู่แข่งทำ",
          correctAnswer: CorrectAnswer.B,
          explanation: "ควรเลือก Quick Win Use Case ที่มีผลกระทบสูง (High Impact), ความเป็นไปได้สูง (High Feasibility) และมีข้อมูลพร้อม เพื่อสร้างความสำเร็จในระยะสั้นและขยายผลต่อ",
          sortOrder: 5,
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. Digital Transformation & AI
  // ═══════════════════════════════════════════════════════════════════════════
  {
    courseCode: "AIDX",
    slug: "digital-transformation-ai",
    title: "Digital Transformation & AI",
    shortDescription: "กลยุทธ์ Digital Transformation ด้วย AI สำหรับผู้บริหาร",
    description:
      "หลักสูตรขั้นสูงสำหรับผู้บริหารระดับสูง (C-level) และผู้นำการเปลี่ยนแปลงที่ต้องการกำหนดกลยุทธ์ Digital Transformation โดยมี AI เป็นแกนหลัก ครอบคลุม Business Model Innovation, AI Operating Model, การวัด ROI ของ AI และ Case Study จากองค์กรชั้นนำ",
    category: "AI Strategy",
    level: CourseLevel.ADVANCED,
    duration: "9 ชั่วโมง",
    lessons: [
      {
        title: "ภาพรวม Digital Transformation ในยุค AI",
        description: "เข้าใจ Landscape ของ Digital Transformation ยุค Gen AI, AI Disruption ที่เกิดขึ้นในอุตสาหกรรมต่างๆ และ DX Framework",
        youtubeUrl: null,
        lessonOrder: 1,
      },
      {
        title: "Business Model Innovation ด้วย AI",
        description: "ใช้ AI ออกแบบ Business Model ใหม่ วิเคราะห์โอกาสทางธุรกิจ และสร้าง Value Proposition ด้วย AI-driven Innovation",
        youtubeUrl: null,
        lessonOrder: 2,
      },
      {
        title: "AI Operating Model สำหรับองค์กร",
        description: "ออกแบบ Operating Model ที่รองรับ AI ตั้งแต่โครงสร้างทีม AI, Data Infrastructure ไปจนถึง MLOps สำหรับผู้บริหาร",
        youtubeUrl: null,
        lessonOrder: 3,
      },
      {
        title: "การวัด ROI ของ AI และ DX Investment",
        description: "วิธีวัดผลตอบแทนจากการลงทุน AI และ Digital Transformation ทั้ง Financial Metrics และ Non-financial Metrics",
        youtubeUrl: null,
        lessonOrder: 4,
      },
      {
        title: "Case Study: DX Success Stories และ AI Roadmap",
        description: "กรณีศึกษา Digital Transformation จากองค์กรชั้นนำทั้งไทยและต่างประเทศ พร้อม Workshop สร้าง AI-powered DX Roadmap",
        youtubeUrl: null,
        lessonOrder: 5,
      },
    ],
    quiz: {
      title: "แบบทดสอบ: Digital Transformation & AI",
      passingScore: 60,
      questions: [
        {
          question: "Digital Transformation ต่างจาก Digitization อย่างไร?",
          optionA: "ไม่แตกต่างกัน",
          optionB: "Digitization คือการแปลงข้อมูลเป็นดิจิทัล แต่ DX คือการเปลี่ยนแปลง Business Model และวัฒนธรรมทั้งองค์กร",
          optionC: "DX ใช้กับ SME เท่านั้น",
          optionD: "Digitization ซับซ้อนกว่า",
          correctAnswer: CorrectAnswer.B,
          explanation: "Digitization = แปลงข้อมูลเป็นดิจิทัล, Digitalization = ปรับกระบวนการด้วยดิจิทัล, Digital Transformation = เปลี่ยนแปลง Business Model วัฒนธรรม และคุณค่าทั้งองค์กร",
          sortOrder: 1,
        },
        {
          question: "AI Disruption ส่งผลกระทบต่ออุตสาหกรรมอย่างไร?",
          optionA: "ทำให้ทุกธุรกิจล้มละลาย",
          optionB: "สร้าง Business Model ใหม่ เปลี่ยนความคาดหวังลูกค้า และสร้างคู่แข่งรูปแบบใหม่",
          optionC: "มีผลเฉพาะอุตสาหกรรม IT",
          optionD: "ไม่มีผลกระทบจริง",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI Disruption สร้าง Business Model ใหม่ (เช่น AI-as-a-Service) เปลี่ยนความคาดหวังลูกค้า (Personalization) และทำให้เกิดคู่แข่งรูปแบบใหม่ที่ใช้ AI เป็นแกนหลัก",
          sortOrder: 2,
        },
        {
          question: "AI Operating Model สำหรับองค์กร ควรมีองค์ประกอบหลักอะไร?",
          optionA: "ซื้อ AI Software เพียงตัวเดียว",
          optionB: "ทีม AI, Data Infrastructure, กระบวนการพัฒนา AI และ Governance",
          optionC: "จ้าง Data Scientist คนเดียว",
          optionD: "ใช้ ChatGPT อย่างเดียว",
          correctAnswer: CorrectAnswer.B,
          explanation: "AI Operating Model ต้องมี 4 องค์ประกอบ: ทีม AI (People), โครงสร้างข้อมูล (Data Infrastructure), กระบวนการพัฒนา (MLOps/Process) และการกำกับดูแล (Governance)",
          sortOrder: 3,
        },
        {
          question: "ข้อใดเป็น Non-financial Metric สำหรับวัด ROI ของ AI?",
          optionA: "กำไรสุทธิ",
          optionB: "ความพึงพอใจลูกค้าและเวลาที่ประหยัดได้",
          optionC: "ยอดขายรายเดือน",
          optionD: "ต้นทุนลดลง",
          correctAnswer: CorrectAnswer.B,
          explanation: "Non-financial Metrics ได้แก่ ความพึงพอใจลูกค้า (CSAT/NPS), เวลาที่ประหยัดได้, คุณภาพงาน, ความเร็วในการตัดสินใจ และ Employee Experience",
          sortOrder: 4,
        },
        {
          question: "ปัจจัยความสำเร็จที่สำคัญที่สุดของ Digital Transformation คืออะไร?",
          optionA: "งบประมาณสูง",
          optionB: "เทคโนโลยีล้ำสมัย",
          optionC: "วิสัยทัศน์ผู้นำ วัฒนธรรมองค์กร และการมีส่วนร่วมของทุกระดับ",
          optionD: "จ้างที่ปรึกษาจากต่างประเทศ",
          correctAnswer: CorrectAnswer.C,
          explanation: "งานวิจัยชี้ว่าปัจจัยสำคัญที่สุดคือ Leadership Vision + Culture + People Engagement ไม่ใช่แค่เทคโนโลยีหรืองบประมาณ องค์กรที่ผู้นำมีวิสัยทัศน์ชัดเจนและพนักงานมีส่วนร่วมจะ DX สำเร็จมากกว่า",
          sortOrder: 5,
        },
      ],
    },
  },
];

// ─── Main Seed Function ──────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  // ─── 1. CertificateSettings ──────────────────────────────────────────────
  console.log("📋 Seeding CertificateSettings...");
  await prisma.certificateSettings.upsert({
    where: { id: "global" },
    update: {
      signerName: "ผศ.ดร.รวิภา อัครจินดานนท์",
      signerTitle: "คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
      certificatePrefix: "SPUBUS",
      defaultThemeId: "royal-blue",
      enabledThemes: [
        "royal-blue",
        "executive-navy",
        "elegant-gold",
        "modern-cyan",
        "academic-crimson",
        "premium-purple",
        "minimal-bw",
      ],
    },
    create: {
      id: "global",
      signerName: "ผศ.ดร.รวิภา อัครจินดานนท์",
      signerTitle: "คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
      certificatePrefix: "SPUBUS",
      defaultThemeId: "royal-blue",
      enabledThemes: [
        "royal-blue",
        "executive-navy",
        "elegant-gold",
        "modern-cyan",
        "academic-crimson",
        "premium-purple",
        "minimal-bw",
      ],
    },
  });
  console.log("  ✅ CertificateSettings upserted\n");

  // ─── 2. Courses + Lessons + Quizzes + Questions + CertificateTemplates ──
  for (const courseDef of courses) {
    console.log(`📚 Seeding: ${courseDef.courseCode} — ${courseDef.title}`);

    // Upsert Course
    const course = await prisma.course.upsert({
      where: { courseCode: courseDef.courseCode },
      update: {
        title: courseDef.title,
        slug: courseDef.slug,
        description: courseDef.description,
        shortDescription: courseDef.shortDescription,
        category: courseDef.category,
        level: courseDef.level,
        duration: courseDef.duration,
        isFree: true,
        hasCertificate: true,
        status: CourseStatus.PUBLISHED,
      },
      create: {
        courseCode: courseDef.courseCode,
        slug: courseDef.slug,
        title: courseDef.title,
        description: courseDef.description,
        shortDescription: courseDef.shortDescription,
        category: courseDef.category,
        level: courseDef.level,
        duration: courseDef.duration,
        isFree: true,
        hasCertificate: true,
        status: CourseStatus.PUBLISHED,
      },
    });

    // Lessons — delete & recreate to handle reordering
    await prisma.lesson.deleteMany({ where: { courseId: course.id } });
    for (const lesson of courseDef.lessons) {
      await prisma.lesson.create({
        data: {
          courseId: course.id,
          title: lesson.title,
          description: lesson.description,
          youtubeUrl: lesson.youtubeUrl,
          lessonOrder: lesson.lessonOrder,
          isActive: true,
        },
      });
    }

    // Quiz — delete & recreate (cascade deletes questions)
    await prisma.quiz.deleteMany({ where: { courseId: course.id } });
    const quiz = await prisma.quiz.create({
      data: {
        courseId: course.id,
        title: courseDef.quiz.title,
        passingScore: courseDef.quiz.passingScore,
        isActive: true,
      },
    });

    for (const q of courseDef.quiz.questions) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          sortOrder: q.sortOrder,
        },
      });
    }

    // CertificateTemplate
    await prisma.certificateTemplate.upsert({
      where: { courseId: course.id },
      update: {
        signerName: "ผศ.ดร.รวิภา อัครจินดานนท์",
        signerTitle: "คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
      },
      create: {
        courseId: course.id,
        signerName: "ผศ.ดร.รวิภา อัครจินดานนท์",
        signerTitle: "คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
      },
    });

    console.log(`  ✅ ${courseDef.lessons.length} lessons, 1 quiz (${courseDef.quiz.questions.length} questions), 1 cert template`);
  }

  // ─── 3. Testimonials ─────────────────────────────────────────────────────
  console.log("\n💬 Seeding Testimonials...");
  const testimonials = [
    {
      name: "คุณสมหญิง เจริญสุข",
      role: "ผู้จัดการฝ่ายการตลาด",
      companyOrStatus: "บริษัท ดิจิทัล มาร์เก็ตติ้ง จำกัด",
      message: "คอร์ส AI Marketing ช่วยให้เข้าใจการใช้ AI ในงานจริง นำไปปรับใช้กับแคมเปญได้ทันที ผลลัพธ์ดีขึ้นมาก",
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "คุณวิชัย พัฒนากุล",
      role: "เจ้าของธุรกิจ SME",
      companyOrStatus: "ร้านค้าออนไลน์ ShopSmart",
      message: "เรียน AI Automation แล้วนำไปใช้ทำ Chatbot ตอบลูกค้า ประหยัดเวลาได้เยอะมาก ลูกค้าพอใจ",
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "คุณพิมพ์ใจ รักเรียน",
      role: "นักศึกษา MBA",
      companyOrStatus: "มหาวิทยาลัยศรีปทุม",
      message: "คอร์สเรียนฟรีแต่คุณภาพดีมาก เนื้อหาอัปเดตตามเทรนด์ AI ใหม่ๆ แนะนำเลยค่ะ",
      isActive: true,
      sortOrder: 3,
    },
  ];

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({ data: testimonials });
  console.log(`  ✅ ${testimonials.length} testimonials`);

  // ─── 4. FAQs ─────────────────────────────────────────────────────────────
  console.log("\n❓ Seeding FAQs...");
  const faqs = [
    {
      question: "คอร์สเรียนนี้ฟรีจริงหรือ?",
      answer: "ใช่ครับ คอร์สทั้งหมดเรียนฟรี 100% ไม่มีค่าใช้จ่ายใดๆ รวมถึงใบประกาศนียบัตรด้วย",
      sortOrder: 1,
      isActive: true,
    },
    {
      question: "ต้องมีพื้นฐาน AI มาก่อนไหม?",
      answer: "ไม่จำเป็นครับ คอร์สออกแบบมาสำหรับผู้เริ่มต้น อธิบายเข้าใจง่าย มีตัวอย่างจริง",
      sortOrder: 2,
      isActive: true,
    },
    {
      question: "ได้ใบประกาศนียบัตรอย่างไร?",
      answer: "เรียนบทเรียนครบทุกบทและทำแบบทดสอบผ่าน 60% ขึ้นไป ระบบจะออกใบประกาศนียบัตรอัตโนมัติ สามารถดาวน์โหลดเป็น PDF ได้",
      sortOrder: 3,
      isActive: true,
    },
    {
      question: "เรียนได้กี่ครั้ง?",
      answer: "เรียนซ้ำได้ไม่จำกัด สามารถย้อนกลับไปดูบทเรียนเก่าๆ ได้ตลอด",
      sortOrder: 4,
      isActive: true,
    },
    {
      question: "ใช้เวลาเรียนนานเท่าไหร่?",
      answer: "แต่ละคอร์สใช้เวลาประมาณ 5-9 ชั่วโมง สามารถเรียนตามจังหวะของตัวเองได้",
      sortOrder: 5,
      isActive: true,
    },
  ];

  await prisma.fAQ.deleteMany();
  await prisma.fAQ.createMany({ data: faqs });
  console.log(`  ✅ ${faqs.length} FAQs`);

  // ─── 5. Instructors ─────────────────────────────────────────────────────
  console.log("\n👨‍🏫 Seeding Instructors...");

  const instructorData = [
    {
      name: "เกวลิน สามเจริญ",
      title: "อาจารย์ประจำสาขาการบริหารและการจัดการสมัยใหม่",
      bio: "อาจารย์เกวลิน สามเจริญ เป็นอาจารย์ประจำสาขาการบริหารและการจัดการสมัยใหม่ คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม มีความเชี่ยวชาญด้านการนำ AI มาประยุกต์ใช้ในการบริหารจัดการองค์กรยุคดิจิทัล มีประสบการณ์ด้านการวิจัยและพัฒนาระบบบริหารจัดการสมัยใหม่ที่ผสมผสานเทคโนโลยี AI เข้ากับกระบวนการทางธุรกิจอย่างมีประสิทธิภาพ",
      expertise: ["AI for Business", "Digital Management", "Modern Organization"],
      sortOrder: 1,
    },
    {
      name: "ผศ.อรนิษฐ์ แสงทองสุข",
      title: "รองศาสตราจารย์ คณะบริหารธุรกิจ",
      bio: "ผศ.อรนิษฐ์ แสงทองสุข เป็นรองศาสตราจารย์ประจำคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม มีความเชี่ยวชาญด้านกลยุทธ์ธุรกิจและการตลาดดิจิทัล เน้นการนำ AI มาใช้ในงานการตลาดและพาณิชย์อิเล็กทรอนิกส์ มีผลงานวิจัยและบทความวิชาการด้าน AI Marketing จำนวนมาก และเป็นที่ปรึกษาให้กับหลายองค์กรชั้นนำ",
      expertise: ["Business Strategy", "AI Marketing", "Digital Commerce"],
      sortOrder: 2,
    },
    {
      name: "ผศ.ดร.ประเสริฐ สิทธิจิรพัฒน์",
      title: "รองศาสตราจารย์ ด้านการบริหารธุรกิจ",
      bio: "ผศ.ดร.ประเสริฐ สิทธิจิรพัฒน์ เป็นรองศาสตราจารย์ด้านการบริหารธุรกิจ มีความเชี่ยวชาญด้าน Business Analytics และกลยุทธ์ AI สำหรับการเปลี่ยนแปลงองค์กรสู่ดิจิทัล จบการศึกษาระดับปริญญาเอกด้านบริหารธุรกิจ มีประสบการณ์ในการให้คำปรึกษาด้าน Digital Transformation แก่องค์กรภาครัฐและเอกชน",
      expertise: ["Business Analytics", "AI Strategy", "Digital Transformation"],
      sortOrder: 3,
    },
    {
      name: "ดร.ศิดานุช กิตติเสรีกุล",
      title: "อาจารย์ ด้านการจัดการและนวัตกรรมธุรกิจ",
      bio: "ดร.ศิดานุช กิตติเสรีกุล เป็นอาจารย์ด้านการจัดการและนวัตกรรมธุรกิจ มีความเชี่ยวชาญในการนำ AI มาใช้ในการบริหารจัดการและสร้างนวัตกรรมใหม่ให้กับธุรกิจ มีประสบการณ์ในการบ่มเพาะสตาร์ทอัพและให้คำปรึกษาด้านนวัตกรรมธุรกิจ เน้นการพัฒนาธุรกิจด้วยเทคโนโลยี AI อย่างยั่งยืน",
      expertise: ["Business Innovation", "AI Management", "Startup"],
      sortOrder: 4,
    },
    {
      name: "ผศ.กิ่งแก้ว พรอภิรักษสกุล",
      title: "รองศาสตราจารย์ คณะบริหารธุรกิจ",
      bio: "ผศ.กิ่งแก้ว พรอภิรักษสกุล เป็นรองศาสตราจารย์ประจำคณะบริหารธุรกิจ มีความเชี่ยวชาญด้านการจัดการทรัพยากรมนุษย์และพฤติกรรมองค์กร เน้นการนำ AI มาประยุกต์ใช้ในงาน HR สมัยใหม่ มีผลงานวิจัยด้านการพัฒนาองค์กรและการบริหารทรัพยากรมนุษย์ด้วย AI เป็นที่ยอมรับในวงวิชาการ",
      expertise: ["HR Management", "AI for HR", "Organizational Behavior"],
      sortOrder: 5,
    },
    {
      name: "ชลากร อุดมอุกฤษฏ์",
      title: "อาจารย์ ด้านธุรกิจดิจิทัล",
      bio: "ชลากร อุดมอุกฤษฏ์ เป็นอาจารย์ด้านธุรกิจดิจิทัล มีความเชี่ยวชาญด้านการทำธุรกิจออนไลน์และ E-Commerce รวมถึงการนำ AI มาใช้ในการ Automate กระบวนการทางธุรกิจ มีประสบการณ์จริงในการสร้างและบริหารธุรกิจดิจิทัล และเป็นวิทยากรรับเชิญด้าน Digital Business ให้กับหลายองค์กร",
      expertise: ["Digital Business", "AI Automation", "E-Commerce"],
      sortOrder: 6,
    },
    {
      name: "ณัฐดนัย สาทสนิท",
      title: "ผู้เชี่ยวชาญด้าน AI และเทคโนโลยีธุรกิจ",
      bio: "ณัฐดนัย สาทสนิท เป็นผู้เชี่ยวชาญด้าน AI และเทคโนโลยีธุรกิจ มีความรู้ลึกด้าน Machine Learning และ Business Intelligence สามารถนำเทคโนโลยี AI มาประยุกต์ใช้เพื่อแก้ปัญหาทางธุรกิจได้อย่างมีประสิทธิภาพ มีประสบการณ์ในการพัฒนาระบบ AI สำหรับองค์กรธุรกิจชั้นนำหลายแห่ง",
      expertise: ["AI Technology", "Machine Learning", "Business Intelligence"],
      sortOrder: 7,
    },
    {
      name: "สุนทรี พุฒิวร",
      title: "ผู้เชี่ยวชาญด้านการจัดการองค์กร",
      bio: "สุนทรี พุฒิวร เป็นผู้เชี่ยวชาญด้านการจัดการองค์กร มีความเชี่ยวชาญในการนำ AI มาใช้เพิ่มผลิตภาพขององค์กรและการบริหารการเปลี่ยนแปลง มีประสบการณ์ในการให้คำปรึกษาด้าน Organization Management และ Change Management แก่องค์กรทั้งภาครัฐและเอกชนมากกว่า 10 ปี",
      expertise: ["Organization Management", "AI Productivity", "Change Management"],
      sortOrder: 8,
    },
    {
      name: "ธรรมนูญ วิศิษฏ์ศักดิ์",
      title: "ผู้เชี่ยวชาญด้านการบริหารธุรกิจและการพัฒนาองค์กร",
      bio: "ธรรมนูญ วิศิษฏ์ศักดิ์ เป็นผู้เชี่ยวชาญด้านการบริหารธุรกิจและการพัฒนาองค์กร มีความเชี่ยวชาญในการนำ AI มาผสมผสานกับกลยุทธ์การพัฒนาธุรกิจและภาวะผู้นำ มีประสบการณ์ในการบริหารและพัฒนาองค์กรขนาดใหญ่ เน้นการสร้างผู้นำยุคใหม่ที่เข้าใจและใช้ประโยชน์จาก AI ได้อย่างเต็มศักยภาพ",
      expertise: ["Business Development", "AI Integration", "Leadership"],
      sortOrder: 9,
    },
  ];

  // Delete existing instructors (cascade deletes CourseInstructor links)
  await prisma.courseInstructor.deleteMany();
  await prisma.instructor.deleteMany();

  const instructors: Record<string, string> = {};
  for (const inst of instructorData) {
    const instructor = await prisma.instructor.create({
      data: {
        name: inst.name,
        title: inst.title,
        bio: inst.bio,
        expertise: inst.expertise,
        sortOrder: inst.sortOrder,
        isActive: true,
      },
    });
    instructors[inst.name] = instructor.id;
  }
  console.log(`  ✅ ${instructorData.length} instructors`);

  // ─── 6. CourseInstructor Links ─────────────────────────────────────────
  console.log("\n🔗 Linking instructors to courses...");

  // Map course codes to instructor names
  const courseInstructorMap: Record<string, string[]> = {
    AIHR: ["ผศ.กิ่งแก้ว พรอภิรักษสกุล", "เกวลิน สามเจริญ"],
    AIPRO: ["ณัฐดนัย สาทสนิท"],
    AIMKT: ["ผศ.อรนิษฐ์ แสงทองสุข"],
    AIAUTO: ["ชลากร อุดมอุกฤษฏ์", "ณัฐดนัย สาทสนิท"],
    AIPMT: ["ดร.ศิดานุช กิตติเสรีกุล"],
    AIPRES: ["เกวลิน สามเจริญ"],
    AIMGR: ["ผศ.ดร.ประเสริฐ สิทธิจิรพัฒน์", "สุนทรี พุฒิวร"],
    AIDATA: ["ผศ.ดร.ประเสริฐ สิทธิจิรพัฒน์"],
    AIORG: ["สุนทรี พุฒิวร", "ธรรมนูญ วิศิษฏ์ศักดิ์"],
    AIDX: ["ธรรมนูญ วิศิษฏ์ศักดิ์", "ผศ.อรนิษฐ์ แสงทองสุข"],
  };

  let linkCount = 0;
  for (const [courseCode, instructorNames] of Object.entries(courseInstructorMap)) {
    const course = await prisma.course.findUnique({ where: { courseCode } });
    if (!course) {
      console.log(`  ⚠️ Course ${courseCode} not found, skipping`);
      continue;
    }
    for (const instructorName of instructorNames) {
      const instructorId = instructors[instructorName];
      if (!instructorId) {
        console.log(`  ⚠️ Instructor ${instructorName} not found, skipping`);
        continue;
      }
      await prisma.courseInstructor.create({
        data: {
          courseId: course.id,
          instructorId: instructorId,
        },
      });
      linkCount++;
    }
  }
  console.log(`  ✅ ${linkCount} course-instructor links`);

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log("\n🎉 Seed completed successfully!");
  console.log("─────────────────────────────────────");
  console.log(`  📚 ${courses.length} courses (all PUBLISHED, free, with certificates)`);
  console.log(`  📖 ${courses.length * 5} lessons`);
  console.log(`  📝 ${courses.length} quizzes (${courses.length * 5} questions total)`);
  console.log(`  🏆 ${courses.length} certificate templates`);
  console.log(`  ⚙️  1 global certificate settings`);
  console.log(`  💬 ${testimonials.length} testimonials`);
  console.log(`  ❓ ${faqs.length} FAQs`);
  console.log(`  👨‍🏫 ${instructorData.length} instructors`);
  console.log(`  🔗 ${linkCount} course-instructor links`);
  console.log("─────────────────────────────────────");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
