import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import db from '@/lib/db'

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { fullNameForCertificate, country, organization, position, interestArea, learningGoal } = body

    await db.user.update({
      where: { id: session.user.id },
      data: {
        fullNameForCertificate: fullNameForCertificate?.trim() || null,
        country: country?.trim() || null,
        organization: organization?.trim() || null,
        position: position?.trim() || null,
        interestArea: Array.isArray(interestArea) ? interestArea : [],
        learningGoal: learningGoal?.trim() || null,
        isProfileCompleted: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Complete profile error:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
