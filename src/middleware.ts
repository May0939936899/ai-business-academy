import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // If user is suspended, redirect to login
    if (token?.error === "suspended") {
      return NextResponse.redirect(new URL("/login?error=suspended", req.url))
    }

    // Admin routes require ADMIN role
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url))
      }
      if (token.role !== "ADMIN") {
        // Non-admin users get redirected to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // If logged in and visiting /login, redirect based on role
    if (pathname === "/login" && token) {
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Public routes — always allow (even without token)
        if (
          pathname === "/" ||
          pathname === "/login" ||
          pathname.startsWith("/courses") ||
          pathname.startsWith("/a/certificate") ||
          pathname.startsWith("/about") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/courses") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon") ||
          pathname.includes(".")
        ) {
          return true
        }

        // Protected routes — require token
        return !!token
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
}
