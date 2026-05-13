import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { users } from '../../data/mockData';
import { queryKeys } from '../../api/queryKeys';

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  bio?: string;
  username?: string;
}

// Mock users API
const mockUsersApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      success: true,
      data: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username,
        phone: u.phone,
        role: u.role.toUpperCase(),
        status: u.status,
        avatar: null,
        bio: null,
        createdAt: u.joined,
      })),
    };
  },

  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    
    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        role: user.role.toUpperCase(),
        status: user.status,
        avatar: null,
        bio: null,
        createdAt: user.joined,
      },
    };
  },

  update: async (id: string, data: UpdateUserRequest) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    
    return {
      success: true,
      data: {
        id: user.id,
        name: data.name || user.name,
        email: user.email,
        username: data.username || user.username,
        phone: data.phone || user.phone,
        role: user.role.toUpperCase(),
        status: user.status,
        avatar: null,
        bio: data.bio || null,
        createdAt: user.joined,
      },
    };
  },

  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true, message: 'User deleted' };
  },

  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      success: true,
      data: {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        totalHosts: users.filter(u => u.role === 'host').length,
        totalGuests: users.filter(u => u.role === 'guest').length,
      },
    };
  },
};

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => mockUsersApi.getAll(),
    select: (data) => data.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => mockUsersApi.getById(id),
    select: (data) => data.data,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      mockUsersApi.update(id, data),
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
    mutationFn: (id: string) => mockUsersApi.delete(id),
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
    queryFn: () => mockUsersApi.getStats(),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5,
  });
}
