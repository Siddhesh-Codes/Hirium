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
          light: '#F6F4EE',
          dark: '#0E0E10',
        },
        canvas: {
          DEFAULT: '#F6F4EE',
          dark: '#0E0E10',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#17171A',
          subtle: '#EDEAE1',
          pure: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#121316',
          secondary: '#585A61',
          dark: '#EDEBE6',
        },
        muted: {
          DEFAULT: '#585A61',
          dark: '#9C978D',
          border: '#DCD7CB',
        },
        border: {
          DEFAULT: '#E3DFD4',
          dark: '#2A2A2D',
          strong: '#C8C3B5',
        },
        accent: {
          DEFAULT: '#C47D1C',
          hover: '#A66512',
          subtle: '#F8F1E4',
          darkSubtle: '#291E0B',
          ring: '#ECC993',
        },
        semantic: {
          success: '#1F6B3D',
          successBg: '#EEF6F0',
          danger: '#9B2C2C',
          dangerBg: '#FDF0F0',
          warning: '#B26A18',
          warningBg: '#FDF5E8',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '38px'],
        '4xl': ['42px', '50px'],
        '5xl': ['58px', '66px'],
        '6xl': ['72px', '80px'],
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(18, 19, 22, 0.04)',
        elevated: '0 4px 20px -2px rgba(18, 19, 22, 0.06), 0 2px 6px -1px rgba(18, 19, 22, 0.04)',
        premium: '0 20px 40px -15px rgba(18, 19, 22, 0.08), 0 0 0 1px rgba(18, 19, 22, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
