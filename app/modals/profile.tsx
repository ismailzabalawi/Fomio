import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, VStack, HStack, Text, Pressable, Avatar, Button } from '@gluestack-ui/themed';
import { useWindowDimensions } from 'react-native';
import { Trash } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import HeaderBar from '../../components/ui/HeaderBar';

interface UserPost {
  id: string;
  title: string;
  snippet: string;
  readTime: string;
}

interface ProfileModalProps {
  // Add props if needed for navigation, etc.
}

const profileImageUrl = 'https://example.com/profile.jpg';
const userPosts: UserPost[] = [
  { id: '1', title: 'End Of The Line For Uber', snippet: 'Why Uber Is Gone?', readTime: '7 min' },
  { id: '2', title: 'Building Community....', snippet: 'Why Need Better Community?', readTime: '7 min' },
  { id: '3', title: 'Why UX Is More.....', snippet: 'Why You Need UX In Design?', readTime: '7 min' },
];

function ProfileHeader() {
  return (
    <VStack alignItems="center" mt="$16" mb="$2" space="xs">
      <Avatar size="2xl" borderRadius="$full" accessibilityLabel="Profile picture">
        <Avatar.Image source={{ uri: profileImageUrl }} />
      </Avatar>
      <Text color="$textLight900" fontSize="$xl" fontWeight="$bold" mt="$2" accessibilityRole="header">
        Adom Shafi
      </Text>
      <Text color="$textLight500" fontSize="$md">App Designer at UI Hut</Text>
    </VStack>
  );
}

function ProfileStats() {
  return (
    <HStack justifyContent="space-around" my="$2" px="$4" accessibilityRole="summary">
      <VStack alignItems="center">
        <Text color="$textLight900" fontWeight="$semibold" fontSize="$lg">23k</Text>
        <Text color="$textLight500" fontSize="$sm">Followers</Text>
      </VStack>
      <VStack alignItems="center">
        <Text color="$textLight900" fontWeight="$semibold" fontSize="$lg">10</Text>
        <Text color="$textLight500" fontSize="$sm">Following</Text>
      </VStack>
      <VStack alignItems="center">
        <Text color="$textLight900" fontWeight="$semibold" fontSize="$lg">03</Text>
        <Text color="$textLight500" fontSize="$sm">Posts</Text>
      </VStack>
    </HStack>
  );
}

function EditProfileButton() {
  return (
    <Button
      alignSelf="center"
      px="$6"
      py="$2"
      borderRadius="$full"
      bg="$primary700"
      mt="$2"
      mb="$4"
      accessibilityRole="button"
      accessibilityLabel="Edit profile"
    >
      <Text color="$textLight900" fontWeight="$semibold">Edit</Text>
    </Button>
  );
}

interface UserPostsListProps {
  posts: UserPost[];
  onDelete: (postId: string) => void;
}

function UserPostsList({ posts, onDelete }: UserPostsListProps) {
  return (
    <VStack space="md" px="$4">
      {posts.map((post) => (
        <HStack
          key={post.id}
          justifyContent="space-between"
          alignItems="center"
          bg="$backgroundLight100"
          borderRadius="$lg"
          px="$4"
          py="$3"
          mb="$2"
        >
          <VStack flex={1} pr="$2">
            <Text color="$textLight900" fontWeight="$semibold" fontSize="$md">{post.title}</Text>
            <Text color="$textLight500" fontSize="$sm" mb="$1">{post.snippet}</Text>
            <Text color="$success600" fontSize="$xs">Read Time: {post.readTime}</Text>
          </VStack>
          <Pressable
            onPress={() => onDelete(post.id)}
            accessibilityRole="button"
            accessibilityLabel={`Delete post: ${post.title}`}
            hitSlop={8}
          >
            <Trash size={22} color="#EF4444" />
          </Pressable>
        </HStack>
      ))}
    </VStack>
  );
}

export function ProfileModal(props: ProfileModalProps) {
  const { height } = useWindowDimensions();
  const [posts, setPosts] = React.useState<UserPost[]>(userPosts);
  const router = useRouter();

  function handleDelete(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  function handleBackPress() {
    router.back();
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} bg="$backgroundLight100">
        <HeaderBar 
          title="@adom007" 
          showBackButton 
          showProfileButton={false}
          onBackPress={handleBackPress}
        />
        <Box flex={1} pt="$16">
          <ProfileHeader />
          <ProfileStats />
          <EditProfileButton />
          <UserPostsList posts={posts} onDelete={handleDelete} />
        </Box>
      </Box>
    </SafeAreaView>
  );
}
