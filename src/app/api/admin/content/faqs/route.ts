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

// GET /api/admin/content/faqs — List all FAQs
export async function GET() {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const faqs = await db.fAQ.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ success: true, data: faqs })
  } catch (error) {
    console.error('Admin FAQs list error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูล FAQ' },
      { status: 500 }
    )
  }
}

const createFaqSchema = z.object({
  question: z.string().min(1, 'กรุณาระบุคำถาม'),
  answer: z.string().min(1, 'กรุณาระบุคำตอบ'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().optional(),
})

// POST /api/admin/content/faqs — Create FAQ
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const body = await request.json()
    const parsed = createFaqSchema.safeParse(body)

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
      const last = await db.fAQ.findFirst({
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      })
      sortOrder = (last?.sortOrder || 0) + 1
    }

    const faq = await db.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        isActive: data.isActive,
        sortOrder,
      },
    })

    return NextResponse.json(
      { success: true, data: faq, message: 'เพิ่ม FAQ สำเร็จ' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create FAQ error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการสร้าง FAQ' },
      { status: 500 }
    )
  }
}
