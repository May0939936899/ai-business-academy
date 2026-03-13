import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Sparkles,
} from "lucide-react";
import db from "@/lib/db";
import { cn } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

// Generate gradient based on name for consistent avatar colors
function getAvatarGradient(name: string) {
  const gradients = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-emerald-500 to-teal-400",
    "from-orange-500 to-amber-400",
    "from-rose-500 to-pink-400",
    "from-indigo-500 to-blue-400",
    "from-cyan-500 to-sky-400",
    "from-violet-500 to-purple-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function getThaiInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
  }
  return name.charAt(0);
}

export default async function InstructorDetailPage({ params }: PageProps) {
  const instructor = await db.instructor.findUnique({
    where: { id: params.id, isActive: true },
    include: {
      courses: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              shortDescription: true,
              level: true,
              category: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!instructor) {
    notFound();
  }

  const gradient = getAvatarGradient(instructor.name);
  const initials = getThaiInitials(instructor.name);
  const publishedCourses = instructor.courses.filter(
    (ci) => ci.course.status === "PUBLISHED"
  );

  const levelLabels: Record<string, string> = {
    BEGINNER: "เริ่มต้น",
    INTERMEDIATE: "ปานกลาง",
    ADVANCED: "ขั้นสูง",
  };

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Back Button */}
        <Link
          href="/instructors"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าทีมผู้สอน
        </Link>

        {/* Profile Header */}
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl",
            "border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
          )}
        >
          {/* Background accent */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent" />

          <div className="relative p-6 sm:p-10">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Large Avatar */}
              <div
                className={cn(
                  "flex h-28 w-28 shrink-0 items-center justify-center rounded-full",
                  "bg-gradient-to-br text-3xl font-bold text-white shadow-xl",
                  "ring-4 ring-white/[0.08]",
                  gradient
                )}
              >
                {initials}
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  {instructor.name}
                </h1>
                <p className="mt-1 text-base text-gray-400">
                  {instructor.title}
                </p>

                {/* Expertise Tags */}
                {instructor.expertise.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {instructor.expertise.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500 sm:justify-start">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{publishedCourses.length} หลักสูตร</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {instructor.bio && (
          <div
            className={cn(
              "mt-6 rounded-2xl",
              "border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm",
              "p-6 sm:p-8"
            )}
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <GraduationCap className="h-5 w-5 text-blue-400" />
              เกี่ยวกับผู้สอน
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-300">
                {instructor.bio}
              </p>
            </div>
          </div>
        )}

        {/* Courses Section */}
        {publishedCourses.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              หลักสูตรที่สอน
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {publishedCourses.map((ci) => (
                <Link
                  key={ci.id}
                  href={`/courses/${ci.course.slug}`}
                  className={cn(
                    "group rounded-2xl",
                    "border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm",
                    "p-5 transition-all duration-300",
                    "hover:border-white/[0.12] hover:bg-white/[0.04]",
                    "hover:shadow-lg hover:shadow-blue-500/5"
                  )}
                >
                  <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {ci.course.title}
                  </h3>
                  {ci.course.shortDescription && (
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                      {ci.course.shortDescription}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-blue-300">
                      {levelLabels[ci.course.level] || ci.course.level}
                    </span>
                    <span>{ci.course.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
