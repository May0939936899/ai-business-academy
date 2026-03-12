/**
 * Promote a user to ADMIN by email.
 *
 * Usage:
 *   npx tsx scripts/promote-admin.ts youremail@gmail.com
 *
 * Or promote multiple:
 *   npx tsx scripts/promote-admin.ts user1@gmail.com user2@gmail.com
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const emails = process.argv.slice(2)

  if (emails.length === 0) {
    console.log('❌ กรุณาระบุอีเมลที่ต้องการตั้งเป็น Admin')
    console.log('')
    console.log('วิธีใช้:')
    console.log('  npx tsx scripts/promote-admin.ts youremail@gmail.com')
    console.log('')

    // Show all users
    const users = await prisma.user.findMany({
      select: { email: true, fullName: true, role: true },
      orderBy: { createdAt: 'desc' },
    })

    if (users.length > 0) {
      console.log('📋 ผู้ใช้ทั้งหมดในระบบ:')
      users.forEach((u) => {
        const badge = u.role === 'ADMIN' ? '👑' : '👤'
        console.log(`  ${badge} ${u.email} — ${u.fullName} [${u.role}]`)
      })
    } else {
      console.log('📋 ยังไม่มีผู้ใช้ในระบบ (ให้ login ด้วย Google ก่อน)')
    }

    process.exit(0)
  }

  for (const email of emails) {
    const normalizedEmail = email.toLowerCase().trim()

    try {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      })

      if (!user) {
        console.log(`⚠️  ไม่พบผู้ใช้ ${normalizedEmail} ในระบบ`)
        console.log(`   (ให้ผู้ใช้ login ด้วย Google ก่อน แล้วรันคำสั่งนี้อีกครั้ง)`)
        continue
      }

      if (user.role === 'ADMIN') {
        console.log(`✅ ${normalizedEmail} เป็น Admin อยู่แล้ว`)
        continue
      }

      await prisma.user.update({
        where: { email: normalizedEmail },
        data: { role: 'ADMIN' },
      })

      console.log(`🎉 ตั้ง ${normalizedEmail} (${user.fullName}) เป็น Admin สำเร็จ!`)
    } catch (error) {
      console.error(`❌ Error promoting ${normalizedEmail}:`, error)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
