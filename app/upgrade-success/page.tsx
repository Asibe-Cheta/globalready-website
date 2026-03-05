import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'You\'re Pro! | GlobalReady',
  description: 'Your GlobalReady Pro subscription is active.',
}

export default function UpgradeSuccessPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="py-20 lg:py-28">
        <div className="section-container max-w-lg mx-auto text-center">
          <div className="h-20 w-20 rounded-full bg-[#0bda5e]/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#0bda5e]" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            You&apos;re Pro!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your payment was successful. <strong>Reopen the GlobalReady app</strong> (or bring it to the foreground) to see your Pro subscription — it may take a few seconds to sync.
          </p>
          <Link
            href="/"
            className="inline-block btn-primary"
          >
            Back to Home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
