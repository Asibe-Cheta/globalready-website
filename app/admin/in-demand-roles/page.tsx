'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, ListOrdered, Loader2 } from 'lucide-react'

type Role = {
  id: string
  rank: number
  title: string
  icon: string
  accent_color: string
  reason: string | null
  is_active: boolean
  created_at: string
}

export default function AdminInDemandRolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [includeInactive, setIncludeInactive] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (includeInactive) params.set('include_inactive', 'true')
        const res = await fetch(`/api/admin/in-demand-roles?${params}`, { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load roles')
        }
        const data = await res.json()
        if (!cancelled) setRoles(data.roles ?? [])
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load roles')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [includeInactive])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">In-Demand Roles</h1>
          <p className="text-slate-400">Top 10 In-Demand Tech Roles shown on the mobile app (global-skill-shortages).</p>
        </div>
        <Link
          href="/admin/in-demand-roles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add role
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
        ) : roles.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ListOrdered className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No roles yet. Add one or run the SQL seed.</p>
            <Link href="/admin/in-demand-roles/new" className="inline-flex items-center gap-2 mt-4 text-[#0d6cf2] hover:underline">
              <Plus className="w-4 h-4" /> Add role
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium w-20">Rank</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Icon</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Color</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-slate-700/30 hover:bg-[#223249]/30">
                    <td className="py-3 px-4 font-medium text-white">{role.rank}</td>
                    <td className="py-3 px-4 text-white">{role.title}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-sm">{role.icon}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 rounded border border-slate-600" style={{ backgroundColor: role.accent_color || '#3b82f6' }} />
                        <span className="text-slate-300">{role.accent_color || '#3b82f6'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={role.is_active ? 'text-green-400' : 'text-slate-500'}>
                        {role.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/in-demand-roles/${role.id}/edit`} className="text-slate-400 hover:text-white inline-flex items-center gap-1">
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
