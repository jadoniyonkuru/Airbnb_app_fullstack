import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';

const adminApi = {
  getHostRequests: async () => {
    const res = await apiClient.get(ENDPOINTS.HOST_REQUESTS);
    return res.data;
  },

  approveHost: async (id: string) => {
    const res = await apiClient.post(ENDPOINTS.APPROVE_HOST(id));
    return res.data;
  },

  rejectHost: async (id: string) => {
    const res = await apiClient.post(ENDPOINTS.REJECT_HOST(id));
    return res.data;
  },
};

export function useHostRequests() {
  return useQuery({
    queryKey: queryKeys.hostRequests,
    queryFn: () => adminApi.getHostRequests(),
    select: (data) => data.data ?? [],
    staleTime: 1000 * 60,
  });
}

export function useApproveHost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.approveHost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hostRequests });
      qc.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('Host approved.');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to approve host';
      toast.error(message);
    },
  });
}

export function useRejectHost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.rejectHost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hostRequests });
      qc.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('Host rejected.');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to reject host';
      toast.error(message);
    },
  });
}
