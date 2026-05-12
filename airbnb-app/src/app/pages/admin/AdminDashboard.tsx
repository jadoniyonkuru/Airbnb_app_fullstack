import { ElementType } from 'react';
import {
  Users, Home, Calendar, DollarSign,
  Activity, ArrowUpRight, TrendingUp,
  UserCheck, Star, CheckCircle2, ShieldCheck,
} from 'lucide-react';
import { stats, activities, users } from '../../../data/mockData';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#EBEBEB] rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-[#222222] mb-1">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} style={{ color: e.color }}>
          {e.name}: {e.name === 'revenue' ? `$${(e.value / 1000).toFixed(0)}k` : e.value}
        </p>
      ))}
    </div>
  );
};

const actIconMap: Record<string, ElementType> = {
  listing: Home, booking: Calendar, review: Star,
  payment: DollarSign, user: UserCheck, alert: ShieldCheck,
};

export function AdminDashboard() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E' }}>
            Admin Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: '#717171' }}>Thursday, May 8, 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-[#DDDDDD] bg-white text-[#484848] px-4 py-2.5 rounded-xl text-sm font-medium hover:border-[#BBBBBB] transition-colors">
            Export Report
          </button>
          <button className="bg-[#FF385C] hover:bg-[#E31C5F] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            + Add Listing
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Users',    value: stats.totalUsers.toLocaleString(),                     trend: '+156 this month', icon: Users      },
          { label: 'Active Hosts',   value: stats.totalHosts.toString(),                           trend: '+23 this month',  icon: Home       },
          { label: 'Total Bookings', value: stats.totalBookings.toLocaleString(),                  trend: '+89 this week',   icon: Calendar   },
          { label: 'Total Revenue',  value: `$${(stats.totalRevenue / 1000).toFixed(0)}k`,         trend: '+18% MoM',        icon: DollarSign },
        ].map(({ label, value, trend, icon: Icon }) => (
          <div key={label} className="bg-white border border-[#EBEBEB] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#FFF1F3] flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-[#FF385C]" style={{ width: 18, height: 18 }} />
              </div>
              <span className="text-xs font-medium" style={{ color: '#717171' }}>{trend}</span>
            </div>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E', lineHeight: 1 }}>
              {value}
            </p>
            <p className="text-sm font-medium mt-2" style={{ color: '#717171' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Revenue line chart */}
        <div className="lg:col-span-2 bg-white border border-[#EBEBEB] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E' }}>Revenue Growth</h2>
              <p className="text-xs mt-0.5" style={{ color: '#AAAAAA' }}>12-month revenue & bookings</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#15803d' }}>
              <TrendingUp className="w-3.5 h-3.5" />
              +32% YoY
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={stats.monthlyRevenue} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#AAAAAA' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#AAAAAA' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="revenue" name="revenue" stroke="#FF385C" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#FF385C' }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 justify-center mt-2">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#717171' }}>
              <span className="w-4 h-0.5 rounded-full inline-block" style={{ background: '#FF385C' }} />Monthly Revenue
            </div>
          </div>
        </div>

        {/* Platform health */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6">
          <h2 className="font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E' }}>Platform Health</h2>
          <p className="text-xs mb-5" style={{ color: '#AAAAAA' }}>Key quality metrics</p>
          <div className="space-y-4">
            {[
              { label: 'Active Listings',   value: `${stats.activeListings}/${stats.totalListings}`, pct: Math.round(stats.activeListings / stats.totalListings * 100), icon: Home         },
              { label: 'Verified Hosts',    value: '87%', pct: 87, icon: ShieldCheck   },
              { label: 'Avg. Rating',       value: '4.8', pct: 96, icon: Star          },
              { label: 'Booking Completion',value: '94%', pct: 94, icon: CheckCircle2  },
              { label: 'Support Resolution',value: '91%', pct: 91, icon: UserCheck     },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" style={{ color: '#AAAAAA' }} />
                      <span className="text-xs" style={{ color: '#717171' }}>{m.label}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#1C1C1E' }}>{m.value}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: '#F0F0F0' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${m.pct}%`, background: '#FF385C' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bookings bar + User growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6">
          <h2 className="font-semibold mb-0.5" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E' }}>Weekly Bookings</h2>
          <p className="text-xs mb-5" style={{ color: '#AAAAAA' }}>Bookings by day of week</p>
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={stats.weeklyBookings} barSize={26}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#AAAAAA' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#AAAAAA' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="bookings" name="bookings" fill="#FF385C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-semibold mb-0.5" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E' }}>User Growth</h2>
              <p className="text-xs" style={{ color: '#AAAAAA' }}>Cumulative registered users</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#15803d' }}>
              <ArrowUpRight className="w-3.5 h-3.5" />+27%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={185}>
            <LineChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#AAAAAA' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#AAAAAA' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="users" name="users" stroke="#FF385C" strokeWidth={2.5} dot={{ r: 3, fill: '#FF385C', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Users table + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2 bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
            <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E' }}>Recent Users</h2>
            <a href="/admin-dashboard/users" className="text-sm font-medium hover:underline" style={{ color: '#FF385C' }}>View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EBEBEB]">
                  {['User', 'Role', 'Bookings', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#AAAAAA', background: 'white' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {users.slice(0, 6).map(user => (
                  <tr key={user.id} className="hover:bg-[#FFFAF9] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{user.avatar}</div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: '#1C1C1E' }}>{user.name}</p>
                          <p className="text-xs" style={{ color: '#AAAAAA' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{
                        background: user.role === 'host' ? '#FFF1F3' : '#F7F7F7',
                        color:      user.role === 'host' ? '#FF385C'  : '#717171',
                      }}>{user.role}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-sm" style={{ color: '#1C1C1E' }}>{user.bookings}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                        background: user.status === 'active' ? '#F0FDF4' : '#FFF1F2',
                        color:      user.status === 'active' ? '#15803d' : '#dc2626',
                      }}>{user.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-xs font-semibold hover:underline" style={{ color: '#FF385C' }}>Edit</button>
                        <button className="text-xs transition-colors" style={{ color: '#AAAAAA' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#AAAAAA')}
                        >Suspend</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBEBEB]">
            <h2 className="font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E' }}>Live Activity</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium" style={{ color: '#15803d' }}>Live</span>
            </div>
          </div>
          <div className="divide-y divide-[#EBEBEB] max-h-[400px] overflow-y-auto">
            {activities.map(act => {
              const Icon = actIconMap[act.type] ?? Activity;
              return (
                <div key={act.id} className="flex gap-3 px-4 py-3.5 hover:bg-[#FFFAF9] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-[#FFF1F3] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-[#FF385C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed">
                      <span className="font-semibold" style={{ color: '#1C1C1E' }}>{act.user}</span>{' '}
                      <span style={{ color: '#717171' }}>{act.action}</span>
                      {act.detail && <span className="font-medium" style={{ color: '#1C1C1E' }}> — {act.detail}</span>}
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: '#AAAAAA' }}>{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}