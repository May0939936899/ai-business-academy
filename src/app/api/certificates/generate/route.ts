import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { generateCertificate } from '@/lib/certificate-utils'

// POST /api/certificates/generate
// Body: { courseId: string }
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      )
    }

    const { courseId } = await request.json()
    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุ courseId' },
        { status: 400 }
      )
    }

    const certificate = await generateCertificate(user.id, courseId)

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'ยังไม่ผ่านเงื่อนไขการออก Certificate' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: certificate })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการออก Certificate' },
      { status: 500 }
    )
  }
}
