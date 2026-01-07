'use client'

import { useState } from 'react'
import { Search, Filter, Download, Mail, UserCheck, UserX, Calendar } from 'lucide-react'

const users = [
  { id: 1, name: 'Alex M.', email: 'alex@example.com', status: 'Active', plan: 'ATS Pro', joined: '2024-01-15', cvs: 3 },
  { id: 2, name: 'Sarah J.', email: 'sarah@example.com', status: 'Active', plan: 'Free', joined: '2024-01-20', cvs: 1 },
  { id: 3, name: 'Michael K.', email: 'michael@example.com', status: 'Inactive', plan: 'Rewrite', joined: '2024-01-10', cvs: 5 },
  { id: 4, name: 'Emma L.', email: 'emma@example.com', status: 'Active', plan: 'ATS Pro', joined: '2024-01-25', cvs: 2 },
  { id: 5, name: 'David R.', email: 'david@example.com', status: 'Active', plan: 'Free', joined: '2024-01-28', cvs: 1 },
  { id: 6, name: 'Lisa T.', email: 'lisa@example.com', status: 'Inactive', plan: 'Rewrite', joined: '2024-01-05', cvs: 4 },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%' },
    { label: 'Active Users', value: '892', change: '+8%' },
    { label: 'New This Month', value: '156', change: '+15%' },
    { label: 'Premium Users', value: '342', change: '+22%' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-slate-400">Manage and monitor all platform users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <span className="text-[#0bda5e] text-sm font-semibold">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d6cf2]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-[#223249] border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#0d6cf2]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0d6cf2] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#223249]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">CVs</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#223249] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#0d6cf2] flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'Active' 
                        ? 'bg-green-500/10 text-[#0bda5e]' 
                        : 'bg-red-500/10 text-[#ff4d4d]'
                    }`}>
                      {user.status === 'Active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{user.plan}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-300">{user.cvs}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{user.joined}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-[#223249] text-slate-400 hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-1 bg-[#0d6cf2] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
          <p className="text-slate-400 text-sm">
            Showing <span className="text-white font-medium">1-6</span> of <span className="text-white font-medium">1,234</span> users
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[#223249] text-slate-300 rounded-lg text-sm hover:bg-[#223249]/80">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#0d6cf2] text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-1 bg-[#223249] text-slate-300 rounded-lg text-sm hover:bg-[#223249]/80">
              2
            </button>
            <button className="px-3 py-1 bg-[#223249] text-slate-300 rounded-lg text-sm hover:bg-[#223249]/80">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

