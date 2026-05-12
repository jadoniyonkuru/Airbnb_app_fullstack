import { useState } from 'react';
import { Star, CheckCircle, XCircle, Flag } from 'lucide-react';
import { reviews } from '../../../data/mockData';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';

export function AdminReviews() {
  const [reviewStatuses, setReviewStatuses] = useState<Record<string, string>>(
    Object.fromEntries(reviews.map(r => [r.id, r.status]))
  );

  const approve = (id: string) => setReviewStatuses(prev => ({ ...prev, [id]: 'approved' }));
  const reject  = (id: string) => setReviewStatuses(prev => ({ ...prev, [id]: 'rejected' }));

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(reviews, { defaultPerPage: 4 });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Reviews Moderation</h1>
        <p className="text-[#717171] text-sm">Review and moderate guest feedback across all properties.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Reviews', value: '1,284', color: '#FF385C' },
          { label: 'Pending Review', value: '5', color: '#d97706' },
          { label: 'Avg Rating', value: '4.8★', color: '#16a34a' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <p className="text-2xl font-bold mb-1" style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
            <p className="text-[#717171] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {paginatedItems.map(review => {
          const status = reviewStatuses[review.id] || 'pending';
          return (
            <div key={review.id} className="bg-white rounded-2xl border border-[#EBEBEB] p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {review.guestAvatar}
                  </div>
                  <div>
                    <p className="text-[#222222] font-semibold text-sm">{review.guest}</p>
                    <p className="text-[#717171] text-xs">{review.property}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                  background: status === 'approved' ? '#dcfce7' : status === 'pending' ? '#fef3c7' : '#fee2e2',
                  color:      status === 'approved' ? '#16a34a' : status === 'pending' ? '#d97706' : '#dc2626'
                }}>
                  {status}
                </span>
              </div>

              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[#DDDDDD]'}`} />
                ))}
                <span className="text-[#717171] text-xs ml-2">{review.date}</span>
              </div>

              <p className="text-[#717171] text-sm leading-relaxed mb-5 italic">"{review.comment}"</p>

              <div className="flex items-center gap-2">
                {status !== 'approved' && (
                  <button onClick={() => approve(review.id)} className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 py-2.5 rounded-xl text-xs font-semibold transition-colors">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                )}
                {status !== 'rejected' && (
                  <button onClick={() => reject(review.id)} className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-xs font-semibold transition-colors">
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
                <button className="flex items-center justify-center gap-1.5 border border-[#DDDDDD] hover:bg-[#F7F7F7] text-[#717171] py-2.5 px-3 rounded-xl text-xs font-medium transition-colors">
                  <Flag className="w-3.5 h-3.5" /> Flag
                </button>
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
        perPageOptions={[4, 6, 8]}
        itemLabel="reviews"
        className="border-t border-[#EBEBEB] pt-6"
      />
    </div>
  );
}
