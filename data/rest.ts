import {
  DataClient,
  FeedItem,
  Post,
  Category,
  User,
  Notification,
  CreatePostInput,
  CreatePostResponse,
  FeedParams,
  SearchParams,
  SearchResult,
} from './client';
import { logger } from '@/shared/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Discourse API configuration
const DISCOURSE_API =
  process.env.EXPO_PUBLIC_DISCOURSE_API || 'https://meta.techrebels.info';
const API_KEY = process.env.EXPO_PUBLIC_DISCOURSE_KEY || '';
const API_USERNAME = process.env.EXPO_PUBLIC_DISCOURSE_USERNAME || '';

// Helper function to get auth headers
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  // Add API key authentication if available
  if (API_KEY && API_USERNAME) {
    headers['Api-Key'] = API_KEY;
    headers['Api-Username'] = API_USERNAME;
  }

  // Add session cookies if available
  try {
    const authToken = await AsyncStorage.getItem('auth_token');
    const sessionCookie = await AsyncStorage.getItem('session_cookie');

    if (authToken && sessionCookie) {
      headers['Cookie'] = `_t=${authToken}; _forum_session=${sessionCookie}`;
    }
  } catch (error) {
    logger.warn('Failed to get session cookies for REST request', error);
  }

  return headers;
}

// Helper function to transform Discourse topic to FeedItem
function transformTopic(topic: any): FeedItem {
  const originalPoster = topic.posters?.find(
    (poster: any) =>
      poster.description === 'Original Poster' ||
      poster.description === 'Most Recent Poster'
  );

  return {
    id: topic.id.toString(),
    title: topic.title || 'Untitled',
    body: topic.excerpt,
    excerpt: topic.excerpt,
    author: {
      id: originalPoster?.user_id?.toString() || '0',
      username: `User ${originalPoster?.user_id || 'Unknown'}`,
      name: `User ${originalPoster?.user_id || 'Unknown'}`,
      avatar: originalPoster?.user_id
        ? `${DISCOURSE_API}/letter_avatar/${originalPoster.user_id}/150.png`
        : `${DISCOURSE_API}/assets/default-avatar.png`,
    },
    category: {
      id: topic.category_id?.toString() || '0',
      name: 'General', // Will be enriched by category data
      slug: 'general',
    },
    createdAt: topic.created_at,
    updatedAt: topic.last_posted_at,
    postsCount: topic.posts_count || 0,
    replyCount: topic.reply_count || 0,
    views: topic.views || 0,
    likeCount: topic.like_count || 0,
    isLiked: topic.liked || false,
    isBookmarked: topic.bookmarked || false,
    isClosed: topic.closed || false,
    isArchived: topic.archived || false,
    imageUrl: topic.image_url,
  };
}

// Helper function to transform Discourse post to Post
function transformPost(post: any): Post {
  return {
    id: post.id.toString(),
    topicId: post.topic_id.toString(),
    content: post.raw,
    cooked: post.cooked,
    author: {
      id: post.user_id?.toString() || '0',
      username: post.username || 'Unknown',
      name: post.name || post.username || 'Unknown',
      avatar: post.avatar_template
        ? `${DISCOURSE_API}${post.avatar_template.replace('{size}', '150')}`
        : `${DISCOURSE_API}/assets/default-avatar.png`,
    },
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    postNumber: post.post_number || 0,
    likeCount: post.like_count || 0,
    isLiked: post.liked || false,
    isBookmarked: post.bookmarked || false,
  };
}

// Helper function to transform Discourse category to Category
function transformCategory(category: any): Category {
  return {
    id: category.id.toString(),
    name: category.name,
    slug: category.slug,
    color: category.color,
    description: category.description,
    topicsCount: category.topic_count || 0,
    postsCount: category.post_count || 0,
  };
}

