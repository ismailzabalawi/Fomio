import { Config } from 'tailwindcss';

const config: Config = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light Theme
        light: {
          background: '#FFFFFF',
          primary: '#007AFF',
          accent: '#FF6B00',
          text: '#1C1C1E',
          secondaryBg: '#F2F2F7',
        },
        // Dark Theme
        dark: {
          background: '#000000',
          primary: '#0A84FF',
          accent: '#FF9F0A',
          text: '#F2F2F2',
          secondaryBg: '#1C1C1E',
        },
        // Reader Mode
        reader: {
          background: '#FAF4E6',
          text: '#2E2C28',
        },
      },
      fontFamily: {
        sans: ['Inter', 'System-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['SF Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
