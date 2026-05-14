import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';

export function useListingStats() {
  return useQuery({
    queryKey: queryKeys.statsListings,
    queryFn: () => apiClient.get(ENDPOINTS.STATS_LISTINGS),
    select: (data) => data.data?.data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserStatsData() {
  return useQuery({
    queryKey: queryKeys.statsUsers,
    queryFn: () => apiClient.get(ENDPOINTS.STATS_USERS),
    select: (data) => data.data?.data,
    staleTime: 1000 * 60 * 5,
  });
}