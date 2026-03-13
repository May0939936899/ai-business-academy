'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
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
  const t = useTranslations('courseDetail')
  const locale = useLocale()
  const [loading, setLoading] = useState(false)

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      router.push(`/${locale}/login?callbackUrl=/${locale}/courses/${courseSlug}`)
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
          router.push(`/${locale}/learn/${courseSlug}/${firstLessonId}`)
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
      <Link href={`/${locale}/learn/${courseSlug}/${firstLessonId}`}>
        <Button variant="primary" size="lg" className="w-full">
          {enrollmentStatus === 'COMPLETED' ? t('reviewLessons') : t('continueLearning')}
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
      {loading ? t('enrolling') : t('enrollFree')}
    </Button>
  )
}
