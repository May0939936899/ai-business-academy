import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/certificate-settings - Fetch global certificate settings
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

    const settings = await db.certificateSettings.upsert({
      where: { id: "global" },
      update: {},
      create: {
        id: "global",
        signerName: "ผศ.ดร.รวิภา อัครจินดานนท์",
        signerTitle: "คณบดีคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
        certificatePrefix: "SPUBUS",
        defaultThemeId: "royal-blue",
        enabledThemes: [
          "royal-blue",
          "executive-navy",
          "elegant-gold",
          "modern-cyan",
          "academic-crimson",
          "premium-purple",
          "minimal-bw",
        ],
      },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Certificate settings GET error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่า" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/certificate-settings - Update global certificate settings
export async function PUT(request: Request) {
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

    const body = await request.json();
    const { signerName, signerTitle, certificatePrefix, defaultThemeId, enabledThemes } = body;

    const settings = await db.certificateSettings.update({
      where: { id: "global" },
      data: {
        ...(signerName !== undefined && { signerName }),
        ...(signerTitle !== undefined && { signerTitle }),
        ...(certificatePrefix !== undefined && { certificatePrefix }),
        ...(defaultThemeId !== undefined && { defaultThemeId }),
        ...(enabledThemes !== undefined && { enabledThemes }),
      },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Certificate settings PUT error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการบันทึกการตั้งค่า" },
      { status: 500 }
    );
  }
}
