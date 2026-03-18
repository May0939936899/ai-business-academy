import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

// ─── Route Classifications ──────────────────────────────────────────────────

// Public paths — accessible without authentication
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/register',
  '/account-status',
  '/courses',
  '/learn',
  '/about',
  '/contact',
  '/learning-path',
  '/verify',
  '/instructors',
  '/instructor',
  '/certificate',
  '/a/certificate',
  '/admin/login',
]

// Auth pages — redirect away if already authenticated
const authPages = ['/login', '/signup', '/register']

// ─── Helpers ────────────────────────────────────────────────────────────────

function stripLocale(pathname: string): string {
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(/|$)`)
  return pathname.replace(localePattern, '/$2') || '/'
}

function extractLocale(pathname: string): string {
  const match = pathname.match(new RegExp(`^/(${routing.locales.join('|')})/`))
  return match?.[1] || routing.defaultLocale
}

function isPublicPath(pathname: string): boolean {
  const stripped = stripLocale(pathname)
  return publicPaths.some((p) => stripped === p || stripped.startsWith(p + '/'))
}

function isAuthPage(pathname: string): boolean {
  const stripped = stripLocale(pathname)
  return authPages.some((p) => stripped === p || stripped.startsWith(p + '/'))
}

// ─── Middleware ──────────────────────────────────────────────────────────────

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. Run next-intl middleware for locale handling
  const intlResponse = intlMiddleware(req)
  const locale = extractLocale(pathname)
  const strippedPath = stripLocale(pathname)

  // 3. Get auth token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // ── CASE A: User on auth page (login/signup) while already authenticated ──
  if (isAuthPage(pathname) && token && !token.error) {
    // Suspended user stays on account-status, not login
    if (token.error === 'suspended') {
      return NextResponse.redirect(new URL(`/${locale}/account-status?reason=suspended`, req.url))
    }

    // Redirect authenticated users away from auth pages
    if (token.role === 'STUDENT' && !token.isProfileCompleted) {
      return NextResponse.redirect(new URL(`/${locale}/complete-profile`, req.url))
    }
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}/admin`, req.url))
    }
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
  }

  // ── CASE B: Public paths — allow without auth ──
  if (isPublicPath(pathname)) {
    return intlResponse
  }

  // ── CASE C: Protected paths — require authentication ──
  if (!token) {
    const loginUrl = new URL(`/${locale}/login`, req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── CASE D: Suspended user — redirect to account-status ──
  if (token.error === 'suspended') {
    // Allow access to account-status page itself to avoid redirect loop
    if (strippedPath === '/account-status') {
      return intlResponse
    }
    return NextResponse.redirect(new URL(`/${locale}/account-status?reason=suspended`, req.url))
  }

  // ── CASE E: Incomplete profile — gate to /complete-profile ──
  if (
    token.role === 'STUDENT' &&
    !token.isProfileCompleted &&
    strippedPath !== '/complete-profile'
  ) {
    return NextResponse.redirect(new URL(`/${locale}/complete-profile`, req.url))
  }

  // ── CASE F: Admin routes — require ADMIN role ──
  if (strippedPath.startsWith('/admin') && strippedPath !== '/admin/login') {
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
    }
  }

  return intlResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
