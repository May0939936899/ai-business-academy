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

// GET /api/admin/content/testimonials — List all testimonials
export async function GET() {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const testimonials = await db.testimonial.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ success: true, data: testimonials })
  } catch (error) {
    console.error('Admin testimonials list error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว' },
      { status: 500 }
    )
  }
}

const createTestimonialSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อ'),
  role: z.string().min(1, 'กรุณาระบุตำแหน่ง'),
  companyOrStatus: z.string().min(1, 'กรุณาระบุบริษัท/สถานะ'),
  message: z.string().min(1, 'กรุณาระบุข้อความรีวิว'),
  avatarUrl: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().optional(),
})

// POST /api/admin/content/testimonials — Create testimonial
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const body = await request.json()
    const parsed = createTestimonialSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Get next sort order if not provided
    let sortOrder = data.sortOrder
    if (sortOrder === undefined) {
      const last = await db.testimonial.findFirst({
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      })
      sortOrder = (last?.sortOrder || 0) + 1
    }

    const testimonial = await db.testimonial.create({
      data: {
        name: data.name,
        role: data.role,
        companyOrStatus: data.companyOrStatus,
        message: data.message,
        avatarUrl: data.avatarUrl || null,
        isActive: data.isActive,
        sortOrder,
      },
    })

    return NextResponse.json(
      { success: true, data: testimonial, message: 'เพิ่มรีวิวสำเร็จ' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create testimonial error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการสร้างรีวิว' },
      { status: 500 }
    )
  }
}
