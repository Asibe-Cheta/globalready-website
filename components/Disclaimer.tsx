'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function Disclaimer() {
  return (
    <section className="py-12 bg-gradient-to-b from-blue-50/20 to-white dark:from-[#101722] dark:to-[#101722]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-6 md:p-8 border border-orange-500/30 bg-orange-50 dark:bg-orange-500/10"
        >
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-bold text-orange-900 dark:text-orange-200">Important Disclaimer</h3>
              <p className="text-sm text-orange-800 dark:text-orange-100/90 leading-relaxed">
                Our CV optimization and rewriting services are designed to enhance your resume format, 
                structure, and ATS compatibility. While we strive to improve your CV's presentation and 
                keyword optimization, we cannot guarantee job offers or interview outcomes. Your success 
                depends on various factors including your qualifications, experience, and the competitive 
                landscape of your target roles. Please review all changes carefully before submitting 
                your CV to potential employers.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
