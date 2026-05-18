import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Home, Calendar, DollarSign,
  Star, FileText, LogOut, Bell, ChevronRight, BarChart2,
  Settings, Shield, User, X, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminStats } from '../../../features/admin/hooks';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const { data: stats } = useAdminStats();
  const [collapsed,      setCollapsed]      = useState(false);
  const [notifOpen,      setNotifOpen]      = useState(false);

  const navSections = [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Management',
      items: [
        { label: 'Users',    path: '/admin-dashboard/users',    icon: Users,     badge: stats?.totalUsers    ? String(stats.totalUsers)    : undefined },
        { label: 'Hosts',    path: '/admin-dashboard/hosts',    icon: Shield,    badge: stats?.totalHosts    ? String(stats.totalHosts)    : undefined },
        { label: 'Listings', path: '/admin-dashboard/listings', icon: Home,      badge: stats?.totalListings ? String(stats.totalListings) : undefined },
        { label: 'Bookings', path: '/admin-dashboard/bookings', icon: Calendar,  badge: stats?.totalBookings ? String(stats.totalBookings) : undefined },
      ],
    },
    {
      label: 'Finance',
      items: [
        { label: 'Payments', path: '/admin-dashboard/payments', icon: DollarSign },
        { label: 'Reports',  path: '/admin-dashboard/reports',  icon: BarChart2 },
      ],
    },
    {
      label: 'Content',
      items: [
        { label: 'Reviews',   path: '/admin-dashboard/reviews',   icon: Star,     badge: stats?.totalReviews ? String(stats.totalReviews) : undefined },
        { label: 'Analytics', path: '/admin-dashboard/analytics', icon: FileText },
      ],
    },
    {
      label: 'System',
      items: [
        { label: 'Settings',      path: '/admin-dashboard/settings', icon: Settings },
        { label: 'Admin Profile', path: '/admin-dashboard/profile',  icon: User },
      ],
    },
  ];

  const [notifications,  setNotifications]  = useState([
    { id: 1, type: 'user',    title: 'New Host Registration',   body: 'Amina Diallo submitted a host registration request.',                        time: '5 min ago',   read: false },
    { id: 2, type: 'alert',   title: 'Listing Flagged',         body: 'Listing #L-0049 was flagged by 2 users for inaccurate photos.',               time: '30 min ago',  read: false },
    { id: 3, type: 'payment', title: 'Payment Dispute Opened',  body: 'Booking #B003 has an open dispute for $840. Review required.',                time: '2 hours ago', read: false },
    { id: 4, type: 'system',  title: 'System Backup Complete',  body: 'Scheduled daily backup completed at 03:00 AM.',                               time: '5 hours ago', read: false },
    { id: 5, type: 'user',    title: 'User Spike Detected',     body: '156 new registrations in the last 24 hours — above average.',                 time: '1 day ago',   read: false },
    { id: 6, type: 'review',  title: 'Review Needs Moderation', body: 'A guest review for Nairobi Villa contains potentially inappropriate content.', time: '1 day ago',   read: false },
    { id: 7, type: 'payment', title: 'Large Payout Processed',  body: 'Host payout of $8,420 was processed to account ending 4821.',                 time: '2 days ago',  read: true  },
    { id: 8, type: 'system',  title: 'SSL Certificate Renewed', body: 'Platform SSL certificate renewed through May 2027.',                          time: '3 days ago',  read: true  },
  ]);

  const bellRef     = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead    = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const notifColors: Record<string, string> = {
    user: '#2563eb', alert: '#dc2626', payment: '#16a34a', system: '#6366f1', review: '#f59e0b',
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="flex min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside
        className="bg-white border-r border-[#EBEBEB] min-h-screen flex-col shadow-sm hidden md:flex transition-all duration-300 fixed"
        style={{
          width:    collapsed ? '72px' : '260px',
          minWidth: collapsed ? '72px' : '260px',
          height:   '100vh',
          zIndex:   40,
        }}
      >
        {/* Logo */}
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
          <div className="w-8 h-8 bg-[#FF385C] rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>S</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <span className="text-[#222222] font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Stay<span style={{ color: '#FF385C' }}>Ease</span>
              </span>
              <p className="text-xs" style={{ color: '#AAAAAA', lineHeight: 1, marginTop: 2 }}>Admin Panel</p>
            </div>
          )}
        </Link>

        {/* Admin card */}
        {!collapsed && (
          <div className="p-4 mx-3 mt-4 rounded-2xl border border-[#FFD4D8]" style={{ backgroundColor: '#FFF1F3' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#222222] font-semibold text-sm truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{user?.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <p className="text-xs" style={{ color: '#717171' }}>Administrator</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {navSections.map(section => (
            <div key={section.label}>
              {!collapsed ? (
                <p className="text-xs font-semibold uppercase tracking-widest px-3 pt-4 pb-1.5" style={{ color: '#AAAAAA' }}>
                  {section.label}
                </p>
              ) : (
                <div className="my-2 mx-3 h-px bg-[#EBEBEB]" />
              )}

              {section.items.map(item => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/admin-dashboard' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 relative mb-0.5 hover:bg-[#F7F7F7]"
                    style={{
                      backgroundColor: isActive ? '#FFF1F3' : 'transparent',
                      color:           isActive ? '#FF385C' : '#484848',
                      borderLeft:      isActive ? '3px solid #FF385C' : '3px solid transparent',
                      justifyContent:  collapsed ? 'center' : 'flex-start',
                      textDecoration:  'none',
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="text-sm font-medium flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: isActive ? '#FF385C' : '#F0F0F0',
                              color: isActive ? 'white' : '#717171',
                            }}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && !item.badge && <ChevronRight className="w-4 h-4 opacity-50" />}
                      </>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 pb-4 border-t border-[#EBEBEB] space-y-0.5 pt-2">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-150 hover:bg-[#F7F7F7]"
            style={{ color: '#AAAAAA', justifyContent: collapsed ? 'center' : 'flex-start' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <PanelLeftOpen  className="w-[18px] h-[18px] shrink-0 text-[#FF385C]" />
              : <><PanelLeftClose className="w-[18px] h-[18px] shrink-0" /><span className="text-sm font-medium">Collapse</span></>
            }
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFF1F3] w-full text-left transition-colors group"
            style={{ color: '#717171', justifyContent: collapsed ? 'center' : 'flex-start' }}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 group-hover:text-[#FF385C] transition-colors" />
            {!collapsed && <span className="text-sm font-medium group-hover:text-[#FF385C] transition-colors">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white" style={{ marginLeft: collapsed ? '72px' : '260px' }}>

        {/* Top bar */}
        <header className="bg-white border-b border-[#EBEBEB] px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: '#717171' }}>Admin</span>
            <ChevronRight className="w-3 h-3" style={{ color: '#AAAAAA' }} />
            <span className="font-semibold capitalize" style={{ color: '#FF385C' }}>
              {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{ background: '#F0FDF4', color: '#15803d', borderColor: '#bbf7d0' }}>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              All systems operational
            </div>

            {/* Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F7F7F7')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Bell className="w-5 h-5" style={{ color: '#717171' }} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-[#EBEBEB] z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#EBEBEB]">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E' }}>Notifications</p>
                      {unreadCount > 0 && (
                        <span className="text-xs font-bold bg-[#FF385C] text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs font-medium hover:underline" style={{ color: '#FF385C' }}>Mark all read</button>
                      )}
                      <button onClick={() => setNotifOpen(false)} className="w-6 h-6 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center">
                        <X className="w-3.5 h-3.5" style={{ color: '#717171' }} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#EBEBEB]">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className="flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[#FFFAF9]"
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
                            <p className="text-xs font-semibold leading-snug" style={{ color: '#1C1C1E' }}>{n.title}</p>
                            {!n.read && <span className="w-2 h-2 bg-[#FF385C] rounded-full shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs mt-0.5 leading-relaxed line-clamp-2" style={{ color: '#717171' }}>{n.body}</p>
                          <p className="text-[10px] mt-1" style={{ color: '#AAAAAA' }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-[#EBEBEB] text-center">
                    <button className="text-xs font-medium hover:underline" style={{ color: '#FF385C' }}>View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile - clicking goes to dashboard */}
            <Link
              to="/admin-dashboard"
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors border"
              style={{
                backgroundColor: '#FFF1F3',
                borderColor: '#FFD4D8'
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FFE4E8')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFF1F3')}
            >
              <div className="w-7 h-7 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U'}
              </div>
              <span className="text-xs font-semibold hidden sm:block" style={{ color: '#FF385C' }}>{user?.name.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
