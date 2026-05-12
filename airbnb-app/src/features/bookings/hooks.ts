import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingsApi } from './api';
import { mapBookings, mapBooking } from './mapper';
import { queryKeys } from '../../api/queryKeys';
import { parseApiError } from '../../api/errorHandler';
import type { CreateBookingRequest } from './types';

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
      toast.success('Booking confirmed!');
    },
    onError: (err) => toast.error(parseApiError(err).message),
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
    onError: (err) => toast.error(parseApiError(err).message),
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
    onError: (err) => toast.error(parseApiError(err).message),
  });
}
