/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // This is crucial for class-based dark mode to work
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this to match your folder structure
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
