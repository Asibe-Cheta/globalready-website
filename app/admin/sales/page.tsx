'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, ShoppingCart, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type DashboardStats = {
  total_revenue: number
  total_orders: number
  avg_order_value: number
  conversion_rate: number
}

type RevenuePoint = { date: string; revenue: number; orders: number }

type Payment = {
  id: string
  amount: number
  currency: string
  status: string
  reference: string | null
  created_at: string
  profiles: { full_name: string | null; email: string | null } | null
}

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export default function SalesPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [daysFilter, setDaysFilter] = useState(30)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [statsRes, revenueRes, paymentsRes] = await Promise.all([
          fetch('/api/admin/dashboard/stats'),
          fetch(`/api/admin/dashboard/revenue?days=${daysFilter}`),
          fetch('/api/admin/payments?limit=10'),
        ])
        if (cancelled) return
        if (!statsRes.ok) throw new Error((await statsRes.json().catch(() => ({}))).error || 'Failed to load stats')
        if (!revenueRes.ok) throw new Error((await revenueRes.json().catch(() => ({}))).error || 'Failed to load revenue')
        if (!paymentsRes.ok) throw new Error((await paymentsRes.json().catch(() => ({}))).error || 'Failed to load payments')
        const [statsJson, revenueJson, paymentsJson] = await Promise.all([
          statsRes.json(),
          revenueRes.json(),
          paymentsRes.json(),
        ])
        setStats(statsJson)
        setRevenueData(Array.isArray(revenueJson) ? revenueJson : [])
        setPayments(paymentsJson.payments ?? [])
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
    date: d.date,
    month: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: d.revenue / 100,
    orders: d.orders,
  }))

  const statsCards = stats
    ? [
        { label: 'Total Revenue', value: formatCents(stats.total_revenue), icon: DollarSign },
        { label: 'Total Orders', value: String(stats.total_orders), icon: ShoppingCart },
        { label: 'Avg Order Value', value: formatCents(stats.avg_order_value), icon: TrendingUp },
        { label: 'Conversion Rate', value: `${stats.conversion_rate}%`, icon: TrendingUp },
      ]
    : []

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white mb-2">Sales & Revenue</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Sales & Revenue</h1>
        <p className="text-slate-400">Track sales performance and revenue metrics</p>
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
        <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#1a2432] text-slate-300 rounded-lg font-medium text-sm hover:bg-[#223249] cursor-not-allowed" title="Coming soon">
          <Download className="w-4 h-4" />
          Export Report
        </button>
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
            <div key={stat.label} className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Revenue Trend</h3>
            <p className="text-sm text-slate-400">Daily revenue and orders (USD)</p>
          </div>
        </div>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-slate-400">Loading chart…</div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-slate-400">No revenue data for this period</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a2432',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [name === 'revenue' ? formatCents(value * 100) : value, name]}
              />
              <Bar yAxisId="left" dataKey="revenue" fill="#0d6cf2" radius={[8, 8, 0, 0]} name="Revenue" />
              <Bar yAxisId="right" dataKey="orders" fill="#0bda5e" radius={[8, 8, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Payments</h3>
          <a href="/admin/sales" className="text-sm text-[#0d6cf2] hover:underline">View All (via API)</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#223249]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {payments.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">No payments yet</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#223249] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{p.profiles?.full_name ?? '—'}</p>
                      <p className="text-slate-400 text-sm">{p.profiles?.email ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-white font-semibold">{formatCents(p.amount)}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'successful'
                            ? 'bg-green-500/10 text-[#0bda5e]'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
