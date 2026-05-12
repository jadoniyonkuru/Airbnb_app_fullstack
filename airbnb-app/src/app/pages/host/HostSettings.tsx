import { useState } from 'react';
import {
  Shield, Bell, CreditCard, Globe, Trash2, Download,
  ChevronRight, Smartphone, Monitor, LogOut, AlertTriangle, Save
} from 'lucide-react';

const settingsSections = [
  { id: 'account', label: 'Account & Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payments', label: 'Payments & Payouts', icon: CreditCard },
  { id: 'privacy', label: 'Privacy & Data', icon: Globe },
];

const activeSessions = [
  { device: 'MacBook Pro', location: 'Kigali, Rwanda', lastActive: 'Active now', browser: 'Chrome 124', current: true },
  { device: 'iPhone 15', location: 'Kigali, Rwanda', lastActive: '2 hours ago', browser: 'Safari Mobile', current: false },
  { device: 'Windows PC', location: 'Nairobi, Kenya', lastActive: '3 days ago', browser: 'Firefox 125', current: false },
];

export function HostSettings() {
  const [activeSection, setActiveSection] = useState('account');
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Africa/Kigali');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const [notifSettings, setNotifSettings] = useState({
    bookingRequests: true,
    bookingConfirmed: true,
    bookingCancelled: true,
    guestMessages: true,
    newReviews: true,
    payoutProcessed: true,
    promotions: false,
    tips: true,
    sms: false,
    pushNotif: true,
  });

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Settings</h1>
        <p className="text-[#717171] text-sm">Manage your account preferences and platform settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
            {settingsSections.map(s => (
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
                <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Account Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Display Language</label>
                    <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] bg-white transition-colors">
                      <option>English</option>
                      <option>French</option>
                      <option>Kinyarwanda</option>
                      <option>Swahili</option>
                      <option>Spanish</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Currency</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] bg-white transition-colors">
                      <option value="USD">USD – US Dollar</option>
                      <option value="EUR">EUR – Euro</option>
                      <option value="GBP">GBP – British Pound</option>
                      <option value="RWF">RWF – Rwandan Franc</option>
                      <option value="KES">KES – Kenyan Shilling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Timezone</label>
                    <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] bg-white transition-colors">
                      <option value="Africa/Kigali">Africa/Kigali (UTC+2)</option>
                      <option value="Africa/Nairobi">Africa/Nairobi (UTC+3)</option>
                      <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                      <option value="UTC">UTC (UTC+0)</option>
                    </select>
                  </div>
                  <button onClick={handleSave} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                    <Save className="w-4 h-4" />
                    {saved ? '✓ Saved!' : 'Save Preferences'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Security</h2>
                <div className="space-y-4">
                  {/* 2FA */}
                  <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-[#EBEBEB]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: twoFactor ? '#E6F7F6' : '#F7F7F7' }}>
                        <Smartphone className="w-5 h-5" style={{ color: twoFactor ? '#00A699' : '#717171' }} />
                      </div>
                      <div>
                        <p className="text-[#222222] font-semibold text-sm">Two-Factor Authentication</p>
                        <p className="text-[#717171] text-xs mt-0.5">Add an extra layer of security to your account using your phone.</p>
                        <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${twoFactor ? 'bg-green-50 text-green-700' : 'bg-[#FFF1F3] text-[#FF385C]'}`}>
                          {twoFactor ? '✓ Enabled' : 'Not enabled'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setTwoFactor(!twoFactor)}
                      className="relative w-11 h-6 rounded-full shrink-0 transition-colors mt-1"
                      style={{ background: twoFactor ? '#FF385C' : '#DDDDDD' }}
                    >
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: twoFactor ? '1.375rem' : '0.125rem' }} />
                    </button>
                  </div>

                  {/* Active Sessions */}
                  <div>
                    <p className="text-[#222222] font-semibold text-sm mb-3">Active Sessions</p>
                    <div className="space-y-3">
                      {activeSessions.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[#EBEBEB]">
                          <div className="w-9 h-9 rounded-xl bg-[#F7F7F7] flex items-center justify-center shrink-0">
                            <Monitor className="w-4 h-4 text-[#717171]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[#222222] text-sm font-semibold">{s.device}</p>
                              {s.current && <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">Current</span>}
                            </div>
                            <p className="text-[#717171] text-xs">{s.browser} · {s.location} · {s.lastActive}</p>
                          </div>
                          {!s.current && (
                            <button className="text-xs text-[#FF385C] font-semibold hover:underline">
                              <LogOut className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 text-sm text-[#FF385C] font-semibold hover:underline">Sign out all other sessions</button>
                  </div>
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
                      <p className="text-[#717171] text-xs mt-0.5">Export all your account data and listing history.</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-semibold text-[#484848] border border-[#DDDDDD] px-4 py-2 rounded-xl hover:bg-white transition-colors bg-white">
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50">
                    <div>
                      <p className="text-red-600 text-sm font-semibold">Delete Account</p>
                      <p className="text-[#717171] text-xs mt-0.5">Permanently delete your account and all associated data.</p>
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
              <h2 className="text-[#222222] font-semibold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Notification Preferences</h2>

              <p className="text-xs font-semibold uppercase tracking-widest text-[#AAAAAA] mb-3">Email Notifications</p>
              <div className="space-y-3 mb-6">
                {[
                  { key: 'bookingRequests', label: 'New booking requests', desc: 'When a guest requests to book your property' },
                  { key: 'bookingConfirmed', label: 'Booking confirmed', desc: 'When a booking is confirmed or approved' },
                  { key: 'bookingCancelled', label: 'Booking cancelled', desc: 'When a guest cancels their reservation' },
                  { key: 'guestMessages', label: 'Guest messages', desc: 'New messages from guests in your inbox' },
                  { key: 'newReviews', label: 'New reviews', desc: 'When guests leave reviews on your listings' },
                  { key: 'payoutProcessed', label: 'Payout processed', desc: 'When a payout is sent to your account' },
                  { key: 'promotions', label: 'Promotions & tips', desc: 'Marketing emails and hosting best practices' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                    <div>
                      <p className="text-[#222222] text-sm font-semibold">{item.label}</p>
                      <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(item.key as keyof typeof notifSettings)}
                      className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                      style={{ background: notifSettings[item.key as keyof typeof notifSettings] ? '#FF385C' : '#DDDDDD' }}
                    >
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                        style={{ left: notifSettings[item.key as keyof typeof notifSettings] ? '1.375rem' : '0.125rem' }} />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest text-[#AAAAAA] mb-3">Other Channels</p>
              <div className="space-y-3">
                {[
                  { key: 'sms', label: 'SMS Notifications', desc: 'Receive text messages for urgent alerts' },
                  { key: 'pushNotif', label: 'Push Notifications', desc: 'Browser and mobile push notifications' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                    <div>
                      <p className="text-[#222222] text-sm font-semibold">{item.label}</p>
                      <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(item.key as keyof typeof notifSettings)}
                      className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                      style={{ background: notifSettings[item.key as keyof typeof notifSettings] ? '#FF385C' : '#DDDDDD' }}
                    >
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                        style={{ left: notifSettings[item.key as keyof typeof notifSettings] ? '1.375rem' : '0.125rem' }} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="mt-6 flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                <Save className="w-4 h-4" />
                {saved ? '✓ Saved!' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Payments */}
          {activeSection === 'payments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Payout Methods</h2>
                <div className="space-y-3 mb-4">
                  {[
                    { type: 'Bank Transfer', detail: 'BK Rwanda •••• 8842', primary: true, icon: '🏦' },
                    { type: 'Mobile Money', detail: 'MTN MoMo +250 789 xxx xxx', primary: false, icon: '📱' },
                    { type: 'PayPal', detail: 'jeanpierre.h@email.com', primary: false, icon: '💳' },
                  ].map((method, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-[#EBEBEB]">
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="text-[#222222] text-sm font-semibold">{method.type}</p>
                        <p className="text-[#717171] text-xs">{method.detail}</p>
                      </div>
                      {method.primary && <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">Primary</span>}
                      {!method.primary && <button className="text-xs text-[#FF385C] font-semibold hover:underline">Set Primary</button>}
                      <button className="text-xs text-[#AAAAAA] hover:text-red-500 transition-colors">Remove</button>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold text-[#FF385C] border border-[#FF385C] px-4 py-2.5 rounded-xl hover:bg-[#FFF1F3] transition-colors">
                  + Add Payout Method
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Tax Information</h2>
                <p className="text-[#717171] text-sm mb-4">Provide your tax ID for compliance and payout documentation.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Tax ID / VAT Number</label>
                    <input defaultValue="RW-VAT-2024-0091" className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[#222222] text-sm font-semibold mb-2">Business Type</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] bg-white transition-colors">
                      <option>Individual / Sole Trader</option>
                      <option>Limited Company</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                  <button onClick={handleSave} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                    <Save className="w-4 h-4" />
                    {saved ? '✓ Saved!' : 'Save Tax Info'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeSection === 'privacy' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Privacy & Data Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'Show my profile publicly', desc: 'Your host profile is visible to all users', checked: true },
                  { label: 'Display exact address on listing', desc: 'Show precise location (only shared after booking)', checked: false },
                  { label: 'Allow search engines to index my profile', desc: 'Your profile may appear in Google search results', checked: true },
                  { label: 'Share analytics with StayEase', desc: 'Help us improve the platform with anonymized data', checked: true },
                  { label: 'Receive personalized recommendations', desc: 'Get tips and suggestions based on your activity', checked: true },
                  { label: 'Allow guest reviews to be featured', desc: 'Top reviews may appear in platform marketing', checked: false },
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