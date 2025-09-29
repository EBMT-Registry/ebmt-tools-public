
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    // Add other paths where you use Tailwind classes
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'dark-blue': '#2A4E95',
        'light-blue': '#2C99B6',
        // Note: 'white' is already included in Tailwind by default
      },
      screens: {
        'xs': '480px',
        // Other breakpoints are Tailwind defaults, but you can override them here
      },
      spacing: {
        'xs': '0.25rem', // 4px - now you can use spacing like p-xs, m-xs
      }
    },
  },
  plugins: [],
}