'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  Save,
  Send,
  BookOpen,
  Eye,
  X,
  Sparkles,
} from 'lucide-react'

export default function NewCoursePage() {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    category: '',
    level: '',
    duration: '',
    isFree: true,
    hasCertificate: true,
    status: 'draft',
  })
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const t = useTranslations('admin')

  // Auto-generate slug from title
  useEffect(() => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    setForm((prev) => ({ ...prev, slug }))
  }, [form.title])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = (field: 'isFree' | 'hasCertificate') => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{t('newCourseTitle')}</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {t('newCourseDesc')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 xl:col-span-2">
          {/* Basic Info */}
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                {t('basicInfo')}
              </h2>
            </div>
            <div className="space-y-5 p-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  {t('courseName')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder={t('courseNamePlaceholder')}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">/courses/</span>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  {t('shortDesc')}
                </label>
                <input
                  type="text"
                  name="shortDesc"
                  value={form.shortDesc}
                  onChange={handleChange}
                  placeholder={t('shortDescPlaceholder')}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  {t('fullDesc')}
                </label>
                <textarea
                  name="fullDesc"
                  value={form.fullDesc}
                  onChange={handleChange}
                  rows={5}
                  placeholder={t('fullDescPlaceholder')}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                {t('additionalDetails')}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  {t('category')}
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-400 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                >
                  <option value="">{t('selectCategory')}</option>
                  <option value="automation">Automation</option>
                  <option value="marketing">Marketing</option>
                  <option value="hr">HR</option>
                  <option value="productivity">Productivity</option>
                  <option value="data">Data & Analytics</option>
                  <option value="finance">Finance</option>
                </select>
              </div>

              {/* Level */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  {t('level')}
                </label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-400 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                >
                  <option value="">{t('selectLevel')}</option>
                  <option value="beginner">{t('levelBeginner')}</option>
                  <option value="intermediate">{t('levelIntermediate')}</option>
                  <option value="advanced">{t('levelAdvanced')}</option>
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  {t('duration')}
                </label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder={t('durationPlaceholder')}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  {t('status')}
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm text-gray-400 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                >
                  <option value="draft">{t('statusDraft')}</option>
                  <option value="published">{t('statusPublished')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                {t('thumbnail')}
              </h2>
            </div>
            <div className="p-5">
              {thumbnailPreview ? (
                <div className="relative inline-block">
                  <div className="h-48 w-80 overflow-hidden rounded-lg border border-white/[0.06]">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <ImageIcon className="h-12 w-12 text-blue-400/40" />
                    </div>
                  </div>
                  <button
                    onClick={() => setThumbnailPreview(null)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-12 transition-colors hover:border-blue-500/30 hover:bg-blue-500/[0.02]">
                  <Upload className="mb-3 h-8 w-8 text-gray-600" />
                  <p className="text-sm font-medium text-gray-400">
                    {t('uploadImage')}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {t('uploadImageFormats')}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={() => setThumbnailPreview('preview')}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-white">{t('additionalSettings')}</h2>
            </div>
            <div className="divide-y divide-white/[0.04] p-5">
              {/* Free toggle */}
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    {t('freeCourse')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('freeCourseDesc')}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('isFree')}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form.isFree ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      form.isFree ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Certificate toggle */}
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    {t('hasCertificate')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('hasCertificateDesc')}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('hasCertificate')}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form.hasCertificate ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      form.hasCertificate ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/[0.06] hover:text-white">
              <Save className="h-4 w-4" />
              {t('saveDraft')}
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30">
              <Send className="h-4 w-4" />
              {t('publish')}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-24 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1628]/50">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-4">
              <Eye className="h-4 w-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-white">{t('preview')}</h2>
            </div>
            <div className="p-5">
              {/* Thumbnail preview */}
              <div className="mb-4 overflow-hidden rounded-lg border border-white/[0.06]">
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  {thumbnailPreview ? (
                    <ImageIcon className="h-10 w-10 text-blue-400/40" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-700" />
                      <p className="mt-2 text-xs text-gray-600">
                        {t('noThumbnailYet')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview content */}
              <div className="space-y-3">
                {form.category && (
                  <span className="inline-block rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                    {form.category}
                  </span>
                )}
                <h3 className="text-lg font-bold text-white">
                  {form.title || (
                    <span className="text-gray-600">{t('courseNameLabel')}</span>
                  )}
                </h3>
                <p className="text-sm text-gray-400">
                  {form.shortDesc || (
                    <span className="text-gray-700">{t('shortDescPreview')}</span>
                  )}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {form.level && (
                    <span className="rounded-md bg-white/[0.04] px-2 py-1 text-xs text-gray-400">
                      {form.level === 'beginner'
                        ? t('levelBeginner')
                        : form.level === 'intermediate'
                          ? t('levelIntermediate')
                          : t('levelAdvanced')}
                    </span>
                  )}
                  {form.duration && (
                    <span className="rounded-md bg-white/[0.04] px-2 py-1 text-xs text-gray-400">
                      {form.duration}
                    </span>
                  )}
                  {form.isFree && (
                    <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                      {t('freeCourse')}
                    </span>
                  )}
                  {form.hasCertificate && (
                    <span className="rounded-md bg-purple-500/10 px-2 py-1 text-xs text-purple-400">
                      {t('certificateLabel')}
                    </span>
                  )}
                </div>

                <div className="border-t border-white/[0.06] pt-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      form.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                        : 'bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20'
                    }`}
                  >
                    {form.status === 'published' ? t('statusPublished') : t('statusDraft')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
