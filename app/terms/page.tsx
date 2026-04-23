import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { FileText } from 'lucide-react'
import { OPERATOR_IDENTITY, AI_DISCLOSURE } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Terms of Service | GlobalReady',
  description: 'GlobalReady terms of service for website and mobile app use.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="py-16 lg:py-24">
        <div className="section-container max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">Last updated: April 2026</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
            <p>
              These Terms of Service govern your access to and use of GlobalReady&apos;s website and mobile application. By using the Service, you agree to these terms.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Operator</h2>
            <p>{OPERATOR_IDENTITY}</p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Plans and Billing</h2>
            <p>
              GlobalReady offers a free plan with limited access and a paid plan, GlobalReady Pro, billed at EUR 9.99 per month. Pro renews automatically unless cancelled before your next billing date.
            </p>
            <p>
              Some opportunities shown in GlobalReady may link to third-party platforms that have separate registration steps, subscriptions, or fees.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Cancellation</h2>
            <p>
              You can cancel your subscription from your account billing settings or by contacting support at{' '}
              <a href="mailto:contact@globalready.tech" className="text-primary hover:underline">contact@globalready.tech</a>.
              Cancellation stops renewal at the end of the current billing period.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">AI Features Disclaimer</h2>
            <p>{AI_DISCLOSURE}</p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Acceptable Use</h2>
            <p>
              You agree not to misuse the Service, interfere with its operation, attempt unauthorized access, or use the Service for unlawful purposes.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Contact</h2>
            <p>
              For legal, billing, or support requests, contact{' '}
              <a href="mailto:contact@globalready.tech" className="text-primary hover:underline">contact@globalready.tech</a>.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link href="/" className="text-primary hover:underline font-medium">← Back to Home</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
