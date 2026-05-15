import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import type { UserConversation, UserMessage } from './types';

export function useConversations() {
  return useQuery<UserConversation[]>({
    queryKey: ['messages', 'conversations'],
    queryFn: async () => {
      const res = await apiClient.get(ENDPOINTS.MESSAGES);
      return res.data?.data ?? [];
    },
    staleTime: 1000 * 30,
  });
}

export function useConversation(id: string) {
  return useQuery<UserConversation>({
    queryKey: ['messages', 'conversation', id],
    queryFn: async () => {
      const res = await apiClient.get(ENDPOINTS.MESSAGE_CONVERSATION(id));
      return res.data?.data;
    },
    enabled: !!id,
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 15,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { recipientId: string; listingId?: string }) => {
      const res = await apiClient.post(ENDPOINTS.MESSAGES, payload);
      return res.data?.data as UserConversation;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages', 'conversations'] });
    },
  });
}

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await apiClient.post(ENDPOINTS.MESSAGE_CONVERSATION(conversationId), { content });
      return res.data?.data as UserMessage;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages', 'conversation', conversationId] });
      qc.invalidateQueries({ queryKey: ['messages', 'conversations'] });
    },
  });
}
