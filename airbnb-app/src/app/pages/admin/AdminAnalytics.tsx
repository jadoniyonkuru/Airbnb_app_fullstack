import { useState, useId, useMemo } from 'react';
import { useAnalytics } from '../../../features/statistics/hooks';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  ComposedChart, Legend,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Home, Star, ArrowUp, Globe } from 'lucide-react';
import { useAdminBookings, useAdminUsers, useAdminListings } from '../../../features/admin/hooks';

const PIE_COLORS = ['#FF385C', '#00A699', '#FC642D', '#484848', '#7c3aed', '#0ea5e9'];

const PERIOD_MONTHS: Record<string, number> = { '1m': 1, '3m': 3, '6m': 6, '12m': 12 };

export function AdminAnalytics() {
  const [period, setPeriod] = useState<'1m' | '3m' | '6m' | '12m'>('12m');
  const rawId      = useId();
  const anaRevId   = `ana-rev-${rawId.replace(/:/g, '')}`;
  const anaBookId  = `ana-book-${rawId.replace(/:/g, '')}`;

  const { data: bookings  = [], isLoading: loadingBookings  } = useAdminBookings();
  const { data: users     = [], isLoading: loadingUsers     } = useAdminUsers();
  const { data: listings  = [], isLoading: loadingListings  } = useAdminListings();
  const { data: analytics }                                    = useAnalytics();

  const allBookings = bookings  as any[];
  const allUsers    = users     as any[];
  const allListings = listings  as any[];

  // Period-sliced chart data
  const months        = PERIOD_MONTHS[period] ?? 12;
  const fullMonthly   = analytics?.monthlyRevenue ?? [];
  const fullGrowth    = analytics?.userGrowth     ?? [];
  const weeklyData    = analytics?.weeklyBookings  ?? [];
  const monthlyRevenue = fullMonthly.slice(-months);
  const userGrowth    = fullGrowth.slice(-months);

  // KPI calculations
  const confirmed      = allBookings.filter(b => b.status === 'CONFIRMED');
  const totalRevenue   = confirmed.reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);
  const avgBookingVal  = confirmed.length > 0 ? Math.round(totalRevenue / confirmed.length) : 0;
  const occupancyRate  = allBookings.length > 0
    ? Math.round((confirmed.length / allBookings.length) * 100)
    : 0;
  const avgRating = allListings.length > 0
    ? (allListings.reduce((sum: number, l: any) => sum + (l.rating ?? 0), 0) / allListings.length).toFixed(2)
    : '0.00';
  const hostCount = allUsers.filter((u: any) => u.role === 'HOST').length;

  // Top 5 properties by confirmed revenue
  const topProperties = useMemo(() => {
    return allListings
      .map((l: any) => {
        const lb = allBookings.filter(b => b.listing?.id === l.id && b.status === 'CONFIRMED');
        return {
          name:     l.title,
          revenue:  lb.reduce((s, b) => s + (b.totalPrice ?? 0), 0),
          bookings: lb.length,
          location: l.location ?? '—',
          rating:   l.rating   ?? 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [allListings, allBookings]);

  // Bookings by region from listing locations
  const regionMap: Record<string, number> = {};
  allBookings.forEach(b => {
    const loc = b.listing?.location ?? 'Unknown';
    // Simplify location to region (first word or full if short)
    const region = loc.split(',').pop()?.trim() ?? loc;
    regionMap[region] = (regionMap[region] ?? 0) + 1;
  });
  const locationData = Object.entries(regionMap)
    .map(([name, value], i) => ({ name, value, color: PIE_COLORS[i % PIE_COLORS.length] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const totalLocBookings = locationData.reduce((s, l) => s + l.value, 0);
  const locationDataPct = locationData.map(l => ({
    ...l,
    pct: totalLocBookings > 0 ? Math.round((l.value / totalLocBookings) * 100) : 0,
  }));

  const kpiMetrics = [
    { label: 'Avg. Booking Value', value: loadingBookings ? '...' : `$${avgBookingVal.toLocaleString()}`, change: '', icon: DollarSign, color: '#FF385C' },
    { label: 'Confirmation Rate',  value: loadingBookings ? '...' : `${occupancyRate}%`,                   change: '', icon: Home,       color: '#00A699' },
    { label: 'Guest Satisfaction', value: loadingListings ? '...' : avgRating,                             change: '', icon: Star,       color: '#d97706' },
    { label: 'Total Hosts',        value: loadingUsers    ? '...' : hostCount.toString(),                  change: '', icon: Users,      color: '#7c3aed' },
    { label: 'Active Listings',    value: loadingListings ? '...' : allListings.length.toString(),         change: '', icon: TrendingUp, color: '#0ea5e9' },
    { label: 'Platform Revenue',   value: loadingBookings ? '...' : `$${totalRevenue >= 1000 ? `${(totalRevenue/1000).toFixed(0)}k` : totalRevenue}`, change: '', icon: Globe, color: '#16a34a' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Platform Analytics</h1>
          <p className="text-[#717171] text-sm">Deep insights into platform performance, growth, and trends.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#DDDDDD] rounded-xl p-1">
          {(['1m', '3m', '6m', '12m'] as const).map(p => (
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
              <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
                <ArrowUp className="w-3 h-3" />
                Live
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
          {monthlyRevenue.length === 0 ? (
            <div className="flex items-center justify-center h-[260px] text-sm" style={{ color: '#AAAAAA' }}>No data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id={anaRevId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#FF385C" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FF385C" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any, name: string) => [name === 'revenue' ? `$${Number(v).toLocaleString()}` : v, name === 'revenue' ? 'Revenue' : 'Bookings']} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" fill={`url(#${anaRevId})`} stroke="#FF385C" strokeWidth={2.5} />
                <Bar yAxisId="right" dataKey="bookings" fill="#00A699" opacity={0.7} radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Bookings Trend</h2>
          {monthlyRevenue.length === 0 ? (
            <div className="flex items-center justify-center h-[260px] text-sm" style={{ color: '#AAAAAA' }}>No data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id={anaBookId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#FF385C" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FF385C" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [v, 'Bookings']} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#FF385C" strokeWidth={2} fill={`url(#${anaBookId})`} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* User Growth & Location Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>User Growth Trend</h2>
          {userGrowth.length === 0 ? (
            <div className="flex items-center justify-center h-[220px] text-sm" style={{ color: '#AAAAAA' }}>No data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [v, 'New Users']} />
                <Line type="monotone" dataKey="users" stroke="#FF385C" strokeWidth={3} dot={{ r: 5, fill: '#FF385C', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Bookings by Location</h2>
          {locationDataPct.length === 0 ? (
            <div className="flex items-center justify-center h-[180px] text-sm" style={{ color: '#AAAAAA' }}>No booking location data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={locationDataPct} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="pct">
                    {locationDataPct.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {locationDataPct.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                      <span className="text-sm text-[#484848] truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 bg-[#F7F7F7] rounded-full h-1.5">
                        <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                      </div>
                      <span className="text-sm font-semibold text-[#222222] w-8 text-right">{item.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Weekly Booking Pattern + Top Properties */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Weekly Booking Pattern</h2>
          {weeklyData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-sm" style={{ color: '#AAAAAA' }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [v, 'Bookings']} />
                <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((e: any, i: number) => (
                    <Cell key={i} fill={e.bookings === Math.max(...weeklyData.map((d: any) => d.bookings)) ? '#FF385C' : '#FFB3BD'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Top Performing Properties</h2>
          {topProperties.length === 0 ? (
            <div className="flex items-center justify-center h-[180px] text-sm" style={{ color: '#AAAAAA' }}>
              {loadingListings ? 'Loading...' : 'No confirmed revenue yet'}
            </div>
          ) : (
            <div className="space-y-3">
              {topProperties.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: i === 0 ? '#FF385C' : i === 1 ? '#FC642D' : i === 2 ? '#d97706' : '#DDDDDD', color: i < 3 ? 'white' : '#717171' }}
                  >
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
          )}
        </div>
      </div>
    </div>
  );
}
