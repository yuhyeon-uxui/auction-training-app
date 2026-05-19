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
      }
    },
  },
  plugins: [],
}
