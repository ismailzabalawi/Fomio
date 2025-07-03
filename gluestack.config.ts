import { createConfig } from '@gluestack-style/react';
import { config as baseConfig } from '@gluestack-ui/config';

export const config = createConfig({
  ...baseConfig,
  tokens: {
    ...baseConfig.tokens,
    colors: {
      ...baseConfig.tokens.colors,
      light_background: '#FFFFFF',
      light_primary: '#007AFF',
      light_accent: '#FF6B00',
      light_text: '#1C1C1E',
      light_secondaryBg: '#F2F2F7',
      dark_background: '#000000',
      dark_primary: '#0A84FF',
      dark_accent: '#FF9F0A',
      dark_text: '#F2F2F2',
      dark_secondaryBg: '#1C1C1E',
      reader_background: '#FAF4E6',
      reader_text: '#2E2C28',
    },
    fonts: {
      ...baseConfig.tokens.fonts,
      body: 'Inter, System-ui, sans-serif',
      heading: 'Inter, System-ui, sans-serif',
      mono: 'SF Mono, monospace',
      serif: 'Georgia, serif',
    },
  },
  components: {
    ...baseConfig.components,
    Button: {
      theme: {
        variants: {
          solid: {
            bg: '$light_primary',
            _dark: { bg: '$dark_primary' },
            _reader: { bg: '$reader_text' },
          },
          outline: {
            borderColor: '$light_primary',
            _dark: { borderColor: '$dark_primary' },
            _reader: { borderColor: '$reader_text' },
          },
        },
        sizes: {
          sm: { px: '$3', py: '$2', _text: { fontSize: '$sm' } },
          md: { px: '$4', py: '$3', _text: { fontSize: '$md' } },
          lg: { px: '$5', py: '$4', _text: { fontSize: '$lg' } },
        },
      },
    },
    Input: {
      theme: {
        variants: {
          outline: {
            borderColor: '$light_secondaryBg',
            _dark: { borderColor: '$dark_secondaryBg' },
            _reader: {
              borderColor: '$reader_text',
              fontFamily: '$serif',
            },
          },
        },
      },
    },
    Card: {
      theme: {
        baseStyle: {
          bg: '$light_background',
          borderRadius: '$lg',
          p: '$4',
          _dark: { bg: '$dark_secondaryBg' },
          _reader: {
            bg: '$reader_background',
            borderColor: '$reader_text',
            borderWidth: 1,
          },
        },
      },
    },
    Container: {
      theme: {
        baseStyle: {
          px: '$4',
          width: '100%',
          maxWidth: 720,
          mx: 'auto',
        },
      },
    },
  },
});

export default config;
