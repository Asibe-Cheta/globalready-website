'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Download, Mail, UserCheck, UserX, Calendar } from 'lucide-react'
import Link from 'next/link'

type User = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  country: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string | null
  cv_count: number
  total_spent: number
  course_registrations: number
}

type Pagination = { page: number; limit: number; total: number }

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const fetchUsers = useCallback(async (page: number, search: string) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search.trim()) params.set('search', search.trim())
      const res = await fetch(`/api/admin/users?${params}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to load users')
      }
      const data = await res.json()
      setUsers(data.users ?? [])
      setPagination(data.pagination ?? { page: 1, limit: 20, total: 0 })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers(pagination.page, debouncedSearch)
  }, [pagination.page, debouncedSearch, fetchUsers])

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1
  const start = (pagination.page - 1) * pagination.limit + 1
  const end = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-slate-400">Manage and monitor all platform users</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400">{error}</div>
      )}

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-slate-400 text-sm">All users</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2432] text-slate-300 rounded-lg font-medium hover:bg-[#223249] transition-colors cursor-not-allowed" title="Export coming soon">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#223249]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">CVs</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Spent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Courses</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#223249] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#0d6cf2] flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.full_name || '—'}</p>
                          <p className="text-slate-400 text-sm">{user.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-slate-300">{user.cv_count}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-medium">
                        ${((user.total_spent || 0) / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-slate-300">{user.course_registrations}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.email && (
                          <a
                            href={`mailto:${user.email}`}
                            className="p-2 rounded-lg hover:bg-[#223249] text-slate-400 hover:text-white transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="px-3 py-1 bg-[#0d6cf2] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
          <p className="text-slate-400 text-sm">
            Showing <span className="text-white font-medium">{pagination.total === 0 ? 0 : start}</span>
            –<span className="text-white font-medium">{end}</span> of{' '}
            <span className="text-white font-medium">{pagination.total}</span> users
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1 || loading}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="px-3 py-1 bg-[#223249] text-slate-300 rounded-lg text-sm hover:bg-[#223249]/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-slate-400 text-sm">
              Page {pagination.page} of {totalPages}
            </span>
            <button
              disabled={pagination.page >= totalPages || loading}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="px-3 py-1 bg-[#223249] text-slate-300 rounded-lg text-sm hover:bg-[#223249]/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
