import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const lessons = await prisma.lesson.findMany({ 
    select: { id: true, courseId: true, lessonOrder: true, title: true },
    where: { course: { status: 'PUBLISHED', courseCode: { not: { in: ['AIAUT-001', 'SPUBUS-AIHR-2026'] } } } },
    orderBy: [{ courseId: 'asc' }, { lessonOrder: 'asc' }]
  });
  console.log('ALL PUBLISHED LESSONS (main courses):');
  lessons.forEach((l: any) => console.log(`  '${l.id}', // ${l.courseId} order:${l.lessonOrder} - ${l.title}`));
  
  // SPUBUS-AIHR-2026 lessons  
  const aihrLessons = await prisma.lesson.findMany({ 
    select: { id: true, courseId: true, lessonOrder: true, title: true },
    where: { course: { courseCode: 'SPUBUS-AIHR-2026' } },
    orderBy: [{ lessonOrder: 'asc' }]
  });
  console.log('\nSPUBUS-AIHR-2026 existing lessons:');
  aihrLessons.forEach((l: any) => console.log(`  '${l.id}', // order:${l.lessonOrder} - ${l.title}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
