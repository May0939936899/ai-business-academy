import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import ProfileCard from './ProfileCard'

export const dynamic = 'force-dynamic'

/* ── XP / Level Constants ────────────────────────────────────────────────── */

const XP_PER_LESSON = 100
const XP_PER_QUIZ_PASS = 200
const XP_PER_CERTIFICATE = 500

const LEVELS = [
  { level: 1, title: 'Beginner', minXp: 0 },
  { level: 2, title: 'Learner', minXp: 500 },
  { level: 3, title: 'Explorer', minXp: 1500 },
  { level: 4, title: 'Practitioner', minXp: 3000 },
  { level: 5, title: 'Specialist', minXp: 5000 },
  { level: 6, title: 'Expert', minXp: 8000 },
  { level: 7, title: 'Master', minXp: 12000 },
  { level: 8, title: 'Visionary', minXp: 18000 },
  { level: 9, title: 'AI Strategist', minXp: 25000 },
  { level: 10, title: 'AI Leader', minXp: 35000 },
]

function getLevelInfo(xp: number) {
  let current = LEVELS[0]
  let next = LEVELS[1]
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      current = LEVELS[i]
      next = LEVELS[i + 1] || null
      break
    }
  }
  const xpInLevel = xp - current.minXp
  const xpForNext = next ? next.minXp - current.minXp : 1
  const progress = next ? Math.min(100, Math.round((xpInLevel / xpForNext) * 100)) : 100
  return { ...current, xp, xpInLevel, xpForNext: next ? next.minXp - current.minXp : 0, progress, nextLevel: next }
}

/* ── Streak Calculation ──────────────────────────────────────────────────── */

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0

  // Get unique dates (day-level) sorted descending
  const uniqueDays = [...new Set(
    dates.map((d) => {
      const dt = new Date(d)
      dt.setHours(0, 0, 0, 0)
      return dt.getTime()
    })
  )].sort((a, b) => b - a)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayMs = today.getTime()
  const yesterdayMs = todayMs - 86400000

  // Check if most recent activity is today or yesterday
  if (uniqueDays[0] !== todayMs && uniqueDays[0] !== yesterdayMs) {
    return 0
  }

  let streak = 1
  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = uniqueDays[i - 1] - uniqueDays[i]
    if (diff === 86400000) {
      streak++
    } else {
      break
    }
  }
  return streak
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function ProfilePage() {
  const user = await getCurrentUser()
  const locale = await getLocale()

  if (!user) redirect(`/${locale}/login`)

  // Fetch all data in parallel
  const [
    fullUser,
    lessonsCompleted,
    quizzesPassed,
    certificates,
    enrollments,
    recentActivity,
  ] = await Promise.all([
    db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        fullName: true,
        fullNameForCertificate: true,
        email: true,
        image: true,
        country: true,
        organization: true,
        position: true,
        interestArea: true,
        learningGoal: true,
        role: true,
        createdAt: true,
      },
    }),
    db.lessonProgress.count({
      where: { userId: user.id, completed: true },
    }),
    db.quizAttempt.count({
      where: { userId: user.id, passed: true },
    }),
    db.certificate.findMany({
      where: { userId: user.id },
      include: {
        course: { select: { title: true, category: true, slug: true } },
      },
      orderBy: { issuedAt: 'desc' },
    }),
    db.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            title: true,
            category: true,
            slug: true,
            _count: { select: { lessons: true } },
          },
        },
      },
    }),
    // Get recent lesson views for streak
    db.lessonProgress.findMany({
      where: { userId: user.id },
      select: { lastViewedAt: true, completedAt: true },
      orderBy: { lastViewedAt: 'desc' },
      take: 365,
    }),
  ])

  if (!fullUser) redirect(`/${locale}/login`)

  // ── Calculate XP ──
  const totalXp =
    lessonsCompleted * XP_PER_LESSON +
    quizzesPassed * XP_PER_QUIZ_PASS +
    certificates.length * XP_PER_CERTIFICATE

  const levelInfo = getLevelInfo(totalXp)

  // ── Calculate Streak ──
  const activityDates = recentActivity
    .map((r) => r.completedAt || r.lastViewedAt)
    .filter(Boolean) as Date[]
  const streak = calculateStreak(activityDates)

  // ── Calculate overall progress ──
  let totalLessons = 0
  enrollments.forEach((e) => {
    totalLessons += e.course._count.lessons
  })
  const overallProgress = totalLessons > 0
    ? Math.round((lessonsCompleted / totalLessons) * 100)
    : 0

  // ── Extract skills from enrolled course categories ──
  const skillSet = new Set<string>()
  enrollments.forEach((e) => {
    if (e.course.category) skillSet.add(e.course.category)
  })
  const skills = Array.from(skillSet)

  // ── Primary learning path (most enrolled category) ──
  const categoryCount: Record<string, number> = {}
  enrollments.forEach((e) => {
    const cat = e.course.category
    categoryCount[cat] = (categoryCount[cat] || 0) + 1
  })
  const primaryPath = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  // ── Student ID ──
  const cert = certificates[0]
  const studentId = cert
    ? cert.certificateCode.replace(/-\d{4}$/, '')
    : `SPUBUS-AI-${new Date().getFullYear()}-${String(fullUser.id.slice(-5)).toUpperCase()}`

  // ── Build card data ──
  const cardData = {
    name: fullUser.fullNameForCertificate || fullUser.fullName,
    email: fullUser.email,
    image: fullUser.image,
    position: fullUser.position,
    organization: fullUser.organization,
    country: fullUser.country,
    role: fullUser.role,
    level: levelInfo.level,
    levelTitle: levelInfo.title,
    levelProgress: levelInfo.progress,
    xp: totalXp,
    xpForNext: levelInfo.xpForNext,
    xpInLevel: levelInfo.xpInLevel,
    nextLevelTitle: levelInfo.nextLevel?.title || null,
    certificateCount: certificates.length,
    courseCount: enrollments.length,
    streak,
    overallProgress: Math.min(overallProgress, 100),
    skills,
    primaryPath,
    studentId,
    lessonsCompleted,
    quizzesPassed,
    memberSince: fullUser.createdAt.toISOString(),
    certificates: certificates.map((c) => ({
      code: c.certificateCode,
      course: c.course.title,
      category: c.course.category,
    })),
    locale,
  }

  return <ProfileCard data={cardData} />
}
