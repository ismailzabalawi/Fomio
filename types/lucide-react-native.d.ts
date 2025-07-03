declare module 'lucide-react-native' {
  import { ComponentType } from 'react';
  import { SvgProps } from 'react-native-svg';

  export interface LucideProps extends SvgProps {
    size?: number | string;
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
  }

  export const Home: ComponentType<LucideProps>;
  export const Grid: ComponentType<LucideProps>;
  export const PlusCircle: ComponentType<LucideProps>;
  export const Settings: ComponentType<LucideProps>;
  export const Menu: ComponentType<LucideProps>;
  export const Heart: ComponentType<LucideProps>;
  export const MessageCircle: ComponentType<LucideProps>;
  export const Share2: ComponentType<LucideProps>;
  export const MessageSquare: ComponentType<LucideProps>;
} 