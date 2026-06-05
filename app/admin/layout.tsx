'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BarChart3,
  GraduationCap,
  BookOpen,
  Briefcase,
  ListOrdered,
  Video,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
} from 'lucide-react'
import type { AdminRole } from '@/lib/admin-roles'
import { ADMIN_ROLE_LABELS } from '@/lib/admin-roles'

const allNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['full'] as AdminRole[] },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen, roles: ['full'] as AdminRole[] },
  { name: 'Virtual Sessions', href: '/admin/virtual-sessions', icon: Video, roles: ['full'] as AdminRole[] },
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase, roles: ['full', 'jobs'] as AdminRole[] },
  { name: 'In-Demand Roles', href: '/admin/in-demand-roles', icon: ListOrdered, roles: ['full'] as AdminRole[] },
  { name: 'Users', href: '/admin/users', icon: Users, roles: ['full'] as AdminRole[] },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard, roles: ['full'] as AdminRole[] },
  { name: 'Sales', href: '/admin/sales', icon: TrendingUp, roles: ['full'] as AdminRole[] },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['full'] as AdminRole[] },
  { name: 'Skills', href: '/admin/skills', icon: GraduationCap, roles: ['full'] as AdminRole[] },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['full'] as AdminRole[] },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [role, setRole] = useState<AdminRole>('full')
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return

    fetch('/api/admin/me', { credentials: 'include' })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        if (data.role === 'jobs' || data.role === 'full') {
          setRole(data.role)
        }
      })
      .catch(() => {})
  }, [isLoginPage, pathname])

  if (isLoginPage) {
    return <>{children}</>
  }

  const navigation = allNavigation.filter((item) => item.roles.includes(role))

  return (
    <div className="min-h-screen bg-[#101722]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#1a2432] border-r border-slate-700/50 z-50 transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 p-6 border-b border-slate-700/50">
            <div className="h-10 w-10 bg-[#0d6cf2] rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">GlobalReady</h1>
              <p className="text-xs text-slate-400">
                {role === 'jobs' ? 'Job posting' : 'Admin Dashboard'}
              </p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-[#0d6cf2] text-white'
                      : 'text-slate-400 hover:bg-[#223249] hover:text-white'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-slate-700/50 space-y-1">
            <a
              href="/api/admin/auth/logout"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-[#223249] hover:text-white transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </a>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-[#101722]/95 backdrop-blur-md border-b border-slate-700/50">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#1a2432]"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#0d6cf2] flex items-center justify-center">
                  <span className="text-white font-semibold">{role === 'jobs' ? 'J' : 'A'}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{ADMIN_ROLE_LABELS[role]}</p>
                  <p className="text-xs text-slate-400">
                    {role === 'jobs' ? 'Add jobs to the mobile board' : 'Full admin access'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
