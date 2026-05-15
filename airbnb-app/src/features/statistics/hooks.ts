import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { queryKeys } from '../../api/queryKeys';

export function useListingStats() {
  return useQuery({
    queryKey: queryKeys.statsListings,
    queryFn: () => apiClient.get(ENDPOINTS.STATS_LISTINGS),
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserStatsData() {
  return useQuery({
    queryKey: queryKeys.statsUsers,
    queryFn: () => apiClient.get(ENDPOINTS.STATS_USERS),
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => apiClient.get(ENDPOINTS.ANALYTICS),
    select: (res) => res.data?.data as {
      monthlyRevenue: { month: string; revenue: number; bookings: number }[];
      userGrowth:     { month: string; users: number }[];
      weeklyBookings: { day: string; bookings: number }[];
    } | undefined,
    staleTime: 1000 * 60 * 5,
  });
}
