import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

async function requireAdminApi() {
  const user = await getCurrentUser()
  if (!user) return { error: "Unauthorized", status: 401 }
  if (user.role !== "ADMIN") return { error: "Forbidden", status: 403 }
  return { user }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPEG, PNG, WebP, GIF allowed." },
        { status: 400 }
      )
    }

    // Validate file size (2MB max for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File too large. Max 2MB." },
        { status: 400 }
      )
    }

    // Convert to base64 data URL
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({ success: true, url: dataUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    )
  }
}
