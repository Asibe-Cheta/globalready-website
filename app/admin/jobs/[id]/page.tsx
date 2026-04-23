'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Pencil, Briefcase, Loader2, ExternalLink } from 'lucide-react'

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
  description: string | null
  apply_url: string | null
  posted_date: string | null
  expires_at: string | null
  is_active: boolean
  is_featured: boolean
  view_count: number
  application_count: number
  requirements: Record<string, unknown>
  created_at: string
  updated_at: string | null
}

export default function JobDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/admin/jobs/${id}`, { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load job')
        }
        const data = await res.json()
        if (!cancelled) setJob(data)
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
  if (error || !job) {
    return (
      <div className="space-y-4">
        <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to jobs
        </Link>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error || 'Job not found'}</div>
      </div>
    )
  }

  const req = job.requirements && typeof job.requirements === 'object' ? job.requirements as Record<string, unknown> : {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/jobs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to jobs
        </Link>
        <Link href={`/admin/jobs/${job.id}/edit`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600">
          <Pencil className="w-4 h-4" /> Edit
        </Link>
      </div>

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#0d6cf2]/20 flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-[#0d6cf2]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{job.title}</h1>
            <p className="text-slate-400 mt-1">{job.company}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              {job.country && <span className="px-3 py-1 rounded-full bg-[#223249] text-slate-300 text-sm">{job.country}{job.city ? `, ${job.city}` : ''}</span>}
              {job.job_type && <span className="px-3 py-1 rounded-full bg-[#223249] text-slate-300 text-sm">{job.job_type}</span>}
              {job.sector && <span className="px-3 py-1 rounded-full bg-[#223249] text-slate-300 text-sm">{job.sector}</span>}
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${job.is_active ? 'bg-green-500/10 text-[#0bda5e]' : 'bg-slate-500/10 text-slate-400'}`}>
                {job.is_active ? 'Active' : 'Inactive'}
              </span>
              {job.is_featured && <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm">Featured</span>}
            </div>
            {job.salary_range && <p className="text-white font-medium mt-2">{job.salary_range}</p>}
            {job.visa_sponsorship && <p className="text-slate-300 text-sm mt-1">Visa sponsorship: {job.visa_sponsorship}</p>}
          </div>
        </div>
        {job.description && <p className="mt-4 text-slate-300 whitespace-pre-wrap">{job.description}</p>}
        {job.apply_url && (
          <div className="mt-4">
            <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#0d6cf2] hover:underline">
              <ExternalLink className="w-4 h-4" /> Apply
            </a>
            <p className="text-xs text-slate-500 mt-2">
              Some opportunities are hosted on third-party platforms and may have their own access requirements, subscriptions, or fees.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-slate-400">Posted</dt><dd className="text-white">{job.posted_date ? new Date(job.posted_date).toLocaleDateString() : '—'}</dd></div>
            <div><dt className="text-slate-400">Views</dt><dd className="text-white">{job.view_count ?? 0}</dd></div>
            <div><dt className="text-slate-400">Applications</dt><dd className="text-white">{job.application_count ?? 0}</dd></div>
          </dl>
        </div>
        {Object.keys(req).length > 0 && (
          <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Requirements (JSON)</h3>
            <pre className="text-slate-300 text-sm overflow-auto max-h-48">{JSON.stringify(req, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
