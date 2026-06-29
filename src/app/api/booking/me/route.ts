import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { mockBookingDB } from "../route";

export async function GET(request: Request) {
    try {
        // 1. 보안 검증
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if(!token){
            return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
        }

        // 2. 요청 URL에서 쿼리 파라미터(이메일) 추출
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('email');

        if (!userEmail) {
            return NextResponse.json({ error: '유저 식별 정보가 누락되었습니다.' }, { status: 400 });
        }

        // 3. 관계형 데이터베이스의 SELECT * WHERE email = ? 로직 수행
        const myBookings = mockBookingDB
            .filter((ticket) => ticket.userEmail === userEmail)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // 최신순 정렬

        return NextResponse.json({ tickets: myBookings }, { status: 200 });

    } catch (error) {
        console.error('Booking GET Error:', error);
        return NextResponse.json({ error: '예매 내역을 불러오는 데 실패했습니다.' }, { status: 500 });
    }
}