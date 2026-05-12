export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  guestId: string;
  listingId: string;
  guest?: {
    id: string;
    name: string;
    avatar?: string | null;
    email: string;
  };
  listing?: {
    id: string;
    title: string;
    location: string;
    pricePerNight: number;
    photos: { url: string; isPrimary: boolean }[];
  };
}

export interface BookingsResponse {
  success: boolean;
  data: Booking[];
}

export interface BookingResponse {
  success: boolean;
  data: Booking;
}

export interface CreateBookingRequest {
  listingId: string;
  checkIn: string;
  checkOut: string;
}

export interface MappedBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  guest: string;
  guestAvatar: string;
  checkIn: string;
  checkOut: string;
  status: string;
  total: number;
  nights: number;
  location: string;
}
