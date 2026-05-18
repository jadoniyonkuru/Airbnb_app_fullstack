import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';

// ── legacy host-request hooks (kept for backwards compat) ──────────────
export function useHostRequests() {
  return useQuery({
    queryKey: queryKeys.hostRequests,
    queryFn: async () => {
      const res = await apiClient.get(ENDPOINTS.HOST_REQUESTS);
      return res.data?.data ?? [];
    },
    staleTime: 1000 * 60,
  });
}

// ── Stats ──────────────────────────────────────────────────────────────
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(ENDPOINTS.ADMIN_STATS);
        console.log('Admin stats response:', res.data);
        return res.data?.data ?? res.data ?? {
          totalUsers: 0, totalHosts: 0, totalListings: 0, totalBookings: 0, totalReviews: 0,
          totalRevenue: 0, recentBookings: [], recentUsers: []
        };
      } catch (error) {
        console.error('Admin stats fetch error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60,
  });
}

// ── Users ──────────────────────────────────────────────────────────────
export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      try {
        const res = await apiClient.get(ENDPOINTS.ADMIN_USERS);
        console.log('Admin users response:', res.data);
        const users = res.data?.data ?? [];
        console.log('Extracted users:', users);
        return users;
      } catch (error) {
        console.error('Admin users fetch error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 30,
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'SUSPENDED' }) =>
      apiClient.patch(ENDPOINTS.ADMIN_USER_STATUS(id), { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User status updated');
    },
    onError: () => toast.error('Failed to update user status'),
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(ENDPOINTS.ADMIN_USER_DELETE(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User deleted');
    },
    onError: () => toast.error('Failed to delete user'),
  });
}

// ── Listings ───────────────────────────────────────────────────────────
export function useAdminListings() {
  return useQuery({
    queryKey: ['admin', 'listings'],
    queryFn: async () => {
      const res = await apiClient.get(ENDPOINTS.ADMIN_LISTINGS);
      return res.data?.data ?? [];
    },
    staleTime: 1000 * 30,
  });
}

export function useUpdateListingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'PENDING' | 'APPROVED' | 'REJECTED' }) =>
      apiClient.patch(ENDPOINTS.ADMIN_LISTING_STATUS(id), { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'listings'] });
      toast.success('Listing status updated');
    },
    onError: () => toast.error('Failed to update listing status'),
  });
}

// ── Bookings ───────────────────────────────────────────────────────────
export function useAdminBookings() {
  return useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: async () => {
      const res = await apiClient.get(ENDPOINTS.ADMIN_BOOKINGS);
      return res.data?.data ?? [];
    },
    staleTime: 1000 * 30,
  });
}

export function useUpdateAdminBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' }) =>
      apiClient.patch(ENDPOINTS.ADMIN_BOOKING_STATUS(id), { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      toast.success('Booking status updated');
    },
    onError: () => toast.error('Failed to update booking status'),
  });
}

// ── Reviews ────────────────────────────────────────────────────────────
export function useAdminReviews() {
  return useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: async () => {
      const res = await apiClient.get(ENDPOINTS.ADMIN_REVIEWS);
      return res.data?.data ?? [];
    },
    staleTime: 1000 * 30,
  });
}

export function useUpdateReviewStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' }) =>
      apiClient.patch(ENDPOINTS.ADMIN_REVIEW_STATUS(id), { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review status updated');
    },
    onError: () => toast.error('Failed to update review status'),
  });
}

export function useDeleteAdminReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(ENDPOINTS.ADMIN_REVIEW_DELETE(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review deleted');
    },
    onError: () => toast.error('Failed to delete review'),
  });
}

// ── Payments ───────────────────────────────────────────────────────────
export function useAdminPayments() {
  return useQuery({
    queryKey: ['admin', 'payments'],
    queryFn: async () => {
      const res = await apiClient.get(ENDPOINTS.ADMIN_PAYMENTS);
      return res.data?.data ?? [];
    },
    staleTime: 1000 * 30,
  });
}
