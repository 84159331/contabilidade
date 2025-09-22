/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#1a1a1a',
        white: '#ffffff',
        gray: {
          light: '#f4f4f4',
          DEFAULT: '#e0e0e0',
          medium: '#c7c7c7',
          dark: '#a0a0a0',
          darker: '#8c8c8c',
          darkest: '#6b6b6b',
        },
        blue: '#4a90e2',
        red: '#d0021b',
        orange: '#f5a623',
        green: '#7ed321',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        heading: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
