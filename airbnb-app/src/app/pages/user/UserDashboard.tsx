import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  LayoutDashboard, Calendar, Heart, MessageCircle, CreditCard, Star, Bell, Settings, LogOut, Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUserBookings } from '../../../features/bookings/hooks';
import { useListings } from '../../../features/listings/hooks';
import { toast } from 'sonner';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: bookings = [], isLoading: loadingBookings } = useUserBookings(user?.id || '');
  const { data: listings = [], isLoading: loadingListings } = useListings();

  const [active, setActive] = useState<'overview' | 'trips' | 'wishlist' | 'messages' | 'payments' | 'notifications' | 'settings'>('overview');

  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pendingPayments = bookings.filter(b => b.status === 'pending');
  const saved = listings.slice(0, 6); // placeholder for wishlist

  const handleRemoveSaved = (id: string) => {
    toast.success('Removed from Saved');
  };

  return (
    <div className="flex min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col bg-white border-r border-[#EBEBEB]" style={{ width: 260 }}>
        <Link to="/" className="flex items-center gap-3 px-6 py-5 border-b border-[#EBEBEB]">
          <div className="w-8 h-8 bg-[#FF385C] rounded-xl flex items-center justify-center text-white font-bold">SE</div>
          <span className="text-[#222222] font-bold text-lg">StayEase</span>
        </Link>

        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm" style={{ background: '#FF385C' }}>
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) ?? 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#222222]">{user?.name}</p>
              <p className="text-xs text-[#717171]">Guest</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {[
            { label: 'Dashboard', key: 'overview', icon: LayoutDashboard },
            { label: 'My Trips', key: 'trips', icon: Calendar },
            { label: 'Wishlist', key: 'wishlist', icon: Heart },
            { label: 'Messages', key: 'messages', icon: MessageCircle },
            { label: 'Payments', key: 'payments', icon: CreditCard },
            { label: 'Reviews', key: 'reviews', icon: Star },
            { label: 'Notifications', key: 'notifications', icon: Bell },
            { label: 'Profile Settings', key: 'settings', icon: Settings },
          ].map(i => (
            <button
              key={i.key}
              onClick={() => setActive(i.key as any)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-[#F7F7F7] ${active === (i.key as any) ? 'bg-[#FFFAFB] border-l-4 border-[#FF385C]' : ''}`}
            >
              <i.icon className="w-4 h-4 text-[#484848]" />
              <span className="text-sm font-medium text-[#222222]">{i.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#EBEBEB]">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 w-full px-4 py-2 rounded-xl hover:bg-[#FFF1F3]">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1" style={{ marginLeft: 0 }}>
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB] sticky top-0 bg-white z-20">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <input placeholder="Search listings" className="px-4 py-2 rounded-xl border border-[#EBEBEB] w-72 text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#F7F7F7]">
              <Bell className="w-5 h-5 text-[#717171]" />
              {pendingPayments.length > 0 && <span className="absolute -top-1 -right-1 bg-[#FF385C] w-4 h-4 rounded-full flex items-center justify-center text-white text-[11px]">{pendingPayments.length}</span>}
            </button>

            <div className="flex items-center gap-3 border border-[#FFD4D8] rounded-xl px-3 py-1" style={{ background: '#FFF1F3' }}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-xs" style={{ background: '#FF385C' }}>
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) ?? 'U'}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-[#FF385C]">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8">
          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Overview or Section Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{active === 'overview' ? 'Dashboard' : active === 'trips' ? 'My Trips' : active === 'wishlist' ? 'Wishlist' : active === 'messages' ? 'Messages' : active === 'payments' ? 'Payments' : active === 'notifications' ? 'Notifications' : 'Profile Settings'}</h1>
                <div className="flex items-center gap-3">
                  <button onClick={() => setActive('overview')} className="text-sm px-3 py-2 rounded-xl bg-[#FF385C] text-white">Quick actions</button>
                </div>
              </div>

              {active === 'overview' && (
                <>
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                      <p className="text-xs text-[#717171]">Upcoming Trips</p>
                      <p className="text-2xl font-bold">{upcoming.length}</p>
                      <p className="text-sm text-[#717171]">Trips starting soon</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                      <p className="text-xs text-[#717171]">Total Bookings</p>
                      <p className="text-2xl font-bold">{bookings.length}</p>
                      <p className="text-sm text-[#717171]">All time</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                      <p className="text-xs text-[#717171]">Saved Hotels</p>
                      <p className="text-2xl font-bold">{saved.length}</p>
                      <p className="text-sm text-[#717171]">Your wishlist</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                      <p className="text-xs text-[#717171]">Pending Payments</p>
                      <p className="text-2xl font-bold">{pendingPayments.length}</p>
                      <p className="text-sm text-[#717171]">Requires action</p>
                    </div>
                  </div>

                  {/* Recent Bookings */}
                  <div className="bg-white rounded-2xl border border-[#EBEBEB] mb-6">
                    <div className="p-4 border-b border-[#EBEBEB] flex items-center justify-between">
                      <h2 className="font-semibold">Recent Bookings</h2>
                      <Link to="/user/bookings" className="text-[#FF385C] text-sm">View all</Link>
                    </div>
                    <div className="divide-y">
                      {loadingBookings ? (
                        <div className="p-6">Loading...</div>
                      ) : bookings.length === 0 ? (
                        <div className="p-6 text-sm text-[#717171]">No bookings yet.</div>
                      ) : (
                        bookings.slice(0,3).map(b => (
                          <div key={b.id} className="p-4 flex items-center gap-4">
                            <img src={b.propertyImage} className="w-20 h-14 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{b.propertyTitle}</p>
                              <p className="text-xs text-[#717171]">{b.checkIn} → {b.checkOut} • {b.nights} nights</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${b.total}</p>
                              <p className="text-xs text-[#717171]">{b.status}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recommended / Saved */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {saved.map(p => (
                      <Link key={p.id} to={`/property/${p.id}`} className="group bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden flex items-stretch">
                        <img src={p.image} alt={p.title} className="w-36 h-full object-cover" />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-sm font-semibold truncate">{p.title}</p>
                            <p className="text-xs text-[#717171] truncate">{p.location}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 text-xs text-[#717171]">
                              <Star className="w-3 h-3 text-[#FF385C]" />
                              <span>{p.rating ?? '4.8'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">${p.price}</span>
                              <button onClick={(e) => { e.preventDefault(); handleRemoveSaved(p.id); }} className="text-sm text-[#FF385C] p-2 rounded-lg hover:bg-[#FFF1F3]"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {active === 'trips' && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                  {bookings.length === 0 ? (
                    <div className="p-6 text-sm text-[#717171]">You have no trips. <Link to="/listings" className="text-[#FF385C]">Explore properties</Link></div>
                  ) : (
                    bookings.map(b => (
                      <div key={b.id} className="p-4 border-b last:border-b-0 flex items-center gap-4">
                        <img src={b.propertyImage} className="w-28 h-20 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{b.propertyTitle}</p>
                          <p className="text-xs text-[#717171]">{b.location}</p>
                          <p className="text-xs text-[#717171] mt-1">{b.checkIn} → {b.checkOut} • {b.nights} nights</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${b.total}</p>
                          <p className="text-xs text-[#717171]">{b.status}</p>
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => navigate(`/property/${b.propertyId}`)} className="text-sm text-[#FF385C]">View</button>
                            <button className="text-sm text-[#717171]">Contact host</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {active === 'wishlist' && (
                <div className="space-y-4">
                  {saved.length === 0 ? (
                    <div className="p-6 text-sm text-[#717171]">No saved properties.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {saved.map(p => (
                        <div key={p.id} className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden flex">
                          <img src={p.image} className="w-36 h-28 object-cover" />
                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="font-semibold text-sm">{p.title}</p>
                              <p className="text-xs text-[#717171]">{p.location}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-[#FF385C]" />
                                <span className="text-xs text-[#717171]">{p.rating ?? '4.8'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">${p.price}</span>
                                <button onClick={() => handleRemoveSaved(p.id)} className="text-[#FF385C] p-2 rounded-lg hover:bg-[#FFF1F3]"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {active === 'notifications' && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                  <p className="text-sm text-[#717171] mb-3">Recent notifications</p>
                  {bookings.length === 0 ? (
                    <div className="text-sm text-[#717171]">No notifications</div>
                  ) : (
                    bookings.slice(0,6).map(b => (
                      <div key={b.id} className="p-3 border-b last:border-b-0 flex items-start gap-3">
                        <Bell className="w-5 h-5 text-[#FF385C]" />
                        <div>
                          <p className="text-sm"><span className="font-semibold">Booking {b.id}</span> status: <span className="font-medium">{b.status}</span></p>
                          <p className="text-xs text-[#717171]">{b.checkIn} → {b.checkOut}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {active === 'settings' && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                  <h3 className="font-semibold mb-3">Profile Settings</h3>
                  <p className="text-sm text-[#717171] mb-4">Manage your personal details, avatar, and account preferences.</p>
                  <div className="flex gap-3">
                    <Link to="/user/profile" className="px-4 py-2 bg-[#FF385C] text-white rounded-xl">Edit Profile</Link>
                    <Link to="/user/settings" className="px-4 py-2 border border-[#EBEBEB] rounded-xl">Account Settings</Link>
                  </div>
                </div>
              )}

            </div>

            {/* Right column: Notifications / Quick actions */}
            <aside className="lg:col-span-1">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                  <p className="text-xs text-[#717171]">Quick Actions</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => setActive('trips')} className="px-3 py-2 rounded-xl bg-[#FFF1F3] text-sm">My Trips</button>
                    <button onClick={() => setActive('wishlist')} className="px-3 py-2 rounded-xl bg-[#FFF1F3] text-sm">Wishlist</button>
                    <button onClick={() => navigate('/listings')} className="px-3 py-2 rounded-xl bg-[#FFF1F3] text-sm">Explore</button>
                    <button onClick={() => setActive('notifications')} className="px-3 py-2 rounded-xl bg-[#FFF1F3] text-sm">Notifications</button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Pending Payments</p>
                    <Link to="/user/payments" className="text-xs text-[#FF385C]">Manage</Link>
                  </div>
                  {pendingPayments.length === 0 ? (
                    <p className="text-sm text-[#717171]">No pending payments</p>
                  ) : (
                    pendingPayments.slice(0,3).map(p => (
                      <div key={p.id} className="flex items-center gap-3 mb-3">
                        <img src={p.propertyImage} className="w-12 h-10 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{p.propertyTitle}</p>
                          <p className="text-xs text-[#717171]">${p.total} • {p.status}</p>
                        </div>
                        <button className="text-[#FF385C] text-sm">Pay</button>
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Messages</p>
                    <Link to="/user/messages" className="text-xs text-[#FF385C]">Open</Link>
                  </div>
                  <p className="text-sm text-[#717171]">No new messages</p>
                </div>
              </div>
            </aside>

          </div>
        </main>
      </div>
    </div>
  );
}
