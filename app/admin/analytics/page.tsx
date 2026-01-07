'use client'

import { TrendingUp, Users, MousePointerClick, ArrowRight } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const analyticsStats = [
  { label: 'Total Page Views', value: '45.2k', change: '+23%', icon: MousePointerClick },
  { label: 'Unique Visitors', value: '12.4k', change: '+18%', icon: Users },
  { label: 'Bounce Rate', value: '32.1%', change: '-5%', icon: TrendingUp },
  { label: 'Avg Session', value: '4m 32s', change: '+12%', icon: TrendingUp },
]

const pageViewsData = [
  { day: 'Mon', views: 4200, visitors: 1200 },
  { day: 'Tue', views: 4800, visitors: 1350 },
  { day: 'Wed', views: 5100, visitors: 1420 },
  { day: 'Thu', views: 4900, visitors: 1380 },
  { day: 'Fri', views: 5500, visitors: 1520 },
  { day: 'Sat', views: 5200, visitors: 1450 },
  { day: 'Sun', views: 4700, visitors: 1320 },
]

const userPath = [
  { step: 'Landing Page', users: 10000, dropoff: 0 },
  { step: 'View Pricing', users: 6500, dropoff: 35 },
  { step: 'Select Plan', users: 3200, dropoff: 50.8 },
  { step: 'Checkout', users: 1800, dropoff: 43.8 },
  { step: 'Payment', users: 1200, dropoff: 33.3 },
  { step: 'Completed', users: 1100, dropoff: 8.3 },
]

const topPages = [
  { page: '/', views: 12450, bounce: '28%', avgTime: '3m 45s' },
  { page: '/pricing', views: 8750, bounce: '42%', avgTime: '2m 12s' },
  { page: '/how-it-works', views: 5420, bounce: '35%', avgTime: '4m 10s' },
  { page: '/features', views: 3820, bounce: '38%', avgTime: '2m 55s' },
  { page: '/admin', views: 120, bounce: '5%', avgTime: '15m 32s' },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Path Analytics</h1>
        <p className="text-slate-400">Track user journeys and conversion funnels</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat) => (
          <div key={stat.label} className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-purple-500" />
              </div>
              <span className={`text-sm font-semibold flex items-center gap-1 ${
                stat.label === 'Bounce Rate' ? 'text-[#ff4d4d]' : 'text-[#0bda5e]'
              }`}>
                {stat.change.includes('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Page Views Chart */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Traffic Overview</h3>
            <p className="text-sm text-slate-400">Page views and unique visitors</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={pageViewsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
            <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a2432', 
                border: '1px solid #475569',
                borderRadius: '8px'
              }}
            />
            <Area type="monotone" dataKey="views" stackId="1" stroke="#0d6cf2" fill="#0d6cf2" fillOpacity={0.3} />
            <Area type="monotone" dataKey="visitors" stackId="2" stroke="#0bda5e" fill="#0bda5e" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Conversion Funnel</h3>
        <div className="space-y-4">
          {userPath.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0d6cf2] flex items-center justify-center text-white font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{step.step}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-sm">{step.users.toLocaleString()} users</span>
                      {step.dropoff > 0 && (
                        <span className="text-[#ff4d4d] text-sm">-{step.dropoff}%</span>
                      )}
                    </div>
                  </div>
                  <div className="relative h-8 bg-[#223249] rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0d6cf2] to-[#0bda5e] transition-all"
                      style={{ width: `${(step.users / userPath[0].users) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              {index < userPath.length - 1 && (
                <div className="flex items-center justify-center my-2">
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Top Pages</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#223249]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Page</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Views</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Bounce Rate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Avg. Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {topPages.map((page) => (
                <tr key={page.page} className="hover:bg-[#223249] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{page.page}</td>
                  <td className="px-4 py-3 text-slate-300">{page.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      parseFloat(page.bounce) > 40 
                        ? 'bg-red-500/10 text-[#ff4d4d]' 
                        : 'bg-green-500/10 text-[#0bda5e]'
                    }`}>
                      {page.bounce}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{page.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

