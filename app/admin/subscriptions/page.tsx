'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'

type Profile = {
  id: string
  full_name: string | null
  email: string | null
  country: string | null
}

type SubscribedUser = {
  user_id: string
  status: string
  current_period_end: string | null
  cancel_at_period_end: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  updated_at: string
  profiles: Profile | null
}

type SubscribedUsersResponse = {
  subscriptions: SubscribedUser[]
  pagination: { page: number; limit: number; total: number }
}

type IssuesResponse = {
  summary: {
    stripe_active_subscriptions: number
    stripe_active_users_mapped: number
    db_pro_users: number
    in_stripe_not_in_db_count: number
    in_db_not_in_stripe_count: number
    unmatched_stripe_active_count: number
  }
  issues: {
    in_stripe_not_in_db: Array<{ user_id: string; profile: Profile | null }>
    in_db_not_in_stripe: Array<{
      user_id: string
      status: string
      current_period_end: string | null
      stripe_subscription_id: string | null
      updated_at: string
      profile: Profile | null
    }>
    unmatched_stripe_active: Array<{
      subscription_id: string
      customer_id: string | null
      email: string | null
      status: string
    }>
  }
}

type ApiState = {
  loading: boolean
  error: string | null
}

function formatDate(iso?: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}

function errorMessageFromStatus(status: number, fallback: string) {
  if (status === 401) return 'Unauthorized (401). Please log in again as admin.'
  if (status >= 500) return 'Temporary server issue (500). Please retry; previous data is retained.'
  return fallback
}

