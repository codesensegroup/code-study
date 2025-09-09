/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,vue,ts}"],
  theme: {
    extend: {
      screens: {
        '2xl': 'none'
      },
    }
  },
  plugins: [],
};
