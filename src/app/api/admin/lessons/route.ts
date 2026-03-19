import { NextResponse } from 'next/server'
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

// GET /api/admin/lessons — List all lessons across all courses
export async function GET() {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const lessons = await db.lesson.findMany({
      include: {
        course: {
          select: { id: true, title: true },
        },
      },
      orderBy: [{ course: { title: 'asc' } }, { lessonOrder: 'asc' }],
    })

    return NextResponse.json({ success: true, data: lessons })
  } catch (error) {
    console.error('List all lessons error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
