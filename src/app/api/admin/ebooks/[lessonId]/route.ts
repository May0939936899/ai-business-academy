import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return null
  }
  return user
}

export async function GET(
  _req: Request,
  { params }: { params: { lessonId: string } }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ebook = await db.lessonEbook.findUnique({
    where: { lessonId: params.lessonId },
  })

  return NextResponse.json({ ebook })
}

export async function PUT(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const ebook = await db.lessonEbook.upsert({
    where: { lessonId: params.lessonId },
    create: {
      lessonId: params.lessonId,
      title: body.title,
      subtitle: body.subtitle,
      coverImageUrl: body.coverImageUrl,
      introduction: body.introduction,
      keyConcepts: body.keyConcepts,
      businessUseCases: body.businessUseCases,
      toolsAndTechniques: body.toolsAndTechniques,
      practicalExample: body.practicalExample,
      ebookSummary: body.ebookSummary,
      ebookKeyTakeaways: body.ebookKeyTakeaways,
      reviewQuestions: body.reviewQuestions,
      closingMessage: body.closingMessage,
      pdfUrl: body.pdfUrl,
      isActive: body.isActive ?? true,
    },
    update: {
      title: body.title,
      subtitle: body.subtitle,
      coverImageUrl: body.coverImageUrl,
      introduction: body.introduction,
      keyConcepts: body.keyConcepts,
      businessUseCases: body.businessUseCases,
      toolsAndTechniques: body.toolsAndTechniques,
      practicalExample: body.practicalExample,
      ebookSummary: body.ebookSummary,
      ebookKeyTakeaways: body.ebookKeyTakeaways,
      reviewQuestions: body.reviewQuestions,
      closingMessage: body.closingMessage,
      pdfUrl: body.pdfUrl,
      isActive: body.isActive ?? true,
    },
  })

  return NextResponse.json({ ebook })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { lessonId: string } }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.lessonEbook.deleteMany({
    where: { lessonId: params.lessonId },
  })

  return NextResponse.json({ success: true })
}
