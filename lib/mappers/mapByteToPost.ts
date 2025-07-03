import { Post } from '@/types/post';

export const mapByteToPost = (byte: any): Post => ({
  id: byte.id,
  type: byte.type,
  title: byte.title,
  content: byte.content,
  image: byte.image?.url,
  images: byte.images,
  videoUrl: byte.videoUrl,
  pollOptions: byte.pollOptions,
  votes: byte.votes,
});
