import { bookings } from '../../../data/mockData';
import { MapPin, Calendar } from 'lucide-react';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';

const statusConfig: Record<string, { color: string; bg: string }> = {
  confirmed: { color: '#16a34a', bg: '#dcfce7' },
  pending:   { color: '#d97706', bg: '#fef3c7' },
  completed: { color: '#2563eb', bg: '#dbeafe' },
  cancelled: { color: '#dc2626', bg: '#fee2e2' },
};

export function HostBookings() {
  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(bookings, { defaultPerPage: 4 });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Reservations</h1>
        <p className="text-[#717171] text-sm">Manage all incoming bookings for your properties.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Bookings', value: '12', color: '#FF385C' },
          { label: 'Confirmed', value: '8', color: '#16a34a' },
          { label: 'Pending', value: '3', color: '#d97706' },
          { label: 'Total Revenue', value: '$8,420', color: '#2563eb' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>{s.value}</p>
            <p className="text-[#717171] text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4 mb-8">
        {paginatedItems.map(booking => {
          const status = statusConfig[booking.status] || statusConfig.pending;
          return (
            <div key={booking.id} className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                <img src={booking.propertyImage} alt="" className="w-full sm:w-28 h-24 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-[#222222] font-semibold">{booking.propertyTitle}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#717171]" />
                        <span className="text-[#717171] text-sm">{booking.location}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full self-start" style={{ color: status.color, background: status.bg }}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#717171] mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-xs font-bold">{booking.guestAvatar}</div>
                      <span className="text-[#222222] font-medium">{booking.guest}</span>
                    </div>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{booking.checkIn} → {booking.checkOut}</span>
                    <span>{booking.nights} nights</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#222222] font-bold">${booking.total}</span>
                    <div className="flex items-center gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button className="text-xs text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg font-semibold transition-colors">Accept</button>
                          <button className="text-xs text-white bg-red-400 hover:bg-red-500 px-3 py-1.5 rounded-lg font-semibold transition-colors">Decline</button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button className="text-xs text-[#717171] hover:text-red-500 transition-colors">Cancel</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pagination ── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={perPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onPerPageChange}
        perPageOptions={[3, 4, 6]}
        itemLabel="reservations"
        className="border-t border-[#EBEBEB] pt-6"
      />
    </div>
  );
}
