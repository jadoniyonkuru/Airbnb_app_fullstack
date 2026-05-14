import { useState } from 'react';
import { useRecommend } from '../../../features/ai/hooks';

export function AIRecommendations() {
  const [called, setCalled] = useState(false);
  const mutation = useRecommend();

  const handle = async () => {
    setCalled(true);
    try {
      await mutation.mutateAsync();
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl border border-[#EBEBEB]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Recommended for you</h3>
        <button onClick={handle} className="text-xs text-[#FF385C]">Refresh</button>
      </div>
      {mutation.isLoading && <p className="text-sm text-[#717171]">Loading recommendations...</p>}
      {mutation.isError && <p className="text-sm text-red-500">Could not load recommendations</p>}
      {mutation.data && (
        <ul className="space-y-2">
          {mutation.data.recommendations?.map((r: any) => (
            <li key={r.id} className="text-sm">{r.title} — {r.location} — ${r.pricePerNight}</li>
          ))}
        </ul>
      )}
      {!called && <p className="text-xs text-[#AAAAAA]">Click refresh to fetch recommendations based on your booking history.</p>}
    </div>
  );
}

export default AIRecommendations;
