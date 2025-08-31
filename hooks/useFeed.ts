import { useQuery } from '@tanstack/react-query';
import { discourseApi } from '../api';

export function useFeed() {
  return useQuery({
    queryKey: ['feed', 'latest'],
    queryFn: () => discourseApi.fetchLatestTopics(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
