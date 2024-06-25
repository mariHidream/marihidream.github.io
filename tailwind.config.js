/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], //src 폴더의 하위 폴더, 파일이면서 확장자가 js, jsx, ts, tsx인 파일들에게 적용
  theme: {
    extend: {},
    colors: {
      transparent : 'transparent'
    }
  },
  plugins: [],
}

