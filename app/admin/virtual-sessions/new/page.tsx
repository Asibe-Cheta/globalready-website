'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

type Course = { id: string; title: string }

export default function NewVirtualSessionPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    event_type: '',
    session_date: '',
    session_time: '18:00',
    timezone: 'GMT',
    location: 'Virtual Room',
    meeting_link: '',
    duration_minutes: '60',
    is_active: true,
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoadingCourses(true)
      try {
        const res = await fetch('/api/admin/courses?limit=200&include_inactive=true', { credentials: 'include' })
        const data = await res.json().catch(() => ({}))
        if (!cancelled) setCourses(data.courses ?? [])
      } finally {
        if (!cancelled) setLoadingCourses(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  function update(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function resolveCourseIdByTitle(rawTitle: string) {
    const title = rawTitle.trim()
    const existing = courses.find((c) => c.title.trim().toLowerCase() === title.toLowerCase())
    if (existing) return existing.id

    const createRes = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title,
        category: 'Virtual Sessions',
        path_category: 'virtual_sessions',
        is_active: true,
      }),
    })
    const createData = await createRes.json().catch(() => ({}))
    if (!createRes.ok) throw new Error(createData.error || 'Failed to create event type')
    const created = createData as Course
    setCourses((prev) => [...prev, { id: created.id, title: created.title }])
    return created.id
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.event_type.trim()) { setError('Event type is required'); return }
    if (!form.session_date) { setError('Session date is required'); return }
    const sessionDateIso = `${form.session_date}T${form.session_time}:00.000Z`
    setSaving(true)
    try {
      const courseId = await resolveCourseIdByTitle(form.event_type)
      const body = {
        course_id: courseId,
        session_date: sessionDateIso,
        timezone: form.timezone.trim() || 'GMT',
        location: form.location.trim() || null,
        meeting_link: form.meeting_link.trim() || null,
        duration_minutes: parseInt(form.duration_minutes, 10) || null,
        is_active: form.is_active,
      }
      const res = await fetch('/api/admin/virtual-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to create session')
      router.push('/admin/virtual-sessions')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create session')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/virtual-sessions" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to sessions
      </Link>
      <h1 className="text-3xl font-bold text-white">Add virtual session</h1>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Event type *</label>
            <input
              value={form.event_type}
              onChange={(e) => update('event_type', e.target.value)}
              className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white"
              placeholder="e.g. High Income Skills"
              list="virtual-session-event-types"
              required
            />
            <datalist id="virtual-session-event-types">
              {courses.map((c) => (
                <option key={c.id} value={c.title} />
              ))}
            </datalist>
            <p className="text-slate-500 text-sm mt-1">
              Type a new event type or pick an existing one.
              {loadingCourses ? ' Loading existing event types…' : ''}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Session date *</label>
              <input type="date" value={form.session_date} onChange={(e) => update('session_date', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Time</label>
              <input type="time" value={form.session_time} onChange={(e) => update('session_time', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
              <input value={form.timezone} onChange={(e) => update('timezone', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" placeholder="e.g. GMT, America/New_York" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Duration (minutes)</label>
              <input type="number" min={1} value={form.duration_minutes} onChange={(e) => update('duration_minutes', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
            <input value={form.location} onChange={(e) => update('location', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" placeholder="e.g. Virtual Room" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Meeting link (optional)</label>
            <input type="url" value={form.meeting_link} onChange={(e) => update('meeting_link', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" placeholder="Zoom / Meet URL" />
          </div>
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} className="rounded border-slate-600 bg-[#223249] text-[#0d6cf2]" />
            Active (visible in app)
          </label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Create session
          </button>
          <Link href="/admin/virtual-sessions" className="px-6 py-2 bg-[#223249] text-slate-300 rounded-lg font-medium hover:bg-[#223249]/80">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
