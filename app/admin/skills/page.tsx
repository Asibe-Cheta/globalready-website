'use client'

import { useEffect, useState } from 'react'
import { GraduationCap, Users, BookOpen, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type SkillsInsights = {
  total_skills_tracked: number
  active_learners: number
  path_distribution: { selected_path: string; count: number }[] | null
  course_popularity: {
    id: string
    title: string
    category: string | null
    enrollments: number
    completed: number
    completion_rate: number
  }[] | null
}

export default function SkillsPage() {
  const [data, setData] = useState<SkillsInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/dashboard/skills', { credentials: 'include' })
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error || 'Failed to load skills insights')
        }
        const j = await res.json()
        if (!cancelled) setData(j)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Something went wrong')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const stats = data
    ? [
        { label: 'Total Skills Tracked', value: String(data.total_skills_tracked), icon: BookOpen },
        { label: 'Active Learners (30d)', value: String(data.active_learners), icon: Users },
        {
          label: 'Paths',
          value: String((data.path_distribution ?? []).length),
          icon: GraduationCap,
        },
        {
          label: 'Active Courses',
          value: String((data.course_popularity ?? []).length),
          icon: BookOpen,
        },
      ]
    : []

  const courseChartData = (data?.course_popularity ?? []).map((c) => ({
    name: c.title.length > 20 ? c.title.slice(0, 20) + '…' : c.title,
    enrollments: c.enrollments,
    completed: c.completed,
    completion_rate: c.completion_rate,
  }))

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white mb-2">Skill Insights</h1>
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Skill Insights</h1>
        <p className="text-slate-400">Track skill engagement and learning metrics</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6 animate-pulse">
              <div className="h-12 w-12 rounded-xl bg-slate-700 mb-4" />
              <div className="h-4 w-24 bg-slate-700 rounded mb-2" />
              <div className="h-8 w-20 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Course Popularity</h3>
              <p className="text-sm text-slate-400">Enrollments and completions by course</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#1a2432] text-slate-300 rounded-lg text-sm hover:bg-[#223249] cursor-not-allowed" title="Coming soon">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-slate-400">Loading…</div>
          ) : courseChartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-slate-400">No course data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '11px' }} />
                <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a2432',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                />
                <Bar yAxisId="left" dataKey="enrollments" fill="#0d6cf2" radius={[8, 8, 0, 0]} name="Enrollments" />
                <Bar yAxisId="left" dataKey="completed" fill="#0bda5e" radius={[8, 8, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-1">Path Distribution</h3>
          <p className="text-sm text-slate-400 mb-6">Learners by selected path</p>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-slate-400">Loading…</div>
          ) : !data?.path_distribution?.length ? (
            <div className="h-[200px] flex items-center justify-center text-slate-400">No path data yet</div>
          ) : (
            <ul className="space-y-3">
              {data.path_distribution.map((p) => (
                <li key={p.selected_path} className="flex justify-between text-sm">
                  <span className="text-slate-300 capitalize">{p.selected_path?.replace(/_/g, ' ') || '—'}</span>
                  <span className="text-white font-medium">{p.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Course Metrics</h3>
        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : !data?.course_popularity?.length ? (
          <p className="text-slate-400">No courses with enrollments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#223249]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Enrollments</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Completed</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Completion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {data.course_popularity.map((c) => (
                  <tr key={c.id} className="hover:bg-[#223249] transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{c.title}</td>
                    <td className="px-4 py-3 text-slate-300">{c.category ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{c.enrollments}</td>
                    <td className="px-4 py-3 text-slate-300">{c.completed}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#223249] rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className="h-full bg-gradient-to-r from-[#0d6cf2] to-[#0bda5e]"
                            style={{ width: `${Math.min(100, c.completion_rate)}%` }}
                          />
                        </div>
                        <span className="text-slate-300 text-sm">{c.completion_rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
