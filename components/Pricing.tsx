'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    name: "Free CV",
    price: "$0",
    features: [
      "Watermarked CV",
      "Basic templates",
      "Export to PDF",
    ],
    cta: "Try Free",
    highlighted: false
  },
  {
    name: "ATS Pro CV",
    price: "$7",
    badge: "Most Popular",
    features: [
      "No watermark",
      "ATS-optimized",
      "Professional formatting",
      "Unlimited edits",
    ],
    cta: "Get Started",
    highlighted: true
  },
  {
    name: "Job-Targeted Rewrite",
    price: "$10",
    features: [
      "Keyword optimization",
      "Role-specific bullets",
      "ATS pass guarantee",
      "Repeatable per job",
    ],
    cta: "Optimize CV",
    highlighted: false
  }
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-blue-50/20 dark:from-[#101722] dark:to-[#101722]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Simple, Honest Pricing</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">No subscriptions. Pay only for what you need.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-[#1a2432] border ${plan.highlighted ? 'border-[#0d6cf2] ring-2 ring-blue-100 dark:ring-0 shadow-xl shadow-[#0d6cf2]/10' : 'border-slate-200 dark:border-slate-700/50 shadow-md'} rounded-2xl p-8 relative`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#0bda5e] text-black text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="text-5xl font-bold text-[#0d6cf2] mb-4">{plan.price}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#0bda5e] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={plan.highlighted ? 'btn-primary w-full' : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 w-full py-3 rounded-full font-semibold transition-all text-slate-900 dark:text-white'}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
