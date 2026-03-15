/**
 * Seed Runner: Add 6 new courses + update existing 6 courses with Learning Path data
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-run-new-courses.ts
 */
import { PrismaClient, CourseLevel, CourseStatus, CorrectAnswer } from "@prisma/client";
import { newCoursesPart1 } from "./seed-new-courses-1";
import { newCoursesPart2 } from "./seed-new-courses-2";
import type { NewCourseSeed } from "./seed-new-courses-1";

const db = new PrismaClient();

// ─── Learning Path data for EXISTING 6 courses ──────────────────────────────

const existingCourseUpdates: Record<string, { pathGroup: string; pathOrder: number }> = {
  "ai-for-hr":                    { pathGroup: "CORE",    pathOrder: 5 },
  "ai-automation":                { pathGroup: "APPLIED", pathOrder: 6 },
  "ai-marketing":                 { pathGroup: "CORE",    pathOrder: 3 },
  "ai-productivity-modern-work":  { pathGroup: "CORE",    pathOrder: 2 },
  "ai-analytics":                 { pathGroup: "CORE",    pathOrder: 4 },
  "ai-for-sales":                 { pathGroup: "APPLIED", pathOrder: 9 },
};

async function updateExistingCourses() {
  console.log("\n🔄 Updating existing 6 courses with Learning Path data...");
  for (const [slug, data] of Object.entries(existingCourseUpdates)) {
    try {
      await db.course.update({
        where: { slug },
        data: { pathGroup: data.pathGroup, pathOrder: data.pathOrder },
      });
      console.log(`  ✅ ${slug} → ${data.pathGroup} #${data.pathOrder}`);
    } catch (e: any) {
      console.log(`  ⚠️  ${slug} not found, skipping`);
    }
  }
}

async function seedNewCourses(courses: NewCourseSeed[]) {
  for (const c of courses) {
    console.log(`\n📚 Seeding course: ${c.title}`);

    // Upsert course
    const course = await db.course.upsert({
      where: { courseCode: c.courseCode },
      update: {
        title: c.title,
        slug: c.slug,
        description: c.description,
        shortDescription: c.shortDescription,
        category: c.category,
        level: c.level,
        duration: c.duration,
        pathGroup: c.pathGroup,
        pathOrder: c.pathOrder,
        status: CourseStatus.PUBLISHED,
      },
      create: {
        title: c.title,
        slug: c.slug,
        courseCode: c.courseCode,
        description: c.description,
        shortDescription: c.shortDescription,
        category: c.category,
        level: c.level,
        duration: c.duration,
        pathGroup: c.pathGroup,
        pathOrder: c.pathOrder,
        status: CourseStatus.PUBLISHED,
        isFree: true,
        hasCertificate: true,
      },
    });
    console.log(`  ✅ Course: ${course.id}`);

    // Create lessons + in-video quizzes
    for (const l of c.lessons) {
      const lesson = await db.lesson.upsert({
        where: { id: l.id },
        update: {
          title: l.title,
          subtitle: l.subtitle,
          description: l.description,
          youtubeUrl: l.youtubeUrl,
          videoTitle: l.videoTitle,
          videoChannel: l.videoChannel,
          durationText: l.durationText,
          lessonLevel: l.lessonLevel,
          lessonOrder: l.lessonOrder,
          summary: l.summary,
          learningOutcomes: l.learningOutcomes,
          keyTakeaways: l.keyTakeaways,
          coverImage: l.coverImage,
        },
        create: {
          id: l.id,
          courseId: course.id,
          title: l.title,
          subtitle: l.subtitle,
          description: l.description,
          youtubeUrl: l.youtubeUrl,
          videoTitle: l.videoTitle,
          videoChannel: l.videoChannel,
          durationText: l.durationText,
          lessonLevel: l.lessonLevel,
          lessonOrder: l.lessonOrder,
          summary: l.summary,
          learningOutcomes: l.learningOutcomes,
          keyTakeaways: l.keyTakeaways,
          coverImage: l.coverImage,
        },
      });
      console.log(`    📖 Lesson ${l.lessonOrder}: ${l.title}`);

      // Delete existing in-video quizzes for this lesson, then re-create
      await db.inVideoQuizQuestion.deleteMany({ where: { lessonId: lesson.id } });
      for (const q of l.inVideoQuizzes) {
        await db.inVideoQuizQuestion.create({
          data: {
            lessonId: lesson.id,
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer as CorrectAnswer,
            explanation: q.explanation,
            triggerPercent: q.triggerPercent,
            sortOrder: q.sortOrder,
          },
        });
      }
      console.log(`      🎯 ${l.inVideoQuizzes.length} in-video quizzes`);

      // Auto-generate ebook record
      await db.lessonEbook.upsert({
        where: { lessonId: lesson.id },
        update: {},
        create: {
          lessonId: lesson.id,
          title: l.title,
          subtitle: l.subtitle,
          isActive: true,
        },
      });
    }

    // Create end-of-course quiz
    const existingQuiz = await db.quiz.findFirst({ where: { courseId: course.id } });
    if (!existingQuiz) {
      const quiz = await db.quiz.create({
        data: {
          courseId: course.id,
          title: c.quiz.title,
          passingScore: c.quiz.passingScore,
          isActive: true,
        },
      });
      for (const q of c.quiz.questions) {
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
            sortOrder: q.sortOrder,
          },
        });
      }
      console.log(`  📝 Final quiz: ${c.quiz.questions.length} questions`);
    } else {
      console.log(`  📝 Quiz already exists, skipping`);
    }

    // Certificate template
    await db.certificateTemplate.upsert({
      where: { courseId: course.id },
      update: {},
      create: {
        courseId: course.id,
        signerName: "ผศ.ดร.รวิภา อัครจินดานนท์",
        signerTitle: "คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
      },
    });
    console.log(`  🏆 Certificate template ready`);
  }
}

async function main() {
  console.log("🚀 Starting seed: 6 new courses + Learning Path updates\n");

  // 1. Update existing courses with learning path
  await updateExistingCourses();

  // 2. Seed new courses
  const allNewCourses = [...newCoursesPart1, ...newCoursesPart2];
  await seedNewCourses(allNewCourses);

  // 3. Summary
  const courseCount = await db.course.count();
  const lessonCount = await db.lesson.count();
  const quizCount = await db.inVideoQuizQuestion.count();
  const ebookCount = await db.lessonEbook.count();

  console.log("\n════════════════════════════════════════");
  console.log("✅ SEED COMPLETE");
  console.log(`📚 Total Courses:        ${courseCount}`);
  console.log(`📖 Total Lessons:        ${lessonCount}`);
  console.log(`🎯 Total In-Video Quiz:  ${quizCount}`);
  console.log(`📘 Total E-Books:        ${ebookCount}`);
  console.log("════════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
