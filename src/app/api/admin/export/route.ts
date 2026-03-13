import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import db from "@/lib/db"
import * as XLSX from "xlsx"

// ─── Helper ──────────────────────────────────────────────────────────────────

function formatDate(d: Date | null | undefined): string {
  if (!d) return ""
  return new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatDateTime(d: Date | null | undefined): string {
  if (!d) return ""
  return new Date(d).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ─── Auth Check ──────────────────────────────────────────────────────────────

async function requireAdminApi() {
  const user = await getCurrentUser()
  if (!user) return { error: "Unauthorized", status: 401 }
  if (user.role !== "ADMIN") return { error: "Forbidden", status: 403 }
  return { user }
}

// ─── Data Fetchers ───────────────────────────────────────────────────────────

async function exportUsers() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true, certificates: true } },
    },
  })

  return users.map((u, i) => ({
    "#": i + 1,
    "ชื่อ-นามสกุล": u.fullName,
    "อีเมล": u.email,
    "สถานะ": u.status === "ACTIVE" ? "Active" : "Suspended",
    "บทบาท": u.role,
    "คอร์สที่ลงทะเบียน": u._count.enrollments,
    "Certificate": u._count.certificates,
    "เข้าสู่ระบบล่าสุด": formatDateTime(u.lastLoginAt),
    "วันที่สมัคร": formatDate(u.createdAt),
  }))
}

async function exportCourses() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { lessons: true, enrollments: true, quizzes: true, certificates: true } },
      instructor: { select: { fullName: true } },
    },
  })

  return courses.map((c, i) => ({
    "#": i + 1,
    "ชื่อคอร์ส": c.title,
    "รหัสคอร์ส": c.courseCode,
    "หมวดหมู่": c.category,
    "ระดับ": c.level,
    "ระยะเวลา": c.duration || "-",
    "สถานะ": c.status,
    "ผู้สอน": c.instructor?.fullName || "-",
    "จำนวนบทเรียน": c._count.lessons,
    "จำนวนนักเรียน": c._count.enrollments,
    "จำนวน Quiz": c._count.quizzes,
    "จำนวน Certificate": c._count.certificates,
    "วันที่สร้าง": formatDate(c.createdAt),
  }))
}

async function exportCertificates() {
  const certificates = await db.certificate.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      user: { select: { fullName: true, email: true } },
      course: { select: { title: true, courseCode: true } },
    },
  })

  return certificates.map((c, i) => ({
    "#": i + 1,
    "Certificate ID": c.certificateCode,
    "ชื่อนักเรียน": c.user.fullName,
    "อีเมล": c.user.email,
    "ชื่อคอร์ส": c.course.title,
    "รหัสคอร์ส": c.course.courseCode,
    "ธีม": c.themeId,
    "วันที่เรียนจบ": formatDate(c.completionDate),
    "วันที่ออก Certificate": formatDate(c.issuedAt),
  }))
}

async function exportEnrollments() {
  const enrollments = await db.enrollment.findMany({
    orderBy: { enrolledAt: "desc" },
    include: {
      user: { select: { fullName: true, email: true } },
      course: { select: { title: true, courseCode: true } },
    },
  })

  return enrollments.map((e, i) => ({
    "#": i + 1,
    "ชื่อนักเรียน": e.user.fullName,
    "อีเมล": e.user.email,
    "ชื่อคอร์ส": e.course.title,
    "รหัสคอร์ส": e.course.courseCode,
    "ความคืบหน้า (%)": Math.round(e.progressPercent),
    "สถานะ": e.status,
    "วันที่ลงทะเบียน": formatDate(e.enrolledAt),
    "วันที่เรียนจบ": formatDate(e.completedAt),
  }))
}

async function exportQuizAttempts() {
  const attempts = await db.quizAttempt.findMany({
    orderBy: { attemptedAt: "desc" },
    include: {
      user: { select: { fullName: true, email: true } },
      quiz: {
        select: {
          title: true,
          passingScore: true,
          course: { select: { title: true } },
        },
      },
    },
  })

  return attempts.map((a, i) => ({
    "#": i + 1,
    "ชื่อนักเรียน": a.user.fullName,
    "อีเมล": a.user.email,
    "ชื่อ Quiz": a.quiz.title,
    "คอร์ส": a.quiz.course.title,
    "คะแนน (%)": a.score,
    "เกณฑ์ผ่าน (%)": a.quiz.passingScore,
    "ผลลัพธ์": a.passed ? "ผ่าน ✓" : "ไม่ผ่าน ✗",
    "วันที่ทำ": formatDateTime(a.attemptedAt),
  }))
}

async function exportAll() {
  const [users, courses, certificates, enrollments, quizAttempts] =
    await Promise.all([
      exportUsers(),
      exportCourses(),
      exportCertificates(),
      exportEnrollments(),
      exportQuizAttempts(),
    ])

  return { users, courses, certificates, enrollments, quizAttempts }
}

// ─── API Handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"

    let data: Record<string, unknown[]>

    switch (type) {
      case "users":
        data = { "ผู้ใช้งาน": await exportUsers() }
        break
      case "courses":
        data = { "คอร์สเรียน": await exportCourses() }
        break
      case "certificates":
        data = { "Certificate": await exportCertificates() }
        break
      case "enrollments":
        data = { "การลงทะเบียน": await exportEnrollments() }
        break
      case "quiz-attempts":
        data = { "ผลสอบ Quiz": await exportQuizAttempts() }
        break
      case "all":
      default: {
        const all = await exportAll()
        data = {
          "ผู้ใช้งาน": all.users,
          "คอร์สเรียน": all.courses,
          "Certificate": all.certificates,
          "การลงทะเบียน": all.enrollments,
          "ผลสอบ Quiz": all.quizAttempts,
        }
        break
      }
    }

    // ── Build Excel workbook ──
    const wb = XLSX.utils.book_new()

    for (const [sheetName, rows] of Object.entries(data)) {
      const ws = XLSX.utils.json_to_sheet(rows as Record<string, unknown>[])

      // Auto-size columns
      const colWidths: number[] = []
      if (rows.length > 0) {
        const keys = Object.keys(rows[0] as Record<string, unknown>)
        keys.forEach((key, colIdx) => {
          let maxLen = key.length
          for (const row of rows as Record<string, unknown>[]) {
            const val = String(row[key] ?? "")
            maxLen = Math.max(maxLen, val.length)
          }
          colWidths[colIdx] = Math.min(maxLen + 2, 40)
        })
        ws["!cols"] = colWidths.map((w) => ({ wch: w }))
      }

      XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31))
    }

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10)
    const filename =
      type === "all"
        ? `AI-Academy-Report-${dateStr}.xlsx`
        : `AI-Academy-${type}-${dateStr}.xlsx`

    return new NextResponse(buf, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { success: false, error: "Export failed" },
      { status: 500 }
    )
  }
}
