import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import type { ListingsResponse, ListingResponse, SearchParams, CreateListingRequest } from './types';

export const listingsApi = {
  getAll: (params?: SearchParams) =>
    apiClient.get<ListingsResponse>(ENDPOINTS.LISTINGS, { params }).then(r => r.data),

  search: (params: SearchParams) =>
    apiClient.get<ListingsResponse>(ENDPOINTS.LISTINGS_SEARCH, { params }).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<ListingResponse>(ENDPOINTS.LISTING(id)).then(r => r.data),

  create: (data: CreateListingRequest) =>
    apiClient.post<ListingResponse>(ENDPOINTS.LISTINGS, data).then(r => r.data),

  update: (id: string, data: Partial<CreateListingRequest>) =>
    apiClient.put<ListingResponse>(ENDPOINTS.LISTING(id), data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(ENDPOINTS.LISTING(id)).then(r => r.data),
};
