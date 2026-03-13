import db from '@/lib/db'

/**
 * Generate a unique certificate code
 * Format: SPUBUS-COURSECODE-YEAR-NNNN
 */
export async function generateCertificateCode(courseCode: string): Promise<string> {
  const settings = await db.certificateSettings.findFirst()
  const prefix = settings?.certificatePrefix || 'SPUBUS'
  const year = new Date().getFullYear()
  const pattern = `${prefix}-${courseCode}-${year}-`

  // Find highest existing sequence number for this course+year
  const lastCert = await db.certificate.findFirst({
    where: { certificateCode: { startsWith: pattern } },
    orderBy: { certificateCode: 'desc' },
  })

  let nextNum = 1
  if (lastCert) {
    const parts = lastCert.certificateCode.split('-')
    const lastNum = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(lastNum)) nextNum = lastNum + 1
  }

  return `${pattern}${String(nextNum).padStart(4, '0')}`
}

/**
 * Check if user has completed all requirements for a certificate:
 * 1. All lessons completed
 * 2. Quiz passed (if course has quizzes)
 * 3. Progress = 100%
 */
export async function checkCourseCompletion(userId: string, courseId: string): Promise<boolean> {
  const [enrollment, totalLessons, completedLessons, quizAttempts] = await Promise.all([
    db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } }),
    db.lesson.count({ where: { courseId, isActive: true } }),
    db.lessonProgress.count({ where: { userId, lesson: { courseId }, completed: true } }),
    db.quizAttempt.findMany({
      where: { userId, quiz: { courseId } },
      select: { passed: true },
    }),
  ])

  if (!enrollment) return false
  if (totalLessons === 0) return false
  if (completedLessons < totalLessons) return false

  // Check if at least one quiz was passed (if course has quizzes)
  const courseQuizCount = await db.quiz.count({ where: { courseId, isActive: true } })
  if (courseQuizCount > 0) {
    const hasPassedQuiz = quizAttempts.some(a => a.passed)
    if (!hasPassedQuiz) return false
  }

  return true
}

/**
 * Generate certificate for a user after course completion.
 * Returns existing certificate if already issued.
 * Returns null if requirements are not met.
 */
export async function generateCertificate(userId: string, courseId: string) {
  // Check if certificate already exists
  const existing = await db.certificate.findFirst({
    where: { userId, courseId },
  })
  if (existing) return existing

  // Verify course allows certificates
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { courseCode: true, hasCertificate: true },
  })
  if (!course || !course.hasCertificate) return null

  // Check completion
  const isComplete = await checkCourseCompletion(userId, courseId)
  if (!isComplete) return null

  // Generate code and create certificate in a transaction
  const certificateCode = await generateCertificateCode(course.courseCode)

  const settings = await db.certificateSettings.findFirst()
  const baseUrl = settings?.verificationBaseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-academy-lime.vercel.app'
  const verificationUrl = `${baseUrl}/verify/${certificateCode}`

  const certificate = await db.$transaction(async (tx) => {
    // Double-check no duplicate inside transaction
    const doubleCheck = await tx.certificate.findFirst({
      where: { userId, courseId },
    })
    if (doubleCheck) return doubleCheck

    // Update enrollment status
    await tx.enrollment.updateMany({
      where: { userId, courseId },
      data: {
        status: 'COMPLETED',
        progressPercent: 100,
        completedAt: new Date(),
      },
    })

    // Create certificate
    return tx.certificate.create({
      data: {
        certificateCode,
        userId,
        courseId,
        completionDate: new Date(),
        verificationUrl,
        themeId: settings?.defaultThemeId || 'executive-navy',
      },
    })
  })

  return certificate
}
