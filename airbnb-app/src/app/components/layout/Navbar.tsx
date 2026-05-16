import { Menu, User, Sun, Moon, Heart, Pencil, Shuffle, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState, type MouseEvent } from 'react';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { ConfirmModal } from '../shared/ConfirmModal';

interface NavbarProps {
  isDashboard?: boolean;
  transparent?: boolean;
}


export function Navbar({ isDashboard = false, transparent = false }: NavbarProps) {
  const [menuOpen, setMenuOpen]           = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const dashboardBase = isAuthenticated && user ? (user.role === 'HOST' || user.role === 'ADMIN' ? '/dashboard' : '/user/dashboard') : '/dashboard';
  const { wishlist } = useWishlist();

  const handleContactClick = (e: MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent border-transparent'
          : isDark
            ? 'bg-[#1C1C1E] border-b border-[#3A3A3C] shadow-sm'
            : 'bg-white border-b border-[#DDDDDD] shadow-sm'
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="max-w-[1760px] mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-[#FF5A5F] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>S</span>
            </div>
            <span className={`font-bold text-xl hidden sm:block ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
              Stay<span className="text-[#FF5A5F]">Ease</span>
            </span>
          </Link>

          {/* Center Nav Links */}
          {!isDashboard && (
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className={`px-4 py-2 rounded-full hover:text-[#FF5A5F] transition-colors text-sm font-medium ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'}`}>Home</Link>
              <Link to="/listings" className={`px-4 py-2 rounded-full hover:text-[#FF5A5F] transition-colors text-sm font-medium ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'}`}>Listings</Link>
<a
                href="/#contact"
                onClick={handleContactClick}
                className={`px-4 py-2 rounded-full hover:text-[#FF5A5F] transition-colors text-sm font-medium cursor-pointer ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'}`}
              >
                Contact
              </a>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {!isDashboard && (
              <>
                {/* Wishlist */}
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/user/wishlist');
                    } else {
                      navigate('/signin');
                    }
                  }}
                  aria-label="Wishlist"
                  className={`relative hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'
                  }`}
                >
                  <Heart className="w-[18px] h-[18px]" style={{ strokeWidth: 1.8, fill: isAuthenticated && wishlist.length > 0 ? '#FF5A5F' : 'none' }} />
                  {/* saved badge */}
                  {isAuthenticated && wishlist.length > 0 && (
                    <span
                      className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: '#FF5A5F', lineHeight: 1 }}
                    >
                      {wishlist.length > 9 ? '9+' : wishlist.length}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* ── Dark / Light toggle ──────────────────────────── */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isDark
                  ? 'bg-[#FF5A5F]/15 text-[#FF5A5F] hover:bg-[#FF5A5F]/25'
                  : 'hover:bg-[#F7F7F7] text-[#1C1C1E]'
              }`}
            >
              {isDark
                ? <Sun  className="w-[18px] h-[18px]" />
                : <Moon className="w-[18px] h-[18px]" />
              }
            </button>

            {/* User Menu */}
            <div className="relative z-50">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-2.5 border rounded-full pl-3 pr-3 py-2 hover:shadow-md transition-all duration-200 ${isDark ? 'border-[#3A3A3C] bg-[#2C2C2E]' : 'border-[#DDDDDD] bg-white'}`}
              >
                <Menu className={`w-4 h-4 ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`} />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#3C3C3E] rounded-full flex items-center justify-center overflow-hidden">
                    {isAuthenticated && user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : isAuthenticated && user ? (
                      <span className="text-white text-xs font-bold">
                        {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  {isAuthenticated && user && (
                    <span className="hidden sm:inline-block text-sm font-medium text-[#1C1C1E] ml-0.5">
                      {user.name.split(' ')[0]}
                    </span>
                  )}
                </div>
              </button>

              {menuOpen && (
                <div className={`absolute right-0 top-14 z-50 rounded-2xl shadow-2xl border py-2 ${
                  isAuthenticated && user ? 'w-72' : 'w-56'
                } ${isDark ? 'bg-[#2C2C2E] border-[#3A3A3C]' : 'bg-white border-[#DDDDDD]'}`}>

                  {isAuthenticated && user ? (
                    <>
                      {/* Avatar + name + email */}
                      <div className="flex flex-col items-center pt-5 pb-4 px-4">
                        <div className="w-20 h-20 rounded-full bg-[#3C3C3E] flex items-center justify-center mb-3 ring-4 ring-[#FF5A5F]/20 overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-bold text-2xl">
                              {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>{user.name}</p>
                        <p className="text-sm text-[#8E8E93] mt-0.5">{user.email}</p>
                      </div>

                      <div className={`border-t mb-1 ${isDark ? 'border-[#3A3A3C]' : 'border-[#EBEBEB]'}`} />

                      {/* Menu items */}
                      <Link to={dashboardBase} onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'}`}>
                        <User className="w-4 h-4 shrink-0" />
                        My Profile
                      </Link>
                      <div className={`mx-5 border-t ${isDark ? 'border-[#3A3A3C]' : 'border-[#F0F0F0]'}`} />
                      <Link to={dashboardBase} onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'}`}>
                        <Pencil className="w-4 h-4 shrink-0" />
                        Edit Profile
                      </Link>
                      <div className={`mx-5 border-t ${isDark ? 'border-[#3A3A3C]' : 'border-[#F0F0F0]'}`} />
                      <Link to={dashboardBase} onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'}`}>
                        <Shuffle className="w-4 h-4 shrink-0" />
                        Activity Logs
                      </Link>
                      <div className={`mx-5 border-t ${isDark ? 'border-[#3A3A3C]' : 'border-[#F0F0F0]'}`} />
                      <Link to={dashboardBase} onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'}`}>
                        <Settings className="w-4 h-4 shrink-0" />
                        Account Settings
                      </Link>
                      <div className={`mx-5 border-t ${isDark ? 'border-[#3A3A3C]' : 'border-[#F0F0F0]'}`} />
                      <button
                        onClick={() => { setShowLogoutModal(true); setMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'}`}>
                        <LogOut className="w-4 h-4 shrink-0" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'}`}>
                        Sign In
                      </Link>
                      <Link to="/register" onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-[#F7F7F7]'}`}>
                        Register
                      </Link>
                      <div className={`border-t my-1 ${isDark ? 'border-[#3A3A3C]' : 'border-[#EBEBEB]'}`} />
                      <Link to="/experiences" onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isDark ? 'text-white/50 hover:bg-white/10' : 'text-[#6C6C70] hover:bg-[#F7F7F7]'}`}>
                        Experiences
                      </Link>
                      <a
                        href="/#contact"
                        onClick={(e) => { e.preventDefault(); setMenuOpen(false); handleContactClick(e); }}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isDark ? 'text-white/50 hover:bg-white/10' : 'text-[#6C6C70] hover:bg-[#F7F7F7]'}`}
                      >
                        Help & Contact
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          navigate('/');
          toast.success('Logged out successfully');
        }}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Stay signed in"
        type="warning"
      />
    </nav>
  );
}