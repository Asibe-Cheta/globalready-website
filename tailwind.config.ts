import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#0d6cf2',
        'primary-hover': '#0b5dd1',
        'background-dark': '#101722',
        'background-light': '#f8fafc',
        'surface-dark': '#1a2432',
        'surface-light': '#ffffff',
        'surface-alt-light': '#f1f5f9',
        'surface-lighter': '#223249',
        'accent-green': '#0bda5e',
        'accent-red': '#ff4d4d',
        'border-light': '#e2e8f0',
        'border-dark': '#334155',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '1rem',
        'lg': '2rem',
        'xl': '3rem',
      },
    },
  },
  plugins: [],
}
export default config

