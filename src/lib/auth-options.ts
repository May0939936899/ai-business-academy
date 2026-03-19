import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import db from "@/lib/db"

// Admin emails from env — comma separated
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "user-credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })

        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        // Allow suspended users to authenticate — jwt callback will flag them,
        // and middleware will redirect to /account-status with a clear message.
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.image,
        }
      },
    }),
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.username.toLowerCase() },
        })

        if (!user || !user.passwordHash) return null
        if (user.role !== "ADMIN") return null

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.image,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect auth errors to login page (not the ugly default)
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      // For credentials login, authorize() already handled everything
      if (account?.type === "credentials") return true

      // For OAuth (Google) sign-in — create or link account
      try {
        const email = user.email.toLowerCase()
        const isAdmin = ADMIN_EMAILS.includes(email)

        const existingUser = await db.user.findUnique({
          where: { email },
        })

        if (existingUser) {
          // ── Existing user: link Google account ──
          // Only update googleId if it's not set OR matches current provider
          // This prevents unique constraint violations when googleId is already
          // assigned to a different user record
          const updateData: Record<string, unknown> = {
            image: user.image || existingUser.image,
            fullName: existingUser.fullName || user.name || "ผู้ใช้ใหม่",
            lastLoginAt: new Date(),
          }

          // Only set googleId if user doesn't already have one,
          // or if it's the same provider account
          if (
            !existingUser.googleId ||
            existingUser.googleId === account?.providerAccountId
          ) {
            updateData.googleId = account?.providerAccountId
          }

          // Auto-promote to admin if in ADMIN_EMAILS
          if (isAdmin && existingUser.role !== "ADMIN") {
            updateData.role = "ADMIN"
          }

          await db.user.update({
            where: { id: existingUser.id },
            data: updateData,
          })
        } else {
          // ── New user via Google ──
          // Check if googleId is already used by another account
          if (account?.providerAccountId) {
            const existingGoogleUser = await db.user.findUnique({
              where: { googleId: account.providerAccountId },
            })
            if (existingGoogleUser) {
              // Google account already linked to different email — update that user instead
              await db.user.update({
                where: { id: existingGoogleUser.id },
                data: {
                  image: user.image || existingGoogleUser.image,
                  lastLoginAt: new Date(),
                },
              })
              return true
            }
          }

          await db.user.create({
            data: {
              email,
              fullName: user.name || "ผู้ใช้ใหม่",
              googleId: account?.providerAccountId,
              image: user.image,
              role: isAdmin ? "ADMIN" : "STUDENT",
              lastLoginAt: new Date(),
            },
          })
        }

        return true
      } catch (error: unknown) {
        // Log the actual error for debugging
        console.error("Google sign-in error:", error)

        // If it's a Prisma unique constraint error on googleId,
        // the account is likely already linked — allow sign-in anyway
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          (error as { code: string }).code === "P2002"
        ) {
          console.warn("Unique constraint violation during Google sign-in — allowing login")
          return true
        }

        // For any other DB error, still allow sign-in
        // The user authenticated with Google successfully,
        // we shouldn't block them due to a DB issue
        // The jwt callback will handle loading user data
        return true
      }
    },

    async jwt({ token, trigger }) {
      // Full refresh on sign-in, update, or when token lacks id
      if (token.email && (trigger === "signIn" || trigger === "update" || !token.id)) {
        try {
          const dbUser = await db.user.findUnique({
            where: { email: token.email },
            select: {
              id: true,
              role: true,
              fullName: true,
              status: true,
              image: true,
              isProfileCompleted: true,
            },
          })

          if (dbUser) {
            if (dbUser.status === "SUSPENDED") {
              return { ...token, error: "suspended" }
            }
            token.id = dbUser.id
            token.role = dbUser.role
            token.fullName = dbUser.fullName
            token.picture = dbUser.image
            token.isProfileCompleted = dbUser.isProfileCompleted
          }
        } catch (error) {
          console.error("JWT callback DB error:", error)
        }
      } else if (token.id) {
        // Always sync role & status from DB (lightweight query)
        // This ensures role changes take effect without re-login
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, status: true, isProfileCompleted: true },
          })
          if (dbUser) {
            if (dbUser.status === "SUSPENDED") {
              return { ...token, error: "suspended" }
            }
            token.role = dbUser.role
            token.isProfileCompleted = dbUser.isProfileCompleted
            // Clear suspended error if status is now active
            if (token.error === "suspended") {
              delete token.error
            }
          }
        } catch {
          // Silently fail — use cached token values
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.fullName = token.fullName as string
        session.user.isProfileCompleted = token.isProfileCompleted as boolean
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
  },
}
