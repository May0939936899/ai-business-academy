import Link from "next/link";
import Image from "next/image";
import { getTranslations, getLocale } from 'next-intl/server';
import {
  ArrowRight,
  Play,
  BookOpen,
  Award,
  Users,
  Zap,
  Sparkles,
  Star,
  Globe,
  Clock,
  ChevronDown,
  GraduationCap,
  Video,
  BarChart3,
  Shield,
  CheckCircle2,
  Quote,
  HelpCircle,
  Rocket,
  TrendingUp,
  Target,
  BrainCircuit,
} from "lucide-react";
import AIOrbitSystem from "@/components/features/AIOrbitSystem";
import { cn } from "@/lib/utils";
import db from "@/lib/db";
import CourseCard from "@/components/features/CourseCard";

/* ── Animated Orb Styles (injected via style tag) ────────────────── */
const animatedStyles = `
@keyframes float1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(0.95); }
  66% { transform: translate(20px, -40px) scale(1.1); }
}
@keyframes float3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, 40px) scale(1.08); }
}
@keyframes pulse-slow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes progress-fill-60 {
  from { width: 0%; }
  to { width: 60%; }
}
@keyframes progress-fill-20 {
  from { width: 0%; }
  to { width: 20%; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.orb-1 { animation: float1 8s ease-in-out infinite; }
.orb-2 { animation: float2 10s ease-in-out infinite; }
.orb-3 { animation: float3 12s ease-in-out infinite; }
.pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
.animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
.progress-60 { animation: progress-fill-60 2s ease-out forwards; }
.progress-20 { animation: progress-fill-20 2s ease-out forwards; }
.shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes ctaPulse {
  0%, 100% { box-shadow: 0 8px 30px rgba(59,130,246,0.3), 0 0 0 0 rgba(59,130,246,0.15); }
  50% { box-shadow: 0 8px 30px rgba(59,130,246,0.4), 0 0 0 6px rgba(59,130,246,0.05); }
}
.cta-primary {
  background: linear-gradient(135deg, #3B82F6, #60A5FA, #2563EB, #1D4ED8);
  background-size: 200% 200%;
  animation: gradientMove 6s ease infinite, ctaPulse 3s ease-in-out infinite;
}
.cta-primary:hover {
  box-shadow: 0 14px 40px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.15);
  background: linear-gradient(135deg, #60A5FA, #93C5FD, #3B82F6, #2563EB);
  background-size: 200% 200%;
  animation: gradientMove 4s ease infinite;
}
.cta-primary:active {
  transform: scale(0.97) !important;
}
.cta-primary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.35), 0 8px 30px rgba(59,130,246,0.3);
}
@keyframes heroTextShimmer {
  0% { background-position: -150% center; }
  100% { background-position: 350% center; }
}
.hero-text-shimmer {
  background: linear-gradient(
    105deg,
    #e2e8f0 0%,
    #e2e8f0 35%,
    #ffffff 42%,
    rgba(255,255,255,0.95) 44%,
    #ffffff 46%,
    rgba(255,255,255,0.9) 48%,
    #ffffff 50%,
    #e2e8f0 57%,
    #e2e8f0 100%
  );
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: heroTextShimmer 5s ease-in-out infinite;
}
`;

/* ── Static Data ─────────────────────────────────────────── */

const featureKeys = [
  { icon: BrainCircuit, key: "aiPowered", color: "from-blue-400 to-cyan-400", bg: "bg-blue-500/10" },
  { icon: Video, key: "videoLessons", color: "from-purple-400 to-pink-400", bg: "bg-purple-500/10" },
  { icon: BarChart3, key: "progressTracking", color: "from-cyan-400 to-teal-400", bg: "bg-cyan-500/10" },
  { icon: Award, key: "certificates", color: "from-yellow-400 to-orange-400", bg: "bg-yellow-500/10" },
  { icon: Users, key: "expertInstructors", color: "from-pink-400 to-rose-400", bg: "bg-pink-500/10" },
  { icon: Globe, key: "freeAccess", color: "from-green-400 to-emerald-400", bg: "bg-green-500/10" },
];

