import React from 'react';
import { Box, Heading, Text } from '@gluestack-ui/themed';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <Box
      className={className}
      {...props}
    >
      {children}
    </Box>
  );
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <Box className={className} {...props}>
      {children}
    </Box>
  );
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <Heading className={className} {...props}>
      {children}
    </Heading>
  );
}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <Text className={className} {...props}>
      {children}
    </Text>
  );
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <Box className={className} {...props}>
      {children}
    </Box>
  );
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <Box className={className} {...props}>
      {children}
    </Box>
  );
}

