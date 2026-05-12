import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, Calendar, Heart, User, Settings,
  LogOut, Bell, ChevronRight, MessageCircle, X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
  { label: 'My Bookings', path: '/user/bookings', icon: Calendar },
  { label: 'Wishlist', path: '/user/wishlist', icon: Heart },
  { label: 'Messages', path: '/user/messages', icon: MessageCircle },
  { label: 'Profile', path: '/user/profile', icon: User },
  { label: 'Settings', path: '/user/settings', icon: Settings },
];

const mockNotifications = [
  { id: 1, type: 'booking', title: 'Booking Confirmed!', body: 'Your stay at Modern Apartment Kigali is confirmed for May 15–20.', time: '5 min ago', read: false },
  { id: 2, type: 'reminder', title: 'Check-in Tomorrow', body: 'Reminder: Your check-in at Nairobi Villa is scheduled for tomorrow at 3:00 PM.', time: '2 hours ago', read: false },
  { id: 3, type: 'message', title: 'New message from your host', body: 'Hi Jean Pierre! I\'ll send you the door code an hour before check-in.', time: '4 hours ago', read: false },
  { id: 4, type: 'payment', title: 'Payment Receipt', body: 'Payment of $425 for Kigali apartment booking was processed successfully.', time: '1 day ago', read: true },
  { id: 5, type: 'promo', title: 'Special Offer — 20% Off', body: 'Book your next Paris Studio stay before May 30 and save 20%.', time: '3 days ago', read: true },
];

const notifColors: Record<string, string> = {
  booking: '#FF385C', reminder: '#f59e0b', message: '#00A699', payment: '#16a34a', promo: '#6366f1',
};

export function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const bellRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="flex min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#EBEBEB] min-h-screen flex flex-col shadow-sm hidden md:flex">
        <div className="p-6 border-b border-[#EBEBEB]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF385C] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>S</span>
            </div>
            <span className="text-[#222222] font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Stay<span style={{ color: '#FF385C' }}>Bnb</span>
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div
          className="p-4 mx-3 mt-4 rounded-2xl border border-[#FFD4D8]"
          style={{ backgroundColor: '#FFF1F3' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF385C] rounded-full flex items-center justify-center text-white font-bold text-sm">
              JP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#222222] font-semibold text-sm truncate">Hitayezu Jean Pierre</p>
              <p className="text-xs truncate" style={{ color: '#717171' }}>Guest Account</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
                style={{
                  background: isActive ? '#FF385C' : 'transparent',
                  color: isActive ? 'white' : '#484848'
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#EBEBEB]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F7F7F7] w-full text-left transition-colors"
            style={{ color: '#717171' }}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#EBEBEB] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 text-sm text-[#717171]">
            <Link to="/" className="hover:text-[#222222] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#222222] font-medium capitalize">
              {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
              >
                <Bell className="w-5 h-5 text-[#717171]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-[#EBEBEB] z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#EBEBEB]">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#222222] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Notifications</p>
                      {unreadCount > 0 && (
                        <span className="text-xs font-bold bg-[#FF385C] text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-[#FF385C] font-medium hover:underline">Mark all read</button>
                      )}
                      <button onClick={() => setNotifOpen(false)} className="w-6 h-6 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center">
                        <X className="w-3.5 h-3.5 text-[#717171]" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#EBEBEB]">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className="flex gap-3 px-4 py-3 hover:bg-[#FAFAFA] cursor-pointer transition-colors"
                        style={{ background: n.read ? 'transparent' : '#FFF8F8' }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${notifColors[n.type]}18` }}>
                          <Bell className="w-3.5 h-3.5" style={{ color: notifColors[n.type] }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[#222222] text-xs font-semibold leading-snug">{n.title}</p>
                            {!n.read && <span className="w-2 h-2 bg-[#FF385C] rounded-full shrink-0 mt-1" />}
                          </div>
                          <p className="text-[#717171] text-xs mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                          <p className="text-[#AAAAAA] text-[10px] mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-[#EBEBEB] text-center">
                    <button className="text-xs text-[#FF385C] font-medium hover:underline">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile avatar — branded */}
            <Link
              to="/user/profile"
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors border border-[#FFD4D8]"
              style={{ backgroundColor: '#FFF1F3' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FFE4E8')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFF1F3')}
            >
              <div className="w-7 h-7 bg-[#FF385C] rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">JP</div>
              <span className="text-xs font-semibold hidden sm:block" style={{ color: '#FF385C' }}>Jean Pierre</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}