export const restClient: DataClient = {
  async getFeed(params: FeedParams = {}): Promise<FeedItem[]> {
    try {
      const page = params.page || 0;
      const limit = params.limit || 20;

      const headers = await getAuthHeaders();
      const response = await fetch(
        `${DISCOURSE_API}/latest.json?page=${page}&limit=${limit}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const topics = data.topic_list?.topics || [];

      logger.info('REST Feed loaded', {
        page,
        limit,
        topicCount: topics.length,
      });

      return topics.map(transformTopic);
    } catch (error) {
      logger.error('Failed to load feed via REST', error);
      throw error;
    }
  },

  async getPost(id: string): Promise<Post> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${DISCOURSE_API}/posts/${id}.json`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return transformPost(data.post);
    } catch (error) {
      logger.error('Failed to load post via REST', error);
      throw error;
    }
  },

  async getTopicPosts(topicId: string, page: number = 0): Promise<Post[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${DISCOURSE_API}/t/${topicId}.json?page=${page}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const posts = data.post_stream?.posts || [];

      return posts.map(transformPost);
    } catch (error) {
      logger.error('Failed to load topic posts via REST', error);
      throw error;
    }
  },

  async createPost(input: CreatePostInput): Promise<CreatePostResponse> {
    try {
      const headers = await getAuthHeaders();
      const body = {
        title: input.title,
        raw: input.content,
        category: input.categoryId ? parseInt(input.categoryId) : undefined,
        tags: input.tags || [],
      };

      const response = await fetch(`${DISCOURSE_API}/posts.json`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP ${response.status}: ${errorData.errors?.join(', ') || response.statusText}`
        );
      }

      const data = await response.json();

      logger.info('Post created via REST', {
        topicId: data.topic_id,
        postId: data.id,
      });

      return {
        id: data.id.toString(),
        topicId: data.topic_id.toString(),
        postId: data.id.toString(),
      };
    } catch (error) {
      logger.error('Failed to create post via REST', error);
      throw error;
    }
  },

  async getTopic(id: string): Promise<FeedItem> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${DISCOURSE_API}/t/${id}.json`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return transformTopic(data);
    } catch (error) {
      logger.error('Failed to load topic via REST', error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${DISCOURSE_API}/categories.json`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const categories = data.category_list?.categories || [];

      return categories.map(transformCategory);
    } catch (error) {
      logger.error('Failed to load categories via REST', error);
      throw error;
    }
  },

  async getCategory(id: string): Promise<Category> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${DISCOURSE_API}/c/${id}.json`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return transformCategory(data.category);
    } catch (error) {
      logger.error('Failed to load category via REST', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${DISCOURSE_API}/session/current.json`, {
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Not authenticated
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const user = data.user;

      return {
        id: user.id.toString(),
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar_template
          ? `${DISCOURSE_API}${user.avatar_template.replace('{size}', '150')}`
          : `${DISCOURSE_API}/assets/default-avatar.png`,
        trustLevel: user.trust_level || 0,
        isAdmin: user.admin || false,
        isModerator: user.moderator || false,
        title: user.title,
        createdAt: user.created_at,
        lastSeenAt: user.last_seen_at,
        stats: {
          postsCount: user.posts_count || 0,
          topicsCount: user.topics_count || 0,
          likesReceived: user.likes_received || 0,
          followersCount: user.followers_count || 0,
          followingCount: user.following_count || 0,
        },
      };
    } catch (error) {
      logger.error('Failed to get current user via REST', error);
      return null;
    }
  },

  async getUser(id: string): Promise<User> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${DISCOURSE_API}/users/${id}.json`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const user = data.user;

      return {
        id: user.id.toString(),
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar_template
          ? `${DISCOURSE_API}${user.avatar_template.replace('{size}', '150')}`
          : `${DISCOURSE_API}/assets/default-avatar.png`,
        trustLevel: user.trust_level || 0,
        isAdmin: user.admin || false,
        isModerator: user.moderator || false,
        title: user.title,
        createdAt: user.created_at,
        lastSeenAt: user.last_seen_at,
        stats: {
          postsCount: user.posts_count || 0,
          topicsCount: user.topics_count || 0,
          likesReceived: user.likes_received || 0,
          followersCount: user.followers_count || 0,
          followingCount: user.following_count || 0,
        },
      };
    } catch (error) {
      logger.error('Failed to get user via REST', error);
      throw error;
    }
  },

  async search(params: SearchParams): Promise<SearchResult[]> {
    try {
      const headers = await getAuthHeaders();
      const query = encodeURIComponent(params.query);
      const type = params.type || 'topics';
      const limit = params.limit || 20;

      const response = await fetch(
        `${DISCOURSE_API}/search.json?q=${query}&type=${type}&limit=${limit}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const posts = data.posts || [];

      return posts.map((post: any) => ({
        id: post.id.toString(),
        title: post.topic_title || `Post #${post.post_number}`,
        content: post.blurb,
        type: 'post' as const,
        author: {
          id: post.user_id?.toString() || '0',
          username: post.username || 'Unknown',
          name: post.display_username || post.username || 'Unknown',
        },
        category: {
          id: post.category_id?.toString() || '0',
          name: 'General', // Will be enriched by category data
        },
        createdAt: post.created_at,
      }));
    } catch (error) {
      logger.error('Failed to search via REST', error);
      throw error;
    }
  },

  async likePost(postId: string): Promise<boolean> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${DISCOURSE_API}/post_actions.json`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          id: parseInt(postId),
          post_action_type_id: 2, // Like action
        }),
      });

      return response.ok;
    } catch (error) {
      logger.error('Failed to like post via REST', error);
      return false;
    }
  },

  async unlikePost(postId: string): Promise<boolean> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${DISCOURSE_API}/post_actions/${postId}.json`,
        {
          method: 'DELETE',
          headers,
        }
      );

      return response.ok;
    } catch (error) {
      logger.error('Failed to unlike post via REST', error);
      return false;
    }
  },

  async bookmarkTopic(topicId: string): Promise<boolean> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${DISCOURSE_API}/t/${topicId}/bookmark.json`,
        {
          method: 'PUT',
          headers,
        }
      );

      return response.ok;
    } catch (error) {
      logger.error('Failed to bookmark topic via REST', error);
      return false;
    }
  },

  async unbookmarkTopic(topicId: string): Promise<boolean> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${DISCOURSE_API}/t/${topicId}/bookmark.json`,
        {
          method: 'DELETE',
          headers,
        }
      );

      return response.ok;
    } catch (error) {
      logger.error('Failed to unbookmark topic via REST', error);
      return false;
    }
  },

  async getNotifications(): Promise<Notification[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${DISCOURSE_API}/notifications.json`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const notifications = data.notifications || [];

      return notifications.map((notif: any) => ({
        id: notif.id.toString(),
        type: notif.notification_type,
        read: notif.read,
        createdAt: notif.created_at,
        data: {
          topicId: notif.topic_id?.toString(),
          postId: notif.post_number?.toString(),
          userId: notif.data?.user_id?.toString(),
          message: notif.data?.message,
        },
      }));
    } catch (error) {
      logger.error('Failed to load notifications via REST', error);
      throw error;
    }
  },

  async markNotificationAsRead(id: string): Promise<boolean> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${DISCOURSE_API}/notifications/${id}/read.json`,
        {
          method: 'PUT',
          headers,
        }
      );

      return response.ok;
    } catch (error) {
      logger.error('Failed to mark notification as read via REST', error);
      return false;
    }
  },

  async markAllNotificationsAsRead(): Promise<boolean> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${DISCOURSE_API}/notifications/read.json`, {
        method: 'PUT',
        headers,
      });

      return response.ok;
    } catch (error) {
      logger.error('Failed to mark all notifications as read via REST', error);
      return false;
    }
  },

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${DISCOURSE_API}/about.json`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      logger.warn('REST API health check failed', error);
      return false;
    }
  },
};
