import Link from "next/link";
import {
  ArrowRight,
  Play,
  BookOpen,
  Award,
  Users,
  Zap,
  Brain,
  Sparkles,
  Star,
  Globe,
  Clock,
  ChevronDown,
  GraduationCap,
  BarChart2,
  Megaphone,
  Bot,
  Lightbulb,
  PenTool,
  Presentation,
  Wrench,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import db from "@/lib/db";
import CourseCard from "@/components/features/CourseCard";

/* ── Static Data ─────────────────────────────────────────── */

const features = [
  {
    icon: Brain,
    title: "เนื้อหาทันสมัย",
    description: "อัปเดตเทคโนโลยี AI ล่าสุด เรียนรู้เครื่องมือที่ใช้งานจริง",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Award,
    title: "ใบประกาศนียบัตร",
    description: "ได้รับใบ Certificate ที่สามารถตรวจสอบได้จริงหลังเรียนจบ",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Globe,
    title: "เรียนฟรี 100%",
    description: "คอร์สทั้งหมดเรียนฟรี ไม่มีค่าใช้จ่ายใดๆ ตลอดการเรียน",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Clock,
    title: "เรียนได้ทุกที่ทุกเวลา",
    description: "เรียนออนไลน์ผ่านวิดีโอ เข้าเรียนซ้ำได้ไม่จำกัด",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Zap,
    title: "ลงมือปฏิบัติจริง",
    description: "Workshop และ Case Study จากธุรกิจจริง ไม่ใช่แค่ทฤษฎี",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Users,
    title: "สอนโดยผู้เชี่ยวชาญ",
    description:
      "อาจารย์และผู้เชี่ยวชาญจากคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
];

const placeholderCourses = [
  {
    icon: Users,
    title: "AI for HR",
    description: "ใช้ AI เพิ่มประสิทธิภาพงาน HR ตั้งแต่สรรหาถึงพัฒนาบุคลากร",
    level: "เริ่มต้น",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    icon: Megaphone,
    title: "AI Marketing Strategy",
    description:
      "วางแผนการตลาดด้วย AI วิเคราะห์ข้อมูลลูกค้าและสร้าง Content อัตโนมัติ",
    level: "เริ่มต้น",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: Bot,
    title: "AI Automation for Business",
    description: "ออกแบบ Workflow อัตโนมัติด้วย AI ลดงานซ้ำ เพิ่มผลลัพธ์",
    level: "ปานกลาง",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Lightbulb,
    title: "AI Productivity for Modern Work",
    description:
      "เพิ่ม Productivity ในทุกวันทำงานด้วยเครื่องมือ AI ที่ใช้ได้ทันที",
    level: "เริ่มต้น",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    icon: PenTool,
    title: "Prompt Design for Business",
    description:
      "เขียน Prompt อย่างมืออาชีพ ดึงศักยภาพ AI ให้ได้ผลลัพธ์ตรงใจ",
    level: "เริ่มต้น",
    gradient: "from-rose-500 to-pink-400",
  },
  {
    icon: Presentation,
    title: "AI Presentation & Communication",
    description:
      "สร้างงานนำเสนอและสื่อสารอย่างมืออาชีพด้วยพลัง AI",
    level: "เริ่มต้น",
    gradient: "from-indigo-500 to-violet-400",
  },
  {
    icon: Wrench,
    title: "AI Tools for Managers",
    description:
      "เครื่องมือ AI ที่ผู้บริหารต้องรู้ ตัดสินใจแม่นยำ บริหารทีมได้ดีขึ้น",
    level: "ปานกลาง",
    gradient: "from-sky-500 to-blue-400",
  },
];

/* ── Page Component ──────────────────────────────────────── */

export default async function HomePage() {
  const [courses, testimonials, faqs, countData] = await Promise.all([
    db.course.findMany({
      where: { status: "PUBLISHED" },
      include: { _count: { select: { lessons: true, enrollments: true } } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.fAQ.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    Promise.all([
      db.enrollment.count(),
      db.course.count({ where: { status: "PUBLISHED" } }),
      db.certificate.count(),
    ]),
  ]);

  const [enrollCount, courseCount, certCount] = countData;

  const stats = [
    {
      value: enrollCount > 0 ? `${enrollCount.toLocaleString()}+` : "500+",
      label: "ผู้เรียนทั้งหมด",
    },
    { value: `${courseCount}`, label: "คอร์สเรียน" },
    { value: "95%", label: "อัตราความพึงพอใจ" },
    {
      value: certCount > 0 ? `${certCount.toLocaleString()}+` : "0",
      label: "ใบประกาศนียบัตร",
    },
  ];

  const hasCourses = courses.length > 0;

  return (
    <>
      {/* ================================================================
          HERO  — Split white / dark
          ================================================================ */}
      <section className="relative overflow-hidden">
        {/* Split background */}
        <div className="pointer-events-none absolute inset-0">
          {/* Left: light */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-white max-lg:hidden" />
          {/* Right: dark */}
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[#0e0e0e] max-lg:hidden" />
          {/* Mobile: full dark */}
          <div className="absolute inset-0 bg-[#0e0e0e] lg:hidden" />
        </div>

        {/* Decorative blurs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-20 h-[420px] w-[420px] rounded-full bg-[#2196F3]/8 blur-[120px]" />
          <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-[#E91E8C]/6 blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 h-[250px] w-[500px] rounded-full bg-[#4FC3F7]/6 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[85vh] items-center gap-12 py-20 lg:grid-cols-2 lg:gap-0 lg:py-0">
            {/* ── Left Column ── */}
            <div className="relative z-10 lg:pr-16 lg:py-32">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#2196F3]/30 bg-[#2196F3]/10 px-4 py-2 text-sm font-semibold text-[#4FC3F7] lg:border-[#2196F3]/20 lg:bg-[#2196F3]/5 lg:text-[#2196F3]">
                <Sparkles className="h-4 w-4" />
                SPU BUS &middot; เรียนฟรี 100%
              </div>

              <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
                <span className="text-white lg:text-[#1a1a1a]">AI Business</span>
                <br />
                <span className="bg-gradient-to-r from-[#2196F3] to-[#4FC3F7] bg-clip-text text-transparent">
                  Academy
                </span>
              </h1>

              <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-400 lg:text-[#555]">
                เรียน AI เพื่อใช้ในงานจริง
                <br />
                <span className="text-gray-500 lg:text-[#888]">
                  โดยคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
                </span>
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-8 py-4",
                    "bg-gradient-to-r from-[#2196F3] to-[#4FC3F7]",
                    "text-base font-bold text-white shadow-xl shadow-[#2196F3]/25",
                    "transition-all duration-300 hover:shadow-[#2196F3]/40 hover:brightness-110 hover:scale-[1.02]"
                  )}
                >
                  เริ่มเรียน
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/courses"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-8 py-4",
                    "border-2 border-[#1a1a1a]/10 text-base font-semibold text-gray-300 lg:border-[#1a1a1a]/20 lg:text-[#1a1a1a]",
                    "transition-all duration-300 hover:bg-[#1a1a1a]/5"
                  )}
                >
                  <Play className="h-5 w-5" />
                  สำรวจคอร์ส
                </Link>
              </div>
            </div>

            {/* ── Right Column: Stats + Visual ── */}
            <div className="relative z-10 flex flex-col items-center justify-center lg:py-32">
              {/* Floating card visual */}
              <div className="relative mb-12 w-full max-w-md">
                {/* Main card */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-3xl p-8",
                    "border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl",
                    "shadow-2xl shadow-black/30"
                  )}
                >
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#2196F3]/10 blur-3xl" />
                  <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#E91E8C]/10 blur-3xl" />

                  <div className="relative">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2196F3] to-[#4FC3F7] shadow-lg shadow-[#2196F3]/30">
                      <GraduationCap className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">
                      พร้อมเรียนรู้ AI แล้วหรือยัง?
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400">
                      เริ่มต้นเรียนรู้ทักษะ AI ที่จำเป็นสำหรับโลกธุรกิจยุคใหม่
                      ไม่ต้องมีพื้นฐาน เรียนฟรีตลอดหลักสูตร
                    </p>

                    {/* Mini feature pills */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {["Certificate", "Workshop", "Case Study", "เรียนฟรี"].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-gray-300"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating accent card */}
                <div
                  className={cn(
                    "absolute -bottom-6 -right-4 rounded-2xl px-5 py-4",
                    "border border-white/[0.08] bg-[#1a1a2e]/90 backdrop-blur-xl",
                    "shadow-xl shadow-black/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E91E8C]/20">
                      <Award className="h-5 w-5 text-[#E91E8C]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        ใบประกาศนียบัตร
                      </p>
                      <p className="text-xs text-gray-500">
                        ตรวจสอบได้ทันที
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid w-full max-w-md grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 text-center",
                      "backdrop-blur-sm"
                    )}
                  >
                    <p className="text-2xl font-extrabold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-gray-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to dark */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </section>

      {/* ================================================================
          FEATURED COURSES
          ================================================================ */}
      <section className="relative bg-[#0a0a0a] py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2196F3]/20 bg-[#2196F3]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#4FC3F7]">
              <BookOpen className="h-3.5 w-3.5" />
              Courses
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              เริ่มต้นเรียนรู้ด้วย
              <span className="bg-gradient-to-r from-[#2196F3] to-[#4FC3F7] bg-clip-text text-transparent">
                คอร์สที่ใช่
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              คอร์สคุณภาพจากคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
              ออกแบบมาเพื่อคนทำงานตัวจริง
            </p>
          </div>

          {hasCourses ? (
            <>
              {/* Real courses from DB */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    title={course.title}
                    slug={course.slug}
                    category={course.category}
                    level={course.level}
                    duration={course.duration}
                    lessonCount={course._count.lessons}
                    description={course.description}
                    isFree={course.isFree}
                  />
                ))}
              </div>

              <div className="mt-14 text-center">
                <Link
                  href="/courses"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-8 py-3.5",
                    "border border-white/[0.08] bg-white/[0.03]",
                    "text-sm font-semibold text-gray-300",
                    "transition-all duration-300 hover:border-[#2196F3]/30 hover:bg-[#2196F3]/5 hover:text-[#4FC3F7]"
                  )}
                >
                  ดูคอร์สทั้งหมด
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Placeholder courses */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {placeholderCourses.map((course) => (
                  <div
                    key={course.title}
                    className={cn(
                      "group relative overflow-hidden rounded-3xl",
                      "border border-white/[0.06] bg-white/[0.02]",
                      "transition-all duration-300",
                      "hover:border-white/[0.12] hover:bg-white/[0.04] hover:-translate-y-1",
                      "hover:shadow-xl hover:shadow-black/20"
                    )}
                  >
                    {/* Gradient header */}
                    <div className="relative h-36 overflow-hidden">
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br opacity-90",
                          course.gradient
                        )}
                      />
                      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20" />
                      <div className="absolute -bottom-3 -left-3 h-20 w-20 rounded-full bg-white/10" />

                      {/* Icon */}
                      <div className="absolute bottom-4 left-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                          <course.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute right-3 top-3 flex gap-2">
                        <span className="rounded-full bg-green-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                          เรียนฟรี
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="mb-2 text-base font-bold text-white transition-colors group-hover:text-[#4FC3F7]">
                        {course.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
                        {course.description}
                      </p>

                      {/* Level badge */}
                      <div className="mb-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            course.level === "เริ่มต้น"
                              ? "border-green-500/30 bg-green-500/10 text-green-400"
                              : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                          )}
                        >
                          <BarChart2 className="h-3 w-3" />
                          {course.level}
                        </span>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                        <span className="text-xs text-gray-600">
                          เร็วๆ นี้
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-4 py-2",
                            "bg-gradient-to-r from-[#2196F3] to-[#4FC3F7]",
                            "text-xs font-semibold text-white",
                            "opacity-80 transition-opacity group-hover:opacity-100"
                          )}
                        >
                          ดูรายละเอียด
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-14 text-center">
                <p className="text-sm text-gray-600">
                  คอร์สใหม่กำลังมาเร็วๆ นี้ &mdash; ติดตามได้เลย
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================================================================
          WHY CHOOSE US
          ================================================================ */}
      <section className="relative border-t border-white/[0.04] bg-[#0e0e12] py-28">
        {/* Subtle top glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#2196F3]/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E91E8C]/20 bg-[#E91E8C]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#E91E8C]">
              <Target className="h-3.5 w-3.5" />
              Why Us
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              ทำไมต้องเรียนกับ{" "}
              <span className="bg-gradient-to-r from-[#2196F3] to-[#4FC3F7] bg-clip-text text-transparent">
                AI Business Academy
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-500">
              ออกแบบหลักสูตรโดยผู้เชี่ยวชาญ เพื่อคนทำธุรกิจตัวจริง
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={cn(
                  "group relative overflow-hidden rounded-3xl",
                  "border border-white/[0.06] bg-white/[0.02] p-7",
                  "transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]",
                  "hover:shadow-lg hover:shadow-black/10"
                )}
              >
                {/* Hover glow */}
                <div
                  className={cn(
                    "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
                    i % 3 === 0
                      ? "bg-blue-500/10"
                      : i % 3 === 1
                      ? "bg-purple-500/10"
                      : "bg-cyan-500/10"
                  )}
                />

                <div className="relative">
                  <div
                    className={cn(
                      "mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl",
                      f.bgColor
                    )}
                  >
                    <f.icon className={cn("h-6 w-6", f.color)} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS
          ================================================================ */}
      {testimonials.length > 0 && (
        <section className="relative border-t border-white/[0.04] bg-[#0a0a0a] py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400">
                <Star className="h-3.5 w-3.5" />
                Testimonials
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                เสียงจาก
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ผู้เรียน
                </span>
              </h2>
              <p className="mt-4 text-gray-500">
                ความคิดเห็นจากผู้เรียนที่ผ่านคอร์สของเรา
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl",
                    "border border-white/[0.06] bg-white/[0.02] p-7",
                    "transition-all duration-300 hover:border-white/[0.10] hover:bg-white/[0.04]"
                  )}
                >
                  {/* Stars */}
                  <div className="mb-5 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="mb-6 text-sm leading-relaxed text-gray-300">
                    &ldquo;{t.message}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 border-t border-white/[0.06] pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2196F3] to-[#4FC3F7] text-sm font-bold text-white">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-gray-500">
                        {t.role} &middot; {t.companyOrStatus}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          FAQ
          ================================================================ */}
      {faqs.length > 0 && (
        <section className="relative border-t border-white/[0.04] bg-[#0e0e12] py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                FAQ
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                คำถามที่
                <span className="bg-gradient-to-r from-[#2196F3] to-[#4FC3F7] bg-clip-text text-transparent">
                  พบบ่อย
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className={cn(
                    "group overflow-hidden rounded-2xl",
                    "border border-white/[0.06] bg-white/[0.02]",
                    "transition-colors duration-300 open:border-white/[0.10] open:bg-white/[0.03]"
                  )}
                >
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left text-base font-semibold text-white">
                    {faq.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-6 text-sm leading-relaxed text-gray-400">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          BOTTOM CTA
          ================================================================ */}
      <section className="relative border-t border-white/[0.04] bg-[#0a0a0a] py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div
            className={cn(
              "relative overflow-hidden rounded-[2rem] p-14",
              "border border-white/[0.06]",
              "bg-gradient-to-br from-[#2196F3]/8 via-[#E91E8C]/5 to-[#4FC3F7]/8"
            )}
          >
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#2196F3]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[#E91E8C]/10 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                พร้อมที่จะเริ่มต้นแล้วหรือยัง?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-gray-400">
                สมัครเรียนฟรีวันนี้ เรียนรู้ AI สำหรับธุรกิจ
                พร้อมรับใบประกาศนียบัตร
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-10 py-4",
                    "bg-gradient-to-r from-[#2196F3] to-[#4FC3F7]",
                    "text-base font-bold text-white shadow-xl shadow-[#2196F3]/25",
                    "transition-all duration-300 hover:shadow-[#2196F3]/40 hover:brightness-110 hover:scale-[1.02]"
                  )}
                >
                  เริ่มเรียนเลย
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/courses"
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                >
                  ดูคอร์สก่อน &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
