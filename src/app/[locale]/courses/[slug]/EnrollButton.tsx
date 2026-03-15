'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const t = useTranslations('courseDetail')
  const locale = useLocale()
  const [loading, setLoading] = useState(false)

  // Auto-enroll after login redirect (user came back with ?enroll=1)
  useEffect(() => {
    if (isLoggedIn && !isEnrolled && searchParams.get('enroll') === '1') {
      doEnroll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isEnrolled])

  const doEnroll = async () => {
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

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      // Redirect to login → come back with ?enroll=1 → auto-enroll
      router.push(
        `/${locale}/login?callbackUrl=/${locale}/courses/${courseSlug}?enroll=1`
      )
      return
    }
    await doEnroll()
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
