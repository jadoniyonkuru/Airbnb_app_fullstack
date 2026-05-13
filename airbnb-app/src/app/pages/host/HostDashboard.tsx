import { DashboardCard } from '../../components/dashboard';
import { Home, Calendar, DollarSign, Star, Eye, Edit, Trash2, ToggleLeft, ToggleRight, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useListings } from '../../../features/listings/hooks';
import { useBookings } from '../../../features/bookings/hooks';
// TODO: Replace with API when earnings/stats endpoint is available
const hostEarnings = [
  { month: 'Jan', earnings: 1200 }, { month: 'Feb', earnings: 1800 },
  { month: 'Mar', earnings: 2400 }, { month: 'Apr', earnings: 2100 },
  { month: 'May', earnings: 3200 }, { month: 'Jun', earnings: 2800 },
  { month: 'Jul', earnings: 3600 }, { month: 'Aug', earnings: 4100 },
  { month: 'Sep', earnings: 3400 }, { month: 'Oct', earnings: 2900 },
  { month: 'Nov', earnings: 3800 }, { month: 'Dec', earnings: 4200 },
];
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router';
import { useState, useId } from 'react';

const propertyImages = [
  'https://images.unsplash.com/photo-1601221998768-c0cdf463a393?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1652349566508-457d0565463c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1775759199957-8e3a2037047f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1646974400439-8472d58bb19e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1712123748043-9d0602c59f79?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1611596188718-840151555242?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1759143201153-948b3d535c49?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1765728614529-4749706523d9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1773101883566-909ab37de796?w=800&h=600&fit=crop',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#EBEBEB] rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-[#222222] mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }}>${entry.value?.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

export function HostDashboard() {
  const rawId = useId();
  const gradientId = `hd-grad-${rawId.replace(/:/g, '')}`;
  const { data: hostListings = [], isLoading: loadingListings } = useListings();
  const { data: bookings = [], isLoading: loadingBookings } = useBookings();
  const [showAllBookings, setShowAllBookings] = useState(false);

  const totalListingsCount = hostListings.length;
  const activeBookingsCount = bookings.filter(b => b.status.toLowerCase() === 'confirmed' || b.status.toLowerCase() === 'pending').length;
  const totalEarnings = bookings
    .filter(b => b.status.toLowerCase() === 'confirmed' || b.status.toLowerCase() === 'completed')
    .reduce((sum, b) => sum + b.total, 0);
  const avgRating = hostListings.length > 0 
    ? (hostListings.reduce((sum, l) => sum + (l.rating || 0), 0) / hostListings.length).toFixed(1)
    : '0.0';

  const displayedBookings = showAllBookings ? bookings : bookings.slice(0, 3);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>
            Host Dashboard
          </h1>
          <p className="text-[#717171] text-sm">Welcome back! Here's your property overview.</p>
        </div>
        <Link to="/dashboard/add-listing" className="flex items-center gap-2 bg-[#FF5A5F] hover:bg-[#E74C55] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
          + Add Property
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard title="Total Listings"  value={loadingListings ? '...' : totalListingsCount.toString()}      icon={Home}      trend="+2 this month" trendUp />
        <DashboardCard title="Active Bookings" value={loadingBookings ? '...' : activeBookingsCount.toString()}     icon={Calendar}  trend="+5 this week"  trendUp />
        <DashboardCard title="Total Earnings"  value={loadingBookings ? '...' : `$${totalEarnings.toLocaleString()}`} icon={DollarSign} trend="+12%"          trendUp />
        <DashboardCard title="Avg Rating"      value={loadingListings ? '...' : `${avgRating}★`}  icon={Star}      subtitle="Based on overall performance" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Earnings Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#222222] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Revenue Overview</h2>
              <p className="text-[#717171] text-xs mt-0.5">Monthly earnings performance</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">↑ +18% YoY</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={hostEarnings}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5A5F" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF5A5F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#717171' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="earnings" stroke="#FF5A5F" strokeWidth={2.5} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 5, fill: '#FF5A5F' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[#222222] font-semibold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Performance</h2>
          <div className="space-y-5">
            {[
              { label: 'Occupancy Rate', value: 87, color: '#FF5A5F' },
              { label: 'Response Rate', value: 95, color: '#00A699' },
              { label: 'Guest Satisfaction', value: 98, color: '#FC642D' },
              { label: 'Listing Views', value: 73, color: '#484848' },
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#717171] text-sm">{metric.label}</span>
                  <span className="text-[#222222] font-semibold text-sm">{metric.value}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: '#F0F0F0' }}>
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${metric.value}%`, background: metric.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-[#EBEBEB]">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F7F7F7' }}>
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <p className="text-[#222222] font-semibold text-sm">Superhost Status</p>
                <p className="text-[#717171] text-xs">You qualify! </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden flex flex-col mb-8">
        <div className="flex items-center justify-between p-6 border-b border-[#EBEBEB] shrink-0">
          <h2 className="text-[#222222] font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Recent Reservations</h2>
          <Link to="/dashboard/bookings" className="text-[#FF5A5F] text-xs font-medium hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-[#EBEBEB] flex-1 overflow-y-auto">
          {displayedBookings.map(booking => (
            <div key={booking.id} className="p-4 hover:bg-[#FAFAFA] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-[#FF5A5F] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {booking.guestAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#222222] font-semibold text-xs truncate">{booking.guest}</p>
                  <p className="text-[#717171] text-xs truncate">{booking.propertyTitle.split(' ').slice(0, 2).join(' ')}...</p>
                </div>
                <span className="text-[#222222] font-bold text-xs shrink-0">${booking.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#717171] text-xs">{booking.checkIn}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                  booking.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        {bookings.length > 3 && !showAllBookings && (
          <div className="border-t border-[#EBEBEB] p-4 text-center shrink-0">
            <button
              onClick={() => setShowAllBookings(true)}
              className="text-[#FF5A5F] text-sm font-semibold hover:underline"
            >
              View More ({bookings.length - 3} more)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}