import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLogin } from '../../features/auth/hooks';
import { useAuth } from '../context/AuthContext';

const SIDE_IMG = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1080&q=80";

export function SignIn() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login: authLogin } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [role,     setRole]     = useState<'guest' | 'host'>('guest');

  const loginMutation = useLogin();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    loginMutation.mutate(
      { email: email.trim(), password, role: role.toUpperCase() as 'GUEST' | 'HOST' | 'ADMIN' },
      {
        onSuccess: (res) => {
          const { user } = res.data;
          authLogin(user);
          if (from && from !== '/' && from !== '/signin') {
            navigate(from, { replace: true });
          } else if (user.role === 'HOST' || user.role === 'ADMIN') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={SIDE_IMG} alt="StayEase" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, rgba(255,90,95,0.4), rgba(34,34,34,0.5))' }} />
        <div className="absolute inset-0 flex flex-col justify-between p-12 items-center text-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>S</span>
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>StayEase</span>
          </Link>
          <div>
            <h2 className="text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, fontStyle: 'italic' }}>
              Discover Extraordinary<br />Stays Worldwide
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)' }} className="text-base leading-relaxed mb-8">
              Unlock access to premium accommodations across the globe. Find your perfect escape today.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[{ num: '10K+', label: 'Listings' }, { num: '150+', label: 'Cities' }, { num: '4.9★', label: 'Rating' }].map((s, i) => (
                <div key={i} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                  <p className="text-white font-bold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.num}</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 text-[#717171] hover:text-[#222222] transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#FF5A5F] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-[#222222] font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>Stay<span style={{ color: '#FF5A5F' }}>Ease</span></span>
          </div>

          <h1 className="text-[#222222] mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 700 }}>Welcome Back</h1>
          <p className="text-[#717171] text-sm mb-8">Sign in to access your account and bookings.</p>

          <div className="grid grid-cols-2 gap-2 mb-8 p-1 rounded-xl" style={{ background: '#F7F7F7' }}>
            {(['guest', 'host'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="py-2.5 rounded-lg text-sm font-semibold capitalize transition-all"
                style={{
                  background: role === r ? '#FF5A5F' : 'transparent',
                  color: role === r ? 'white' : '#717171',
                }}
              >
                {r === 'guest' ? 'Guest' : 'Host'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm outline-none focus:border-[#FF5A5F] transition-colors placeholder:text-[#AAAAAA]"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#222222] text-sm font-semibold">Password</label>
                <a href="#" className="text-[#FF5A5F] text-xs font-medium hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm outline-none focus:border-[#FF5A5F] transition-colors placeholder:text-[#AAAAAA] pr-12"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171] hover:text-[#222222]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 accent-[#FF5A5F] rounded" />
              <label htmlFor="remember" className="text-[#717171] text-sm">Remember me for 30 days</label>
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#FF5A5F] hover:bg-[#E74C55] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing In…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#DDDDDD]" />
            <span className="text-[#717171] text-sm">or continue with</span>
            <div className="flex-1 h-px bg-[#DDDDDD]" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button className="flex items-center justify-center gap-2 border border-[#DDDDDD] rounded-xl py-3.5 hover:bg-[#F7F7F7] transition-colors text-sm text-[#222222] font-medium">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-[#DDDDDD] rounded-xl py-3.5 hover:bg-[#F7F7F7] transition-colors text-sm text-[#222222] font-medium">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <p className="text-center text-[#717171] text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#FF5A5F] font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
