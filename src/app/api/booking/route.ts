import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export const mockBookingDB: any[] = [];


export async function POST(request: Request) {
    try{
        // 1. 보안 검증: 쿠키를 통한 세션 확인 (비인가 요청 차단)
        const cookieStore = await cookies();
        // 💡 1. get() 메서드 대신 getAll()로 전체 배열을 먼저 가져옵니다.
        const allCookies = cookieStore.getAll();
        
        // 💡 2. 자바스크립트의 find()를 이용해 이름이 'access_token'인 객체를 직접 낚아챕니다.
        const tokenObj = allCookies.find(c => c.name === 'access_token');
        
        // 💡 3. 안전하게 value를 추출합니다.
        const token = tokenObj?.value;

        // 토큰이 없으면 에러 반환
        if (!token) {
            return NextResponse.json({ error: '인증되지 않은 사용자입니다. 로그인이 필요합니다.' }, { status: 401 });
        }

        // 2. 페이로드 파싱 및 검증
        const body = await request.json();
        const {
            userEmail,
            selectedMovieId, 
            selectedMovieTitle, 
            selectedMoviePosterPath,
            selectedDate, 
            selectedTheater, 
            selectedSeats, 
            totalPrice
        } = body;

        
        console.log(body)

        // 데이터 무결성 검증 (필수 값 누락 확인)
        if (!userEmail || !selectedMovieId || !selectedSeats || selectedSeats.length === 0) {
            return NextResponse.json({ error: '예매에 필요한 필수 데이터가 누락되었습니다.' }, { status: 400 });
        }

        // 3. 고유 예매 번호 생성 아키텍처 (ex: NX-20260626-883)
        const today = new Date();
        const dateString = today.toISOString().slice(0,10).replace(/-/g, '');
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const bookingId = `NX-${dateString}-${randomSuffix}`;

        // 4. 데이터베이스 레코드 규격 생성        
        const newTicket = {
            bookingId,
            userEmail,
            movieId: selectedMovieId,
            title: selectedMovieTitle,
            date: selectedDate, // ex: "2026-06-28"
            theater: selectedTheater,
            seats: selectedSeats.join(', '), // 배열을 문자열로 직렬화
            count: `일반 ${selectedSeats.length}명`,
            totalPrice,
            status: 'RESERVED', // 예매 상태 초기값
            posterPath: selectedMoviePosterPath || '',
            createdAt: today.toISOString(),
        };

        // 5. 가상 DB에 트랜잭션 커밋
        mockBookingDB.push(newTicket);

        return NextResponse.json({ 
            message: '예매가 성공적으로 완료되었습니다.', 
            ticket: newTicket 
        }, { status: 201 });
        
    } catch (error: any) {
        console.error('Booking POST Error:', error);
        return NextResponse.json({ error: '서버 내부 오류로 예매 처리에 실패했습니다.' }, { status: 500 });
    }
}