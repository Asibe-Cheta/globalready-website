import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CreditCard } from 'lucide-react'
import { pricingPlans } from '@/lib/pricing-plans'

export const metadata: Metadata = {
  title: 'Billing & Cancellation | GlobalReady',
  description: 'How GlobalReady Pro billing works and how to cancel your subscription.',
}

export default function BillingPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="py-16 lg:py-24">
        <div className="section-container max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Billing & Cancellation</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">GlobalReady Pro subscription information</p>
            </div>
          </div>

          <div className="space-y-6 text-slate-600 dark:text-slate-400">
            <p>
              GlobalReady offers multiple premium access periods. Recurring plans renew automatically unless cancelled before your next billing date; one-time access plans expire at the end of the selected access period.
            </p>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-[#1a2432]">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Current premium plans</h2>
              <ul className="space-y-2">
                {pricingPlans.map((plan) => (
                  <li key={plan.id} className="flex items-center justify-between gap-4 text-sm">
                    <span>{plan.name}</span>
                    <strong className="text-slate-900 dark:text-white">{plan.price} {plan.period}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-[#1a2432]">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">How to cancel</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>For recurring Monthly Pro or Yearly Pro plans, open the GlobalReady app and go to your account subscription settings, then choose cancel.</li>
                <li>If you need help, email <a href="mailto:contact@globalready.tech" className="text-primary hover:underline">contact@globalready.tech</a> with the account email used for your subscription.</li>
                <li>Cancellation stops auto-renewal at the end of your current billing period. One-time access plans do not renew.</li>
              </ul>
            </div>
            <p className="text-sm">
              Some job opportunities may link to third-party platforms that require separate registration, subscriptions, or fees.
            </p>
            <p className="text-sm">
              See also: <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
