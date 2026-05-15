import { useState } from 'react';
import { Sparkles, MapPin, DollarSign, RefreshCw, Loader2 } from 'lucide-react';
import { useRecommend } from '../../../features/ai/hooks';
import { Link } from 'react-router';

const FALLBACK = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=150&fit=crop';

export function AIRecommendations() {
  const [triggered, setTriggered] = useState(false);
  const mutation = useRecommend();

  const fetch = async () => {
    setTriggered(true);
    try { await mutation.mutateAsync(); } catch {}
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF385C] to-[#FC642D] rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-[#222222] font-semibold text-sm">AI Recommendations</h3>
            <p className="text-[#717171] text-xs">Personalized for you</p>
          </div>
        </div>
        <button
          onClick={fetch}
          disabled={mutation.isPending}
          className="flex items-center gap-1.5 text-xs text-[#FF385C] font-semibold hover:underline disabled:opacity-50"
        >
          {mutation.isPending
            ? <Loader2 className="w-3 h-3 animate-spin" />
            : <RefreshCw className="w-3 h-3" />}
          Refresh
        </button>
      </div>

      {!triggered && !mutation.data && (
        <div className="py-4 text-center">
          <p className="text-[#AAAAAA] text-xs mb-3">Click Refresh to get recommendations based on your booking history.</p>
          <button
            onClick={fetch}
            className="px-4 py-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Get Recommendations
          </button>
        </div>
      )}

      {mutation.isPending && (
        <div className="py-6 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF385C]" />
          <span className="text-[#717171] text-sm">Analyzing your preferences...</span>
        </div>
      )}

      {mutation.isError && (
        <p className="text-red-500 text-xs py-2">Could not load recommendations. Do you have any bookings?</p>
      )}

      {mutation.data && (
        <div className="space-y-3">
          {mutation.data.preferences && (
            <div className="p-3 rounded-xl bg-[#FFF1F3] border border-[#FFD6DD]">
              <p className="text-[#222222] text-xs font-semibold mb-0.5">Your preferences</p>
              <p className="text-[#717171] text-xs">{mutation.data.preferences}</p>
            </div>
          )}
          {(mutation.data.recommendations ?? []).map((r: any) => (
            <Link
              key={r.id}
              to={`/property/${r.id}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F7F7] transition-colors border border-[#EBEBEB]"
            >
              <img
                src={r.photos?.[0]?.url ?? FALLBACK}
                alt={r.title}
                className="w-14 h-10 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[#222222] text-xs font-semibold truncate">{r.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-0.5 text-[#717171] text-xs">
                    <MapPin className="w-3 h-3" />{r.location}
                  </span>
                  <span className="flex items-center gap-0.5 text-[#FF385C] text-xs font-semibold">
                    <DollarSign className="w-3 h-3" />{r.pricePerNight}/night
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {(mutation.data.recommendations ?? []).length === 0 && (
            <p className="text-[#AAAAAA] text-xs text-center py-2">No matching recommendations found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AIRecommendations;
