import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useAiSearch() {
  return useMutation({
    mutationFn: async (payload: { query: string; page?: number; limit?: number }) => {
      const res = await apiClient.post(ENDPOINTS.AI_SEARCH, payload);
      return res.data;
    }
  });
}

export function useAiChat() {
  return useMutation({
    mutationFn: async (payload: { sessionId: string; message: string; listingId?: string }) => {
      const res = await apiClient.post(ENDPOINTS.AI_CHAT, payload);
      return res.data;
    }
  });
}

export function useGenerateDescription(listingId: string) {
  return useMutation({
    mutationFn: async (payload: { tone?: 'professional' | 'casual' | 'luxury' }) => {
      const res = await apiClient.post(ENDPOINTS.AI_GENERATE_DESC(listingId), payload);
      return res.data;
    }
  });
}

export function useRecommend() {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(ENDPOINTS.AI_RECOMMENDATIONS);
      return res.data;
    }
  });
}

export function useReviewSummary(listingId?: string) {
  return useQuery({
    queryKey: ['ai', 'reviewSummary', listingId],
    queryFn: async () => {
      if (!listingId) return null;
      const res = await apiClient.get(ENDPOINTS.AI_REVIEW_SUMMARY(listingId));
      return res.data;
    },
    enabled: !!listingId,
  });
}

export default {};
