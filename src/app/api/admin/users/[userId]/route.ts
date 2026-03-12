import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

async function requireAdminApi() {
  const user = await getCurrentUser()
  if (!user) {
    return { error: NextResponse.json({ success: false, error: 'ไม่ได้เข้าสู่ระบบ' }, { status: 401 }) }
  }
  if (user.role !== 'ADMIN') {
    return { error: NextResponse.json({ success: false, error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 }) }
  }
  return { user }
}

// GET /api/admin/users/[userId] — Get user details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { userId } = await params

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: { select: { title: true, slug: true } },
          },
          orderBy: { enrolledAt: 'desc' },
        },
        certificates: {
          include: {
            course: { select: { title: true } },
          },
          orderBy: { issuedAt: 'desc' },
        },
        quizAttempts: {
          include: {
            quiz: {
              select: {
                title: true,
                course: { select: { title: true } },
              },
            },
          },
          orderBy: { attemptedAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

const updateUserSchema = z.object({
  fullName: z.string().min(1).optional(),
  role: z.enum(['STUDENT', 'ADMIN', 'INSTRUCTOR']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
})

// PUT /api/admin/users/[userId] — Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { userId } = await params
    const body = await request.json()
    const parsed = updateUserSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    // Prevent self-demotion
    if (parsed.data.role && userId === auth.user!.id) {
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถเปลี่ยน role ของตัวเองได้' },
        { status: 400 }
      )
    }

    const existing = await db.user.findUnique({ where: { id: userId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      )
    }

    const user = await db.user.update({
      where: { id: userId },
      data: parsed.data,
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: 'อัปเดตผู้ใช้สำเร็จ',
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้' },
      { status: 500 }
    )
  }
}
