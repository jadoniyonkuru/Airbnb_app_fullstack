import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';
import { parseApiError } from '../../api/errorHandler';

const adminApi = {
  getHostRequests: () => apiClient.get(ENDPOINTS.HOST_REQUESTS).then(r => r.data),
  approveHost: (id: string) => apiClient.patch(ENDPOINTS.APPROVE_HOST(id)).then(r => r.data),
  rejectHost: (id: string) => apiClient.patch(ENDPOINTS.REJECT_HOST(id)).then(r => r.data),
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
    onError: (err) => toast.error(parseApiError(err).message),
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
    onError: (err) => toast.error(parseApiError(err).message),
  });
}
