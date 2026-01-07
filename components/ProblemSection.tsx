'use client'

import { motion } from 'framer-motion'
import { XCircle, AlertCircle, TrendingDown } from 'lucide-react'

const problems = [
  {
    icon: XCircle,
    title: "CVs That Fail ATS Systems",
    description: "Your CV gets rejected before a human even sees it. Generic formatting doesn't work internationally."
  },
  {
    icon: AlertCircle,
    title: "Generic CVs for Every Job",
    description: "One CV for all applications means you're never optimized for the specific role you want."
  },
  {
    icon: TrendingDown,
    title: "Limited Funds for Applications",
    description: "Application fees, tests, and relocation costs add up. You need practical income now."
  }
]

export default function ProblemSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#1a2432]/50 dark:to-[#1a2432]/50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">You're Not Alone</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">These challenges stop thousands every year</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-[#1a2432] border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all"
            >
              <problem.icon className="w-12 h-12 text-[#ff4d4d] mb-4" />
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{problem.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
