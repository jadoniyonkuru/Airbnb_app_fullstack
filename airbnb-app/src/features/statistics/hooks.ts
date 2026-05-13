import { useQuery } from '@tanstack/react-query';
import { stats } from '../../data/mockData';
import { queryKeys } from '../../api/queryKeys';

export function useListingStats() {
  return useQuery({
    queryKey: queryKeys.statsListings,
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300));
      return { data: stats };
    },
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserStatsData() {
  return useQuery({
    queryKey: queryKeys.statsUsers,
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300));
      return { data: stats };
    },
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5,
  });
}