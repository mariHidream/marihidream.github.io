/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '320px'
      // 'sm' : {'min' : '640px', 'max' : '767px'}
       // => @media (min-width: 640px and max-width: 767px) { ... }
    },
    extend: {},
    colors: {
      'my-color': '#00FF7F',
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
  plugins: [],
}

