/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,vue,ts}"],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
    }
  },
  plugins: [],
};
