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

const updateTestimonialSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อ').optional(),
  role: z.string().min(1, 'กรุณาระบุตำแหน่ง').optional(),
  companyOrStatus: z.string().min(1, 'กรุณาระบุบริษัท/สถานะ').optional(),
  message: z.string().min(1, 'กรุณาระบุข้อความรีวิว').optional(),
  avatarUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

// PUT /api/admin/content/testimonials/[id] — Update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    const existing = await db.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบรีวิว' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = updateTestimonialSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const data = parsed.data

    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.companyOrStatus !== undefined && { companyOrStatus: data.companyOrStatus }),
        ...(data.message !== undefined && { message: data.message }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    })

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: 'อัพเดตรีวิวสำเร็จ',
    })
  } catch (error) {
    console.error('Update testimonial error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัพเดตรีวิว' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/content/testimonials/[id] — Delete testimonial
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    const existing = await db.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบรีวิว' },
        { status: 404 }
      )
    }

    await db.testimonial.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'ลบรีวิวสำเร็จ',
    })
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบรีวิว' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/content/testimonials/[id] — Toggle isActive
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    const existing = await db.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบรีวิว' },
        { status: 404 }
      )
    }

    const testimonial = await db.testimonial.update({
      where: { id },
      data: { isActive: !existing.isActive },
    })

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: testimonial.isActive ? 'เปิดแสดงรีวิวแล้ว' : 'ซ่อนรีวิวแล้ว',
    })
  } catch (error) {
    console.error('Toggle testimonial error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการสลับสถานะ' },
      { status: 500 }
    )
  }
}
