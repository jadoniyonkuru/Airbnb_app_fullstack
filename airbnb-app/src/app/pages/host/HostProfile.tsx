import { useState, useRef } from 'react';
import { Camera, Eye, EyeOff, Save, Shield, Star, Home, Calendar, Bell, Globe, Lock } from 'lucide-react';

export function HostProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const checkStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    setPwStrength(s);
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const strengthColor = ['', '#ef4444', '#f97316', '#22c55e', '#16a34a'][pwStrength];

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: Globe },
    { id: 'password', label: 'Reset Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Profile Settings</h1>
        <p className="text-[#717171] text-sm">Manage your host profile and account preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4 mb-4">
            <div className="flex flex-col items-center text-center p-4">
              <div className="relative mb-3">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xl font-bold">SJ</div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#222222] rounded-full flex items-center justify-center border-2 border-white"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <p className="text-[#222222] font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Host Profile</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs text-[#717171]">Host</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 w-full">
                {[{ label: '6', sub: 'Listings' }, { label: '24', sub: 'Bookings' }, { label: '4.9', sub: 'Rating' }].map((s, i) => (
                  <div key={i} className="rounded-lg p-2 text-center" style={{ background: '#F7F7F7' }}>
                    <p className="text-[#222222] font-bold text-sm">{s.label}</p>
                    <p className="text-[#717171] text-xs">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-left transition-colors border-b border-[#EBEBEB] last:border-0"
                style={{
                  background: activeTab === tab.id ? '#FFF1F3' : 'transparent',
                  color: activeTab === tab.id ? '#FF385C' : '#484848',
                  borderLeft: activeTab === tab.id ? '3px solid #FF385C' : '3px solid transparent'
                }}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8">
              <h2 className="text-[#222222] font-semibold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Personal Information</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">First Name</label>
                    <input defaultValue="" placeholder="First Name" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Last Name</label>
                    <input defaultValue="" placeholder="Last Name" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#222222] text-sm font-semibold mb-2">Email Address</label>
                  <input type="email" defaultValue="" placeholder="Email address" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Phone Number</label>
                    <input type="tel" defaultValue="+1 234 567 8900" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Location</label>
                    <input defaultValue="Kigali, Rwanda" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#222222] text-sm font-semibold mb-2">Bio / About</label>
                  <textarea
                    defaultValue="Experienced host passionate about providing exceptional stays for guests. I love meeting people from around the world and sharing the beauty of Kigali!"
                    className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors resize-none h-28"
                  />
                </div>
                <div>
                  <label className="block text-[#222222] text-sm font-semibold mb-2">Languages Spoken</label>
                  <input defaultValue="English, French, Kinyarwanda" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all">
                    <Save className="w-4 h-4" />
                    {saved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                  <button className="px-7 py-3.5 rounded-xl font-semibold text-sm border border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8">
              <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #FFF1F3, #FFE4E8)' }}>
                <div className="w-12 h-12 bg-[#FF385C] rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[#222222] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Reset Password</p>
                  <p className="text-[#717171] text-xs">Keep your account secure with a strong password. Update it regularly.</p>
                </div>
              </div>

              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-[#222222] text-sm font-semibold mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="Enter your current password"
                      className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors pr-12 placeholder:text-[#AAAAAA]"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171]">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#FF385C] mt-1 cursor-pointer hover:underline">Forgot your password?</p>
                </div>

                <div className="border-t border-[#EBEBEB] pt-5">
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        placeholder="Create a strong new password"
                        onChange={e => checkStrength(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors pr-12 placeholder:text-[#AAAAAA]"
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171]">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {pwStrength > 0 && (
                      <div className="mt-2.5">
                        <div className="flex gap-1.5 mb-1.5">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{ background: i <= pwStrength ? strengthColor : '#EBEBEB' }} />
                          ))}
                        </div>
                        <p className="text-xs font-semibold" style={{ color: strengthColor }}>{strengthLabel} password</p>
                      </div>
                    )}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {['At least 8 characters', 'One uppercase letter', 'One number', 'One special character'].map((req, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-[#717171]">
                          <span style={{ color: pwStrength > i ? '#16a34a' : '#DDDDDD' }}>✓</span>
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat your new password"
                        className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors pr-12 placeholder:text-[#AAAAAA]"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171]">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all">
                    <Shield className="w-4 h-4" />
                    {saved ? '✓ Password Updated!' : 'Update Password'}
                  </button>
                </div>
              </div>

              {/* Security tips */}
              <div className="mt-8 p-5 rounded-2xl border border-[#EBEBEB]" style={{ background: '#F7F7F7' }}>
                <p className="text-[#222222] font-semibold text-sm mb-3">Security Tips</p>
                <ul className="space-y-2 text-xs text-[#717171]">
                  <li className="flex items-start gap-2"><span className="text-[#FF385C]">•</span> Use a unique password not used elsewhere</li>
                  <li className="flex items-start gap-2"><span className="text-[#FF385C]">•</span> Never share your password with guests or third parties</li>
                  <li className="flex items-start gap-2"><span className="text-[#FF385C]">•</span> Change your password every 3-6 months</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8">
              <h2 className="text-[#222222] font-semibold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Notification Preferences</h2>
              <div className="space-y-5">
                {[
                  { label: 'New booking requests', desc: 'Get notified when a guest requests to book your property', checked: true },
                  { label: 'Booking confirmations', desc: 'Receive alerts for confirmed and cancelled bookings', checked: true },
                  { label: 'Guest messages', desc: 'Notifications for new messages from guests', checked: true },
                  { label: 'New reviews', desc: 'Be notified when guests leave reviews on your listings', checked: true },
                  { label: 'Payout updates', desc: 'Alerts when payments are processed or sent to your account', checked: false },
                  { label: 'Platform updates', desc: 'News about StayEase features and host program changes', checked: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                    <div>
                      <p className="text-[#222222] font-semibold text-sm">{item.label}</p>
                      <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button className="relative w-11 h-6 rounded-full shrink-0 transition-colors" style={{ background: item.checked ? '#FF385C' : '#DDDDDD' }}>
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: item.checked ? '1.375rem' : '0.125rem' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
