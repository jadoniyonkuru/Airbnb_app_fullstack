import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { mapListings, mapListing } from './mapper';
import { queryKeys } from '../../api/queryKeys';
import type { SearchParams, CreateListingRequest, Listing } from './types';

const listingsApi = {
  getAll: async (params?: SearchParams) => {
    const res = await apiClient.get(ENDPOINTS.LISTINGS, { params });
    return res.data;
  },

  search: async (params: SearchParams) => {
    const res = await apiClient.get(ENDPOINTS.LISTINGS_SEARCH, { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiClient.get(ENDPOINTS.LISTING(id));
    return res.data;
  },

  create: async (data: CreateListingRequest) => {
    const res = await apiClient.post(ENDPOINTS.LISTINGS, data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateListingRequest>) => {
    const res = await apiClient.put(ENDPOINTS.LISTING(id), data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(ENDPOINTS.LISTING(id));
    return res.data;
  },
};

export function useListings(params?: SearchParams) {
  return useQuery({
    queryKey: queryKeys.listings(params as Record<string, unknown>),
    queryFn: () => listingsApi.getAll(params),
    select: (data) => mapListings(data.data ?? []),
    staleTime: 1000 * 60 * 2,
  });
}

export function useSearchListings(params: SearchParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.listingsSearch(params as Record<string, unknown>),
    queryFn: () => listingsApi.search(params),
    select: (data) => mapListings(data.data ?? []),
    enabled,
    staleTime: 1000 * 60,
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: queryKeys.listing(id),
    queryFn: () => listingsApi.getById(id),
    select: (data) => mapListing(data.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useHostListings(hostId?: string) {
  return useQuery({
    queryKey: queryKeys.listings({ hostId } as Record<string, unknown>),
    queryFn: () => listingsApi.getAll({ hostId }),
    select: (data) => mapListings(data.data ?? []),
    enabled: !!hostId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateListingRequest) => listingsApi.create(data),
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
      listingsApi.update(id, data),
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
    mutationFn: (id: string) => listingsApi.delete(id),
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
