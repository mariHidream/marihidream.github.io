/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ], //src 폴더의 하위 폴더, 파일이면서 확장자가 js, jsx, ts, tsx인 파일들에게 적용
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

