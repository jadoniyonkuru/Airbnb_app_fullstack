import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { properties } from '../../data/mockData';
import { mapListings, mapListing } from './mapper';
import { queryKeys } from '../../api/queryKeys';
import type { SearchParams, CreateListingRequest, Listing } from './types';

// Mock listings API
const mockListingsApi = {
  getAll: async (params?: SearchParams) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    let filtered = [...properties];
    
    if (params?.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(params.location!.toLowerCase())
      );
    }
    
    if (params?.minPrice) {
      filtered = filtered.filter(p => p.price >= params.minPrice!);
    }
    
    if (params?.maxPrice) {
      filtered = filtered.filter(p => p.price <= params.maxPrice!);
    }
    
    if (params?.type) {
      filtered = filtered.filter(p => p.type === params.type);
    }
    
    return {
      success: true,
      data: filtered,
      total: filtered.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  },

  search: async (params: SearchParams) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockListingsApi.getAll(params);
  },

  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const property = properties.find(p => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return {
      success: true,
      data: {
        id: property.id,
        title: property.title,
        description: property.description,
        location: property.location,
        pricePerNight: property.price,
        guests: property.guests,
        type: property.type as any,
        amenities: property.amenities,
        rating: property.rating,
        photos: [{ id: '1', url: property.image, publicId: 'mock', isPrimary: true, createdAt: new Date().toISOString() }],
        host: { id: '1', name: property.host, avatar: null, email: 'host@stayease.com' },
        hostId: '1',
        createdAt: new Date().toISOString(),
      } as Listing,
    };
  },

  create: async (data: CreateListingRequest) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newListing: Listing = {
      id: String(properties.length + 1),
      title: data.title,
      description: data.description,
      location: data.location,
      pricePerNight: data.pricePerNight,
      guests: data.guests,
      type: data.type,
      amenities: data.amenities,
      rating: 4.5,
      photos: [{ id: '1', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', publicId: 'mock', isPrimary: true, createdAt: new Date().toISOString() }],
      host: { id: '1', name: 'Your Name', avatar: null, email: 'you@stayease.com' },
      hostId: '1',
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: newListing };
  },

  update: async (id: string, data: Partial<CreateListingRequest>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const property = properties.find(p => p.id === id);
    if (!property) throw new Error('Property not found');
    
    const updated: Listing = {
      id: property.id,
      title: data.title || property.title,
      description: data.description || property.description,
      location: data.location || property.location,
      pricePerNight: data.pricePerNight || property.price,
      guests: data.guests || property.guests,
      type: data.type || (property.type as any),
      amenities: data.amenities || property.amenities,
      rating: property.rating,
      photos: [{ id: '1', url: property.image, publicId: 'mock', isPrimary: true, createdAt: new Date().toISOString() }],
      host: { id: '1', name: property.host, avatar: null, email: 'host@stayease.com' },
      hostId: '1',
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: updated };
  },

  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true, message: 'Listing deleted' };
  },
};

export function useListings(params?: SearchParams) {
  return useQuery({
    queryKey: queryKeys.listings(params as Record<string, unknown>),
    queryFn: () => mockListingsApi.getAll(params),
    select: (data) => mapListings(data.data ?? []),
    staleTime: 1000 * 60 * 2,
  });
}

export function useSearchListings(params: SearchParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.listingsSearch(params as Record<string, unknown>),
    queryFn: () => mockListingsApi.search(params),
    select: (data) => mapListings(data.data ?? []),
    enabled,
    staleTime: 1000 * 60,
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: queryKeys.listing(id),
    queryFn: () => mockListingsApi.getById(id),
    select: (data) => mapListing(data.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateListingRequest) => mockListingsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listings() });
      toast.success('Listing created successfully!');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to create listing';
      toast.error(message);
    },
  });
}

export function useUpdateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateListingRequest> }) =>
      mockListingsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.listing(id) });
      qc.invalidateQueries({ queryKey: queryKeys.listings() });
      toast.success('Listing updated.');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to update listing';
      toast.error(message);
    },
  });
}

export function useDeleteListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockListingsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listings() });
      toast.success('Listing deleted.');
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to delete listing';
      toast.error(message);
    },
  });
}
