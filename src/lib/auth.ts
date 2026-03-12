import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options"

/**
 * Get the current authenticated user from the session.
 * Use in Server Components and API routes.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user ?? null
}

/**
 * Require authentication — redirects to login if not authenticated.
 * Use in Server Components that require login.
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

/**
 * Require admin role — redirects to home if not admin.
 * Use in admin Server Components.
 */
export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "ADMIN") {
    redirect("/")
  }
  return user
}
