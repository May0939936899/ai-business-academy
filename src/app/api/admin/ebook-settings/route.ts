import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await db.ebookSettings.upsert({
    where: { id: 'global' },
    create: {
      id: 'global',
      watermarkText: 'AI SPUBUS Academy | คณะบริหารธุรกิจ ม.ศรีปทุม',
      watermarkOpacity: 0.08,
      headerText: 'AI SPUBUS Academy',
      footerText: 'คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม',
      isWatermarkEnabled: true,
      accentColor: '#1e40af',
    },
    update: {},
  })

  return NextResponse.json({ settings })
}

export async function PUT(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const settings = await db.ebookSettings.upsert({
    where: { id: 'global' },
    create: {
      id: 'global',
      ...body,
    },
    update: {
      watermarkText: body.watermarkText,
      watermarkOpacity: body.watermarkOpacity,
      headerText: body.headerText,
      footerText: body.footerText,
      logoUrl: body.logoUrl,
      isWatermarkEnabled: body.isWatermarkEnabled,
      accentColor: body.accentColor,
    },
  })

  return NextResponse.json({ settings })
}
