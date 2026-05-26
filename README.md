# GlobalReady - CV Preparation Platform

A comprehensive web-based platform for building ATS-ready CVs and discovering income pathways to fund your global journey.

## Features

- 🌍 **Global Opportunities** - Prepare for international job opportunities
- 📄 **ATS-Optimized CVs** - Create CVs that pass Applicant Tracking Systems
- 💼 **GlobalReady Pro** - Premium access plans for CV downloads, AI tailoring, job-fit checks, and full job links
- 📊 **Admin Dashboard** - Comprehensive admin panel for managing the platform
- 🎨 **Modern UI** - Beautiful dark theme with light mode support
- ⚡ **Fast & Responsive** - Built with Next.js 14 and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Inter

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd globalready-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
globalready-website/
├── app/
│   ├── admin/          # Admin dashboard pages
│   ├── globals.css     # Global styles and theme
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/         # React components
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── ProblemSection.tsx
│   ├── SolutionSection.tsx
│   ├── HowItWorks.tsx
│   ├── Pricing.tsx
│   ├── Disclaimer.tsx
│   ├── Footer.tsx
│   └── ThemeToggle.tsx
├── public/            # Static assets
└── tailwind.config.ts # Tailwind configuration
```

## Admin Dashboard

Access the admin dashboard at `/admin`:

- **Dashboard**: Overview with stats and revenue charts
- **Users**: User management with search and filters
- **Sales**: Sales & revenue tracking with product breakdown
- **Analytics**: User path analytics and conversion funnels
- **Skills**: Skill insights and learning metrics

## Design System

### Colors

- **Primary**: `#0d6cf2` (Blue)
- **Background Dark**: `#101722` (Dark Navy)
- **Surface Dark**: `#1a2432` (Card Background)
- **Surface Lighter**: `#223249` (Hover States)
- **Accent Green**: `#0bda5e`
- **Accent Red**: `#ff4d4d`

### Typography

- **Font Family**: Inter
- **Base**: Sans-serif

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<repository-url>)

## License

Private - All rights reserved
