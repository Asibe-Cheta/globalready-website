import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Trash2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Delete Account | GlobalReady',
  description: 'How to delete your GlobalReady account and associated data.',
}

function Step({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {num}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{children}</div>
    </div>
  )
}

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="py-16 lg:py-24 flex flex-col items-center px-4">
        <div className="w-full max-w-[520px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b22] p-8 sm:p-10 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-primary uppercase">GlobalReady</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Delete Your Account</h1>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed mb-6">
            You can delete your GlobalReady account and all associated data directly from the mobile app, or by contacting our support team.
          </p>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] p-5 sm:p-6 mb-6">
            <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
              Option 1 — Delete in the app
            </h2>
            <div className="space-y-3">
              <Step num={1}>Open the <strong className="text-slate-700 dark:text-slate-200">GlobalReady</strong> app on your device</Step>
              <Step num={2}>Go to <strong className="text-slate-700 dark:text-slate-200">Profile → Settings</strong></Step>
              <Step num={3}>Scroll to the <strong className="text-slate-700 dark:text-slate-200">Account</strong> section and tap <strong className="text-slate-700 dark:text-slate-200">Delete Account</strong></Step>
              <Step num={4}>Confirm the deletion — your account will be permanently removed immediately</Step>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] p-5 sm:p-6 mb-6">
            <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
              Option 2 — Contact support
            </h2>
            <div className="space-y-3">
              <Step num={1}>
                Email us at <strong className="text-slate-700 dark:text-slate-200">contact@globalready.tech</strong> with the subject line{' '}
                <strong className="text-slate-700 dark:text-slate-200">&quot;Account Deletion Request&quot;</strong>
              </Step>
              <Step num={2}>Include the email address associated with your account</Step>
              <Step num={3}>We will process your request within 7 days and confirm by email</Step>
            </div>
          </div>

          <div className="rounded-xl border border-red-900/50 bg-red-950/30 dark:bg-red-950/20 p-4 mb-6">
            <p className="text-sm text-red-500 dark:text-red-400 leading-relaxed">
              ⚠️ Deleting your account is permanent and cannot be undone. All your CVs, assessments, course registrations, and profile data will be removed.
            </p>
          </div>

          <a
            href="mailto:contact@globalready.tech?subject=Account%20Deletion%20Request"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Email Support to Delete Account
          </a>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-500 dark:text-slate-500">
          © {new Date().getFullYear()} GlobalReady &nbsp;·&nbsp;
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          &nbsp;·&nbsp;
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
        </footer>
      </section>
      <Footer />
    </main>
  )
}
