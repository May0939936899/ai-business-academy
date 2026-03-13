import {
  Globe,
  MessageSquare,
  HelpCircle,
  Star,
} from 'lucide-react'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { getTranslations } from 'next-intl/server'

export default async function ContentPage() {
  await requireAdmin()
  const tr = await getTranslations('admin')

  const [
    testimonials,
    totalTestimonials,
    activeTestimonials,
    faqs,
    totalFaqs,
    activeFaqs,
  ] = await Promise.all([
    db.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.testimonial.count(),
    db.testimonial.count({ where: { isActive: true } }),
    db.fAQ.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.fAQ.count(),
    db.fAQ.count({ where: { isActive: true } }),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {tr('contentTitle')}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {tr('contentDesc')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Star className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {totalTestimonials}
              </p>
              <p className="text-xs text-gray-500">{tr('allReviews')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <MessageSquare className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {activeTestimonials}
                <span className="ml-1 text-sm font-normal text-gray-500">
                  / {totalTestimonials - activeTestimonials} {tr('hidden')}
                </span>
              </p>
              <p className="text-xs text-gray-500">{tr('reviewsShown')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <HelpCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalFaqs}</p>
              <p className="text-xs text-gray-500">{tr('allFaqs')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <Globe className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {activeFaqs}
                <span className="ml-1 text-sm font-normal text-gray-500">
                  / {totalFaqs - activeFaqs} {tr('hidden')}
                </span>
              </p>
              <p className="text-xs text-gray-500">{tr('faqsShown')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Testimonials Section */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Star className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">{tr('reviews')}</h2>
                <p className="text-xs text-gray-500">
                  {totalTestimonials} {tr('items')}
                </p>
              </div>
            </div>
          </div>

          {testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <Star className="h-8 w-8 text-gray-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-300">
                {tr('noReviewsYet')}
              </h3>
              <p className="mt-1.5 text-sm text-gray-500">
                {tr('noReviewsDesc')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="px-5 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-start gap-3">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt=""
                        className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-xs font-bold text-amber-300">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-gray-200">
                          {t.name}
                        </p>
                        {t.isActive ? (
                          <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                            {tr('show')}
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-500/10 px-2 py-0.5 text-xs font-medium text-gray-400 ring-1 ring-gray-500/20">
                            {tr('hide')}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {t.role} &middot; {t.companyOrStatus}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-sm text-gray-400">
                        &ldquo;{t.message}&rdquo;
                      </p>
                    </div>
                    <span className="flex-shrink-0 rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-xs text-gray-500">
                      #{t.sortOrder}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {testimonials.length > 0 && (
            <div className="border-t border-white/[0.06] px-5 py-3.5">
              <p className="text-sm text-gray-500">
                {tr('totalItems', { count: testimonials.length })}
              </p>
            </div>
          )}
        </div>

        {/* FAQs Section */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <HelpCircle className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">{tr('faqTitle')}</h2>
                <p className="text-xs text-gray-500">{totalFaqs} {tr('items')}</p>
              </div>
            </div>
          </div>

          {faqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <HelpCircle className="h-8 w-8 text-gray-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-300">
                {tr('noFaqsYet')}
              </h3>
              <p className="mt-1.5 text-sm text-gray-500">
                {tr('noFaqsDesc')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="px-5 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-400">
                      Q
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="line-clamp-1 text-sm font-medium text-gray-200">
                          {faq.question}
                        </p>
                        {faq.isActive ? (
                          <span className="inline-flex flex-shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                            {tr('show')}
                          </span>
                        ) : (
                          <span className="inline-flex flex-shrink-0 rounded-full bg-gray-500/10 px-2 py-0.5 text-xs font-medium text-gray-400 ring-1 ring-gray-500/20">
                            {tr('hide')}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm text-gray-400">
                        {faq.answer}
                      </p>
                    </div>
                    <span className="flex-shrink-0 rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-xs text-gray-500">
                      #{faq.sortOrder}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {faqs.length > 0 && (
            <div className="border-t border-white/[0.06] px-5 py-3.5">
              <p className="text-sm text-gray-500">
                {tr('totalItems', { count: faqs.length })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
