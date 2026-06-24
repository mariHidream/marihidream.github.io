import { NextResponse } from 'next/server';
import { movieService } from '@/src/app/api/movieService';


// 💡 [수정 포인트 1] params의 타입을 Promise 객체로 명시합니다.
export async function GET(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 💡 [수정 포인트 2] 비동기 params 객체를 await로 해체하여 id 값을 추출합니다.
        const resolvedParams = await params;
        const personId = parseInt(resolvedParams.id, 10);

        // ID 검증 로직 (안전성 확보)
        if (isNaN(personId)) {
            return NextResponse.json({ error: '유효하지 않은 인물 ID입니다.' }, { status: 400 });
        }

        const data = await movieService.getPersonDetails(personId);
        
        // 정상적으로 데이터를 가져오면 클라이언트로 반환
        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        console.error('API Route Error:', error.message);
        // 서버 내부 에러 발생 시 500 상태 코드와 메시지 반환
        return NextResponse.json(
            { error: error.message || '인물 정보를 불러오는 데 실패했습니다.' }, 
            { status: 500 }
        );
    }
}