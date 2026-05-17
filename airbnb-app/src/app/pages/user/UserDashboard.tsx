import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Heart, MessageCircle, CreditCard,
  Star, Bell, Settings, LogOut, Trash2, Camera, Eye, EyeOff,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useUserBookings } from '../../../features/bookings/hooks';
import { useListings } from '../../../features/listings/hooks';
import { apiClient } from '../../../api/client';

type ActiveSection = 'overview' | 'trips' | 'wishlist' | 'messages' | 'payments' | 'reviews' | 'notifications' | 'settings';

export function UserDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { data: bookings = [], isLoading: loadingBookings } = useUserBookings(user?.id || '');
  const { data: listings = [], isLoading: loadingListings } = useListings();

  const [active, setActive] = useState<ActiveSection>('overview');
  const [collapsed, setCollapsed] = useState(false);

  // Settings state
  const [settingsTab, setSettingsTab] = useState<'profile' | 'account'>('profile');
  const [profileName, setProfileName] = useState(user?.name ?? '');
  const [profileEmail, setProfileEmail] = useState(user?.email ?? '');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDesc, setProfileDesc] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState<Record<string, boolean>>({});
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifPush, setNotifPush] = useState(true);

  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pendingPayments = bookings.filter(b => b.status === 'pending');
  const saved = listings.slice(0, 6);

  // ── Payment management state ──────────────────────────────────────
  type SavedCard = { id: string; brand: string; last4: string; expiry: string; primary: boolean };
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    { id: 'c1', brand: 'Visa',       last4: '4242', expiry: '08/28', primary: true  },
    { id: 'c2', brand: 'Mastercard', last4: '8891', expiry: '02/27', primary: false },
  ]);
  const [payTab, setPayTab] = useState<'overview' | 'methods' | 'history'>('overview');
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber]   = useState('');
  const [cardName,   setCardName]     = useState('');
  const [cardExpiry, setCardExpiry]   = useState('');
  const [cardCvv,    setCardCvv]      = useState('');
  const [cardErrors, setCardErrors]   = useState<Record<string, string>>({});
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
  const [selectedCardId,  setSelectedCardId]  = useState<string | null>(null);
  const [paySuccess, setPaySuccess] = useState(false);

  const validateAndAddCard = () => {
    const errs: Record<string, string> = {};
    const digits = cardNumber.replace(/\s/g, '');
    if (digits.length !== 16) errs.cardNumber = 'Enter a valid 16-digit card number';
    if (!cardName.trim())     errs.cardName   = 'Cardholder name is required';
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) errs.cardExpiry = 'Use MM/YY format';
    if (!/^\d{3,4}$/.test(cardCvv))         errs.cardCvv    = '3 or 4 digit CVV';
    setCardErrors(errs);
    if (Object.keys(errs).length) return;
    const brand = digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'Mastercard' : 'Card';
    setSavedCards(prev => [...prev, { id: Date.now().toString(), brand, last4: digits.slice(-4), expiry: cardExpiry, primary: prev.length === 0 }]);
    setCardNumber(''); setCardName(''); setCardExpiry(''); setCardCvv(''); setCardErrors({});
    setShowAddCard(false);
    toast.success('Card added successfully');
  };

  const handleSetDefaultCard = (id: string) => {
    setSavedCards(prev => prev.map(c => ({ ...c, primary: c.id === id })));
    toast.success('Default card updated');
  };

  const handleRemoveCard = (id: string) => {
    setSavedCards(prev => {
      const rest = prev.filter(c => c.id !== id);
      if (rest.length && prev.find(c => c.id === id)?.primary) rest[0] = { ...rest[0], primary: true };
      return rest;
    });
    toast.success('Card removed');
  };

  const openPayModal = (bookingId: string) => {
    const def = savedCards.find(c => c.primary) ?? savedCards[0] ?? null;
    setSelectedCardId(def?.id ?? null);
    setPayingBookingId(bookingId);
    setPaySuccess(false);
  };

  const confirmPay = () => {
    if (!selectedCardId) { toast.error('Please select a payment card'); return; }
    setPaySuccess(true);
    setTimeout(() => { setPayingBookingId(null); setPaySuccess(false); toast.success('Payment processed successfully!'); }, 1800);
  };

  const payingBooking = bookings.find(b => b.id === payingBookingId) ?? null;

  const handleRemoveSaved = (_id: string) => toast.success('Removed from Saved');

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !user) return;
    setAvatarUrl(URL.createObjectURL(f));
    try {
      const fd = new FormData();
      fd.append('image', f);
      const { data } = await apiClient.post(`/users/${user.id}/avatar`, fd);
      try { updateUser({ avatar: data.avatar }); } catch {}
      setAvatarUrl(data.avatar || null);
      toast.success('Avatar updated.');
    } catch {
      toast.error('Failed to upload avatar.');
    }
  };

  const handleSaveProfile = () => {
    if (!profileName.trim()) { toast.error('Name is required'); return; }
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) { toast.error('Please fill in all password fields'); return; }
    if (newPwd !== confirmPwd) { toast.error('New passwords do not match'); return; }
    toast.success('Password updated successfully!');
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
  };

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U';
  const inputClass = 'w-full px-4 py-3 rounded-xl border border-[#EBEBEB] bg-[#F7F7F7] text-[#222222] text-sm outline-none focus:border-[#FF385C] focus:bg-white transition-colors';

  const sectionTitle: Record<ActiveSection, string> = {
    overview: 'Dashboard', trips: 'My Trips', wishlist: 'Wishlist',
    messages: 'Messages', payments: 'Payments', reviews: 'Reviews',
    notifications: 'Notifications', settings: 'Profile Settings',
  };

  const navItems = [
    { label: 'Dashboard',        key: 'overview'      as ActiveSection, icon: LayoutDashboard },
    { label: 'My Trips',         key: 'trips'         as ActiveSection, icon: Calendar },
    { label: 'Wishlist',         key: 'wishlist'      as ActiveSection, icon: Heart },
    { label: 'Messages',         key: 'messages'      as ActiveSection, icon: MessageCircle },
    { label: 'Payments',         key: 'payments'      as ActiveSection, icon: CreditCard },
    { label: 'Reviews',          key: 'reviews'       as ActiveSection, icon: Star },
    { label: 'Notifications',    key: 'notifications' as ActiveSection, icon: Bell },
    { label: 'Profile Settings', key: 'settings'      as ActiveSection, icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar (fixed, never scrolls) ── */}
      <aside
        className="hidden md:flex flex-col bg-white border-r border-[#EBEBEB] flex-shrink-0 transition-all duration-200"
        style={{ width: collapsed ? 68 : 260 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 px-4 py-5 border-b border-[#EBEBEB] shrink-0 overflow-hidden">
          <div className="w-8 h-8 bg-[#FF385C] rounded-xl flex items-center justify-center text-white font-bold shrink-0">SE</div>
          {!collapsed && <span className="text-[#222222] font-bold text-lg whitespace-nowrap">StayEase</span>}
        </Link>

        {/* User avatar */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-[#EBEBEB] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: '#FF385C' }}>
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#222222] truncate">{user?.name}</p>
                <p className="text-xs text-[#717171]">Guest</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav items — scrollable if needed */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl transition-colors hover:bg-[#F5F5F5]"
              style={active === item.key ? { background: '#F0F0F0' } : {}}
            >
              <item.icon
                className="w-4 h-4 shrink-0"
                style={{ color: active === item.key ? '#222222' : '#717171' }}
              />
              {!collapsed && (
                <span
                  className="text-sm whitespace-nowrap"
                  style={{ fontWeight: active === item.key ? 600 : 500, color: active === item.key ? '#222222' : '#484848' }}
                >
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout + Collapse — near Profile Settings */}
        <div className="px-2 py-2 border-t border-[#EBEBEB] shrink-0 space-y-0.5">
          <button
            onClick={() => { logout(); navigate('/'); }}
            title={collapsed ? 'Logout' : undefined}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-[#FFF1F3] text-[#717171] hover:text-[#FF385C] transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>

          <button
            onClick={() => setCollapsed(v => !v)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-[#F5F5F5] text-[#717171] transition-colors"
          >
            {collapsed
              ? <PanelLeftOpen className="w-4 h-4 shrink-0" />
              : <PanelLeftClose className="w-4 h-4 shrink-0" />}
            {!collapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Right side: header + scrollable content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB] bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <input placeholder="Search listings" className="px-4 py-2 rounded-xl border border-[#EBEBEB] w-72 text-sm outline-none focus:border-[#FF385C]" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#F7F7F7]">
              <Bell className="w-5 h-5 text-[#717171]" />
              {pendingPayments.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF385C] w-4 h-4 rounded-full flex items-center justify-center text-white text-[11px]">
                  {pendingPayments.length}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3 border border-[#FFD4D8] rounded-xl px-3 py-1" style={{ background: '#FFF1F3' }}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-xs" style={{ background: '#FF385C' }}>
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : initials}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-[#FF385C]">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#222222]">{sectionTitle[active]}</h1>
                <button onClick={() => setActive('overview')} className="text-sm px-3 py-2 rounded-xl bg-[#FF385C] text-white">
                  Quick actions
                </button>
              </div>

              {/* ── OVERVIEW ── */}
              {active === 'overview' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Upcoming Trips',  value: upcoming.length,        sub: 'Trips starting soon' },
                      { label: 'Total Bookings',  value: bookings.length,        sub: 'All time' },
                      { label: 'Saved Hotels',    value: saved.length,           sub: 'Your wishlist' },
                      { label: 'Pending Bookings', value: pendingPayments.length, sub: 'Awaiting confirmation' },
                    ].map(c => (
                      <div key={c.label} className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                        <p className="text-xs text-[#717171]">{c.label}</p>
                        <p className="text-2xl font-bold text-[#222222]">{c.value}</p>
                        <p className="text-sm text-[#717171]">{c.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-[#EBEBEB] mb-6">
                    <div className="p-4 border-b border-[#EBEBEB] flex items-center justify-between">
                      <h2 className="font-semibold text-[#222222]">Recent Bookings</h2>
                      <button onClick={() => setActive('trips')} className="text-[#FF385C] text-sm">View all</button>
                    </div>
                    <div className="divide-y divide-[#F5F5F5]">
                      {loadingBookings ? (
                        <div className="p-6 text-sm text-[#717171]">Loading...</div>
                      ) : bookings.length === 0 ? (
                        <div className="p-6 text-sm text-[#717171]">No bookings yet.</div>
                      ) : (
                        bookings.slice(0, 3).map(b => (
                          <div key={b.id} className="p-4 flex items-center gap-4">
                            <img src={b.propertyImage} className="w-20 h-14 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate text-[#222222]">{b.propertyTitle}</p>
                              <p className="text-xs text-[#717171]">{b.checkIn} → {b.checkOut} • {b.nights} nights</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#222222]">${b.total}</p>
                              <p className="text-xs text-[#717171]">{b.status}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {saved.map(p => (
                      <Link key={p.id} to={`/property/${p.id}`} className="group bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden flex items-stretch">
                        <img src={p.image} alt={p.title} className="w-36 h-full object-cover" />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-sm font-semibold truncate text-[#222222]">{p.title}</p>
                            <p className="text-xs text-[#717171] truncate">{p.location}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 text-xs text-[#717171]">
                              <Star className="w-3 h-3 text-[#FF385C]" />
                              <span>{p.rating ?? '4.8'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#222222]">${p.price}</span>
                              <button
                                onClick={e => { e.preventDefault(); handleRemoveSaved(p.id); }}
                                className="text-sm text-[#FF385C] p-2 rounded-lg hover:bg-[#FFF1F3]"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* ── TRIPS ── */}
              {active === 'trips' && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                  {bookings.length === 0 ? (
                    <div className="p-6 text-sm text-[#717171]">
                      You have no trips.{' '}
                      <Link to="/listings" className="text-[#FF385C]">Explore properties</Link>
                    </div>
                  ) : (
                    bookings.map(b => (
                      <div key={b.id} className="p-4 border-b last:border-b-0 flex items-center gap-4">
                        <img src={b.propertyImage} className="w-28 h-20 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#222222]">{b.propertyTitle}</p>
                          <p className="text-xs text-[#717171]">{b.location}</p>
                          <p className="text-xs text-[#717171] mt-1">{b.checkIn} → {b.checkOut} • {b.nights} nights</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#222222]">${b.total}</p>
                          <p className="text-xs text-[#717171]">{b.status}</p>
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => navigate(`/property/${b.propertyId}`)} className="text-sm text-[#FF385C]">View</button>
                            <button className="text-sm text-[#717171]">Contact host</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── WISHLIST ── */}
              {active === 'wishlist' && (
                <div className="space-y-4">
                  {saved.length === 0 ? (
                    <div className="p-6 text-sm text-[#717171]">No saved properties.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {saved.map(p => (
                        <div key={p.id} className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden flex">
                          <img src={p.image} className="w-36 h-28 object-cover" />
                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="font-semibold text-sm text-[#222222]">{p.title}</p>
                              <p className="text-xs text-[#717171]">{p.location}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-[#FF385C]" />
                                <span className="text-xs text-[#717171]">{p.rating ?? '4.8'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#222222]">${p.price}</span>
                                <button onClick={() => handleRemoveSaved(p.id)} className="text-[#FF385C] p-2 rounded-lg hover:bg-[#FFF1F3]">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── MESSAGES ── */}
              {active === 'messages' && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-[#222222]">Inbox</p>
                  </div>
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-[#DDDDDD]" />
                    <p className="text-sm text-[#717171]">No messages yet.</p>
                    <p className="text-xs text-[#AAAAAA] mt-1">Messages from hosts will appear here.</p>
                  </div>
                </div>
              )}

              {/* ── PAYMENTS ── */}
              {active === 'payments' && (
                <div className="space-y-5">
                  {/* Sub-tab bar */}
                  <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: '#F0F0F0' }}>
                    {([
                      { key: 'overview', label: 'Overview'         },
                      { key: 'methods',  label: 'Payment Methods'  },
                      { key: 'history',  label: 'Transaction History' },
                    ] as const).map(t => (
                      <button
                        key={t.key}
                        onClick={() => setPayTab(t.key)}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={payTab === t.key
                          ? { background: 'white', color: '#222222', fontWeight: 600, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                          : { color: '#717171' }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* ── Overview tab ── */}
                  {payTab === 'overview' && (() => {
                    const totalSpent   = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((s, b) => s + b.total, 0);
                    const pendingAmt   = bookings.filter(b => b.status === 'pending').reduce((s, b) => s + b.total, 0);
                    const confirmedCnt = bookings.filter(b => b.status === 'confirmed').length;
                    const completedCnt = bookings.filter(b => b.status === 'completed').length;
                    return (
                      <>
                        {/* Summary cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { label: 'Total Spent',   value: `$${totalSpent.toLocaleString()}`,   color: '#FF385C' },
                            { label: 'Pending',       value: `$${pendingAmt.toLocaleString()}`,    color: '#d97706' },
                            { label: 'Confirmed',     value: confirmedCnt,                         color: '#2563eb' },
                            { label: 'Completed',     value: completedCnt,                         color: '#16a34a' },
                          ].map(s => (
                            <div key={s.label} className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                              <p className="text-xs text-[#717171] mb-1">{s.label}</p>
                              <p className="text-xl font-bold" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>{s.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Pending bookings requiring action */}
                        <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                          <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-[#222222]">Pending Bookings</p>
                              <p className="text-xs text-[#717171] mt-0.5">Bookings awaiting host confirmation.</p>
                            </div>
                            {pendingPayments.length > 0 && (
                              <span className="text-xs font-bold text-white bg-[#d97706] px-2 py-0.5 rounded-full">{pendingPayments.length}</span>
                            )}
                          </div>
                          {pendingPayments.length === 0 ? (
                            <div className="text-center py-10">
                              <CreditCard className="w-10 h-10 mx-auto mb-2 text-[#DDDDDD]" />
                              <p className="text-sm text-[#717171]">No pending bookings.</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-[#F5F5F5]">
                              {pendingPayments.map(b => (
                                <div key={b.id} className="flex items-center gap-4 p-4">
                                  <img src={b.propertyImage} className="w-16 h-12 rounded-xl object-cover shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-[#222222] truncate">{b.propertyTitle}</p>
                                    <p className="text-xs text-[#717171]">{b.checkIn} → {b.checkOut} • {b.nights} nights</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="font-bold text-[#222222]">${b.total}</p>
                                    <span className="block text-xs text-[#d97706] font-medium mt-0.5">Awaiting confirmation</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Confirmed bookings — ready to pay */}
                        {(() => {
                          const confirmed = bookings.filter(b => b.status === 'confirmed');
                          if (!confirmed.length) return null;
                          return (
                            <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                              <div className="p-5 border-b border-[#EBEBEB]">
                                <p className="font-semibold text-[#222222]">Confirmed — Pay Now</p>
                                <p className="text-xs text-[#717171] mt-0.5">These bookings are confirmed and ready for payment.</p>
                              </div>
                              <div className="divide-y divide-[#F5F5F5]">
                                {confirmed.map(b => (
                                  <div key={b.id} className="flex items-center gap-4 p-4">
                                    <img src={b.propertyImage} className="w-16 h-12 rounded-xl object-cover shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-sm text-[#222222] truncate">{b.propertyTitle}</p>
                                      <p className="text-xs text-[#717171]">{b.checkIn} → {b.checkOut} • {b.nights} nights</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="font-bold text-[#222222]">${b.total}</p>
                                      <button
                                        onClick={() => openPayModal(b.id)}
                                        className="mt-1 text-xs font-bold text-white bg-[#FF385C] hover:bg-[#E31C5F] px-4 py-1.5 rounded-lg transition-colors"
                                      >
                                        Pay Now
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    );
                  })()}

                  {/* ── Payment Methods tab ── */}
                  {payTab === 'methods' && (
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p className="font-semibold text-[#222222]">Saved Cards</p>
                          <p className="text-xs text-[#717171] mt-0.5">Manage your payment methods.</p>
                        </div>
                        <button
                          onClick={() => setShowAddCard(v => !v)}
                          className="flex items-center gap-2 text-sm font-semibold text-white bg-[#FF385C] hover:bg-[#E31C5F] px-4 py-2 rounded-xl transition-colors"
                        >
                          <span className="text-base leading-none">+</span> Add Card
                        </button>
                      </div>

                      {/* Add card form */}
                      {showAddCard && (
                        <div className="border border-[#EBEBEB] rounded-xl p-5 mb-5 bg-[#FAFAFA]">
                          <p className="font-semibold text-sm text-[#222222] mb-4">New Card Details</p>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Card Number</label>
                              <input
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19))}
                                placeholder="1234 5678 9012 3456"
                                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#222222] focus:outline-none ${cardErrors.cardNumber ? 'border-red-400 bg-red-50' : 'border-[#DDDDDD] focus:border-[#FF385C]'}`}
                              />
                              {cardErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{cardErrors.cardNumber}</p>}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Cardholder Name</label>
                              <input
                                value={cardName}
                                onChange={e => setCardName(e.target.value)}
                                placeholder="Full name as on card"
                                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#222222] focus:outline-none ${cardErrors.cardName ? 'border-red-400 bg-red-50' : 'border-[#DDDDDD] focus:border-[#FF385C]'}`}
                              />
                              {cardErrors.cardName && <p className="text-xs text-red-500 mt-1">{cardErrors.cardName}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">Expiry</label>
                                <input
                                  value={cardExpiry}
                                  onChange={e => {
                                    let v = e.target.value.replace(/\D/g, '');
                                    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                                    setCardExpiry(v);
                                  }}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#222222] focus:outline-none ${cardErrors.cardExpiry ? 'border-red-400 bg-red-50' : 'border-[#DDDDDD] focus:border-[#FF385C]'}`}
                                />
                                {cardErrors.cardExpiry && <p className="text-xs text-red-500 mt-1">{cardErrors.cardExpiry}</p>}
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1">CVV</label>
                                <input
                                  value={cardCvv}
                                  onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                  placeholder="•••"
                                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#222222] focus:outline-none ${cardErrors.cardCvv ? 'border-red-400 bg-red-50' : 'border-[#DDDDDD] focus:border-[#FF385C]'}`}
                                />
                                {cardErrors.cardCvv && <p className="text-xs text-red-500 mt-1">{cardErrors.cardCvv}</p>}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-4">
                            <button onClick={validateAndAddCard} className="bg-[#222222] hover:bg-black text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">Save Card</button>
                            <button onClick={() => { setShowAddCard(false); setCardErrors({}); }} className="text-sm text-[#717171] border border-[#DDDDDD] px-5 py-2 rounded-lg hover:border-[#222222] transition-colors">Cancel</button>
                          </div>
                        </div>
                      )}

                      {savedCards.length === 0 ? (
                        <div className="text-center py-10">
                          <CreditCard className="w-10 h-10 mx-auto mb-2 text-[#DDDDDD]" />
                          <p className="text-sm text-[#717171]">No saved cards yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {savedCards.map(card => (
                            <div
                              key={card.id}
                              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${card.primary ? 'border-[#FF385C] bg-[#FFF5F6]' : 'border-[#EBEBEB] bg-white'}`}
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${card.primary ? 'bg-[#FF385C]' : 'bg-[#F0F0F0]'}`}>
                                <CreditCard className={`w-5 h-5 ${card.primary ? 'text-white' : 'text-[#717171]'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-[#222222]">{card.brand} •••• {card.last4}</p>
                                  {card.primary && (
                                    <span className="text-xs font-bold text-[#FF385C] bg-[#FFE4E8] px-2 py-0.5 rounded-full">Default</span>
                                  )}
                                </div>
                                <p className="text-xs text-[#717171] mt-0.5">Expires {card.expiry}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {!card.primary && (
                                  <button onClick={() => handleSetDefaultCard(card.id)} className="text-xs font-semibold text-[#2563eb] hover:underline">Set Default</button>
                                )}
                                <button onClick={() => handleRemoveCard(card.id)} className="p-1.5 rounded-lg text-[#717171] hover:text-red-500 hover:bg-red-50 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Transaction History tab ── */}
                  {payTab === 'history' && (
                    <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                      <div className="p-5 border-b border-[#EBEBEB]">
                        <p className="font-semibold text-[#222222]">All Transactions</p>
                        <p className="text-xs text-[#717171] mt-0.5">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
                      </div>
                      {loadingBookings ? (
                        <div className="p-8 text-center text-sm text-[#717171]">Loading...</div>
                      ) : bookings.length === 0 ? (
                        <div className="text-center py-12">
                          <CreditCard className="w-10 h-10 mx-auto mb-2 text-[#DDDDDD]" />
                          <p className="text-sm text-[#717171]">No transactions yet.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#F5F5F5]">
                          {bookings.map(b => {
                            const statusStyle =
                              b.status === 'confirmed' || b.status === 'completed' ? { color: '#16a34a', bg: '#dcfce7' } :
                              b.status === 'cancelled' ? { color: '#dc2626', bg: '#fee2e2' } :
                              { color: '#d97706', bg: '#fef3c7' };
                            return (
                              <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-[#FAFAFA] transition-colors">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: statusStyle.bg }}>
                                  <CreditCard className="w-5 h-5" style={{ color: statusStyle.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm text-[#222222] truncate">{b.propertyTitle}</p>
                                  <p className="text-xs text-[#717171]">{b.checkIn} → {b.checkOut} • {b.nights} nights</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-[#222222]">${b.total}</p>
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize" style={{ color: statusStyle.color, background: statusStyle.bg }}>
                                    {b.status}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── REVIEWS ── */}
              {active === 'reviews' && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 mx-auto mb-3 text-[#DDDDDD]" />
                    <p className="text-sm text-[#717171]">No reviews yet.</p>
                    <p className="text-xs text-[#AAAAAA] mt-1">After a stay you can leave a review for the property.</p>
                  </div>
                </div>
              )}

              {/* ── NOTIFICATIONS ── */}
              {active === 'notifications' && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                  <p className="text-sm text-[#717171] mb-3">Recent notifications</p>
                  {bookings.length === 0 ? (
                    <div className="text-sm text-[#717171]">No notifications</div>
                  ) : (
                    bookings.slice(0, 6).map(b => (
                      <div key={b.id} className="p-3 border-b last:border-b-0 flex items-start gap-3">
                        <Bell className="w-5 h-5 text-[#FF385C]" />
                        <div>
                          <p className="text-sm">
                            <span className="font-semibold">Booking {b.id.slice(0, 8)}</span> status:{' '}
                            <span className="font-medium">{b.status}</span>
                          </p>
                          <p className="text-xs text-[#717171]">{b.checkIn} → {b.checkOut}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── PROFILE SETTINGS ── */}
              {active === 'settings' && (
                <div>
                  <div className="flex gap-1 p-1 rounded-xl w-fit mb-6" style={{ background: '#F0F0F0' }}>
                    {(['profile', 'account'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSettingsTab(tab)}
                        className="px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                        style={settingsTab === tab
                          ? { background: 'white', color: '#222222', fontWeight: 600, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                          : { color: '#717171' }
                        }
                      >
                        {tab === 'profile' ? 'Edit Profile' : 'Account Settings'}
                      </button>
                    ))}
                  </div>

                  {settingsTab === 'profile' && (
                    <div className="space-y-5">
                      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <h3 className="font-semibold text-[#222222] mb-4">Profile Photo</h3>
                        <div className="flex items-center gap-5">
                          <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-2xl" style={{ background: '#FF385C' }}>
                              {(avatarUrl || user?.avatar)
                                ? <img src={avatarUrl || user?.avatar} className="w-full h-full object-cover" />
                                : initials}
                            </div>
                            <button
                              onClick={() => avatarRef.current?.click()}
                              className="absolute bottom-0 right-0 w-7 h-7 bg-[#FF385C] rounded-full flex items-center justify-center border-2 border-white shadow"
                            >
                              <Camera className="w-3.5 h-3.5 text-white" />
                            </button>
                            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#222222]">Change your avatar</p>
                            <p className="text-xs text-[#717171] mt-0.5">JPG or PNG. Max size 5 MB.</p>
                            <button onClick={() => avatarRef.current?.click()} className="mt-2 text-xs text-[#FF385C] font-semibold hover:underline">
                              Upload new photo
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <h3 className="font-semibold text-[#222222] mb-5">Personal Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-[#222222] mb-1.5">Full Name <span className="text-[#FF385C]">*</span></label>
                            <input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Your full name" className={inputClass} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#222222] mb-1.5">Email Address <span className="text-[#FF385C]">*</span></label>
                            <input type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} placeholder="your@email.com" className={inputClass} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#222222] mb-1.5">Phone Number</label>
                            <input value={profilePhone} onChange={e => setProfilePhone(e.target.value)} placeholder="+250 7XX XXX XXX" className={inputClass} />
                          </div>
                        </div>
                        <div className="mb-5">
                          <label className="block text-sm font-medium text-[#222222] mb-1.5">Bio</label>
                          <textarea
                            value={profileDesc}
                            onChange={e => setProfileDesc(e.target.value.slice(0, 400))}
                            placeholder="Tell hosts a little about yourself…"
                            rows={3}
                            className={`${inputClass} resize-y`}
                          />
                          <p className="text-xs text-[#717171] text-right mt-1">{profileDesc.length}/400</p>
                        </div>
                        <button onClick={handleSaveProfile} className="bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'account' && (
                    <div className="space-y-5">
                      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <h3 className="font-semibold text-[#222222] mb-5">Change Password</h3>
                        <div className="space-y-4 max-w-md">
                          {[
                            { key: 'current', label: 'Current Password', val: currentPwd, set: setCurrentPwd },
                            { key: 'new',     label: 'New Password',     val: newPwd,     set: setNewPwd },
                            { key: 'confirm', label: 'Confirm New Password', val: confirmPwd, set: setConfirmPwd },
                          ].map(field => (
                            <div key={field.key} className="relative">
                              <label className="block text-sm font-medium text-[#222222] mb-1.5">{field.label}</label>
                              <input
                                type={showPwd[field.key] ? 'text' : 'password'}
                                value={field.val}
                                onChange={e => field.set(e.target.value)}
                                placeholder="••••••••"
                                className={`${inputClass} pr-10`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPwd(p => ({ ...p, [field.key]: !p[field.key] }))}
                                className="absolute right-3 top-9 text-[#717171]"
                              >
                                {showPwd[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          ))}
                          <button onClick={handleChangePassword} className="bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                            Update Password
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
                        <h3 className="font-semibold text-[#222222] mb-5">Notification Preferences</h3>
                        <div className="space-y-4">
                          {[
                            { key: 'email', label: 'Email notifications', sub: 'Booking confirmations and updates', val: notifEmail, set: setNotifEmail },
                            { key: 'sms',   label: 'SMS notifications',   sub: 'Important alerts via text message', val: notifSms,   set: setNotifSms },
                            { key: 'push',  label: 'Push notifications',  sub: 'Real-time browser notifications',  val: notifPush,  set: setNotifPush },
                          ].map(item => (
                            <div key={item.key} className="flex items-center justify-between py-2 border-b border-[#F5F5F5] last:border-b-0">
                              <div>
                                <p className="text-sm font-medium text-[#222222]">{item.label}</p>
                                <p className="text-xs text-[#717171] mt-0.5">{item.sub}</p>
                              </div>
                              <button
                                onClick={() => item.set(!item.val)}
                                className="relative w-11 h-6 rounded-full transition-colors shrink-0"
                                style={{ background: item.val ? '#FF385C' : '#DDDDDD' }}
                              >
                                <div
                                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
                                  style={{ transform: item.val ? 'translateX(22px)' : 'translateX(4px)' }}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl border border-red-100 p-6">
                        <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-sm text-[#717171] mb-4">
                          Once you delete your account, all data will be permanently removed and cannot be recovered.
                        </p>
                        <button
                          onClick={() => toast.error('Account deletion requires admin confirmation. Contact support.')}
                          className="px-5 py-2.5 border border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right aside — Quick Actions only */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4">
                <p className="text-xs text-[#717171] mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setActive('trips')}         className="px-3 py-2 rounded-xl bg-[#F5F5F5] text-sm text-[#222222] hover:bg-[#EBEBEB] transition-colors">My Trips</button>
                  <button onClick={() => setActive('wishlist')}      className="px-3 py-2 rounded-xl bg-[#F5F5F5] text-sm text-[#222222] hover:bg-[#EBEBEB] transition-colors">Wishlist</button>
                  <button onClick={() => navigate('/listings')}      className="px-3 py-2 rounded-xl bg-[#F5F5F5] text-sm text-[#222222] hover:bg-[#EBEBEB] transition-colors">Explore</button>
                  <button onClick={() => setActive('notifications')} className="px-3 py-2 rounded-xl bg-[#F5F5F5] text-sm text-[#222222] hover:bg-[#EBEBEB] transition-colors">Notifications</button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* ── Pay Modal ── */}
      {payingBookingId && payingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {paySuccess ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-[#222222]" style={{ fontFamily: "'Poppins', sans-serif" }}>Payment Successful!</p>
                <p className="text-sm text-[#717171] mt-2">Your payment of <strong>${payingBooking.total}</strong> has been processed.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
                  <p className="font-bold text-[#222222]" style={{ fontFamily: "'Poppins', sans-serif" }}>Complete Payment</p>
                  <button onClick={() => setPayingBookingId(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F5F5F5] text-[#717171] text-lg">✕</button>
                </div>

                <div className="px-6 py-5 space-y-5">
                  {/* Booking summary */}
                  <div className="flex gap-4 p-4 bg-[#FAFAFA] rounded-xl border border-[#EBEBEB]">
                    <img src={payingBooking.propertyImage} className="w-16 h-14 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#222222] truncate">{payingBooking.propertyTitle}</p>
                      <p className="text-xs text-[#717171] mt-0.5">{payingBooking.checkIn} → {payingBooking.checkOut}</p>
                      <p className="text-xs text-[#717171]">{payingBooking.nights} nights</p>
                    </div>
                    <div className="ml-auto text-right shrink-0">
                      <p className="font-bold text-[#222222]">${payingBooking.total}</p>
                    </div>
                  </div>

                  {/* Card selector */}
                  <div>
                    <p className="text-sm font-semibold text-[#222222] mb-3">Pay with</p>
                    {savedCards.length === 0 ? (
                      <p className="text-sm text-[#717171]">No saved cards. <button onClick={() => { setPayingBookingId(null); setPayTab('methods'); setActive('payments'); }} className="text-[#FF385C] font-semibold hover:underline">Add a card</button></p>
                    ) : (
                      <div className="space-y-2">
                        {savedCards.map(card => (
                          <button
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            className="flex items-center gap-3 w-full p-3 rounded-xl border transition-colors text-left"
                            style={selectedCardId === card.id ? { borderColor: '#FF385C', background: '#FFF5F6' } : { borderColor: '#EBEBEB' }}
                          >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${selectedCardId === card.id ? 'bg-[#FF385C]' : 'bg-[#F0F0F0]'}`}>
                              <CreditCard className={`w-4 h-4 ${selectedCardId === card.id ? 'text-white' : 'text-[#717171]'}`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[#222222]">{card.brand} •••• {card.last4}</p>
                              <p className="text-xs text-[#717171]">Expires {card.expiry}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 transition-colors ${selectedCardId === card.id ? 'border-[#FF385C] bg-[#FF385C]' : 'border-[#DDDDDD]'}`} />
                          </button>
                        ))}
                        <button
                          onClick={() => { setPayingBookingId(null); setPayTab('methods'); setActive('payments'); setShowAddCard(true); }}
                          className="flex items-center gap-2 w-full p-3 rounded-xl border border-dashed border-[#DDDDDD] text-[#717171] hover:border-[#FF385C] hover:text-[#FF385C] transition-colors text-sm"
                        >
                          <span className="text-lg leading-none">+</span> Add new card
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Total + confirm */}
                  <div className="border-t border-[#EBEBEB] pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-[#717171]">Total amount</p>
                      <p className="text-xl font-bold text-[#222222]" style={{ fontFamily: "'Poppins', sans-serif" }}>${payingBooking.total}</p>
                    </div>
                    <button
                      onClick={confirmPay}
                      disabled={!selectedCardId}
                      className="w-full bg-[#FF385C] hover:bg-[#E31C5F] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors"
                    >
                      Confirm & Pay ${payingBooking.total}
                    </button>
                    <p className="text-center text-xs text-[#AAAAAA] mt-2">Your payment is secured and encrypted.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
