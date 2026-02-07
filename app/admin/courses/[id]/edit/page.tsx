'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

function parseSyllabus(s: string): { week?: number; title?: string; topics?: string[] }[] {
  if (!s.trim()) return []
  try {
    const v = JSON.parse(s)
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    duration: '',
    duration_hours: '',
    total_lessons: '',
    image_url: '',
    thumbnail_url: '',
    instructor: '',
    instructor_avatar: '',
    price: '',
    currency: 'USD',
    level: 'beginner',
    syllabus: '[]',
    prerequisites: '',
    learning_outcomes: '',
    tags: '',
    featured: false,
    is_active: true,
  })

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/admin/courses/${id}`, { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load course')
        }
        const c = await res.json()
        if (cancelled) return
        setForm({
          title: c.title ?? '',
          subtitle: c.subtitle ?? '',
          description: c.description ?? '',
          category: c.category ?? '',
          duration: c.duration ?? '',
          duration_hours: c.duration_hours ?? '',
          total_lessons: c.total_lessons ?? '',
          image_url: c.image_url ?? '',
          thumbnail_url: c.thumbnail_url ?? '',
          instructor: c.instructor ?? '',
          instructor_avatar: c.instructor_avatar ?? '',
          price: c.price != null ? (c.price / 100).toFixed(2) : '',
          currency: c.currency ?? 'USD',
          level: c.level ?? 'beginner',
          syllabus: Array.isArray(c.syllabus) ? JSON.stringify(c.syllabus, null, 2) : '[]',
          prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites.join('\n') : '',
          learning_outcomes: Array.isArray(c.learning_outcomes) ? c.learning_outcomes.join('\n') : '',
          tags: Array.isArray(c.tags) ? c.tags.join(', ') : '',
          featured: !!c.featured,
          is_active: c.is_active !== false,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  function update(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    setSaving(true)
    try {
      const body = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        duration: form.duration.trim() || null,
        duration_hours: parseInt(form.duration_hours, 10) || 0,
        total_lessons: parseInt(form.total_lessons, 10) || 0,
        image_url: form.image_url.trim() || null,
        thumbnail_url: form.thumbnail_url.trim() || null,
        instructor: form.instructor.trim() || null,
        instructor_avatar: form.instructor_avatar.trim() || null,
        price: Math.round(parseFloat(form.price || '0') * 100) || 0,
        currency: form.currency || 'USD',
        level: form.level || 'beginner',
        syllabus: parseSyllabus(form.syllabus),
        prerequisites: form.prerequisites.split('\n').map((s) => s.trim()).filter(Boolean),
        learning_outcomes: form.learning_outcomes.split('\n').map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        featured: form.featured,
        is_active: form.is_active,
      }
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to update course')
      router.push(`/admin/courses/${id}`)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href={`/admin/courses/${id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to course
      </Link>
      <h1 className="text-3xl font-bold text-white">Edit course</h1>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Basic info</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
            <input value={form.title} onChange={(e) => update('title', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Subtitle</label>
            <input value={form.subtitle} onChange={(e) => update('subtitle', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <input value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Duration (display)</label>
              <input value={form.duration} onChange={(e) => update('duration', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Duration (hours)</label>
              <input type="number" min={0} value={form.duration_hours} onChange={(e) => update('duration_hours', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Total lessons</label>
              <input type="number" min={0} value={form.total_lessons} onChange={(e) => update('total_lessons', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Media & instructor</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Image URL</label>
            <input value={form.image_url} onChange={(e) => update('image_url', e.target.value)} type="url" className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Thumbnail URL</label>
            <input value={form.thumbnail_url} onChange={(e) => update('thumbnail_url', e.target.value)} type="url" className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Instructor name</label>
              <input value={form.instructor} onChange={(e) => update('instructor', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Instructor avatar URL</label>
              <input value={form.instructor_avatar} onChange={(e) => update('instructor_avatar', e.target.value)} type="url" className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Pricing & level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Price (e.g. 99.00)</label>
              <input type="number" min={0} step={0.01} value={form.price} onChange={(e) => update('price', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
              <input value={form.currency} onChange={(e) => update('currency', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Level</label>
              <select value={form.level} onChange={(e) => update('level', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Syllabus & outcomes</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Syllabus (JSON array)</label>
            <textarea value={form.syllabus} onChange={(e) => update('syllabus', e.target.value)} rows={6} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Prerequisites (one per line)</label>
            <textarea value={form.prerequisites} onChange={(e) => update('prerequisites', e.target.value)} rows={2} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Learning outcomes (one per line)</label>
            <textarea value={form.learning_outcomes} onChange={(e) => update('learning_outcomes', e.target.value)} rows={3} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => update('tags', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
        </div>

        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 flex gap-6">
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="rounded border-slate-600 bg-[#223249] text-[#0d6cf2]" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} className="rounded border-slate-600 bg-[#223249] text-[#0d6cf2]" />
            Active
          </label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Save changes
          </button>
          <Link href={`/admin/courses/${id}`} className="px-6 py-2 bg-[#223249] text-slate-300 rounded-lg font-medium hover:bg-[#223249]/80">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
