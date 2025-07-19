import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ByteBlogPage } from '../../components/feed/ByteBlogPage';
import { useTheme } from '../../components/shared/theme-provider';

// UI Spec: Dynamic Byte Detail Route — Renders ByteBlogPage with data from route params
// Provides seamless navigation from feed to detailed byte view with proper theming
export default function ByteDetailScreen(): JSX.Element {
  const { byteId } = useLocalSearchParams<{ byteId: string }>();
  const { isDark, isAmoled } = useTheme();
  
  console.log('ByteDetailScreen rendered with byteId:', byteId);
  
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#18181b' : '#ffffff'),
  };
  
  // Mock data for the byte - in a real app, this would come from an API
  // based on the byteId parameter
  const mockByteData = {
    author: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    teretTitle: 'React Native',
    title: 'Getting Started with React Native',
    content: [
      { type: 'paragraph' as const, text: 'Just published my first React Native app! The development experience is amazing. The hot reload feature alone makes development so much faster.' },
      { type: 'heading' as const, text: 'Key Learnings' },
      { type: 'paragraph' as const, text: 'The hot reload feature is a game-changer. Being able to see changes instantly without rebuilding the entire app makes the development process incredibly smooth.' },
      { type: 'paragraph' as const, text: 'Another great aspect is the cross-platform nature. Writing once and running on both iOS and Android is exactly what I was looking for.' },
      { type: 'heading' as const, text: 'Next Steps' },
      { type: 'paragraph' as const, text: 'I\'m excited to explore more advanced features like native modules and performance optimization. The community around React Native is incredibly supportive.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    likes: 42,
    comments: 8,
    isBookmarked: false,
  };

  const handleLike = (): void => {
    console.log('Like pressed for byte:', byteId);
  };

  const handleComment = (): void => {
    console.log('Comment pressed for byte:', byteId);
  };

  const handleShare = (): void => {
    console.log('Share pressed for byte:', byteId);
  };

  const handleBookmark = (): void => {
    console.log('Bookmark pressed for byte:', byteId);
  };

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.background }]}>
      <ByteBlogPage
        author={mockByteData.author}
        teretTitle={mockByteData.teretTitle}
        title={mockByteData.title}
        content={mockByteData.content}
        coverImage={mockByteData.coverImage}
        likes={mockByteData.likes}
        comments={mockByteData.comments}
        isBookmarked={mockByteData.isBookmarked}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onBookmark={handleBookmark}
        initialCommentsVisible={false}
      />
    </SafeAreaView>
  );
} 