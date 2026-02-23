/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00859b',
          dark: '#006780',
          light: '#a995b8',
          50: '#e6f4f7',
          100: '#b3dfe8',
          200: '#80c9d9',
          300: '#4db4ca',
          400: '#269fbb',
          500: '#00859b',
          600: '#006780',
          700: '#004f65',
          800: '#00384a',
          900: '#00202f',
        },
        secondary: {
          DEFAULT: '#001f35',
          50: '#e6eaed',
          100: '#b3bfc9',
          200: '#8095a5',
          300: '#4d6a81',
          400: '#264f69',
          500: '#001f35',
          600: '#001a2e',
          700: '#001524',
          800: '#000f1a',
          900: '#000a10',
        },
      },
    },
  },
  plugins: [],
};
