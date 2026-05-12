import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listingsApi } from './api';
import { mapListings, mapListing } from './mapper';
import { queryKeys } from '../../api/queryKeys';
import { parseApiError } from '../../api/errorHandler';
import type { SearchParams, CreateListingRequest } from './types';

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

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateListingRequest) => listingsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listings() });
      toast.success('Listing created successfully!');
    },
    onError: (err) => toast.error(parseApiError(err).message),
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
    onError: (err) => toast.error(parseApiError(err).message),
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
    onError: (err) => toast.error(parseApiError(err).message),
  });
}
