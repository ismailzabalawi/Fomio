import { useState } from 'react';
import { useAuth } from './useAuth';

export interface Byte {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  tags: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface CreateByteData {
  content: string;
  tags: string[];
}

export function useCreateByte() {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const createByte = async (data: CreateByteData): Promise<{ success: boolean; byte?: Byte; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (!data.content.trim()) {
      return { success: false, error: 'Content cannot be empty' };
    }

    if (data.content.length > 280) {
      return { success: false, error: 'Content exceeds character limit' };
    }

    setIsCreating(true);

    try {
      // TODO: Implement actual API call
      // For now, simulate byte creation
      const newByte: Byte = {
        id: Date.now().toString(),
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
        },
        content: data.content.trim(),
        tags: data.tags,
        timestamp: 'now',
        likes: 0,
        comments: 0,
        isLiked: false,
        createdAt: new Date(),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsCreating(false);
      return { success: true, byte: newByte };
    } catch (error) {
      console.error('Create byte error:', error);
      setIsCreating(false);
      return { success: false, error: 'Failed to create byte' };
    }
  };

  const validateContent = (content: string): { isValid: boolean; error?: string } => {
    if (!content.trim()) {
      return { isValid: false, error: 'Content cannot be empty' };
    }

    if (content.length > 280) {
      return { isValid: false, error: 'Content exceeds 280 character limit' };
    }

    return { isValid: true };
  };

  const validateTags = (tags: string[]): { isValid: boolean; error?: string } => {
    if (tags.length > 5) {
      return { isValid: false, error: 'Maximum 5 tags allowed' };
    }

    for (const tag of tags) {
      if (tag.length > 20) {
        return { isValid: false, error: 'Tag cannot exceed 20 characters' };
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(tag)) {
        return { isValid: false, error: 'Tags can only contain letters, numbers, and underscores' };
      }
    }

    return { isValid: true };
  };

  const validateByte = (data: CreateByteData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    const contentValidation = validateContent(data.content);
    if (!contentValidation.isValid && contentValidation.error) {
      errors.push(contentValidation.error);
    }

    const tagsValidation = validateTags(data.tags);
    if (!tagsValidation.isValid && tagsValidation.error) {
      errors.push(tagsValidation.error);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  return {
    isCreating,
    createByte,
    validateContent,
    validateTags,
    validateByte,
  };
}

