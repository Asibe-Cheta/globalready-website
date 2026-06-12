import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Shield } from 'lucide-react'
import { AI_PROCESSORS, AI_THIRD_PARTY_NOTICE, OPERATOR_IDENTITY } from '@/lib/legal'

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
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">Last updated: May 2026</p>
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
              <li><strong>CV and career content</strong> — When you use CV tools, job-fit checks, cover letters, or interview features, you may provide résumé text, work history, job descriptions, and related career information.</li>
              <li><strong>Payment information</strong> — Payments are processed by <strong>Stripe</strong>. We do not store your full card details on our servers. Stripe collects and processes payment information in accordance with their privacy policy. We may receive limited transaction data (e.g. last four digits, billing country) for support and receipts.</li>
              <li><strong>Subscription and plan information</strong> — We may store your selected paid plan, subscription status, access expiry or renewal date, Stripe customer ID, and related billing metadata so the website and mobile app can recognize your access.</li>
            </ul>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-6">Information collected automatically</h3>
            <p>
              We may collect device information, IP address, and usage data (e.g. pages visited, features used) to improve the Service and security.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">AI-Powered Features</h2>
            <p>
              GlobalReady offers AI-assisted features in the mobile app, including CV tailoring, job-fit analysis, professional summaries, cover letter generation, work-experience suggestions, interview feedback, and job matching. These text-based AI features may be processed using <strong>Google Gemini</strong> on our behalf via secure backend services.
            </p>
            <p>{AI_THIRD_PARTY_NOTICE}</p>
            <p>
              <strong>Voice interviews:</strong> Live mock interview voice sessions use <strong>Vapi</strong>, not Google Gemini. Only post-session feedback reports from interview transcripts may be processed with Google Gemini.
            </p>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-6">Data sent to AI providers</h3>
            <p>
              Depending on the feature you use, we may send limited content to our AI processors, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>CV or résumé content and structured career information</li>
              <li>Job descriptions and role details you choose to analyze</li>
              <li>Interview transcripts (for feedback generation only, not for live voice sessions)</li>
            </ul>
            <p>
              This data is processed to generate outputs for you within the Service. We do not sell this information, and we use it only to operate and improve the relevant features.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve the Service; to process transactions; to communicate with you; to personalize your experience; and to comply with legal obligations.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Third-Party Service Providers</h2>
            <p>
              We use trusted third parties to help us operate the Service. They process data only as needed to perform their role:
            </p>
            <div className="overflow-x-auto not-prose">
              <table className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Service</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {AI_PROCESSORS.map((row) => (
                    <tr key={row.service}>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">{row.service}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8">Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share data with the service providers listed above only as needed to operate the Service. We may disclose information if required by law or to protect our rights and safety.
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
