import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          light: '#F7F5F1',
          dark: '#0E0E10',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#17171A',
          subtle: '#F0ECE4',
        },
        ink: {
          DEFAULT: '#161513',
          dark: '#EDEBE6',
        },
        muted: {
          DEFAULT: '#6B675F',
          dark: '#9C978D',
          border: '#D8D3C8',
        },
        border: {
          DEFAULT: '#E4E0D8',
          dark: '#2A2A2D',
          strong: '#C9C4B9',
        },
        accent: {
          DEFAULT: '#B9852F',
          hover: '#A37324',
          subtle: '#F7EFE1',
          darkSubtle: '#291E0B',
          ring: '#E8D4B0',
        },
        semantic: {
          success: '#3E7A4C',
          successBg: '#EEF6F0',
          danger: '#B3402F',
          dangerBg: '#FCEFEB',
          warning: '#C08A2E',
          warningBg: '#FDF7E7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['28px', '36px'],
        '4xl': ['40px', '48px'],
        '5xl': ['56px', '64px'],
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.04)',
        elevated: '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
