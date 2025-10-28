import { useQuery } from '@tanstack/react-query';
import { bffApiClient } from '../lib/apiClient';

export interface Category {
  id: number;
  name: string;
  color: string;
  text_color: string;
  slug: string;
  topic_count: number;
  post_count: number;
  description?: string;
  read_restricted: boolean;
  permission?: number;
  notification_level: number;
  topic_template?: string;
  has_children: boolean;
  sort_order?: string;
  sort_ascending?: boolean;
  show_subcategory_list: boolean;
  num_featured_topics: number;
  default_view?: string;
  subcategory_list_style: string;
  default_top_period: string;
  default_list_filter: string;
  minimum_required_tags: number;
  navigate_to_first_post_after_read: boolean;
  custom_fields: Record<string, any>;
  read_only_banner?: string;
  form_template_ids: number[];
  uploaded_logo?: string;
  uploaded_logo_dark?: string;
  uploaded_background?: string;
  uploaded_background_dark?: string;
  required_tag_groups: any[];
  can_edit: boolean;
}

export interface CategoriesResponse {
  categories: Category[];
}

export function useBffCategories() {
  return useQuery({
    queryKey: ['bff', 'categories'],
    queryFn: () => bffApiClient.bffFetch<CategoriesResponse>('/categories'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.code === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
  });
}
