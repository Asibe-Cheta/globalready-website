'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Pencil, BookOpen, Loader2 } from 'lucide-react'

type Course = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  category: string | null
  duration: string | null
  duration_hours: number
  total_lessons: number
  image_url: string | null
  thumbnail_url: string | null
  instructor: string | null
  instructor_avatar: string | null
  price: number
  currency: string
  level: string
  syllabus: unknown[]
  prerequisites: string[]
  learning_outcomes: string[]
  tags: string[]
  featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string | null
  course_registrations?: { id: string; full_name: string; email: string; phone: string | null; status: string; created_at: string }[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/admin/courses/${id}`, { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load course')
        }
        const data = await res.json()
        if (!cancelled) setCourse(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }
  if (error || !course) {
    return (
      <div className="space-y-4">
        <Link href="/admin/courses" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </Link>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error || 'Course not found'}</div>
      </div>
    )
  }

  const regs = course.course_registrations ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/courses" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </Link>
        <Link href={`/admin/courses/${course.id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600">
          <Pencil className="w-4 h-4" /> Edit
        </Link>
      </div>

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          {(course.thumbnail_url || course.image_url) ? (
            <img src={course.thumbnail_url || course.image_url || ''} alt="" className="w-24 h-24 rounded-xl object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-[#0d6cf2]/20 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-[#0d6cf2]" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            {course.subtitle && <p className="text-slate-400 mt-1">{course.subtitle}</p>}
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="px-3 py-1 rounded-full bg-[#223249] text-slate-300 text-sm">{course.category ?? '—'}</span>
              <span className="px-3 py-1 rounded-full bg-[#223249] text-slate-300 text-sm">{course.level}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${course.is_active ? 'bg-green-500/10 text-[#0bda5e]' : 'bg-slate-500/10 text-slate-400'}`}>
                {course.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-white font-medium">
                {course.price === 0 ? 'Free' : `${(course.price / 100).toFixed(2)} ${course.currency}`}
              </span>
            </div>
          </div>
        </div>
        {course.description && <p className="mt-4 text-slate-300 whitespace-pre-wrap">{course.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-slate-400">Duration</dt><dd className="text-white">{course.duration ?? '—'}</dd></div>
            <div><dt className="text-slate-400">Hours</dt><dd className="text-white">{course.duration_hours}</dd></div>
            <div><dt className="text-slate-400">Lessons</dt><dd className="text-white">{course.total_lessons}</dd></div>
            <div><dt className="text-slate-400">Instructor</dt><dd className="text-white">{course.instructor ?? '—'}</dd></div>
          </dl>
        </div>
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Registrations ({regs.length})</h3>
          {regs.length === 0 ? (
            <p className="text-slate-400 text-sm">No registrations yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {regs.slice(0, 10).map((r) => (
                <li key={r.id} className="text-slate-300">
                  {r.full_name} — {r.email} <span className="text-slate-500">({r.status})</span>
                </li>
              ))}
              {regs.length > 10 && <li className="text-slate-500">+{regs.length - 10} more</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
