import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Home, Plus, Calendar, DollarSign,
  User, LogOut, Bell, ChevronRight, Star, MessageCircle,
  Settings, X, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard',   path: '/dashboard',                icon: LayoutDashboard },
  { label: 'My Listings', path: '/dashboard/listings',       icon: Home },
  { label: 'Add Listings',path: '/dashboard/add-listing',    icon: Plus },
  { label: 'Reservations',path: '/dashboard/bookings',       icon: Calendar,      badge: '3' },
  { label: 'Earnings',    path: '/dashboard/earnings',       icon: DollarSign },
  { label: 'Reviews',     path: '/dashboard/reviews',        icon: Star },
  { label: 'Messages',    path: '/dashboard/messages',       icon: MessageCircle },
  { label: 'Profile',     path: '/dashboard/profile',        icon: User },
  { label: 'Settings',    path: '/dashboard/settings',       icon: Settings },
];

const mockNotifications = [
  { id: 1, type: 'booking', title: 'New Booking Request',   body: 'James Okafor requested 5 nights at your Kigali apartment.',              time: '2 min ago',  read: false },
  { id: 2, type: 'booking', title: 'Booking Cancelled',     body: 'Emily Chen cancelled her booking for May 15-20.',                      time: '1 hour ago', read: false },
  { id: 3, type: 'message', title: 'Message from Guest',    body: 'Hi! Just wanted to confirm the check-in time.',                       time: '3 hours ago', read: false },
];

const notifColors: Record<string, string> = {
  booking: '#FF5A5F', review: '#f59e0b', message: '#00A699', earning: '#16a34a', system: '#6366f1',
};

export function HostLayout() {
  const { user } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [collapsed, setCollapsed]   = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const bellRef   = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead    = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="flex min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      
      <aside
        className="bg-white border-r border-[#EBEBEB] min-h-screen flex-col shadow-sm hidden md:flex transition-all duration-300 fixed"
        style={{
          width:    collapsed ? '72px' : '260px',
          minWidth: collapsed ? '72px' : '260px',
          height: '100vh',
          zIndex: 40,
        }}
      >
        
        <Link
          to="/"
          className="flex items-center border-b border-[#EBEBEB] hover:opacity-80 transition-opacity"
          style={{
            padding:        collapsed ? '20px 0' : '24px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap:            collapsed ? 0 : 12,
            minHeight:      72,
            textDecoration: 'none',
          }}
        >
          {!collapsed && (
            <span className="text-[#222222] font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Stay<span style={{ color: '#FF5A5F' }}>Ease</span>
            </span>
          )}
        </Link>

      
        {!collapsed && (
          <div
            className="p-4 mx-3 mt-4 rounded-2xl border border-[#FFD4D8]"
            style={{ backgroundColor: '#FFF1F3' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#FF5A5F] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#222222] font-semibold text-sm truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {user?.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <p className="text-xs" style={{ color: '#717171' }}>Host</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section label */}
        {!collapsed && (
          <p className="text-xs font-semibold uppercase tracking-widest px-7 mt-6 mb-2" style={{ color: '#AAAAAA' }}>
            Main Menu
          </p>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto py-2">
          {navItems.map(item => {
            const Icon     = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 relative"
                style={{
                  backgroundColor: isActive ? '#FF5A5F' : 'transparent',
                  color:           isActive ? 'white'   : '#484848',
                  justifyContent:  collapsed ? 'center' : 'flex-start',
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                    {(item as any).badge && !isActive && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#FF5A5F] text-white">
                        {(item as any).badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && (item as any).badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5A5F] rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                    {(item as any).badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

  
        <div className="px-2 py-2 border-t border-[#EBEBEB]">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-150 hover:bg-[#F7F7F7] group"
            style={{
              color:          '#AAAAAA',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <PanelLeftOpen  className="w-[18px] h-[18px] shrink-0 text-[#FF5A5F]" />
              : <>
                  <PanelLeftClose className="w-[18px] h-[18px] shrink-0" />
                  <span className="text-sm font-medium">Collapse</span>
                </>
            }
          </button>
        </div>

        {/* Logout */}
        <div className="px-2 pb-4 border-t border-[#EBEBEB]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFF1F3] w-full text-left transition-colors mt-2 group"
            style={{
              color:          '#717171',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 group-hover:text-[#FF5A5F] transition-colors" />
            {!collapsed && <span className="text-sm font-medium group-hover:text-[#FF5A5F] transition-colors">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white" style={{ marginLeft: collapsed ? '72px' : '260px', height: '100vh', overflow: 'hidden' }}>

        {/* Top Bar */}
        <header className="bg-white border-b border-[#EBEBEB] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">

          <div className="flex items-center gap-4">
            <span className="text-[#222222] font-bold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Stay<span style={{ color: '#FF5A5F' }}>Ease</span>
            </span>
            <span className="text-[#717171] text-sm">Host</span>
            <span className="text-[#717171] text-sm">dashboard</span>
            {user && (
              <div className="flex items-center gap-2 ml-4">
                <div className="w-8 h-8 bg-[#FF5A5F] rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span className="text-[#222222] font-semibold text-sm">{user.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
              >
                <Bell className="w-5 h-5" style={{ color: '#717171' }} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#FF5A5F] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
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
                        <span className="text-xs font-bold bg-[#FF5A5F] text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-[#FF5A5F] font-medium hover:underline">Mark all read</button>
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
                        style={{ background: n.read ? 'transparent' : '#FFFAF8' }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${notifColors[n.type]}18` }}
                        >
                          <Bell className="w-3.5 h-3.5" style={{ color: notifColors[n.type] }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[#222222] text-xs font-semibold leading-snug">{n.title}</p>
                            {!n.read && <span className="w-2 h-2 bg-[#FF5A5F] rounded-full shrink-0 mt-1" />}
                          </div>
                          <p className="text-[#717171] text-xs mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                          <p className="text-[#AAAAAA] text-[10px] mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-[#EBEBEB] text-center">
                    <button className="text-xs text-[#FF5A5F] font-medium hover:underline">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile avatar — user icon only */}
            <Link
              to="/dashboard"
              className="flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-[#F7F7F7]"
            >
              <User className="w-5 h-5" style={{ color: '#717171' }} />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
