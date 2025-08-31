import { useQuery } from '@tanstack/react-query';
import { discourseApi } from '../api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => discourseApi.fetchCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes (categories don't change often)
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}
