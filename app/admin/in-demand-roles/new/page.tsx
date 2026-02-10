'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

const ICON_SUGGESTIONS = ['code', 'analytics', 'shield', 'cloud', 'settings', 'psychology', 'design-services', 'layers', 'smartphone', 'account-tree', 'currency-bitcoin']

export default function NewInDemandRolePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    rank: '11',
    title: '',
    icon: 'code',
    accent_color: '#3b82f6',
    reason: '',
    is_active: true,
  })

  function update(key: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const rank = parseInt(form.rank, 10)
    if (isNaN(rank) || rank < 1) { setError('Rank must be a positive number'); return }
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true)
    try {
      const body = {
        rank,
        title: form.title.trim(),
        icon: form.icon.trim() || 'code',
        accent_color: form.accent_color.trim() || '#3b82f6',
        reason: form.reason.trim() || null,
        is_active: form.is_active,
      }
      const res = await fetch('/api/admin/in-demand-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to create role')
      router.push('/admin/in-demand-roles')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create role')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/in-demand-roles" className="inline-flex items-center gap-2 text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to roles
      </Link>
      <h1 className="text-3xl font-bold text-white">Add in-demand role</h1>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Rank *</label>
              <input type="number" min={1} value={form.rank} onChange={(e) => update('rank', e.target.value)} className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" required />
              <p className="text-xs text-slate-500 mt-1">Display order (1 = first).</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
              <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Blockchain Developer" className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Icon (MaterialIcons name)</label>
              <input list="icon-list" value={form.icon} onChange={(e) => update('icon', e.target.value)} placeholder="e.g. code, analytics" className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
              <datalist id="icon-list">
                {ICON_SUGGESTIONS.map((i) => (
                  <option key={i} value={i} />
                ))}
              </datalist>
              <p className="text-xs text-slate-500 mt-1">From fonts.google.com/icons</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Accent color (hex)</label>
              <div className="flex gap-2">
                <input type="color" value={form.accent_color} onChange={(e) => update('accent_color', e.target.value)} className="h-10 w-14 rounded border border-slate-700/50 cursor-pointer" />
                <input value={form.accent_color} onChange={(e) => update('accent_color', e.target.value)} className="flex-1 px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white font-mono" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Reason</label>
            <textarea value={form.reason} onChange={(e) => update('reason', e.target.value)} rows={3} placeholder="Why this role is in demand..." className="w-full px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white" />
          </div>
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} className="rounded border-slate-600 bg-[#223249] text-[#0d6cf2]" />
            Active
          </label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Create role
          </button>
          <Link href="/admin/in-demand-roles" className="px-6 py-2 bg-[#223249] text-slate-300 rounded-lg font-medium hover:bg-[#223249]/80">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
