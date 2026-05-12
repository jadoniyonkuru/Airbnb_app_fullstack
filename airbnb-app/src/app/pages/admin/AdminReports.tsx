import { stats } from '../../../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Download, TrendingUp, Users, DollarSign, Home } from 'lucide-react';
import { useId } from 'react';

export function AdminReports() {
  const rawId = useId();
  const rptRevId = `rpt-rev-${rawId.replace(/:/g, '')}`;
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Reports & Analytics</h1>
          <p className="text-[#717171] text-sm">Comprehensive platform performance reports.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-[#DDDDDD] hover:bg-[#F7F7F7] text-[#222222] px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue YTD', value: '$487,920', change: '+32%', icon: DollarSign, color: '#16a34a' },
          { label: 'New Users', value: '+267', change: '+18%', icon: Users, color: '#2563eb' },
          { label: 'New Listings', value: '+52', change: '+12%', icon: Home, color: '#FF385C' },
          { label: 'Booking Rate', value: '94%', change: '+3%', icon: TrendingUp, color: '#FC642D' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <stat.icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
            <p className="text-xl font-bold mb-0.5" style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
            <p className="text-[#717171] text-sm">{stat.label}</p>
            <p className="text-green-600 text-xs font-semibold mt-1">↑ {stat.change} vs last period</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Annual Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats.monthlyRevenue}>
              <defs>
                <linearGradient id={rptRevId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF385C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF385C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#FF385C" strokeWidth={2.5} fill={`url(#${rptRevId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Monthly Bookings</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#00A699" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>User Growth</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.categoryRevenue} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                {stats.categoryRevenue.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {stats.categoryRevenue.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[#717171]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                {item.name} {item.value}%
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}