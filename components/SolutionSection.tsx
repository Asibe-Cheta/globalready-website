'use client'

import { motion } from 'framer-motion'
import { FileText, Target, TrendingUp } from 'lucide-react'
import { AI_DISCLOSURE } from '@/lib/legal'

const solutions = [
  {
    icon: FileText,
    title: "Build ATS-Optimized CVs",
    description: "Create international-standard CVs that pass Applicant Tracking Systems.",
    badge: "Included in Pro",
  },
  {
    icon: Target,
    title: "Job-Targeted Rewrites",
    description: "Optimize your CV for specific job roles with keyword matching.",
    badge: "Included in Pro",
  },
  {
    icon: TrendingUp,
    title: "Skill-to-Fund Pathways",
    description: "Discover practical income skills to fund your global applications.",
    badge: "Free guidance",
  }
]

export default function SolutionSection() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-[#101722]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">How GlobalReady Helps You Get Ready</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Everything you need to prepare for global opportunities</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-blue-50/30 dark:from-[#1a2432] dark:to-[#1a2432] border border-slate-200 dark:border-slate-700/50 hover:border-[#0d6cf2]/50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <solution.icon className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#0bda5e]/10 text-[#0bda5e] text-sm font-semibold">
                  {solution.badge}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{solution.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{solution.description}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-6 text-center max-w-3xl mx-auto">
          {AI_DISCLOSURE}
        </p>
      </div>
    </section>
  )
}
