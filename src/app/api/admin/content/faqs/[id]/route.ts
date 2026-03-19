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

const updateFaqSchema = z.object({
  question: z.string().min(1, 'กรุณาระบุคำถาม').optional(),
  answer: z.string().min(1, 'กรุณาระบุคำตอบ').optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

// PUT /api/admin/content/faqs/[id] — Update FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    const existing = await db.fAQ.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ FAQ' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = updateFaqSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const data = parsed.data

    const faq = await db.fAQ.update({
      where: { id },
      data: {
        ...(data.question !== undefined && { question: data.question }),
        ...(data.answer !== undefined && { answer: data.answer }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    })

    return NextResponse.json({
      success: true,
      data: faq,
      message: 'อัพเดต FAQ สำเร็จ',
    })
  } catch (error) {
    console.error('Update FAQ error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัพเดต FAQ' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/content/faqs/[id] — Delete FAQ
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    const existing = await db.fAQ.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ FAQ' },
        { status: 404 }
      )
    }

    await db.fAQ.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'ลบ FAQ สำเร็จ',
    })
  } catch (error) {
    console.error('Delete FAQ error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบ FAQ' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/content/faqs/[id] — Toggle isActive
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    const existing = await db.fAQ.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ FAQ' },
        { status: 404 }
      )
    }

    const faq = await db.fAQ.update({
      where: { id },
      data: { isActive: !existing.isActive },
    })

    return NextResponse.json({
      success: true,
      data: faq,
      message: faq.isActive ? 'เปิดแสดง FAQ แล้ว' : 'ซ่อน FAQ แล้ว',
    })
  } catch (error) {
    console.error('Toggle FAQ error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการสลับสถานะ' },
      { status: 500 }
    )
  }
}
