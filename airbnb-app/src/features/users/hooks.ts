import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  bio?: string;
  username?: string;
}

const usersApi = {
  getAll: async () => {
    const res = await apiClient.get(ENDPOINTS.USERS);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get(ENDPOINTS.USER(id));
    return res.data;
  },

  update: async (id: string, data: UpdateUserRequest) => {
    const res = await apiClient.put(ENDPOINTS.USER(id), data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(ENDPOINTS.USER(id));
    return res.data;
  },

  getStats: async () => {
    const res = await apiClient.get(ENDPOINTS.USER_STATS);
    return res.data;
  },
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
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(message);
    },
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
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      toast.error(message);
    },
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
