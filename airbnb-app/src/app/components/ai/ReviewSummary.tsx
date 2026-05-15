import { Sparkles, ThumbsUp, ThumbsDown, Star, Loader2 } from 'lucide-react';
import { useReviewSummary } from '../../../features/ai/hooks';

export function ReviewSummary({ listingId }: { listingId?: string }) {
  const { data, isLoading, isError } = useReviewSummary(listingId);

  if (!listingId) return null;
  if (isLoading) return (
    <div className="p-4 bg-white rounded-2xl border border-[#EBEBEB] flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin text-[#FF385C]" />
      <span className="text-[#717171] text-sm">Generating AI review summary...</span>
    </div>
  );
  if (isError || !data) return null;

  return (
    <div className="p-5 bg-white rounded-2xl border border-[#EBEBEB]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-gradient-to-br from-[#FF385C] to-[#FC642D] rounded-xl flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-[#222222] font-semibold text-sm">AI Review Summary</h4>
        <div className="ml-auto flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" />
          <span className="text-sm font-bold text-[#FF385C]">{data.averageRating}</span>
          <span className="text-xs text-[#717171]">({data.totalReviews} reviews)</span>
        </div>
      </div>

      <p className="text-[#484848] text-sm leading-relaxed mb-4">{data.summary}</p>

      <div className="grid grid-cols-2 gap-3">
        {data.positives?.length > 0 && (
          <div className="p-3 bg-green-50 rounded-xl">
            <div className="flex items-center gap-1.5 mb-2">
              <ThumbsUp className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700 text-xs font-semibold">Guests love</span>
            </div>
            <ul className="space-y-1">
              {data.positives.slice(0, 3).map((p: string, i: number) => (
                <li key={i} className="text-green-700 text-xs">· {p}</li>
              ))}
            </ul>
          </div>
        )}
        {data.negatives?.length > 0 && (
          <div className="p-3 bg-orange-50 rounded-xl">
            <div className="flex items-center gap-1.5 mb-2">
              <ThumbsDown className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-orange-700 text-xs font-semibold">Areas to note</span>
            </div>
            <ul className="space-y-1">
              {data.negatives.slice(0, 3).map((n: string, i: number) => (
                <li key={i} className="text-orange-700 text-xs">· {n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewSummary;
