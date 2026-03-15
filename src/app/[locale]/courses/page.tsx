import db from "@/lib/db";
import CoursesClient from "./CoursesClient";

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { pathOrder: "asc" },
  });

  const serialized = courses.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    shortDescription: c.shortDescription,
    category: c.category,
    level: c.level,
    duration: c.duration,
    isFree: c.isFree,
    thumbnail: c.thumbnail,
    lessonCount: c._count.lessons,
    pathGroup: c.pathGroup,
  }));

  return <CoursesClient courses={serialized} />;
}
