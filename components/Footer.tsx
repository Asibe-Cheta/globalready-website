'use client'

import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Contact', href: '/support' },
    { label: 'Blog', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Support', href: '/support' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Disclaimer', href: '#disclaimer' },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101722]">
      <div className="section-container py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="h-10 w-10 bg-[#0d6cf2] rounded-xl flex items-center justify-center shadow-lg shadow-[#0d6cf2]/20">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">GlobalReady</span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm">
              Build ATS-ready CVs and discover income pathways to fund your global journey.
            </p>
          </motion.div>

          {/* Links Grid */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center"
        >
          <p className="text-sm text-slate-600 dark:text-slate-500">
            © {currentYear} GlobalReady. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
