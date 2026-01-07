'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check localStorage after mount
    const theme = localStorage.getItem('theme')
    const html = document.documentElement
    
    if (theme === 'dark') {
      // Apply dark mode if saved preference is dark
      html.classList.add('dark')
      setIsDark(true)
    } else {
      // Ensure light mode (remove dark class)
      html.classList.remove('dark')
      setIsDark(false)
      // Save light mode preference if not set
      if (!theme) {
        localStorage.setItem('theme', 'light')
      }
    }
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    
    if (isDark) {
      // Switch to LIGHT mode
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      // Switch to DARK mode
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  // Show placeholder while mounting
  if (!mounted) {
    return (
      <button 
        className="p-2 rounded-lg bg-slate-100 border border-slate-200" 
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5 text-slate-700" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg glass-panel hover:bg-white/10 dark:hover:bg-white/10 transition-all"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </button>
  )
}
