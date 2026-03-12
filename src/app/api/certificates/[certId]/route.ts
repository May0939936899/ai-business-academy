import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

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
