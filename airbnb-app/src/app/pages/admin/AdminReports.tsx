import { useId } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { Download, TrendingUp, Users, DollarSign, Home, Calendar } from 'lucide-react';
import { useAdminBookings, useAdminUsers, useAdminListings } from '../../../features/admin/hooks';
import { useAnalytics } from '../../../features/statistics/hooks';

const PIE_COLORS = ['#FF385C', '#00A699', '#FC642D', '#484848', '#7c3aed', '#0ea5e9'];

export function AdminReports() {
  const rawId   = useId();
  const gradId  = `rpt-rev-${rawId.replace(/:/g, '')}`;

  const { data: bookings  = [], isLoading: loadingBookings  } = useAdminBookings();
  const { data: users     = [], isLoading: loadingUsers     } = useAdminUsers();
  const { data: listings  = [], isLoading: loadingListings  } = useAdminListings();
  const { data: analytics }                                    = useAnalytics();

  const allBookings  = bookings  as any[];
  const allUsers     = users     as any[];
  const allListings  = listings  as any[];

  // Revenue from CONFIRMED bookings
  const totalRevenue = allBookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);

  // Booking confirmation rate (confirmed / total)
  const confirmedCount = allBookings.filter(b => b.status === 'CONFIRMED').length;
  const bookingRate    = allBookings.length > 0
    ? Math.round((confirmedCount / allBookings.length) * 100)
    : 0;

  // Monthly trend charts from analytics
  const monthlyRevenue = analytics?.monthlyRevenue ?? [];
  const userGrowth     = analytics?.userGrowth     ?? [];

  // Revenue by listing type — group listings by type, aggregate confirmed booking revenue
  const revenueByType: Record<string, number> = {};
  allBookings
    .filter(b => b.status === 'CONFIRMED')
    .forEach(b => {
      const listing = allListings.find((l: any) => l.id === b.listing?.id);
      const type = listing?.type ?? b.listing?.type ?? 'Other';
      revenueByType[type] = (revenueByType[type] ?? 0) + (b.totalPrice ?? 0);
    });
  const categoryRevenue = Object.entries(revenueByType)
    .map(([name, value], i) => ({ name, value, color: PIE_COLORS[i % PIE_COLORS.length] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Guest vs Host breakdown
  const guestCount = allUsers.filter((u: any) => u.role === 'GUEST').length;
  const hostCount  = allUsers.filter((u: any) => u.role === 'HOST').length;
  const adminCount = allUsers.filter((u: any) => u.role === 'ADMIN').length;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>
            Reports &amp; Analytics
          </h1>
          <p className="text-[#717171] text-sm">Comprehensive platform performance reports.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-white border border-[#DDDDDD] hover:bg-[#F7F7F7] text-[#222222] px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          onClick={() => window.print()}
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue',    value: loadingBookings  ? '...' : `$${totalRevenue.toLocaleString()}`,      icon: DollarSign, color: '#16a34a' },
          { label: 'Total Users',      value: loadingUsers     ? '...' : allUsers.length.toString(),               icon: Users,      color: '#2563eb' },
          { label: 'Total Listings',   value: loadingListings  ? '...' : allListings.length.toString(),            icon: Home,       color: '#FF385C' },
          { label: 'Confirmation Rate',value: loadingBookings  ? '...' : `${bookingRate}%`,                        icon: TrendingUp, color: '#FC642D' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <stat.icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
            <p className="text-xl font-bold mb-0.5" style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
            <p className="text-[#717171] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Booking status breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Bookings',  value: allBookings.length,                                         color: '#717171', bg: '#F7F7F7' },
          { label: 'Confirmed',       value: confirmedCount,                                              color: '#16a34a', bg: '#dcfce7' },
          { label: 'Pending',         value: allBookings.filter(b => b.status === 'PENDING').length,      color: '#d97706', bg: '#fef3c7' },
          { label: 'Cancelled',       value: allBookings.filter(b => b.status === 'CANCELLED').length,    color: '#dc2626', bg: '#fee2e2' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex items-center gap-4">
            <Calendar className="w-5 h-5 shrink-0" style={{ color: s.color }} />
            <div>
              <p className="text-xl font-bold" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>{s.value}</p>
              <p className="text-[#717171] text-sm">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Annual Revenue Trend</h2>
          {monthlyRevenue.length === 0 ? (
            <div className="flex items-center justify-center h-[240px] text-sm" style={{ color: '#AAAAAA' }}>No revenue data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#FF385C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF385C" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#FF385C" strokeWidth={2.5} fill={`url(#${gradId})`} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Monthly Bookings</h2>
          {monthlyRevenue.length === 0 ? (
            <div className="flex items-center justify-center h-[240px] text-sm" style={{ color: '#AAAAAA' }}>No bookings data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [v, 'Bookings']} />
                <Bar dataKey="bookings" fill="#00A699" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>User Growth</h2>
          {userGrowth.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-sm" style={{ color: '#AAAAAA' }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [v, 'New Users']} />
                <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Revenue by Listing Type</h2>
          {categoryRevenue.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-sm" style={{ color: '#AAAAAA' }}>No confirmed revenue yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryRevenue} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value">
                    {categoryRevenue.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {categoryRevenue.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-[#717171]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    {item.name}: ${item.value.toLocaleString()}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* User breakdown */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
        <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>User Breakdown</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Guests',  value: guestCount, color: '#2563eb', bg: '#dbeafe' },
            { label: 'Hosts',   value: hostCount,  color: '#FF385C', bg: '#FFF1F3' },
            { label: 'Admins',  value: adminCount, color: '#7c3aed', bg: '#ede9fe' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center py-6 rounded-2xl" style={{ background: s.bg }}>
              <p className="text-3xl font-bold mb-1" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>{loadingUsers ? '...' : s.value}</p>
              <p className="text-sm font-medium" style={{ color: s.color }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