const learningPathKeys = [
  { step: 1, key: "pathStep1", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
  { step: 2, key: "pathStep2", icon: Zap, color: "from-purple-500 to-pink-500" },
  { step: 3, key: "pathStep3", icon: Target, color: "from-pink-500 to-orange-500" },
];

const hardcodedInstructors = [
  {
    id: "1",
    fullName: "ผศ.ดร.รวิภา อัครจินดานนท์",
    title: "คณบดีคณะบริหารธุรกิจ",
    expertise: ["AI Strategy", "Business Innovation"],
  },
  {
    id: "2",
    fullName: "ดร.มณฑิรา ดวงสาพล",
    title: "ผู้อำนวยการหลักสูตร MBA",
    expertise: ["AI Marketing", "Digital Transformation"],
  },
  {
    id: "3",
    fullName: "ดร.ณัฐธยาน์ ตรีผลา",
    title: "อาจารย์ประจำสาขาการตลาดดิจิทัล",
    expertise: ["AI Content", "Social Media AI"],
  },
  {
    id: "4",
    fullName: "อ.ปิยะฉัตร จันทิวา",
    title: "อาจารย์ประจำสาขาบริหารทรัพยากรมนุษย์",
    expertise: ["AI for HR", "People Analytics"],
  },
  {
    id: "5",
    fullName: "อ.พีรพัฒน์ ตระกูลสว่าง",
    title: "ผู้เชี่ยวชาญด้าน AI Automation",
    expertise: ["AI Automation", "Prompt Engineering"],
  },
  {
    id: "6",
    fullName: "ดร.สมชัย ธนะผลเลิศ",
    title: "ผู้เชี่ยวชาญ AI & Data Analytics",
    expertise: ["Data Analytics", "AI Tools"],
  },
  {
    id: "7",
    fullName: "อ.นภัสสร วิริยะกุล",
    title: "อาจารย์ประจำสาขาการจัดการ",
    expertise: ["AI Productivity", "Digital Workplace"],
  },
  {
    id: "8",
    fullName: "ดร.ภูมิพัฒน์ รัตนชัย",
    title: "ผู้เชี่ยวชาญ AI SPUBUS Strategy",
    expertise: ["AI Strategy", "Business Model"],
  },
  {
    id: "9",
    fullName: "อ.กานต์พิชชา ศรีประเสริฐ",
    title: "อาจารย์ประจำสาขาการเงิน",
    expertise: ["AI Finance", "FinTech"],
  },
];

const progressMock = [
  { name: "AI Automation for Business", percent: 60, color: "from-blue-500 to-cyan-400" },
  { name: "AI Marketing Strategy", percent: 20, color: "from-purple-500 to-pink-400" },
];

/* ── Gradient color array for instructor avatars ─────────────── */
const avatarGradients = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-400",
  "from-pink-500 to-rose-400",
  "from-cyan-500 to-teal-400",
  "from-orange-500 to-yellow-400",
  "from-green-500 to-emerald-400",
  "from-indigo-500 to-violet-400",
  "from-red-500 to-orange-400",
  "from-teal-500 to-cyan-400",
];

/* ── Helper: get initials ───────────────────────────────────── */
function getInitials(name: string): string {
  const parts = name.replace(/^(ผศ\.|ดร\.|อ\.|รศ\.|ศ\.)+\s*/g, "").split(" ");
  if (parts.length >= 2) return parts[0].charAt(0) + parts[1].charAt(0);
  return parts[0].substring(0, 2);
}

/* ── Page Component ──────────────────────────────────────── */

