import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET /api/certificates/verify?code=CERT-XXXXX - Verify certificate by code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: "กรุณาระบุรหัสใบประกาศนียบัตร",
        },
        { status: 400 }
      );
    }

    const certificate = await db.certificate.findUnique({
      where: { certificateCode: code },
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
          error: "ไม่พบใบประกาศนียบัตรนี้ หรือรหัสไม่ถูกต้อง",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        certificate,
      },
      message: "ใบประกาศนียบัตรถูกต้อง",
    });
  } catch (error) {
    console.error("Verify certificate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "เกิดข้อผิดพลาดในการตรวจสอบใบประกาศนียบัตร",
      },
      { status: 500 }
    );
  }
}
