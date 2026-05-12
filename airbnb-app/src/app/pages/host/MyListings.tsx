import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Star, Eye, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { hostListings } from '../../../data/mockData';
import { ConfirmModal } from '../../components/shared/ConfirmModal';

import img0 from '../../../imports/image.png';
import img1 from '../../../imports/image-1.png';
import img2 from '../../../imports/image-2.png';
import img3 from '../../../imports/image-3.png';
import img4 from '../../../imports/image-4.png';

const imgs = [img0, img1, img2, img3, img4];

export function MyListings() {
  const [statuses, setStatuses] = useState<Record<string, boolean>>({
    HL1: true, HL2: true, HL3: false
  });
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);
  const toggle = (id: string) => setStatuses(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>My Listings</h1>
          <p className="text-[#717171] text-sm">{hostListings.length} active properties</p>
        </div>
        <Link to="/dashboard/add-listing" className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hostListings.map((listing, idx) => (
          <div key={listing.id} className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden hover:shadow-lg transition-all">
            <div className="relative">
              <img src={imgs[idx % imgs.length] as string} alt={listing.title} className="w-full h-48 object-cover" />
              <div className="absolute top-3 left-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statuses[listing.id] ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {statuses[listing.id] ? '● Active' : '○ Inactive'}
                </span>
              </div>
              <button onClick={() => toggle(listing.id)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors" style={{ color: statuses[listing.id] ? '#00A699' : '#AAAAAA' }}>
                {statuses[listing.id] ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-[#222222] font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{listing.title}</h3>
              <div className="flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#717171]" />
                <span className="text-[#717171] text-xs">{listing.location}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-xl" style={{ background: '#F7F7F7' }}>
                  <p className="text-[#222222] font-bold text-sm">${listing.price}</p>
                  <p className="text-[#717171] text-xs">/night</p>
                </div>
                <div className="text-center p-2 rounded-xl" style={{ background: '#F7F7F7' }}>
                  <p className="text-[#222222] font-bold text-sm">{listing.bookings}</p>
                  <p className="text-[#717171] text-xs">bookings</p>
                </div>
                <div className="text-center p-2 rounded-xl" style={{ background: '#F7F7F7' }}>
                  <div className="flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <p className="text-[#222222] font-bold text-sm">{listing.rating}</p>
                  </div>
                  <p className="text-[#717171] text-xs">rating</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-[#717171] mb-1">
                  <span>Occupancy</span>
                  <span className="font-semibold text-[#222222]">{listing.occupancyRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: '#F0F0F0' }}>
                  <div className="h-2 rounded-full bg-[#FF385C]" style={{ width: `${listing.occupancyRate}%` }} />
                </div>
              </div>

              <div className="border-t border-[#EBEBEB] pt-4 flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] py-2.5 rounded-xl text-xs font-semibold transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] py-2.5 rounded-xl text-xs font-semibold transition-colors">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors"
                  onClick={() => setDeleteModal({ id: listing.id, title: listing.title })}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <Link to="/dashboard/add-listing" className="border-2 border-dashed border-[#DDDDDD] rounded-2xl flex flex-col items-center justify-center p-8 hover:border-[#FF385C] hover:bg-[#FFF8F9] transition-all group min-h-72">
          <div className="w-14 h-14 bg-[#FFF1F3] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#FFE4E8] transition-colors">
            <Plus className="w-7 h-7 text-[#FF385C]" />
          </div>
          <p className="text-[#222222] font-semibold text-sm mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Add New Property</p>
          <p className="text-[#717171] text-xs text-center">List a new property and start earning from bookings.</p>
        </Link>
      </div>

      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => {
          toast.success(`${deleteModal?.title} has been deleted`);
          setDeleteModal(null);
        }}
        title="Delete Property"
        message={`Are you sure you want to delete "${deleteModal?.title}"? This action cannot be undone and all booking history will be lost.`}
        confirmText="Delete"
        cancelText="Keep property"
        type="danger"
      />
    </div>
  );
}
