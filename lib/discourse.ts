import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { v4 as uuidv4 } from 'uuid';
import { generateRsaKeypair, decryptPayloadBase64ToUtf8 } from './crypto';
import {
  savePrivateKey,
  loadPrivateKey,
  saveUserApiKey,
  loadUserApiKey,
  saveClientId,
  loadClientId,
} from './store';

// Configure WebBrowser for better UX
WebBrowser.maybeCompleteAuthSession();

const DISCOURSE_BASE_URL =
  Constants.expoConfig?.extra?.DISCOURSE_BASE_URL ||
  'https://meta.techrebels.info';

const APPLICATION_NAME =
  Constants.expoConfig?.extra?.APPLICATION_NAME || 'Fomio Mobile';

const SCOPES =
  Constants.expoConfig?.extra?.SCOPES || 'read,write,session,notifications';

const APP_SCHEME = Constants.expoConfig?.scheme || 'fomio';

export interface DiscourseSession {
  current_user: {
    id: number;
    username: string;
    name?: string;
    email?: string;
    avatar_template?: string;
    trust_level: number;
    admin?: boolean;
    moderator?: boolean;
  };
}

export interface DiscourseTopic {
  id: number;
  title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  highest_post_number: number;
  created_at: string;
  last_posted_at: string;
  bumped: boolean;
  bumped_at: string;
  archetype: string;
  archived: boolean;
  bookmarked?: boolean;
  liked?: boolean;
  views: number;
  like_count: number;
  has_summary: boolean;
  last_poster_username: string;
  category_id: number;
  pinned_globally: boolean;
  pinned: boolean;
  visible: boolean;
  closed: boolean;
  is_private_message: boolean;
  excerpt?: string;
  posters?: Array<{
    extras: string;
    description: string;
    user_id: number;
    primary_group_id: number | null;
  }>;
  author?: {
    id: number;
    username: string;
    name?: string;
    avatar_template?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface DiscourseLatestResponse {
  users: Array<{
    id: number;
    username: string;
    name?: string;
    avatar_template?: string;
  }>;
  topic_list: {
    can_create_topic: boolean;
    draft?: string;
    draft_key: string;
    draft_sequence: number;
    per_page: number;
    topics: DiscourseTopic[];
  };
}

export interface DiscourseSearchResponse {
  posts: Array<{
    id: number;
    topic_id: number;
    post_number: number;
    username: string;
    display_username: string;
    avatar_template?: string;
    created_at: string;
    blurb: string;
    category_id?: number;
    topic_title?: string;
  }>;
  topics?: DiscourseTopic[];
}

export interface DiscourseNotification {
  id: number;
  notification_type: number;
  read: boolean;
  created_at: string;
  post_number?: number;
  topic_id?: number;
  slug?: string;
  data: {
    username?: string;
    display_username?: string;
    avatar_template?: string;
    topic_title?: string;
    message?: string;
  };
}

export interface DiscourseNotificationsResponse {
  notifications: DiscourseNotification[];
  total_rows_notifications: number;
  seen_notification_id?: number;
}

export interface DiscourseCreateTopicResponse {
  topic: {
    id: number;
    title: string;
    slug: string;
    posts_count: number;
  };
  post: {
    id: number;
    post_number: number;
  };
}

/**
 * Authorize with Discourse using User API Keys
 * This initiates the OAuth-like flow where Discourse encrypts the API key
 * with our public key and returns it via redirect
 */
export async function authorizeWithDiscourse(): Promise<string> {
  // Ensure we have a private key (generate if missing)
  let privateKeyPem = await loadPrivateKey();
  if (!privateKeyPem) {
    const keypair = generateRsaKeypair();
    privateKeyPem = keypair.privateKeyPem;
    await savePrivateKey(privateKeyPem);
  }

  // Generate or load client ID
  let clientId = await loadClientId();
  if (!clientId) {
    clientId = uuidv4();
    await saveClientId(clientId);
  }

  // Generate nonce for this request
  const nonce = uuidv4();

  // Create redirect URI
  const redirectUri = Linking.createURL('/auth/callback', {
    scheme: APP_SCHEME,
  });

  // Extract public key from private key PEM
  const forge = require('node-forge');
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const publicKeyPem = forge.pki.publicKeyToPem(privateKey.publicKey);
  const publicKeyBase64 = publicKeyPem
    .replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, '')
    .trim();

  // Build authorization URL
  const authUrl = new URL(`${DISCOURSE_BASE_URL}/user-api-key/new`);
  authUrl.searchParams.set('application_name', APPLICATION_NAME);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('scopes', SCOPES);
  authUrl.searchParams.set('public_key', publicKeyBase64);
  authUrl.searchParams.set('auth_redirect', redirectUri);
  authUrl.searchParams.set('nonce', nonce);

  // Open browser for authorization
  const result = await WebBrowser.openAuthSessionAsync(
    authUrl.toString(),
    redirectUri
  );

  if (result.type === 'success' && result.url) {
    // Extract payload from redirect URL
    const url = new URL(result.url);
    const payload = url.searchParams.get('payload');

    if (!payload) {
      throw new Error('Missing redirect in Discourse settings');
    }

    // Decrypt payload
    const decryptedJson = decryptPayloadBase64ToUtf8(payload, privateKeyPem);
    const decrypted = JSON.parse(decryptedJson);

    if (!decrypted.key) {
      throw new Error('Invalid payload: missing API key');
    }

    // Verify nonce matches
    if (decrypted.nonce !== nonce) {
      throw new Error('Nonce mismatch: possible replay attack');
    }

    // Save API key
    await saveUserApiKey(decrypted.key);

    return decrypted.key;
  } else if (result.type === 'cancel') {
    throw new Error('Authentication was cancelled');
  } else {
    throw new Error('Authentication failed');
  }
}

/**
 * Make an authenticated API request to Discourse
 */
async function apiFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const apiKey = await loadUserApiKey();
  const clientId = await loadClientId();

