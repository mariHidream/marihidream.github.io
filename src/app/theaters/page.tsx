import theaterData from '@/src/data/theaters.json';
import TheaterClientContainer from './TheaterClientContainer';

export interface TheaterItem {
  광역단체: string;
  기초단체: string;
  영화상영관코드: string;
  영화상영관명: string;
  "총 스크린수": number;
  "총 좌석수": number;
  "필름 상영관수": number;
  "2D 상영관수": number;
  "3D 상영관수": number;
  "4D 상영관수": number;
  "IMAX 상영관수": number;
  상설여부: string;
  특별관운영여부: string | null;
  가입여부: string;
  전송사업자명: string;
  개관일: string;
  영업상태: string;
  운영형태: string;
  주소: string;
  전화번호: string;
  홈페이지: string;
}


export default function TheatersPage() {
    const theaters: TheaterItem[] = theaterData as TheaterItem[];
    return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">전국 극장 안내</h1>
        <p className="text-slate-400 font-medium">내부 데이터베이스에 등록된 {theaters.length}개의 영화관 정보를 확인할 수 있습니다.</p>
      </div>

      {/* 💡 검색과 필터 인터랙션을 담당하는 클라이언트 컴포넌트에 데이터를 프로퍼티로 위임 */}
      <TheaterClientContainer initialTheaters={theaters} />
    </div>
  );
}