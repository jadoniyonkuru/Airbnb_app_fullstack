import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { users } from '../../data/mockData';
import { queryKeys } from '../../api/queryKeys';

// Mock admin API
const mockAdminApi = {
  getHostRequests: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const hostRequests = users.filter(u => u.role === 'host').slice(0, 3).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      status: 'PENDING',
      createdAt: u.joined,
    }));
    return { success: true, data: hostRequests };
  },

  approveHost: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true, message: 'Host approved' };
  },

  rejectHost: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true, message: 'Host rejected' };
  },
};

export function useHostRequests() {
  return useQuery({
    queryKey: queryKeys.hostRequests,
    queryFn: () => mockAdminApi.getHostRequests(),
    select: (data) => data.data ?? [],
    staleTime: 1000 * 60,
  });
}

export function useApproveHost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockAdminApi.approveHost(id),
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
    mutationFn: (id: string) => mockAdminApi.rejectHost(id),
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
