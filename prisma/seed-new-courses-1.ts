/**
 * Seed: 6 New Courses (Part 1 — Courses 7-9)
 * AI Fundamentals, AI Decision-Making, AI Finance
 */
import { CourseLevel, CorrectAnswer } from "@prisma/client";

export interface NewCourseSeed {
  courseCode: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: CourseLevel;
  duration: string;
  pathGroup: string;
  pathOrder: number;
  lessons: NewLessonSeed[];
  quiz: { title: string; passingScore: number; questions: QuizQ[] };
}

export interface NewLessonSeed {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  youtubeUrl: string | null;
  videoTitle: string;
  videoChannel: string;
  durationText: string;
  lessonLevel: CourseLevel;
  lessonOrder: number;
  summary: string;
  learningOutcomes: string;
  keyTakeaways: string;
  coverImage: string;
  inVideoQuizzes: InVideoQ[];
}

export interface InVideoQ {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswer;
  explanation: string;
  triggerPercent: number;
  sortOrder: number;
}

export interface QuizQ {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswer;
  explanation: string;
  sortOrder: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE 7: AI Fundamentals for Business
// ═══════════════════════════════════════════════════════════════════════════════
const aiFundamentals: NewCourseSeed = {
  courseCode: "AIFUN-001",
  slug: "ai-fundamentals-for-business",
  title: "AI Fundamentals for Business",
  shortDescription: "เข้าใจพื้นฐาน AI สำหรับธุรกิจ ตั้งแต่แนวคิดหลักจนถึงการประยุกต์ใช้จริง",
  description: "หลักสูตรพื้นฐานที่จะพาคุณทำความเข้าใจ Artificial Intelligence ตั้งแต่แนวคิดหลัก Machine Learning, Deep Learning, Natural Language Processing ไปจนถึงการนำ AI มาใช้ในธุรกิจจริง เหมาะสำหรับผู้เริ่มต้นที่ต้องการเข้าใจภาพรวมของ AI และโอกาสทางธุรกิจ",
  category: "AI Fundamentals",
  level: CourseLevel.BEGINNER,
  duration: "5 ชั่วโมง",
  pathGroup: "FOUNDATION",
  pathOrder: 1,
  lessons: [
    {
      id: "lesson-fun-1",
      title: "AI คืออะไร? ภาพรวมสำหรับนักธุรกิจ",
      subtitle: "ทำความเข้าใจ AI, ML, DL และความแตกต่าง",
      description: "เรียนรู้ความหมายของ AI, Machine Learning, Deep Learning และ Generative AI พร้อมตัวอย่างการใช้งานจริงในโลกธุรกิจ",
      youtubeUrl: "https://www.youtube.com/watch?v=ad79nYk2keg",
      videoTitle: "AI คืออะไร? อธิบายง่ายๆ สำหรับคนทั่วไป",
      videoChannel: "AI Knowledge TH",
      durationText: "22:15",
      lessonLevel: CourseLevel.BEGINNER,
      lessonOrder: 1,
      summary: "บทเรียนนี้อธิบายพื้นฐานของ AI ตั้งแต่ความหมาย ประเภท และความแตกต่างระหว่าง AI, ML, DL รวมถึงตัวอย่างการใช้งานในอุตสาหกรรมต่างๆ",
      learningOutcomes: "1. อธิบายความแตกต่างระหว่าง AI, ML, DL ได้\n2. ยกตัวอย่างการใช้ AI ในธุรกิจได้อย่างน้อย 5 ตัวอย่าง\n3. เข้าใจแนวโน้มของ AI ในปัจจุบัน",
      keyTakeaways: "1. AI คือเทคโนโลยีที่ทำให้เครื่องจักรเรียนรู้และตัดสินใจได้\n2. ML เป็นส่วนหนึ่งของ AI ที่เรียนรู้จากข้อมูล\n3. Deep Learning ใช้ Neural Network หลายชั้น\n4. Generative AI สร้างเนื้อหาใหม่ได้\n5. ทุกอุตสาหกรรมกำลังนำ AI มาใช้",
      coverImage: "/images/covers/lessons/fun-1.svg",
      inVideoQuizzes: [
        { question: "Machine Learning แตกต่างจาก AI อย่างไร?", optionA: "ML เป็นส่วนหนึ่งของ AI ที่เรียนรู้จากข้อมูลโดยไม่ต้องเขียนกฎเอง", optionB: "ML กับ AI คือสิ่งเดียวกัน", optionC: "ML เก่าแก่กว่า AI", optionD: "ML ใช้ได้เฉพาะกับรูปภาพ", correctAnswer: "A", explanation: "ML เป็น subset ของ AI ที่ให้คอมพิวเตอร์เรียนรู้ pattern จากข้อมูลแทนที่จะต้องเขียนกฎทุกอย่าง", triggerPercent: 25, sortOrder: 1 },
        { question: "Generative AI มีความสามารถหลักคือ?", optionA: "สร้างเนื้อหาใหม่ เช่น ข้อความ รูปภาพ โค้ด", optionB: "วิเคราะห์ข้อมูลเท่านั้น", optionC: "ควบคุมหุ่นยนต์", optionD: "ทำนายหุ้น", correctAnswer: "A", explanation: "Generative AI เช่น ChatGPT, Midjourney สามารถสร้างเนื้อหาใหม่ได้หลากหลายรูปแบบ", triggerPercent: 65, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-fun-2",
      title: "Machine Learning สำหรับธุรกิจ",
      subtitle: "เข้าใจหลักการทำงานของ ML และการประยุกต์ใช้",
      description: "เรียนรู้ประเภทของ Machine Learning ทั้ง Supervised, Unsupervised และ Reinforcement Learning พร้อม Use Case ในธุรกิจ",
      youtubeUrl: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
      videoTitle: "Machine Learning พื้นฐาน สำหรับคนทำธุรกิจ",
      videoChannel: "Data Science TH",
      durationText: "28:30",
      lessonLevel: CourseLevel.BEGINNER,
      lessonOrder: 2,
      summary: "ทำความเข้าใจ 3 ประเภทหลักของ ML: Supervised Learning (เรียนจากตัวอย่าง), Unsupervised Learning (หา pattern เอง) และ Reinforcement Learning (เรียนจากการลองผิดลองถูก)",
      learningOutcomes: "1. อธิบาย 3 ประเภทของ ML ได้\n2. เลือก ML ที่เหมาะกับปัญหาธุรกิจได้\n3. เข้าใจ Training Data และ Model",
      keyTakeaways: "1. Supervised Learning ใช้เมื่อมีข้อมูลพร้อมคำตอบ\n2. Unsupervised Learning ใช้หา Pattern ที่ซ่อนอยู่\n3. ข้อมูลคุณภาพดี = Model คุณภาพดี\n4. ไม่จำเป็นต้องเขียนโค้ดเองก็ใช้ ML ได้\n5. No-code ML platforms ช่วยให้ธุรกิจเข้าถึง ML ง่ายขึ้น",
      coverImage: "/images/covers/lessons/fun-2.svg",
      inVideoQuizzes: [
        { question: "Supervised Learning ใช้ในกรณีใด?", optionA: "เมื่อมีข้อมูลพร้อมคำตอบที่ถูกต้อง เช่น จำแนกอีเมล spam", optionB: "เมื่อไม่มีข้อมูลเลย", optionC: "เมื่อต้องการให้ AI เล่นเกม", optionD: "เมื่อต้องสร้างรูปภาพ", correctAnswer: "A", explanation: "Supervised Learning ต้องมี labeled data คือข้อมูลที่มีคำตอบถูกกำกับไว้ เช่น อีเมลที่ระบุว่า spam หรือไม่ spam", triggerPercent: 30, sortOrder: 1 },
        { question: "ทำไมคุณภาพข้อมูลจึงสำคัญกว่าปริมาณ?", optionA: "ข้อมูลที่ผิดพลาดทำให้ ML เรียนรู้ Pattern ที่ผิด", optionB: "ข้อมูลน้อยดีกว่าเสมอ", optionC: "ไม่สำคัญ ข้อมูลเยอะดีกว่า", optionD: "เพราะ AI ไม่ต้องการข้อมูล", correctAnswer: "A", explanation: "Garbage In = Garbage Out — ML model จะดีได้แค่ไหนขึ้นอยู่กับคุณภาพข้อมูลที่ใช้ train", triggerPercent: 70, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-fun-3",
      title: "เครื่องมือ AI ยอดนิยมที่ธุรกิจต้องรู้จัก",
      subtitle: "ChatGPT, Claude, Gemini, Midjourney และอื่นๆ",
      description: "สำรวจเครื่องมือ AI ที่ใช้งานจริงในธุรกิจ ตั้งแต่ AI Chatbot, AI Image Generator, AI Coding Assistant ไปจนถึง AI Analytics",
      youtubeUrl: "https://www.youtube.com/watch?v=pGOyw_M1mNE",
      videoTitle: "10 เครื่องมือ AI ที่ทุกธุรกิจต้องรู้จัก 2025",
      videoChannel: "Tech Business TH",
      durationText: "25:00",
      lessonLevel: CourseLevel.BEGINNER,
      lessonOrder: 3,
      summary: "แนะนำ AI Tools สำคัญ: ChatGPT/Claude สำหรับข้อความ, Midjourney/DALL-E สำหรับภาพ, GitHub Copilot สำหรับโค้ด, Jasper สำหรับ Marketing และ Power BI + AI สำหรับ Analytics",
      learningOutcomes: "1. รู้จักเครื่องมือ AI อย่างน้อย 10 ตัว\n2. เลือกเครื่องมือที่เหมาะกับงานได้\n3. เริ่มใช้ AI Tools ได้ทันที",
      keyTakeaways: "1. ChatGPT/Claude — AI ช่วยเขียน วิเคราะห์ สรุป\n2. Midjourney/DALL-E — สร้างภาพจาก prompt\n3. Canva AI — ออกแบบกราฟิกอัตโนมัติ\n4. Notion AI — จัดการข้อมูลและเอกสาร\n5. เลือกเครื่องมือตามลักษณะงาน ไม่ใช่ตามกระแส",
      coverImage: "/images/covers/lessons/fun-3.svg",
      inVideoQuizzes: [
        { question: "ChatGPT และ Claude จัดเป็น AI ประเภทใด?", optionA: "Large Language Model (LLM) ที่เข้าใจและสร้างภาษาได้", optionB: "Image Generation AI", optionC: "Robotic Process Automation", optionD: "Computer Vision", correctAnswer: "A", explanation: "ChatGPT และ Claude เป็น LLM (Large Language Model) ที่สร้างจาก Transformer architecture สามารถเข้าใจและสร้างข้อความได้", triggerPercent: 25, sortOrder: 1 },
        { question: "หลักการเลือก AI Tool ที่ดีสำหรับธุรกิจคือ?", optionA: "เลือกจากปัญหาที่ต้องแก้ ไม่ใช่ตามกระแส", optionB: "เลือกตัวที่แพงที่สุด", optionC: "ใช้ทุกตัวพร้อมกัน", optionD: "รอจนเทคโนโลยี mature", correctAnswer: "A", explanation: "ควรเริ่มจาก Pain Point ของธุรกิจ แล้วหาเครื่องมือที่ตอบโจทย์ ไม่ใช่ซื้อเครื่องมือก่อนแล้วหาปัญหาทีหลัง", triggerPercent: 70, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-fun-4",
      title: "Prompt Engineering สำหรับธุรกิจ",
      subtitle: "เทคนิคการเขียน Prompt ให้ได้ผลลัพธ์ดีที่สุด",
      description: "เรียนรู้ศิลปะการเขียน Prompt ที่มีประสิทธิภาพ ตั้งแต่โครงสร้างพื้นฐาน เทคนิค Chain of Thought ไปจนถึง Few-shot Learning",
      youtubeUrl: "https://www.youtube.com/watch?v=jC4v5AS4RIM",
      videoTitle: "Prompt Engineering เทคนิคการสั่ง AI ให้ได้ผลดี",
      videoChannel: "AI Mastery TH",
      durationText: "30:00",
      lessonLevel: CourseLevel.BEGINNER,
      lessonOrder: 4,
      summary: "Prompt Engineering คือทักษะสำคัญในยุค AI เรียนรู้เทคนิค RICE (Role, Instruction, Context, Example), Chain of Thought และ Few-shot Prompting",
      learningOutcomes: "1. เขียน Prompt ที่มีโครงสร้างชัดเจนได้\n2. ใช้เทคนิค CoT และ Few-shot ได้\n3. ปรับปรุง Prompt ให้ได้ผลลัพธ์ดีขึ้น",
      keyTakeaways: "1. Prompt ที่ดีต้องมี Role + Context + Instruction\n2. Chain of Thought ช่วยให้ AI คิดเป็นขั้นตอน\n3. Few-shot ให้ตัวอย่างช่วยให้ AI เข้าใจ format\n4. ยิ่ง Prompt ชัดเจน ผลลัพธ์ยิ่งดี\n5. ทดลองและปรับปรุงเสมอ",
      coverImage: "/images/covers/lessons/fun-4.svg",
      inVideoQuizzes: [
        { question: "RICE Framework ในการเขียน Prompt ย่อมาจาก?", optionA: "Role, Instruction, Context, Example", optionB: "Research, Implement, Create, Execute", optionC: "Read, Interpret, Code, Evaluate", optionD: "Reason, Input, Calculate, Export", correctAnswer: "A", explanation: "RICE Framework: กำหนด Role (บทบาท), Instruction (คำสั่ง), Context (บริบท), Example (ตัวอย่าง) ช่วยให้ AI เข้าใจและตอบได้ตรงประเด็น", triggerPercent: 30, sortOrder: 1 },
        { question: "Chain of Thought Prompting ช่วยอะไร?", optionA: "ช่วยให้ AI แสดงขั้นตอนการคิด ได้คำตอบแม่นยำขึ้น", optionB: "ทำให้ AI ตอบเร็วขึ้น", optionC: "ลดค่าใช้จ่าย API", optionD: "สร้างรูปภาพได้ดีขึ้น", correctAnswer: "A", explanation: "CoT prompting บอกให้ AI 'คิดทีละขั้น' ช่วยลดความผิดพลาดในงานที่ต้องใช้เหตุผล", triggerPercent: 65, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-fun-5",
      title: "จริยธรรม AI และความรับผิดชอบทางธุรกิจ",
      subtitle: "AI Ethics, Bias, Privacy และการใช้ AI อย่างรับผิดชอบ",
      description: "เข้าใจประเด็นด้านจริยธรรมของ AI ทั้ง Bias, Privacy, Transparency และกรอบการใช้ AI อย่างรับผิดชอบในองค์กร",
      youtubeUrl: "https://www.youtube.com/watch?v=UhEwHaEoOBg",
      videoTitle: "จริยธรรม AI ที่นักธุรกิจต้องรู้",
      videoChannel: "Digital Ethics TH",
      durationText: "20:00",
      lessonLevel: CourseLevel.BEGINNER,
      lessonOrder: 5,
      summary: "AI มีพลังมหาศาล แต่ก็มีความเสี่ยงด้าน Bias, Privacy, Job Displacement เรียนรู้กรอบ Responsible AI และแนวทางการใช้ AI อย่างมีจริยธรรมในองค์กร",
      learningOutcomes: "1. ระบุความเสี่ยงด้านจริยธรรมของ AI ได้\n2. อธิบาย AI Bias และผลกระทบได้\n3. วางแผนการใช้ AI อย่างรับผิดชอบ",
      keyTakeaways: "1. AI Bias เกิดจากข้อมูลที่ไม่สมดุล\n2. ต้องคำนึงถึง Privacy และ Data Protection\n3. Transparency ช่วยสร้างความไว้วางใจ\n4. มี Governance Framework กำกับการใช้ AI\n5. AI ควรเสริมมนุษย์ ไม่ใช่แทนที่",
      coverImage: "/images/covers/lessons/fun-5.svg",
      inVideoQuizzes: [
        { question: "AI Bias คืออะไร?", optionA: "ความลำเอียงของ AI ที่เกิดจากข้อมูลหรือการออกแบบที่ไม่สมดุล", optionB: "AI ทำงานช้า", optionC: "AI ใช้พลังงานมากเกินไป", optionD: "AI ราคาแพง", correctAnswer: "A", explanation: "AI Bias เกิดเมื่อ training data มีความลำเอียง ทำให้ AI ตัดสินใจอย่างไม่เป็นธรรมกับบางกลุ่ม", triggerPercent: 30, sortOrder: 1 },
        { question: "Responsible AI Framework ควรมีองค์ประกอบอะไร?", optionA: "Fairness, Transparency, Privacy, Accountability", optionB: "Speed, Cost, Accuracy เท่านั้น", optionC: "เฉพาะ Compliance ตามกฎหมาย", optionD: "ไม่จำเป็นต้องมี Framework", correctAnswer: "A", explanation: "Responsible AI ต้องครอบคลุม 4 เสาหลัก: ความเป็นธรรม, ความโปร่งใส, การคุ้มครองข้อมูล, และความรับผิดชอบ", triggerPercent: 70, sortOrder: 2 },
      ],
    },
  ],
  quiz: {
    title: "AI Fundamentals for Business — Final Quiz",
    passingScore: 70,
    questions: [
      { question: "AI, ML, DL มีความสัมพันธ์กันอย่างไร?", optionA: "AI เป็นร่ม ML อยู่ใน AI และ DL อยู่ใน ML", optionB: "ทั้งสามเหมือนกัน", optionC: "DL เป็นร่มใหญ่ที่สุด", optionD: "ไม่เกี่ยวข้องกัน", correctAnswer: "A", explanation: "AI ⊃ ML ⊃ DL — AI กว้างที่สุด ML เป็นส่วนหนึ่ง และ DL เป็นส่วนหนึ่งของ ML", sortOrder: 1 },
      { question: "Generative AI สร้างอะไรได้?", optionA: "ข้อความ รูปภาพ เสียง วิดีโอ โค้ด", optionB: "เฉพาะข้อความ", optionC: "เฉพาะรูปภาพ", optionD: "ไม่สามารถสร้างอะไรได้", correctAnswer: "A", explanation: "Generative AI สร้าง content ได้หลากหลายรูปแบบ ทั้ง text, image, audio, video, code", sortOrder: 2 },
      { question: "Prompt Engineering สำคัญอย่างไร?", optionA: "ช่วยให้ได้ผลลัพธ์ที่ดีขึ้นจาก AI โดยการเขียนคำสั่งที่ชัดเจน", optionB: "เป็นการเขียนโค้ด AI", optionC: "เป็นการซ่อม AI", optionD: "ไม่มีความสำคัญ", correctAnswer: "A", explanation: "Prompt Engineering คือทักษะการสื่อสารกับ AI ให้ได้ผลลัพธ์ตรงตามต้องการ", sortOrder: 3 },
      { question: "ข้อใดคือหลักการของ Responsible AI?", optionA: "Fairness, Transparency, Privacy, Accountability", optionB: "Speed, Cost, Scale", optionC: "ไม่มีหลักการตายตัว", optionD: "Profit maximization", correctAnswer: "A", explanation: "Responsible AI ยึดหลัก: เป็นธรรม โปร่งใส คุ้มครองข้อมูล และมีความรับผิดชอบ", sortOrder: 4 },
      { question: "ธุรกิจควรเริ่มนำ AI มาใช้อย่างไร?", optionA: "เริ่มจากปัญหาที่ชัดเจน เลือกเครื่องมือที่เหมาะ แล้วค่อยขยาย", optionB: "ลงทุนซื้อระบบ AI แพงที่สุด", optionC: "รอจน AI สมบูรณ์แบบ 100%", optionD: "จ้าง AI team ก่อนทุกอย่าง", correctAnswer: "A", explanation: "Start small, think big — เริ่มจาก use case ที่ชัดเจน พิสูจน์คุณค่า แล้วค่อย scale", sortOrder: 5 },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE 8: AI Decision-Making for Leaders
// ═══════════════════════════════════════════════════════════════════════════════
const aiDecision: NewCourseSeed = {
  courseCode: "AIDML-001",
  slug: "ai-decision-making-for-leaders",
  title: "AI Decision-Making for Leaders",
  shortDescription: "ใช้ AI ช่วยตัดสินใจเชิงกลยุทธ์ สำหรับผู้บริหารและผู้นำ",
  description: "หลักสูตรสำหรับผู้บริหารและผู้นำองค์กรที่ต้องการใช้ AI เป็นเครื่องมือในการตัดสินใจเชิงกลยุทธ์ ครอบคลุม Data-Driven Decision Making, Predictive Analytics, Risk Assessment ด้วย AI และการสร้างวัฒนธรรม AI-First ในองค์กร",
  category: "AI Leadership",
  level: CourseLevel.ADVANCED,
  duration: "5 ชั่วโมง",
  pathGroup: "ADVANCED",
  pathOrder: 10,
  lessons: [
    {
      id: "lesson-dml-1",
      title: "Data-Driven Decision Making",
      subtitle: "การตัดสินใจโดยอิงข้อมูลในยุค AI",
      description: "เรียนรู้หลักการตัดสินใจแบบ Data-Driven ข้อดีเหนือ Intuition-Based และกรณีศึกษาจากองค์กรชั้นนำ",
      youtubeUrl: "https://www.youtube.com/watch?v=nU8DcBF-qo4",
      videoTitle: "Data-Driven Decision Making สำหรับผู้บริหาร",
      videoChannel: "Business Intelligence TH",
      durationText: "24:00",
      lessonLevel: CourseLevel.ADVANCED,
      lessonOrder: 1,
      summary: "Data-Driven Decision Making เปลี่ยนจากการตัดสินใจด้วยสัญชาตญาณ มาเป็นการใช้ข้อมูลและ AI ช่วยวิเคราะห์เพื่อผลลัพธ์ที่แม่นยำขึ้น",
      learningOutcomes: "1. อธิบายหลัก Data-Driven Decision Making\n2. เปรียบเทียบกับ Intuition-Based Decision\n3. วาง framework การตัดสินใจด้วยข้อมูล",
      keyTakeaways: "1. ข้อมูลลด bias ในการตัดสินใจ\n2. Dashboard ช่วยมองเห็นภาพรวม\n3. ต้องมี Data Literacy ในองค์กร\n4. ไม่ใช่ทุกการตัดสินใจต้องใช้ข้อมูล 100%\n5. Balance ระหว่าง data กับ experience",
      coverImage: "/images/covers/lessons/dml-1.svg",
      inVideoQuizzes: [
        { question: "Data-Driven Decision Making ดีกว่า Intuition-Based อย่างไร?", optionA: "ลด Cognitive Bias และสามารถวัดผลได้ชัดเจน", optionB: "เร็วกว่าเสมอ", optionC: "ไม่ต้องใช้คน", optionD: "ถูกกว่าเสมอ", correctAnswer: "A", explanation: "DDDM ลดอคติทางความคิด มีหลักฐานรองรับ และวัดผลได้ ทำให้ตัดสินใจแม่นยำขึ้น", triggerPercent: 30, sortOrder: 1 },
        { question: "Data Literacy ในองค์กรหมายถึง?", optionA: "ความสามารถของพนักงานในการอ่าน เข้าใจ และใช้ข้อมูล", optionB: "การมีทีม Data Science", optionC: "การซื้อ Software วิเคราะห์ข้อมูล", optionD: "การเก็บข้อมูลมากๆ", correctAnswer: "A", explanation: "Data Literacy คือทักษะของคนในองค์กรในการเข้าใจและใช้ประโยชน์จากข้อมูล ไม่จำเป็นต้องเป็น Data Scientist", triggerPercent: 70, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-dml-2",
      title: "Predictive Analytics สำหรับผู้บริหาร",
      subtitle: "ใช้ AI คาดการณ์อนาคตทางธุรกิจ",
      description: "เรียนรู้ Predictive Analytics ตั้งแต่ Forecasting, Trend Analysis ไปจนถึง Scenario Planning ด้วย AI",
      youtubeUrl: "https://www.youtube.com/watch?v=Q1Uy44IGSPA",
      videoTitle: "Predictive Analytics สำหรับธุรกิจ ใช้ AI คาดการณ์อนาคต",
      videoChannel: "Analytics Insight TH",
      durationText: "26:00",
      lessonLevel: CourseLevel.ADVANCED,
      lessonOrder: 2,
      summary: "Predictive Analytics ใช้ข้อมูลในอดีตและ ML models คาดการณ์แนวโน้ม ยอดขาย ความเสี่ยง และพฤติกรรมลูกค้าในอนาคต",
      learningOutcomes: "1. เข้าใจหลักการ Predictive Analytics\n2. ใช้ Forecasting วางแผนธุรกิจ\n3. ประยุกต์ Scenario Planning กับ AI",
      keyTakeaways: "1. Predictive ≠ Perfect — เป็นการประมาณที่ดีที่สุด\n2. Forecasting ช่วยวางแผน inventory และ revenue\n3. Scenario Planning เตรียมพร้อมหลาย scenario\n4. ต้องมี feedback loop ปรับปรุง model\n5. เริ่มจาก use case ที่วัดผลได้ชัด",
      coverImage: "/images/covers/lessons/dml-2.svg",
      inVideoQuizzes: [
        { question: "Predictive Analytics ต่างจาก Descriptive Analytics อย่างไร?", optionA: "Predictive คาดการณ์อนาคต ส่วน Descriptive อธิบายสิ่งที่เกิดแล้ว", optionB: "เป็นสิ่งเดียวกัน", optionC: "Descriptive แม่นยำกว่า", optionD: "Predictive ใช้ข้อมูลน้อยกว่า", correctAnswer: "A", explanation: "Descriptive = 'อะไรเกิดขึ้น?' vs Predictive = 'อะไรจะเกิดขึ้น?' ใช้ ML model ทำนายจากข้อมูลในอดีต", triggerPercent: 25, sortOrder: 1 },
        { question: "Scenario Planning ช่วยผู้บริหารอย่างไร?", optionA: "เตรียมแผนรองรับหลายสถานการณ์ ลดความเสี่ยง", optionB: "เลือกคำตอบเดียวที่ถูกต้อง", optionC: "ลดต้นทุนเท่านั้น", optionD: "ใช้แทน Data Analysis", correctAnswer: "A", explanation: "Scenario Planning จำลองหลายสถานการณ์ (best/base/worst case) ให้ผู้บริหารเตรียมแผนรับมือล่วงหน้า", triggerPercent: 65, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-dml-3",
      title: "AI-Powered Risk Assessment",
      subtitle: "ประเมินความเสี่ยงทางธุรกิจด้วย AI",
      description: "ใช้ AI วิเคราะห์ความเสี่ยงด้านการเงิน การดำเนินงาน และตลาด เพื่อการตัดสินใจที่รอบคอบ",
      youtubeUrl: null,
      videoTitle: "AI Risk Assessment สำหรับผู้บริหาร",
      videoChannel: "Risk Management TH",
      durationText: "22:00",
      lessonLevel: CourseLevel.ADVANCED,
      lessonOrder: 3,
      summary: "AI ช่วยประเมินความเสี่ยงได้เร็วและครอบคลุมกว่ามนุษย์ ทั้ง Financial Risk, Operational Risk, Market Risk และ Compliance Risk",
      learningOutcomes: "1. ใช้ AI ประเมิน Financial Risk\n2. วิเคราะห์ Operational Risk ด้วย ML\n3. สร้าง Risk Dashboard",
      keyTakeaways: "1. AI ตรวจจับ anomaly ได้เร็ว\n2. ML ช่วยให้ credit scoring แม่นยำ\n3. Real-time monitoring ลดความเสี่ยง\n4. ต้อง validate model สม่ำเสมอ\n5. Human-in-the-loop ยังจำเป็น",
      coverImage: "/images/covers/lessons/dml-3.svg",
      inVideoQuizzes: [
        { question: "AI ช่วยตรวจจับความเสี่ยงแบบ Real-time ได้อย่างไร?", optionA: "ใช้ Anomaly Detection วิเคราะห์ข้อมูลต่อเนื่อง แจ้งเตือนทันที", optionB: "ส่งรายงานรายเดือน", optionC: "ตรวจสอบด้วยมือ", optionD: "ใช้ spreadsheet", correctAnswer: "A", explanation: "AI Anomaly Detection วิเคราะห์ data stream ตลอดเวลา แจ้งเตือนเมื่อพบ pattern ผิดปกติ", triggerPercent: 30, sortOrder: 1 },
        { question: "ทำไม Human-in-the-loop ยังสำคัญใน AI Risk Assessment?", optionA: "AI อาจมี false positive/negative ต้องมีคนตรวจสอบการตัดสินใจสำคัญ", optionB: "เพราะ AI ทำงานไม่ได้", optionC: "เพื่อให้ถูกกฎหมาย", optionD: "ไม่สำคัญ AI ตัดสินใจได้เอง", correctAnswer: "A", explanation: "การตัดสินใจสำคัญต้องมีมนุษย์ร่วมพิจารณา เพราะ AI อาจผิดพลาดและบริบทบางอย่างต้องใช้ judgment ของคน", triggerPercent: 65, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-dml-4",
      title: "สร้างวัฒนธรรม AI-First ในองค์กร",
      subtitle: "เปลี่ยนองค์กรสู่ AI-Driven Organization",
      description: "แนวทางการสร้างวัฒนธรรมที่เปิดรับ AI ตั้งแต่ Change Management, Upskilling ไปจนถึง AI Governance",
      youtubeUrl: null,
      videoTitle: "สร้างวัฒนธรรม AI-First ในองค์กร",
      videoChannel: "Digital Transformation TH",
      durationText: "28:00",
      lessonLevel: CourseLevel.ADVANCED,
      lessonOrder: 4,
      summary: "การเปลี่ยนองค์กรสู่ AI-First ไม่ใช่แค่เรื่องเทคโนโลยี แต่เป็นเรื่องวัฒนธรรม ต้อง upskill คน สร้าง governance และ leadership buy-in",
      learningOutcomes: "1. วางแผน AI Transformation Roadmap\n2. ออกแบบ AI Governance Framework\n3. สร้าง AI Upskilling Program",
      keyTakeaways: "1. เริ่มจาก Top-Down Support\n2. Upskill ทุกระดับไม่ใช่แค่ IT\n3. สร้าง AI Center of Excellence\n4. กำหนด AI Policy & Ethics\n5. วัดผล ROI ของ AI ชัดเจน",
      coverImage: "/images/covers/lessons/dml-4.svg",
      inVideoQuizzes: [
        { question: "อุปสรรคหลักในการสร้างวัฒนธรรม AI-First คือ?", optionA: "Resistance to Change และขาด AI Literacy ในองค์กร", optionB: "งบประมาณเท่านั้น", optionC: "เทคโนโลยี AI ยังไม่ดีพอ", optionD: "กฎหมายห้าม", correctAnswer: "A", explanation: "การต่อต้านการเปลี่ยนแปลงและขาดความรู้เรื่อง AI เป็นอุปสรรคหลัก ต้องแก้ด้วย Change Management และ Training", triggerPercent: 30, sortOrder: 1 },
        { question: "AI Center of Excellence (CoE) ทำหน้าที่อะไร?", optionA: "เป็นศูนย์กลางความรู้ AI กำหนดมาตรฐาน และสนับสนุนทุกแผนก", optionB: "แทนที่แผนก IT", optionC: "ดูแลเฉพาะ Data Science", optionD: "เป็นแผนกขาย AI", correctAnswer: "A", explanation: "AI CoE เป็นหน่วยงานกลางที่รวมผู้เชี่ยวชาญ กำหนดมาตรฐาน best practices และช่วยทุกแผนกนำ AI ไปใช้", triggerPercent: 70, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-dml-5",
      title: "Case Studies: AI Decision-Making ในธุรกิจจริง",
      subtitle: "กรณีศึกษาจากองค์กรชั้นนำระดับโลก",
      description: "วิเคราะห์กรณีศึกษาการใช้ AI ในการตัดสินใจจาก Netflix, Amazon, Starbucks, Grab และธุรกิจไทย",
      youtubeUrl: null,
      videoTitle: "Case Studies AI Decision Making ธุรกิจจริง",
      videoChannel: "Business Case TH",
      durationText: "25:00",
      lessonLevel: CourseLevel.ADVANCED,
      lessonOrder: 5,
      summary: "เรียนรู้จากกรณีจริง: Netflix ใช้ AI แนะนำ content, Amazon ใช้ AI จัดการ supply chain, Starbucks ใช้ AI personalize offers",
      learningOutcomes: "1. วิเคราะห์ Case Study AI Decision ได้\n2. ดึงบทเรียนมาประยุกต์กับธุรกิจตนเอง\n3. ออกแบบ AI Decision Framework",
      keyTakeaways: "1. Netflix — Recommendation Engine ลด churn\n2. Amazon — Demand Forecasting ลด waste\n3. Starbucks — Deep Brew AI personalize\n4. Grab — Dynamic Pricing optimization\n5. เริ่มจาก quick win ที่วัดผลได้ชัด",
      coverImage: "/images/covers/lessons/dml-5.svg",
      inVideoQuizzes: [
        { question: "Netflix ใช้ AI ตัดสินใจเรื่องอะไรที่สำคัญที่สุด?", optionA: "แนะนำ Content ที่แต่ละคนจะชอบ ลด churn rate", optionB: "ตัดสินใจเงินเดือนพนักงาน", optionC: "เลือกสีของ logo", optionD: "กำหนดราคาสมาชิก", correctAnswer: "A", explanation: "Netflix Recommendation System คิดเป็น 80% ของ content ที่ผู้ใช้ดู ช่วยลด churn ได้มูลค่า $1B/ปี", triggerPercent: 25, sortOrder: 1 },
        { question: "บทเรียนสำคัญจาก Case Studies เหล่านี้คือ?", optionA: "เริ่มจากปัญหาเล็กๆ พิสูจน์คุณค่า แล้วค่อย scale", optionB: "ลงทุนมากๆ ตั้งแต่แรก", optionC: "ทำทุกอย่างพร้อมกัน", optionD: "Copy คู่แข่งทุกอย่าง", correctAnswer: "A", explanation: "ทุก Case Study เริ่มจาก pilot project เล็กๆ วัดผล ROI ชัดเจน แล้วค่อย scale ไปทั้งองค์กร", triggerPercent: 70, sortOrder: 2 },
      ],
    },
  ],
  quiz: {
    title: "AI Decision-Making for Leaders — Final Quiz",
    passingScore: 70,
    questions: [
      { question: "Data-Driven Decision Making ช่วยลดอะไร?", optionA: "Cognitive Bias ในการตัดสินใจ", optionB: "จำนวนพนักงาน", optionC: "ค่าไฟฟ้า", optionD: "ราคาสินค้า", correctAnswer: "A", explanation: "DDDM ลดอคติโดยใช้ข้อมูลจริงแทนสัญชาตญาณ", sortOrder: 1 },
      { question: "Predictive Analytics ใช้อะไรเป็นหลัก?", optionA: "ข้อมูลในอดีตและ ML models คาดการณ์อนาคต", optionB: "Crystal Ball", optionC: "ผู้เชี่ยวชาญเดา", optionD: "สุ่ม", correctAnswer: "A", explanation: "ใช้ historical data + ML algorithms สร้าง model คาดการณ์", sortOrder: 2 },
      { question: "AI CoE มีบทบาทอย่างไร?", optionA: "เป็นศูนย์กลาง AI ขององค์กร กำหนดมาตรฐานและสนับสนุนทุกแผนก", optionB: "แทนที่ CEO", optionC: "ดูแลเฉพาะ Hardware", optionD: "ขาย AI ให้ลูกค้า", correctAnswer: "A", explanation: "AI CoE รวมผู้เชี่ยวชาญ กำหนด best practices ช่วยทุกแผนกใช้ AI ได้อย่างมีประสิทธิภาพ", sortOrder: 3 },
      { question: "Responsible AI สำคัญอย่างไรกับการตัดสินใจ?", optionA: "ช่วยให้ AI ตัดสินใจอย่างเป็นธรรม โปร่งใส ตรวจสอบได้", optionB: "ไม่เกี่ยวข้อง", optionC: "เป็นแค่การตลาด", optionD: "ทำให้ AI ช้าลง", correctAnswer: "A", explanation: "Responsible AI ทำให้การตัดสินใจของ AI น่าเชื่อถือ ตรวจสอบได้ และเป็นธรรม", sortOrder: 4 },
      { question: "แนวทาง AI Transformation ที่ดีคือ?", optionA: "เริ่ม pilot → วัดผล → scale + สร้าง AI Culture", optionB: "ซื้อ AI ทั้งหมดพร้อมกัน", optionC: "รอ 5 ปี", optionD: "จ้าง consultant อย่างเดียว", correctAnswer: "A", explanation: "Start small, measure, scale — สร้างวัฒนธรรม AI ไปพร้อมกับขยายการใช้งาน", sortOrder: 5 },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE 9: AI for Financial and Business Planning
// ═══════════════════════════════════════════════════════════════════════════════
const aiFinance: NewCourseSeed = {
  courseCode: "AIFIN-001",
  slug: "ai-for-financial-business-planning",
  title: "AI for Financial and Business Planning",
  shortDescription: "ใช้ AI วางแผนการเงินและธุรกิจอย่างมืออาชีพ",
  description: "หลักสูตรที่จะเปลี่ยนวิธีการวางแผนการเงินและธุรกิจด้วย AI ครอบคลุม Financial Modeling, Revenue Forecasting, Cost Optimization, Investment Analysis และ Business Plan ด้วยเครื่องมือ AI ที่ใช้งานได้จริง",
  category: "AI Finance",
  level: CourseLevel.INTERMEDIATE,
  duration: "6 ชั่วโมง",
  pathGroup: "APPLIED",
  pathOrder: 7,
  lessons: [
    {
      id: "lesson-fin-1",
      title: "AI Financial Modeling & Forecasting",
      subtitle: "สร้างแบบจำลองทางการเงินด้วย AI",
      description: "เรียนรู้การใช้ AI สร้าง Financial Model, Revenue Forecast และ Cash Flow Projection ที่แม่นยำ",
      youtubeUrl: "https://www.youtube.com/watch?v=xYtHfMGpVP0",
      videoTitle: "AI Financial Modeling สำหรับธุรกิจ",
      videoChannel: "Finance AI TH",
      durationText: "30:00",
      lessonLevel: CourseLevel.INTERMEDIATE,
      lessonOrder: 1,
      summary: "AI Financial Modeling ช่วยสร้างแบบจำลองการเงินที่ปรับตัวตามข้อมูลจริง แม่นยำกว่า Spreadsheet แบบเดิม",
      learningOutcomes: "1. สร้าง AI-powered Financial Model\n2. ทำ Revenue Forecasting ด้วย ML\n3. วิเคราะห์ Cash Flow ด้วย AI",
      keyTakeaways: "1. AI ทำ Forecasting แม่นยำกว่า Manual 30-50%\n2. Time Series Analysis พยากรณ์ Revenue\n3. Monte Carlo Simulation ประเมินความเสี่ยง\n4. Auto-update model ตามข้อมูลใหม่\n5. ยังต้องใช้ business judgment ร่วม",
      coverImage: "/images/covers/lessons/fin-1.svg",
      inVideoQuizzes: [
        { question: "AI Financial Model ดีกว่า Spreadsheet แบบเดิมอย่างไร?", optionA: "ปรับตัวตามข้อมูลใหม่อัตโนมัติ และวิเคราะห์ตัวแปรหลายตัวพร้อมกัน", optionB: "ใช้ง่ายกว่า", optionC: "ไม่ต้องใช้ข้อมูล", optionD: "ถูกกว่า", correctAnswer: "A", explanation: "AI Model ปรับตัวอัตโนมัติตาม data ใหม่ วิเคราะห์ multivariate ได้ และลด human error", triggerPercent: 30, sortOrder: 1 },
        { question: "Time Series Analysis ใช้ทำอะไรในธุรกิจ?", optionA: "พยากรณ์แนวโน้ม Revenue, Cost, Demand ตามเวลา", optionB: "วิเคราะห์รูปภาพ", optionC: "สร้าง Chatbot", optionD: "ออกแบบ Logo", correctAnswer: "A", explanation: "Time Series Analysis วิเคราะห์ pattern ของข้อมูลตามเวลา เพื่อ forecast ยอดขาย ต้นทุน demand", triggerPercent: 65, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-fin-2",
      title: "Cost Optimization ด้วย AI",
      subtitle: "ลดต้นทุนอย่างชาญฉลาดด้วยเทคโนโลยี AI",
      description: "ใช้ AI วิเคราะห์โครงสร้างต้นทุน หา inefficiency และแนะนำวิธีลดต้นทุนโดยไม่กระทบคุณภาพ",
      youtubeUrl: null,
      videoTitle: "AI Cost Optimization สำหรับธุรกิจ",
      videoChannel: "Business Optimization TH",
      durationText: "25:00",
      lessonLevel: CourseLevel.INTERMEDIATE,
      lessonOrder: 2,
      summary: "AI ช่วยวิเคราะห์ต้นทุนอย่างละเอียด หาจุดที่สูญเสียโดยไม่จำเป็น และแนะนำ optimization plan",
      learningOutcomes: "1. วิเคราะห์โครงสร้างต้นทุนด้วย AI\n2. หา Cost Leakage อัตโนมัติ\n3. สร้าง Optimization Plan",
      keyTakeaways: "1. AI หา cost leakage ที่มองไม่เห็น\n2. Procurement AI ลดต้นทุนจัดซื้อ\n3. Energy Optimization ลดค่าไฟ\n4. Process Mining หา bottleneck\n5. ต้อง balance ระหว่างต้นทุนกับคุณภาพ",
      coverImage: "/images/covers/lessons/fin-2.svg",
      inVideoQuizzes: [
        { question: "Process Mining ช่วย Cost Optimization อย่างไร?", optionA: "วิเคราะห์ขั้นตอนการทำงานจริงจากข้อมูล log หา bottleneck และ waste", optionB: "ขุดเหมืองแร่", optionC: "สร้าง process ใหม่", optionD: "ลดจำนวนพนักงาน", correctAnswer: "A", explanation: "Process Mining ดึงข้อมูลจาก system log มาสร้างภาพ process จริง เห็น bottleneck และ waste ที่ซ่อนอยู่", triggerPercent: 30, sortOrder: 1 },
        { question: "AI Procurement ช่วยลดต้นทุนจัดซื้ออย่างไร?", optionA: "วิเคราะห์ราคาตลาด เปรียบเทียบ supplier และหาช่วงเวลาซื้อที่ดีที่สุด", optionB: "ซื้อของถูกที่สุดเสมอ", optionC: "ไม่ต้องซื้ออะไรเลย", optionD: "จ้างคนน้อยลง", correctAnswer: "A", explanation: "AI Procurement วิเคราะห์ market price, supplier performance, timing ช่วยตัดสินใจซื้อในจังหวะที่ดีที่สุด", triggerPercent: 70, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-fin-3",
      title: "AI Investment Analysis",
      subtitle: "วิเคราะห์การลงทุนด้วย AI",
      description: "ใช้ AI ช่วยประเมินโอกาสการลงทุน วิเคราะห์ ROI และสร้าง Investment Portfolio Strategy",
      youtubeUrl: null,
      videoTitle: "AI สำหรับวิเคราะห์การลงทุน",
      videoChannel: "Investment AI TH",
      durationText: "27:00",
      lessonLevel: CourseLevel.INTERMEDIATE,
      lessonOrder: 3,
      summary: "AI ช่วยวิเคราะห์การลงทุนด้วย Sentiment Analysis, Market Pattern Recognition และ Portfolio Optimization",
      learningOutcomes: "1. ใช้ AI วิเคราะห์โอกาสลงทุน\n2. คำนวณ ROI ด้วย AI\n3. สร้าง Investment Strategy",
      keyTakeaways: "1. Sentiment Analysis วิเคราะห์ข่าวการลงทุน\n2. Pattern Recognition หา market trends\n3. Portfolio Optimization กระจายความเสี่ยง\n4. AI ไม่ได้รับประกันผลตอบแทน\n5. ใช้ AI เป็นเครื่องมือ ไม่ใช่ผู้ตัดสินใจ",
      coverImage: "/images/covers/lessons/fin-3.svg",
      inVideoQuizzes: [
        { question: "Sentiment Analysis ช่วยนักลงทุนอย่างไร?", optionA: "วิเคราะห์อารมณ์ตลาดจากข่าว โซเชียล เพื่อคาดการณ์ทิศทาง", optionB: "บอกราคาหุ้นที่แน่นอน", optionC: "เลือกหุ้นให้อัตโนมัติ", optionD: "รับประกันกำไร", correctAnswer: "A", explanation: "Sentiment Analysis วิเคราะห์ข่าว social media reviews เพื่อวัดอารมณ์ตลาด ช่วยประกอบการตัดสินใจ", triggerPercent: 25, sortOrder: 1 },
        { question: "Portfolio Optimization ด้วย AI ทำอะไร?", optionA: "กระจายการลงทุนให้ได้ผลตอบแทนสูงสุดภายใต้ความเสี่ยงที่ยอมรับได้", optionB: "ลงทุนในหุ้นเดียว", optionC: "ถอนเงินทั้งหมด", optionD: "ลงทุนตาม social media", correctAnswer: "A", explanation: "AI Portfolio Optimization ใช้ Modern Portfolio Theory + ML หาสัดส่วนการลงทุนที่เหมาะสมที่สุด", triggerPercent: 70, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-fin-4",
      title: "Business Plan ด้วย AI",
      subtitle: "เขียนแผนธุรกิจด้วยความช่วยเหลือจาก AI",
      description: "ใช้ AI ช่วยเขียน Business Plan ตั้งแต่ Market Analysis, Financial Projection ไปจนถึง Go-to-Market Strategy",
      youtubeUrl: null,
      videoTitle: "เขียน Business Plan ด้วย AI",
      videoChannel: "Startup TH",
      durationText: "30:00",
      lessonLevel: CourseLevel.INTERMEDIATE,
      lessonOrder: 4,
      summary: "AI ช่วยเขียน Business Plan ที่มีคุณภาพได้เร็วขึ้น ตั้งแต่วิเคราะห์ตลาด คาดการณ์การเงิน ไปจนถึงวาง Strategy",
      learningOutcomes: "1. ใช้ AI วิเคราะห์ Market Opportunity\n2. สร้าง Financial Projection ด้วย AI\n3. เขียน Business Plan ที่สมบูรณ์",
      keyTakeaways: "1. AI ช่วย Market Research เร็ว 10 เท่า\n2. Competitive Analysis ด้วย AI ครอบคลุมกว่า\n3. Financial Projection ที่ data-backed\n4. AI ช่วยเขียน ไม่ได้ช่วยคิดแทน\n5. ต้อง validate ด้วย domain expertise",
      coverImage: "/images/covers/lessons/fin-4.svg",
      inVideoQuizzes: [
        { question: "AI ช่วย Market Research อย่างไร?", optionA: "วิเคราะห์ข้อมูลตลาดจำนวนมาก หาแนวโน้มและโอกาสได้เร็วกว่า", optionB: "คิด business idea ให้", optionC: "หานักลงทุนให้", optionD: "ทำ product ให้", correctAnswer: "A", explanation: "AI สามารถวิเคราะห์ข้อมูลตลาด, คู่แข่ง, แนวโน้มจำนวนมหาศาลได้ในเวลาสั้นๆ", triggerPercent: 25, sortOrder: 1 },
        { question: "Financial Projection ที่ดีต้องมีอะไร?", optionA: "Assumptions ที่ชัดเจน, 3-5 scenarios, และ sensitivity analysis", optionB: "ตัวเลขเดียวที่แม่นยำ 100%", optionC: "คัดลอกจากคู่แข่ง", optionD: "ใช้ตัวเลขกลมๆ", correctAnswer: "A", explanation: "Financial Projection ที่น่าเชื่อถือต้องระบุ assumptions ชัดเจน มีหลาย scenario และ sensitivity analysis", triggerPercent: 70, sortOrder: 2 },
      ],
    },
    {
      id: "lesson-fin-5",
      title: "FinTech & AI: อนาคตการเงินธุรกิจ",
      subtitle: "เทรนด์ AI ในวงการ FinTech ที่ธุรกิจต้องรู้",
      description: "สำรวจ FinTech + AI ตั้งแต่ Digital Payment, Blockchain, DeFi ไปจนถึง AI-Powered Banking",
      youtubeUrl: null,
      videoTitle: "FinTech & AI อนาคตการเงินธุรกิจ",
      videoChannel: "FinTech TH",
      durationText: "22:00",
      lessonLevel: CourseLevel.INTERMEDIATE,
      lessonOrder: 5,
      summary: "FinTech + AI กำลังเปลี่ยนวงการการเงิน: AI Lending, Robo-Advisory, Fraud Detection และ Digital Payment",
      learningOutcomes: "1. เข้าใจ FinTech + AI Landscape\n2. ใช้ FinTech ในธุรกิจได้\n3. เตรียมพร้อมสำหรับ Digital Finance",
      keyTakeaways: "1. AI Lending ปล่อยสินเชื่อเร็วขึ้น\n2. Robo-Advisory ลงทุนอัตโนมัติ\n3. Fraud Detection ด้วย AI แม่นยำ\n4. Open Banking เชื่อมข้อมูลได้\n5. RegTech ช่วยปฏิบัติตามกฎหมาย",
      coverImage: "/images/covers/lessons/fin-5.svg",
      inVideoQuizzes: [
        { question: "Robo-Advisory คืออะไร?", optionA: "AI ที่ให้คำแนะนำการลงทุนอัตโนมัติตาม risk profile ของผู้ใช้", optionB: "หุ่นยนต์ที่ให้คำปรึกษา", optionC: "Chat bot ของธนาคาร", optionD: "โปรแกรมบัญชี", correctAnswer: "A", explanation: "Robo-Advisory ใช้ algorithm วิเคราะห์ risk profile และ goal ของผู้ใช้ แล้วจัดสรรพอร์ตลงทุนอัตโนมัติ", triggerPercent: 30, sortOrder: 1 },
        { question: "AI Fraud Detection ทำงานอย่างไร?", optionA: "วิเคราะห์ pattern ธุรกรรมผิดปกติ แจ้งเตือนแบบ real-time", optionB: "บล็อก transaction ทั้งหมด", optionC: "ตรวจสอบด้วยมือ", optionD: "ส่ง email แจ้ง", correctAnswer: "A", explanation: "AI วิเคราะห์ transaction patterns แบบ real-time ตรวจจับ anomaly และ fraud ได้ภายในมิลลิวินาที", triggerPercent: 65, sortOrder: 2 },
      ],
    },
  ],
  quiz: {
    title: "AI for Financial and Business Planning — Final Quiz",
    passingScore: 70,
    questions: [
      { question: "AI Financial Model ดีกว่า Manual อย่างไร?", optionA: "ปรับตัวตามข้อมูลใหม่อัตโนมัติ แม่นยำกว่า 30-50%", optionB: "ไม่ต้องใช้ข้อมูล", optionC: "ใช้ง่ายกว่า Excel", optionD: "ฟรี", correctAnswer: "A", explanation: "AI Model ใช้ ML อัปเดตจากข้อมูลจริง ให้ forecast ที่แม่นยำกว่า static spreadsheet", sortOrder: 1 },
      { question: "Process Mining ใช้ทำอะไร?", optionA: "วิเคราะห์ขั้นตอนการทำงานจริงจาก system log หา bottleneck", optionB: "ขุดแร่", optionC: "เขียนโค้ด", optionD: "ออกแบบ website", correctAnswer: "A", explanation: "Process Mining สร้างภาพ actual process จาก log data เห็น waste และ bottleneck", sortOrder: 2 },
      { question: "Sentiment Analysis มีประโยชน์อย่างไร?", optionA: "วัดอารมณ์ตลาดจากข่าวและ social media", optionB: "วิเคราะห์ภาพ", optionC: "สร้าง website", optionD: "ส่ง email", correctAnswer: "A", explanation: "วิเคราะห์ text จากแหล่งข่าว/social ดูว่า market sentiment เป็นบวกหรือลบ", sortOrder: 3 },
      { question: "Business Plan ที่ดีควรมี Financial Projection แบบใด?", optionA: "3-5 scenarios พร้อม sensitivity analysis", optionB: "ตัวเลขเดียวแม่นยำ 100%", optionC: "ไม่ต้องมี", optionD: "Copy จากคู่แข่ง", correctAnswer: "A", explanation: "ต้องมีหลาย scenario (optimistic/base/pessimistic) และ sensitivity analysis", sortOrder: 4 },
      { question: "FinTech + AI เปลี่ยนอะไรมากที่สุด?", optionA: "การเข้าถึงบริการทางการเงินที่เร็วและถูกลง", optionB: "ยกเลิกธนาคาร", optionC: "ทำให้เงินสดหายไป", optionD: "เปลี่ยนสกุลเงิน", correctAnswer: "A", explanation: "FinTech + AI ทำให้บริการการเงินเร็ว ถูก เข้าถึงง่าย ลดต้นทุน", sortOrder: 5 },
    ],
  },
};

export const newCoursesPart1: NewCourseSeed[] = [aiFundamentals, aiDecision, aiFinance];