  if (!apiKey) {
    throw new Error('Not authenticated. Please sign in.');
  }

  const url = `${DISCOURSE_BASE_URL}${path}`;
  const headers: HeadersInit = {
    'User-Api-Key': apiKey,
    'User-Api-Client-Id': clientId || '',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...init?.headers,
  };

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    if (response.status === 403) {
      throw new Error('Insufficient scopes. Please re-authenticate.');
    }
    throw new Error('Authentication failed. Please sign in again.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response;
}

/**
 * Get current session/user info
 */
export async function getSession(): Promise<DiscourseSession> {
  const response = await apiFetch('/session/current.json');
  return response.json();
}

/**
 * Get latest topics
 */
export async function getLatest(): Promise<DiscourseLatestResponse> {
  const response = await apiFetch('/latest.json');
  return response.json();
}

/**
 * Search topics
 */
export async function searchTopics(
  term: string
): Promise<DiscourseSearchResponse> {
  const encodedTerm = encodeURIComponent(term);
  const response = await apiFetch(`/search.json?q=${encodedTerm}`);
  return response.json();
}

/**
 * Get notifications
 */
export async function getNotifications(): Promise<DiscourseNotificationsResponse> {
  const response = await apiFetch('/notifications.json');
  return response.json();
}

/**
 * Create a new topic/post
 */
export async function createTopic(params: {
  title: string;
  raw: string;
  categoryId?: number;
}): Promise<DiscourseCreateTopicResponse> {
  const body: Record<string, any> = {
    title: params.title,
    raw: params.raw,
  };

  if (params.categoryId) {
    body.category = params.categoryId;
  }

  const response = await apiFetch('/posts.json', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return response.json();
}

/**
 * Revoke the current User API Key
 */
export async function revokeKey(): Promise<void> {
  try {
    await apiFetch('/user-api-key/revoke', {
      method: 'POST',
    });
  } catch (error) {
    // Even if revocation fails, we should clear local storage
    console.warn('Key revocation failed, clearing local storage:', error);
  }
}
