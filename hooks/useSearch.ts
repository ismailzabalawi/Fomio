import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { discourseApi } from '../api';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query]);

  // Search topics
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      const results = await discourseApi.searchTopics(debouncedQuery);
      
      // If we have search results, enrich posts with topic titles from the topics array
      if (results?.posts && results.posts.length > 0 && results.topics && results.topics.length > 0) {
        try {
          // Create a map of topic_id to topic title
          const topicMap = new Map();
          results.topics.forEach((topic: any) => {
            topicMap.set(topic.id, topic.title);
          });
          
          // Enrich posts with topic titles
          const enrichedResults = results.posts.map((post: any) => ({
            ...post,
            topic_title: topicMap.get(post.topic_id) || `Post #${post.post_number}`
          }));
          
          return { ...results, posts: enrichedResults };
        } catch (error) {
          return results;
        }
      }
      
      return results;
    },
    enabled: debouncedQuery.length > 2, // Only search if query is longer than 2 characters
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });

  // Search categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => discourseApi.fetchCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Filter categories by search query
  const filteredCategories = categoriesData?.category_list?.categories?.filter(cat =>
    (cat.name?.toLowerCase() || '').includes(query.toLowerCase()) ||
    (cat.description?.toLowerCase() || '').includes(query.toLowerCase())
  ) || [];

  const results = searchResults?.posts || [];
  const hasResults = results.length > 0 || filteredCategories.length > 0;
  const isSearching = query.length > 0 && isLoading;

  return {
    // State
    query,
    setQuery,
    debouncedQuery,
    
    // Results
    searchResults: results,
    filteredCategories,
    hasResults,
    
    // Loading states
    isLoading,
    isSearching,
    error,
    
    // Actions
    clearSearch: () => setQuery(''),
  };
}
