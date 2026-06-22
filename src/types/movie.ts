export interface MovieBase {
    id: number; // TMDB 고유 ID
    title : string; // 한국어 영화 제목
    titleEn : string // 외국어 영화 제목
    posterPath : string; // 포스터 이미지
    backdropPath : string; // 배경용 대형 이미지
    overview : string; // 줄거리
    voteAverage : number; // 글로벌 평점
    releaseDate : string; // 개봉일
    ageRating: 'ALL' | '12' | '15' | '19'; // 💡 관람 연령 규격 타입 추가
}

// 박스오피스 전용 확장 규격 (KOBIS 데이터 결합)
export interface BoxOfficeMovie extends MovieBase{
    rank : string; // 해당일자의 박스오피스 순위
    rankInten : string; // 전일대비 순위의 증감분을 출력합니다.
    audiAcc : string; // 누적 관객 수
}


export interface BookingRateMovie extends MovieBase{
    bookingRate : string; // 예매율
}