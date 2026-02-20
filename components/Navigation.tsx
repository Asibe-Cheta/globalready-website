'use client'

import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#101722]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">GlobalReady</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">How It Works</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Pricing</Link>
            <Link href="/support" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Support</Link>
            <Link href="/privacy" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">Privacy</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="#pricing">
              <button className="bg-[#0d6cf2] hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-[#0d6cf2]/20">
                Get Started
              </button>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg glass-panel text-white">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-slate-200 dark:border-slate-800">
            <Link href="#features" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Features</Link>
            <Link href="#how-it-works" className="block text-sm font-medium text-slate-700 dark:text-slate-300">How It Works</Link>
            <Link href="#pricing" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pricing</Link>
            <Link href="/support" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Support</Link>
            <Link href="/privacy" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Privacy</Link>
            <button className="w-full bg-[#0d6cf2] text-white font-semibold px-6 py-3 rounded-full">Get Started</button>
          </div>
        )}
      </div>
    </nav>
  )
}
