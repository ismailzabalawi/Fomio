import React from 'react';
import { View, Text, Image } from 'react-native';
import { Post } from '../../types/post';

type Props = {
  post: Post;
};

const PostContentPicture: React.FC<Props> = ({ post }) => {
  if (!post.image) {
    return (
      <Text className="text-zinc-500 italic">No image provided for this post.</Text>
    );
  }

  return (
    <View className="space-y-2">
      <Image
        source={{ uri: post.image }}
        className="w-full h-80 rounded-xl"
        resizeMode="cover"
        accessibilityLabel="Post image"
      />
    </View>
  );
};

export default PostContentPicture;
