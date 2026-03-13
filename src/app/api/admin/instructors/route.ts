import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

async function requireAdminApi() {
  const user = await getCurrentUser()
  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, error: 'ไม่ได้เข้าสู่ระบบ' },
        { status: 401 }
      ),
    }
  }
  if (user.role !== 'ADMIN') {
    return {
      error: NextResponse.json(
        { success: false, error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      ),
    }
  }
  return { user }
}

// GET /api/admin/instructors — List all instructors with their courses
export async function GET() {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const instructors = await db.instructor.findMany({
      include: {
        courses: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ success: true, data: instructors })
  } catch (error) {
    console.error('Admin instructors list error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้สอน' },
      { status: 500 }
    )
  }
}

const createInstructorSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อผู้สอน'),
  title: z.string().min(1, 'กรุณาระบุตำแหน่ง'),
  bio: z.string().nullable().optional(),
  expertise: z.array(z.string()).default([]),
  profileImage: z.string().nullable().optional(),
})

// POST /api/admin/instructors — Create a new instructor
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const body = await request.json()
    const parsed = createInstructorSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Get next sort order
    const lastInstructor = await db.instructor.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })

    const instructor = await db.instructor.create({
      data: {
        name: data.name,
        title: data.title,
        bio: data.bio || null,
        expertise: data.expertise,
        profileImage: data.profileImage || null,
        sortOrder: (lastInstructor?.sortOrder || 0) + 1,
      },
      include: {
        courses: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, data: instructor, message: 'เพิ่มผู้สอนสำเร็จ' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create instructor error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการสร้างผู้สอน' },
      { status: 500 }
    )
  }
}
