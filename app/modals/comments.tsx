import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import { ArrowLeft, ChatCircle } from 'phosphor-react-native';
import { Avatar } from '@gluestack-ui/themed';
import { Container } from '../../components/ui/Container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import HeaderBar from '../../components/ui/HeaderBar';

// Sample data for Comments screen
const commentsData = [
  {
    id: '1',
    author: 'Adom Shafi',
    authorAvatar: '👨‍💻',
    content: 'This is very useful blog post, I love this!',
    timeAgo: '20 min ago',
    likes: 12,
    replies: [],
  },
  {
    id: '2',
    author: 'Sarah Johnson',
    authorAvatar: '👩‍🎨',
    content: 'Great insights! I especially liked the part about user research methodologies.',
    timeAgo: '1 hour ago',
    likes: 8,
    replies: [
      {
        id: '2-1',
        author: 'Mansurul Haque',
        authorAvatar: '👨‍🏫',
        content: 'Thank you Sarah! I spent a lot of time researching those methodologies.',
        timeAgo: '45 min ago',
        likes: 5,
      },
      {
        id: '2-2',
        author: 'Alex Chen',
        authorAvatar: '👨‍💼',
        content: 'I agree with Sarah. The research section was particularly insightful.',
        timeAgo: '30 min ago',
        likes: 3,
      }
    ],
  },
  {
    id: '3',
    author: 'Moinul Haque',
    authorAvatar: '👨‍🔬',
    content: "I've been implementing these principles in my recent projects with great results!",
    timeAgo: '3 hours ago',
    likes: 15,
    replies: [],
  },
];

export default function CommentsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [commentText, setCommentText] = useState('');
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#FFFFFF',
          text: '#1C1C1E',
          secondaryText: '#8E8E93',
          cardBg: '#F2F2F7',
          inputBg: '#F2F2F7',
          divider: '#E5E5EA',
          sendButton: '#007AFF',
          replyBg: '#F2F2F7',
        };
      case 'dark':
        return {
          background: '#000000',
          text: '#F2F2F2',
          secondaryText: '#8E8E93',
          cardBg: '#1C1C1E',
          inputBg: '#1C1C1E',
          divider: '#2C2C2E',
          sendButton: '#0A84FF',
          replyBg: '#1C1C1E',
        };
      case 'reader':
        return {
          background: '#FAF4E6',
          text: '#2E2C28',
          secondaryText: '#6C6A67',
          cardBg: '#E5DBC0',
          inputBg: '#E5DBC0',
          divider: '#D8CCAF',
          sendButton: '#5D5B57',
          replyBg: '#E5DBC0',
        };
      default:
        return {
          background: '#000000', // Default to dark theme as per wireframe
          text: '#F2F2F2',
          secondaryText: '#8E8E93',
          cardBg: '#1C1C1E',
          inputBg: '#1C1C1E',
          divider: '#2C2C2E',
          sendButton: '#0A84FF',
          replyBg: '#1C1C1E',
        };
    }
  };
  
  const colors = getColors();
  
  const handleSendComment = () => {
    // In a real app, this would send the comment to the backend
    console.log('Sending comment:', commentText);
    setCommentText('');
  };

  const handleBackPress = () => {
    router.push('/(tabs)/home');
  };
  
  const renderReplies = (replies: Array<{
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    timeAgo: string;
    likes: number;
  }>) => {
    if (!replies || replies.length === 0) return null;
    
    return (
      <View style={styles.repliesContainer}>
        {replies.map((reply) => (
          <View 
            key={reply.id} 
            style={[styles.replyCard, { backgroundColor: colors.replyBg }]}
          >
            <View style={styles.commentHeader}>
              <View style={styles.authorContainer}>
                <View style={styles.authorAvatar}>
                  <Text>{reply.authorAvatar}</Text>
                </View>
                <View>
                  <Text style={[styles.authorName, { color: colors.text }]}>
                    {reply.author}
                  </Text>
                  <Text style={[styles.commentTime, { color: colors.secondaryText }]}>
                    {reply.timeAgo}
                  </Text>
                </View>
              </View>
            </View>
            
            <Text style={[styles.commentContent, { color: colors.text }]}>
              {reply.content}
            </Text>
            
            <View style={styles.commentActions}>
              <TouchableOpacity style={styles.likeButton}>
                <Text style={[styles.likeText, { color: colors.secondaryText }]}>
                  ♥ {reply.likes} likes
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.replyButton}>
                <Text style={[styles.replyText, { color: colors.secondaryText }]}>
                  Reply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <HeaderBar 
          title="Comments" 
          showBackButton={true}
          showProfileButton={false}
          onBackPress={handleBackPress}
        />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          {/* Comments Section */}
          <View style={styles.commentsSection}>
            {commentsData.map((comment) => (
              <View key={comment.id} style={styles.commentWrapper}>
                <View style={[styles.commentCard, { backgroundColor: colors.cardBg }]}>
                  <View style={styles.commentHeader}>
                    <View style={styles.authorContainer}>
                      <View style={styles.authorAvatar}>
                        <Text>{comment.authorAvatar}</Text>
                      </View>
                      <View>
                        <Text style={[styles.authorName, { color: colors.text }]}>
                          {comment.author}
                        </Text>
                        <Text style={[styles.commentTime, { color: colors.secondaryText }]}>
                          {comment.timeAgo}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={[styles.commentContent, { color: colors.text }]}>
                    {comment.content}
                  </Text>
                  
                  <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.likeButton}>
                      <Text style={[styles.likeText, { color: colors.secondaryText }]}>
                        ♥ {comment.likes} likes
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.replyButton}>
                      <Text style={[styles.replyText, { color: colors.secondaryText }]}>
                        Reply
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Replies */}
                {renderReplies(comment.replies)}
              </View>
            ))}
          </View>
          
          {/* Bottom padding for input field */}
          <View style={styles.bottomPadding} />
        </ScrollView>
        
        {/* Comment Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Add a comment..."
              placeholderTextColor={colors.secondaryText}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: colors.sendButton }]}
              onPress={handleSendComment}
            >
              <ChatCircle size={20} color="#FFFFFF" weight="bold" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  commentWrapper: {
    marginBottom: 16,
  },
  commentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 14,
  },
  commentContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeButton: {
    paddingVertical: 4,
  },
  likeText: {
    fontSize: 14,
  },
  replyButton: {
    paddingVertical: 4,
  },
  replyText: {
    fontSize: 14,
  },
  repliesContainer: {
    paddingLeft: 24,
  },
  replyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  bottomPadding: {
    height: 100,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
