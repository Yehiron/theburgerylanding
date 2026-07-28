/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#FF4500',
        dark: '#111111',
        light: '#F8F9FA'
      }
    },
  },
  plugins: [],
}
