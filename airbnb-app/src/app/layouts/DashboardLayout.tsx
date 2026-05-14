import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, Users, Home, Calendar, DollarSign, Star, FileText, LogOut, Bell, ChevronRight,
  BarChart2, Settings, Shield, User, X, PanelLeftClose, PanelLeftOpen, Plus, MessageCircle,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const hostMenus = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Listings', path: '/dashboard/listings', icon: Home },
  { label: 'Add Listings', path: '/dashboard/add-listing', icon: Plus },
  { label: 'Reservations', path: '/dashboard/bookings', icon: Calendar, badge: '3' },
  { label: 'Earnings', path: '/dashboard/earnings', icon: DollarSign },
  { label: 'Reviews', path: '/dashboard/reviews', icon: Star },
  { label: 'Messages', path: '/dashboard/messages', icon: MessageCircle },
  { label: 'Profile', path: '/dashboard/profile', icon: User },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const adminMenus = [
  { section: 'Overview', items: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ]},
  { section: 'Management', items: [
    { label: 'Users', path: '/dashboard/users', icon: Users, badge: '1.2k' },
    { label: 'Hosts', path: '/dashboard/hosts', icon: Shield },
    { label: 'Bookings', path: '/dashboard/bookings', icon: Calendar },
  ]},
  { section: 'Finance', items: [
    { label: 'Payments', path: '/dashboard/payments', icon: DollarSign },
    { label: 'Reports', path: '/dashboard/reports', icon: BarChart2 },
  ]},
  { section: 'Content', items: [
    { label: 'Reviews', path: '/dashboard/reviews', icon: Star, badge: '5' },
    { label: 'Analytics', path: '/dashboard/analytics', icon: FileText },
  ]},
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'ADMIN';
  const menus = isAdmin ? adminMenus : hostMenus;

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
        className="bg-white border-r border-[#EBEBEB] flex-col shadow-sm hidden md:flex transition-all duration-300"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          width: collapsed ? '72px' : '260px',
          minWidth: collapsed ? '72px' : '260px',
          overflow: 'hidden',
        }}
      >
        <Link
          to="/"
          className="flex items-center border-b border-[#EBEBEB] hover:opacity-80 transition-opacity"
          style={{
            padding: collapsed ? '20px 0' : '24px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : 12,
            minHeight: 72,
            textDecoration: 'none',
          }}
        >
          <div className="w-8 h-8 bg-[#FF385C] rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>SE</span>
          </div>
          {!collapsed && (
            <span className="text-[#222222] font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>StayEase</span>
          )}
        </Link>

        {!collapsed && (
          <div className="p-4 mx-3 mt-4 rounded-2xl border border-[#FFD4D8]" style={{ backgroundColor: '#FFF1F3' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#FF385C] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#222222] font-semibold text-sm truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {user?.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <p className="text-xs" style={{ color: '#717171' }}>{isAdmin ? 'Administrator' : 'Host · Superhost ⭐'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 space-y-0.5 py-2">
          {isAdmin ? (
            adminMenus.map(section => (
              <div key={section.section}>
                {!collapsed && (
                  <p className="text-xs font-semibold uppercase tracking-widest px-7 mt-6 mb-2" style={{ color: '#AAAAAA' }}>
                    {section.section}
                  </p>
                )}
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 relative"
                      style={{
                        backgroundColor: isActive ? '#FF385C' : 'transparent',
                        color: isActive ? 'white' : '#484848',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                      }}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="text-sm font-medium flex-1">{item.label}</span>
                          {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                          {(item as any).badge && !isActive && (
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#FF385C] text-white">
                              {(item as any).badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && (item as any).badge && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                          {(item as any).badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))
          ) : (
            <>
              {!collapsed && (
                <p className="text-xs font-semibold uppercase tracking-widest px-7 mt-6 mb-2" style={{ color: '#AAAAAA' }}>
                  Main Menu
                </p>
              )}
              {hostMenus.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 relative"
                    style={{
                      backgroundColor: isActive ? '#FF385C' : 'transparent',
                      color: isActive ? 'white' : '#484848',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="text-sm font-medium flex-1">{item.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                        {(item as any).badge && !isActive && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#FF385C] text-white">
                            {(item as any).badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && (item as any).badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                        {(item as any).badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="px-2 py-2 border-t border-[#EBEBEB]">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-150 hover:bg-[#F7F7F7] group"
            style={{ color: '#AAAAAA', justifyContent: collapsed ? 'center' : 'flex-start' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-[18px] h-[18px] shrink-0 text-[#FF385C]" />
            ) : (
              <>
                <PanelLeftClose className="w-[18px] h-[18px] shrink-0" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>

        <div className="px-2 pb-4 border-t border-[#EBEBEB]">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFF1F3] w-full text-left transition-colors mt-2 group"
            style={{ color: '#717171', justifyContent: collapsed ? 'center' : 'flex-start' }}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 group-hover:text-[#FF385C] transition-colors" />
            {!collapsed && <span className="text-sm font-medium group-hover:text-[#FF385C] transition-colors">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-white" style={{ marginLeft: collapsed ? 72 : 260 }}>
        <header className="bg-white border-b border-[#EBEBEB] px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#717171' }}>
            <Link to="/" className="hover:text-[#222222] transition-colors font-medium">StayEase</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#222222] font-medium capitalize">{isAdmin ? 'Admin' : 'Host'}</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: '#FF385C', fontWeight: 600 }} className="capitalize">
              {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
              >
                <Bell className="w-5 h-5" style={{ color: '#717171' }} />
              </button>
            </div>

            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors border border-[#FFD4D8]"
              style={{ backgroundColor: '#FFF1F3' }}
            >
              <div className="w-7 h-7 bg-[#FF385C] rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
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
