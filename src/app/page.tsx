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
} from "lucide-react";
import { cn } from "@/lib/utils";
import db from "@/lib/db";
import CourseCard from "@/components/features/CourseCard";

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
    description: "อาจารย์และผู้เชี่ยวชาญจากคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
];

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
    { value: enrollCount > 0 ? `${enrollCount.toLocaleString()}+` : "500+", label: "ผู้เรียน" },
    { value: `${courseCount}`, label: "คอร์สเรียน" },
    { value: "95%", label: "อัตราความพึงพอใจ" },
    { value: certCount > 0 ? `${certCount.toLocaleString()}+` : "0", label: "ใบประกาศนียบัตร" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute -right-40 top-40 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-600/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
              <Sparkles className="h-4 w-4" />
              เรียนฟรี! ไม่มีค่าใช้จ่าย
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-white">เรียนรู้</span>{" "}
              <span className="gradient-text">AI สำหรับธุรกิจ</span>
              <br />
              <span className="text-white">จากมืออาชีพ</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
              แพลตฟอร์มเรียนรู้ AI สำหรับธุรกิจ โดยคณะบริหารธุรกิจ
              มหาวิทยาลัยศรีปทุม พร้อมใบประกาศนียบัตร
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/courses"
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl px-8 py-4",
                  "bg-gradient-to-r from-blue-600 to-cyan-500",
                  "text-base font-bold text-white shadow-lg shadow-blue-500/25",
                  "transition-all duration-200 hover:shadow-blue-500/40 hover:brightness-110"
                )}
              >
                เริ่มเรียนเลย
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/courses"
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl px-8 py-4",
                  "border border-white/[0.12] bg-white/[0.04] text-base font-semibold text-gray-200",
                  "transition-all duration-200 hover:bg-white/[0.08]"
                )}
              >
                <Play className="h-5 w-5" />
                ดูคอร์สทั้งหมด
              </Link>
            </div>

            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-extrabold text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              คอร์สเรียน<span className="gradient-text-blue">ยอดนิยม</span>
            </h2>
            <p className="mt-3 text-gray-400">คอร์สที่ได้รับความนิยมสูงสุดจากผู้เรียน</p>
          </div>

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

          <div className="mt-10 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              ดูคอร์สทั้งหมด
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="border-t border-white/[0.04] bg-[#0a0f1a] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              ทำไมต้องเรียนกับ{" "}
              <span className="gradient-text-blue">AI Business Academy</span>
            </h2>
            <p className="mt-3 text-gray-400">ออกแบบหลักสูตรโดยผู้เชี่ยวชาญ เพื่อคนทำธุรกิจตัวจริง</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className={cn(
                  "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6",
                  "transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
                )}
              >
                <div className={cn("mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl", f.bgColor)}>
                  <f.icon className={cn("h-6 w-6", f.color)} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="border-t border-white/[0.04] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                เสียงจาก<span className="gradient-text-purple">ผู้เรียน</span>
              </h2>
              <p className="mt-3 text-gray-400">ความคิดเห็นจากผู้เรียนที่ผ่านคอร์สของเรา</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className={cn(
                    "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6",
                    "transition-all duration-300 hover:border-white/[0.12]"
                  )}
                >
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-gray-300">&ldquo;{t.message}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role} · {t.companyOrStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="border-t border-white/[0.04] bg-[#0a0f1a] py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                คำถามที่<span className="gradient-text-blue">พบบ่อย</span>
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.id} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left text-base font-semibold text-white">
                    {faq.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-5 text-sm leading-relaxed text-gray-400">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-white/[0.04] py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className={cn("rounded-3xl border border-white/[0.06] p-12", "bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-cyan-600/10")}>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">พร้อมที่จะเริ่มต้นแล้วหรือยัง?</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">สมัครเรียนฟรีวันนี้ เรียนรู้ AI สำหรับธุรกิจ พร้อมรับใบประกาศนียบัตร</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl px-8 py-4",
                  "bg-gradient-to-r from-blue-600 to-cyan-500",
                  "text-base font-bold text-white shadow-lg shadow-blue-500/25",
                  "transition-all duration-200 hover:shadow-blue-500/40 hover:brightness-110"
                )}
              >
                เริ่มเรียนเลย
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/courses" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
                ดูคอร์สก่อน &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
