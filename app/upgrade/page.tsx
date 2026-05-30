'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Check, ExternalLink, Loader2 } from 'lucide-react'
import { OPERATOR_IDENTITY } from '@/lib/legal'
import { getPricingPlan, pricingPlans, type PlanId } from '@/lib/pricing-plans'
import { buildSelarCheckoutUrl, getSelarProductCode, isSelarConfigured } from '@/lib/selar-checkout'

function SelarCheckoutButton({
  planId,
  onPay,
  disabled,
  className = 'mt-3 w-full',
}: {
  planId: PlanId
  onPay: (planId: PlanId) => void
  disabled?: boolean
  className?: string
}) {
  if (!isSelarConfigured(planId)) return null

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onPay(planId)
      }}
      disabled={disabled}
      className={`${className} flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:cursor-not-allowed disabled:opacity-50`}
    >
      Pay with Selar instead
      <ExternalLink className="h-4 w-4" />
    </button>
  )
}

function UpgradeContent() {
  const searchParams = useSearchParams()
  const uid = searchParams.get('uid')
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(getPricingPlan(searchParams.get('plan')).id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userEmailLoading, setUserEmailLoading] = useState(false)

  const selectedPlan = getPricingPlan(selectedPlanId)
  const recurringDisclosure = selectedPlan.checkoutMode === 'subscription'
    ? 'Your subscription renews automatically unless cancelled before your next billing date.'
    : 'This is a one-time payment for the selected access period and does not automatically renew.'
  const selarEmail = uid ? userEmail : email.trim() || null
  const selarDisabled = Boolean(uid && userEmailLoading)

  useEffect(() => {
    if (!uid) return

    let cancelled = false
    setUserEmailLoading(true)

    fetch(`/api/upgrade/user-email?uid=${encodeURIComponent(uid)}`)
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        if (!cancelled && typeof data.email === 'string') {
          setUserEmail(data.email)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setUserEmailLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [uid])

  const handleSelarPay = useCallback((planId: PlanId) => {
    const productCode = getSelarProductCode(planId)
    if (!productCode) return

    const checkoutUrl = buildSelarCheckoutUrl(productCode, selarEmail)
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
  }, [selarEmail])

  async function handleGetPro() {
    if (!uid) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, plan: selectedPlanId }),
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
        body: JSON.stringify({ email, plan: selectedPlanId }),
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
            Unlock job application links, download your CV, tailor your CV, check your fit, generate cover letters and apply with more confidence.
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2432] p-4 text-sm text-slate-600 dark:text-slate-300 mb-6">
            Premium access activates immediately after successful payment. When access expires or is cancelled, you return to the Free Plan automatically unless stated otherwise at checkout. You are purchasing {selectedPlan.name} for {selectedPlan.price} {selectedPlan.period}. {recurringDisclosure} Some job opportunities may link to third-party platforms that require separate registration, subscription, or fees.
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPlanId(plan.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedPlanId(plan.id)
                  }
                }}
                className={`text-left rounded-2xl border p-4 transition cursor-pointer ${
                  selectedPlanId === plan.id
                    ? 'border-[#0d6cf2] bg-[#0d6cf2]/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] hover:border-[#0d6cf2]/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{plan.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
                  </div>
                  {plan.badge && (
                    <span className="text-[10px] font-bold uppercase rounded-full bg-[#0bda5e] text-black px-2 py-1">
                      {plan.badge}
                    </span>
                  )}
                </div>
                {plan.message && (
                  <p className="text-xs text-[#0bda5e] font-medium mt-2">{plan.message}</p>
                )}
                <p className="mt-3">
                  <span className="text-2xl font-bold text-[#0d6cf2]">{plan.price}</span>{' '}
                  <span className="text-sm text-slate-500 dark:text-slate-400">{plan.period}</span>
                </p>
                <SelarCheckoutButton
                  planId={plan.id}
                  onPay={handleSelarPay}
                  disabled={selarDisabled}
                />
              </div>
            ))}
          </div>

          {uid ? (
            <>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] p-8 mb-6">
                <ul className="space-y-3 mb-8">
                  {['Everything in Free Plan', ...selectedPlan.features, 'Cancel anytime on recurring plans'].map((feature, i) => (
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
                    `Continue with ${selectedPlan.name} →`
                  )}
                </button>
                <SelarCheckoutButton
                  planId={selectedPlanId}
                  onPay={handleSelarPay}
                  disabled={selarDisabled}
                  className="mt-3 w-full"
                />
                {userEmailLoading && isSelarConfigured(selectedPlanId) && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
                    Loading your account email for Selar checkout…
                  </p>
                )}
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
                  `Continue with ${selectedPlan.name} →`
                )}
              </button>
              <SelarCheckoutButton
                planId={selectedPlanId}
                onPay={handleSelarPay}
                className="mt-3 w-full"
              />
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-4 text-center">
                No account yet? <Link href="/#pricing" className="text-primary hover:underline">Sign up in the app</Link> first, then return here.
              </p>
            </div>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-500 text-center mt-6">
            {OPERATOR_IDENTITY} · <Link href="/terms" className="text-primary hover:underline">Terms</Link> · <Link href="/privacy" className="text-primary hover:underline">Privacy</Link> · <Link href="/billing" className="text-primary hover:underline">Billing & cancellation</Link>
          </p>
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
