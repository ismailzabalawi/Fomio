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
import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import { logger } from '@/shared/logger';

// GraphQL queries and mutations
const FEED_QUERY = gql`
  query Feed($cursor: String, $limit: Int) {
    feed(cursor: $cursor, limit: $limit) {
      edges {
        id
        title
        fancy_title
        slug
        posts_count
        reply_count
        created_at
        last_posted_at
        bumped
        bumped_at
        excerpt
        image_url
        visible
        closed
        archived
        bookmarked
        liked
        views
        like_count
        category_id
        posters {
          user_id
          extras
          description
        }
        author {
          id
          username
          name
          avatar_template
        }
        category {
          id
          name
          slug
          color
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const TOPIC_QUERY = gql`
  query Topic($id: ID!) {
    topic(id: $id) {
      id
      title
      fancy_title
      slug
      posts_count
      reply_count
      created_at
      last_posted_at
      bumped
      bumped_at
      excerpt
      image_url
      visible
      closed
      archived
      bookmarked
      liked
      views
      like_count
      category_id
      posters {
        user_id
        extras
        description
      }
      author {
        id
        username
        name
        avatar_template
      }
      category {
        id
        name
        slug
        color
      }
    }
  }
`;

const TOPIC_POSTS_QUERY = gql`
  query TopicPosts($topicId: ID!, $page: Int) {
    topicPosts(topicId: $topicId, page: $page) {
      id
      topic_id
      content
      cooked
      author {
        id
        username
        name
        avatar_template
      }
      created_at
      updated_at
      post_number
      like_count
      liked
      bookmarked
    }
  }
`;

const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      slug
      color
      description
      topic_count
      post_count
    }
  }
`;

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    me {
      id
      username
      name
      avatar_template
      trust_level
      admin
      moderator
      title
      last_seen_at
      created_at
      email
      last_posted_at
      stats {
        posts_count
        topics_count
        likes_received
        followers_count
        following_count
      }
    }
  }
`;

const SEARCH_QUERY = gql`
  query Search($query: String!, $type: String, $limit: Int) {
    search(query: $query, type: $type, limit: $limit) {
      id
      title
      content
      type
      author {
        id
        username
        name
      }
      category {
        id
        name
      }
      created_at
    }
  }
`;

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      topicId
      postId
    }
  }
`;

const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId)
  }
`;

const UNLIKE_POST_MUTATION = gql`
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId)
  }
`;

const BOOKMARK_TOPIC_MUTATION = gql`
  mutation BookmarkTopic($topicId: ID!) {
    bookmarkTopic(topicId: $topicId)
  }
`;

const UNBOOKMARK_TOPIC_MUTATION = gql`
  mutation UnbookmarkTopic($topicId: ID!) {
    unbookmarkTopic(topicId: $topicId)
  }
`;

const NOTIFICATIONS_QUERY = gql`
  query Notifications {
    notifications {
      id
      type
      read
      created_at
      data
    }
  }
`;

const MARK_NOTIFICATION_READ_MUTATION = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id)
  }
`;

const MARK_ALL_NOTIFICATIONS_READ_MUTATION = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;