export default async function HomePage() {
  const t = await getTranslations('homepage');
  const tf = await getTranslations('features');
  const locale = await getLocale();

  const features = featureKeys.map(f => ({
    ...f,
    title: tf(f.key),
    description: tf(`${f.key}Desc`),
  }));

  const learningPath = learningPathKeys.map(s => ({
    ...s,
    title: t(`${s.key}Title`),
    description: t(`${s.key}Desc`),
  }));

  const [courses, instructorUsers, testimonials, faqs, countData] =
    await Promise.all([
      db.course.findMany({
        where: { status: "PUBLISHED" },
        include: {
          _count: { select: { lessons: true, enrollments: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      db.instructor.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, title: true, profileImage: true, expertise: true },
        take: 6,
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
      value: courseCount > 0 ? `${courseCount}` : "10+",
      label: t('statCourses'),
      icon: BookOpen,
    },
    {
      value: enrollCount > 0 ? `${enrollCount.toLocaleString()}+` : "500+",
      label: t('statStudents'),
      icon: Users,
    },
    {
      value: certCount > 0 ? `${certCount.toLocaleString()}+` : "100+",
      label: t('statCertificates'),
      icon: Award,
    },
    {
      value: "100%",
      label: t('statFree'),
      icon: Sparkles,
    },
  ];

  const hasCourses = courses.length > 0;

  // Use DB instructors if available, otherwise hardcoded (first 6)
  const instructors =
    instructorUsers.length > 0
      ? instructorUsers.map((u) => ({
          id: u.id,
          fullName: u.name,
          title: u.title,
          expertise: u.expertise,
          image: u.profileImage,
        }))
      : hardcodedInstructors.slice(0, 6).map((ins) => ({ ...ins, image: null as string | null }));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animatedStyles }} />

      {/* ================================================================
          1. HERO SECTION
          ================================================================ */}
      <section className="relative min-h-screen overflow-hidden bg-[#030712]">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="orb-1 absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-[#2196F3]/15 blur-[120px]" />
          <div className="orb-2 absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-[#E91E8C]/10 blur-[100px]" />
          <div className="orb-3 absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-[#4FC3F7]/10 blur-[100px]" />
          <div className="orb-2 absolute -bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-500/8 blur-[80px]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-screen items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-0">
            {/* Left: Content */}
            <div className="relative z-10 animate-slide-up">
              {/* Main Headline — uppercase, larger */}
              <h1 className="text-[48px] font-extrabold uppercase leading-[1.08] tracking-wide sm:text-[64px]">
                <span className="hero-text-shimmer inline-block bg-clip-text text-transparent">
                  AI SPUBUS
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#2196F3] via-[#4FC3F7] to-[#E91E8C] bg-clip-text text-transparent">
                  ACADEMY
                </span>
              </h1>

              {/* Tagline */}
              <p className="mt-5 text-lg font-medium text-gray-400 sm:text-xl">
                {t('tagline')}
              </p>

              {/* SPU affiliation */}
              <p className="mt-2 text-sm text-gray-500">
                {t('badge')}
              </p>

              {/* Mini feature pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { icon: Sparkles, text: t('pillFree') },
                  { icon: Award, text: t('pillCert') },
                  { icon: Video, text: t('pillVideo') },
                ].map((pill) => (
                  <div
                    key={pill.text}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-sm"
                  >
                    <pill.icon className="h-3.5 w-3.5 text-[#4FC3F7]" />
                    {pill.text}
                  </div>
                ))}
              </div>

              {/* CTAs — AI startup premium style */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/courses`}
                  className={cn(
                    "cta-primary group relative inline-flex items-center justify-center gap-3 rounded-2xl px-10 py-4",
                    "text-base font-bold text-white",
                    "transition-all duration-250 ease-out",
                    "hover:-translate-y-[3px]",
                    "active:scale-[0.97]"
                  )}
                >
                  <Rocket className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  {t('ctaStart')}
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href={`/${locale}/courses`}
                  className={cn(
                    "group inline-flex items-center justify-center gap-3 rounded-2xl px-10 py-4",
                    "border border-white/[0.18] bg-white/[0.04] backdrop-blur-sm",
                    "text-base font-semibold text-gray-300",
                    "transition-all duration-250 ease-out",
                    "hover:bg-white/[0.08] hover:border-white/[0.25] hover:text-white hover:-translate-y-[2px]",
                    "hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)]",
                    "active:scale-[0.97]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35 focus-visible:ring-offset-0"
                  )}
                >
                  <Play className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  {t('ctaViewCourses')}
                </Link>
              </div>
            </div>

            {/* Right: AI Orbit System — animated orbital hub */}
            <div className="relative z-10 flex items-center justify-center">
              <AIOrbitSystem />
            </div>
          </div>

          {/* Stats counters */}
          <div className="relative z-10 -mt-8 mb-20 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:-mt-16">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "group relative overflow-hidden rounded-2xl",
                  "border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl",
                  "px-6 py-6 text-center",
                  "transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
                )}
              >
                <div className="shimmer absolute inset-0 rounded-2xl" />
                <div className="relative">
                  <stat.icon className="mx-auto mb-3 h-5 w-5 text-[#4FC3F7]/60" />
                  <p className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-extrabold text-transparent">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-gray-500">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent" />
      </section>

      {/* ================================================================
          2. COURSES SECTION
          ================================================================ */}
      <section className="relative bg-[#030712] py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#2196F3]/20 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2196F3]/20 bg-[#2196F3]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#4FC3F7]">
              <BookOpen className="h-3.5 w-3.5" />
              Courses
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t('coursesTitle1')}
              <br />
              <span className="bg-gradient-to-r from-[#2196F3] to-[#4FC3F7] bg-clip-text text-transparent">
                {t('coursesTitle2')}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              {t('coursesDesc')}
            </p>
          </div>

          {hasCourses ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    title={course.title}
                    slug={course.slug}
                    category={course.category}
                    level={course.level}
                    duration={course.duration}
                    lessonCount={course._count.lessons}
                    shortDescription={course.shortDescription}
                    description={course.description}
                    isFree={course.isFree}
                    thumbnail={course.thumbnail}
                  />
                ))}
              </div>

              <div className="mt-14 text-center">
                <Link
                  href={`/${locale}/courses`}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full px-8 py-3.5",
                    "border border-white/[0.08] bg-white/[0.03]",
                    "text-sm font-semibold text-gray-300",
                    "transition-all duration-300 hover:border-[#2196F3]/30 hover:bg-[#2196F3]/5 hover:text-[#4FC3F7]"
                  )}
                >
                  {t('ctaViewCourses')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-500">
                {t('coursesComing')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          3. LEARNING PATH
          ================================================================ */}
      <section className="relative border-t border-white/[0.04] bg-[#030712] py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#2196F3]/5 blur-[120px]" />
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#E91E8C]/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400">
              <TrendingUp className="h-3.5 w-3.5" />
              Learning Path
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t('pathTitle1')}
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t('pathTitle2')}
              </span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line (desktop) */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#2196F3]/30 via-purple-500/30 to-[#E91E8C]/30 lg:block" />

            <div className="space-y-12 lg:space-y-24">
              {learningPath.map((step, i) => (
                <div
                  key={step.step}
                  className={cn(
                    "relative grid items-center gap-8 lg:grid-cols-2 lg:gap-16",
                    i % 2 === 1 && "lg:direction-rtl"
                  )}
                >
                  {/* Step card */}
                  <div
                    className={cn(
                      i % 2 === 1 ? "lg:order-2" : "lg:order-1"
                    )}
                  >
                    <div
                      className={cn(
                        "group relative overflow-hidden rounded-3xl",
                        "border border-white/[0.06] bg-white/[0.02] p-8",
                        "backdrop-blur-sm",
                        "transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))` }} />

                      {/* Step number */}
                      <div className="mb-6 flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-14 w-14 items-center justify-center rounded-2xl",
                            "bg-gradient-to-br shadow-lg",
                            step.color
                          )}
                        >
                          <step.icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                            Step {step.step}
                          </p>
                          <h3 className="text-xl font-bold text-white">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline node (desktop) */}
                  <div
                    className={cn(
                      "hidden lg:flex",
                      i % 2 === 1 ? "lg:order-1 lg:justify-end" : "lg:order-2 lg:justify-start"
                    )}
                  >
                    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                      <div className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-lg font-black text-white shadow-lg", step.color)}>
                        {step.step}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. PLATFORM FEATURES
          ================================================================ */}
      <section className="relative border-t border-white/[0.04] bg-[#030712] py-28">
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#4FC3F7]/5 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <Shield className="h-3.5 w-3.5" />
              Features
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t('featuresTitle1')}
              <br />
              <span className="bg-gradient-to-r from-[#2196F3] to-[#4FC3F7] bg-clip-text text-transparent">
                {t('featuresTitle2')}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-500">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={cn(
                  "group relative overflow-hidden rounded-3xl",
                  "border border-white/[0.06] bg-white/[0.02] p-8",
                  "backdrop-blur-sm",
                  "transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]",
                  "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
                )}
              >
                {/* Hover glow */}
                <div
                  className={cn(
                    "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
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
                      "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl",
                      f.bg
                    )}
                  >
                    <f.icon
                      className={cn(
                        "h-7 w-7 bg-gradient-to-r bg-clip-text",
                        f.color
                      )}
                      style={{
                        color: f.color.includes("blue")
                          ? "#60A5FA"
                          : f.color.includes("purple")
                          ? "#C084FC"
                          : f.color.includes("cyan")
                          ? "#22D3EE"
                          : f.color.includes("yellow")
                          ? "#FACC15"
                          : f.color.includes("pink")
                          ? "#F472B6"
                          : "#34D399",
                      }}
                    />
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
          5. INSTRUCTOR SECTION
          ================================================================ */}
      <section className="relative border-t border-white/[0.04] bg-[#030712] py-28">
        <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#E91E8C]/5 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E91E8C]/20 bg-[#E91E8C]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#E91E8C]">
              <Users className="h-3.5 w-3.5" />
              Instructors
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t('instructorsTitle1')}
              <span className="bg-gradient-to-r from-[#E91E8C] to-[#F472B6] bg-clip-text text-transparent">
                {t('instructorsTitle2')}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-500">
              {t('instructorsDesc')}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((inst, i) => (
              <div
                key={inst.id}
                className={cn(
                  "group relative overflow-hidden rounded-3xl",
                  "border border-white/[0.06] bg-white/[0.02] p-6",
                  "backdrop-blur-sm",
                  "transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]",
                  "hover:-translate-y-1"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar / Image */}
                  {inst.image ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/[0.08]">
                      <Image
                        src={inst.image}
                        alt={inst.fullName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-lg",
                        avatarGradients[i % avatarGradients.length]
                      )}
                    >
                      {getInitials(inst.fullName)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-white">
                      {inst.fullName}
                    </h3>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {inst.title}
                    </p>

                    {/* Expertise tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {inst.expertise.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={`/${locale}/instructors`}
              className={cn(
                "group inline-flex items-center gap-2 text-sm font-semibold text-gray-400",
                "transition-colors duration-300 hover:text-[#E91E8C]"
              )}
            >
              {t('viewAllInstructors')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          6. STUDENT PROGRESS PREVIEW
          ================================================================ */}
      <section className="relative border-t border-white/[0.04] bg-[#030712] py-28">
        <div className="pointer-events-none absolute right-1/4 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-400">
              <BarChart3 className="h-3.5 w-3.5" />
              Dashboard Preview
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t('dashboardPreviewTitle1')}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {t('dashboardPreviewTitle2')}
              </span>
              {t('dashboardPreviewTitle3')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-500">
              {t('dashboardPreviewDesc')}
            </p>
          </div>

          {/* Mock dashboard */}
          <div className="mx-auto max-w-3xl">
            <div
              className={cn(
                "relative overflow-hidden rounded-3xl",
                "border border-white/[0.06] bg-white/[0.02] p-8",
                "backdrop-blur-xl"
              )}
            >
              {/* Mock header */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    My Learning Dashboard
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white">
                    {t('dashboardMyProgress')}
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
              </div>

              {/* Progress cards */}
              <div className="space-y-6">
                {progressMock.map((item) => (
                  <div
                    key={item.name}
                    className={cn(
                      "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5",
                      "transition-all duration-300 hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">
                        {item.name}
                      </h4>
                      <span className="text-sm font-bold text-[#4FC3F7]">
                        {item.percent}%
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r",
                          item.color,
                          item.percent === 60 ? "progress-60" : "progress-20"
                        )}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {item.percent === 60
                        ? t('lessonsComplete', { done: 6, total: 10 })
                        : t('lessonsComplete', { done: 2, total: 10 })}
                    </p>
                  </div>
                ))}
              </div>

              {/* Certificate earned badge */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/20">
                  <Award className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-yellow-300">
                    {t('certEarned')}
                  </p>
                  <p className="text-xs text-yellow-500/80">
                    {t('certEarnedDesc')}
                  </p>
                </div>
                <CheckCircle2 className="ml-auto h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          7. TESTIMONIALS
          ================================================================ */}
      {testimonials.length > 0 && (
        <section className="relative border-t border-white/[0.04] bg-[#030712] py-28">
          <div className="pointer-events-none absolute left-1/3 top-0 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400">
                <Star className="h-3.5 w-3.5" />
                Testimonials
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {t('testimonialsTitle1')}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {t('testimonialsTitle2')}
                </span>
              </h2>
              <p className="mt-4 text-gray-500">
                {t('testimonialsDesc')}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl",
                    "border border-white/[0.06] bg-white/[0.02] p-8",
                    "backdrop-blur-sm",
                    "transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]",
                    "hover:-translate-y-1"
                  )}
                >
                  {/* Quote icon */}
                  <Quote className="mb-4 h-8 w-8 text-purple-500/30" />

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
                    &ldquo;{testimonial.message}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 border-t border-white/[0.06] pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">
                        {testimonial.role} &middot; {testimonial.companyOrStatus}
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
          8. CALL TO ACTION
          ================================================================ */}
      <section className="relative border-t border-white/[0.04] bg-[#030712] py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div
            className={cn(
              "relative overflow-hidden rounded-[2rem] p-14 sm:p-20",
              "border border-white/[0.06]"
            )}
          >
            {/* Background gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2196F3]/10 via-[#E91E8C]/5 to-[#4FC3F7]/10" />

            {/* Decorative orbs */}
            <div className="orb-1 pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#2196F3]/15 blur-3xl" />
            <div className="orb-2 pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[#E91E8C]/15 blur-3xl" />

            {/* Grid pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative">
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2196F3] to-[#4FC3F7] shadow-2xl shadow-[#2196F3]/30">
                <Rocket className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {t('ctaSectionTitle1')}
                <br />
                <span className="bg-gradient-to-r from-[#2196F3] to-[#4FC3F7] bg-clip-text text-transparent">
                  {t('ctaSectionTitle2')}
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-gray-400">
                {t('ctaSectionDesc')}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`/${locale}/courses`}
                  className={cn(
                    "group inline-flex items-center gap-2.5 rounded-full px-10 py-4",
                    "bg-gradient-to-r from-[#2196F3] to-[#4FC3F7]",
                    "text-base font-bold text-white shadow-2xl shadow-[#2196F3]/25",
                    "transition-all duration-300 hover:shadow-[#2196F3]/40 hover:brightness-110 hover:scale-[1.02]"
                  )}
                >
                  {t('ctaSectionButton')}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href={`/${locale}/courses`}
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                >
                  {t('ctaSectionViewFirst')} &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          9. FAQ SECTION
          ================================================================ */}
      {faqs.length > 0 && (
        <section className="relative border-t border-white/[0.04] bg-[#030712] py-28">
          <div className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#4FC3F7]/5 blur-[120px]" />

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <HelpCircle className="h-3.5 w-3.5" />
                FAQ
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {t('faqTitle1')}
                <span className="bg-gradient-to-r from-[#2196F3] to-[#4FC3F7] bg-clip-text text-transparent">
                  {t('faqTitle2')}
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
                    "backdrop-blur-sm",
                    "transition-all duration-300 open:border-white/[0.12] open:bg-white/[0.04]"
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
    </>
  );
}
