'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import CourseCard from '@/components/features/CourseCard'

interface CourseItem {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string | null
  category: string
  level: string
  duration: string | null
  isFree: boolean
  thumbnail: string | null
  lessonCount: number
}

const categories = ['ทั้งหมด', 'AI Automation', 'AI Marketing', 'AI HR', 'AI Productivity']
const levels = ['ทุกระดับ', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']
const levelLabels: Record<string, string> = {
  'ทุกระดับ': 'ทุกระดับ',
  BEGINNER: 'เริ่มต้น',
  INTERMEDIATE: 'ปานกลาง',
  ADVANCED: 'ขั้นสูง',
}

export default function CoursesClient({ courses }: { courses: CourseItem[] }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')
  const [selectedLevel, setSelectedLevel] = useState('ทุกระดับ')

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        search === '' ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
      const matchCategory =
        selectedCategory === 'ทั้งหมด' || course.category === selectedCategory
      const matchLevel =
        selectedLevel === 'ทุกระดับ' || course.level === selectedLevel
      return matchSearch && matchCategory && matchLevel
    })
  }, [courses, search, selectedCategory, selectedLevel])

  const hasActiveFilters =
    search !== '' || selectedCategory !== 'ทั้งหมด' || selectedLevel !== 'ทุกระดับ'

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('ทั้งหมด')
    setSelectedLevel('ทุกระดับ')
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">คอร์สเรียนทั้งหมด</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-400">
            เรียนรู้การใช้ AI สำหรับธุรกิจจากผู้เชี่ยวชาญ พร้อมรับ Certificate ฟรี
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="ค้นหาคอร์สเรียน..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/[0.06] bg-[#0a1628]/60 py-3 pl-12 pr-4 text-gray-200 placeholder-gray-500 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <SlidersHorizontal className="h-4 w-4" />
              <span>กรองตาม:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30'
                      : 'bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-white/[0.1]" />

            <div className="flex flex-wrap gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                    selectedLevel === lvl
                      ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30'
                      : 'bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-gray-200'
                  }`}
                >
                  {levelLabels[lvl] || lvl}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-white/[0.04] hover:text-gray-300"
              >
                <X className="h-3.5 w-3.5" />
                ล้างตัวกรอง
              </button>
            )}
          </div>
        </div>

        <p className="mb-6 text-sm text-gray-500">พบ {filteredCourses.length} คอร์ส</p>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                slug={course.slug}
                category={course.category}
                level={course.level}
                duration={course.duration}
                lessonCount={course.lessonCount}
                description={course.description}
                shortDescription={course.shortDescription}
                isFree={course.isFree}
                thumbnail={course.thumbnail}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-400">ไม่พบคอร์สที่ตรงกับเงื่อนไข</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-400 transition-colors hover:text-blue-300"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
