import '@/app/global.css';  // CSS 모듈이 아닌 일반 CSS 파일 가져오기
import React, { ReactNode } from 'react';
import Footer from '@/app/Footer';
import Header from '@/app/Header';

interface RootLayoutProps { // RootLayoutProps 인터페이스를 정의하여 children prop의 타입을 ReactNode로 지정
    children: ReactNode; // ReactNode는 React에서 사용할 수 있는 모든 노드 타입
}

/**
 * React.FC<RootLayoutProps>를 사용하여 RootLayout 컴포넌트의 타입을 정의합니다. 
 * React.FC는 함수형 컴포넌트를 위한 타입입니다.
*/
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
      <html lang="ko">
        <head>
          <title>My Next.js App</title>
        </head>
        <body>
            <Header/>
            <main>{children}</main>
            <Footer/>
        </body>
      </html>
    );
  };
  
  export default RootLayout;