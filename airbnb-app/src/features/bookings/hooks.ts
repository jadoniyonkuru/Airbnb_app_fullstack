import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { mapBookings, mapBooking } from './mapper';
import { queryKeys } from '../../api/queryKeys';
import type { CreateBookingRequest, Booking } from './types';

const bookingsApi = {
  getAll: async () => {
    const res = await apiClient.get(ENDPOINTS.BOOKINGS);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get(ENDPOINTS.BOOKING(id));
    return res.data;
  },

  getByUser: async (userId: string) => {
    const res = await apiClient.get(ENDPOINTS.USER_BOOKING(userId));
    return res.data;
  },

  create: async (data: CreateBookingRequest) => {
    const res = await apiClient.post(ENDPOINTS.BOOKINGS, data);
    return res.data;
  },

  update: async (id: string, data: Partial<{ status: string }>) => {
    const res = await apiClient.put(ENDPOINTS.BOOKING(id), data);
    return res.data;
  },

  cancel: async (id: string) => {
    const res = await apiClient.delete(ENDPOINTS.BOOKING(id));
    return res.data;
  },
};

export function useBookings() {
  return useQuery({
    queryKey: queryKeys.bookings,
    queryFn: () => bookingsApi.getAll(),
    select: (data) => mapBookings(data.data ?? []),
    staleTime: 1000 * 60,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => bookingsApi.getById(id),
    select: (data) => mapBooking(data.data),
    enabled: !!id,
  });
}

export function useUserBookings(userId: string) {
  return useQuery({
    queryKey: queryKeys.userBookingsList(userId),
    queryFn: () => bookingsApi.getByUser(userId),
    select: (data) => mapBookings(data.data ?? []),
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookings });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to create booking';
      toast.error(message);
    },
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ status: string }> }) =>
      bookingsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.booking(id) });
      qc.invalidateQueries({ queryKey: queryKeys.bookings });
      toast.success('Booking updated.');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to update booking';
      toast.error(message);
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookings });
      toast.success('Booking cancelled.');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to cancel booking';
      toast.error(message);
    },
  });
}
