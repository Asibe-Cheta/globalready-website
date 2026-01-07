'use client'

import { motion } from 'framer-motion'
import { Send, CheckCircle2 } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50 dark:from-[#101722] dark:via-[#101722] dark:to-[#101722]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[50%] bg-blue-400/10 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm backdrop-blur-sm">
              <span className="text-2xl">🌍</span>
              <span className="font-medium text-slate-900 dark:text-slate-200">GlobalReady 2.0 · Get Global-Ready</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
              Build ATS-Ready CVs.<br/>
              Get Ready for<br/>
              <span className="text-[#0d6cf2]">Global Opportunities.</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              No promises. Just preparation. Create international-standard CVs and discover practical income pathways to fund your global journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary flex items-center justify-center gap-2">
                <span>Start Building CV</span>
                <Send className="w-4 h-4" />
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 px-8 py-4 rounded-full font-semibold transition-all text-slate-900 dark:text-white">
                See How It Works
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-5 h-5 text-[#0bda5e]" />
              <span>1,200+ professionals prepared</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full border border-[#0d6cf2]/20"></div>
              <div className="absolute inset-8 rounded-full border border-[#0d6cf2]/10"></div>
              
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-blue-100 dark:border-[#1a2432] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white text-9xl font-bold opacity-20">
                  CV
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 bg-white dark:bg-[#1a2432] rounded-2xl p-4 shadow-2xl border-2 border-blue-100 dark:border-[#0d6cf2]/30"
              >
                <div className="bg-[#0d6cf2] rounded-xl p-3">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
