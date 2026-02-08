'use client'

import { useEffect, useState } from 'react'
import { Mail, Loader2, Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const [adminEmails, setAdminEmails] = useState<string[]>([])
  const [emailsInput, setEmailsInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/settings', { credentials: 'include' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load settings')
        }
        const data = await res.json()
        if (!cancelled) {
          setAdminEmails(Array.isArray(data.admin_emails) ? data.admin_emails : [])
          setEmailsInput((Array.isArray(data.admin_emails) ? data.admin_emails : []).join('\n'))
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const emails = emailsInput
      .split(/[\n,]+/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0 && s.includes('@'))
    const unique = [...new Set(emails)]
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ admin_emails: unique }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setAdminEmails(unique)
      setEmailsInput(unique.join('\n'))
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage admin notification emails and preferences.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">{error}</div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400">
          Settings saved.
        </div>
      )}

      {/* Admin identity */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Admin account</h2>
        <div className="flex items-center gap-3 text-slate-300">
          <Mail className="w-5 h-5 text-slate-400" />
          <span>admin@globalready.tech</span>
        </div>
        <p className="text-sm text-slate-500 mt-2">Used for dashboard access. Change in your deployment env if needed.</p>
      </div>

      {/* Notification emails */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Notification emails</h2>
        <p className="text-slate-400 text-sm mb-4">
          These addresses receive alerts for new signups, course registrations, and successful payments (from the mobile app).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email addresses (one per line or comma-separated)
            </label>
            <textarea
              value={emailsInput}
              onChange={(e) => setEmailsInput(e.target.value)}
              rows={4}
              placeholder={'admin@globalready.tech\nteam@globalready.tech'}
              className="w-full px-4 py-3 bg-[#223249] border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0d6cf2]"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save
          </button>
        </form>
      </div>
    </div>
  )
}
