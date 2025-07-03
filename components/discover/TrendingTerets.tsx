import React from 'react';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { Button, ButtonText } from '../ui/Button';
import { VStack, HStack } from '../ui/stack';
import { Pressable } from 'react-native';
import { Hash, DotsThree } from 'phosphor-react-native';

interface Topic {
  id: string;
  topic: string;
  tweets: string;
  category: string;
  isPromoted: boolean;
}

interface TrendingTeretsProps {
  topics: Topic[];
  theme: string;
  isReaderMode?: boolean;
}

export default function TrendingTerets({ topics, theme, isReaderMode }: TrendingTeretsProps) {
  return (
    <VStack 
      className={`
        px-4 
        space-y-4 
        mb-6 
        ${isReaderMode ? 'bg-background' : ''}
      `}
    >
      <HStack className="justify-between items-center">
        <Text 
          className={`
            text-xl 
            ${isReaderMode 
              ? 'font-serif text-text-900' 
              : 'font-bold text-text-900 dark:text-text-50'
            }
          `}
        >
          Trending Terets
        </Text>
        {!isReaderMode && (
          <Button variant="ghost" size="sm" onPress={() => {}}>
            <ButtonText>
              <DotsThree size={20} weight="bold" />
            </ButtonText>
          </Button>
        )}
      </HStack>

      <Box className="flex flex-row flex-wrap gap-3">
        {topics.map((topic) => (
          <Pressable
            key={topic.id}
            style={{ flex: 1, minWidth: '45%' }}
            onPress={() => {}}
          >
            <Box
              className={`
                p-4 
                rounded-2xl 
                ${isReaderMode 
                  ? 'bg-background-100 border border-border-300' 
                  : 'bg-background-50 dark:bg-background-900 border border-border-200 dark:border-border-800'
                }
              `}
            >
              <VStack className="space-y-2">
                <HStack className="items-center space-x-2">
                  <Hash
                    size={16}
                    weight="bold"
                    color={isReaderMode ? '#2E2C28' : theme === 'dark' ? '#8E8E93' : '#6B7280'}
                  />
                  <Text 
                    className={`
                      text-base 
                      ${isReaderMode 
                        ? 'font-serif text-text-900' 
                        : 'font-semibold text-text-900 dark:text-text-50'
                      }
                    `}
                  >
                    {topic.topic}
                  </Text>
                </HStack>
                <VStack className="space-y-1">
                  <Text 
                    className={`
                      text-sm 
                      ${isReaderMode 
                        ? 'font-serif text-text-700' 
                        : 'text-text-400 dark:text-text-500'
                      }
                    `}
                  >
                    {topic.category} · Trending
                  </Text>
                  <Text 
                    className={`
                      text-sm 
                      ${isReaderMode 
                        ? 'font-serif text-text-700' 
                        : 'text-text-400 dark:text-text-500'
                      }
                    `}
                  >
                    {topic.tweets} Tweets
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </Pressable>
        ))}
      </Box>
    </VStack>
  );
}
