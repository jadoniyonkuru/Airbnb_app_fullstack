import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';
import { parseApiError } from '../../api/errorHandler';
import type { ReviewsResponse, ReviewResponse, CreateReviewRequest } from './types';

const reviewsApi = {
  getByListing: (listingId: string) =>
    apiClient.get<ReviewsResponse>(ENDPOINTS.LISTING_REVIEWS(listingId)).then(r => r.data),

  create: (listingId: string, data: CreateReviewRequest) =>
    apiClient.post<ReviewResponse>(ENDPOINTS.LISTING_REVIEWS(listingId), data).then(r => r.data),

  update: (id: string, data: Partial<CreateReviewRequest>) =>
    apiClient.put<ReviewResponse>(ENDPOINTS.REVIEW(id), data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(ENDPOINTS.REVIEW(id)).then(r => r.data),
};

export function useListingReviews(listingId: string) {
  return useQuery({
    queryKey: queryKeys.listingReviews(listingId),
    queryFn: () => reviewsApi.getByListing(listingId),
    select: (data) => data.data ?? [],
    enabled: !!listingId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateReview(listingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewsApi.create(listingId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listingReviews(listingId) });
      qc.invalidateQueries({ queryKey: queryKeys.listing(listingId) });
      toast.success('Review submitted!');
    },
    onError: (err) => toast.error(parseApiError(err).message),
  });
}

export function useDeleteReview(listingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listingReviews(listingId) });
      toast.success('Review deleted.');
    },
    onError: (err) => toast.error(parseApiError(err).message),
  });
}
