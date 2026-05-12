export type ListingType = 'APARTMENT' | 'HOUSE' | 'VILLA' | 'CABIN';

export interface ListingPhoto {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface ListingHost {
  id: string;
  name: string;
  avatar?: string | null;
  email: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  guests: number;
  type: ListingType;
  amenities: string[];
  rating?: number | null;
  photos: ListingPhoto[];
  host: ListingHost;
  hostId: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ListingsResponse {
  success: boolean;
  data: Listing[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ListingResponse {
  success: boolean;
  data: Listing;
}

export interface SearchParams {
  location?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  type?: ListingType;
  page?: number;
  limit?: number;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  guests: number;
  type: ListingType;
  amenities: string[];
}


export interface MappedListing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  host: string;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  amenities: string[];
  description: string;
  type: string;
  category: string;
  lat?: number;
  lng?: number;
}
