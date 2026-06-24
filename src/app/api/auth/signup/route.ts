import { NextResponse } from "next/server";



// 가상 데이터 베이스
export const mockUserDB : any[] = [];


export async function POST(request : Request) {
    try {
        const body = await request.json();
        const {email, password, name} = body;

        if(!email || !password || !name){
            return NextResponse.json({error : '필수 입력 항목이 누락 되었습니다.'}, {status: 400});
        }

        // 이메일 중복 검사
        const isExistingUser = mockUserDB.some((user)=> user.email === email);
        if(isExistingUser){
            return NextResponse.json({error : '이미 존재하는 이메일 입니다.'}, {status: 409})
        }

        // 가상 DB에 유저 삽입 (비밀번호는 해싱 가정이 원칙이나, 프로토타입이므로 평문 저장)

        const newUser = {
            id: Date.now(),
            email,
            password,
            name,
            createdAt: new Date().toISOString(),
        };
        mockUserDB.push(newUser);

        return NextResponse.json({ message: '회원가입이 완료되었습니다.', user: { email, name } }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}