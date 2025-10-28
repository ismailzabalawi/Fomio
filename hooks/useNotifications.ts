import { useQuery } from '@tanstack/react-query';
import { bffFetch } from '../lib/apiClient';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => bffFetch('/notifications'),
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}
