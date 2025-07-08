import React from 'react';
import { Avatar as GluestackAvatar, AvatarImage, AvatarFallbackText } from '@gluestack-ui/themed';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  className,
  ...props
}: AvatarProps) {
  return (
    <GluestackAvatar className={className} {...props}>
      {src && <AvatarImage source={{ uri: src }} alt={alt} />}
      <AvatarFallbackText>{fallback || alt || 'U'}</AvatarFallbackText>
    </GluestackAvatar>
  );
}

