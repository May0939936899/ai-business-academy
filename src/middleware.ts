import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Paths that are always public (no auth needed)
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/courses',
  '/learn',
  '/about',
  '/contact',
  '/learning-path',
  '/verify',
  '/instructors',
  '/instructor',
  '/a/certificate',
  '/admin/login',
  '/image-to-content',
  '/poster-generator',
]

function isPublicPath(pathname: string): boolean {
  // Strip locale prefix for matching
  const strippedPath = stripLocale(pathname)
  return publicPaths.some(
    (p) => strippedPath === p || strippedPath.startsWith(p + '/')
  )
}

function stripLocale(pathname: string): string {
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(/|$)`)
  return pathname.replace(localePattern, '/$2') || '/'
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip API routes, static files, and Next.js internals entirely
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Run next-intl middleware first to handle locale detection/redirect
  const intlResponse = intlMiddleware(req)

  // For public paths, just return the intl response (no auth check needed)
  if (isPublicPath(pathname)) {
    return intlResponse
  }

  // For protected paths, check auth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const strippedPath = stripLocale(pathname)

  // Not authenticated → redirect to login
  if (!token) {
    const locale = pathname.match(new RegExp(`^/(${routing.locales.join('|')})/`))?.[1] || routing.defaultLocale
    const loginUrl = new URL(`/${locale}/login`, req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Suspended user → redirect to login with error
  if (token.error === 'suspended') {
    const locale = pathname.match(new RegExp(`^/(${routing.locales.join('|')})/`))?.[1] || routing.defaultLocale
    return NextResponse.redirect(new URL(`/${locale}/login?error=suspended`, req.url))
  }

  // Redirect STUDENT with incomplete profile to /complete-profile
  if (
    token.role === 'STUDENT' &&
    !token.isProfileCompleted &&
    strippedPath !== '/complete-profile'
  ) {
    const locale = pathname.match(new RegExp(`^/(${routing.locales.join('|')})/`))?.[1] || routing.defaultLocale
    return NextResponse.redirect(new URL(`/${locale}/complete-profile`, req.url))
  }

  // Admin routes require ADMIN role
  if (strippedPath.startsWith('/admin')) {
    if (token.role !== 'ADMIN') {
      const locale = pathname.match(new RegExp(`^/(${routing.locales.join('|')})/`))?.[1] || routing.defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
    }
  }

  // Logged-in user visiting /login → redirect to dashboard
  if (strippedPath === '/login') {
    const locale = pathname.match(new RegExp(`^/(${routing.locales.join('|')})/`))?.[1] || routing.defaultLocale
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}/admin`, req.url))
    }
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
  }

  return intlResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
