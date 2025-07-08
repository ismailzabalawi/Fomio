import { useState, useEffect } from 'react';
import { Byte } from './useCreateByte';
import { useAuth } from './useAuth';

export interface FeedState {
  bytes: Byte[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  error: string | null;
}

// Mock data for initial feed
const mockFeedData: Byte[] = [
  {
    id: '1',
    author: {
      id: '2',
      name: 'John Doe',
      username: '@johndoe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Just discovered this amazing new coffee shop downtown! The atmosphere is perfect for working and the coffee is incredible. ☕️',
    tags: ['coffee', 'lifestyle'],
    timestamp: '2h ago',
    likes: 24,
    comments: 8,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    author: {
      id: '3',
      name: 'Sarah Wilson',
      username: '@sarahw',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Working on a new React Native project and loving the developer experience with Expo Router. The file-based routing is so intuitive! 🚀',
    tags: ['tech', 'react-native'],
    timestamp: '4h ago',
    likes: 42,
    comments: 15,
    isLiked: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: '3',
    author: {
      id: '4',
      name: 'Mike Chen',
      username: '@mikechen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    content: 'Beautiful sunset from my evening walk. Sometimes the simple moments are the most meaningful. 🌅',
    tags: ['nature', 'photography'],
    timestamp: '6h ago',
    likes: 67,
    comments: 12,
    isLiked: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

export function useFeed() {
  const [feedState, setFeedState] = useState<FeedState>({
    bytes: [],
    isLoading: true,
    isRefreshing: false,
    hasMore: true,
    error: null,
  });

  const { user } = useAuth();

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setFeedState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // TODO: Implement actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFeedState(prev => ({
        ...prev,
        bytes: mockFeedData,
        isLoading: false,
        hasMore: false,
      }));
    } catch (error) {
      console.error('Load feed error:', error);
      setFeedState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load feed',
      }));
    }
  };

  const refreshFeed = async () => {
    try {
      setFeedState(prev => ({ ...prev, isRefreshing: true, error: null }));
      
      // TODO: Implement actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFeedState(prev => ({
        ...prev,
        bytes: mockFeedData,
        isRefreshing: false,
        hasMore: true,
      }));
    } catch (error) {
      console.error('Refresh feed error:', error);
      setFeedState(prev => ({
        ...prev,
        isRefreshing: false,
        error: 'Failed to refresh feed',
      }));
    }
  };

  const loadMoreBytes = async () => {
    if (!feedState.hasMore || feedState.isLoading) return;

    try {
      setFeedState(prev => ({ ...prev, isLoading: true }));
      
      // TODO: Implement actual API call for pagination
      // For now, just mark as no more data
      setFeedState(prev => ({
        ...prev,
        isLoading: false,
        hasMore: false,
      }));
    } catch (error) {
      console.error('Load more bytes error:', error);
      setFeedState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load more bytes',
      }));
    }
  };

  const toggleLike = async (byteId: string) => {
    if (!user) return;

    try {
      setFeedState(prev => ({
        ...prev,
        bytes: prev.bytes.map(byte => 
          byte.id === byteId 
            ? {
                ...byte,
                isLiked: !byte.isLiked,
                likes: byte.isLiked ? byte.likes - 1 : byte.likes + 1,
              }
            : byte
        ),
      }));

      // TODO: Implement actual API call
      // For now, just update local state
    } catch (error) {
      console.error('Toggle like error:', error);
      // Revert the optimistic update
      setFeedState(prev => ({
        ...prev,
        bytes: prev.bytes.map(byte => 
          byte.id === byteId 
            ? {
                ...byte,
                isLiked: !byte.isLiked,
                likes: byte.isLiked ? byte.likes + 1 : byte.likes - 1,
              }
            : byte
        ),
      }));
    }
  };

  const addByte = (newByte: Byte) => {
    setFeedState(prev => ({
      ...prev,
      bytes: [newByte, ...prev.bytes],
    }));
  };

  const getByteById = (byteId: string): Byte | undefined => {
    return feedState.bytes.find(byte => byte.id === byteId);
  };

  return {
    ...feedState,
    loadFeed,
    refreshFeed,
    loadMoreBytes,
    toggleLike,
    addByte,
    getByteById,
  };
}

