'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, CreditCard, GraduationCap, ClipboardList } from 'lucide-react'

type Profile = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  country: string | null
  avatar_url: string | null
  created_at: string
}

type UserDetail = {
  profile: Profile
  cvs: { id: string; type: string; payment_status: string; created_at: string }[]
  payments: { id: string; amount: number; currency: string; status: string; reference: string | null; created_at: string }[]
  registrations: { id: string; full_name: string; email: string; courses: { title: string; category: string } | null; created_at: string }[]
  assessment: { target_country: string; job_sector: string; match_score: number; eligibility_status: string } | null
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [data, setData] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/admin/users/${id}`)
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error || 'Failed to load user')
        }
        const j = await res.json()
        if (!cancelled) setData(j)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (!id || loading) {
    return (
      <div className="space-y-6">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to users
        </Link>
        <p className="text-slate-400">Loading…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to users
        </Link>
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400">
          {error || 'User not found'}
        </div>
      </div>
    )
  }

  const { profile, cvs, payments, registrations, assessment } = data

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to users
      </Link>

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-[#0d6cf2] flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {(profile.full_name || profile.email || '?').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.full_name || '—'}</h1>
            <p className="text-slate-400">{profile.email || '—'}</p>
            {profile.phone && <p className="text-slate-400 text-sm">{profile.phone}</p>}
            {profile.country && <p className="text-slate-400 text-sm">{profile.country}</p>}
            <p className="text-slate-500 text-xs mt-1">
              Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" /> CVs ({cvs.length})
          </h3>
          {cvs.length === 0 ? (
            <p className="text-slate-400 text-sm">No CVs</p>
          ) : (
            <ul className="space-y-2">
              {cvs.map((cv) => (
                <li key={cv.id} className="flex justify-between text-sm">
                  <span className="text-slate-300">{cv.type}</span>
                  <span className={cv.payment_status === 'paid' ? 'text-[#0bda5e]' : 'text-slate-400'}>
                    {cv.payment_status}
                  </span>
                  <span className="text-slate-500">{new Date(cv.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Payments ({payments.length})
          </h3>
          {payments.length === 0 ? (
            <p className="text-slate-400 text-sm">No payments</p>
          ) : (
            <ul className="space-y-2">
              {payments.map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span className="text-white">${(p.amount / 100).toFixed(2)} {p.currency}</span>
                  <span className="text-slate-400">{p.status}</span>
                  <span className="text-slate-500">{new Date(p.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5" /> Course registrations ({registrations.length})
        </h3>
        {registrations.length === 0 ? (
          <p className="text-slate-400 text-sm">None</p>
        ) : (
          <ul className="space-y-2">
            {registrations.map((r) => (
              <li key={r.id} className="text-sm text-slate-300">
                {r.courses?.title ?? 'Course'} ({r.courses?.category ?? '—'}) —{' '}
                {new Date(r.created_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      {assessment && (
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" /> Assessment
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-400">Target country</span><p className="text-white">{assessment.target_country}</p></div>
            <div><span className="text-slate-400">Job sector</span><p className="text-white">{assessment.job_sector}</p></div>
            <div><span className="text-slate-400">Match score</span><p className="text-white">{assessment.match_score}</p></div>
            <div><span className="text-slate-400">Eligibility</span><p className="text-white">{assessment.eligibility_status}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
