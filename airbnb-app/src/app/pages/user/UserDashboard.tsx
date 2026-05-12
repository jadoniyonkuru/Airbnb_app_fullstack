import { Link } from 'react-router';
import { Calendar, Heart, Star, MapPin, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { bookings, properties } from '../../../data/mockData';

const statusConfig: Record<string, { color: string; bg: string; label: string; icon: any }> = {
  confirmed: { color: '#16a34a', bg: '#dcfce7', label: 'Confirmed', icon: CheckCircle },
  pending: { color: '#d97706', bg: '#fef3c7', label: 'Pending', icon: Clock },
  completed: { color: '#2563eb', bg: '#dbeafe', label: 'Completed', icon: CheckCircle },
  cancelled: { color: '#dc2626', bg: '#fee2e2', label: 'Cancelled', icon: AlertCircle },
};

export function UserDashboard() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>
          Welcome back, Jean Pierre! 👋
        </h1>
        <p className="text-[#717171] text-sm">Here's what's happening with your bookings.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: '7', color: '#FF385C', bg: '#FFF1F3', emoji: '📅' },
          { label: 'Upcoming Trips', value: '2', color: '#00A699', bg: '#E6F7F6', emoji: '✈️' },
          { label: 'Saved Properties', value: '12', color: '#FC642D', bg: '#FFF0EB', emoji: '❤️' },
          { label: 'Reviews Given', value: '5', color: '#484848', bg: '#F0F0F0', emoji: '⭐' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-[#EBEBEB] hover:shadow-md transition-shadow">
            <span className="text-2xl mb-3 block">{stat.emoji}</span>
            <p className="text-[#222222] font-bold text-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
            <p className="text-[#717171] text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-[#EBEBEB]">
            <h2 className="text-[#222222] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Recent Bookings</h2>
            <Link to="/user/bookings" className="text-[#FF385C] text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#EBEBEB]">
            {bookings.slice(0, 3).map(booking => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div key={booking.id} className="p-5 hover:bg-[#FAFAFA] transition-colors">
                  <div className="flex gap-4 items-start">
                    <img src={booking.propertyImage} alt={booking.propertyTitle} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[#222222] font-semibold text-sm line-clamp-1">{booking.propertyTitle}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#717171]" />
                            <p className="text-[#717171] text-xs">{booking.location}</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ color: status.color, background: status.bg }}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 text-xs text-[#717171]">
                          <span>📅 {booking.checkIn}</span>
                          <span>→ {booking.checkOut}</span>
                        </div>
                        <span className="text-[#222222] font-bold text-sm">${booking.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Trip Highlight */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
            <div className="p-5 border-b border-[#EBEBEB]">
              <h3 className="text-[#222222] font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Next Trip</h3>
            </div>
            <div className="relative">
              <img src={bookings[0].propertyImage} alt="" className="w-full h-32 object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-semibold text-sm">{bookings[0].propertyTitle}</p>
                <p style={{ color: 'rgba(255,255,255,0.8)' }} className="text-xs">{bookings[0].checkIn} → {bookings[0].checkOut}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[#717171] text-xs">{bookings[0].nights} nights</span>
                <span className="text-[#222222] font-bold text-sm">${bookings[0].total}</span>
              </div>
              <Link to={`/property/${bookings[0].propertyId}`} className="mt-3 w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                View Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Saved */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#222222] font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Saved Homes</h3>
              <Link to="/user/wishlist" className="text-[#FF385C] text-xs font-medium hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {properties.slice(0, 3).map(p => (
                <Link key={p.id} to={`/property/${p.id}`} className="flex items-center gap-3 group">
                  <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#222222] text-xs font-semibold truncate">{p.title}</p>
                    <p className="text-[#717171] text-xs truncate">{p.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[#222222] text-xs font-bold">${p.price}</p>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-[#FF385C] text-[#FF385C]" />
                      <span className="text-xs text-[#717171]">{p.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-8 bg-white rounded-2xl border border-[#EBEBEB] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#222222] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Recommended for You</h2>
          <Link to="/listings" className="text-[#FF385C] text-sm font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {properties.slice(4, 8).map(p => (
            <Link key={p.id} to={`/property/${p.id}`} className="group rounded-xl overflow-hidden border border-[#EBEBEB] hover:shadow-md transition-shadow">
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-3">
                <p className="text-[#222222] font-semibold text-xs line-clamp-1">{p.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[#717171] text-xs">{p.location}</p>
                  <span className="text-[#222222] font-bold text-xs">${p.price}/night</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}