import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

async function requireAdminApi() {
  const user = await getCurrentUser()
  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, error: 'ไม่ได้เข้าสู่ระบบ' },
        { status: 401 }
      ),
    }
  }
  if (user.role !== 'ADMIN') {
    return {
      error: NextResponse.json(
        { success: false, error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      ),
    }
  }
  return { user }
}

// GET /api/admin/certificates — List all certificates with optional search
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim() || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)))
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause = q
      ? {
          OR: [
            { certificateCode: { contains: q, mode: 'insensitive' as const } },
            { user: { fullName: { contains: q, mode: 'insensitive' as const } } },
            { user: { email: { contains: q, mode: 'insensitive' as const } } },
            { course: { title: { contains: q, mode: 'insensitive' as const } } },
          ],
        }
      : {}

    const [certificates, totalCount] = await Promise.all([
      db.certificate.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              image: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              courseCode: true,
            },
          },
        },
        orderBy: { issuedAt: 'desc' },
        skip,
        take: limit,
      }),
      db.certificate.count({ where: whereClause }),
    ])

    return NextResponse.json({
      success: true,
      data: certificates,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error('List certificates error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการโหลดรายการ Certificate' },
      { status: 500 }
    )
  }
}

// POST /api/admin/certificates — Manually issue a certificate
const issueCertificateSchema = z.object({
  userId: z.string().min(1, 'กรุณาระบุ userId'),
  courseId: z.string().min(1, 'กรุณาระบุ courseId'),
  themeId: z.string().optional().default('executive-navy'),
})

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const body = await request.json()
    const parsed = issueCertificateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { userId, courseId, themeId } = parsed.data

    // Verify the user and course exist
    const [user, course] = await Promise.all([
      db.user.findUnique({ where: { id: userId }, select: { id: true, fullName: true } }),
      db.course.findUnique({ where: { id: courseId }, select: { id: true, title: true, courseCode: true } }),
    ])

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบผู้ใช้' },
        { status: 404 }
      )
    }
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคอร์ส' },
        { status: 404 }
      )
    }

    // Check for duplicate
    const existing = await db.certificate.findFirst({
      where: { userId, courseId },
    })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'ผู้ใช้ได้รับ Certificate สำหรับคอร์สนี้แล้ว', data: existing },
        { status: 409 }
      )
    }

    // Generate certificate code
    const now = new Date()
    const year = now.getFullYear()

    // Get settings for prefix
    const settings = await db.certificateSettings.findUnique({
      where: { id: 'global' },
    })
    const prefix = settings?.certificatePrefix || 'SPUBUS'

    // Count existing certificates for this course to get sequence
    const existingCount = await db.certificate.count({
      where: { courseId },
    })
    const sequence = existingCount + 1

    const certificateCode = `${prefix}-${course.courseCode}-${year}-${String(sequence).padStart(4, '0')}`

    // Build verification URL
    const baseUrl = settings?.verificationBaseUrl || ''
    const verificationUrl = baseUrl ? `${baseUrl}/verify/${certificateCode}` : `/verify/${certificateCode}`

    const certificate = await db.certificate.create({
      data: {
        certificateCode,
        userId,
        courseId,
        themeId,
        issuedAt: now,
        completionDate: now,
        verificationUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            courseCode: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: certificate,
      message: `ออก Certificate สำเร็จ: ${certificateCode}`,
    })
  } catch (error) {
    console.error('Issue certificate error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการออก Certificate' },
      { status: 500 }
    )
  }
}
