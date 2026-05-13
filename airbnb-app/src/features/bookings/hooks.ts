import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookings, properties } from '../../data/mockData';
import { mapBookings, mapBooking } from './mapper';
import { queryKeys } from '../../api/queryKeys';
import type { CreateBookingRequest, Booking } from './types';

// Mock bookings API
const mockBookingsApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      success: true,
      data: bookings.map(b => ({
        id: b.id,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        totalPrice: b.total,
        status: b.status.toUpperCase() as any,
        createdAt: new Date().toISOString(),
        guestId: '6',
        listingId: b.propertyId,
        guest: { id: '6', name: b.guest, avatar: null, email: 'guest@stayease.com' },
        listing: {
          id: b.propertyId,
          title: b.propertyTitle,
          location: b.location,
          pricePerNight: 100,
          photos: [{ url: b.propertyImage, isPrimary: true }],
        },
      })) as Booking[],
    };
  },

  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const booking = bookings.find(b => b.id === id);
    if (!booking) throw new Error('Booking not found');
    
    return {
      success: true,
      data: {
        id: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: booking.total,
        status: booking.status.toUpperCase() as any,
        createdAt: new Date().toISOString(),
        guestId: '6',
        listingId: booking.propertyId,
        guest: { id: '6', name: booking.guest, avatar: null, email: 'guest@stayease.com' },
        listing: {
          id: booking.propertyId,
          title: booking.propertyTitle,
          location: booking.location,
          pricePerNight: 100,
          photos: [{ url: booking.propertyImage, isPrimary: true }],
        },
      } as Booking,
    };
  },

  getByUser: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      success: true,
      data: bookings.map(b => ({
        id: b.id,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        totalPrice: b.total,
        status: b.status.toUpperCase() as any,
        createdAt: new Date().toISOString(),
        guestId: userId,
        listingId: b.propertyId,
        guest: { id: userId, name: b.guest, avatar: null, email: 'guest@stayease.com' },
        listing: {
          id: b.propertyId,
          title: b.propertyTitle,
          location: b.location,
          pricePerNight: 100,
          photos: [{ url: b.propertyImage, isPrimary: true }],
        },
      })) as Booking[],
    };
  },

  create: async (data: CreateBookingRequest) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const property = properties.find(p => p.id === data.listingId);
    if (!property) throw new Error('Property not found');
    
    const nights = Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * nights;
    
    const newBooking: Booking = {
      id: `B${Date.now()}`,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      totalPrice,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      guestId: '6',
      listingId: data.listingId,
      guest: { id: '6', name: 'You', avatar: null, email: 'you@stayease.com' },
      listing: {
        id: property.id,
        title: property.title,
        location: property.location,
        pricePerNight: property.price,
        photos: [{ url: property.image, isPrimary: true }],
      },
    };
    
    return { success: true, data: newBooking };
  },

  update: async (id: string, data: Partial<{ status: string }>) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const booking = bookings.find(b => b.id === id);
    if (!booking) throw new Error('Booking not found');
    
    return {
      success: true,
      data: {
        id: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: booking.total,
        status: (data.status || booking.status).toUpperCase() as any,
        createdAt: new Date().toISOString(),
        guestId: '6',
        listingId: booking.propertyId,
        guest: { id: '6', name: booking.guest, avatar: null, email: 'guest@stayease.com' },
        listing: {
          id: booking.propertyId,
          title: booking.propertyTitle,
          location: booking.location,
          pricePerNight: 100,
          photos: [{ url: booking.propertyImage, isPrimary: true }],
        },
      } as Booking,
    };
  },

  cancel: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true, message: 'Booking cancelled' };
  },
};

export function useBookings() {
  return useQuery({
    queryKey: queryKeys.bookings,
    queryFn: () => mockBookingsApi.getAll(),
    select: (data) => mapBookings(data.data ?? []),
    staleTime: 1000 * 60,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => mockBookingsApi.getById(id),
    select: (data) => mapBooking(data.data),
    enabled: !!id,
  });
}

export function useUserBookings(userId: string) {
  return useQuery({
    queryKey: queryKeys.userBookingsList(userId),
    queryFn: () => mockBookingsApi.getByUser(userId),
    select: (data) => mapBookings(data.data ?? []),
    enabled: !!userId,
    staleTime: 1000 * 60,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingRequest) => mockBookingsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookings });
      toast.success('Booking confirmed!');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      toast.error(message);
    },
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ status: string }> }) =>
      mockBookingsApi.update(id, data),
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
    mutationFn: (id: string) => mockBookingsApi.cancel(id),
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
