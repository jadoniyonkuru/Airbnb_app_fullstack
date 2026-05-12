import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';
import { parseApiError } from '../../api/errorHandler';

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  bio?: string;
  username?: string;
}

const usersApi = {
  getAll: () => apiClient.get(ENDPOINTS.USERS).then(r => r.data),
  getById: (id: string) => apiClient.get(ENDPOINTS.USER(id)).then(r => r.data),
  update: (id: string, data: UpdateUserRequest) =>
    apiClient.put(ENDPOINTS.USER(id), data).then(r => r.data),
  delete: (id: string) => apiClient.delete(ENDPOINTS.USER(id)).then(r => r.data),
  getStats: () => apiClient.get(ENDPOINTS.USER_STATS).then(r => r.data),
};

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => usersApi.getAll(),
    select: (data) => data.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => usersApi.getById(id),
    select: (data) => data.data,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.update(id, data),
    onSuccess: (res, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.user(id) });
      // Update localStorage user
      const stored = localStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
      }
      toast.success('Profile updated.');
    },
    onError: (err) => toast.error(parseApiError(err).message),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('User deleted.');
    },
    onError: (err) => toast.error(parseApiError(err).message),
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: queryKeys.userStats,
    queryFn: () => usersApi.getStats(),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5,
  });
}
