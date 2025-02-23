// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Include all page components
    './components/**/*.{js,ts,jsx,tsx}', // Include all custom components
    './app/**/*.{js,ts,jsx,tsx}', // For Next.js 13+ /app directory
  ],
  theme: {
    extend: {
      colors: {
        customOrange: '#f69c55',
        blue: "#"
      },
    },
  },
  plugins: [],
}
