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

const updateInstructorSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อผู้สอน').optional(),
  title: z.string().min(1, 'กรุณาระบุตำแหน่ง').optional(),
  bio: z.string().nullable().optional(),
  expertise: z.array(z.string()).optional(),
  profileImage: z.string().nullable().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
})

// PUT /api/admin/instructors/[id] — Update instructor
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    // Check if instructor exists
    const existing = await db.instructor.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบผู้สอน' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = updateInstructorSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const data = parsed.data

    const instructor = await db.instructor.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.expertise !== undefined && { expertise: data.expertise }),
        ...(data.profileImage !== undefined && {
          profileImage: data.profileImage,
        }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        courses: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: instructor,
      message: 'อัพเดตผู้สอนสำเร็จ',
    })
  } catch (error) {
    console.error('Update instructor error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัพเดตผู้สอน' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/instructors/[id] — Delete instructor
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminApi()
    if ('error' in auth && auth.error) return auth.error

    const { id } = await params

    // Check if instructor exists
    const existing = await db.instructor.findUnique({
      where: { id },
      include: { courses: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบผู้สอน' },
        { status: 404 }
      )
    }

    // Delete associated CourseInstructor records first (cascade should handle, but be explicit)
    await db.courseInstructor.deleteMany({
      where: { instructorId: id },
    })

    await db.instructor.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'ลบผู้สอนสำเร็จ',
    })
  } catch (error) {
    console.error('Delete instructor error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบผู้สอน' },
      { status: 500 }
    )
  }
}
