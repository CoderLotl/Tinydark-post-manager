/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkest: '#0c0a0a',
        darkGrey: '#1d1d1d',
        lightGrey: '#353535',
        accentGrey: '#5a5a5a',
        activeOrange: '#fc7d18',
        activeOrangeHover: '#f06c00',
        orange: '#88572e',
        textColor: '#ddd',
      }
    },
  },
  plugins: [],
}