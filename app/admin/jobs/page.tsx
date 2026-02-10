'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Eye, Briefcase, Loader2 } from 'lucide-react'

type Job = {
  id: string
  title: string
  company: string
  country: string | null
  city: string | null
  job_type: string | null
  sector: string | null
  visa_sponsorship: string | null
  salary_range: string | null
  is_active: boolean
  is_featured: boolean
  view_count: number
  application_count: number
  posted_date: string | null
  created_at: string
}

type Pagination = { page: number; limit: number; total: number }

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [includeInactive, setIncludeInactive] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ page: String(pagination.page), limit: '20' })
        if (includeInactive) params.set('include_inactive', 'true')
        if (search.trim()) params.set('search', search.trim())
        const res = await fetch(`/api/admin/jobs?${params}`, { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load jobs')
        }
        const data = await res.json()
        if (!cancelled) {
          setJobs(data.jobs ?? [])
          setPagination(data.pagination ?? { page: 1, limit: 20, total: 0 })
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load jobs')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [pagination.page, includeInactive, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Jobs</h1>
          <p className="text-slate-400">Manage job listings. Data is synced to the mobile app Browse Jobs flow.</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add job
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error}</div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <input
          type="search"
          placeholder="Search title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white placeholder-slate-500 w-64"
        />
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
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No jobs yet. Add one.</p>
            <Link href="/admin/jobs/new" className="inline-flex items-center gap-2 mt-4 text-[#0d6cf2] hover:underline">
              <Plus className="w-4 h-4" /> Add job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Job</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Company</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Location</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Views / Apps</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-700/30 hover:bg-[#223249]/30">
                    <td className="py-3 px-4">
                      <span className="font-medium text-white">{job.title}</span>
                      {job.is_featured && (
                        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400">Featured</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{job.company}</td>
                    <td className="py-3 px-4 text-slate-300">{[job.city, job.country].filter(Boolean).join(', ') || '—'}</td>
                    <td className="py-3 px-4 text-slate-300">{job.job_type ?? '—'}</td>
                    <td className="py-3 px-4">
                      <span className={job.is_active ? 'text-green-400' : 'text-slate-500'}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{job.view_count ?? 0} / {job.application_count ?? 0}</td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/jobs/${job.id}`} className="text-slate-400 hover:text-white inline-flex items-center gap-1 mr-3">
                        <Eye className="w-4 h-4" /> View
                      </Link>
                      <Link href={`/admin/jobs/${job.id}/edit`} className="text-slate-400 hover:text-white inline-flex items-center gap-1">
                        <Pencil className="w-4 h-4" /> Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && pagination.total > pagination.limit && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50 text-sm text-slate-400">
            <span>Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                className="px-3 py-1 rounded bg-[#223249] disabled:opacity-50 hover:bg-[#223249]/80"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page * pagination.limit >= pagination.total}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                className="px-3 py-1 rounded bg-[#223249] disabled:opacity-50 hover:bg-[#223249]/80"
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
