'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, FileText, GraduationCap, DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type DashboardStats = {
  total_users: number
  active_users_30d: number
  total_revenue: number
  total_orders: number
  total_cvs: number
  cvs_paid: number
  total_enrollments: number
  total_courses: number
  total_assessments: number
  avg_order_value: number
  conversion_rate: number
}

type RevenuePoint = { date: string; revenue: number; orders: number }

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [daysFilter, setDaysFilter] = useState(30)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [statsRes, revenueRes] = await Promise.all([
          fetch('/api/admin/dashboard/stats'),
          fetch(`/api/admin/dashboard/revenue?days=${daysFilter}`),
        ])
        if (cancelled) return
        if (!statsRes.ok) {
          const data = await statsRes.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load stats')
        }
        if (!revenueRes.ok) {
          const data = await revenueRes.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load revenue')
        }
        const [statsJson, revenueJson] = await Promise.all([statsRes.json(), revenueRes.json()])
        setStats(statsJson)
        setRevenueData(Array.isArray(revenueJson) ? revenueJson : [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [daysFilter])

  const chartData = revenueData.map((d) => ({
    day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: d.revenue / 100,
    fullDate: d.date,
  }))

  const statsCards = stats
    ? [
        {
          name: 'Total Revenue',
          value: formatCents(stats.total_revenue),
          change: null,
          icon: DollarSign,
          color: 'bg-blue-500/10 text-blue-500',
        },
        {
          name: 'CVs Sold',
          value: String(stats.cvs_paid),
          change: null,
          icon: FileText,
          color: 'bg-purple-500/10 text-purple-500',
        },
        {
          name: 'Active Users (30d)',
          value: String(stats.active_users_30d),
          change: null,
          icon: Users,
          color: 'bg-green-500/10 text-green-500',
        },
        {
          name: 'Enrollments',
          value: String(stats.total_enrollments),
          change: null,
          icon: GraduationCap,
          color: 'bg-orange-500/10 text-orange-500',
        },
      ]
    : []

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back, Admin User</p>
      </div>

      <div className="flex gap-3">
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            onClick={() => setDaysFilter(d)}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              daysFilter === d ? 'bg-[#0d6cf2] text-white' : 'bg-[#1a2432] text-slate-300 hover:bg-[#223249]'
            }`}
          >
            {d === 7 ? 'Last 7 Days' : d === 30 ? 'This Month' : 'Last 3 Months'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 animate-pulse">
              <div className="h-12 w-12 rounded-xl bg-slate-700 mb-4" />
              <div className="h-4 w-24 bg-slate-700 rounded mb-2" />
              <div className="h-8 w-32 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <div key={stat.name} className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.change != null && (
                  <span className="text-[#0bda5e] text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-1">{stat.name}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Revenue Trend</h3>
            <p className="text-sm text-slate-400">Daily revenue over time (amounts in USD)</p>
          </div>
        </div>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-slate-400">Loading chart…</div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-slate-400">No revenue data for this period</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
              <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a2432',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCents(value * 100), 'Revenue']}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0d6cf2"
                strokeWidth={3}
                dot={{ fill: '#0d6cf2', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {stats && (
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Total Users</p>
              <p className="text-white font-semibold">{stats.total_users}</p>
            </div>
            <div>
              <p className="text-slate-400">Total Orders</p>
              <p className="text-white font-semibold">{stats.total_orders}</p>
            </div>
            <div>
              <p className="text-slate-400">Avg Order Value</p>
              <p className="text-white font-semibold">{formatCents(stats.avg_order_value)}</p>
            </div>
            <div>
              <p className="text-slate-400">Conversion Rate</p>
              <p className="text-white font-semibold">{stats.conversion_rate}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
