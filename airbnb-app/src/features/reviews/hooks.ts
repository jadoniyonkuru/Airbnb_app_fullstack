import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reviews } from '../../data/mockData';
import { queryKeys } from '../../api/queryKeys';
import type { Review } from './types';

export function useListingReviews(listingId: string) {
  return useQuery({
    queryKey: queryKeys.listingReviews(listingId),
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return { data: reviews.filter(r => r.propertyId === listingId) };
    },
    select: (data) => data.data ?? [],
    enabled: !!listingId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateReview(listingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      await new Promise(r => setTimeout(r, 300));
      const newReview = {
        id: `R${Date.now()}`,
        propertyId: listingId,
        rating: data.rating,
        comment: data.comment,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      return { data: newReview };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listingReviews(listingId) });
      qc.invalidateQueries({ queryKey: queryKeys.listing(listingId) });
      toast.success('Review submitted!');
    },
  });
}

export function useDeleteReview(listingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise(r => setTimeout(r, 200));
      return { success: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listingReviews(listingId) });
      toast.success('Review deleted.');
    },
  });
}