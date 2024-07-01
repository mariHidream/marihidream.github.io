/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}', // 페이지 폴더 내의 모든 JavaScript/TypeScript 파일
    './src/components/**/*.{js,ts,jsx,tsx}', // 컴포넌트 폴더 내의 모든 JavaScript/TypeScript 파일
    './src/app/**/*.{js,ts,jsx,tsx}', // app 폴더 내의 모든 JavaScript/TypeScript 파일 (Next.js 13의 경우)
  ],
  theme: {
    screens: {
      xs: '320px'
      // 'sm' : {'min' : '640px', 'max' : '767px'}
       // => @media (min-width: 640px and max-width: 767px) { ... }
    },
    extend: {

    },
    colors: {
      'my-color': '#00FF7F',
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
  plugins: [
    
  ],
}

