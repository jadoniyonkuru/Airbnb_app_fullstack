import { useState } from 'react';
import {
  Shield, Bell, CreditCard, Globe, Trash2, Download,
  ChevronRight, Eye, EyeOff, AlertTriangle, Save, Lock, Smartphone
} from 'lucide-react';

const sections = [
  { id: 'account', label: 'Account & Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  { id: 'privacy', label: 'Privacy', icon: Globe },
];

export function UserSettings() {
  const [activeSection, setActiveSection] = useState('account');
  const [saved, setSaved] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');

  const checkStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    setPwStrength(s);
  };

  const strengthColor = ['', '#ef4444', '#f97316', '#22c55e', '#16a34a'][pwStrength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const [notifs, setNotifs] = useState({
    bookingConfirmed: true,
    checkInReminder: true,
    checkOutReminder: true,
    hostMessages: true,
    specialOffers: false,
    tripSuggestions: true,
    reviewRequests: true,
    accountAlerts: true,
  });

  const [privacySettings] = useState({
    showReviews: true,
    showTripHistory: false,
    allowMarketing: false,
    shareData: true,
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Settings</h1>
        <p className="text-[#717171] text-sm">Manage your account, security, and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-left transition-colors border-b border-[#EBEBEB] last:border-0"
                style={{
                  background: activeSection === s.id ? '#FFF1F3' : 'transparent',
                  color: activeSection === s.id ? '#FF385C' : '#484848',
                  borderLeft: activeSection === s.id ? '3px solid #FF385C' : '3px solid transparent'
                }}
              >
                <s.icon className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">{s.label}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">

          {/* Account & Security */}
          {activeSection === 'account' && (
            <>
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Preferences</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#222222] text-sm font-semibold mb-2">Language</label>
                      <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] bg-white">
                        <option>English</option>
                        <option>French</option>
                        <option>Spanish</option>
                        <option>Arabic</option>
                        <option>Swahili</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#222222] text-sm font-semibold mb-2">Currency</label>
                      <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] bg-white">
                        <option value="USD">USD – US Dollar</option>
                        <option value="EUR">EUR – Euro</option>
                        <option value="GBP">GBP – British Pound</option>
                        <option value="RWF">RWF – Rwandan Franc</option>
                        <option value="KES">KES – Kenyan Shilling</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleSave} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                    <Save className="w-4 h-4" />
                    {saved ? '✓ Saved!' : 'Save Preferences'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-5 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <Lock className="w-4 h-4 text-[#FF385C]" /> Change Password
                </h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showOldPw ? 'text' : 'password'}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] pr-12 placeholder:text-[#AAAAAA]"
                      />
                      <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171]">
                        {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        placeholder="Create new password"
                        onChange={e => checkStrength(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] pr-12 placeholder:text-[#AAAAAA]"
                      />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171]">
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {pwStrength > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= pwStrength ? strengthColor : '#EBEBEB' }} />
                          ))}
                        </div>
                        <p className="text-xs font-semibold" style={{ color: strengthColor }}>{strengthLabel} password</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] placeholder:text-[#AAAAAA]"
                    />
                  </div>
                  <button onClick={handleSave} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                    <Shield className="w-4 h-4" />
                    {saved ? '✓ Password Updated!' : 'Update Password'}
                  </button>
                </div>
              </div>

              {/* 2FA */}
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: twoFactor ? '#E6F7F6' : '#F7F7F7' }}>
                      <Smartphone className="w-5 h-5" style={{ color: twoFactor ? '#00A699' : '#717171' }} />
                    </div>
                    <div>
                      <p className="text-[#222222] font-semibold text-sm">Two-Factor Authentication</p>
                      <p className="text-[#717171] text-xs mt-0.5 max-w-xs">Get an SMS code each time you log in for extra security.</p>
                      <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${twoFactor ? 'bg-green-50 text-green-700' : 'bg-[#F7F7F7] text-[#717171]'}`}>
                        {twoFactor ? '✓ Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setTwoFactor(!twoFactor)}
                    className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                    style={{ background: twoFactor ? '#FF385C' : '#DDDDDD' }}
                  >
                    <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: twoFactor ? '1.375rem' : '0.125rem' }} />
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl border border-red-100 p-6">
                <h2 className="text-red-600 font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <AlertTriangle className="w-4 h-4" /> Danger Zone
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50">
                    <div>
                      <p className="text-[#222222] text-sm font-semibold">Download My Data</p>
                      <p className="text-[#717171] text-xs mt-0.5">Export all bookings, reviews, and account data.</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-semibold bg-white border border-[#DDDDDD] text-[#484848] px-4 py-2 rounded-xl hover:bg-[#F7F7F7] transition-colors">
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50">
                    <div>
                      <p className="text-red-600 text-sm font-semibold">Delete Account</p>
                      <p className="text-[#717171] text-xs mt-0.5">Permanently delete your account. This cannot be undone.</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <h2 className="text-[#222222] font-semibold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Notification Settings</h2>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#AAAAAA] mb-3">Booking & Trips</p>
              <div className="space-y-3 mb-6">
                {[
                  { key: 'bookingConfirmed', label: 'Booking confirmed', desc: 'When your booking is confirmed by the host' },
                  { key: 'checkInReminder', label: 'Check-in reminder', desc: '24 hours before your scheduled check-in' },
                  { key: 'checkOutReminder', label: 'Check-out reminder', desc: 'Morning of your checkout day' },
                  { key: 'hostMessages', label: 'Host messages', desc: 'New messages from your hosts' },
                  { key: 'reviewRequests', label: 'Review requests', desc: 'Remind you to leave a review after checkout' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                    <div>
                      <p className="text-[#222222] text-sm font-semibold">{item.label}</p>
                      <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                      style={{ background: notifs[item.key as keyof typeof notifs] ? '#FF385C' : '#DDDDDD' }}
                    >
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                        style={{ left: notifs[item.key as keyof typeof notifs] ? '1.375rem' : '0.125rem' }} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#AAAAAA] mb-3">Promotions & Updates</p>
              <div className="space-y-3">
                {[
                  { key: 'specialOffers', label: 'Special offers & deals', desc: 'Exclusive discounts and limited-time offers' },
                  { key: 'tripSuggestions', label: 'Trip suggestions', desc: 'Personalized destination and property recommendations' },
                  { key: 'accountAlerts', label: 'Account alerts', desc: 'Security notifications and account updates' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                    <div>
                      <p className="text-[#222222] text-sm font-semibold">{item.label}</p>
                      <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                      style={{ background: notifs[item.key as keyof typeof notifs] ? '#FF385C' : '#DDDDDD' }}
                    >
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                        style={{ left: notifs[item.key as keyof typeof notifs] ? '1.375rem' : '0.125rem' }} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="mt-6 flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                <Save className="w-4 h-4" />
                {saved ? '✓ Saved!' : 'Save Settings'}
              </button>
            </div>
          )}

          {/* Payments */}
          {activeSection === 'payments' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Saved Payment Methods</h2>
                <div className="space-y-3 mb-4">
                  {[
                    { type: 'Visa', detail: '•••• •••• •••• 4242', expires: 'Expires 08/28', icon: '💳', primary: true },
                    { type: 'Mastercard', detail: '•••• •••• •••• 8891', expires: 'Expires 02/27', icon: '💳', primary: false },
                    { type: 'PayPal', detail: 'jeanpierre.h@email.com', expires: '', icon: '📧', primary: false },
                  ].map((card, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-[#EBEBEB]">
                      <span className="text-2xl">{card.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[#222222] text-sm font-semibold">{card.type} {card.detail}</p>
                          {card.primary && <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        {card.expires && <p className="text-[#717171] text-xs mt-0.5">{card.expires}</p>}
                      </div>
                      <button className="text-xs text-[#AAAAAA] hover:text-red-500 transition-colors">Remove</button>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold text-[#FF385C] border border-[#FF385C] px-4 py-2.5 rounded-xl hover:bg-[#FFF1F3] transition-colors">
                  + Add Payment Method
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Billing Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input defaultValue="Jean Pierre" placeholder="First Name" className="px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C]" />
                  <input defaultValue="Hitayezu" placeholder="Last Name" className="px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C]" />
                  <input defaultValue="123 Main Street" placeholder="Address" className="sm:col-span-2 px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C]" />
                  <input defaultValue="Kigali" placeholder="City" className="px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C]" />
                  <input defaultValue="Rwanda" placeholder="Country" className="px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C]" />
                </div>
                <button onClick={handleSave} className="mt-4 flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                  <Save className="w-4 h-4" />
                  {saved ? '✓ Saved!' : 'Save Billing Info'}
                </button>
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeSection === 'privacy' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Privacy Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'Show my reviews publicly', desc: 'Other users can see reviews you have left', checked: privacySettings.showReviews },
                  { label: 'Share trip history with hosts', desc: 'Hosts can see a summary of your past trips', checked: privacySettings.showTripHistory },
                  { label: 'Allow personalized marketing', desc: 'Receive tailored ads and promotional emails', checked: privacySettings.allowMarketing },
                  { label: 'Share anonymized data', desc: "Help improve StayEase's recommendation engine", checked: privacySettings.shareData },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                    <div>
                      <p className="text-[#222222] text-sm font-semibold">{item.label}</p>
                      <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                      style={{ background: item.checked ? '#FF385C' : '#DDDDDD' }}
                    >
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                        style={{ left: item.checked ? '1.375rem' : '0.125rem' }} />
                    </button>
                  </div>
                ))}
                <button onClick={handleSave} className="mt-2 flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                  <Save className="w-4 h-4" />
                  {saved ? '✓ Saved!' : 'Save Privacy Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}