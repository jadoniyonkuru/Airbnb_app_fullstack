import type { Booking, MappedBooking } from './types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop';

function nightsBetween(checkIn: string, checkOut: string): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function initials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function mapBooking(b: Booking): MappedBooking {
  const primaryPhoto = b.listing?.photos?.find(p => p.isPrimary) ?? b.listing?.photos?.[0];
  return {
    id: b.id,
    propertyId: b.listingId,
    propertyTitle: b.listing?.title ?? 'Property',
    propertyImage: primaryPhoto?.url ?? FALLBACK_IMAGE,
    guest: b.guest?.name ?? 'Guest',
    guestAvatar: b.guest?.name ? initials(b.guest.name) : 'G',
    checkIn: b.checkIn.split('T')[0],
    checkOut: b.checkOut.split('T')[0],
    status: b.status.toLowerCase(),
    total: b.totalPrice,
    nights: nightsBetween(b.checkIn, b.checkOut),
    location: b.listing?.location ?? '',
  };
}

export function mapBookings(bookings: Booking[]): MappedBooking[] {
  return bookings.map(mapBooking);
}
