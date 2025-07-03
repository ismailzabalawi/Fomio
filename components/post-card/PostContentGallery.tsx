import React from 'react';
import { ScrollView, Image, View, Text } from 'react-native';
import { Post } from '../../types/post';

type Props = {
  post: Post;
};

const PostContentGallery: React.FC<Props> = ({ post }) => {
  if (!Array.isArray(post.images) || post.images.length === 0) {
    return (
      <Text className="text-zinc-500 italic">No images available for this gallery.</Text>
    );
  }

  return (
    <View className="space-y-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row space-x-3"
        accessibilityLabel="Gallery of images"
      >
        {post.images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            className="w-64 h-48 rounded-xl"
            resizeMode="cover"
            accessibilityLabel={`Image ${index + 1}`}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default PostContentGallery;