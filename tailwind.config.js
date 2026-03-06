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
        malayalam: ['"Noto Sans Malayalam"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
