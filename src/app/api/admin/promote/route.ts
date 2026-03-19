import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== 'spubus2024') {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
  }
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const user = await db.user.findFirst({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: `User ${email} not found` }, { status: 404 })
  }

  await db.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } })
  return NextResponse.json({ success: true, message: `${email} is now ADMIN!` })
}
