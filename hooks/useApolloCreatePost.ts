import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { logger } from '@/shared/logger';

// GraphQL mutation for creating a post
const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      author
      createdAt
      content
      categoryId
    }
  }
`;

export interface CreatePostInput {
  title: string;
  content: string;
  categoryId?: number;
}

export interface CreatePostResponse {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
  categoryId: number;
}

export function useApolloCreatePost() {
  const [mutate, { loading, error, data }] = useMutation<
    { createPost: CreatePostResponse },
    { input: CreatePostInput }
  >(CREATE_POST_MUTATION, {
    // Optimistic response for instant UI feedback
    optimisticResponse: (vars) => {
      return {
        __typename: 'Mutation',
        createPost: {
          __typename: 'Post',
          id: `temp:${Math.random().toString(36).slice(2)}`,
          title: vars.input.title,
          author: 'You',
          createdAt: new Date().toISOString(),
          content: vars.input.content,
          categoryId: vars.input.categoryId || 0,
        },
      };
    },
    // Update cache after mutation
    update: (cache, { data: mutationData }) => {
      if (!mutationData?.createPost) return;

      const created = mutationData.createPost;
      logger.info('Creating post optimistically', { id: created.id });

      // Update the feed cache to include the new post
      try {
        cache.modify({
          fields: {
            feed(existingFeed = { edges: [], pageInfo: {} }) {
              // Prepend the new post to the feed
              return {
                ...existingFeed,
                edges: [created, ...existingFeed.edges],
              };
            },
          },
        });
        logger.info('Feed cache updated with new post');
      } catch (error) {
        logger.error('Failed to update feed cache', error);
      }
    },
    // Error handling
    onError: (error) => {
      logger.error('Create post mutation failed', error);
    },
    // Success handling
    onCompleted: (data) => {
      logger.info('Post created successfully', data.createPost);
    },
  });

  const createPost = async (input: CreatePostInput) => {
    try {
      const result = await mutate({
        variables: { input },
      });
      return result.data?.createPost;
    } catch (err) {
      logger.error('Error creating post', err);
      throw err;
    }
  };

  return {
    createPost,
    loading,
    error,
    data: data?.createPost,
  };
}
