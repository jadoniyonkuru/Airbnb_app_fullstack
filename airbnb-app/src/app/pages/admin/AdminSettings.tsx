import { useState } from 'react';
import {
  Globe, Bell, Shield, CreditCard, Users, Settings,
  ChevronRight, Save, Mail, Smartphone, ToggleLeft, Percent,
  AlertTriangle, Database, RefreshCw, Lock
} from 'lucide-react';

const sections = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'payments', label: 'Payments & Fees', icon: CreditCard },
  { id: 'users', label: 'User Policies', icon: Users },
  { id: 'system', label: 'System', icon: Database },
];

export function AdminSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'StayEase',
    contactEmail: 'support@stayease.com',
    supportPhone: '+250 788 456 789',
    defaultCurrency: 'USD',
    defaultLanguage: 'English',
    timezone: 'UTC',
    maintenanceMode: false,
    newRegistrations: true,
    guestReviews: true,
    instantBooking: true,
  });

  const [feeSettings, setFeeSettings] = useState({
    guestServiceFee: '12',
    hostServiceFee: '3',
    paymentProcessingFee: '2.5',
    taxRate: '10',
    minBookingAmount: '20',
    maxBookingAmount: '10000',
    payoutCycleEnabled: true,
    payoutCycleDays: '7',
  });

  const [notifSettings, setNotifSettings] = useState({
    adminNewBooking: true,
    adminNewHost: true,
    adminDispute: true,
    adminPayoutFailed: true,
    adminWeeklyReport: true,
    adminMonthlyReport: true,
    systemAlerts: true,
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Platform Settings</h1>
        <p className="text-[#717171] text-sm">Configure and manage global platform settings.</p>
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
                  background: activeSection === s.id ? 'rgba(255,56,92,0.08)' : 'transparent',
                  color: activeSection === s.id ? '#FF385C' : 'rgba(255,255,255,0.7)',
                  borderLeft: activeSection === s.id ? '3px solid #FF385C' : '3px solid transparent'
                }}
              >
                <s.icon className="w-4 h-4 shrink-0" style={{ color: activeSection === s.id ? '#FF385C' : '#484848' }} />
                <span className="text-sm font-medium" style={{ color: activeSection === s.id ? '#FF385C' : '#484848' }}>{s.label}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40 text-[#484848]" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">

          {/* General */}
          {activeSection === 'general' && (
            <>
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Platform Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#222222] text-sm font-semibold mb-2">Platform Name</label>
                      <input value={generalSettings.platformName} onChange={e => setGeneralSettings(p => ({ ...p, platformName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[#222222] text-sm font-semibold mb-2">Support Email</label>
                      <input type="email" value={generalSettings.contactEmail} onChange={e => setGeneralSettings(p => ({ ...p, contactEmail: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[#222222] text-sm font-semibold mb-2">Support Phone</label>
                      <input type="tel" value={generalSettings.supportPhone} onChange={e => setGeneralSettings(p => ({ ...p, supportPhone: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[#222222] text-sm font-semibold mb-2">Default Currency</label>
                      <select value={generalSettings.defaultCurrency} onChange={e => setGeneralSettings(p => ({ ...p, defaultCurrency: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] bg-white">
                        <option value="USD">USD – US Dollar</option>
                        <option value="EUR">EUR – Euro</option>
                        <option value="GBP">GBP – British Pound</option>
                        <option value="RWF">RWF – Rwandan Franc</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#222222] text-sm font-semibold mb-2">Default Language</label>
                      <select value={generalSettings.defaultLanguage} onChange={e => setGeneralSettings(p => ({ ...p, defaultLanguage: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] bg-white">
                        <option>English</option>
                        <option>French</option>
                        <option>Spanish</option>
                        <option>Arabic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#222222] text-sm font-semibold mb-2">Server Timezone</label>
                      <select value={generalSettings.timezone} onChange={e => setGeneralSettings(p => ({ ...p, timezone: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] bg-white">
                        <option value="UTC">UTC</option>
                        <option value="Africa/Kigali">Africa/Kigali (UTC+2)</option>
                        <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                        <option value="America/New_York">America/New_York (UTC-5)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Platform Features</h2>
                <div className="space-y-4">
                  {[
                    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily disable public access for maintenance', danger: true },
                    { key: 'newRegistrations', label: 'Allow New Registrations', desc: 'Enable new users to sign up on the platform' },
                    { key: 'guestReviews', label: 'Guest Reviews', desc: 'Allow guests to leave reviews for properties' },
                    { key: 'instantBooking', label: 'Instant Booking', desc: 'Allow properties to offer instant booking without host approval' },
                  ].map(item => (
                    <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                      <div>
                        <p className={`text-sm font-semibold ${item.danger ? 'text-red-600' : 'text-[#222222]'}`}>{item.label}</p>
                        <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setGeneralSettings(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                        className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                        style={{ background: generalSettings[item.key as keyof typeof generalSettings] ? (item.danger ? '#dc2626' : '#FF385C') : '#DDDDDD' }}
                      >
                        <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                          style={{ left: generalSettings[item.key as keyof typeof generalSettings] ? '1.375rem' : '0.125rem' }} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} className="mt-5 flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                  <Save className="w-4 h-4" />
                  {saved ? '✓ Saved!' : 'Save Settings'}
                </button>
              </div>
            </>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Admin Notification Preferences</h2>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#AAAAAA] mb-3">Platform Events</p>
              <div className="space-y-3 mb-6">
                {[
                  { key: 'adminNewBooking', label: 'New booking created', desc: 'Notify admin whenever a new booking is made' },
                  { key: 'adminNewHost', label: 'New host registered', desc: 'Alert when a new host registers and needs review' },
                  { key: 'adminDispute', label: 'Dispute submitted', desc: 'Immediate notification for any guest/host dispute' },
                  { key: 'adminPayoutFailed', label: 'Payout failed', desc: 'Alert when a host payout fails to process' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                    <div>
                      <p className="text-[#222222] text-sm font-semibold">{item.label}</p>
                      <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifSettings(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                      className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                      style={{ background: notifSettings[item.key as keyof typeof notifSettings] ? '#FF385C' : '#DDDDDD' }}
                    >
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                        style={{ left: notifSettings[item.key as keyof typeof notifSettings] ? '1.375rem' : '0.125rem' }} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#AAAAAA] mb-3">Scheduled Reports</p>
              <div className="space-y-3">
                {[
                  { key: 'adminWeeklyReport', label: 'Weekly performance report', desc: 'Summary of key metrics sent every Monday' },
                  { key: 'adminMonthlyReport', label: 'Monthly analytics report', desc: 'Comprehensive monthly report on the 1st' },
                  { key: 'systemAlerts', label: 'System health alerts', desc: 'Server errors and performance degradation alerts' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                    <div>
                      <p className="text-[#222222] text-sm font-semibold">{item.label}</p>
                      <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifSettings(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                      className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                      style={{ background: notifSettings[item.key as keyof typeof notifSettings] ? '#FF385C' : '#DDDDDD' }}
                    >
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                        style={{ left: notifSettings[item.key as keyof typeof notifSettings] ? '1.375rem' : '0.125rem' }} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="mt-5 flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                <Save className="w-4 h-4" />
                {saved ? '✓ Saved!' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Authentication Policies</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Require email verification', desc: 'Users must verify email before accessing platform', checked: true },
                    { label: 'Force 2FA for admins', desc: 'All admin accounts must enable two-factor authentication', checked: true },
                    { label: 'Session timeout (30 min)', desc: 'Automatically log out inactive admin sessions', checked: false },
                    { label: 'IP allowlist for admin', desc: 'Restrict admin access to approved IP addresses', checked: false },
                    { label: 'Password complexity rules', desc: 'Enforce strong password requirements for all users', checked: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                      <div>
                        <p className="text-[#222222] text-sm font-semibold">{item.label}</p>
                        <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <button className="relative w-11 h-6 rounded-full shrink-0 transition-colors" style={{ background: item.checked ? '#FF385C' : '#DDDDDD' }}>
                        <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow" style={{ left: item.checked ? '1.375rem' : '0.125rem' }} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} className="mt-5 flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                  <Lock className="w-4 h-4" />
                  {saved ? '✓ Saved!' : 'Save Security Settings'}
                </button>
              </div>
            </div>
          )}

          {/* Payments & Fees */}
          {activeSection === 'payments' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Fees & Commission Structure</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {[
                  { label: 'Guest Service Fee (%)', key: 'guestServiceFee', desc: 'Added to booking total for guests' },
                  { label: 'Host Service Fee (%)', key: 'hostServiceFee', desc: 'Deducted from host payout' },
                  { label: 'Payment Processing Fee (%)', key: 'paymentProcessingFee', desc: 'Charged per transaction' },
                  { label: 'Tax Rate (%)', key: 'taxRate', desc: 'Applied to all bookings where applicable' },
                  { label: 'Minimum Booking Amount ($)', key: 'minBookingAmount', desc: 'Smallest booking value accepted' },
                  { label: 'Maximum Booking Amount ($)', key: 'maxBookingAmount', desc: 'Largest booking value per transaction' },
                ].map(item => (
                  <div key={item.key}>
                    <label className="block text-[#222222] text-sm font-semibold mb-1.5">{item.label}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={feeSettings[item.key as keyof typeof feeSettings] as string}
                        onChange={e => setFeeSettings(p => ({ ...p, [item.key]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-[#DDDDDD] text-[#222222] text-sm outline-none focus:border-[#FF385C] transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAAAAA] text-sm">
                        {item.key.includes('Fee') || item.key.includes('Rate') ? '%' : '$'}
                      </span>
                    </div>
                    <p className="text-[#AAAAAA] text-xs mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-start justify-between py-4 border-t border-[#EBEBEB] mb-4">
                <div>
                  <p className="text-[#222222] font-semibold text-sm">Automatic Payout Cycle</p>
                  <p className="text-[#717171] text-xs mt-0.5">Automatically process host payouts every {feeSettings.payoutCycleDays} days</p>
                </div>
                <button
                  onClick={() => setFeeSettings(p => ({ ...p, payoutCycleEnabled: !p.payoutCycleEnabled }))}
                  className="relative w-11 h-6 rounded-full shrink-0 transition-colors"
                  style={{ background: feeSettings.payoutCycleEnabled ? '#FF385C' : '#DDDDDD' }}
                >
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                    style={{ left: feeSettings.payoutCycleEnabled ? '1.375rem' : '0.125rem' }} />
                </button>
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                <Percent className="w-4 h-4" />
                {saved ? '✓ Saved!' : 'Save Fee Structure'}
              </button>
            </div>
          )}

          {/* User Policies */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>User Management Policies</h2>
              <div className="space-y-4">
                {[
                  { label: 'Auto-approve new host listings', desc: 'Skip manual review for listings from verified top hosts' },
                  { label: 'ID verification required for hosts', desc: 'Hosts must submit government ID before listing' },
                  { label: 'Minimum age requirement (18+)', desc: 'Block registrations from users under 18' },
                  { label: 'Allow guests to message before booking', desc: 'Guests can contact hosts before making a reservation' },
                  { label: 'Require host response within 24h', desc: 'Flag listings with slow response rates for review' },
                  { label: 'Auto-suspend accounts with 3 violations', desc: 'Automatically suspend repeat policy violators' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                    <div>
                      <p className="text-[#222222] text-sm font-semibold">{item.label}</p>
                      <p className="text-[#717171] text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button className="relative w-11 h-6 rounded-full shrink-0 transition-colors" style={{ background: i % 2 === 0 ? '#FF385C' : '#DDDDDD' }}>
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow" style={{ left: i % 2 === 0 ? '1.375rem' : '0.125rem' }} />
                    </button>
                  </div>
                ))}
                <button onClick={handleSave} className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors">
                  <Save className="w-4 h-4" />
                  {saved ? '✓ Saved!' : 'Save Policies'}
                </button>
              </div>
            </div>
          )}

          {/* System */}
          {activeSection === 'system' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>System Status</h2>
                <div className="space-y-3">
                  {[
                    { service: 'API Server', status: 'Operational', uptime: '99.99%', latency: '42ms', color: '#16a34a' },
                    { service: 'Database', status: 'Operational', uptime: '99.97%', latency: '18ms', color: '#16a34a' },
                    { service: 'Payment Gateway', status: 'Operational', uptime: '99.95%', latency: '120ms', color: '#16a34a' },
                    { service: 'Email Service', status: 'Degraded', uptime: '98.2%', latency: '340ms', color: '#d97706' },
                    { service: 'CDN / Media', status: 'Operational', uptime: '100%', latency: '8ms', color: '#16a34a' },
                    { service: 'Search Engine', status: 'Operational', uptime: '99.91%', latency: '65ms', color: '#16a34a' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#EBEBEB]">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        <p className="text-[#222222] text-sm font-semibold">{s.service}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#717171]">
                        <span>Uptime: <strong className="text-[#222222]">{s.uptime}</strong></span>
                        <span>Latency: <strong className="text-[#222222]">{s.latency}</strong></span>
                        <span className="font-semibold" style={{ color: s.color }}>{s.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                <h2 className="text-[#222222] font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Maintenance Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Clear Cache', desc: 'Flush all server-side caches', icon: RefreshCw, color: '#0ea5e9' },
                    { label: 'Run Database Backup', desc: 'Trigger immediate database snapshot', icon: Database, color: '#16a34a' },
                    { label: 'Send Test Email', desc: 'Verify email delivery configuration', icon: Mail, color: '#7c3aed' },
                    { label: 'Restart Workers', desc: 'Restart background job workers', icon: Settings, color: '#d97706' },
                  ].map((action, i) => (
                    <button key={i} className="flex items-center gap-4 p-4 rounded-xl border border-[#EBEBEB] hover:border-[#DDDDDD] hover:shadow-sm transition-all text-left w-full group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${action.color}18` }}>
                        <action.icon className="w-5 h-5" style={{ color: action.color }} />
                      </div>
                      <div>
                        <p className="text-[#222222] text-sm font-semibold group-hover:text-[#FF385C] transition-colors">{action.label}</p>
                        <p className="text-[#717171] text-xs">{action.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl border border-red-100 p-6">
                <h2 className="text-red-600 font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <AlertTriangle className="w-4 h-4" /> Danger Zone
                </h2>
                <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50">
                  <div>
                    <p className="text-red-600 text-sm font-semibold">Reset Platform Data</p>
                    <p className="text-[#717171] text-xs mt-0.5">This will permanently delete all data. Requires super-admin confirmation.</p>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-colors">
                    <AlertTriangle className="w-4 h-4" /> Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
