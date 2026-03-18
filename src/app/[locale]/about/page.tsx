import { GraduationCap, Users, Award, BookOpen, Target, Sparkles } from 'lucide-react'

const stats = [
  { label: 'คอร์สเรียน', value: '12+', icon: BookOpen },
  { label: 'บทเรียน', value: '60+', icon: GraduationCap },
  { label: 'ผู้เรียน', value: '500+', icon: Users },
  { label: 'ใบ Certificate', value: '200+', icon: Award },
]

const team = [
  { name: 'คณะบริหารธุรกิจ', role: 'มหาวิทยาลัยศรีปทุม', desc: 'ผู้พัฒนาหลักสูตรและเนื้อหาการเรียนรู้ AI สำหรับธุรกิจ' },
  { name: 'AI SPUBUS Academy', role: 'แพลตฟอร์มการเรียนรู้', desc: 'ระบบ E-Learning ที่ออกแบบเพื่อพัฒนาทักษะ AI สำหรับนักธุรกิจยุคใหม่' },
]

const faqs = [
  { q: 'เรียนฟรีจริงไหม?', a: 'ใช่ครับ ทุกคอร์สเรียนได้ฟรี ไม่มีค่าใช้จ่ายใดๆ' },
  { q: 'ได้ Certificate ไหม?', a: 'ได้ครับ เรียนจบครบทุกบทและทำ Quiz ผ่าน จะได้ Certificate ดิจิทัลพร้อม QR Code ยืนยัน' },
  { q: 'ต้องมีพื้นฐาน AI ไหม?', a: 'ไม่จำเป็น หลักสูตรออกแบบมาสำหรับทุกระดับ ตั้งแต่เริ่มต้นจนถึงขั้นสูง' },
  { q: 'เรียนผ่านมือถือได้ไหม?', a: 'ได้ครับ แพลตฟอร์มรองรับทุกอุปกรณ์ ทั้งคอมพิวเตอร์ แท็บเล็ต และมือถือ' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06] py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/5" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
            <Sparkles className="h-4 w-4" />
            เกี่ยวกับเรา
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            AI SPUBUS Academy
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-400">
            แพลตฟอร์มการเรียนรู้ AI สำหรับธุรกิจ โดยคณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม
            ออกแบบมาเพื่อพัฒนาทักษะการใช้ AI ในการทำงานจริง ตั้งแต่พื้นฐานจนถึงระดับผู้นำองค์กร
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/[0.06] py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-4 sm:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <s.icon className="mx-auto mb-2 h-6 w-6 text-blue-400" />
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <Target className="mx-auto mb-3 h-8 w-8 text-cyan-400" />
            <h2 className="mb-3 text-2xl font-bold text-white">พันธกิจของเรา</h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              เราเชื่อว่า AI จะเปลี่ยนแปลงวิธีการทำธุรกิจอย่างสิ้นเชิง เป้าหมายของเราคือทำให้ทุกคนเข้าถึงความรู้ AI ได้
              เพื่อเตรียมพร้อมสำหรับอนาคตของโลกธุรกิจ
            </p>
          </div>

          {/* Team */}
          <div id="team" className="mb-16">
            <h2 className="mb-6 text-center text-xl font-bold text-white">ทีมผู้พัฒนา</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {team.map(t => (
                <div key={t.name} className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-6">
                  <h3 className="text-lg font-bold text-white">{t.name}</h3>
                  <p className="text-sm text-blue-400">{t.role}</p>
                  <p className="mt-2 text-sm text-gray-400">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div id="faq">
            <h2 className="mb-6 text-center text-xl font-bold text-white">คำถามที่พบบ่อย</h2>
            <div className="space-y-3">
              {faqs.map(f => (
                <div key={f.q} className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
                  <h3 className="font-semibold text-white">{f.q}</h3>
                  <p className="mt-1.5 text-sm text-gray-400">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
