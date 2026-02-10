'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

function parseRequirements(s: string): Record<string, unknown> {
  if (!s.trim()) return {}
  try {
    const v = JSON.parse(s)
    return typeof v === 'object' && v !== null ? v : {}
  } catch {
    return {}
  }
}

export default function NewJobPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    company: '',
    country: '',
    city: '',
    job_type: '',
    sector: '',
    visa_sponsorship: '',
    salary_range: '',
    description: '',
    apply_url: '',
    posted_date: '',
    requirements: '{}',
    is_active: true,
    is_featured: false,
  })

  function update(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Title is required'); return }
    if (!form.company.trim()) { setError('Company is required'); return }
    setSaving(true)
    try {
      const body = {
        title: form.title.trim(),
        company: form.company.trim(),
        country: form.country.trim() || null,
        city: form.city.trim() || null,
        job_type: form.job_type.trim() || null,
        sector: form.sector.trim() || null,
        visa_sponsorship: form.visa_sponsorship.trim() || null,
        salary_range: form.salary_range.trim() || null,
        description: form.description.trim() || null,
        apply_url: form.apply_url.trim() || null,
        posted_date: form.posted_date ? new Date(form.posted_date).toISOString() : undefined,
        requirements: parseRequirements(form.requirements),
        is_active: form.is_active,
        is_featured: form.is_featured,
      }
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to create job')
      router.push(`/admin/jobs/${data.id}`)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create job')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </Link>
      <h1 className="text-3xl font-bold text-white">Add job</h1>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Basic info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
              <input value={form.title} onChange={(e) => update('title', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Company *</label>
              <input value={form.company} onChange={(e) => update('company', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
              <input value={form.country} onChange={(e) => update('country', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">City</label>
              <input value={form.city} onChange={(e) => update('city', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Job type</label>
              <select value={form.job_type} onChange={(e) => update('job_type', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white">
                <option value="">—</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Sector</label>
              <input value={form.sector} onChange={(e) => update('sector', e.target.value)} placeholder="e.g. Technology" className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Visa sponsorship</label>
              <select value={form.visa_sponsorship} onChange={(e) => update('visa_sponsorship', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white">
                <option value="">—</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
                <option value="UNKNOWN">UNKNOWN</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Salary range</label>
              <input value={form.salary_range} onChange={(e) => update('salary_range', e.target.value)} placeholder="e.g. $90k - $130k" className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Apply URL</label>
            <input type="url" value={form.apply_url} onChange={(e) => update('apply_url', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Posted date</label>
            <input type="date" value={form.posted_date} onChange={(e) => update('posted_date', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Requirements (JSON)</label>
            <textarea value={form.requirements} onChange={(e) => update('requirements', e.target.value)} rows={6} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white font-mono text-sm" placeholder='{"responsibilities":[],"requirements":[],"experience_level":"","competition_level":""}' />
          </div>
        </div>

        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 flex gap-6">
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} className="rounded border-slate-600 bg-[#223249] text-[#0d6cf2]" />
            Active
          </label>
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} className="rounded border-slate-600 bg-[#223249] text-[#0d6cf2]" />
            Featured
          </label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Create job
          </button>
          <Link href="/admin/jobs" className="px-6 py-2 bg-[#223249] text-slate-300 rounded-lg font-medium hover:bg-[#223249]/80">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
