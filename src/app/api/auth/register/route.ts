import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, password, confirmPassword, acceptTerms } = body

    // --- Validation ---
    const errors: Record<string, string> = {}

    if (!fullName?.trim()) {
      errors.fullName = 'กรุณากรอกชื่อ-นามสกุล'
    }

    const emailTrimmed = email?.trim()?.toLowerCase()
    if (!emailTrimmed) {
      errors.email = 'กรุณากรอกอีเมล'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    }

    if (!password) {
      errors.password = 'กรุณากรอกรหัสผ่าน'
    } else if (password.length < 8) {
      errors.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'กรุณายืนยันรหัสผ่าน'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
    }

    if (!acceptTerms) {
      errors.acceptTerms = 'กรุณายอมรับเงื่อนไขการใช้งาน'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    // --- Check email uniqueness ---
    const existing = await db.user.findUnique({
      where: { email: emailTrimmed! },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, errors: { email: 'อีเมลนี้ถูกใช้งานแล้ว' } },
        { status: 400 }
      )
    }

    // --- Hash password & create user ---
    const passwordHash = await bcrypt.hash(password, 12)

    await db.user.create({
      data: {
        fullName: fullName.trim(),
        email: emailTrimmed!,
        passwordHash,
        role: 'STUDENT',
        isProfileCompleted: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
