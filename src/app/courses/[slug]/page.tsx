import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  BarChart2,
  BookOpen,
  Award,
  Play,
  Users,
  Sparkles,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { levelLabels } from '@/lib/utils'
import EnrollButton from './EnrollButton'

interface Props {
  params: { slug: string }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = params

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      instructor: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
      lessons: {
        where: { isActive: true },
        orderBy: { lessonOrder: 'asc' },
        select: {
          id: true,
          title: true,
          lessonOrder: true,
          description: true,
        },
      },
      quizzes: {
        where: { isActive: true },
        select: { id: true },
        take: 1,
      },
      _count: {
        select: {
          enrollments: true,
          lessons: true,
        },
      },
    },
  })

  if (!course || course.status !== 'PUBLISHED') {
    notFound()
  }

  const user = await getCurrentUser()
  let enrollment = null
  if (user) {
    enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    })
  }

  const firstLesson = course.lessons[0]

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-b from-blue-600/10 via-[#0a1628]/80 to-[#030712]">
        <div className="absolute inset-0">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <Link
            href="/courses"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้าคอร์สทั้งหมด
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
              {course.category}
            </span>
            <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
              {levelLabels[course.level] || course.level}
            </span>
            {course.isFree && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                <Sparkles className="h-3 w-3" />
                เรียนฟรี
              </span>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {course.title}
          </h1>
          <p className="mb-6 max-w-3xl text-lg leading-relaxed text-gray-300">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            {course.duration && (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {course.duration}
              </span>
            )}
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {course.lessons.length} บทเรียน
            </span>
            <span className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              {levelLabels[course.level] || course.level}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {course._count.enrollments.toLocaleString()} ผู้เรียน
            </span>
            {course.hasCertificate && (
              <span className="flex items-center gap-2 text-yellow-400">
                <Award className="h-4 w-4" />
                มี Certificate
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lesson List */}
            <div>
              <h2 className="mb-5 text-xl font-bold text-white">
                เนื้อหาบทเรียน ({course.lessons.length} บท)
              </h2>
              <div className="space-y-3">
                {course.lessons.map((lesson) => (
                  <Card key={lesson.id} hover={true} className="p-0">
                    <div className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                        <Play className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-200">
                          บทที่ {lesson.lessonOrder}: {lesson.title}
                        </p>
                        {lesson.description && (
                          <p className="mt-0.5 text-sm text-gray-500">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div>
                <h2 className="mb-5 text-xl font-bold text-white">ผู้สอน</h2>
                <Card hover={false} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xl font-bold text-blue-300">
                      {course.instructor.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {course.instructor.fullName}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Right Column - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card hover={false} glow={true} className="overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-blue-600 to-cyan-500 p-6">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20" />
                    <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10" />
                  </div>
                  <div className="relative flex h-full items-center justify-center">
                    <Sparkles className="h-16 w-16 text-white/80" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 text-center">
                    <p className="text-3xl font-bold text-green-400">
                      {course.isFree ? 'ฟรี' : 'พรีเมียม'}
                    </p>
                    {course.isFree && (
                      <p className="mt-1 text-sm text-gray-500">ไม่มีค่าใช้จ่าย</p>
                    )}
                  </div>

                  <EnrollButton
                    courseId={course.id}
                    courseSlug={course.slug}
                    firstLessonId={firstLesson?.id || null}
                    isLoggedIn={!!user}
                    isEnrolled={!!enrollment}
                    enrollmentStatus={enrollment?.status || null}
                  />

                  <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">จำนวนบทเรียน</span>
                      <span className="font-medium text-gray-200">
                        {course.lessons.length} บท
                      </span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">ระยะเวลา</span>
                        <span className="font-medium text-gray-200">
                          {course.duration}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">ระดับ</span>
                      <span className="font-medium text-gray-200">
                        {levelLabels[course.level] || course.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Certificate</span>
                      <span className="font-medium text-green-400">
                        {course.hasCertificate ? 'มี' : 'ไม่มี'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">ผู้เรียนแล้ว</span>
                      <span className="font-medium text-gray-200">
                        {course._count.enrollments.toLocaleString()} คน
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
