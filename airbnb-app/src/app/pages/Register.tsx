import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { useRegister } from '../../features/auth/hooks';
import { useAuth } from '../context/AuthContext';

const SIDE_IMG = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1080&q=80";

export function Register() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [searchParams] = useSearchParams();

  const [fullName,         setFullName]         = useState('');
  const [username,         setUsername]         = useState('');
  const [email,            setEmail]            = useState('');
  const [phone,            setPhone]            = useState('');
  const [password,         setPassword]         = useState('');
  const [confirmPassword,  setConfirmPassword]  = useState('');
  const [showPw,           setShowPw]           = useState(false);
  const [showCpw,          setShowCpw]          = useState(false);
  const [role,             setRole]             = useState<'guest' | 'host'>('guest');
  const [agreed,           setAgreed]           = useState(false);
  const [pwMismatch,       setPwMismatch]       = useState(false);

  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'host') setRole('host');
    else setRole('guest');
  }, [searchParams]);

  const registerMutation = useRegister();

  const passwordStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strength = passwordStrength();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f97316', '#22c55e', '#16a34a'][strength];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { 
      setPwMismatch(true); 
      toast.error('Passwords do not match');
      return; 
    }
    if (!fullName.trim() || !email.trim() || !username.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setPwMismatch(false);
    registerMutation.mutate(
      { name: fullName.trim(), username: username.trim(), email: email.trim(), phone, password, role: role.toUpperCase() as 'GUEST' | 'HOST' },
      {
        onSuccess: (res) => {
            const { user, token } = res;
            authLogin(user, token);
            navigate('/');
          },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden order-last">
        <img src={SIDE_IMG} alt="StayEase" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top left, rgba(0,166,153,0.4), rgba(34,34,34,0.5))' }} />
        <div className="absolute inset-0 flex flex-col justify-between p-12 items-center text-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>S</span>
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>StayEase</span>
          </Link>
          <div>
            <h2 className="text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, fontStyle: 'italic' }}>
              Begin Your Journey<br />With Us Today
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)' }} className="text-base leading-relaxed mb-8">
              Join thousands of travelers discovering unforgettable experiences. Your adventure awaits.
            </p>
            <div className="space-y-4">
              {['Free to sign up — no hidden fees', 'Instant booking confirmation', 'Secure payments & full refund policy', '24/7 guest support'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 justify-center">
                  <div className="w-6 h-6 bg-[#FF5A5F] rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }} className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

          <h1 className="text-[#222222] mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 700 }}>Create Account</h1>
          <p className="text-[#717171] text-sm mb-8">Join StayEase and start your travel journey today.</p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { value: 'guest', title: "I'm a Guest", desc: 'Looking for unique stays' },
              { value: 'host',  title: "I'm a Host",  desc: 'Want to earn from my property' },
            ].map(r => (
              <button
                key={r.value}
                onClick={() => setRole(r.value as 'guest' | 'host')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
                style={{
                  borderColor: role === r.value ? '#FF5A5F' : '#DDDDDD',
                  background:  role === r.value ? '#FFF1F3' : 'white',
                }}
              >
                <span className="text-sm font-semibold" style={{ color: role === r.value ? '#FF5A5F' : '#222222' }}>{r.title}</span>
                <span className="text-xs text-center" style={{ color: '#717171' }}>{r.desc}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Kevin Malone"
                className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm outline-none focus:border-[#FF5A5F] transition-colors placeholder:text-[#AAAAAA]" required />
            </div>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="johndoe123"
                className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm outline-none focus:border-[#FF5A5F] transition-colors placeholder:text-[#AAAAAA]" required />
            </div>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07859346666"
                className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm outline-none focus:border-[#FF5A5F] transition-colors placeholder:text-[#AAAAAA]" required />
            </div>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm outline-none focus:border-[#FF5A5F] transition-colors placeholder:text-[#AAAAAA]" required />
            </div>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a strong password"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm outline-none focus:border-[#FF5A5F] transition-colors placeholder:text-[#AAAAAA] pr-12" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171] hover:text-[#222222]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= strength ? strengthColor : '#EBEBEB' }} />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strengthColor }}>{strengthLabel} password</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Confirm Password</label>
              <div className="relative">
                <input type={showCpw ? 'text' : 'password'} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setPwMismatch(false); }} placeholder="Repeat your password"
                  className={`w-full px-4 py-3.5 rounded-xl border bg-white text-[#222222] text-sm outline-none transition-colors placeholder:text-[#AAAAAA] pr-12 ${pwMismatch ? 'border-red-400 focus:border-red-400' : 'border-[#DDDDDD] focus:border-[#FF5A5F]'}`} required />
                <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171] hover:text-[#222222]">
                  {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {confirmPassword && password === confirmPassword && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
              {pwMismatch && <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>}
            </div>

            <div className="flex items-start gap-2">
              <input id="agree" type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#FF5A5F]" required />
              <label htmlFor="agree" className="text-[#717171] text-sm leading-relaxed">
                I agree to StayEase's{' '}
                <a href="#" className="text-[#FF5A5F] font-medium hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#FF5A5F] font-medium hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-[#FF5A5F] hover:bg-[#E74C55] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {registerMutation.isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating Account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#DDDDDD]" />
            <span className="text-[#717171] text-sm">or</span>
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
            Already have an account?{' '}
            <Link to="/signin" className="text-[#FF5A5F] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
