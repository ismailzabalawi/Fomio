import { createConfig } from '@gluestack-style/react';
import { config as baseConfig } from '@gluestack-ui/config';

export const readerModeConfig = createConfig({
  ...baseConfig,
  tokens: {
    ...baseConfig.tokens,
    colors: {
      ...baseConfig.tokens.colors,
      // Base colors for reader mode
      background: '#FAF4E6',  // Warm, paper-like background
      text: '#2E2C28',       // Soft black for comfortable reading
      border: '#D4C4A7',     // Subtle border color
      muted: '#6B635C',      // Muted text color
    },
    fonts: {
      ...baseConfig.tokens.fonts,
      body: 'Georgia, serif',
      heading: 'Georgia, serif',
    },
    fontSizes: {
      ...baseConfig.tokens.fontSizes,
      // Optimized sizes for reading
      xs: 14,
      sm: 16,
      md: 18,
      lg: 20,
      xl: 24,
      '2xl': 28,
      '3xl': 32,
    },
    lineHeights: {
      ...baseConfig.tokens.lineHeights,
      // Comfortable line heights for reading
      xs: 20,
      sm: 24,
      md: 28,
      lg: 32,
      xl: 36,
      '2xl': 40,
      '3xl': 44,
    },
    letterSpacings: {
      ...baseConfig.tokens.letterSpacings,
      tighter: -0.5,
      tight: -0.25,
      normal: 0,
      wide: 0.25,
      reading: 0.5,
    },
    space: {
      ...baseConfig.tokens.space,
      // Consistent spacing scale
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
    },
  },
  components: {
    ...baseConfig.components,
    Text: {
      theme: {
        variants: {
          reader: {
            color: '$text',
            fontFamily: '$body',
            fontSize: '$md',
            lineHeight: '$lg',
            letterSpacing: '$reading',
          }
        }
      }
    },
    Heading: {
      theme: {
        variants: {
          reader: {
            color: '$text',
            fontFamily: '$heading',
            fontWeight: '600',
            letterSpacing: '$tight',
            fontSize: '$xl',
          }
        }
      }
    },
    Box: {
      theme: {
        variants: {
          reader: {
            bg: '$background',
            borderColor: '$border',
          }
        }
      }
    },
    Container: {
      theme: {
        variants: {
          reader: {
            maxWidth: 720,
            px: '$6',
            py: '$4',
            mx: 'auto',
            bg: '$background',
          }
        }
      }
    },
    ScrollView: {
      theme: {
        variants: {
          reader: {
            bg: '$background',
            px: '$4',
          }
        }
      }
    },
    View: {
      theme: {
        variants: {
          reader: {
            bg: '$background',
          }
        }
      }
    },
    Pressable: {
      theme: {
        variants: {
          reader: {
            _hover: {
              opacity: 0.8,
            },
            _pressed: {
              opacity: 0.6,
            }
          }
        }
      }
    }
  }
}); 