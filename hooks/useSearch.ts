import { useQuery } from '@tanstack/react-query';
import { bffFetch } from '../lib/apiClient';

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => bffFetch(`/search?q=${encodeURIComponent(query)}`),
    enabled: !!query && query.length > 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
