'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Check, CreditCard, ExternalLink, Loader2 } from 'lucide-react'
import { OPERATOR_IDENTITY } from '@/lib/legal'
import { getPricingPlan, pricingPlans, type PlanId } from '@/lib/pricing-plans'
import { buildSelarCheckoutUrl, getSelarProductCode, isSelarConfigured } from '@/lib/selar-checkout'

function PlanPaymentButtons({
  planId,
  onStripe,
  onSelar,
  stripeLoading,
  stripeDisabled,
  selarDisabled,
  compact = false,
}: {
  planId: PlanId
  onStripe: (planId: PlanId) => void
  onSelar: (planId: PlanId) => void
  stripeLoading?: boolean
  stripeDisabled?: boolean
  selarDisabled?: boolean
  compact?: boolean
}) {
  const showSelar = isSelarConfigured(planId)
  const sizeClass = compact ? 'text-xs sm:text-sm py-2.5' : 'text-sm sm:text-base py-3'

  return (
    <div
      className={`mt-4 flex flex-col gap-2.5 ${compact ? '' : 'sm:flex-row sm:gap-3'}`}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => onStripe(planId)}
        disabled={stripeDisabled || stripeLoading}
        className={`btn-stripe w-full flex items-center justify-center gap-2 ${sizeClass}`}
      >
        {stripeLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            <span>Opening Stripe…</span>
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
            <span className="font-semibold">Pay with Stripe</span>
          </>
        )}
      </button>
      {showSelar && (
        <button
          type="button"
          onClick={() => onSelar(planId)}
          disabled={selarDisabled}
          className={`btn-selar w-full flex items-center justify-center gap-2 ${sizeClass}`}
        >
          <span className="font-semibold">Pay with Selar</span>
          <ExternalLink className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
        </button>
      )}
    </div>
  )
}

function UpgradeContent() {
  const searchParams = useSearchParams()
  const uid = searchParams.get('uid')
  const emailFromUrl = searchParams.get('email')?.trim() ?? ''
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(getPricingPlan(searchParams.get('plan')).id)
  const [stripeLoadingPlanId, setStripeLoadingPlanId] = useState<PlanId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState(emailFromUrl)
  const [emailError, setEmailError] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userEmailLoading, setUserEmailLoading] = useState(false)

  const selectedPlan = getPricingPlan(selectedPlanId)
  const recurringDisclosure = selectedPlan.checkoutMode === 'subscription'
    ? 'Your subscription renews automatically unless cancelled before your next billing date.'
    : 'This is a one-time payment for the selected access period and does not automatically renew.'
  const selarEmail = uid ? userEmail : email.trim() || null
  const selarDisabled = Boolean(uid && userEmailLoading)
  const stripeDisabledNoEmail = !uid && !email.trim()

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

  async function startStripeCheckout(planId: PlanId) {
    if (!uid && !email.trim()) {
      setEmailError('Enter your GlobalReady account email first.')
      return
    }

    setStripeLoadingPlanId(planId)
    setError(null)
    setEmailError('')

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          uid ? { uid, plan: planId } : { email: email.trim(), plan: planId }
        ),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const message = data.error || data.message || 'Something went wrong.'
        if (uid) setError(message)
        else setEmailError(message)
        setStripeLoadingPlanId(null)
        return
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      const fallback = 'Could not start checkout.'
      if (uid) setError(fallback)
      else setEmailError(fallback)
    } catch {
      const fallback = 'Network error. Please try again.'
      if (uid) setError(fallback)
      else setEmailError(fallback)
    }
    setStripeLoadingPlanId(null)
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
                    ? 'border-[#0d6cf2] bg-[#0d6cf2]/10 ring-1 ring-[#0d6cf2]/40'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] hover:border-[#0d6cf2]/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{plan.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
                  </div>
                  {plan.badge && (
                    <span className="text-[10px] font-bold uppercase rounded-full bg-[#0bda5e] text-black px-2 py-1 shrink-0">
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
                <PlanPaymentButtons
                  planId={plan.id}
                  onStripe={startStripeCheckout}
                  onSelar={handleSelarPay}
                  stripeLoading={stripeLoadingPlanId === plan.id}
                  stripeDisabled={stripeDisabledNoEmail}
                  selarDisabled={selarDisabled}
                  compact
                />
              </div>
            ))}
          </div>

          {uid ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2432] p-8 mb-6">
              <ul className="space-y-3 mb-6">
                {['Everything in Free Plan', ...selectedPlan.features, 'Cancel anytime on recurring plans'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#0bda5e] flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                Pay for <span className="text-[#0d6cf2]">{selectedPlan.name}</span> — {selectedPlan.price} {selectedPlan.period}
              </p>
              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm mb-4 text-center">{error}</p>
              )}
              <PlanPaymentButtons
                planId={selectedPlanId}
                onStripe={startStripeCheckout}
                onSelar={handleSelarPay}
                stripeLoading={stripeLoadingPlanId === selectedPlanId}
                selarDisabled={selarDisabled}
              />
              {userEmailLoading && isSelarConfigured(selectedPlanId) && (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                  Loading your account email for Selar checkout…
                </p>
              )}
            </div>
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
                disabled={stripeLoadingPlanId !== null}
              />
              {emailError && (
                <p className="text-red-500 dark:text-red-400 text-sm mb-4">{emailError}</p>
              )}
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                Pay for <span className="text-[#0d6cf2]">{selectedPlan.name}</span> — {selectedPlan.price} {selectedPlan.period}
              </p>
              <PlanPaymentButtons
                planId={selectedPlanId}
                onStripe={startStripeCheckout}
                onSelar={handleSelarPay}
                stripeLoading={stripeLoadingPlanId === selectedPlanId}
                stripeDisabled={stripeDisabledNoEmail}
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
