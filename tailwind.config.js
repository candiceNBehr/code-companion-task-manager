/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: '#8b64fd',
        secondary: '#f6f5fd',
        darkBg: '#1f1f20',
        lightBg: '#ffffff',
        darkText: '#ffffff',
        lightText: '#1f1f20',
      },
      fontFamily: {
        zona: ['Zona Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
