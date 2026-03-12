'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'

interface EnrollButtonProps {
  courseId: string
  courseSlug: string
  firstLessonId: string | null
  isLoggedIn: boolean
  isEnrolled: boolean
  enrollmentStatus: string | null
}

export default function EnrollButton({
  courseId,
  courseSlug,
  firstLessonId,
  isLoggedIn,
  isEnrolled,
  enrollmentStatus,
}: EnrollButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/courses/${courseSlug}`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })

      if (res.ok) {
        if (firstLessonId) {
          router.push(`/learn/${courseSlug}/${firstLessonId}`)
        } else {
          router.refresh()
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  if (isEnrolled && firstLessonId) {
    return (
      <Link href={`/learn/${courseSlug}/${firstLessonId}`}>
        <Button variant="primary" size="lg" className="w-full">
          {enrollmentStatus === 'COMPLETED' ? 'ทบทวนบทเรียน' : 'เรียนต่อ'}
        </Button>
      </Link>
    )
  }

  return (
    <Button
      variant="primary"
      size="lg"
      className="w-full"
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนเรียนฟรี'}
    </Button>
  )
}
