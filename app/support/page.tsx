import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { HelpCircle, Mail, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Support | GlobalReady',
  description: 'Get help with GlobalReady. Contact us, FAQs, and resources.',
}

export default function SupportPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="py-16 lg:py-24">
        <div className="section-container max-w-3xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Support</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">How to get help with GlobalReady</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-600 dark:text-slate-400">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact us</h2>
              </div>
              <p className="mb-2">
                For questions, technical issues, or feedback, email us at:
              </p>
              <a href="mailto:contact@globalready.tech" className="text-primary font-medium hover:underline">
                contact@globalready.tech
              </a>
              <p className="mt-3 text-sm">
                We aim to respond within 1–2 business days.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Frequently asked questions</h2>
              <ul className="space-y-4">
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">How do I reset my password?</strong>
                  <p className="mt-1">Use the &quot;Forgot password&quot; link on the login screen. You’ll receive an email with a link to set a new password.</p>
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">I’m having trouble with payments.</strong>
                  <p className="mt-1">Payments are processed by Stripe. If a charge failed or you need a refund, contact us at contact@globalready.tech with your email and order details.</p>
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">How do I update my profile or CV?</strong>
                  <p className="mt-1">Open the app, go to your profile or CV section, and edit the fields you want to change. Changes are saved automatically.</p>
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">I want to delete my account.</strong>
                  <p className="mt-1">Email us at contact@globalready.tech with the subject &quot;Account deletion&quot; and we’ll process your request in line with our privacy policy.</p>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 p-6 flex items-start gap-3">
              <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Privacy & legal</h2>
                <p className="mb-2">
                  For how we collect, use, and protect your data, see our Privacy Policy. For platform terms, billing, and cancellation details, see our Terms and Billing page.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/privacy" className="text-primary font-medium hover:underline">
                    View Privacy Policy →
                  </Link>
                  <Link href="/terms" className="text-primary font-medium hover:underline">
                    View Terms of Service →
                  </Link>
                  <Link href="/billing" className="text-primary font-medium hover:underline">
                    Billing & cancellation →
                  </Link>
                </div>
              </div>
            </div>
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
