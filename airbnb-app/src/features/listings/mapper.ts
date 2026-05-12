import type { Listing, MappedListing } from './types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop';

const TYPE_CATEGORY_MAP: Record<string, string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'Apartment',
  VILLA: 'Villa',
  CABIN: 'Cabin',
};

export function mapListing(l: Listing): MappedListing {
  const primaryPhoto = l.photos?.find(p => p.isPrimary) ?? l.photos?.[0];

  return {
    id: l.id,
    title: l.title ?? 'Untitled listing',
    location: l.location ?? 'Unknown location',
    price: l.pricePerNight ?? 0,
    rating: l.rating ?? 4.5,
    reviews: 0,           // backend doesn't return review count on list — fallback
    image: primaryPhoto?.url ?? FALLBACK_IMAGE,
    host: l.host?.name ?? 'Host',
    guests: l.guests ?? 1,
    bedrooms: 1,          // not in schema — safe fallback
    beds: 1,
    baths: 1,
    amenities: l.amenities ?? [],
    description: l.description ?? '',
    type: l.type ? (l.type.charAt(0) + l.type.slice(1).toLowerCase()) : 'Apartment',
    category: TYPE_CATEGORY_MAP[l.type] ?? 'Apartment',
  };
}

export function mapListings(listings: Listing[]): MappedListing[] {
  return listings.map(mapListing);
}
