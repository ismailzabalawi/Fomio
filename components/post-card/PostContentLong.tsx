import React from 'react';
import { View, Text, Image } from 'react-native';
import { Post } from '../../types/post';

type Props = {
  post: Post;
};

const PostContentLong: React.FC<Props> = ({ post }) => {
  return (
    <View className="space-y-4">
      {post.image && (
        <Image
          source={{ uri: post.image }}
          className="w-full h-56 rounded-xl"
          resizeMode="cover"
          accessibilityLabel="Post image"
        />
      )}
    </View>
  );
};

export default PostContentLong;
