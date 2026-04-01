'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Video, Loader2 } from 'lucide-react'

type Session = {
  id: string
  course_id: string
  session_date: string
  timezone: string
  location: string | null
  meeting_link: string | null
  duration_minutes: number | null
  is_active: boolean
  courses?: { id: string; title: string; path_category: string | null }
}

export default function AdminVirtualSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [includeInactive, setIncludeInactive] = useState(false)
  const [courseFilter, setCourseFilter] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (includeInactive) params.set('include_inactive', 'true')
        if (courseFilter) params.set('course_id', courseFilter)
        const res = await fetch(`/api/admin/virtual-sessions?${params}`, { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load sessions')
        }
        const data = await res.json()
        if (!cancelled) setSessions(data.sessions ?? [])
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load sessions')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [includeInactive, courseFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Virtual Sessions</h1>
          <p className="text-slate-400">Manage virtual room sessions. Event types can be typed freely and reused in mobile.</p>
        </div>
        <Link
          href="/admin/virtual-sessions/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add session
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error}</div>
      )}

      <div className="flex flex-wrap items-center gap-4">
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
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No virtual sessions yet. Add one.</p>
            <Link href="/admin/virtual-sessions/new" className="inline-flex items-center gap-2 mt-4 text-[#0d6cf2] hover:underline">
              <Plus className="w-4 h-4" /> Add session
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Date & time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Event Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Location</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-slate-700/30 hover:bg-[#223249]/30">
                    <td className="py-3 px-4 text-white">
                      {new Date(s.session_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      {s.timezone && <span className="text-slate-500 text-sm ml-1">{s.timezone}</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{(s.courses as { title?: string })?.title ?? '—'}</td>
                    <td className="py-3 px-4 text-slate-300">{s.location ?? '—'}</td>
                    <td className="py-3 px-4 text-slate-300">{s.duration_minutes != null ? `${s.duration_minutes} min` : '—'}</td>
                    <td className="py-3 px-4">
                      <span className={s.is_active ? 'text-green-400' : 'text-slate-500'}>{s.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/virtual-sessions/${s.id}/edit`} className="text-slate-400 hover:text-white inline-flex items-center gap-1">
                        <Pencil className="w-4 h-4" /> Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
