'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Check, Loader2 } from 'lucide-react'

function UpgradeContent() {
  const searchParams = useSearchParams()
  const uid = searchParams.get('uid')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')

  async function handleGetPro() {
    if (!uid) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || data.message || 'Something went wrong.')
        setLoading(false)
        return
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError('Could not start checkout.')
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  async function handleEmailCheckout() {
    setEmailLoading(true)
    setEmailError('')
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setEmailError(data.message || data.error || 'Something went wrong.')
        setEmailLoading(false)
        return
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      setEmailError('Could not start checkout.')
    } catch {
      setEmailError('Network error. Please try again.')
    }
    setEmailLoading(false)
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="py-16 lg:py-24">
        <div className="section-container max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
            GlobalReady Pro
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-10">
            €9.99/month · Unlimited CVs, AI tailoring, full job links. Cancel anytime.
          </p>

          {uid ? (
            <>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] p-8 mb-6">
                <ul className="space-y-3 mb-8">
                  {[
                    'Everything in Free',
                    'Unlimited CV downloads',
                    'Unlimited AI tailoring',
                    'Full job links',
                    'Cancel anytime',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#0bda5e] flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                {error && (
                  <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>
                )}
                <button
                  onClick={handleGetPro}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Redirecting to checkout…
                    </>
                  ) : (
                    'Get Pro →'
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] p-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Enter your GlobalReady account email to link your subscription
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Use the same email you use in the GlobalReady app. Your Pro status will sync to the app after payment.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={emailLoading}
              />
              {emailError && (
                <p className="text-red-500 dark:text-red-400 text-sm mb-4">{emailError}</p>
              )}
              <button
                onClick={handleEmailCheckout}
                disabled={emailLoading || !email.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {emailLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting to checkout…
                  </>
                ) : (
                  'Get Pro →'
                )}
              </button>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-4 text-center">
                No account yet? <Link href="/#pricing" className="text-primary hover:underline">Sign up in the app</Link> first, then return here.
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <Navigation />
        <section className="py-16 lg:py-24">
          <div className="section-container max-w-2xl mx-auto text-center">
            <div className="animate-pulse text-slate-500 dark:text-slate-400">Loading…</div>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <UpgradeContent />
    </Suspense>
  )
}
