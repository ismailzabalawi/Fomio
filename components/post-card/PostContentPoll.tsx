import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Post } from '../../types/post';

type PollProps = {
  post: Post;
};

const PostContentPoll: React.FC<PollProps> = ({ post }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!post.pollOptions || post.pollOptions.length === 0) {
    return (
      <Text className="text-zinc-500 italic">No poll options provided.</Text>
    );
  }

  const handleVote = (option: string) => {
    if (!selectedOption) {
      setSelectedOption(option);
    }
  };

  return (
    <View className="space-y-3">
      {post.pollOptions.map((option: string) => (
        <TouchableOpacity
          key={option}
          className={`px-4 py-3 rounded-xl border ${
            selectedOption === option
              ? 'bg-blue-500 border-blue-500'
              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
          }`}
          onPress={() => handleVote(option)}
          accessibilityRole="button"
          accessibilityLabel={`Poll option: ${option}`}
        >
          <Text
            className={`text-center font-medium ${
              selectedOption === option ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PostContentPoll;