import { useState } from 'react';
import { Link } from 'react-router';
import { MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { bookings } from '../../../data/mockData';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';
import { UserPageLayout } from '../../components/layout/UserPageLayout';
import { ConfirmModal } from '../../components/shared/ConfirmModal';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  confirmed: { color: '#16a34a', bg: '#dcfce7', label: 'Confirmed' },
  pending:   { color: '#d97706', bg: '#fef3c7', label: 'Pending' },
  completed: { color: '#2563eb', bg: '#dbeafe', label: 'Completed' },
  cancelled: { color: '#dc2626', bg: '#fee2e2', label: 'Cancelled' },
};

export function UserBookings() {
  const [cancelModal, setCancelModal] = useState<{ id: string; title: string } | null>(null);
  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(bookings, { defaultPerPage: 4 });

  return (
    <UserPageLayout title="My Bookings" breadcrumb="My Bookings">
      <p className="text-[#717171] text-sm -mt-4 mb-8">Manage all your reservations in one place.</p>

      <div className="space-y-4 mb-8">
        {paginatedItems.map(booking => {
          const status = statusConfig[booking.status] || statusConfig.pending;
          return (
            <div key={booking.id} className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                <img src={booking.propertyImage} alt={booking.propertyTitle} className="w-full sm:w-32 h-32 sm:h-24 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <p className="text-[#222222] font-semibold">{booking.propertyTitle}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#717171]" />
                        <span className="text-[#717171] text-sm">{booking.location}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full self-start" style={{ color: status.color, background: status.bg }}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#717171] mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.checkIn} → {booking.checkOut}</span>
                    </div>
                    <span>• {booking.nights} nights</span>
                    <span className="text-[#222222] font-bold">Total: ${booking.total}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link to={`/property/${booking.propertyId}`} className="text-[#FF385C] text-sm font-medium hover:underline">View Property</Link>
                    {booking.status === 'completed' && (
                      <button className="text-[#717171] text-sm hover:text-[#222222] transition-colors">Write Review</button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => setCancelModal({ id: booking.id, title: booking.propertyTitle })}
                        className="text-sm text-[#717171] hover:text-red-500 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
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
        itemLabel="bookings"
        className="border-t border-[#EBEBEB] pt-6"
      />

      <ConfirmModal
        isOpen={!!cancelModal}
        onClose={() => setCancelModal(null)}
        onConfirm={() => {
          toast.success(`Booking for ${cancelModal?.title} has been cancelled`);
          setCancelModal(null);
        }}
        title="Cancel Booking"
        message={`Are you sure you want to cancel your booking at "${cancelModal?.title}"? You may be charged a cancellation fee depending on the property's policy.`}
        confirmText="Cancel booking"
        cancelText="Keep booking"
        type="danger"
      />
    </UserPageLayout>
  );
}
