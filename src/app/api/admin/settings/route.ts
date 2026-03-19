import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

async function requireAdminApi() {
  const user = await getCurrentUser()
  if (!user) return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) }
  if (user.role !== 'ADMIN') return { error: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }) }
  return { user }
}

export async function GET() {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const [courses, templateCount, totalCertificates] = await Promise.all([
      db.course.findMany({
        where: { status: 'PUBLISHED' },
        include: { certificateTemplate: true },
        orderBy: { title: 'asc' },
      }),
      db.certificateTemplate.count(),
      db.certificate.count(),
    ])

    return NextResponse.json({
      success: true,
      data: { courses, templateCount, totalCertificates },
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
