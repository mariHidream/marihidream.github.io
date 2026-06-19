// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 프로젝트 전체의 기본 고딕(sans) 폰트를 Pretendard로 지정합니다.
        sans: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;