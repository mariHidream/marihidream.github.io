import type { Metadata } from "next";

import "@styles/globals.css";

// 💡 1. 우리가 만든 글로벌 토스트 컴포넌트 임포트
import ToastProvider from "@components/ui/Toast";

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
      <body className="min-h-full flex flex-col">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
