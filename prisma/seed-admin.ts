import { PrismaClient, CourseLevel, CourseStatus, CorrectAnswer } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Seeding admin account and demo data...")

  // ─── 1. Create Admin Account ────────────────────────────────────────────────
  const adminEmail = "admin@ai-academy.com"
  const adminPassword = "Admin1234"
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: "ADMIN",
      fullName: "Admin",
      status: "ACTIVE",
    },
    create: {
      email: adminEmail,
      fullName: "Admin",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  })
  console.log(`✅ Admin account created: ${admin.email} (ID: ${admin.id})`)

  // ─── 2. Create Demo Course ──────────────────────────────────────────────────
  const course = await prisma.course.upsert({
    where: { slug: "ai-for-business-automation" },
    update: {},
    create: {
      title: "AI for Business Automation",
      slug: "ai-for-business-automation",
      courseCode: "SPUBUS-AIHR-2026",
      description:
        "Learn how to leverage AI tools and techniques to automate business processes. This comprehensive course covers everything from basic AI concepts to implementing real-world automation solutions using ChatGPT, Zapier, and custom AI workflows.",
      shortDescription:
        "Master AI-powered business automation with practical hands-on projects",
      category: "AI & Automation",
      level: CourseLevel.BEGINNER,
      duration: "6 hours",
      status: CourseStatus.PUBLISHED,
      thumbnail: "/images/courses/ai-automation.jpg",
      instructorId: admin.id,
    },
  })
  console.log(`✅ Demo course created: ${course.title} (ID: ${course.id})`)

  // ─── 3. Create 3 Lessons ───────────────────────────────────────────────────
  const lessons = [
    {
      title: "Introduction to AI in Business",
      description:
        "Understand the fundamentals of Artificial Intelligence and how it transforms modern business operations. Learn key concepts like machine learning, natural language processing, and computer vision.",
      youtubeUrl: "https://www.youtube.com/watch?v=2ePf9rue1Ao",
      lessonOrder: 1,
      summary:
        "This lesson covers AI fundamentals including ML, NLP, and computer vision applications in business contexts.",
    },
    {
      title: "Automating Workflows with ChatGPT",
      description:
        "Learn practical techniques for using ChatGPT to automate repetitive business tasks. Create prompts for email drafting, data analysis, report generation, and customer support.",
      youtubeUrl: "https://www.youtube.com/watch?v=jHv63Uvk5VA",
      lessonOrder: 2,
      summary:
        "Hands-on guide to automating business workflows using ChatGPT including email, analysis, and support tasks.",
    },
    {
      title: "Building AI-Powered Automation Pipelines",
      description:
        "Design and implement end-to-end automation pipelines using tools like Zapier, Make, and Python. Connect AI models to business applications for seamless workflow automation.",
      youtubeUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
      lessonOrder: 3,
      summary:
        "Advanced lesson on building complete automation pipelines integrating AI models with business tools.",
    },
  ]

  for (const lesson of lessons) {
    const existing = await prisma.lesson.findFirst({
      where: { courseId: course.id, lessonOrder: lesson.lessonOrder },
    })
    if (!existing) {
      await prisma.lesson.create({
        data: {
          courseId: course.id,
          ...lesson,
        },
      })
    }
  }
  console.log(`✅ 3 demo lessons created`)

  // ─── 4. Create Quiz with 5 Questions ───────────────────────────────────────
  let quiz = await prisma.quiz.findFirst({
    where: { courseId: course.id },
  })

  if (!quiz) {
    quiz = await prisma.quiz.create({
      data: {
        courseId: course.id,
        title: "AI for Business Automation - Final Quiz",
        passingScore: 60,
      },
    })
  }

  const questions = [
    {
      question:
        "What is the primary benefit of using AI in business automation?",
      optionA: "Replacing all human workers",
      optionB: "Reducing repetitive tasks and improving efficiency",
      optionC: "Making businesses more complex",
      optionD: "Increasing manual labor requirements",
      correctAnswer: CorrectAnswer.B,
      explanation:
        "AI in business automation primarily helps reduce repetitive tasks and improve overall operational efficiency, allowing employees to focus on higher-value work.",
      sortOrder: 1,
    },
    {
      question:
        "Which of the following is NOT a common application of ChatGPT in business?",
      optionA: "Email drafting and response",
      optionB: "Physical product manufacturing",
      optionC: "Customer support automation",
      optionD: "Report generation",
      correctAnswer: CorrectAnswer.B,
      explanation:
        "ChatGPT is a text-based AI and cannot directly perform physical manufacturing. It excels at text-related tasks like email drafting, customer support, and report generation.",
      sortOrder: 2,
    },
    {
      question: "What does NLP stand for in the context of AI?",
      optionA: "New Learning Protocol",
      optionB: "Neural Logic Processing",
      optionC: "Natural Language Processing",
      optionD: "Network Level Programming",
      correctAnswer: CorrectAnswer.C,
      explanation:
        "NLP stands for Natural Language Processing, which is the branch of AI that deals with the interaction between computers and human language.",
      sortOrder: 3,
    },
    {
      question:
        "Which tool is commonly used to create no-code automation workflows?",
      optionA: "Photoshop",
      optionB: "Zapier",
      optionC: "PowerPoint",
      optionD: "Excel",
      correctAnswer: CorrectAnswer.B,
      explanation:
        "Zapier is a popular no-code automation platform that connects different apps and services to create automated workflows without writing code.",
      sortOrder: 4,
    },
    {
      question:
        "What is the first step in implementing AI automation for a business process?",
      optionA: "Buy the most expensive AI tool",
      optionB: "Replace all employees with AI",
      optionC: "Identify repetitive tasks suitable for automation",
      optionD: "Hire an AI team immediately",
      correctAnswer: CorrectAnswer.C,
      explanation:
        "The first step is always to identify which repetitive tasks are suitable for automation. This ensures you apply AI where it will have the most impact.",
      sortOrder: 5,
    },
  ]

  for (const q of questions) {
    const existing = await prisma.quizQuestion.findFirst({
      where: { quizId: quiz.id, sortOrder: q.sortOrder },
    })
    if (!existing) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          ...q,
        },
      })
    }
  }
  console.log(`✅ 5 quiz questions created`)

  // ─── 5. Create Demo Certificate ────────────────────────────────────────────
  const certCode = "SPUBUS-AIHR-2026-0001"
  await prisma.certificate.upsert({
    where: { certificateCode: certCode },
    update: {},
    create: {
      certificateCode: certCode,
      userId: admin.id,
      courseId: course.id,
      themeId: "executive-navy",
      issuedAt: new Date(),
      completionDate: new Date(),
    },
  })
  console.log(`✅ Demo certificate created: ${certCode}`)

  console.log("\n🎉 Seed complete!")
  console.log("─────────────────────────────────")
  console.log(`Admin Username: ${adminEmail}`)
  console.log(`Admin Password: ${adminPassword}`)
  console.log(`Demo Course: ${course.title}`)
  console.log(`Certificate: ${certCode}`)
  console.log("─────────────────────────────────")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
