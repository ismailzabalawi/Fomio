import { useQuery } from '@tanstack/react-query';
import { discourseApi } from '../api';

export function useTopic(id: number) {
  return useQuery({
    queryKey: ['topic', id],
    queryFn: () => discourseApi.fetchTopicDetails(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    enabled: !!id, // Only run when id is provided
  });
}
