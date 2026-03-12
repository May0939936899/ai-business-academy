import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CERTIFICATE_THEMES } from "@/lib/certificate-themes";

// GET /api/certificates/[certId] - Get certificate details (public, for verification)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certId: string }> }
) {
  try {
    const { certId } = await params;

    const certificate = await db.certificate.findUnique({
      where: { id: certId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบใบประกาศนียบัตรนี้",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("Get certificate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการดึงข้อมูลใบประกาศนียบัตร",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/certificates/[certId] - Update certificate theme
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ certId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    const { certId } = await params;
    const body = await request.json();
    const { themeId } = body;

    // Validate themeId
    if (!themeId || typeof themeId !== "string") {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุ themeId" },
        { status: 400 }
      );
    }

    const validTheme = CERTIFICATE_THEMES.find((t) => t.id === themeId);
    if (!validTheme) {
      return NextResponse.json(
        { success: false, error: "ธีมที่เลือกไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // Ensure user owns the certificate
    const certificate = await db.certificate.findFirst({
      where: { id: certId, userId: user.id },
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: "ไม่พบใบประกาศนียบัตรนี้" },
        { status: 404 }
      );
    }

    // Update theme
    const updated = await db.certificate.update({
      where: { id: certId },
      data: { themeId },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Update certificate theme error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการอัปเดตธีม",
      },
      { status: 500 }
    );
  }
}
