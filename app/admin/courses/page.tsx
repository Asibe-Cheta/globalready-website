'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Eye, BookOpen, Loader2 } from 'lucide-react'

type Course = {
  id: string
  title: string
  subtitle: string | null
  category: string | null
  duration: string | null
  duration_hours: number
  total_lessons: number
  price: number
  currency: string
  level: string
  featured: boolean
  is_active: boolean
  created_at: string
  course_registrations?: { count: number }[]
}

type Pagination = { page: number; limit: number; total: number }

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [includeInactive, setIncludeInactive] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ page: String(pagination.page), limit: '20' })
        if (includeInactive) params.set('include_inactive', 'true')
        const res = await fetch(`/api/admin/courses?${params}`, { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load courses')
        }
        const data = await res.json()
        if (!cancelled) {
          setCourses(data.courses ?? [])
          setPagination(data.pagination ?? { page: 1, limit: 20, total: 0 })
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load courses')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [pagination.page, includeInactive])

  const count = (c: Course) => c.course_registrations?.[0]?.count ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Courses</h1>
          <p className="text-slate-400">Manage courses. Data is synced to the same API the mobile app uses.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add course
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error}</div>
      )}

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-slate-300">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
            className="rounded border-slate-600 bg-[#223249] text-[#0d6cf2] focus:ring-[#0d6cf2]"
          />
          Include inactive
        </label>
      </div>

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No courses yet. <Link href="/admin/courses/new" className="text-[#0d6cf2] hover:underline">Add one</Link>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#223249]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Enrollments</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-[#223249] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#0d6cf2]/20 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-[#0d6cf2]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{course.title}</p>
                          {course.subtitle && <p className="text-slate-400 text-sm truncate max-w-xs">{course.subtitle}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{course.category ?? '—'}</td>
                    <td className="px-6 py-4 text-white">
                      {course.price === 0 ? 'Free' : `${(course.price / 100).toFixed(2)} ${course.currency}`}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{count(course)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${course.is_active ? 'bg-green-500/10 text-[#0bda5e]' : 'bg-slate-500/10 text-slate-400'}`}>
                        {course.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="p-2 rounded-lg hover:bg-[#223249] text-slate-400 hover:text-white"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/courses/${course.id}/edit`}
                          className="p-2 rounded-lg hover:bg-[#223249] text-slate-400 hover:text-white"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pagination.total > 0 && (
          <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1} · {pagination.total} total
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                className="px-3 py-1 rounded-lg bg-[#223249] text-slate-300 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                className="px-3 py-1 rounded-lg bg-[#223249] text-slate-300 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
