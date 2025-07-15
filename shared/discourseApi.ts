import AsyncStorage from '@react-native-async-storage/async-storage';

// Discourse API Configuration
export interface DiscourseConfig {
  baseUrl: string;
  apiKey?: string;
  apiUsername?: string;
}

// User Profile Types
export interface DiscourseUser {
  id: number;
  username: string;
  name?: string;
  email?: string;
  avatar_template: string;
  bio_raw?: string;
  location?: string;
  website?: string;
  date_of_birth?: string;
  trust_level: number;
  badge_count: number;
  post_count: number;
  topic_count: number;
  likes_given: number;
  likes_received: number;
  time_read: number;
  days_visited: number;
  last_seen_at: string;
  created_at: string;
  can_edit: boolean;
  can_edit_username: boolean;
  can_edit_email: boolean;
  can_edit_name: boolean;
}

// Settings Types
export interface UserSettings {
  email_digests: boolean;
  email_level: number;
  email_messages_level: number;
  mailing_list_mode: boolean;
  email_previous_replies: number;
  email_in_reply_to: boolean;
  include_tl0_in_digests: boolean;
  automatically_unpin_topics: boolean;
  push_notifications: boolean;
  push_notifications_alert: boolean;
  push_notifications_sound: boolean;
  theme_ids: number[];
  dark_scheme_id?: number;
  text_size: string;
  title_count_mode: string;
  timezone: string;
  skip_new_user_tips: boolean;
  hide_profile_and_presence: boolean;
  allow_private_messages: boolean;
  external_links_in_new_tab: boolean;
  dynamic_favicon: boolean;
  enable_quoting: boolean;
  enable_defer: boolean;
  digest_after_minutes: number;
  new_topic_duration_minutes: number;
  auto_track_topics_after_msecs: number;
  notification_level_when_replying: number;
  like_notification_frequency: number;
}

// API Response Types
export interface DiscourseApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}

export interface LoginResponse {
  user: DiscourseUser;
  token: string;
  refresh_token?: string;
}

class DiscourseApiService {
  private config: DiscourseConfig;
  private authToken: string | null = null;

  constructor(config: DiscourseConfig) {
    this.config = config;
    this.loadAuthToken();
  }

  // Authentication Methods
  private async loadAuthToken(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('discourse_auth_token');
      this.authToken = token;
    } catch (error) {
      console.error('Failed to load auth token:', error);
    }
  }

  private async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('discourse_auth_token', token);
      this.authToken = token;
    } catch (error) {
      console.error('Failed to save auth token:', error);
    }
  }

  private async clearAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('discourse_auth_token');
      this.authToken = null;
    } catch (error) {
      console.error('Failed to clear auth token:', error);
    }
  }

  // HTTP Request Helper
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<DiscourseApiResponse<T>> {
    try {
      const url = `${this.config.baseUrl}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Api-Key': this.config.apiKey || '',
        'Api-Username': this.config.apiUsername || '',
        ...options.headers,
      };

      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
          errors: data.errors,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication API
  async login(username: string, password: string): Promise<DiscourseApiResponse<LoginResponse>> {
    const response = await this.makeRequest<LoginResponse>('/session', {
      method: 'POST',
      body: JSON.stringify({
        login: username,
        password,
      }),
    });

    if (response.success && response.data?.token) {
      await this.saveAuthToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<DiscourseApiResponse<void>> {
    const response = await this.makeRequest<void>('/session/current', {
      method: 'DELETE',
    });

    await this.clearAuthToken();
    return response;
  }

  async getCurrentUser(): Promise<DiscourseApiResponse<DiscourseUser>> {
    return this.makeRequest<DiscourseUser>('/session/current.json');
  }

  // User Profile API
  async getUserProfile(username: string): Promise<DiscourseApiResponse<DiscourseUser>> {
    return this.makeRequest<DiscourseUser>(`/users/${username}.json`);
  }

  async updateUserProfile(
    username: string,
    updates: Partial<DiscourseUser>
  ): Promise<DiscourseApiResponse<DiscourseUser>> {
    return this.makeRequest<DiscourseUser>(`/users/${username}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async uploadAvatar(username: string, imageFile: File): Promise<DiscourseApiResponse<any>> {
    const formData = new FormData();
    formData.append('upload', imageFile);
    formData.append('type', 'avatar');

    return this.makeRequest<any>(`/users/${username}/preferences/avatar/pick`, {
      method: 'PUT',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let the browser set it
      },
    });
  }

  // User Settings API
  async getUserSettings(username: string): Promise<DiscourseApiResponse<UserSettings>> {
    return this.makeRequest<UserSettings>(`/users/${username}/preferences.json`);
  }

  async updateUserSettings(
    username: string,
    settings: Partial<UserSettings>
  ): Promise<DiscourseApiResponse<UserSettings>> {
    return this.makeRequest<UserSettings>(`/users/${username}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Password Management
  async changePassword(
    username: string,
    currentPassword: string,
    newPassword: string
  ): Promise<DiscourseApiResponse<void>> {
    return this.makeRequest<void>(`/users/${username}/preferences/password`, {
      method: 'PUT',
      body: JSON.stringify({
        password: currentPassword,
        new_password: newPassword,
      }),
    });
  }

  // Email Management
  async changeEmail(
    username: string,
    newEmail: string
  ): Promise<DiscourseApiResponse<void>> {
    return this.makeRequest<void>(`/users/${username}/preferences/email`, {
      method: 'PUT',
      body: JSON.stringify({
        email: newEmail,
      }),
    });
  }

  // Notification Preferences
  async updateNotificationSettings(
    username: string,
    settings: Partial<UserSettings>
  ): Promise<DiscourseApiResponse<UserSettings>> {
    return this.updateUserSettings(username, settings);
  }

  // Theme and Appearance
  async getAvailableThemes(): Promise<DiscourseApiResponse<any[]>> {
    return this.makeRequest<any[]>('/admin/themes.json');
  }

  async updateThemePreference(
    username: string,
    themeId: number,
    darkSchemeId?: number
  ): Promise<DiscourseApiResponse<UserSettings>> {
    return this.updateUserSettings(username, {
      theme_ids: [themeId],
      dark_scheme_id: darkSchemeId,
    });
  }

  // Privacy Settings
  async updatePrivacySettings(
    username: string,
    settings: {
      hide_profile_and_presence?: boolean;
      allow_private_messages?: boolean;
    }
  ): Promise<DiscourseApiResponse<UserSettings>> {
    return this.updateUserSettings(username, settings);
  }

  // Account Deletion
  async deleteAccount(username: string, password: string): Promise<DiscourseApiResponse<void>> {
    return this.makeRequest<void>(`/users/${username}`, {
      method: 'DELETE',
      body: JSON.stringify({
        password,
      }),
    });
  }

  // Utility Methods
  getAvatarUrl(avatarTemplate: string, size: number = 120): string {
    return `${this.config.baseUrl}${avatarTemplate.replace('{size}', size.toString())}`;
  }

  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  updateConfig(config: Partial<DiscourseConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Default configuration (should be set from environment or config)
const defaultConfig: DiscourseConfig = {
  baseUrl: process.env.EXPO_PUBLIC_DISCOURSE_URL || 'https://your-discourse-instance.com',
  apiKey: process.env.EXPO_PUBLIC_DISCOURSE_API_KEY,
  apiUsername: process.env.EXPO_PUBLIC_DISCOURSE_API_USERNAME,
};

// Export singleton instance
export const discourseApi = new DiscourseApiService(defaultConfig);

// Export types and service class
export { DiscourseApiService };
export default discourseApi;

