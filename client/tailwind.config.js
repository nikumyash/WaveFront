/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        xs:"384px",
      }
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('@tailwindcss/typography')],
}