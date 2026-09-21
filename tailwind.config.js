/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sheng: {
          green: '#10B981',
          red: '#EF4444',
          yellow: '#F59E0B',
          dark: '#111827',
          light: '#F3F4F6'
        }
      }
    },
  },
  plugins: [],
}
