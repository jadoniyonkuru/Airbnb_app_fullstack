import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';

const statsApi = {
  getListingStats: () => apiClient.get(ENDPOINTS.STATS_LISTINGS).then(r => r.data),
  getUserStats: () => apiClient.get(ENDPOINTS.STATS_USERS).then(r => r.data),
};

export function useListingStats() {
  return useQuery({
    queryKey: queryKeys.statsListings,
    queryFn: () => statsApi.getListingStats(),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserStatsData() {
  return useQuery({
    queryKey: queryKeys.statsUsers,
    queryFn: () => statsApi.getUserStats(),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5,
  });
}