export default function SubscriptionsAdminPage() {
  const [page, setPage] = useState(1)
  const [subscribedData, setSubscribedData] = useState<SubscribedUsersResponse>({
    subscriptions: [],
    pagination: { page: 1, limit: 50, total: 0 },
  })
  const [issuesData, setIssuesData] = useState<IssuesResponse>({
    summary: {
      stripe_active_subscriptions: 0,
      stripe_active_users_mapped: 0,
      db_pro_users: 0,
      in_stripe_not_in_db_count: 0,
      in_db_not_in_stripe_count: 0,
      unmatched_stripe_active_count: 0,
    },
    issues: {
      in_stripe_not_in_db: [],
      in_db_not_in_stripe: [],
      unmatched_stripe_active: [],
    },
  })

  const [subsState, setSubsState] = useState<ApiState>({ loading: true, error: null })
  const [issuesState, setIssuesState] = useState<ApiState>({ loading: true, error: null })
  const [refreshing, setRefreshing] = useState(false)

  const totalPages = useMemo(() => {
    const { total, limit } = subscribedData.pagination
    return Math.max(1, Math.ceil(total / Math.max(1, limit)))
  }, [subscribedData.pagination])

  const fetchSubscribedUsers = useCallback(async (targetPage: number) => {
    setSubsState((s) => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch(`/api/admin/subscriptions/subscribed-users?page=${targetPage}&limit=50`, {
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(errorMessageFromStatus(res.status, data.error || 'Failed to load subscribed users'))
      }
      setSubscribedData({
        subscriptions: Array.isArray(data.subscriptions) ? data.subscriptions : [],
        pagination: data.pagination ?? { page: targetPage, limit: 50, total: 0 },
      })
    } catch (e) {
      setSubsState((s) => ({ ...s, error: e instanceof Error ? e.message : 'Failed to load subscribed users' }))
    } finally {
      setSubsState((s) => ({ ...s, loading: false }))
    }
  }, [])

  const fetchIssues = useCallback(async () => {
    setIssuesState((s) => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch('/api/admin/subscriptions/issues?sample_limit=100', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(errorMessageFromStatus(res.status, data.error || 'Failed to load subscription issues'))
      }
      setIssuesData({
        summary: data.summary ?? issuesData.summary,
        issues: {
          in_stripe_not_in_db: data.issues?.in_stripe_not_in_db ?? [],
          in_db_not_in_stripe: data.issues?.in_db_not_in_stripe ?? [],
          unmatched_stripe_active: data.issues?.unmatched_stripe_active ?? [],
        },
      })
    } catch (e) {
      setIssuesState((s) => ({ ...s, error: e instanceof Error ? e.message : 'Failed to load subscription issues' }))
    } finally {
      setIssuesState((s) => ({ ...s, loading: false }))
    }
  }, [issuesData.summary])

  const refreshAll = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([fetchSubscribedUsers(page), fetchIssues()])
    setRefreshing(false)
  }, [fetchSubscribedUsers, fetchIssues, page])

  useEffect(() => {
    fetchSubscribedUsers(page)
  }, [page, fetchSubscribedUsers])

  useEffect(() => {
    fetchIssues()
  }, [fetchIssues])

  useEffect(() => {
    const timer = setInterval(() => {
      fetchIssues()
    }, 2 * 60 * 1000)
    return () => clearInterval(timer)
  }, [fetchIssues])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subscriptions</h1>
          <p className="text-slate-400">Monitor Pro users and Stripe-to-app subscription drift.</p>
        </div>
        <button
          type="button"
          onClick={refreshAll}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#223249] text-slate-200 hover:bg-[#2a3f5e] disabled:opacity-50"
        >
          {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Stripe active subscriptions</p>
          <p className="text-white text-2xl font-bold">{issuesData.summary.stripe_active_subscriptions}</p>
        </div>
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Mapped Stripe users</p>
          <p className="text-white text-2xl font-bold">{issuesData.summary.stripe_active_users_mapped}</p>
        </div>
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm">DB Pro users</p>
          <p className="text-white text-2xl font-bold">{issuesData.summary.db_pro_users}</p>
        </div>
      </div>

      {issuesState.error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300">
          {issuesState.error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-white font-semibold">In Stripe, not in DB</h2>
          </div>
          <p className="text-2xl font-bold text-amber-300 mb-3">{issuesData.summary.in_stripe_not_in_db_count}</p>
          <div className="space-y-2 max-h-56 overflow-auto">
            {issuesData.issues.in_stripe_not_in_db.length === 0 ? (
              <p className="text-slate-400 text-sm">No rows.</p>
            ) : (
              issuesData.issues.in_stripe_not_in_db.map((row) => (
                <div key={row.user_id} className="text-sm text-slate-300 border border-slate-700/50 rounded p-2">
                  <p>{row.profile?.full_name || 'Unknown user'}</p>
                  <p className="text-slate-400">{row.profile?.email || row.user_id}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#1a2432] border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-white font-semibold">In DB, not in Stripe</h2>
          </div>
          <p className="text-2xl font-bold text-amber-300 mb-3">{issuesData.summary.in_db_not_in_stripe_count}</p>
          <div className="space-y-2 max-h-56 overflow-auto">
            {issuesData.issues.in_db_not_in_stripe.length === 0 ? (
              <p className="text-slate-400 text-sm">No rows.</p>
            ) : (
              issuesData.issues.in_db_not_in_stripe.map((row) => (
                <div key={row.user_id} className="text-sm text-slate-300 border border-slate-700/50 rounded p-2">
                  <p>{row.profile?.full_name || 'Unknown user'}</p>
                  <p className="text-slate-400">{row.profile?.email || row.user_id}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#1a2432] border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-white font-semibold">Unmatched Stripe active</h2>
          </div>
          <p className="text-2xl font-bold text-amber-300 mb-3">{issuesData.summary.unmatched_stripe_active_count}</p>
          <div className="space-y-2 max-h-56 overflow-auto">
            {issuesData.issues.unmatched_stripe_active.length === 0 ? (
              <p className="text-slate-400 text-sm">No rows.</p>
            ) : (
              issuesData.issues.unmatched_stripe_active.map((row) => (
                <div key={row.subscription_id} className="text-sm text-slate-300 border border-slate-700/50 rounded p-2">
                  <p>{row.email || 'No email'}</p>
                  <p className="text-slate-400">{row.subscription_id}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Subscribed users (Pro in app)</h2>
          {subsState.loading ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-green-400" />}
        </div>
        {subsState.error && (
          <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm">
            {subsState.error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">User</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Period End</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Cancel at End</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {!subsState.loading && subscribedData.subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">No subscribed users returned.</td>
                </tr>
              ) : (
                subscribedData.subscriptions.map((row) => (
                  <tr key={row.user_id} className="border-b border-slate-700/30">
                    <td className="px-4 py-3 text-slate-200">
                      <p>{row.profiles?.full_name || 'Unknown'}</p>
                      <p className="text-slate-400 text-sm">{row.profiles?.email || row.user_id}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-200">{row.status}</td>
                    <td className="px-4 py-3 text-slate-200">{formatDate(row.current_period_end)}</td>
                    <td className="px-4 py-3 text-slate-200">{row.cancel_at_period_end ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 text-slate-200">{formatDate(row.updated_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-700/50 flex items-center justify-between text-sm text-slate-400">
          <span>
            Page {subscribedData.pagination.page} of {totalPages} · Total {subscribedData.pagination.total}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || subsState.loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-[#223249] disabled:opacity-50 hover:bg-[#2a3f5e]"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages || subsState.loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-[#223249] disabled:opacity-50 hover:bg-[#2a3f5e]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
