import React from 'react';
import { Box } from '@gluestack-ui/themed';

export interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({
  children,
  defaultValue,
  value,
  onValueChange,
  className,
  ...props
}: TabsProps) {
  return (
    <Box className={className} {...props}>
      {children}
    </Box>
  );
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <Box className={className} {...props}>
      {children}
    </Box>
  );
}

export interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function TabsTrigger({ 
  children, 
  value, 
  className,
  ...props 
}: TabsTriggerProps) {
  return (
    <Box
      className={className}
      {...props}
    >
      {children}
    </Box>
  );
}

export interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function TabsContent({ 
  children, 
  value, 
  className,
  ...props 
}: TabsContentProps) {
  return (
    <Box className={className} {...props}>
      {children}
    </Box>
  );
}

