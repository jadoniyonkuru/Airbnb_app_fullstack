import { Star } from 'lucide-react';
import { useListingReviews } from '../../../features/reviews/hooks';
import type { Review } from '../../../features/reviews/types';

const BAR_COLORS = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];

function StarRow({ filled, size = 14 }: { filled: boolean; size?: number }) {
  return (
    <Star
      style={{ width: size, height: size }}
      className={filled ? 'fill-[#FF385C] text-[#FF385C]' : 'fill-[#EBEBEB] text-[#EBEBEB]'}
    />
  );
}

interface Props {
  listingId: string;
  rating: number;
  reviewCount: number;
}

export function VisitorReviews({ listingId, rating, reviewCount }: Props) {
  const { data: reviews = [], isLoading } = useListingReviews(listingId);

  const counts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter((r: Review) => Math.round(r.rating) === star).length,
  }));
  const maxCount = Math.max(...counts.map(c => c.count), 1);

  return (
    <div className="border-b border-[#EBEBEB] pb-8 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-[#FF385C] rounded-full" />
        <h3 className="text-[#222222] font-bold text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Visitor Reviews
        </h3>
      </div>

      {/* Average + breakdown */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8">
        {/* Average star */}
        <div className="flex flex-col items-center justify-center bg-[#FFF5F6] border border-[#FECDD3] rounded-2xl px-8 py-6 shrink-0">
          <Star className="w-10 h-10 text-[#FF385C] mb-2" strokeWidth={1.5} />
          <span className="text-4xl font-bold text-[#222222]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {rating.toFixed(1)}
          </span>
          <span className="text-[#717171] text-sm mt-1">{reviewCount} reviews</span>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 space-y-3">
          {counts.map(({ star, count }, idx) => {
            const pct = Math.round((count / maxCount) * 100);
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 w-20 shrink-0">
                  {[1, 2, 3, 4, 5].map(i => (
                    <StarRow key={i} filled={i <= star} size={13} />
                  ))}
                </div>
                <div className="flex-1 h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: BAR_COLORS[idx] }}
                  />
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white shrink-0 min-w-[28px] text-center"
                  style={{ background: BAR_COLORS[idx] }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review cards */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-24 bg-[#F0F0F0] rounded-2xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-[#717171] text-sm">No reviews yet for this property.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.map((review: Review) => (
            <div key={review.id} className="bg-white border border-[#EBEBEB] rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FF385C] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {review.user?.avatar
                      ? <img src={review.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      : (review.user?.name?.[0] ?? '?').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[#222222] font-semibold text-sm">— {review.user?.name ?? 'Guest'}</p>
                    <p className="text-[#717171] text-xs">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-[#FF385C] text-[#FF385C]" />
                  <span className="font-semibold text-[#222222]">{review.rating}</span>
                  <span className="text-[#717171]">/5</span>
                </div>
              </div>
              <p className="text-[#717171] text-sm leading-relaxed line-clamp-3">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
