/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'haven-blue': '#1e40af',
        'haven-green': '#059669',
        'haven-red': '#dc2626',
      }
    },
  },
  plugins: [],
}