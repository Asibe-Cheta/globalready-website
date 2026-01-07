'use client'

import { useState } from 'react'
import { TrendingUp, DollarSign, ShoppingCart, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const salesStats = [
  { label: 'Total Revenue', value: '$24,580', change: '+18%', icon: DollarSign },
  { label: 'Total Orders', value: '342', change: '+12%', icon: ShoppingCart },
  { label: 'Avg Order Value', value: '$71.87', change: '+5%', icon: TrendingUp },
  { label: 'Conversion Rate', value: '3.2%', change: '+0.4%', icon: TrendingUp },
]

const revenueData = [
  { month: 'Jan', revenue: 8500, orders: 120 },
  { month: 'Feb', revenue: 9200, orders: 135 },
  { month: 'Mar', revenue: 7800, orders: 110 },
  { month: 'Apr', revenue: 10100, orders: 145 },
  { month: 'May', revenue: 11200, orders: 158 },
  { month: 'Jun', revenue: 9800, orders: 142 },
]

const productBreakdown = [
  { name: 'ATS Pro', value: 12450, color: '#0d6cf2' },
  { name: 'Rewrite', value: 7200, color: '#0bda5e' },
  { name: 'Free CV', value: 0, color: '#64748b' },
  { name: 'Other', value: 4930, color: '#f59e0b' },
]

const recentOrders = [
  { id: '#1234', customer: 'Alex M.', product: 'ATS Pro', amount: '$7.00', date: '2024-01-28', status: 'Completed' },
  { id: '#1233', customer: 'Sarah J.', product: 'Rewrite', amount: '$10.00', date: '2024-01-28', status: 'Completed' },
  { id: '#1232', customer: 'Michael K.', product: 'ATS Pro', amount: '$7.00', date: '2024-01-27', status: 'Completed' },
  { id: '#1231', customer: 'Emma L.', product: 'Rewrite', amount: '$10.00', date: '2024-01-27', status: 'Pending' },
  { id: '#1230', customer: 'David R.', product: 'ATS Pro', amount: '$7.00', date: '2024-01-26', status: 'Completed' },
]

export default function SalesPage() {
  const [dateRange, setDateRange] = useState('This Month')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Sales & Revenue</h1>
        <p className="text-slate-400">Track sales performance and revenue metrics</p>
      </div>

      {/* Date Range Filter */}
      <div className="flex gap-3">
        {['This Month', 'Last Month', 'Last 3 Months', 'All Time'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              dateRange === range
                ? 'bg-[#0d6cf2] text-white'
                : 'bg-[#1a2432] text-slate-300 hover:bg-[#223249]'
            }`}
          >
            {range}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#1a2432] text-slate-300 rounded-lg font-medium text-sm hover:bg-[#223249]">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesStats.map((stat) => (
          <div key={stat.label} className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-[#0bda5e] text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Revenue Trend</h3>
              <p className="text-sm text-slate-400">Monthly revenue and orders</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a2432', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Bar yAxisId="left" dataKey="revenue" fill="#0d6cf2" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="orders" fill="#0bda5e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Breakdown */}
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-1">Product Breakdown</h3>
          <p className="text-sm text-slate-400 mb-6">Revenue by product</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {productBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a2432', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
                formatter={(value) => `$${(value || 0).toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Orders</h3>
          <button className="text-sm text-[#0d6cf2] hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#223249]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#223249] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{order.id}</td>
                  <td className="px-4 py-3 text-white">{order.customer}</td>
                  <td className="px-4 py-3 text-slate-300">{order.product}</td>
                  <td className="px-4 py-3 text-white font-semibold">{order.amount}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{order.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Completed' 
                        ? 'bg-green-500/10 text-[#0bda5e]' 
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

