import type { Metadata } from "next";

import "@styles/globals.css";

// 💡 1. 우리가 만든 글로벌 토스트 컴포넌트 임포트
import ToastProvider from "@components/ui/Toast";
import MainHeader from "../components/layout/Header";
import MainFooter from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "Next Cinema",
  description: "Next.js 영화 예매 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className='dark'
    >
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-teal-500 selection:text-slate-950">
        {/* 영화관 전용 상단 네비게이션 헤더 */}
        <MainHeader />

        {/* 중앙 콘텐츠 영역 (메인, 상세, 예매 등)이 남은 공간을 채우도록 flex-grow 적용 */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        <MainFooter />
        <ToastProvider />
        
      </body>
    </html>
  );
}
