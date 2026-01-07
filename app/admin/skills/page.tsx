'use client'

import { GraduationCap, TrendingUp, Users, BookOpen, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const skillStats = [
  { label: 'Total Skills', value: '156', change: '+12%', icon: BookOpen },
  { label: 'Active Learners', value: '892', change: '+18%', icon: Users },
  { label: 'Completion Rate', value: '68%', change: '+5%', icon: GraduationCap },
  { label: 'Avg Time to Complete', value: '4.2 days', change: '-12%', icon: TrendingUp },
]

const skillEngagement = [
  { skill: 'Web Development', learners: 450, completed: 320, completion: 71.1, interest: 85 },
  { skill: 'Data Science', learners: 380, completed: 250, completion: 65.8, interest: 78 },
  { skill: 'UI/UX Design', learners: 420, completed: 310, completion: 73.8, interest: 82 },
  { skill: 'DevOps', learners: 290, completed: 180, completion: 62.1, interest: 72 },
  { skill: 'Mobile Dev', learners: 340, completed: 220, completion: 64.7, interest: 75 },
]

const skillInterestData = [
  { subject: 'Web Dev', value: 85, fullMark: 100 },
  { subject: 'Data Science', value: 78, fullMark: 100 },
  { subject: 'UI/UX', value: 82, fullMark: 100 },
  { subject: 'DevOps', value: 72, fullMark: 100 },
  { subject: 'Mobile', value: 75, fullMark: 100 },
  { subject: 'Cloud', value: 68, fullMark: 100 },
]

const topSkills = [
  { skill: 'React.js', learners: 1240, trend: 'up', growth: '+25%' },
  { skill: 'Python', learners: 1120, trend: 'up', growth: '+18%' },
  { skill: 'TypeScript', learners: 980, trend: 'up', growth: '+32%' },
  { skill: 'Node.js', learners: 850, trend: 'up', growth: '+15%' },
  { skill: 'Docker', learners: 720, trend: 'up', growth: '+28%' },
  { skill: 'AWS', learners: 650, trend: 'up', growth: '+22%' },
]

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Skill Insights</h1>
        <p className="text-slate-400">Track skill engagement and learning metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillStats.map((stat) => (
          <div key={stat.label} className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-orange-500" />
              </div>
              <span className={`text-sm font-semibold flex items-center gap-1 ${
                stat.label === 'Avg Time to Complete' ? 'text-[#ff4d4d]' : 'text-[#0bda5e]'
              }`}>
                {stat.change.includes('+') || stat.label === 'Avg Time to Complete' ? (
                  <TrendingUp className={`w-4 h-4 ${stat.label === 'Avg Time to Complete' ? 'rotate-180' : ''}`} />
                ) : (
                  <TrendingUp className="w-4 h-4 rotate-180" />
                )}
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
        {/* Skill Engagement Chart */}
        <div className="lg:col-span-2 bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Skill Engagement</h3>
              <p className="text-sm text-slate-400">Learners and completion rates by skill</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#1a2432] text-slate-300 rounded-lg text-sm hover:bg-[#223249]">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillEngagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
              <XAxis dataKey="skill" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a2432', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Bar yAxisId="left" dataKey="learners" fill="#0d6cf2" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="left" dataKey="completed" fill="#0bda5e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Interest Radar */}
        <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-1">Skill Interest</h3>
          <p className="text-sm text-slate-400 mb-6">Interest levels by category</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={skillInterestData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" stroke="#64748b" style={{ fontSize: '11px' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" style={{ fontSize: '10px' }} />
              <Radar name="Interest" dataKey="value" stroke="#0d6cf2" fill="#0d6cf2" fillOpacity={0.3} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a2432', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill Engagement Table */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Detailed Skill Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#223249]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Skill</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Learners</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Completed</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Completion %</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Interest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {skillEngagement.map((skill) => (
                <tr key={skill.skill} className="hover:bg-[#223249] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{skill.skill}</td>
                  <td className="px-4 py-3 text-slate-300">{skill.learners}</td>
                  <td className="px-4 py-3 text-slate-300">{skill.completed}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#223249] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#0d6cf2] to-[#0bda5e]"
                          style={{ width: `${skill.completion}%` }}
                        />
                      </div>
                      <span className="text-slate-300 text-sm w-12 text-right">{skill.completion}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      skill.interest >= 80 
                        ? 'bg-green-500/10 text-[#0bda5e]' 
                        : skill.interest >= 70
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {skill.interest}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Skills */}
      <div className="bg-[#1a2432] border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Top Skills by Growth</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSkills.map((item) => (
            <div key={item.skill} className="bg-[#223249] border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#0d6cf2]/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#0d6cf2]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{item.skill}</p>
                    <p className="text-slate-400 text-sm">{item.learners.toLocaleString()} learners</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0bda5e]" />
                <span className="text-[#0bda5e] text-sm font-semibold">{item.growth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

