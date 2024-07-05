import React, { ReactNode } from 'react';
import '@/app/global.css';  // CSS 파일 가져오기
import localFont from "next/font/local";
import Footer from '@/app/Footer';
import Header from '@/app/Header';

interface RootLayoutProps { // RootLayoutProps 인터페이스를 정의하여 children prop의 타입을 ReactNode로 지정
    children: ReactNode; // ReactNode는 React에서 사용할 수 있는 모든 노드 타입
}

const pretendard = localFont({
  src : [
    {
      path: '.././fonts/Pretendard-Bold.subset.woff2',
      weight : '700',
      style : 'normal'
    },
    {
      path: '.././fonts/Pretendard-SemiBold.subset.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '.././fonts/Pretendard-Medium.subset.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '.././fonts/Pretendard-Regular.subset.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable:'--font-pretendard',
  display:'swap', // font-display 설정과 동일 https://developer.mozilla.org/ko/docs/Web/CSS/@font-face/font-display
  preload:false , 
  //subsets: ['latin'] font를 불러올 때, 하위 집단(?)중에 하나를 지정하는 방법(특정 값만 가져온다는 느낌?), 크기가 줄고 성능 향상이됨, preload:true는 지정하지 않음을 의미
})

/**
 * React.FC<RootLayoutProps>를 사용하여 RootLayout 컴포넌트의 타입을 정의
 * React.FC는 함수형 컴포넌트를 위한 타입
*/
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
      <html lang="ko">
        <head>
          <title>My Next.js App</title>
        </head>
        <body className={`${pretendard.variable}`}>
            <Header/>
            <div className="container">{children}</div>
            <Footer/>
        </body>
      </html>
    );
  };
  
  export default RootLayout;