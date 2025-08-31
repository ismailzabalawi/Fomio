// Discourse API wrapper for React Query integration
// Based on Discourse REST API documentation

export interface DiscourseConfig {
  baseUrl: string;
  apiKey?: string;
  username?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface Topic {
  id: number;
  title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  created_at: string;
  last_posted_at: string;
  bumped: boolean;
  bumped_at: string;
  excerpt: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  bookmarked?: boolean;
  liked?: boolean;
  tags: string[];
  category_id: number;
  posters: Array<{
    extras: string;
    description: string;
    user_id: number;
    primary_group_id: number | null;
  }>;
}

export interface Post {
  id: number;
  name: string;
  username: string;
  avatar_template: string;
  created_at: string;
  cooked: string;
  post_number: number;
  post_type: number;
  updated_at: string;
  reply_count: number;
  reply_to_post_number: number | null;
  quote_count: number;
  incoming_link_count: number;
  reads: number;
  readers_count: number;
  score: number;
  yours: boolean;
  topic_id: number;
  topic_slug: string;
  topic_title: string;
  category_id: number;
  display_username: string;
  primary_group_name: string | null;
  flair_name: string | null;
  version: number;
  can_edit: boolean;
  can_delete: boolean;
  can_recover: boolean;
  can_wiki: boolean;
  link_counts: Array<{
    url: string;
    internal: boolean;
    reflection: boolean;
    title: string;
    clicks: number;
  }>;
  read: boolean;
  user_title: string | null;
  bookmarked: boolean;
  actions_summary: Array<{
    id: number;
    count: number;
    can_act: boolean;
  }>;
  moderator: boolean;
  admin: boolean;
  staff: boolean;
  user_id: number;
  draft_sequence: number;
  hidden: boolean;
  hidden_reason_id: number | null;
  trust_level: number;
  deleted_at: string | null;
  user_deleted: boolean;
  edit_reason: string | null;
  can_view_edit_history: boolean;
  wiki: boolean;
  reviewable_id: number | null;
  reviewable_score_count: number;
  reviewable_score_pending_count: number;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  text_color: string;
  slug: string;
  topic_count: number;
  post_count: number;
  description: string;
  read_restricted: boolean;
  permission: number;
  notification_level: number;
  topic_template: string | null;
  has_children: boolean;
  sort_order: string | null;
  sort_ascending: string | null;
  show_subcategory_list: boolean;
  num_featured_topics: number;
  default_view: string | null;
  subcategory_list_style: string | null;
  default_top_period: string;
  default_list_filter: string;
  minimum_required_tags: number;
  navigate_to_first_post_after_read: boolean;
  topics_day: number;
  topics_week: number;
  topics_month: number;
  topics_year: number;
  posts_day: number;
  posts_week: number;
  posts_month: number;
  posts_year: number;
  description_excerpt: string;
  topic_url: string;
  read_only_banner: string | null;
  logo_url: string | null;
  background_url: string | null;
}

export interface User {
  id: number;
  username: string;
  name: string;
  avatar_template: string;
  email: string;
  last_posted_at: string;
  last_seen_at: string;
  created_at: string;
  ignored: boolean;
  muted: boolean;
  can_ignore_user: boolean;
  can_mute_user: boolean;
  can_send_private_message_to_user: boolean;
  trust_level: number;
  moderator: boolean;
  admin: boolean;
  title: string | null;
  badge_count: number;
  time_read: number;
  recent_time_read: number;
  primary_group_id: number | null;
  primary_group_name: string | null;
  primary_group_flair_url: string | null;
  primary_group_flair_bg_color: string | null;
  primary_group_flair_color: string | null;
  featured_topic: any;
  staged: boolean;
  can_edit: boolean;
  can_invite_to_forum: boolean;
  can_invite_to_topic: boolean;
  can_send_private_message: boolean;
}

export interface CreateTopicRequest {
  title: string;
  raw: string;
  category?: number;
  tags?: string[];
}

export interface CreatePostRequest {
  topic_id: number;
  raw: string;
  reply_to_post_number?: number;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  success: boolean;
  requires_2fa?: boolean;
}

class DiscourseApi {
  private config: DiscourseConfig;

