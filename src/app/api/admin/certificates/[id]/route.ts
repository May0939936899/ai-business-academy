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

// GET /api/admin/certificates/[id] — Get single certificate details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    const certificate = await db.certificate.findUnique({
      where: { id },
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

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ Certificate' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: certificate,
    })
  } catch (error) {
    console.error('Get certificate error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการโหลด Certificate' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/certificates/[id] — Update certificate (reissue / regenerate QR)
const updateCertificateSchema = z.object({
  // Reissue with a new code
  reissue: z.boolean().optional(),
  // Regenerate QR code URL
  regenerateQr: z.boolean().optional(),
  // Change theme
  themeId: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    const existing = await db.certificate.findUnique({
      where: { id },
      include: {
        course: {
          select: { courseCode: true },
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ Certificate' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = updateCertificateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { reissue, regenerateQr, themeId } = parsed.data

    // Get settings for prefix and verification URL
    const settings = await db.certificateSettings.findUnique({
      where: { id: 'global' },
    })
    const prefix = settings?.certificatePrefix || 'SPUBUS'
    const baseUrl = settings?.verificationBaseUrl || ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {}

    // Reissue: generate a new certificate code
    if (reissue) {
      const now = new Date()
      const year = now.getFullYear()
      const existingCount = await db.certificate.count({
        where: { courseId: existing.courseId },
      })
      const newCode = `${prefix}-${existing.course.courseCode}-${year}-${String(existingCount + 1).padStart(4, '0')}`

      updateData.certificateCode = newCode
      updateData.issuedAt = now

      // Also update verification URL for the new code
      updateData.verificationUrl = baseUrl
        ? `${baseUrl}/verify/${newCode}`
        : `/verify/${newCode}`
    }

    // Regenerate QR code URL (refresh the verification URL)
    if (regenerateQr) {
      const code = updateData.certificateCode || existing.certificateCode
      updateData.verificationUrl = baseUrl
        ? `${baseUrl}/verify/${code}`
        : `/verify/${code}`
      // Generate new QR code URL via external service
      updateData.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        updateData.verificationUrl
      )}`
    }

    // Update theme
    if (themeId) {
      updateData.themeId = themeId
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่มีข้อมูลที่ต้องอัพเดต' },
        { status: 400 }
      )
    }

    const certificate = await db.certificate.update({
      where: { id },
      data: updateData,
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

    const actions: string[] = []
    if (reissue) actions.push('ออกรหัสใหม่')
    if (regenerateQr) actions.push('สร้าง QR ใหม่')
    if (themeId) actions.push('เปลี่ยนธีม')

    return NextResponse.json({
      success: true,
      data: certificate,
      message: `อัพเดต Certificate สำเร็จ (${actions.join(', ')})`,
    })
  } catch (error) {
    console.error('Update certificate error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัพเดต Certificate' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/certificates/[id] — Revoke / delete a certificate
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    const existing = await db.certificate.findUnique({
      where: { id },
      select: { id: true, certificateCode: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ Certificate' },
        { status: 404 }
      )
    }

    await db.certificate.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: `ลบ Certificate ${existing.certificateCode} สำเร็จ`,
    })
  } catch (error) {
    console.error('Delete certificate error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบ Certificate' },
      { status: 500 }
    )
  }
}
