import { useState, useEffect } from 'react';
import { Eye, EyeOff, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRegister } from '../../../features/auth/hooks';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { isDark } = useTheme();

  const [fullName,        setFullName]        = useState('');
  const [username,        setUsername]        = useState('');
  const [email,           setEmail]           = useState('');
  const [phone,           setPhone]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw,          setShowPw]          = useState(false);
  const [showCpw,         setShowCpw]         = useState(false);
  const [role,            setRole]            = useState<'guest' | 'host'>('guest');
  const [agreed,          setAgreed]          = useState(false);
  const [pwMismatch,      setPwMismatch]      = useState(false);
  const [mounted,         setMounted]         = useState(false);
  const [animating,       setAnimating]       = useState(false);

  const registerMutation = useRegister();

  useEffect(() => {
    let exitTimer: ReturnType<typeof setTimeout>;
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
      document.body.style.overflow = 'hidden';
    } else if (mounted) {
      setAnimating(false);
      exitTimer = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = '';
    }
    return () => {
      clearTimeout(exitTimer);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setAnimating(false);
    setTimeout(onClose, 300);
  };

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
      {
        name: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        phone,
        password,
        role: role.toUpperCase() as 'GUEST' | 'HOST',
      },
      {
        onSuccess: (res) => {
          const { user, token } = res;
          authLogin(user, token);
          handleClose();
          if (user.role === 'HOST' || user.role === 'ADMIN') {
            navigate('/dashboard');
          }
        },
      }
    );
  };

  const inputClass = (extra = '') =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors placeholder:text-[#AAAAAA] ${
      isDark
        ? 'bg-[#2C2C2E] border-[#3A3A3C] text-white focus:border-[#FF5A5F]'
        : 'bg-white border-[#DDDDDD] text-[#222222] focus:border-[#FF5A5F]'
    } ${extra}`;

  const labelClass = `block text-sm font-semibold mb-1.5 ${isDark ? 'text-white/80' : 'text-[#222222]'}`;

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        backdropFilter: animating ? 'blur(4px)' : 'blur(0px)',
        background: animating ? 'rgba(0,0,0,0.60)' : 'rgba(0,0,0,0)',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-[#1C1C1E]' : 'bg-white'}`}
        style={{
          transform: animating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(16px)',
          opacity: animating ? 1 : 0,
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isDark ? 'text-white/60 hover:bg-white/10' : 'text-[#717171] hover:bg-[#F7F7F7]'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto max-h-[92vh] p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-[#FF5A5F] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>S</span>
            </div>
            <span
              className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#222222]'}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Stay<span style={{ color: '#FF5A5F' }}>Ease</span>
            </span>
          </div>

          <h1
            className={`mb-1 ${isDark ? 'text-white' : 'text-[#222222]'}`}
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.5rem', fontWeight: 700 }}
          >
            Create Account
          </h1>
          <p className={`text-sm mb-5 ${isDark ? 'text-white/60' : 'text-[#717171]'}`}>
            Join StayEase and start your travel journey today.
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { value: 'guest', title: "I'm a Guest",  desc: 'Looking for unique stays' },
              { value: 'host',  title: "I'm a Host",   desc: 'Want to earn from my property' },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value as 'guest' | 'host')}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all"
                style={{
                  borderColor: role === r.value ? '#FF5A5F' : isDark ? '#3A3A3C' : '#DDDDDD',
                  background:  role === r.value
                    ? isDark ? 'rgba(255,90,95,0.15)' : '#FFF1F3'
                    : isDark ? '#2C2C2E' : 'white',
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: role === r.value ? '#FF5A5F' : isDark ? 'rgba(255,255,255,0.8)' : '#222222' }}
                >
                  {r.title}
                </span>
                <span className="text-xs text-center" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#717171' }}>
                  {r.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Kevin Malone"
                  className={inputClass()}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe123"
                  className={inputClass()}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={inputClass()}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07859346666"
                  className={inputClass()}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className={inputClass('pr-12')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                    isDark ? 'text-white/50 hover:text-white' : 'text-[#717171] hover:text-[#222222]'
                  }`}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1.5 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full transition-colors duration-300"
                        style={{ background: i <= strength ? strengthColor : isDark ? '#3A3A3C' : '#EBEBEB' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strengthColor }}>{strengthLabel} password</p>
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showCpw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPwMismatch(false); }}
                  placeholder="Repeat your password"
                  className={inputClass(`pr-12 ${pwMismatch ? '!border-red-400 focus:!border-red-400' : ''}`)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCpw(!showCpw)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                    isDark ? 'text-white/50 hover:text-white' : 'text-[#717171] hover:text-[#222222]'
                  }`}
                >
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
              <input
                id="modal-agree"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#FF5A5F]"
                required
              />
              <label htmlFor="modal-agree" className={`text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-[#717171]'}`}>
                I agree to StayEase's{' '}
                <a href="#" className="text-[#FF5A5F] font-medium hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#FF5A5F] font-medium hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-[#FF5A5F] hover:bg-[#E74C55] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {registerMutation.isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating Account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className={`flex-1 h-px ${isDark ? 'bg-[#3A3A3C]' : 'bg-[#DDDDDD]'}`} />
            <span className={`text-sm ${isDark ? 'text-white/40' : 'text-[#717171]'}`}>or</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-[#3A3A3C]' : 'bg-[#DDDDDD]'}`} />
          </div>

          {/* Social buttons */}
          <div className="flex justify-center mb-5">
            <button
              type="button"
              className={`flex items-center justify-center gap-2 border rounded-xl py-3 px-8 transition-colors text-sm font-medium ${
                isDark
                  ? 'border-[#3A3A3C] text-white/80 hover:bg-white/5'
                  : 'border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7]'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>

          {/* Sign in link */}
          <p className={`text-center text-sm ${isDark ? 'text-white/50' : 'text-[#717171]'}`}>
            Already have an account?{' '}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={() => { handleClose(); setTimeout(() => onSwitchToLogin(), 250); }}
                className="text-[#FF5A5F] font-semibold hover:underline"
              >
                Sign in
              </button>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}
