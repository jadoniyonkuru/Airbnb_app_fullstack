import { useState, useId } from 'react';
import { stats } from '../../../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  ComposedChart, Legend
} from 'recharts';
import { TrendingUp, Users, DollarSign, Home, Star, ArrowUp, ArrowDown, Globe } from 'lucide-react';

const topProperties = [
  { name: 'Penthouse Manhattan', revenue: 14700, bookings: 42, occupancy: 94, location: 'New York', rating: 4.95 },
  { name: 'Luxury Villa Nairobi', revenue: 9750, bookings: 39, occupancy: 88, location: 'Nairobi', rating: 5.0 },
  { name: 'Alpine Cabin Switzerland', revenue: 8400, bookings: 26, occupancy: 72, location: 'Swiss Alps', rating: 4.92 },
  { name: 'Paris Studio Eiffel', revenue: 6120, bookings: 51, occupancy: 91, location: 'Paris', rating: 4.8 },
  { name: 'Kigali Modern Apt', revenue: 4820, bookings: 57, occupancy: 87, location: 'Kigali', rating: 4.9 },
];

const conversionData = [
  { month: 'Jan', views: 12400, inquiries: 1860, bookings: 198 },
  { month: 'Feb', views: 14200, inquiries: 2130, bookings: 184 },
  { month: 'Mar', views: 15800, inquiries: 2370, bookings: 210 },
  { month: 'Apr', views: 18200, inquiries: 2730, bookings: 236 },
  { month: 'May', views: 21500, inquiries: 3225, bookings: 259 },
  { month: 'Jun', views: 24300, inquiries: 3645, bookings: 271 },
];

const locationData = [
  { name: 'Africa', value: 48, color: '#FF385C' },
  { name: 'Europe', value: 27, color: '#00A699' },
  { name: 'Americas', value: 16, color: '#FC642D' },
  { name: 'Asia', value: 9, color: '#484848' },
];

const kpiMetrics = [
  { label: 'Avg. Booking Value', value: '$386', change: '+8.2%', up: true, icon: DollarSign, color: '#FF385C' },
  { label: 'Occupancy Rate', value: '84.6%', change: '+3.1%', up: true, icon: Home, color: '#00A699' },
  { label: 'Guest Satisfaction', value: '4.87', change: '+0.04', up: true, icon: Star, color: '#d97706' },
  { label: 'Host Churn Rate', value: '2.3%', change: '-0.5%', up: false, icon: Users, color: '#7c3aed' },
  { label: 'New Host MoM', value: '+34', change: '+12%', up: true, icon: TrendingUp, color: '#0ea5e9' },
  { label: 'Platform Revenue', value: '$71K', change: '+18%', up: true, icon: Globe, color: '#16a34a' },
];

export function AdminAnalytics() {
  const [period, setPeriod] = useState('12m');
  const rawId = useId();
  const anaRevId   = `ana-rev-${rawId.replace(/:/g, '')}`;
  const anaViewsId = `ana-views-${rawId.replace(/:/g, '')}`;
  const anaInqId   = `ana-inq-${rawId.replace(/:/g, '')}`;
  const anaBookId  = `ana-book-${rawId.replace(/:/g, '')}`;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Platform Analytics</h1>
          <p className="text-[#717171] text-sm">Deep insights into platform performance, growth, and trends.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#DDDDDD] rounded-xl p-1">
          {['7d', '30d', '3m', '12m'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: period === p ? '#FF385C' : 'transparent', color: period === p ? 'white' : '#717171' }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpiMetrics.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${m.color}18` }}>
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${m.up ? 'text-green-600' : 'text-red-500'}`}>
                {m.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {m.change}
              </span>
            </div>
            <p className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: m.color }}>{m.value}</p>
            <p className="text-[#717171] text-xs mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue & Bookings */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[#222222] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Revenue vs Bookings</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF385C]" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00A699]" />Bookings</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={stats.monthlyRevenue}>
              <defs>
                <linearGradient id={anaRevId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF385C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF385C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: any, name: string) => [name === 'revenue' ? `$${v.toLocaleString()}` : v, name === 'revenue' ? 'Revenue' : 'Bookings']} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" fill={`url(#${anaRevId})`} stroke="#FF385C" strokeWidth={2.5} />
              <Bar yAxisId="right" dataKey="bookings" fill="#00A699" opacity={0.7} radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Conversion Funnel</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={conversionData}>
              <defs>
                <linearGradient id={anaViewsId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id={anaInqId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id={anaBookId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF385C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FF385C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="views" name="Page Views" stroke="#7c3aed" strokeWidth={2} fill={`url(#${anaViewsId})`} />
              <Area type="monotone" dataKey="inquiries" name="Inquiries" stroke="#0ea5e9" strokeWidth={2} fill={`url(#${anaInqId})`} />
              <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#FF385C" strokeWidth={2} fill={`url(#${anaBookId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth & Location Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>User Growth Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
              <Tooltip formatter={(v: any) => [v.toLocaleString(), 'Users']} />
              <Line type="monotone" dataKey="users" stroke="#FF385C" strokeWidth={3} dot={{ r: 5, fill: '#FF385C', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Bookings by Region</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={locationData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {locationData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {locationData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-sm text-[#484848]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-[#F7F7F7] rounded-full h-1.5">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                  <span className="text-sm font-semibold text-[#222222] w-8 text-right">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Booking Pattern */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Weekly Booking Pattern</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklyBookings} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                {stats.weeklyBookings.map((e, i) => (
                  <Cell key={i} fill={e.bookings === Math.max(...stats.weeklyBookings.map(d => d.bookings)) ? '#FF385C' : '#FFB3BD'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Properties */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Top Performing Properties</h2>
          <div className="space-y-3">
            {topProperties.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: i === 0 ? '#FF385C' : i === 1 ? '#FC642D' : i === 2 ? '#d97706' : '#DDDDDD', color: i < 3 ? 'white' : '#717171' }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#222222] text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-[#717171] text-xs">{p.location} · {p.bookings} bookings</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[#222222] font-bold text-sm">${p.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-0.5 justify-end">
                    <Star className="w-3 h-3 fill-[#FF385C] text-[#FF385C]" />
                    <span className="text-xs text-[#717171]">{p.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}