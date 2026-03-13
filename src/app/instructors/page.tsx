import Link from "next/link";
import { GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import db from "@/lib/db";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ทีมผู้สอน | AI Business Academy",
  description:
    "คณาจารย์และผู้เชี่ยวชาญจากคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
};

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

// Extract Thai initials (first char of first and last name)
function getThaiInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
  }
  return name.charAt(0);
}

export default async function InstructorsPage() {
  const instructors = await db.instructor.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      courses: {
        include: {
          course: {
            select: { title: true, slug: true },
          },
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header Section */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <GraduationCap className="h-7 w-7 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              ทีมผู้สอน
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400 sm:text-lg">
              คณาจารย์และผู้เชี่ยวชาญจากคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
            </p>
          </div>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {instructors.length === 0 ? (
          <div className="py-20 text-center">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="text-lg text-gray-400">
              ยังไม่มีข้อมูลผู้สอนในขณะนี้
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => {
              const gradient = getAvatarGradient(instructor.name);
              const initials = getThaiInitials(instructor.name);
              const courseCount = instructor.courses.length;

              return (
                <div
                  key={instructor.id}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl",
                    "border border-white/[0.06] bg-white/[0.02]",
                    "backdrop-blur-sm transition-all duration-300",
                    "hover:border-white/[0.12] hover:bg-white/[0.04]",
                    "hover:shadow-lg hover:shadow-blue-500/5"
                  )}
                >
                  <div className="p-6 sm:p-8">
                    {/* Avatar */}
                    <div className="mb-5 flex items-start gap-4">
                      <div
                        className={cn(
                          "flex h-16 w-16 shrink-0 items-center justify-center rounded-full",
                          "bg-gradient-to-br text-xl font-bold text-white shadow-lg",
                          gradient
                        )}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                          {instructor.name}
                        </h3>
                        <p className="mt-0.5 text-sm text-gray-400 line-clamp-2">
                          {instructor.title}
                        </p>
                      </div>
                    </div>

                    {/* Expertise Tags */}
                    {instructor.expertise.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {instructor.expertise.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {instructor.expertise.length > 4 && (
                          <span className="inline-flex items-center rounded-full bg-white/[0.06] px-3 py-1 text-xs text-gray-500">
                            +{instructor.expertise.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bio Preview */}
                    {instructor.bio && (
                      <p className="mb-5 text-sm leading-relaxed text-gray-400 line-clamp-3">
                        {instructor.bio}
                      </p>
                    )}

                    {/* Course count */}
                    {courseCount > 0 && (
                      <p className="mb-5 text-xs text-gray-500">
                        สอน {courseCount} หลักสูตร
                      </p>
                    )}

                    {/* Action Button */}
                    <Link
                      href={`/instructor/${instructor.id}`}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl px-5 py-2.5",
                        "bg-gradient-to-r from-blue-600 to-cyan-500",
                        "text-sm font-semibold text-white",
                        "shadow-lg shadow-blue-500/20",
                        "transition-all hover:brightness-110 hover:shadow-blue-500/30"
                      )}
                    >
                      ดูโปรไฟล์
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
