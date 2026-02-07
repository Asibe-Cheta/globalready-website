'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Globe, Loader2, Eye, EyeOff } from 'lucide-react'

function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const loginUrl = new URL('/api/auth/login', window.location.origin)
      loginUrl.searchParams.set('from', from)
      const res = await fetch(loginUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'same-origin',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        let msg = data.error || `Login failed (${res.status})`
        if (res.status === 0) {
          msg = 'No response from server. Try https://www.globalready.tech if you use globalready.tech without www. Test: open /api/auth/login in a new tab to confirm the login API is reachable.'
        } else if (res.status === 500) {
          msg = `${msg} Check Vercel env (ADMIN_PASSWORD, ADMIN_SESSION_SECRET) and redeploy.`
        }
        setError(msg)
        setLoading(false)
        return
      }
      if (data.success && data.redirect) {
        window.location.href = data.redirect
        return
      }
      router.push(from)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#101722] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 bg-[#0d6cf2] rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GlobalReady</h1>
            <p className="text-slate-400 text-sm">Admin sign in</p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 bg-[#223249] border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0d6cf2]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0d6cf2] focus:ring-inset"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0d6cf2] text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#0d6cf2] focus:ring-offset-2 focus:ring-offset-[#1a2432] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
          </button>
        </form>
        <p className="text-slate-500 text-xs text-center mt-6">
          Contact your team for the admin password.
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#101722] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}
