import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Shield } from 'lucide-react'
import { OPERATOR_IDENTITY } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy | GlobalReady',
  description: 'GlobalReady privacy policy. How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="py-16 lg:py-24">
        <div className="section-container max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">Last updated: April 2026</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
            <p>
              GlobalReady (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share information when you use our website and mobile application (the &quot;Service&quot;).
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Operator</h2>
            <p>{OPERATOR_IDENTITY}</p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Information We Collect</h2>
            <p>
              We collect information you provide directly to us and information collected automatically when you use our Service.
            </p>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-6">Information you provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email address</strong> — We collect your email when you create an account or contact us.</li>
              <li><strong>Name</strong> — We collect your name for your profile and to personalize the Service.</li>
              <li><strong>Photos (profile picture)</strong> — You may upload a profile picture; we store and display it as part of your account.</li>
              <li><strong>Payment information</strong> — Payments are processed by <strong>Stripe</strong>. We do not store your full card details on our servers. Stripe collects and processes payment information in accordance with their privacy policy. We may receive limited transaction data (e.g. last four digits, billing country) for support and receipts.</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-6">Information collected automatically</h3>
            <p>
              We may collect device information, IP address, and usage data (e.g. pages visited, features used) to improve the Service and security.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve the Service; to process transactions; to communicate with you; to personalize your experience; and to comply with legal obligations.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share data with service providers (e.g. Stripe for payments, hosting providers) only as needed to operate the Service. We may disclose information if required by law or to protect our rights and safety.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Security</h2>
            <p>
              We use industry-standard measures to protect your data, including encryption in transit and at rest. Payment data is handled by Stripe&apos;s secure systems.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, or port your data, or to object to or restrict certain processing. Contact us to exercise these rights.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Contact Us</h2>
            <p>
              For privacy-related questions or requests, contact us at{' '}
              <a href="mailto:contact@globalready.tech" className="text-primary hover:underline">contact@globalready.tech</a> or visit our{' '}
              <Link href="/support" className="text-primary hover:underline">Support</Link> page.
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
