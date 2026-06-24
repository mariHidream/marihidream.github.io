import { NextResponse } from "next/server";
import { mockUserDB } from "../signup/route";


export async function POST(request : Request){
    try {

        const body = await request.json();
        const {email, password} = body;

        // 가상 DB에서 유저 조회
        const user = mockUserDB.find((u) => u.email === email);


        if (!user || user.password !== password) {
            return NextResponse.json({ error: '이메일 또는 비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }

        // 가상 JWT 토큰 생성 (실무에서는 jsonwebtoken 라이브러리 사용)
        const mockAccessToken = `mock-jwt-token-${user.id}-${Date.now()}`;


        const response = NextResponse.json({
            message: '로그인에 성공했습니다.',
            user: { id: user.id, email: user.email, name: user.name }
        }, { status: 200 });


        // 💡 [중요] 보안을 위해 쿠키(HttpOnly)에 토큰을 저장합니다. 
        // 브라우저 자바스크립트로 접근할 수 없어 XSS 공격 방어에 탁월합니다.
        response.cookies.set('access_token', mockAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1일 유지
            path: '/',
        });

        return response;
        
    } catch (error: any) {
        return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}