import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';
import { parseApiError } from '../../api/errorHandler';

const aiApi = {
  search: (query: string) =>
    apiClient.post(ENDPOINTS.AI_SEARCH, { query }).then(r => r.data),

  chat: (message: string, history?: { role: string; content: string }[]) =>
    apiClient.post(ENDPOINTS.AI_CHAT, { message, history }).then(r => r.data),

  getReviewSummary: (listingId: string) =>
    apiClient.get(ENDPOINTS.AI_REVIEW_SUMMARY(listingId)).then(r => r.data),

  generateDescription: (data: { title: string; type: string; amenities: string[]; location: string }) =>
    apiClient.post(ENDPOINTS.AI_GENERATE_DESC, data).then(r => r.data),

  getRecommendations: () =>
    apiClient.get(ENDPOINTS.AI_RECOMMENDATIONS).then(r => r.data),
};

export function useAISearch() {
  return useMutation({
    mutationFn: (query: string) => aiApi.search(query),
    onError: (err) => toast.error(parseApiError(err).message),
  });
}

export function useAIChat() {
  return useMutation({
    mutationFn: ({ message, history }: { message: string; history?: { role: string; content: string }[] }) =>
      aiApi.chat(message, history),
    onError: (err) => toast.error(parseApiError(err).message),
  });
}

export function useAIReviewSummary(listingId: string) {
  return useQuery({
    queryKey: queryKeys.aiReviewSummary(listingId),
    queryFn: () => aiApi.getReviewSummary(listingId),
    select: (data) => data.data,
    enabled: !!listingId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useAIRecommendations() {
  return useQuery({
    queryKey: queryKeys.aiRecommendations,
    queryFn: () => aiApi.getRecommendations(),
    select: (data) => data.data ?? [],
    staleTime: 1000 * 60 * 5,
  });
}

export function useGenerateDescription() {
  return useMutation({
    mutationFn: (data: { title: string; type: string; amenities: string[]; location: string }) =>
      aiApi.generateDescription(data),
    onError: (err) => toast.error(parseApiError(err).message),
  });
}
