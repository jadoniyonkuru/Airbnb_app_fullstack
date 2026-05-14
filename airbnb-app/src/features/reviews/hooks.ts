import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';
import type { Review } from './types';

export function useListingReviews(listingId: string) {
  return useQuery({
    queryKey: queryKeys.listingReviews(listingId),
    queryFn: () => apiClient.get(ENDPOINTS.LISTING_REVIEWS(listingId)),
    select: (data) => data.data?.data ?? [],
    enabled: !!listingId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateReview(listingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { rating: number; comment: string }) =>
      apiClient.post(ENDPOINTS.LISTING_REVIEWS(listingId), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listingReviews(listingId) });
      qc.invalidateQueries({ queryKey: queryKeys.listing(listingId) });
      toast.success('Review submitted!');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to submit review';
      toast.error(message);
    },
  });
}

export function useDeleteReview(listingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(ENDPOINTS.REVIEW(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listingReviews(listingId) });
      toast.success('Review deleted.');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to delete review';
      toast.error(message);
    },
  });
}

// Aggregated reviews across listings (for admin/home testimonials)
export function useAllReviews() {
  return useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: async () => {
      // Fetch listings first
      const listingsRes = await apiClient.get(ENDPOINTS.LISTINGS);
      const listings = listingsRes.data?.data ?? [];
      // Fetch reviews for each listing
      const reviewsPromises = listings.map((l: any) => apiClient.get(ENDPOINTS.LISTING_REVIEWS(l.id)));
      const reviewsRes = await Promise.all(reviewsPromises);
      const all = reviewsRes.flatMap(r => r.data?.data ?? []);
      return { data: all };
    },
    select: (data) => data.data ?? [],
    staleTime: 1000 * 60 * 5,
  });
}