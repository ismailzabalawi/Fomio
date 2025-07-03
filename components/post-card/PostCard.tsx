import React from 'react';
import { View, Text } from 'react-native';
import { Post } from '../../types/post';
import PostContentLong from './PostContentLong';
import PostContentPicture from './PostContentPicture';
import PostContentGallery from './PostContentGallery';
import PostContentVideo from './PostContentVideo';
import PostContentPoll from './PostContentPoll';

type PostCardProps = {
  post: Post;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const renderContent = () => {
    switch (post.type) {
      case 'long':
        return <PostContentLong post={post} />;
      case 'picture':
        return <PostContentPicture post={post} />;
      case 'gallery':
        return <PostContentGallery post={post} />;
      case 'video':
        return <PostContentVideo post={post} />;
      case 'poll':
        return <PostContentPoll post={post} />;
      default:
        return (
          <View className="p-4">
            <Text className="text-red-500 font-semibold">
              Unsupported post type: {post.type}
            </Text>
          </View>
        );
    }
  };

  return (
    <View className="px-4">
      {renderContent()}
    </View>
  );
};

export default PostCard;