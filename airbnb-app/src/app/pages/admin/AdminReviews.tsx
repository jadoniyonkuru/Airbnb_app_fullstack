import { Star, CheckCircle, XCircle, Flag, Trash2 } from 'lucide-react';
import { useAdminReviews, useUpdateReviewStatus, useDeleteAdminReview } from '../../../features/admin/hooks';
import { Pagination } from '../../components/shared/Pagination';
import { usePagination } from '../../components/shared/usePagination';

export function AdminReviews() {
  const { data: reviews = [], isLoading } = useAdminReviews();
  const updateStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteAdminReview();

  const totalReviews = (reviews as any[]).length;
  const pendingReviews = (reviews as any[]).filter((r: any) => r.status === 'PENDING').length;
  const avgRating = totalReviews > 0
    ? ((reviews as any[]).reduce((s: number, r: any) => s + r.rating, 0) / totalReviews).toFixed(1)
    : '—';

  const { currentPage, totalPages, perPage, paginatedItems, totalItems, onPageChange, onPerPageChange } =
    usePagination(reviews as any[], { defaultPerPage: 4 });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-[#222222] mb-1" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.75rem', fontWeight: 700 }}>Reviews Moderation</h1>
        <p className="text-[#717171] text-sm">Review and moderate guest feedback across all properties.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Reviews',  value: totalReviews,     color: '#FF385C' },
          { label: 'Pending Review', value: pendingReviews,   color: '#d97706' },
          { label: 'Avg Rating',     value: `${avgRating}★`, color: '#16a34a' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <p className="text-2xl font-bold mb-1" style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{isLoading ? '...' : stat.value}</p>
            <p className="text-[#717171] text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {isLoading
          ? [1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-[#EBEBEB] p-6 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F0F0F0] rounded-full" />
                  <div className="h-4 bg-[#F0F0F0] rounded w-32" />
                </div>
                <div className="h-3 bg-[#F0F0F0] rounded w-full" />
              </div>
            ))
          : paginatedItems.map((review: any) => {
              const status = (review.status ?? 'APPROVED').toLowerCase();
              return (
                <div key={review.id} className="bg-white rounded-2xl border border-[#EBEBEB] p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {review.user?.avatar
                        ? <img src={review.user.avatar} alt={review.user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        : <div className="w-10 h-10 bg-[#FF385C] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {review.user?.name?.charAt(0) ?? '?'}
                          </div>
                      }
                      <div>
                        <p className="text-[#222222] font-semibold text-sm">{review.user?.name ?? 'Unknown'}</p>
                        <p className="text-[#717171] text-xs">{review.listing?.title ?? '—'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                      background: status === 'approved' ? '#dcfce7' : status === 'pending' ? '#fef3c7' : status === 'flagged' ? '#fff7ed' : '#fee2e2',
                      color:      status === 'approved' ? '#16a34a' : status === 'pending' ? '#d97706' : status === 'flagged' ? '#ea580c' : '#dc2626'
                    }}>
                      {status}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[#DDDDDD]'}`} />
                    ))}
                    <span className="text-[#717171] text-xs ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-[#717171] text-sm leading-relaxed mb-5 italic">"{review.comment}"</p>

                  <div className="flex items-center gap-2">
                    {status !== 'approved' && (
                      <button onClick={() => updateStatus.mutate({ id: review.id, status: 'APPROVED' })}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 py-2.5 rounded-xl text-xs font-semibold transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    {status !== 'rejected' && (
                      <button onClick={() => updateStatus.mutate({ id: review.id, status: 'REJECTED' })}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-xs font-semibold transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                    {status !== 'flagged' && (
                      <button onClick={() => updateStatus.mutate({ id: review.id, status: 'FLAGGED' })}
                        className="flex items-center justify-center gap-1.5 border border-[#DDDDDD] hover:bg-[#F7F7F7] text-[#717171] py-2.5 px-3 rounded-xl text-xs font-medium transition-colors">
                        <Flag className="w-3.5 h-3.5" /> Flag
                      </button>
                    )}
                    <button onClick={() => deleteReview.mutate(review.id)}
                      className="flex items-center justify-center gap-1.5 border border-red-200 hover:bg-red-50 text-red-500 py-2.5 px-3 rounded-xl text-xs font-medium transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
      </div>

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
