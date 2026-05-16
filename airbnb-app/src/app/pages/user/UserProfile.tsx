import { useState, useRef } from 'react';
import {
  Camera, MapPin, Building2, CalendarDays, BadgeCheck,
  Eye, EyeOff, ImageIcon, Pencil, Settings, LogOut, ArrowUp
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../../api/client';
import { useTheme } from '../../context/ThemeContext';
import { Navbar } from '../../components/layout/Navbar';

export function UserProfile() {
  const { user, logout, updateUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email ?? '');
  const [description, setDescription] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const initials = user?.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  const inputClass = `w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-colors ${
    isDark
      ? 'bg-[#3A3A3C] border-[#48484A] text-white placeholder:text-[#6C6C70] focus:border-[#FF5A5F]'
      : 'bg-[#F7F7F7] border-[#F0F0F0] text-[#1C1C1E] placeholder:text-[#8E8E93] focus:border-[#FF5A5F] focus:bg-white'
  }`;

  const handleSaveDetails = () => {
    toast.success('Profile updated successfully!');
    const redirect = location?.state?.from;
    if (redirect) {
      navigate(redirect);
    } else {
      navigate('/user/dashboard');
    }
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1C1C1E]' : 'bg-[#F5F5F5]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden md:flex flex-col gap-0.5">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 px-3 ${isDark ? 'text-[#6C6C70]' : 'text-[#8E8E93]'}`}>
            Account
          </p>
          <Link
            to="/user/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: '#FF5A5F18', color: '#FF5A5F' }}
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </Link>
          <Link
            to="/user/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isDark ? 'text-white/70 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            Setting
          </Link>
          <button
            onClick={() => { logout(); navigate('/'); toast.success('Logged out successfully'); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left ${
              isDark ? 'text-white/70 hover:bg-white/10' : 'text-[#1C1C1E] hover:bg-white'
            }`}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </aside>

        {/* Main content */}
        <div className="flex-1 space-y-5 min-w-0">

          {/* Profile header card */}
          <div className={`rounded-2xl overflow-hidden shadow-sm ${isDark ? 'bg-[#2C2C2E]' : 'bg-white'}`}>
            {/* Banner */}
            <div
              className="relative h-44"
              style={{
                background: bannerUrl
                  ? `url(${bannerUrl}) center/cover no-repeat`
                  : 'linear-gradient(135deg, #FF8C42 0%, #FF5A5F 45%, #C44B4B 100%)',
              }}
            >
              <button
                onClick={() => bannerInputRef.current?.click()}
                className="absolute top-3 right-3 flex items-center gap-2 bg-white/90 hover:bg-white text-[#1C1C1E] text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Upload header
              </button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setBannerUrl(URL.createObjectURL(f)); }}
              />
            </div>

            {/* Avatar + info */}
            <div className="flex flex-col items-center -mt-12 pb-7 px-6">
                <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[#3C3C3E] flex items-center justify-center">
                  {avatarUrl
                    ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    : (user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-2xl">{initials}</span>)
                  }
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-[#FF5A5F] rounded-full flex items-center justify-center border-2 border-white shadow"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async e => {
                    const f = e.target.files?.[0];
                    if (!f || !user) return;
                    // show preview immediately
                    setAvatarUrl(URL.createObjectURL(f));
                    try {
                      const fd = new FormData();
                      fd.append('image', f);
                      const { data } = await apiClient.post(`/users/${user.id}/avatar`, fd);
                      // update global user so navbar and other places update
                      try { updateUser({ avatar: data.avatar }); } catch (err) { /* ignore */ }
                      setAvatarUrl(data.avatar || null);
                      toast.success('Avatar updated.');
                    } catch (err) {
                      toast.error('Failed to upload avatar.');
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mt-3">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>{user?.name}</h2>
                <BadgeCheck className="w-6 h-6 text-green-500" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5 mt-2 text-sm text-[#8E8E93]">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  StayEase Member
                </span>
                <span className="flex items-center gap-1.5 text-[#FF5A5F]">
                  <MapPin className="w-3.5 h-3.5" />
                  Kigali, RW
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Joined May 2025
                </span>
              </div>
            </div>
          </div>

          {/* Details form */}
          <div className={`rounded-2xl shadow-sm p-6 ${isDark ? 'bg-[#2C2C2E]' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-[#FF5A5F]" />
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>Details</h3>
            </div>

            <div className="space-y-5">
              {/* Name / Phone / Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                    Name <span className="text-[#FF5A5F]">*</span>
                  </label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className={inputClass} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                    Phone <span className="text-[#FF5A5F]">*</span>
                  </label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(123) 456 - 789" className={inputClass} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                    Email Address <span className="text-[#FF5A5F]">*</span>
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" className={inputClass} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                  Description <span className="text-[#FF5A5F]">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 4000))}
                  placeholder="Please enter up to 4000 characters."
                  rows={6}
                  className={`${inputClass} resize-y`}
                />
                <p className="text-xs text-[#8E8E93] mt-1 text-right">{description.length}/4000</p>
              </div>

              <hr className={isDark ? 'border-[#3A3A3C]' : 'border-[#F0F0F0]'} />

              {/* Facebook / Twitter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                    Facebook Page <span className="font-normal text-[#8E8E93]">(optional)</span>
                  </label>
                  <input value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://facebook.com" className={inputClass} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                    Twitter profile <span className="font-normal text-[#8E8E93]">(optional)</span>
                  </label>
                  <input value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="https://twitter.com" className={inputClass} />
                </div>
              </div>

              {/* Instagram / LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                    Instagram profile <span className="font-normal text-[#8E8E93]">(optional)</span>
                  </label>
                  <input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com" className={inputClass} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                    Linkedin page <span className="font-normal text-[#8E8E93]">(optional)</span>
                  </label>
                  <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com" className={inputClass} />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveDetails}
                  className="bg-[#FF5A5F] hover:bg-[#E3192D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className={`rounded-2xl shadow-sm p-6 ${isDark ? 'bg-[#2C2C2E]' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-[#FF5A5F]" />
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#1C1C1E]'}`}>Change Password</h3>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                    Current Password <span className="text-[#FF5A5F]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className={`${inputClass} pr-11`}
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                    New Password <span className="text-[#FF5A5F]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className={`${inputClass} pr-11`}
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-w-sm">
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-white/80' : 'text-[#1C1C1E]'}`}>
                  Confirm Password <span className="text-[#FF5A5F]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleChangePassword}
                  className="bg-[#FF5A5F] hover:bg-[#E3192D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-10 h-10 bg-[#FF5A5F] hover:bg-[#E3192D] text-white rounded-xl flex items-center justify-center shadow-lg transition-colors"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
}
