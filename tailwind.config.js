/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: { 50: '#f5f5f7', 100: '#86868b', 200: '#6e6e73', 300: '#1a1a1a', 400: '#111111', 500: '#0a0a0a', 600: '#050505' },
        accent: { blue: '#2997ff', green: '#30d158', orange: '#ff9f0a', purple: '#bf5af2', red: '#ff453a', teal: '#64d2ff', pink: '#ff375f', gold: '#ffd60a' },
      },
      fontFamily: {
        // Malayalam headline + body font
        malayalam: [
          'var(--font-noto-malayalam)',
          '"Noto Sans Malayalam"',
          // System Malayalam fallbacks — ensures glyphs render even before font loads
          '"Malayalam MN"',
          '"Kartika"',
          'sans-serif',
        ],
        // General UI sans-serif — system stack, never monospace
        sans: [
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        // Monospace explicitly for code/kbd elements
        mono: [
          'var(--font-ibm-plex-mono)',
          '"IBM Plex Mono"',
          '"Fira Code"',
          'monospace',
        ],
      },
      lineHeight: {
        // Malayalam-optimised line heights
        'ml-tight':  '1.55',
        'ml-normal': '1.75',
        'ml-relaxed':'1.90',
      },
    },
  },
  plugins: [],
};
