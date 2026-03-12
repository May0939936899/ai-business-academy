import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/stats - Dashboard stats (admin only)
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ไม่ได้เข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "ไม่มีสิทธิ์เข้าถึง" },
        { status: 403 }
      );
    }

    // Run all queries in parallel
    const [
      totalStudents,
      totalCourses,
      totalEnrollments,
      totalCertificates,
      completedEnrollments,
    ] = await Promise.all([
      db.user.count({
        where: { role: "STUDENT" },
      }),
      db.course.count({
        where: { status: "PUBLISHED" },
      }),
      db.enrollment.count(),
      db.certificate.count(),
      db.enrollment.count({
        where: { status: "COMPLETED" },
      }),
    ]);

    const completionRate =
      totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100 * 10) / 10
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalCertificates,
        completionRate,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ",
      },
      { status: 500 }
    );
  }
}
