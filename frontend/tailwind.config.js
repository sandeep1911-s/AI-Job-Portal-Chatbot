/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ec4899', // Pink
        secondary: '#3b82f6', // Blue
        dark: '#0B1120', // Dark Blue
        light: '#f8fafc' // Slate 50
      }
    },
  },
  plugins: [],
}
