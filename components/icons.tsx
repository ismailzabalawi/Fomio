import React from 'react';
import { PhosphorIcon, PhosphorIconProps } from './PhosphorIcon';

type IconProps = Omit<PhosphorIconProps, 'name'>;

export const HomeIcon: React.FC<IconProps> = (props) => (
  <PhosphorIcon name="House" weight="fill" {...props} />
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <PhosphorIcon name="MagnifyingGlass" {...props} />
);

export const CompassIcon: React.FC<IconProps> = (props) => (
  <PhosphorIcon name="Compass" {...props} />
);

export const ChatIcon: React.FC<IconProps> = (props) => (
  <PhosphorIcon name="ChatTeardropText" {...props} />
);

export const ProfileIcon: React.FC<IconProps> = (props) => (
  <PhosphorIcon name="User" {...props} />
);

export const CreateIcon: React.FC<IconProps> = (props) => (
  <PhosphorIcon name="PlusCircle" {...props} />
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <PhosphorIcon name="Gear" {...props} />
);

export const NotificationIcon: React.FC<IconProps> = (props) => (
  <PhosphorIcon name="Bell" {...props} />
); 