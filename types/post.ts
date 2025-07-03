export type PostType = 'long' | 'picture' | 'gallery' | 'video' | 'poll';

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content?: string;
  image?: string;
  images?: string[];
  videoUrl?: string;
  pollOptions?: string[];
  votes?: Record<string, number>;
}