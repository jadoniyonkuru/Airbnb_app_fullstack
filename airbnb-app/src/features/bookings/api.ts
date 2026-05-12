import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import type { BookingsResponse, BookingResponse, CreateBookingRequest } from './types';

export const bookingsApi = {
  getAll: () =>
    apiClient.get<BookingsResponse>(ENDPOINTS.BOOKINGS).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<BookingResponse>(ENDPOINTS.BOOKING(id)).then(r => r.data),

  getByUser: (userId: string) =>
    apiClient.get<BookingsResponse>(ENDPOINTS.USER_BOOKING(userId)).then(r => r.data),

  create: (data: CreateBookingRequest) =>
    apiClient.post<BookingResponse>(ENDPOINTS.BOOKINGS, data).then(r => r.data),

  update: (id: string, data: Partial<{ status: string }>) =>
    apiClient.put<BookingResponse>(ENDPOINTS.BOOKING(id), data).then(r => r.data),

  cancel: (id: string) =>
    apiClient.delete(ENDPOINTS.BOOKING(id)).then(r => r.data),
};
