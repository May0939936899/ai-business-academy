import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

const contactInfo = [
  {
    icon: Phone,
    label: 'โทรศัพท์',
    value: '02-579-1111',
    sub: 'จันทร์ - ศุกร์ 8:30 - 16:30 น.',
    color: 'text-green-400 bg-green-500/10',
  },
  {
    icon: Mail,
    label: 'อีเมล',
    value: 'direct.sbs@spu.ac.th',
    sub: 'ตอบกลับภายใน 1 วันทำการ',
    color: 'text-blue-400 bg-blue-500/10',
  },
  {
    icon: MapPin,
    label: 'ที่อยู่',
    value: 'คณะบริหารธุรกิจ มหาวิทยาลัยศรีปทุม',
    sub: '2410/2 ถ.พหลโยธิน เขตจตุจักร กรุงเทพฯ 10900',
    color: 'text-purple-400 bg-purple-500/10',
  },
  {
    icon: Clock,
    label: 'เวลาทำการ',
    value: 'จันทร์ - ศุกร์',
    sub: '08:30 - 16:30 น.',
    color: 'text-cyan-400 bg-cyan-500/10',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06] py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/5" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
            <MessageCircle className="h-4 w-4" />
            ติดต่อเรา
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            ติดต่อ AI SPUBUS Academy
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-400">
            มีคำถามเกี่ยวกับหลักสูตร หรือต้องการข้อมูลเพิ่มเติม สามารถติดต่อเราได้ตามช่องทางด้านล่าง
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map(c => (
              <div
                key={c.label}
                className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-6 transition-colors hover:border-white/[0.12]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.color}`}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-400">{c.label}</span>
                </div>
                <p className="text-lg font-semibold text-white">{c.value}</p>
                <p className="mt-1 text-sm text-gray-500">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.06]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.7!2d100.5611!3d13.8741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29c1e8e1a9c61%3A0x7a76d4c7d0e9c900!2sSripatum%20University!5e0!3m2!1sen!2sth!4v1"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-80"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
