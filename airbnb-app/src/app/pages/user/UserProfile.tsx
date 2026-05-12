import { useState, useRef } from 'react';
import { Camera, Eye, EyeOff, Save, Shield } from 'lucide-react';
import { UserPageLayout } from '../../components/layout/UserPageLayout';

export function UserProfile() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile');
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <UserPageLayout title="Profile Settings" breadcrumb="Profile">
      <p className="text-[#717171] text-sm -mt-4 mb-8">Manage your personal information and account preferences.</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-[#F7F7F7] p-1 rounded-xl w-fit">
        {(['profile', 'password', 'notifications'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all"
            style={{ background: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? '#222222' : '#717171', boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}
          >
            {tab === 'password' ? 'Reset Password' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 max-w-2xl">
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xl font-bold">JP</div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#222222] rounded-full flex items-center justify-center border-2 border-white"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <div>
              <h3 className="text-[#222222] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Hitayezu Jean Pierre</h3>
              <p className="text-[#717171] text-sm">Guest • Member since April 2026</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-[#FF385C] text-sm font-medium hover:underline"
              >
                Change photo
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#222222] text-sm font-semibold mb-2">First Name</label>
                <input defaultValue="Jean Pierre" className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
              </div>
              <div>
                <label className="block text-[#222222] text-sm font-semibold mb-2">Last Name</label>
                <input defaultValue="Hitayezu" className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Email Address</label>
              <input type="email" defaultValue="jeanpierre.h@email.com" className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
            </div>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Phone Number</label>
              <input type="tel" defaultValue="+1 234 567 8900" className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
            </div>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Bio</label>
              <textarea defaultValue="Travel enthusiast exploring the world one stay at a time." className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors resize-none h-24" />
            </div>
            <button onClick={handleSave} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all">
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl" style={{ background: '#FFF1F3' }}>
            <Shield className="w-5 h-5 text-[#FF385C]" />
            <div>
              <p className="text-[#222222] font-semibold text-sm">Password Security</p>
              <p className="text-[#717171] text-xs">Choose a strong password and don't reuse it for other accounts.</p>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Current Password</label>
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'} placeholder="Enter current password" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] pr-12 transition-colors placeholder:text-[#AAAAAA]" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171]">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} placeholder="Enter new password" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] pr-12 transition-colors placeholder:text-[#AAAAAA]" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171]">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[#717171] text-xs mt-1.5">Minimum 8 characters with uppercase, number, and symbol.</p>
            </div>
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Confirm New Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat new password" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] pr-12 transition-colors placeholder:text-[#AAAAAA]" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171]">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all">
                <Shield className="w-4 h-4" />
                {saved ? 'Password Updated!' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 max-w-2xl">
          <h3 className="text-[#222222] font-semibold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Notification Preferences</h3>
          <div className="space-y-5">
            {[
              { label: 'Booking confirmations', desc: 'Get notified when a booking is confirmed or cancelled', checked: true },
              { label: 'New messages', desc: 'Receive alerts when hosts send you messages', checked: true },
              { label: 'Special offers', desc: 'Promotions and discount alerts for saved properties', checked: false },
              { label: 'Platform updates', desc: 'New features and product announcements', checked: false },
              { label: 'Review reminders', desc: 'Remind me to leave a review after checkout', checked: true },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                <div>
                  <p className="text-[#222222] text-sm font-semibold">{item.label}</p>
                  <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                </div>
                <button
                  className="relative w-11 h-6 rounded-full transition-colors shrink-0"
                  style={{ background: item.checked ? '#FF385C' : '#DDDDDD' }}
                >
                  <span className="absolute top-0.5 transition-all w-5 h-5 bg-white rounded-full shadow-sm" style={{ left: item.checked ? '1.375rem' : '0.125rem' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </UserPageLayout>
  );
}