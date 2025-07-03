import React from 'react';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { VStack, HStack } from '../ui/stack';
import { Avatar } from '../ui/Avatar';
import { Pressable } from 'react-native';
import { 
  ChatCircle,
  Heart,
  Repeat,
  ChartLineUp,
  Share,
  Bookmark,
  DotsThree
} from 'phosphor-react-native';

interface Author {
  name: string;
  handle: string;
  avatar: string;
}

interface Byte {
  id: string;
  author: Author;
  time: string;
  content: string;
  stats: {
    replies: number;
    retweets: number;
    likes: number;
    views: number;
  };
}

interface Props {
  bytes: Byte[];
  theme: 'light' | 'dark';
  isReaderMode?: boolean;
}

interface TrendingByteCardProps {
  byte: Byte;
  theme: 'light' | 'dark';
  isReaderMode?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function TrendingByteCard({ byte, theme, isReaderMode }: TrendingByteCardProps) {
  return (
    <Pressable
      onPress={() => {}}
      className={`
        rounded-2xl 
        overflow-hidden 
        mb-3
        ${isReaderMode 
          ? 'bg-background-100 border border-border-300' 
          : 'bg-background-50 dark:bg-background-900 border border-border-200 dark:border-border-800'
        }
      `}
    >
      <Box className="p-4">
        <VStack className="space-y-4">
          {/* Author Row */}
          <HStack className="items-center justify-between">
            <HStack className="space-x-3 items-center">
              <Avatar size="sm" bgColor={isReaderMode ? '$background200' : '$primary500'}>
                <Avatar.FallbackText>{byte.author.avatar}</Avatar.FallbackText>
              </Avatar>
              <VStack>
                <Text 
                  className={`
                    text-sm 
                    ${isReaderMode 
                      ? 'font-serif text-text-900' 
                      : 'font-semibold text-text-900 dark:text-text-50'
                    }
                  `}
                >
                  {byte.author.name}
                </Text>
                <Text 
                  className={`
                    text-xs 
                    ${isReaderMode 
                      ? 'font-serif text-text-700' 
                      : 'text-text-400 dark:text-text-500'
                    }
                  `}
                >
                  {byte.author.handle} · {byte.time}
                </Text>
              </VStack>
            </HStack>
            {!isReaderMode && (
              <DotsThree 
                size={20} 
                weight="bold" 
                color={theme === 'dark' ? '#8E8E93' : '#6B7280'} 
              />
            )}
          </HStack>

          {/* Byte Content */}
          <Text 
            className={`
              text-base 
              leading-relaxed
              ${isReaderMode 
                ? 'font-serif text-text-900' 
                : 'text-text-900 dark:text-text-50'
              }
            `}
          >
            {byte.content}
          </Text>

          {/* Action Stats - Only show in non-reader mode */}
          {!isReaderMode && (
            <HStack className="justify-between items-center">
              <HStack className="space-x-4">
                {[
                  { icon: <ChatCircle size={18} weight="bold" />, stat: byte.stats.replies },
                  { icon: <Repeat size={18} weight="bold" />, stat: byte.stats.retweets },
                  { icon: <Heart size={18} weight="bold" />, stat: byte.stats.likes },
                  { icon: <ChartLineUp size={18} weight="bold" />, stat: byte.stats.views },
                ].map((item, idx) => (
                  <HStack key={idx} className="space-x-1 items-center">
                    {item.icon}
                    <Text className="text-xs text-text-500">
                      {idx === 3 ? formatNumber(item.stat) : item.stat}
                    </Text>
                  </HStack>
                ))}
              </HStack>
              <HStack className="space-x-2">
                <Pressable>
                  <Share size={18} weight="bold" />
                </Pressable>
                <Pressable>
                  <Bookmark size={18} weight="bold" />
                </Pressable>
              </HStack>
            </HStack>
          )}
        </VStack>
      </Box>
    </Pressable>
  );
}

export default function TrendingBytes({ bytes, theme, isReaderMode }: Props) {
  return (
    <VStack 
      className={`
        px-4 
        space-y-4
        ${isReaderMode ? 'bg-background' : ''}
      `}
    >
      <Text 
        className={`
          text-xl 
          mb-2
          ${isReaderMode 
            ? 'font-serif text-text-900' 
            : 'font-bold text-text-900 dark:text-text-50'
          }
        `}
      >
        Trending Bytes
      </Text>

      {bytes.map((byte) => (
        <TrendingByteCard 
          key={byte.id} 
          byte={byte} 
          theme={theme} 
          isReaderMode={isReaderMode}
        />
      ))}
    </VStack>
  );
}