  constructor(config: DiscourseConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.config.apiKey) {
      headers['Api-Key'] = this.config.apiKey;
      if (this.config.username) {
        headers['Api-Username'] = this.config.username;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error_type || 'API Error',
        response.status,
        errorData
      );
    }

    return response.json();
  }

  // Fetch latest topics (latest.json)
  async fetchLatestTopics(): Promise<{ 
    topic_list: { 
      topics: Topic[] 
    }
  }> {
    return this.request('/latest.json');
  }

  // Fetch topic details (/t/{id}.json)
  async fetchTopicDetails(id: number): Promise<{ post_stream: { posts: Post[] } }> {
    return this.request(`/t/${id}.json`);
  }

  // Fetch categories (categories.json)
  async fetchCategories(): Promise<{ category_list: { categories: Category[] } }> {
    return this.request('/categories.json');
  }

  // Login user (/session)
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request('/session', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Create post (/posts)
  async createPost(data: CreatePostRequest): Promise<{ post: Post }> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Create topic (/posts with topic params)
  async createTopic(data: CreateTopicRequest): Promise<{ topic: Topic; post: Post }> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Fetch user profile
  async fetchUser(username: string): Promise<{ user: User }> {
    return this.request(`/u/${username}.json`);
  }

  // Search topics
  async searchTopics(query: string): Promise<{ 
    posts: Post[];
    topics: Topic[];
    users: User[];
    categories: Category[];
    grouped_search_result: any;
  }> {
    return this.request(`/search.json?q=${encodeURIComponent(query)}`);
  }

  // Get current user session
  async getCurrentUser(): Promise<{ user: User }> {
    return this.request('/session/current.json');
  }

  // Logout user
  async logout(): Promise<{ success: boolean }> {
    return this.request('/session', {
      method: 'DELETE',
    });
  }

  // Like/Unlike a post
  async toggleLike(postId: number): Promise<{ success: boolean }> {
    return this.request(`/post_actions`, {
      method: 'POST',
      body: JSON.stringify({
        id: postId,
        post_action_type_id: 2, // Like action type
        flag_topic: false,
      }),
    });
  }

  // Bookmark/Unbookmark a topic
  async toggleBookmark(topicId: number): Promise<{ success: boolean }> {
    return this.request(`/t/${topicId}/bookmark`, {
      method: 'POST',
    });
  }

  // Get user's bookmarks
  async getUserBookmarks(username: string): Promise<{ topic_list: { topics: Topic[] } }> {
    return this.request(`/u/${username}/bookmarks.json`);
  }

  // Get user's activity
  async getUserActivity(username: string): Promise<{ user_actions: any[] }> {
    return this.request(`/user_actions.json?username=${encodeURIComponent(username)}`);
  }

  // Get user's topics
  async getUserTopics(username: string): Promise<{ topic_list: { topics: Topic[] } }> {
    return this.request(`/topics/created-by/${username}.json`);
  }

  // Get user's posts
  async getUserPosts(username: string): Promise<{ user_actions: any[] }> {
    return this.request(`/user_actions.json?username=${encodeURIComponent(username)}&filter=5`); // 5 = posts
  }

  // Update user profile
  async updateUserProfile(username: string, data: Partial<User>): Promise<{ user: User }> {
    return this.request(`/u/${username}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Get notifications
  async getNotifications(): Promise<{ notifications: any[] }> {
    return this.request('/notifications.json');
  }

  // Mark notification as read
  async markNotificationRead(id: number): Promise<{ success: boolean }> {
    return this.request(`/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ read: true }),
    });
  }

  // Get trending topics
  async getTrendingTopics(): Promise<{ topic_list: { topics: Topic[] } }> {
    return this.request('/top.json');
  }

  // Get category topics
  async getCategoryTopics(categoryId: number): Promise<{ topic_list: { topics: Topic[] } }> {
    return this.request(`/c/${categoryId}.json`);
  }

  // Get tag topics
  async getTagTopics(tag: string): Promise<{ topic_list: { topics: Topic[] } }> {
    return this.request(`/tag/${encodeURIComponent(tag)}.json`);
  }
}

// Create and export default instance
export const discourseApi = new DiscourseApi({
  baseUrl: process.env.EXPO_PUBLIC_DISCOURSE_URL || 'https://meta.techrebels.info',
});

export default discourseApi;
