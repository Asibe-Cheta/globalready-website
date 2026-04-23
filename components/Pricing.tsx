'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { AI_DISCLOSURE } from '@/lib/legal'

const freePlan = {
  name: 'Free',
  price: '€0',
  period: 'forever',
  features: [
    'Build your CV',
    'AI job-fit analysis',
    'Browse jobs',
  ],
  cta: 'Current plan',
  ctaHref: null,
  highlighted: false,
}

const proPlan = {
  name: 'GlobalReady Pro',
  price: '€9.99',
  period: '/month',
  badge: 'Most Popular',
  features: [
    'Everything in Free',
    'Unlimited CV downloads',
    'Unlimited AI tailoring',
    'Full job links',
    'Cancel anytime',
  ],
  cta: 'Get Pro →',
  ctaHref: '/upgrade',
  highlighted: true,
}

const plans = [freePlan, proPlan]

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
          <p className="text-slate-600 dark:text-slate-400 text-lg">One subscription. Everything you need to go global.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-[#1a2432] border ${plan.highlighted ? 'border-[#0d6cf2] ring-2 ring-blue-100 dark:ring-0 shadow-xl shadow-[#0d6cf2]/10' : 'border-slate-200 dark:border-slate-700/50 shadow-md'} rounded-2xl p-8 relative`}
            >
              {'badge' in plan && plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#0bda5e] text-black text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-[#0d6cf2]">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#0bda5e] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.ctaHref ? (
                <Link
                  href={plan.ctaHref}
                  className="btn-primary w-full block text-center"
                >
                  {plan.cta}
                </Link>
              ) : (
                <span className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 w-full py-3 rounded-full font-semibold text-center block text-slate-600 dark:text-slate-400">
                  {plan.cta}
                </span>
              )}
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
