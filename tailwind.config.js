/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#0a0a0a',
          sidebar: '#111111',
          card: '#1a1a1a',
          cardHover: '#222222'
        },
        accent: {
          blue: '#3B82F6',
          blueHover: '#2563EB',
          light: '#60A5FA',
          lighter: '#93C5FD'
        },
        text: {
          main: '#f0f0f0',
          muted: '#a0a0a0'
        },
        danger: '#ff4444',
        success: '#00c851'
      },
      fontSize: {
        '6xl': ['64px', { lineHeight: '1.13' }],
        '5xl': ['48px', { lineHeight: '1.17' }],
        '4xl': ['40px', { lineHeight: '1.2' }],
        '3xl': ['32px', { lineHeight: '1.5' }],
        '2xl': ['24px', { lineHeight: '1.5' }],
        'xl':  ['20px', { lineHeight: '1.5' }],
        'lg':  ['18px', { lineHeight: '1.56' }],
        'base':['16px', { lineHeight: '1.63' }],
        'sm':  ['14px', { lineHeight: '1.57' }],
        'xs':  ['12px', { lineHeight: '1.5' }],
        'xxs': ['11px', { lineHeight: '1.64' }],
      }
    },
  },
  plugins: [],
}
