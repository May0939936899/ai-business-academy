import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import db from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่ได้เข้าสู่ระบบ",
        },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        fullNameForCertificate: true,
        country: true,
        organization: true,
        position: true,
        interestArea: true,
        learningGoal: true,
        image: true,
        role: true,
        isProfileCompleted: true,
        createdAt: true,
        lastLoginAt: true,
        googleId: true,
        _count: {
          select: {
            enrollments: true,
            certificates: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบข้อมูลผู้ใช้",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      },
      { status: 500 }
    );
  }
}
