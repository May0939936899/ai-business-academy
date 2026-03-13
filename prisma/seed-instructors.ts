import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

const instructors = [
  {
    name: "ผศ.ดร.ธรรมรัตน์ พลอยเพ็ชร์",
    title: "อาจารย์คณะบริหารธุรกิจ",
    bio: "ผู้เชี่ยวชาญด้าน AI และนวัตกรรมธุรกิจ คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม",
    expertise: ["AI", "Business Innovation", "Digital Strategy"],
    sortOrder: 1,
  },
  {
    name: "ผศ.ดร.รวิภา อัครจินดานนท์",
    title: "คณบดีคณะบริหารธุรกิจ",
    bio: "ผู้เชี่ยวชาญด้านกลยุทธ์ AI และนวัตกรรมทางธุรกิจ",
    expertise: ["AI Strategy", "Business Innovation"],
    sortOrder: 2,
  },
  {
    name: "ดร.มณฑิรา ดวงสาพล",
    title: "ผู้อำนวยการหลักสูตร MBA",
    bio: "ผู้เชี่ยวชาญด้านการตลาดดิจิทัลและ AI Marketing",
    expertise: ["AI Marketing", "Digital Transformation"],
    sortOrder: 3,
  },
  {
    name: "ดร.ณัฐธยาน์ ตรีผลา",
    title: "อาจารย์ประจำสาขาการตลาดดิจิทัล",
    bio: "ผู้เชี่ยวชาญด้าน AI Content Creation และ Social Media",
    expertise: ["AI Content", "Social Media AI"],
    sortOrder: 4,
  },
  {
    name: "อ.ปิยะฉัตร จันทิวา",
    title: "อาจารย์ประจำสาขาบริหารทรัพยากรมนุษย์",
    bio: "ผู้เชี่ยวชาญด้าน AI for HR และ People Analytics",
    expertise: ["AI for HR", "People Analytics"],
    sortOrder: 5,
  },
  {
    name: "อ.พีรพัฒน์ ตระกูลสว่าง",
    title: "ผู้เชี่ยวชาญด้าน AI Automation",
    bio: "ผู้เชี่ยวชาญด้าน AI Automation และ Prompt Engineering",
    expertise: ["AI Automation", "Prompt Engineering"],
    sortOrder: 6,
  },
]

async function main() {
  console.log("🎓 Seeding 6 instructors...")

  for (const inst of instructors) {
    await db.instructor.upsert({
      where: { id: `instructor-${inst.sortOrder}` },
      update: {
        name: inst.name,
        title: inst.title,
        bio: inst.bio,
        expertise: inst.expertise,
        sortOrder: inst.sortOrder,
        isActive: true,
      },
      create: {
        id: `instructor-${inst.sortOrder}`,
        name: inst.name,
        title: inst.title,
        bio: inst.bio,
        expertise: inst.expertise,
        sortOrder: inst.sortOrder,
        isActive: true,
      },
    })
    console.log(`  ✅ ${inst.name}`)
  }

  console.log("\n✨ Done! 6 instructors seeded.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
