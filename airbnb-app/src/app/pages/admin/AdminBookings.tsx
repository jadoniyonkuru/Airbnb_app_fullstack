import { useState } from 'react';
import {
  Search, Calendar, X, CheckCircle2, XCircle,
  MapPin, Clock, CreditCard, Eye,
  AlertTriangle,
} from 'lucide-react';
import { bookings as initialBookings } from '../../../data/mockData';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  guest: string;
  guestAvatar: string;
  propertyTitle: string;
  propertyImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  status: BookingStatus;
  [key: string]: any;
}

const STATUS: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmed', color: '#15803d', bg: '#F0FDF4' },
  pending:   { label: 'Pending',   color: '#d97706', bg: '#FFFBEB' },
  completed: { label: 'Completed', color: '#2563eb', bg: '#EFF6FF' },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#FFF1F2' },
};

/* ─── Overlay backdrop ───────────────────────────────────────────────── */
function Backdrop({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={onClose}
    />
  );
}

/* ─── View Booking Modal ─────────────────────────────────────────────── */
function ViewModal({
  booking,
  onClose,
  onConfirm,
  onCancel,
}: {
  booking: Booking;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const s = STATUS[booking.status];
  const canConfirm = booking.status === 'pending';
  const canCancel  = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <>
      <Backdrop onClose={onClose} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          style={{ fontFamily: "'Inter', sans-serif" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
            <div>
              <h2 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E', fontSize: '1rem' }}>
                Booking Details
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#AAAAAA' }}>ID: {booking.id}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center transition-colors">
              <X className="w-4 h-4" style={{ color: '#717171' }} />
            </button>
          </div>

          {/* Property banner */}
          <div className="relative h-36 overflow-hidden">
            <img src={booking.propertyImage} alt={booking.propertyTitle} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{booking.propertyTitle}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-white/70" />
                  <p className="text-white/70 text-xs">Listed property</p>
                </div>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: s.bg, color: s.color }}
              >
                {s.label}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">

            {/* Guest */}
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F7F7F7' }}>
              <div className="w-9 h-9 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                {booking.guestAvatar}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1C1C1E' }}>{booking.guest}</p>
                <p className="text-xs" style={{ color: '#717171' }}>Guest</p>
              </div>
            </div>

            {/* Dates + Nights */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-[#EBEBEB]">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" style={{ color: '#AAAAAA' }} />
                  <span className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: '#AAAAAA' }}>Check-in</span>
                </div>
                <p className="font-semibold text-sm" style={{ color: '#1C1C1E' }}>{booking.checkIn}</p>
              </div>
              <div className="p-3 rounded-xl border border-[#EBEBEB]">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" style={{ color: '#AAAAAA' }} />
                  <span className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: '#AAAAAA' }}>Check-out</span>
                </div>
                <p className="font-semibold text-sm" style={{ color: '#1C1C1E' }}>{booking.checkOut}</p>
              </div>
              <div className="p-3 rounded-xl border border-[#EBEBEB]">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3" style={{ color: '#AAAAAA' }} />
                  <span className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: '#AAAAAA' }}>Nights</span>
                </div>
                <p className="font-semibold text-sm" style={{ color: '#1C1C1E' }}>{booking.nights}</p>
              </div>
            </div>

            {/* Payment breakdown */}
            <div className="rounded-xl border border-[#EBEBEB] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EBEBEB]">
                <CreditCard className="w-3.5 h-3.5" style={{ color: '#AAAAAA' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#AAAAAA' }}>Payment Summary</span>
              </div>
              <div className="px-4 py-3 space-y-2">
                {[
                  { label: `$${Math.round(booking.total / booking.nights)}/night × ${booking.nights} nights`, value: `$${booking.total - Math.round(booking.total * 0.14)}` },
                  { label: 'Service fee',    value: `$${Math.round(booking.total * 0.10)}` },
                  { label: 'Platform fee',   value: `$${Math.round(booking.total * 0.04)}` },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span style={{ color: '#717171' }}>{row.label}</span>
                    <span style={{ color: '#1C1C1E' }}>{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#EBEBEB]">
                  <span style={{ color: '#1C1C1E' }}>Total</span>
                  <span style={{ color: '#FF385C' }}>${booking.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-[#EBEBEB]">
            {canConfirm && (
              <button
                onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Booking
              </button>
            )}
            {canCancel && (
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 border border-[#EBEBEB] hover:border-red-300 hover:bg-[#FFF1F2] text-sm font-medium py-2.5 rounded-xl transition-colors"
                style={{ color: '#dc2626' }}
              >
                <XCircle className="w-4 h-4" /> Cancel Booking
              </button>
            )}
            {!canConfirm && !canCancel && (
              <button
                onClick={onClose}
                className="flex-1 border border-[#EBEBEB] hover:bg-[#F7F7F7] py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ color: '#717171' }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Cancel Confirmation Modal ──────────────────────────────────────── */
function CancelModal({
  booking,
  onClose,
  onConfirmCancel,
}: {
  booking: Booking;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');

  return (
    <>
      <Backdrop onClose={onClose} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-[#FFF1F2] flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" style={{ color: '#dc2626' }} />
            </div>

            <h2 className="font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E', fontSize: '1.05rem' }}>
              Cancel this booking?
            </h2>
            <p className="text-sm mb-1" style={{ color: '#717171' }}>
              You're about to cancel booking <span className="font-semibold" style={{ color: '#1C1C1E' }}>{booking.id}</span> for{' '}
              <span className="font-semibold" style={{ color: '#1C1C1E' }}>{booking.guest}</span>.
            </p>
            <p className="text-xs mb-5" style={{ color: '#AAAAAA' }}>
              This action cannot be undone. The guest will be notified automatically.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-semibold mb-2" style={{ color: '#717171' }}>
                Reason for cancellation <span style={{ color: '#AAAAAA' }}>(optional)</span>
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Guest no-show, property issue, admin override..."
                rows={3}
                className="w-full px-3.5 py-3 rounded-xl border border-[#DDDDDD] text-sm outline-none resize-none transition-colors"
                style={{ color: '#1C1C1E' }}
                onFocus={e => (e.target.style.borderColor = '#FF385C')}
                onBlur={e  => (e.target.style.borderColor = '#DDDDDD')}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-[#EBEBEB] hover:bg-[#F7F7F7] py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ color: '#717171' }}
              >
                Keep Booking
              </button>
              <button
                onClick={() => onConfirmCancel(reason)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: '#dc2626' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#b91c1c')}
                onMouseLeave={e => (e.currentTarget.style.background = '#dc2626')}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Toast notification ─────────────────────────────────────────────── */
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium"
      style={{
        background: type === 'success' ? '#1C1C1E' : '#dc2626',
        color: 'white',
        minWidth: 260,
      }}
    >
      {type === 'success'
        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
        : <XCircle className="w-4 h-4 shrink-0" />}
      {message}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────── */
export function AdminBookings() {
  const [bookingList, setBookingList] = useState<Booking[]>(initialBookings as Booking[]);
  const [search,        setSearch]        = useState('');
  const [filterStatus,  setFilterStatus]  = useState<BookingStatus | 'all'>('all');
  const [viewBooking,   setViewBooking]   = useState<Booking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [toast,         setToast]         = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const updateStatus = (id: string, status: BookingStatus) => {
    setBookingList(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleConfirm = (booking: Booking) => {
    updateStatus(booking.id, 'confirmed');
    setViewBooking(null);
    showToast(`Booking ${booking.id} confirmed successfully.`);
  };

  const handleCancel = (booking: Booking) => {
    setViewBooking(null);
    setCancelBooking(booking);
  };

  const handleConfirmCancel = (reason: string) => {
    if (!cancelBooking) return;
    updateStatus(cancelBooking.id, 'cancelled');
    setCancelBooking(null);
    showToast(`Booking ${cancelBooking.id} has been cancelled.`);
  };

  const filtered = bookingList.filter(b => {
    const matchSearch = b.guest.toLowerCase().includes(search.toLowerCase()) ||
      b.propertyTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(filtered, { defaultPerPage: 8 });

  const counts = {
    all:       bookingList.length,
    confirmed: bookingList.filter(b => b.status === 'confirmed').length,
    pending:   bookingList.filter(b => b.status === 'pending').length,
    completed: bookingList.filter(b => b.status === 'completed').length,
    cancelled: bookingList.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div className="mb-7">
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: '#1C1C1E' }}>
          Bookings Management
        </h1>
        <p className="text-sm mt-1" style={{ color: '#717171' }}>Monitor, confirm, and manage all platform bookings.</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {([
          { label: 'Total',     key: 'all',       color: '#FF385C' },
          { label: 'Confirmed', key: 'confirmed',  color: '#15803d' },
          { label: 'Pending',   key: 'pending',    color: '#d97706' },
          { label: 'Cancelled', key: 'cancelled',  color: '#dc2626' },
        ] as const).map(({ label, key, color }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className="text-left bg-white border rounded-2xl p-5 transition-all duration-150"
            style={{
              borderColor: filterStatus === key ? color : '#EBEBEB',
              boxShadow:   filterStatus === key ? `0 0 0 1px ${color}` : 'none',
            }}
          >
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.65rem', fontWeight: 700, color, lineHeight: 1 }}>
              {counts[key]}
            </p>
            <p className="text-sm font-medium mt-2" style={{ color: '#717171' }}>{label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#AAAAAA' }} />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); onPageChange(1); }}
          placeholder="Search by guest, property or ID…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDDDDD] text-sm outline-none transition-colors"
          style={{ color: '#1C1C1E' }}
          onFocus={e => (e.target.style.borderColor = '#FF385C')}
          onBlur={e  => (e.target.style.borderColor = '#DDDDDD')}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EBEBEB]">
                {['Booking ID', 'Guest', 'Property', 'Dates', 'Nights', 'Total', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: '#AAAAAA', background: 'white' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm" style={{ color: '#AAAAAA' }}>
                    No bookings match your search.
                  </td>
                </tr>
              )}
              {paginatedItems.map((booking: Booking) => {
                const s = STATUS[booking.status];
                return (
                  <tr key={booking.id} className="hover:bg-[#FFFAF9] transition-colors">
                    <td className="px-5 py-4 font-semibold text-sm" style={{ color: '#FF385C' }}>{booking.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {booking.guestAvatar}
                        </div>
                        <span className="font-semibold text-sm" style={{ color: '#1C1C1E' }}>{booking.guest}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <img src={booking.propertyImage} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <span className="text-sm truncate max-w-[130px]" style={{ color: '#484848' }}>
                          {booking.propertyTitle.split(' ').slice(0, 3).join(' ')}…
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: '#717171' }}>
                        <Calendar className="w-3.5 h-3.5" style={{ color: '#AAAAAA' }} />
                        {booking.checkIn} → {booking.checkOut}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium" style={{ color: '#484848' }}>{booking.nights}n</td>
                    <td className="px-5 py-4 text-sm font-bold" style={{ color: '#1C1C1E' }}>${booking.total}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => setViewBooking(booking)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EBEBEB] text-xs font-medium hover:border-[#FF385C] hover:bg-[#FFF1F3] transition-colors"
                          style={{ color: '#484848' }}
                        >
                          <Eye className="w-3.5 h-3.5" />View
                        </button>

                        {/* Confirm (pending only) */}
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleConfirm(booking)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors"
                            style={{ borderColor: '#15803d', color: '#15803d', background: '#F0FDF4' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#dcfce7'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#F0FDF4'; }}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />Confirm
                          </button>
                        )}

                        {/* Cancel (pending or confirmed) */}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => setCancelBooking(booking)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EBEBEB] text-xs font-medium hover:border-red-300 hover:bg-[#FFF1F2] transition-colors"
                            style={{ color: '#dc2626' }}
                          >
                            <XCircle className="w-3.5 h-3.5" />Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-5 border-t border-[#EBEBEB]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={perPage}
            onPageChange={onPageChange}
            onItemsPerPageChange={onPerPageChange}
            perPageOptions={[8, 12, 20]}
            itemLabel="bookings"
            showProgress={true}
          />
        </div>
      </div>

      {/* Modals */}
      {viewBooking && (
        <ViewModal
          booking={viewBooking}
          onClose={() => setViewBooking(null)}
          onConfirm={() => handleConfirm(viewBooking)}
          onCancel={() => handleCancel(viewBooking)}
        />
      )}

      {cancelBooking && (
        <CancelModal
          booking={cancelBooking}
          onClose={() => setCancelBooking(null)}
          onConfirmCancel={handleConfirmCancel}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
}