'use client'

import { TrendingUp, Users, FileText, GraduationCap, DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const stats = [
  { 
    name: 'Total Revenue', 
    value: '$12,450', 
    change: '+15%', 
    icon: DollarSign,
    color: 'bg-blue-500/10 text-blue-500'
  },
  { 
    name: 'CVs Sold', 
    value: '142', 
    change: '+12%', 
    icon: FileText,
    color: 'bg-purple-500/10 text-purple-500'
  },
  { 
    name: 'Active Users', 
    value: '1.2k', 
    change: '+8%', 
    icon: Users,
    color: 'bg-green-500/10 text-green-500'
  },
  { 
    name: 'Enrollments', 
    value: '34', 
    change: '+5%', 
    icon: GraduationCap,
    color: 'bg-orange-500/10 text-orange-500'
  },
]

const revenueData = [
  { day: 'Mon', revenue: 1200 },
  { day: 'Tue', revenue: 1800 },
  { day: 'Wed', revenue: 1400 },
  { day: 'Thu', revenue: 2200 },
  { day: 'Fri', revenue: 1900 },
  { day: 'Sat', revenue: 2400 },
  { day: 'Sun', revenue: 2140 },
]

const recentActivity = [
  { user: 'Alex M.', action: 'purchased Full Stack Roadmap', time: '2 minutes ago' },
  { user: 'Sarah J.', action: 'enrolled in Guided Execution', time: '15 minutes ago' },
  { user: 'New User', action: 'Signup: michael_dev88', time: '1 hour ago' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back, Admin User</p>
      </div>

      {/* Date filter */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium text-sm">
          This Month
        </button>
        <button className="px-4 py-2 bg-[#1a2432] text-slate-300 rounded-lg font-medium text-sm hover:bg-[#223249]">
          Last 7 Days
        </button>
        <button className="px-4 py-2 bg-[#1a2432] text-slate-300 rounded-lg font-medium text-sm hover:bg-[#223249]">
          Yesterday
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[#0bda5e] text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">{stat.name}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Revenue Trend</h3>
            <p className="text-sm text-slate-400">Daily revenue over time</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
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
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b border-slate-700/30 last:border-0">
              <div className="h-10 w-10 rounded-full bg-[#0d6cf2]/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-[#0d6cf2]" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-slate-400 text-xs mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

