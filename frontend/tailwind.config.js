/** @type {import('tailwindcss').Config} */
module.exports = {
  // This line enables class-based dark mode
  darkMode: 'class',

  // This tells Tailwind where to find your class names
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  // This is where you can customize Tailwind's default design system
  theme: {
    extend: {},
  },

  // This is where you can add official Tailwind plugins
  plugins: [],
}