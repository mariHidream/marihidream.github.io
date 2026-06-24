// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  // 로그인 성공 시 쿠키에 구웠던 access_token 존재 여부 확인
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // 💡 비회원 보호 대상 경로 설정
  const isProtectedRoute = pathname.startsWith('/mypage') || pathname.startsWith('/booking/confirmation');

  // 토큰이 없는데 보호된 경로로 접근을 시도하는 경우 로그인 페이지로 강제 리다이렉트
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // 원래 가고자 했던 주소를 리턴 url 파라미터로 붙여 로그인 후 즉시 이동할 수 있도록 설계합니다.
    loginUrl.searchParams.set('callbackUrl', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 최적의 경로 필터링 조건
export const config = {
  matcher: ['/mypage/:path*', '/booking/confirmation/:path*'],
};