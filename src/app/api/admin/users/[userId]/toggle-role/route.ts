import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// POST /api/admin/users/[userId]/toggle-role — Toggle user role between STUDENT and INSTRUCTOR
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'ไม่ได้เข้าสู่ระบบ' },
        { status: 401 }
      )
    }
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      )
    }

    const { userId } = await params

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบผู้ใช้งาน' },
        { status: 404 }
      )
    }

    // Don't allow toggling ADMIN users
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถเปลี่ยน role ของ Admin ได้' },
        { status: 400 }
      )
    }

    const newRole = user.role === 'STUDENT' ? 'INSTRUCTOR' : 'STUDENT'

    const updated = await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: `เปลี่ยน role เป็น ${newRole} สำเร็จ`,
    })
  } catch (error) {
    console.error('Toggle role error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
