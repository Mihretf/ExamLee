/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#22447E',
        secondary: '#EDF9FE',
      },
    },
  },
  plugins: [],
}