// Helper function to transform GraphQL topic to FeedItem
function transformGraphQLTopic(topic: any): FeedItem {
  return {
    id: topic.id.toString(),
    title: topic.title || 'Untitled',
    body: topic.excerpt,
    excerpt: topic.excerpt,
    author: {
      id: topic.author?.id?.toString() || '0',
      username: topic.author?.username || 'Unknown',
      name: topic.author?.name || topic.author?.username || 'Unknown',
      avatar: topic.author?.avatar_template
        ? `https://meta.techrebels.info${topic.author.avatar_template.replace('{size}', '150')}`
        : 'https://meta.techrebels.info/assets/default-avatar.png',
    },
    category: {
      id: topic.category?.id?.toString() || '0',
      name: topic.category?.name || 'General',
      slug: topic.category?.slug || 'general',
      color: topic.category?.color,
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

// Helper function to transform GraphQL post to Post
function transformGraphQLPost(post: any): Post {
  return {
    id: post.id.toString(),
    topicId: post.topic_id.toString(),
    content: post.content,
    cooked: post.cooked,
    author: {
      id: post.author?.id?.toString() || '0',
      username: post.author?.username || 'Unknown',
      name: post.author?.name || post.author?.username || 'Unknown',
      avatar: post.author?.avatar_template
        ? `https://meta.techrebels.info${post.author.avatar_template.replace('{size}', '150')}`
        : 'https://meta.techrebels.info/assets/default-avatar.png',
    },
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    postNumber: post.post_number || 0,
    likeCount: post.like_count || 0,
    isLiked: post.liked || false,
    isBookmarked: post.bookmarked || false,
  };
}

// Helper function to transform GraphQL category to Category
function transformGraphQLCategory(category: any): Category {
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

// Helper function to transform GraphQL user to User
function transformGraphQLUser(user: any): User {
  return {
    id: user.id.toString(),
    username: user.username,
    name: user.name,
    email: user.email,
    avatar: user.avatar_template
      ? `https://meta.techrebels.info${user.avatar_template.replace('{size}', '150')}`
      : 'https://meta.techrebels.info/assets/default-avatar.png',
    trustLevel: user.trust_level || 0,
    isAdmin: user.admin || false,
    isModerator: user.moderator || false,
    title: user.title,
    createdAt: user.created_at,
    lastSeenAt: user.last_seen_at,
    stats: {
      postsCount: user.stats?.posts_count || 0,
      topicsCount: user.stats?.topics_count || 0,
      likesReceived: user.stats?.likes_received || 0,
      followersCount: user.stats?.followers_count || 0,
      followingCount: user.stats?.following_count || 0,
    },
  };
}

export const gqlClient = (
  apollo: ApolloClient<NormalizedCacheObject>
): DataClient => ({
  async getFeed(params: FeedParams = {}): Promise<FeedItem[]> {
    try {
      const { data } = await apollo.query({
        query: FEED_QUERY,
        variables: {
          cursor: params.cursor || null,
          limit: params.limit || 20,
        },
        fetchPolicy: 'cache-first',
      });

      const topics = data.feed?.edges || [];
      logger.info('GraphQL Feed loaded', { topicCount: topics.length });

      return topics.map(transformGraphQLTopic);
    } catch (error) {
      logger.error('Failed to load feed via GraphQL', error);
      throw error;
    }
  },

  async getPost(id: string): Promise<Post> {
    try {
      const { data } = await apollo.query({
        query: gql`
          query Post($id: ID!) {
            post(id: $id) {
              id
              topic_id
              content
              cooked
              author {
                id
                username
                name
                avatar_template
              }
              created_at
              updated_at
              post_number
              like_count
              liked
              bookmarked
            }
          }
        `,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      return transformGraphQLPost(data.post);
    } catch (error) {
      logger.error('Failed to load post via GraphQL', error);
      throw error;
    }
  },

  async getTopicPosts(topicId: string, page: number = 0): Promise<Post[]> {
    try {
      const { data } = await apollo.query({
        query: TOPIC_POSTS_QUERY,
        variables: { topicId, page },
        fetchPolicy: 'cache-first',
      });

      const posts = data.topicPosts || [];
      return posts.map(transformGraphQLPost);
    } catch (error) {
      logger.error('Failed to load topic posts via GraphQL', error);
      throw error;
    }
  },

  async createPost(input: CreatePostInput): Promise<CreatePostResponse> {
    try {
      const { data } = await apollo.mutate({
        mutation: CREATE_POST_MUTATION,
        variables: { input },
      });

      logger.info('Post created via GraphQL', {
        topicId: data.createPost.topicId,
        postId: data.createPost.postId,
      });

      return data.createPost;
    } catch (error) {
      logger.error('Failed to create post via GraphQL', error);
      throw error;
    }
  },

  async getTopic(id: string): Promise<FeedItem> {
    try {
      const { data } = await apollo.query({
        query: TOPIC_QUERY,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      return transformGraphQLTopic(data.topic);
    } catch (error) {
      logger.error('Failed to load topic via GraphQL', error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const { data } = await apollo.query({
        query: CATEGORIES_QUERY,
        fetchPolicy: 'cache-first',
      });

      const categories = data.categories || [];
      return categories.map(transformGraphQLCategory);
    } catch (error) {
      logger.error('Failed to load categories via GraphQL', error);
      throw error;
    }
  },

  async getCategory(id: string): Promise<Category> {
    try {
      const { data } = await apollo.query({
        query: gql`
          query Category($id: ID!) {
            category(id: $id) {
              id
              name
              slug
              color
              description
              topic_count
              post_count
            }
          }
        `,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      return transformGraphQLCategory(data.category);
    } catch (error) {
      logger.error('Failed to load category via GraphQL', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await apollo.query({
        query: CURRENT_USER_QUERY,
        fetchPolicy: 'cache-first',
      });

      if (!data.me) {
        return null;
      }

      return transformGraphQLUser(data.me);
    } catch (error) {
      logger.error('Failed to get current user via GraphQL', error);
      return null;
    }
  },

  async getUser(id: string): Promise<User> {
    try {
      const { data } = await apollo.query({
        query: gql`
          query User($id: ID!) {
            user(id: $id) {
              id
              username
              name
              email
              avatar_template
              trust_level
              admin
              moderator
              title
              created_at
              last_seen_at
              stats {
                posts_count
                topics_count
                likes_received
                followers_count
                following_count
              }
            }
          }
        `,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      return transformGraphQLUser(data.user);
    } catch (error) {
      logger.error('Failed to get user via GraphQL', error);
      throw error;
    }
  },

  async search(params: SearchParams): Promise<SearchResult[]> {
    try {
      const { data } = await apollo.query({
        query: SEARCH_QUERY,
        variables: {
          query: params.query,
          type: params.type,
          limit: params.limit || 20,
        },
        fetchPolicy: 'cache-first',
      });

      return data.search || [];
    } catch (error) {
      logger.error('Failed to search via GraphQL', error);
      throw error;
    }
  },

  async likePost(postId: string): Promise<boolean> {
    try {
      const { data } = await apollo.mutate({
        mutation: LIKE_POST_MUTATION,
        variables: { postId },
      });

      return data.likePost;
    } catch (error) {
      logger.error('Failed to like post via GraphQL', error);
      return false;
    }
  },

  async unlikePost(postId: string): Promise<boolean> {
    try {
      const { data } = await apollo.mutate({
        mutation: UNLIKE_POST_MUTATION,
        variables: { postId },
      });

      return data.unlikePost;
    } catch (error) {
      logger.error('Failed to unlike post via GraphQL', error);
      return false;
    }
  },

  async bookmarkTopic(topicId: string): Promise<boolean> {
    try {
      const { data } = await apollo.mutate({
        mutation: BOOKMARK_TOPIC_MUTATION,
        variables: { topicId },
      });

      return data.bookmarkTopic;
    } catch (error) {
      logger.error('Failed to bookmark topic via GraphQL', error);
      return false;
    }
  },

  async unbookmarkTopic(topicId: string): Promise<boolean> {
    try {
      const { data } = await apollo.mutate({
        mutation: UNBOOKMARK_TOPIC_MUTATION,
        variables: { topicId },
      });

      return data.unbookmarkTopic;
    } catch (error) {
      logger.error('Failed to unbookmark topic via GraphQL', error);
      return false;
    }
  },

  async getNotifications(): Promise<Notification[]> {
    try {
      const { data } = await apollo.query({
        query: NOTIFICATIONS_QUERY,
        fetchPolicy: 'cache-first',
      });

      const notifications = data.notifications || [];
      return notifications.map((notif: any) => ({
        id: notif.id.toString(),
        type: notif.type,
        read: notif.read,
        createdAt: notif.created_at,
        data: notif.data || {},
      }));
    } catch (error) {
      logger.error('Failed to load notifications via GraphQL', error);
      throw error;
    }
  },

  async markNotificationAsRead(id: string): Promise<boolean> {
    try {
      const { data } = await apollo.mutate({
        mutation: MARK_NOTIFICATION_READ_MUTATION,
        variables: { id },
      });

      return data.markNotificationRead;
    } catch (error) {
      logger.error('Failed to mark notification as read via GraphQL', error);
      return false;
    }
  },

  async markAllNotificationsAsRead(): Promise<boolean> {
    try {
      const { data } = await apollo.mutate({
        mutation: MARK_ALL_NOTIFICATIONS_READ_MUTATION,
      });

      return data.markAllNotificationsRead;
    } catch (error) {
      logger.error(
        'Failed to mark all notifications as read via GraphQL',
        error
      );
      return false;
    }
  },

  async isHealthy(): Promise<boolean> {
    try {
      const { data } = await apollo.query({
        query: gql`
          query Health {
            health
          }
        `,
        fetchPolicy: 'network-only',
      });

      return data.health === true;
    } catch (error) {
      logger.warn('GraphQL API health check failed', error);
      return false;
    }
  },
});
