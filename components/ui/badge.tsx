import React from 'react';
import { Badge as GluestackBadge, BadgeText } from '@gluestack-ui/themed';

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <GluestackBadge
      className={className}
      {...props}
    >
      <BadgeText>{children}</BadgeText>
    </GluestackBadge>
  );
}

