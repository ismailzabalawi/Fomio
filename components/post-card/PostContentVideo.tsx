import React from 'react';
import { View, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av'; // updated import
import { Post } from '../../types/post';

type Props = {
  post: Post;
};

const PostContentVideo: React.FC<Props> = ({ post }) => {
  if (!post.videoUrl) {
    return (
      <Text className="text-zinc-500 italic" accessibilityRole="text">
        No video available for this post.
      </Text>
    );
  }

  return (
    <View className="space-y-3">
      <Video
        source={{ uri: post.videoUrl }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        className="w-full h-64 rounded-xl"
        accessibilityLabel="Post video"
        accessibilityRole="image"
      />
    </View>
  );
};

export default PostContentVideo;