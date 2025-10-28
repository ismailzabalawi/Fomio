// Temporary stub API for Phase 1 - Backend upgrading
// This will be replaced with BFF integration in Phase 2

export interface User {
  id: number;
  username: string;
  name?: string;
  avatar_template?: string;
  trust_level: number;
  admin?: boolean;
  moderator?: boolean;
  title?: string;
  last_seen_at?: string;
  created_at?: string;
  email?: string;
  last_posted_at?: string;
  ignored?: boolean;
  muted?: boolean;
  can_ignore_user?: boolean;
  can_mute_user?: boolean;
  can_send_private_message_to_user?: boolean;
  badge_count?: number;
  time_read?: number;
  recent_time_read?: number;
  primary_group_id?: number | null;
  primary_group_name?: string | null;
  primary_group_flair_url?: string | null;
  primary_group_flair_bg_color?: string | null;
  primary_group_flair_color?: string | null;
  featured_topic?: any;
  staged?: boolean;
  can_edit?: boolean;
  can_invite_to_forum?: boolean;
  can_invite_to_topic?: boolean;
  can_send_private_message?: boolean;
}

export interface SignupResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface Topic {
  id: number;
  title: string;
  fancy_title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  created_at: string;
  last_posted_at: string;
  bumped: boolean;
  bumped_at: string;
  excerpt?: string;
  image_url?: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  bookmarked?: boolean;
  liked?: boolean;
  views: number;
  like_count: number;
  category_id: number;
  posters: Array<{
    user_id: number;
    extras: string;
    description: string;
  }>;
}

export interface Post {
  id: number;
  topic_id: number;
  post_number: number;
  user_id: number;
  username: string;
  name?: string;
  avatar_template?: string;
  cooked: string;
  raw: string;
  created_at: string;
  updated_at: string;
  reply_to_post_number?: number;
  reply_count: number;
  quote_count: number;
  incoming_link_count: number;
  reads: number;
  score: number;
  yours: boolean;
  topic_slug: string;
  topic_title: string;
  category_id: number;
  display_username: string;
  version: number;
  can_edit: boolean;
  can_delete: boolean;
  can_recover: boolean;
  can_wiki: boolean;
  read: boolean;
  user_title?: string;
  actions_summary: Array<{
    id: number;
    count: number;
    hidden: boolean;
    can_act: boolean;
  }>;
  moderator: boolean;
  admin: boolean;
  staff: boolean;
  hidden: boolean;
  trust_level: number;
  deleted_at?: string;
  user_deleted: boolean;
  edit_reason?: string;
  can_view_edit_history: boolean;
  wiki: boolean;
  reviewable_id?: number;
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

export interface LoginRequest {
  login: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

// Stub API class for Phase 1
class StubApi {
  async getLatestTopics() {
    console.log('🔄 Backend upgrading - getLatestTopics stubbed');
    return { topic_list: { topics: [] } };
  }

  async getCurrentUser() {
    console.log('🔄 Backend upgrading - getCurrentUser stubbed');
    return { user: null };
  }

  async getTopic(topicId: number) {
    console.log('🔄 Backend upgrading - getTopic stubbed');
    return { post_stream: { posts: [] } };
  }

  async getCategories() {
    console.log('🔄 Backend upgrading - getCategories stubbed');
    return { category_list: { categories: [] } };
  }

  async createTopic(
    categoryId: number,
    title: string,
    content: string,
    tags?: string[]
  ) {
    console.log('🔄 Backend upgrading - createTopic stubbed');
    throw new Error('Posting not available during backend upgrade');
  }

  async createPost(topicId: number, content: string) {
    console.log('🔄 Backend upgrading - createPost stubbed');
    throw new Error('Posting not available during backend upgrade');
  }

  async toggleLike(postId: number) {
    console.log('🔄 Backend upgrading - toggleLike stubbed');
    throw new Error('Actions not available during backend upgrade');
  }

  async toggleBookmark(topicId: number) {
    console.log('🔄 Backend upgrading - toggleBookmark stubbed');
    throw new Error('Actions not available during backend upgrade');
  }

  async search(query: string) {
    console.log('🔄 Backend upgrading - search stubbed');
    return { posts: [] };
  }

  async getNotifications() {
    console.log('🔄 Backend upgrading - getNotifications stubbed');
    return { notifications: [] };
  }

  async getUserBookmarks() {
    console.log('🔄 Backend upgrading - getUserBookmarks stubbed');
    return { topic_list: { topics: [] } };
  }

  isAuthenticated() {
    return false;
  }

  async logout() {
    console.log('🔄 Backend upgrading - logout stubbed');
    return { success: true };
  }

  async clearAuthTokens() {
    console.log('🔄 Backend upgrading - clearAuthTokens stubbed');
    return { success: true };
  }

  async handleWebViewAuth(cookies: {
    authToken: string;
    sessionCookie: string;
    csrfToken: string;
    userApiKey?: string;
  }) {
    console.log('🔄 Backend upgrading - handleWebViewAuth stubbed');
    return { success: true, user: null };
  }

  async fetchUser(username: string) {
    console.log('🔄 Backend upgrading - fetchUser stubbed');
    return { user: null };
  }

  async fetchCsrfToken() {
    console.log('🔄 Backend upgrading - fetchCsrfToken stubbed');
    return { csrf: 'stubbed' };
  }

  async setSessionCookie(cookie: string) {
    console.log('🔄 Backend upgrading - setSessionCookie stubbed');
    return { success: true };
  }

  getAvatarUrl(template: string, size: number) {
    console.log('🔄 Backend upgrading - getAvatarUrl stubbed');
    return `https://via.placeholder.com/${size}`;
  }

  async getUserProfile(username: string) {
    console.log('🔄 Backend upgrading - getUserProfile stubbed');
    return { success: true, data: null, error: null };
  }

  async getUserSettings(username: string) {
    console.log('🔄 Backend upgrading - getUserSettings stubbed');
    return { success: true, data: null, error: null };
  }

  async updateUserProfile(username: string, data: any) {
    console.log('🔄 Backend upgrading - updateUserProfile stubbed');
    return { success: true, data: null, error: null };
  }

  async updateUserSettings(username: string, data: any) {
    console.log('🔄 Backend upgrading - updateUserSettings stubbed');
    return { success: true, data: null, error: null };
  }

  async changePassword(currentPassword: string, newPassword: string) {
    console.log('🔄 Backend upgrading - changePassword stubbed');
    return { success: true, data: null, error: null };
  }

  async changeEmail(newEmail: string) {
    console.log('🔄 Backend upgrading - changeEmail stubbed');
    return { success: true, data: null, error: null };
  }

  async uploadAvatar(imageFile: any) {
    console.log('🔄 Backend upgrading - uploadAvatar stubbed');
    return { success: true, data: null, error: null };
  }
}

// Export stub instance
export const discourseApi = new StubApi();
export default discourseApi;
