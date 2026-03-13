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
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        // Find user by email (username = email for admin)
        const user = await db.user.findUnique({
          where: { email: credentials.username.toLowerCase() },
        })

        if (!user || !user.passwordHash) return null
        if (user.role !== "ADMIN") return null
        if (user.status === "SUSPENDED") return null

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        // Update last login
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
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      try {
        const email = user.email.toLowerCase()
        const isAdmin = ADMIN_EMAILS.includes(email)

        // Upsert user in database
        const existingUser = await db.user.findUnique({
          where: { email },
        })

        if (existingUser) {
          // Update existing user — auto-promote to ADMIN if in ADMIN_EMAILS
          await db.user.update({
            where: { id: existingUser.id },
            data: {
              googleId: account?.providerAccountId,
              image: user.image,
              fullName: user.name || existingUser.fullName,
              lastLoginAt: new Date(),
              ...(isAdmin && existingUser.role !== "ADMIN"
                ? { role: "ADMIN" }
                : {}),
            },
          })
        } else {
          // Create new user — admin if email matches ADMIN_EMAILS
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
      } catch (error) {
        console.error("Error during sign in:", error)
        return false
      }
    },

    async jwt({ token, trigger }) {
      // Refresh user data from DB on sign-in or when token lacks id
      if (token.email && (trigger === "signIn" || trigger === "update" || !token.id)) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            role: true,
            fullName: true,
            status: true,
            image: true,
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
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.fullName = token.fullName as string
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Allow relative urls
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // If url starts with base, allow it
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
  },
}
