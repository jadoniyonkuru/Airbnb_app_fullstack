import React from 'react';
import { useReviewSummary } from '../../../features/ai/hooks';

export function ReviewSummary({ listingId }: { listingId?: string }) {
  const { data, isLoading, isError } = useReviewSummary(listingId);

  if (!listingId) return null;
  if (isLoading) return <div className="p-4">Loading review summary...</div>;
  if (isError) return <div className="p-4 text-red-500">Could not load summary</div>;
  if (!data) return null;

  return (
    <div className="p-4 bg-white rounded-2xl border border-[#EBEBEB]">
      <h4 className="text-sm font-medium mb-2">Review Summary</h4>
      <p className="text-sm text-[#222222] mb-2">{data.summary}</p>
      <div className="text-xs text-[#717171]">Average Rating: {data.averageRating} ({data.totalReviews} reviews)</div>
    </div>
  );
}

export default ReviewSummary;
