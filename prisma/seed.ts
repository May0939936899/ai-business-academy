import { PrismaClient, Role, CourseLevel, CourseStatus, CorrectAnswer } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Clean existing data ──────────────────────────────────────────────────
  await prisma.certificateTemplate.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleaned existing data.");

  // ─── Create Users ─────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      fullName: "Admin AI Academy",
      email: "admin@aibiz.academy",
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  const instructor = await prisma.user.create({
    data: {
      fullName: "ผศ.ดร.ธรรมรัตน์ พลอยเพ็ชร์",
      email: "instructor@aibiz.academy",
      role: Role.INSTRUCTOR,
    },
  });
  console.log(`Created instructor user: ${instructor.email}`);

  // ═══════════════════════════════════════════════════════════════════════════
  // Course 1: AI Automation for Business
  // ═══════════════════════════════════════════════════════════════════════════
  const course1 = await prisma.course.create({
    data: {
      title: "AI Automation for Business",
      slug: "ai-automation-for-business",
      courseCode: "AIAUTO",
      description:
        "เรียนรู้การใช้ AI Automation เพื่อเพิ่มประสิทธิภาพธุรกิจ ตั้งแต่การทำงานอัตโนมัติด้วย AI Agent, Workflow Automation ไปจนถึง RPA (Robotic Process Automation) พร้อมกรณีศึกษาจริงจากธุรกิจไทย",
      shortDescription:
        "เรียนรู้การใช้ AI Automation เพื่อเพิ่มประสิทธิภาพและลดต้นทุนธุรกิจ",
      category: "AI Automation",
      level: CourseLevel.BEGINNER,
      duration: "6 ชั่วโมง",
      isFree: true,
      hasCertificate: true,
      instructorId: instructor.id,
      status: CourseStatus.PUBLISHED,
    },
  });

  const c1Lessons = [
    {
      title: "รู้จัก AI Automation — ทำไมธุรกิจต้องใช้",
      description: "ทำความเข้าใจ AI Automation คืออะไร ช่วยธุรกิจได้อย่างไร พร้อมตัวอย่างจริง",
      youtubeUrl: "https://www.youtube.com/watch?v=2ePf9rue1Ao",
      lessonOrder: 1,
    },
    {
      title: "AI Agent & Workflow Automation เบื้องต้น",
      description: "เรียนรู้การสร้าง AI Agent และ Workflow อัตโนมัติด้วยเครื่องมือ No-Code เช่น Make, Zapier",
      youtubeUrl: "https://www.youtube.com/watch?v=ad79nYk2keg",
      lessonOrder: 2,
    },
    {
      title: "RPA — Robotic Process Automation สำหรับธุรกิจ",
      description: "เข้าใจ RPA และการนำมาใช้ทำงานซ้ำ ๆ แทนคน เช่น การกรอกข้อมูล การส่งอีเมล",
      youtubeUrl: "https://www.youtube.com/watch?v=mJeNghZXtMo",
      lessonOrder: 3,
    },
    {
      title: "Workshop: สร้าง Automated Workflow ด้วย AI",
      description: "ลงมือสร้าง Workflow อัตโนมัติจริง เชื่อมต่อ ChatGPT กับ Google Sheets, Email และ LINE",
      youtubeUrl: "https://www.youtube.com/watch?v=o7M0AWPB3Mg",
      lessonOrder: 4,
    },
    {
      title: "กรณีศึกษาและการวาง Automation Strategy",
      description: "ศึกษาตัวอย่างจริงจากธุรกิจไทยที่ใช้ AI Automation สำเร็จ พร้อมแนวทางวางกลยุทธ์",
      youtubeUrl: "https://www.youtube.com/watch?v=TRjq7t2Ms5I",
      lessonOrder: 5,
    },
  ];

  for (const lesson of c1Lessons) {
    await prisma.lesson.create({ data: { ...lesson, courseId: course1.id } });
  }

  const quiz1 = await prisma.quiz.create({
    data: { courseId: course1.id, title: "แบบทดสอบ: AI Automation for Business", passingScore: 70 },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz1.id, sortOrder: 1,
        question: "AI Automation มีประโยชน์หลักอย่างไรต่อธุรกิจ?",
        optionA: "ทำให้สินค้าถูกลง", optionB: "ช่วยลดงานซ้ำ ๆ และเพิ่มประสิทธิภาพการทำงาน",
        optionC: "ทำให้ไม่ต้องจ้างพนักงาน", optionD: "ใช้ได้กับธุรกิจขนาดใหญ่เท่านั้น",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI Automation ช่วยลดงานซ้ำ ๆ ทำให้พนักงานมีเวลาทำงานที่สำคัญกว่า",
      },
      {
        quizId: quiz1.id, sortOrder: 2,
        question: "RPA ย่อมาจากอะไร?",
        optionA: "Rapid Process Algorithm", optionB: "Real-time Processing Architecture",
        optionC: "Robotic Process Automation", optionD: "Responsive Platform Application",
        correctAnswer: CorrectAnswer.C,
        explanation: "RPA คือ Robotic Process Automation — เทคโนโลยีที่ใช้ Bot ทำงานซ้ำ ๆ แทนคน",
      },
      {
        quizId: quiz1.id, sortOrder: 3,
        question: "เครื่องมือใดเป็น No-Code Automation Platform?",
        optionA: "Python", optionB: "Make (Integromat) และ Zapier",
        optionC: "Photoshop", optionD: "Excel",
        correctAnswer: CorrectAnswer.B,
        explanation: "Make และ Zapier เป็น No-Code Platform ที่ช่วยสร้าง Workflow อัตโนมัติโดยไม่ต้องเขียนโค้ด",
      },
      {
        quizId: quiz1.id, sortOrder: 4,
        question: "AI Agent คืออะไร?",
        optionA: "พนักงานที่ใช้ AI", optionB: "ระบบ AI ที่สามารถตัดสินใจและดำเนินการได้ด้วยตัวเอง",
        optionC: "แอพมือถือ", optionD: "ฐานข้อมูล AI",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI Agent คือระบบ AI ที่สามารถรับข้อมูล ตัดสินใจ และดำเนินการได้อัตโนมัติตาม Goal ที่กำหนด",
      },
      {
        quizId: quiz1.id, sortOrder: 5,
        question: "ขั้นตอนแรกในการวาง Automation Strategy คืออะไร?",
        optionA: "ซื้อซอฟต์แวร์ทันที", optionB: "จ้าง Developer",
        optionC: "วิเคราะห์กระบวนการทำงานปัจจุบันและระบุจุดที่ Automate ได้", optionD: "เปลี่ยนระบบทั้งหมด",
        correctAnswer: CorrectAnswer.C,
        explanation: "ควรเริ่มจากการวิเคราะห์ Process ปัจจุบัน หาจุดที่เป็นงานซ้ำ ๆ ใช้เวลามาก แล้วค่อยเลือก Automate",
      },
      {
        quizId: quiz1.id, sortOrder: 6,
        question: "Workflow Automation ช่วยแก้ปัญหาอะไรได้ดีที่สุด?",
        optionA: "การตัดสินใจเชิงกลยุทธ์", optionB: "งานที่ต้องทำซ้ำ ๆ ตามขั้นตอนที่กำหนด",
        optionC: "งานสร้างสรรค์", optionD: "การเจรจาต่อรอง",
        correctAnswer: CorrectAnswer.B,
        explanation: "Workflow Automation เหมาะกับงานที่มีขั้นตอนชัดเจน ทำซ้ำ ๆ เช่น ส่งอีเมล กรอกข้อมูล อนุมัติเอกสาร",
      },
      {
        quizId: quiz1.id, sortOrder: 7,
        question: "ข้อใดคือตัวอย่างการใช้ AI Automation ในธุรกิจ?",
        optionA: "Chatbot ตอบคำถามลูกค้า 24/7", optionB: "พิมพ์เอกสารด้วยมือ",
        optionC: "โทรหาลูกค้าทีละคน", optionD: "วาดรูปด้วยมือ",
        correctAnswer: CorrectAnswer.A,
        explanation: "Chatbot ที่ขับเคลื่อนด้วย AI เป็นตัวอย่างที่ดีของ AI Automation ที่ช่วยตอบลูกค้าได้ตลอด 24 ชั่วโมง",
      },
      {
        quizId: quiz1.id, sortOrder: 8,
        question: "การเชื่อมต่อ ChatGPT กับ Google Sheets ผ่าน Zapier เรียกว่าอะไร?",
        optionA: "Machine Learning", optionB: "API Integration / Workflow Automation",
        optionC: "Deep Learning", optionD: "Data Science",
        correctAnswer: CorrectAnswer.B,
        explanation: "การเชื่อมต่อเครื่องมือต่าง ๆ เข้าด้วยกันผ่าน API เรียกว่า Integration ซึ่งเป็นพื้นฐานของ Workflow Automation",
      },
      {
        quizId: quiz1.id, sortOrder: 9,
        question: "ข้อควรระวังในการใช้ AI Automation คืออะไร?",
        optionA: "ไม่มีข้อควรระวัง", optionB: "ต้องตรวจสอบความถูกต้องของ Output เสมอ",
        optionC: "ใช้กับทุกงานได้เลย", optionD: "ไม่ต้องทดสอบก่อนใช้งานจริง",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI อาจเกิดข้อผิดพลาดได้ (Hallucination) ต้องตรวจสอบ Output และทดสอบ Workflow ก่อนใช้งานจริง",
      },
      {
        quizId: quiz1.id, sortOrder: 10,
        question: "ROI ของ AI Automation วัดจากอะไร?",
        optionA: "จำนวนซอฟต์แวร์ที่ซื้อ", optionB: "เวลาและต้นทุนที่ประหยัดได้เทียบกับการลงทุน",
        optionC: "จำนวน Bot ที่สร้าง", optionD: "ความซับซ้อนของระบบ",
        correctAnswer: CorrectAnswer.B,
        explanation: "ROI วัดจากเวลาที่ประหยัด ต้นทุนที่ลดลง และ Productivity ที่เพิ่มขึ้น เทียบกับค่าใช้จ่ายในการ Implement",
      },
    ],
  });

  console.log(`Created course: ${course1.title}`);

  // ═══════════════════════════════════════════════════════════════════════════
  // Course 2: AI Marketing Strategy
  // ═══════════════════════════════════════════════════════════════════════════
  const course2 = await prisma.course.create({
    data: {
      title: "AI Marketing Strategy",
      slug: "ai-marketing-strategy",
      courseCode: "AIMKT",
      description:
        "เรียนรู้การใช้ AI เพื่อยกระดับการตลาดดิจิทัล ตั้งแต่การวิเคราะห์ลูกค้าด้วย AI, Content Creation, Personalization ไปจนถึง Marketing Automation และ Campaign Optimization",
      shortDescription:
        "ใช้ AI ยกระดับกลยุทธ์การตลาด วิเคราะห์ลูกค้า สร้างคอนเทนต์ และ Automate แคมเปญ",
      category: "AI Marketing",
      level: CourseLevel.INTERMEDIATE,
      duration: "8 ชั่วโมง",
      isFree: true,
      hasCertificate: true,
      instructorId: instructor.id,
      status: CourseStatus.PUBLISHED,
    },
  });

  const c2Lessons = [
    {
      title: "AI กำลังเปลี่ยนโลกการตลาดอย่างไร",
      description: "ภาพรวม AI ในการตลาด เทรนด์ล่าสุด และโอกาสสำหรับนักการตลาดยุคใหม่",
      youtubeUrl: "https://www.youtube.com/watch?v=l_bgSUjqJwI",
      lessonOrder: 1,
    },
    {
      title: "Customer Analytics & Segmentation ด้วย AI",
      description: "เรียนรู้การใช้ AI วิเคราะห์พฤติกรรมลูกค้า แบ่งกลุ่ม และทำ Customer Lifetime Value",
      youtubeUrl: "https://www.youtube.com/watch?v=29HRFyvZXQg",
      lessonOrder: 2,
    },
    {
      title: "AI Content Creation สำหรับนักการตลาด",
      description: "เครื่องมือ AI สำหรับสร้างคอนเทนต์: ข้อความ รูปภาพ วิดีโอ พร้อม Workshop",
      youtubeUrl: "https://www.youtube.com/watch?v=Onh_1lDhUto",
      lessonOrder: 3,
    },
    {
      title: "Personalization & Recommendation Systems",
      description: "สร้าง Personalized Experience ให้ลูกค้าด้วย AI Recommendation",
      youtubeUrl: "https://www.youtube.com/watch?v=Eeg1DEeWUjA",
      lessonOrder: 4,
    },
    {
      title: "Marketing Automation & Campaign Optimization",
      description: "ใช้ AI ทำ Marketing Automation, A/B Testing อัตโนมัติ และ Optimize แคมเปญ",
      youtubeUrl: "https://www.youtube.com/watch?v=7FX-F0ASSCY",
      lessonOrder: 5,
    },
  ];

  for (const lesson of c2Lessons) {
    await prisma.lesson.create({ data: { ...lesson, courseId: course2.id } });
  }

  const quiz2 = await prisma.quiz.create({
    data: { courseId: course2.id, title: "แบบทดสอบ: AI Marketing Strategy", passingScore: 70 },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz2.id, sortOrder: 1,
        question: "AI ช่วยในเรื่อง Customer Segmentation อย่างไร?",
        optionA: "แบ่งกลุ่มตามอายุเท่านั้น", optionB: "วิเคราะห์หลายมิติเพื่อแบ่งกลุ่มอัตโนมัติ",
        optionC: "ส่งอีเมลเหมือนกันทุกคน", optionD: "ลบข้อมูลลูกค้าที่ไม่ซื้อ",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI วิเคราะห์ข้อมูลหลายมิติ เช่น พฤติกรรม ข้อมูลประชากร เพื่อแบ่งกลุ่มลูกค้าอัตโนมัติ",
      },
      {
        quizId: quiz2.id, sortOrder: 2,
        question: "Personalization ในการตลาดหมายถึงอะไร?",
        optionA: "ส่งข้อมูลเดียวกันให้ทุกคน", optionB: "ปรับเนื้อหาและข้อเสนอให้เหมาะกับลูกค้าแต่ละคน",
        optionC: "ใช้ชื่อลูกค้าในอีเมลเท่านั้น", optionD: "ลดราคาสินค้าทุกชิ้น",
        correctAnswer: CorrectAnswer.B,
        explanation: "Personalization คือการปรับเนื้อหา สินค้า และข้อเสนอให้ตรงกับความต้องการของลูกค้าแต่ละคน",
      },
      {
        quizId: quiz2.id, sortOrder: 3,
        question: "AI Content Creation มีข้อดีอย่างไร?",
        optionA: "ไม่ต้องตรวจสอบเลย", optionB: "สร้างคอนเทนต์ได้เร็วและหลากหลายรูปแบบ",
        optionC: "แทนที่นักเขียนได้ทั้งหมด", optionD: "ใช้ได้เฉพาะภาษาอังกฤษ",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI ช่วยสร้าง Draft คอนเทนต์ได้รวดเร็ว แต่ยังต้องมีคนตรวจสอบและปรับแต่ง",
      },
      {
        quizId: quiz2.id, sortOrder: 4,
        question: "Recommendation System ใช้หลักการใด?",
        optionA: "แนะนำแบบสุ่ม", optionB: "แนะนำสินค้าแพงเท่านั้น",
        optionC: "วิเคราะห์ความชอบเพื่อแนะนำสิ่งที่ตรงใจ", optionD: "แนะนำตามตัวอักษร",
        correctAnswer: CorrectAnswer.C,
        explanation: "ใช้ Collaborative Filtering และ Content-Based Filtering วิเคราะห์ข้อมูลผู้ใช้",
      },
      {
        quizId: quiz2.id, sortOrder: 5,
        question: "Marketing Automation ด้วย AI ช่วยอะไรได้บ้าง?",
        optionA: "เพิ่มงานให้นักการตลาด", optionB: "ส่งข้อความที่เหมาะสมกับลูกค้าแต่ละคนอัตโนมัติ",
        optionC: "ลดงบเป็นศูนย์", optionD: "ไม่ต้องวางแผนเลย",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI Marketing Automation ช่วยส่งข้อความ Personalized ในเวลาที่เหมาะสมอัตโนมัติ",
      },
      {
        quizId: quiz2.id, sortOrder: 6,
        question: "A/B Testing ด้วย AI แตกต่างจากแบบดั้งเดิมอย่างไร?",
        optionA: "ไม่แตกต่าง", optionB: "ทดสอบหลายตัวแปรพร้อมกันและปรับ Real-Time",
        optionC: "AI ทำ A/B Testing ไม่ได้", optionD: "แบบดั้งเดิมดีกว่าเสมอ",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI สามารถ Multivariate Testing และปรับ Traffic ไปยังเวอร์ชันที่ดีกว่าแบบ Real-Time",
      },
      {
        quizId: quiz2.id, sortOrder: 7,
        question: "Customer Lifetime Value (CLV) คืออะไร?",
        optionA: "ยอดซื้อครั้งเดียว", optionB: "มูลค่ารวมที่ลูกค้าจะสร้างให้ตลอดความสัมพันธ์",
        optionC: "จำนวนลูกค้าทั้งหมด", optionD: "ต้นทุนการหาลูกค้าใหม่",
        correctAnswer: CorrectAnswer.B,
        explanation: "CLV คือการคาดการณ์รายได้รวมที่ลูกค้าจะสร้างให้ตลอดระยะเวลาที่เป็นลูกค้า",
      },
      {
        quizId: quiz2.id, sortOrder: 8,
        question: "เครื่องมือ AI ใดเหมาะสำหรับสร้างรูปภาพการตลาด?",
        optionA: "ChatGPT", optionB: "Midjourney หรือ DALL-E",
        optionC: "Google Analytics", optionD: "Mailchimp",
        correctAnswer: CorrectAnswer.B,
        explanation: "Midjourney และ DALL-E เป็น AI ที่สร้างรูปภาพจากข้อความ เหมาะสำหรับ Visual Content",
      },
      {
        quizId: quiz2.id, sortOrder: 9,
        question: "Churn Prediction คืออะไร?",
        optionA: "การหาลูกค้าใหม่", optionB: "การทำนายว่าลูกค้าคนไหนจะเลิกใช้บริการ",
        optionC: "การคำนวณกำไร", optionD: "การส่งอีเมล",
        correctAnswer: CorrectAnswer.B,
        explanation: "Churn Prediction ใช้ AI ทำนายว่าลูกค้าคนไหนมีแนวโน้มจะเลิกใช้บริการ เพื่อรักษาลูกค้าได้ทัน",
      },
      {
        quizId: quiz2.id, sortOrder: 10,
        question: "Prompt Engineering สำคัญกับ AI Marketing อย่างไร?",
        optionA: "ไม่เกี่ยวข้อง", optionB: "ช่วยสร้างคอนเทนต์ที่ตรงเป้าหมายมากขึ้น",
        optionC: "ใช้กับการเงินเท่านั้น", optionD: "ทำให้ AI ทำงานช้าลง",
        correctAnswer: CorrectAnswer.B,
        explanation: "Prompt Engineering ช่วยให้ AI สร้างคอนเทนต์ที่มีคุณภาพและตรงกับ Target Audience มากขึ้น",
      },
    ],
  });

  console.log(`Created course: ${course2.title}`);

  // ═══════════════════════════════════════════════════════════════════════════
  // Course 3: AI for HR
  // ═══════════════════════════════════════════════════════════════════════════
  const course3 = await prisma.course.create({
    data: {
      title: "AI for HR Management",
      slug: "ai-for-hr",
      courseCode: "AIHR",
      description:
        "เรียนรู้การใช้ AI ในงาน HR ตั้งแต่การสรรหาบุคลากร, การคัดกรองเรซูเม่, Employee Engagement ไปจนถึง People Analytics และการพัฒนาพนักงาน",
      shortDescription:
        "ใช้ AI ปฏิวัติงาน HR สรรหาบุคลากร วิเคราะห์พนักงาน และพัฒนาองค์กร",
      category: "AI HR",
      level: CourseLevel.BEGINNER,
      duration: "6 ชั่วโมง",
      isFree: true,
      hasCertificate: true,
      instructorId: instructor.id,
      status: CourseStatus.PUBLISHED,
    },
  });

  const c3Lessons = [
    {
      title: "AI กับการเปลี่ยนแปลงงาน HR",
      description: "ภาพรวม AI ในงาน HR เทรนด์ล่าสุด และโอกาสที่ HR ควรรู้",
      youtubeUrl: "https://www.youtube.com/watch?v=aGwYtUzMQUk",
      lessonOrder: 1,
    },
    {
      title: "AI Recruitment — สรรหาบุคลากรด้วย AI",
      description: "การใช้ AI คัดกรองเรซูเม่ วิเคราะห์ผู้สมัคร และลดอคติในการสรรหา",
      youtubeUrl: "https://www.youtube.com/watch?v=pOmpqanGpEg",
      lessonOrder: 2,
    },
    {
      title: "People Analytics เบื้องต้น",
      description: "เรียนรู้การใช้ข้อมูลและ AI วิเคราะห์ Workforce ทำนาย Turnover และ Performance",
      youtubeUrl: "https://www.youtube.com/watch?v=_ZvnD1chbNM",
      lessonOrder: 3,
    },
    {
      title: "AI สำหรับ Employee Engagement & Development",
      description: "เครื่องมือ AI สำหรับสำรวจความผูกพัน แนะนำหลักสูตร และพัฒนาพนักงาน",
      youtubeUrl: "https://www.youtube.com/watch?v=dOxUroR57xs",
      lessonOrder: 4,
    },
    {
      title: "จริยธรรมและกฎหมาย AI ในงาน HR",
      description: "ข้อควรระวัง Bias, Privacy, PDPA และแนวปฏิบัติที่ดีในการใช้ AI กับข้อมูลพนักงาน",
      youtubeUrl: "https://www.youtube.com/watch?v=sTeoEFzVNSc",
      lessonOrder: 5,
    },
  ];

  for (const lesson of c3Lessons) {
    await prisma.lesson.create({ data: { ...lesson, courseId: course3.id } });
  }

  const quiz3 = await prisma.quiz.create({
    data: { courseId: course3.id, title: "แบบทดสอบ: AI for HR Management", passingScore: 70 },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz3.id, sortOrder: 1,
        question: "AI ช่วยงานสรรหาบุคลากรได้อย่างไร?",
        optionA: "แทนที่ HR ทั้งหมด", optionB: "คัดกรองเรซูเม่และจับคู่ผู้สมัครกับตำแหน่งอัตโนมัติ",
        optionC: "จ้างคนโดยไม่ต้องสัมภาษณ์", optionD: "ลดเงินเดือนพนักงาน",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI ช่วยคัดกรองเรซูเม่จำนวนมาก จับคู่ Skills กับ Job Requirements ได้รวดเร็ว",
      },
      {
        quizId: quiz3.id, sortOrder: 2,
        question: "People Analytics คืออะไร?",
        optionA: "การนับจำนวนพนักงาน", optionB: "การใช้ข้อมูลวิเคราะห์เชิงลึกเกี่ยวกับ Workforce",
        optionC: "การสำรวจความพอใจแบบกระดาษ", optionD: "การคำนวณเงินเดือน",
        correctAnswer: CorrectAnswer.B,
        explanation: "People Analytics ใช้ข้อมูลและ AI วิเคราะห์ Workforce เช่น Turnover, Performance, Engagement",
      },
      {
        quizId: quiz3.id, sortOrder: 3,
        question: "ข้อควรระวังในการใช้ AI คัดกรองเรซูเม่คืออะไร?",
        optionA: "ไม่มีข้อควรระวัง", optionB: "อาจเกิด Bias จากข้อมูลที่ใช้ Train",
        optionC: "ทำงานช้าเกินไป", optionD: "ราคาแพงมาก",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI อาจมี Bias จากข้อมูลในอดีต เช่น เอนเอียงเรื่อง เพศ อายุ สถาบัน ต้องตรวจสอบ Fairness",
      },
      {
        quizId: quiz3.id, sortOrder: 4,
        question: "Turnover Prediction ช่วย HR อย่างไร?",
        optionA: "ทำให้พนักงานลาออกเร็วขึ้น", optionB: "ทำนายพนักงานที่มีแนวโน้มลาออกเพื่อรักษาไว้ได้ทัน",
        optionC: "คำนวณค่าล่วงเวลา", optionD: "จัดตารางเวรอัตโนมัติ",
        correctAnswer: CorrectAnswer.B,
        explanation: "Turnover Prediction ใช้ AI วิเคราะห์ปัจจัยต่าง ๆ เพื่อทำนายพนักงานที่เสี่ยงลาออก ให้ HR แก้ไขได้ทัน",
      },
      {
        quizId: quiz3.id, sortOrder: 5,
        question: "PDPA เกี่ยวข้องกับการใช้ AI ในงาน HR อย่างไร?",
        optionA: "ไม่เกี่ยวข้อง", optionB: "ต้องขอความยินยอมและปกป้องข้อมูลส่วนบุคคลพนักงาน",
        optionC: "PDPA ใช้กับลูกค้าเท่านั้น", optionD: "ห้ามใช้ AI ในงาน HR",
        correctAnswer: CorrectAnswer.B,
        explanation: "PDPA กำหนดให้ต้องขอ Consent ก่อนเก็บ/ใช้ข้อมูลส่วนบุคคล รวมถึงข้อมูลพนักงาน",
      },
      {
        quizId: quiz3.id, sortOrder: 6,
        question: "AI-Powered Learning Platform ช่วยพัฒนาพนักงานอย่างไร?",
        optionA: "บังคับเรียนทุกคอร์ส", optionB: "แนะนำหลักสูตรที่เหมาะกับ Skill Gap ของแต่ละคน",
        optionC: "ยกเลิกการอบรมทั้งหมด", optionD: "ให้คะแนนแบบสุ่ม",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI วิเคราะห์ Skill Gap และแนะนำ Learning Path ที่เหมาะกับพนักงานแต่ละคน",
      },
      {
        quizId: quiz3.id, sortOrder: 7,
        question: "Sentiment Analysis ใช้ในงาน HR อย่างไร?",
        optionA: "วิเคราะห์ยอดขาย", optionB: "วิเคราะห์ความรู้สึกพนักงานจาก Survey, Email, Chat",
        optionC: "คำนวณภาษี", optionD: "ออกแบบออฟฟิศ",
        correctAnswer: CorrectAnswer.B,
        explanation: "Sentiment Analysis ใช้ NLP วิเคราะห์ความรู้สึกจากข้อความ ช่วย HR เข้าใจ Morale ของพนักงาน",
      },
      {
        quizId: quiz3.id, sortOrder: 8,
        question: "ข้อใดเป็นประโยชน์ของ AI Chatbot สำหรับ HR?",
        optionA: "ตอบคำถาม HR ทั่วไปได้ 24/7", optionB: "ทดแทนแผนก HR ทั้งหมด",
        optionC: "ทำสัญญาจ้างอัตโนมัติ", optionD: "ตัดสินใจไล่ออกแทน HR",
        correctAnswer: CorrectAnswer.A,
        explanation: "AI Chatbot ตอบคำถามพนักงานเรื่องสวัสดิการ วันลา นโยบายได้ตลอด 24 ชั่วโมง",
      },
      {
        quizId: quiz3.id, sortOrder: 9,
        question: "การใช้ AI วิเคราะห์ Performance Review มีประโยชน์อย่างไร?",
        optionA: "ยกเลิกการประเมินทั้งหมด", optionB: "ลดอคติและให้ข้อมูลเชิงลึกที่เป็นกลางมากขึ้น",
        optionC: "ให้คะแนนสูงทุกคน", optionD: "ไม่มีประโยชน์",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI ช่วยวิเคราะห์ Performance Data อย่างเป็นระบบ ลด Bias ที่อาจเกิดจากผู้ประเมิน",
      },
      {
        quizId: quiz3.id, sortOrder: 10,
        question: "ขั้นตอนแรกในการนำ AI มาใช้ในงาน HR คืออะไร?",
        optionA: "ซื้อซอฟต์แวร์ทันที", optionB: "ระบุ Pain Points ของ HR ที่ AI แก้ได้และเตรียมข้อมูล",
        optionC: "เปลี่ยนระบบทั้งหมด", optionD: "ไล่ HR ออกก่อน",
        correctAnswer: CorrectAnswer.B,
        explanation: "เริ่มจากระบุปัญหาที่ AI แก้ได้จริง เตรียมข้อมูลให้พร้อม แล้วค่อย Implement ทีละขั้น",
      },
    ],
  });

  console.log(`Created course: ${course3.title}`);

  // ═══════════════════════════════════════════════════════════════════════════
  // Course 4: AI Productivity Tools
  // ═══════════════════════════════════════════════════════════════════════════
  const course4 = await prisma.course.create({
    data: {
      title: "AI Productivity Tools",
      slug: "ai-productivity-tools",
      courseCode: "AIPROD",
      description:
        "เรียนรู้การใช้เครื่องมือ AI เพื่อเพิ่มประสิทธิภาพการทำงาน ตั้งแต่ ChatGPT, Claude, Gemini ไปจนถึง AI Tools สำหรับ Presentation, Document, Data Analysis และ Creative Work",
      shortDescription:
        "ใช้ AI เพิ่ม Productivity สร้างเอกสาร Presentation วิเคราะห์ข้อมูล และงานสร้างสรรค์",
      category: "AI Productivity",
      level: CourseLevel.BEGINNER,
      duration: "6 ชั่วโมง",
      isFree: true,
      hasCertificate: true,
      instructorId: instructor.id,
      status: CourseStatus.PUBLISHED,
    },
  });

  const c4Lessons = [
    {
      title: "รู้จักเครื่องมือ AI สำหรับการทำงาน",
      description: "ภาพรวม AI Tools ที่นิยม: ChatGPT, Claude, Gemini, Copilot — เปรียบเทียบจุดเด่น",
      youtubeUrl: "https://www.youtube.com/watch?v=MnDudvCyWpc",
      lessonOrder: 1,
    },
    {
      title: "Prompt Engineering สำหรับการทำงานจริง",
      description: "เทคนิค Prompt ที่ใช้ได้จริงในงาน: เขียนอีเมล สรุปประชุม วิเคราะห์ข้อมูล",
      youtubeUrl: "https://www.youtube.com/watch?v=P4xI8JbyhTw",
      lessonOrder: 2,
    },
    {
      title: "AI สำหรับ Document & Presentation",
      description: "ใช้ AI สร้างเอกสาร รายงาน Presentation ด้วย Gamma, Beautiful.ai, Notion AI",
      youtubeUrl: "https://www.youtube.com/watch?v=2ePf9rue1Ao",
      lessonOrder: 3,
    },
    {
      title: "AI สำหรับ Data Analysis & Visualization",
      description: "วิเคราะห์ข้อมูลด้วย AI: ChatGPT Code Interpreter, Julius AI, และ Google Sheets AI",
      youtubeUrl: "https://www.youtube.com/watch?v=ad79nYk2keg",
      lessonOrder: 4,
    },
    {
      title: "สร้าง Personal AI Workflow ของคุณเอง",
      description: "ออกแบบ Workflow การทำงานที่ผสม AI Tools หลายตัวเข้าด้วยกัน เพิ่ม Productivity 10x",
      youtubeUrl: "https://www.youtube.com/watch?v=mJeNghZXtMo",
      lessonOrder: 5,
    },
  ];

  for (const lesson of c4Lessons) {
    await prisma.lesson.create({ data: { ...lesson, courseId: course4.id } });
  }

  const quiz4 = await prisma.quiz.create({
    data: { courseId: course4.id, title: "แบบทดสอบ: AI Productivity Tools", passingScore: 70 },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz4.id, sortOrder: 1,
        question: "เครื่องมือ AI ใดเหมาะสำหรับการเขียนและสรุปเอกสาร?",
        optionA: "Midjourney", optionB: "ChatGPT หรือ Claude",
        optionC: "Canva", optionD: "Figma",
        correctAnswer: CorrectAnswer.B,
        explanation: "ChatGPT และ Claude เป็น Large Language Model ที่เก่งเรื่องการเขียน สรุป และวิเคราะห์ข้อความ",
      },
      {
        quizId: quiz4.id, sortOrder: 2,
        question: "Prompt Engineering คืออะไร?",
        optionA: "การเขียนโปรแกรม", optionB: "การออกแบบคำสั่งเพื่อให้ AI ตอบตามที่ต้องการ",
        optionC: "การสร้างโมเดล AI", optionD: "การซ่อมระบบ",
        correctAnswer: CorrectAnswer.B,
        explanation: "Prompt Engineering คือศิลปะของการเขียนคำสั่งที่ดีเพื่อให้ AI สร้างผลลัพธ์ตรงตามต้องการ",
      },
      {
        quizId: quiz4.id, sortOrder: 3,
        question: "AI Tool ใดเหมาะสำหรับสร้าง Presentation อัตโนมัติ?",
        optionA: "Excel", optionB: "Gamma.app",
        optionC: "Notepad", optionD: "Terminal",
        correctAnswer: CorrectAnswer.B,
        explanation: "Gamma.app ใช้ AI สร้าง Presentation จากข้อความได้ทันที มี Template สวยงาม",
      },
      {
        quizId: quiz4.id, sortOrder: 4,
        question: "ChatGPT Code Interpreter ใช้ทำอะไร?",
        optionA: "สร้างเว็บไซต์", optionB: "วิเคราะห์ข้อมูลและสร้างกราฟจากไฟล์ที่อัพโหลด",
        optionC: "เล่นเกม", optionD: "ส่งอีเมล",
        correctAnswer: CorrectAnswer.B,
        explanation: "Code Interpreter ช่วยวิเคราะห์ข้อมูลจากไฟล์ Excel, CSV สร้างกราฟ และเขียนโค้ดวิเคราะห์อัตโนมัติ",
      },
      {
        quizId: quiz4.id, sortOrder: 5,
        question: "ข้อใดเป็นหลักการเขียน Prompt ที่ดี?",
        optionA: "เขียนสั้นที่สุด", optionB: "ระบุบริบท บทบาท รูปแบบ และข้อจำกัดให้ชัดเจน",
        optionC: "ใช้ภาษาอังกฤษเท่านั้น", optionD: "ห้ามให้ตัวอย่าง",
        correctAnswer: CorrectAnswer.B,
        explanation: "Prompt ที่ดีระบุ Context, Role, Format, Constraints เพื่อให้ AI เข้าใจต้องการ",
      },
      {
        quizId: quiz4.id, sortOrder: 6,
        question: "Notion AI ช่วยงานอะไรได้บ้าง?",
        optionA: "ตัดต่อวิดีโอ", optionB: "เขียน สรุป แปล และจัดระเบียบเอกสารใน Notion",
        optionC: "สร้าง 3D Model", optionD: "ออกแบบโลโก้",
        correctAnswer: CorrectAnswer.B,
        explanation: "Notion AI ช่วยเขียน สรุป แปล และจัดระเบียบข้อมูลภายใน Notion Workspace",
      },
      {
        quizId: quiz4.id, sortOrder: 7,
        question: "ข้อดีของการใช้ AI หลายตัวร่วมกัน (AI Workflow) คืออะไร?",
        optionA: "ทำให้สับสน", optionB: "ใช้จุดเด่นของ AI แต่ละตัวเพื่อผลลัพธ์ที่ดีที่สุด",
        optionC: "เสียเงินมากขึ้น", optionD: "ทำงานช้าลง",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI แต่ละตัวมีจุดเด่นต่างกัน การใช้ร่วมกันช่วยได้ผลลัพธ์ที่ครบถ้วนและมีคุณภาพ",
      },
      {
        quizId: quiz4.id, sortOrder: 8,
        question: "ข้อควรระวังในการใช้ AI สร้างเอกสาร?",
        optionA: "ไม่มี", optionB: "ต้องตรวจสอบความถูกต้องเสมอ เพราะ AI อาจ Hallucinate",
        optionC: "ใช้ได้เลยไม่ต้องตรวจ", optionD: "AI ถูกต้อง 100% เสมอ",
        correctAnswer: CorrectAnswer.B,
        explanation: "AI อาจสร้างข้อมูลที่ไม่ถูกต้อง (Hallucination) ต้องตรวจสอบก่อนใช้งานจริงเสมอ",
      },
      {
        quizId: quiz4.id, sortOrder: 9,
        question: "Google Sheets มีฟีเจอร์ AI ใดบ้าง?",
        optionA: "ไม่มี", optionB: "Help me organize, สร้างสูตร และวิเคราะห์ข้อมูลด้วย AI",
        optionC: "AI ตัดต่อวิดีโอ", optionD: "AI แชทกับเพื่อน",
        correctAnswer: CorrectAnswer.B,
        explanation: "Google Sheets มี AI Feature ช่วยสร้างสูตร จัดระเบียบ และวิเคราะห์ข้อมูลอัตโนมัติ",
      },
      {
        quizId: quiz4.id, sortOrder: 10,
        question: "วิธีเพิ่ม Productivity ด้วย AI ที่ดีที่สุดคือ?",
        optionA: "ใช้ AI ทุกอย่างไม่ต้องคิด", optionB: "ระบุงานซ้ำ ๆ ที่ AI ช่วยได้และสร้าง Workflow ที่เหมาะ",
        optionC: "ไม่ใช้ AI เลย", optionD: "ใช้แค่ ChatGPT อย่างเดียว",
        correctAnswer: CorrectAnswer.B,
        explanation: "ระบุงานที่ AI ช่วยได้ดี สร้าง Workflow ที่ผสม AI เข้ากับงานประจำ ทำให้ได้ผลลัพธ์ที่ดีที่สุด",
      },
    ],
  });

  console.log(`Created course: ${course4.title}`);

  // ═══════════════════════════════════════════════════════════════════════════
  // Certificate Templates
  // ═══════════════════════════════════════════════════════════════════════════
  for (const course of [course1, course2, course3, course4]) {
    await prisma.certificateTemplate.create({
      data: {
        courseId: course.id,
        signerName: "ผศ.ดร.ธรรมรัตน์ พลอยเพ็ชร์",
        signerTitle: "คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
      },
    });
  }
  console.log("Created certificate templates for all courses.");

  // ═══════════════════════════════════════════════════════════════════════════
  // Testimonials
  // ═══════════════════════════════════════════════════════════════════════════
  await prisma.testimonial.createMany({
    data: [
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
        message: "คอร์สเรียนฟรีแต่คุณภาพดีมาก เนื้อหาอัปเดตตามเทรนด์ AI ใหม่ ๆ แนะนำเลยค่ะ",
        isActive: true,
        sortOrder: 3,
      },
    ],
  });
  console.log("Created testimonials.");

  // ═══════════════════════════════════════════════════════════════════════════
  // FAQs
  // ═══════════════════════════════════════════════════════════════════════════
  await prisma.fAQ.createMany({
    data: [
      {
        question: "คอร์สเรียนนี้ฟรีจริงหรือ?",
        answer: "ใช่ครับ คอร์สทั้งหมดเรียนฟรี 100% ไม่มีค่าใช้จ่ายใด ๆ รวมถึงใบประกาศนียบัตรด้วย",
        sortOrder: 1, isActive: true,
      },
      {
        question: "ต้องมีพื้นฐาน AI มาก่อนไหม?",
        answer: "ไม่จำเป็นครับ คอร์สออกแบบมาสำหรับผู้เริ่มต้น อธิบายเข้าใจง่าย มีตัวอย่างจริง",
        sortOrder: 2, isActive: true,
      },
      {
        question: "ได้ใบประกาศนียบัตรอย่างไร?",
        answer: "เรียนบทเรียนครบทุกบทและทำแบบทดสอบผ่าน 70% ขึ้นไป ระบบจะออกใบประกาศนียบัตรอัตโนมัติ สามารถดาวน์โหลดเป็น PDF ได้",
        sortOrder: 3, isActive: true,
      },
      {
        question: "เรียนได้กี่ครั้ง?",
        answer: "เรียนซ้ำได้ไม่จำกัด สามารถย้อนกลับไปดูบทเรียนเก่า ๆ ได้ตลอด",
        sortOrder: 4, isActive: true,
      },
      {
        question: "ใช้เวลาเรียนนานเท่าไหร่?",
        answer: "แต่ละคอร์สใช้เวลาประมาณ 6-8 ชั่วโมง สามารถเรียนตามจังหวะของตัวเองได้",
        sortOrder: 5, isActive: true,
      },
    ],
  });
  console.log("Created FAQs.");

  // ═══════════════════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("\nSeed completed successfully!");
  console.log("─────────────────────────────────────");
  console.log(`Admin:  ${admin.email}`);
  console.log(`Courses:`);
  console.log(`  1. ${course1.title} (${course1.courseCode})`);
  console.log(`  2. ${course2.title} (${course2.courseCode})`);
  console.log(`  3. ${course3.title} (${course3.courseCode})`);
  console.log(`  4. ${course4.title} (${course4.courseCode})`);
  console.log("─────────────────────────────────────");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
