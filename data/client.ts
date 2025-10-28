// Data layer interface definitions
// This provides a unified contract for all data operations

export interface FeedItem {
  id: string;
  title: string;
  body?: string;
  excerpt?: string;
  author: {
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color?: string;
  };
  createdAt: string;
  updatedAt?: string;
  postsCount: number;
  replyCount: number;
  views: number;
  likeCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isClosed: boolean;
  isArchived: boolean;
  imageUrl?: string;
}

export interface Post {
  id: string;
  topicId: string;
  content: string;
  cooked: string;
  author: {
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
  postNumber: number;
  likeCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  topicsCount: number;
  postsCount: number;
}

export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
  avatar?: string;
  trustLevel: number;
  isAdmin: boolean;
  isModerator: boolean;
  title?: string;
  createdAt: string;
  lastSeenAt?: string;
  stats: {
    postsCount: number;
    topicsCount: number;
    likesReceived: number;
    followersCount: number;
    followingCount: number;
  };
}

export interface Notification {
  id: string;
  type: string;
  read: boolean;
  createdAt: string;
  data: {
    topicId?: string;
    postId?: string;
    userId?: string;
    message?: string;
    [key: string]: any;
  };
}

export interface CreatePostInput {
  title: string;
  content: string;
  categoryId?: string;
  tags?: string[];
}

export interface CreatePostResponse {
  id: string;
  topicId: string;
  postId: string;
}

export interface FeedParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  cursor?: string;
}

export interface SearchParams {
  query: string;
  type?: 'topics' | 'posts' | 'users';
  limit?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  content?: string;
  type: 'topic' | 'post' | 'user';
  author?: {
    id: string;
    username: string;
    name?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Main data client interface
export interface DataClient {
  // Feed operations
  getFeed(params?: FeedParams): Promise<FeedItem[]>;

  // Post operations
  getPost(id: string): Promise<Post>;
  getTopicPosts(topicId: string, page?: number): Promise<Post[]>;
  createPost(input: CreatePostInput): Promise<CreatePostResponse>;

  // Topic operations
  getTopic(id: string): Promise<FeedItem>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category>;

  // User operations
  getCurrentUser(): Promise<User | null>;
  getUser(id: string): Promise<User>;

  // Search operations
  search(params: SearchParams): Promise<SearchResult[]>;

  // Interaction operations
  likePost(postId: string): Promise<boolean>;
  unlikePost(postId: string): Promise<boolean>;
  bookmarkTopic(topicId: string): Promise<boolean>;
  unbookmarkTopic(topicId: string): Promise<boolean>;

  // Notification operations
  getNotifications(): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<boolean>;
  markAllNotificationsAsRead(): Promise<boolean>;

  // Health check
  isHealthy(): Promise<boolean>;
}
