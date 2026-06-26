import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: '로그아웃 되었습니다.' }, { status: 200 });
  
  // 💡 쿠키의 만료 시간(maxAge)을 0으로 설정하여 브라우저에서 토큰을 영구 파괴합니다.
  response.cookies.set('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}