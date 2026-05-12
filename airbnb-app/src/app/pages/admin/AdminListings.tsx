import { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';
import { properties } from '../../../data/mockData';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';
import { ConfirmModal } from '../../components/shared/ConfirmModal';

export function AdminListings() {
  const [search, setSearch] = useState('');
  const [listingStatuses, setListingStatuses] = useState<Record<string, 'approved' | 'pending' | 'rejected'>>({
    '1': 'approved', '2': 'approved', '3': 'approved', '4': 'pending', '5': 'approved', '6': 'pending', '7': 'rejected', '8': 'pending'
  });
  const [actionModal, setActionModal] = useState<{ id: string; title: string; action: 'approve' | 'reject' } | null>(null);

  const approve = (id: string) => {
    setListingStatuses(prev => ({ ...prev, [id]: 'approved' }));
    toast.success('Listing approved successfully');
  };
  const reject  = (id: string) => {
    setListingStatuses(prev => ({ ...prev, [id]: 'rejected' }));
    toast.success('Listing rejected');
  };

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
  );

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(filtered, { defaultPerPage: 4 });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Listings Moderation</h1>
          <p className="text-[#717171] text-sm">Review and approve property listings on the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-600">3 Pending Review</span>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAAAAA]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDDDDD] text-sm outline-none focus:border-[#FF385C] transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {paginatedItems.map(property => {
          const status = listingStatuses[property.id] || 'pending';
          return (
            <div key={property.id} className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={property.image} alt={property.title} className="w-full h-44 object-cover" />
                <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  status === 'approved' ? 'bg-green-500 text-white' :
                  status === 'pending'  ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {status}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-[#222222] font-semibold text-sm mb-1 line-clamp-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{property.title}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#717171]" />
                  <span className="text-[#717171] text-xs">{property.location}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-[#222222]">{property.rating}</span>
                    <span className="text-xs text-[#717171]">({property.reviews})</span>
                  </div>
                  <span className="text-[#222222] font-bold text-sm">${property.price}/night</span>
                </div>
                <p className="text-[#717171] text-xs mb-4 line-clamp-2">{property.description}</p>
                <div className="flex items-center gap-2">
                  {status !== 'approved' && (
                    <button
                      onClick={() => setActionModal({ id: property.id, title: property.title, action: 'approve' })}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {status !== 'rejected' && (
                    <button
                      onClick={() => setActionModal({ id: property.id, title: property.title, action: 'reject' })}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}
                  {status === 'approved' && (
                    <button className="flex-1 flex items-center justify-center gap-1.5 border border-[#DDDDDD] hover:bg-[#F7F7F7] text-[#717171] py-2.5 rounded-xl text-xs font-medium transition-colors">
                      <Eye className="w-3.5 h-3.5" /> View Live
                    </button>
                  )}
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
        perPageOptions={[4, 6, 9]}
        itemLabel="listings"
        className="border-t border-[#EBEBEB] pt-6"
      />

      <ConfirmModal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={() => {
          if (actionModal?.action === 'approve') {
            approve(actionModal.id);
          } else {
            reject(actionModal!.id);
          }
          setActionModal(null);
        }}
        title={actionModal?.action === 'approve' ? 'Approve Listing' : 'Reject Listing'}
        message={
          actionModal?.action === 'approve'
            ? `Approve "${actionModal?.title}"? It will be visible to all guests and available for booking.`
            : `Reject "${actionModal?.title}"? The host will be notified and the listing will not be published.`
        }
        confirmText={actionModal?.action === 'approve' ? 'Approve' : 'Reject'}
        cancelText="Cancel"
        type={actionModal?.action === 'approve' ? 'info' : 'danger'}
      />
    </div>
  );
}
