import { useState, useRef } from 'react';
import { Camera, Eye, EyeOff, Save, Shield, Bell, Lock, Globe, Key, AlertTriangle } from 'lucide-react';

export function AdminProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'security' | 'notifications'>('profile');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);
  const [twoFA, setTwoFA] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const checkStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    setPwStrength(s);
  };

  const strengthColors = ['', '#ef4444', '#f97316', '#22c55e', '#16a34a'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const tabs = [
    { id: 'profile', label: 'Admin Profile', icon: Globe },
    { id: 'password', label: 'Reset Password', icon: Lock },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Admin Profile</h1>
        <p className="text-[#717171] text-sm">Manage your administrator account and security settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          {/* Admin Card */}
          <div className="rounded-2xl border border-[#EBEBEB] overflow-hidden mb-4" style={{ background: '#0F1117' }}>
            <div className="p-6 text-center">
              <div className="relative inline-block mb-3">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover mx-auto" />
                ) : (
                  <div className="w-20 h-20 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto">JP</div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2" style={{ borderColor: '#0F1117' }} />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mb-3 flex items-center gap-1.5 mx-auto text-xs px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.1)' }}
              >
                <Camera className="w-3 h-3" />
                Change photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Hitayezu Jean Pierre</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Super Administrator</p>
              <div className="mt-4 flex items-center justify-center gap-2 p-2 rounded-xl" style={{ background: 'rgba(255,56,92,0.15)', border: '1px solid rgba(255,56,92,0.3)' }}>
                <Shield className="w-4 h-4 text-[#FF385C]" />
                <span style={{ color: '#FF385C', fontSize: '0.75rem', fontWeight: 600 }}>Full Access</span>
              </div>
            </div>
            <div className="px-4 pb-4 grid grid-cols-3 gap-2">
              {[{ v: '5', l: 'Years' }, { v: '1.2k', l: 'Users' }, { v: '524', l: 'Listings' }].map((s, i) => (
                <div key={i} className="text-center rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <p className="text-white font-bold text-sm">{s.v}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-3 w-full px-4 py-4 text-left transition-all border-b border-[#EBEBEB] last:border-0"
                style={{
                  background: activeTab === tab.id ? '#0F1117' : 'transparent',
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
              <h2 className="text-[#222222] font-semibold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Administrator Information</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">First Name</label>
                    <input defaultValue="Daniel" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Last Name</label>
                    <input defaultValue="Nkurunziza" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#222222] text-sm font-semibold mb-2">Admin Email</label>
                  <input type="email" defaultValue="admin@stayease.com" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Phone</label>
                    <input type="tel" defaultValue="+250 788 456 789" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Admin Role</label>
                    <select className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors">
                      <option>Super Administrator</option>
                      <option>Moderator</option>
                      <option>Support Staff</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[#222222] text-sm font-semibold mb-2">Bio / Notes</label>
                  <textarea defaultValue="Platform administrator overseeing host onboarding, guest experience, listing quality, and day-to-day operations at StayEase." className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors resize-none h-24" />
                </div>
                <div className="flex gap-3">
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
              {/* Header Banner */}
              <div className="flex items-center gap-4 p-5 rounded-2xl mb-8" style={{ background: '#0F1117' }}>
                <div className="w-12 h-12 bg-[#FF385C] rounded-xl flex items-center justify-center shrink-0">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Reset Administrator Password</p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                    Admin accounts require stronger passwords. Use at least 10 characters with mixed case, numbers and symbols.
                  </p>
                </div>
              </div>

              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-[#222222] text-sm font-semibold mb-2">Current Password</label>
                  <div className="relative">
                    <input type={showCurrent ? 'text' : 'password'} placeholder="Enter current admin password" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors pr-12 placeholder:text-[#AAAAAA]" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171]">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#EBEBEB] pt-5">
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        placeholder="Create a strong admin password (min 10 chars)"
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
                            <div key={i} className="flex-1 h-2 rounded-full transition-all" style={{ background: i <= pwStrength ? strengthColors[pwStrength] : '#EBEBEB' }} />
                          ))}
                        </div>
                        <p className="text-xs font-bold" style={{ color: strengthColors[pwStrength] }}>{strengthLabels[pwStrength]} password</p>
                      </div>
                    )}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {['At least 10 characters', 'Uppercase letter', 'Number (0-9)', 'Special character'].map((req, i) => (
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
                      <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat your new admin password" className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors pr-12 placeholder:text-[#AAAAAA]" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171]">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="flex items-center gap-2 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all" style={{ background: '#0F1117' }}>
                    <Shield className="w-4 h-4" />
                    {saved ? '✓ Password Updated!' : 'Update Admin Password'}
                  </button>
                </div>
              </div>

              {/* Admin Security Warning */}
              <div className="mt-8 p-5 rounded-2xl border border-yellow-200" style={{ background: '#FFFBEB' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#222222] font-semibold text-sm">Admin Account Security</p>
                    <p className="text-[#717171] text-xs mt-1 leading-relaxed">
                      Admin accounts have full platform access. Never share your credentials. All admin actions are logged and audited. If you suspect unauthorized access, contact your security team immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8">
              <h2 className="text-[#222222] font-semibold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Security Settings</h2>
              <div className="space-y-6">
                {/* 2FA */}
                <div className="flex items-start justify-between gap-4 p-5 rounded-2xl border border-[#EBEBEB]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[#222222] font-semibold text-sm">Two-Factor Authentication</p>
                      <p className="text-[#717171] text-xs mt-0.5">Require 2FA for all admin logins. Highly recommended.</p>
                      {twoFA && <p className="text-green-600 text-xs font-semibold mt-1">✓ Enabled — Your account is protected</p>}
                    </div>
                  </div>
                  <button onClick={() => setTwoFA(!twoFA)} className="relative w-11 h-6 rounded-full shrink-0 transition-colors" style={{ background: twoFA ? '#16a34a' : '#DDDDDD' }}>
                    <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: twoFA ? '1.375rem' : '0.125rem' }} />
                  </button>
                </div>

                {/* Login History */}
                <div>
                  <h3 className="text-[#222222] font-semibold text-sm mb-3">Recent Login Activity</h3>
                  <div className="rounded-xl border border-[#EBEBEB] overflow-hidden">
                    {[
                      { device: 'Chrome on Windows', ip: '197.149.xx.xx', time: 'Today, 09:42 AM', status: 'current' },
                      { device: 'Safari on macOS', ip: '197.149.xx.xx', time: 'Yesterday, 3:15 PM', status: 'ok' },
                      { device: 'Firefox on Linux', ip: '91.108.xx.xx', time: 'May 4, 2026', status: 'suspicious' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border-b border-[#EBEBEB] last:border-0">
                        <div>
                          <p className="text-[#222222] font-semibold text-sm">{log.device}</p>
                          <p className="text-[#717171] text-xs">{log.ip} · {log.time}</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                          background: log.status === 'current' ? '#dbeafe' : log.status === 'suspicious' ? '#fee2e2' : '#dcfce7',
                          color: log.status === 'current' ? '#2563eb' : log.status === 'suspicious' ? '#dc2626' : '#16a34a'
                        }}>
                          {log.status === 'current' ? 'Current' : log.status === 'suspicious' ? '⚠️ Review' : '✓ Normal'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3 rounded-xl font-semibold text-sm transition-colors">
                    Terminate All Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8">
              <h2 className="text-[#222222] font-semibold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Admin Notifications</h2>
              <div className="space-y-5">
                {[
                  { label: 'New user registrations', desc: 'Alert when new users join the platform', checked: true },
                  { label: 'Suspicious activity', desc: 'Security alerts for unusual platform behavior', checked: true },
                  { label: 'New listing submissions', desc: 'When hosts submit new properties for review', checked: true },
                  { label: 'Dispute reports', desc: 'Notifications for booking disputes requiring admin attention', checked: true },
                  { label: 'Payment failures', desc: 'Alerts for failed transactions or payment issues', checked: true },
                  { label: 'System updates', desc: 'Platform maintenance and update notifications', checked: false },
                  { label: 'Weekly analytics report', desc: 'Automated weekly summary of platform performance', checked: true },
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
              <button onClick={handleSave} className="mt-5 flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all">
                <Save className="w-4 h-4" />
                {saved ? '✓ Saved!' : 'Save Preferences'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}