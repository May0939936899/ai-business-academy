import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'ไฟล์ไม่รองรับ (JPEG, PNG, WebP, GIF เท่านั้น)' }, { status: 400 })
    }

    // Max 1MB for avatar
    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'ไฟล์ใหญ่เกินไป (สูงสุด 1MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Save to user
    await db.user.update({
      where: { id: session.user.id },
      data: { image: dataUrl },
    })

    return NextResponse.json({ success: true, url: dataUrl })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ success: false, error: 'อัพโหลดไม่สำเร็จ' }, { status: 500 })
  }
}
