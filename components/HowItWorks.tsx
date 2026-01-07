'use client'

import { motion } from 'framer-motion'
import { Route, Edit, Download, DollarSign } from 'lucide-react'

const steps = [
  {
    icon: Route,
    title: "Choose Your Path",
    description: "Build new CV or upload existing"
  },
  {
    icon: Edit,
    title: "Create/Optimize",
    description: "Fill guided form or paste job description"
  },
  {
    icon: Download,
    title: "Download CV",
    description: "Get ATS-ready PDF instantly"
  },
  {
    icon: DollarSign,
    title: "Earn to Fund",
    description: "Discover income pathways matched to your skills"
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-[#1a2432]/50 dark:to-[#1a2432]/50">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">How It Works</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Four simple steps to get global-ready</p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#0d6cf2] rounded-full flex items-center justify-center shadow-lg">
                <step.icon className="w-6 h-6 text-white" />
              </div>

              <div className="bg-white dark:bg-[#1a2432] border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 flex-1 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
