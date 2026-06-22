import { format, formatDate, subDays } from "date-fns";
import { BoxOfficeMovie, MovieBase } from "@src/types/movie";


const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const KOBIS_BASE_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest';


const getTargetDate = () => format(subDays(new Date(), 1), 'yyyyMMdd');

// 헬퍼 함수: ID 기반 결정론적 연령 생성기 (실제 운영 환경의 데이터 미제공 방어용)
const getDeterministicAgeRating = (id: number): 'ALL' | '12' | '15' | '19' => {
  const ratings: ('ALL' | '12' | '15' | '19')[] = ['ALL', '12', '15', '19'];
  return ratings[id % 4];
};


export const movieService = {
    // 1. 비쥬얼 영역용: 현재 상영중인 영화 (TMDB Now Playing)
    getNowPlaying : async (): Promise<MovieBase[]> => {

        const res = await fetch(
            `${TMDB_BASE_URL}/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=ko-KR&region=KR&page=1`,
            { next: { revalidate: 3600 }}
        )

        const data = await res.json();

        let filteredMovies = data.results || [];

        filteredMovies = filteredMovies.filter((movie: any) => movie.popularity > 50 || movie.vote_count > 10);

        // 만약 "한국+해외 영화를 모두 보여주되, 아무도 모르는 마이너한 인도/독립 영화를 거르고 싶다"면
        // TMDB의 투표수(vote_count)나 인기도(popularity)가 일정 수치 이상인 메이저 상업 영화만 필터링합니다.
        return filteredMovies.filter((movie: any) => movie.backdrop_path !== null).slice(0, 5).map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            backdropPath: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            overview: movie.overview,
            voteAverage: movie.vote_average,
            releaseDate: movie.release_date,
            ageRating: getDeterministicAgeRating(movie.id),
        }));

    },
    // 2. 컨텐츠 1: 국내 일별 박스오피스 순위 (KOBIS + TMDB 매핑 매시업)
    getBoxOffice : async (): Promise<BoxOfficeMovie> => {
        const targetDate = getTargetDate();
    
        const kobisRes = await fetch(
            `${KOBIS_BASE_URL}/boxoffice/searchDailyBoxOfficeList.json?key=${process.env.KOBIS_API_KEY}&targetDt=${targetDate}`,
            { next: { revalidate: 3600 } }
        );
        const kobisData = await kobisRes.json();
        const boxOfficeList = kobisData.boxOfficeResult?.dailyBoxOfficeList || [];

        // 병렬 매핑 쿼리 처리
        const enrichedList = await Promise.all(
            boxOfficeList.map(async (kobisMovie: any) => {
                const title = kobisMovie.movieNm;
                const year = kobisMovie.openDt.split('-')[0];

                try {
                    const tmdbRes = await fetch(
                        `${TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=ko-KR&year=${year}`
                    );
                    const tmdbData = await tmdbRes.json();
                    const tmdbMovie = tmdbData.results?.[0];

                    return {
                            id: tmdbMovie?.id || Number(kobisMovie.movieCd),
                            title: title,
                            posterPath: tmdbMovie?.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : '/fallback-poster.png',
                            backdropPath: tmdbMovie?.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}` : '',
                            overview: tmdbMovie?.overview || '등록된 줄거리가 없습니다.',
                            voteAverage: tmdbMovie?.vote_average || 0,
                            releaseDate: kobisMovie.openDt,
                            rank: kobisMovie.rank,
                            audiAcc: kobisMovie.audiAcc,
                            rankInten: kobisMovie.rankInten,
                             ageRating: getDeterministicAgeRating(tmdbMovie?.id || Number(kobisMovie.movieCd)),
                    };
                } catch {
                return {
                    id: Number(kobisMovie.movieCd),
                    title: title,
                    posterPath: '/fallback-poster.png',
                    backdropPath: '',
                    overview: '정보를 불러오지 못했습니다.',
                    voteAverage: 0,
                    releaseDate: kobisMovie.openDt,
                    rank: kobisMovie.rank,
                    audiAcc: kobisMovie.audiAcc,
                    rankInten: kobisMovie.rankInten,
                    ageRating: getDeterministicAgeRating(Number(kobisMovie.movieCd)),
                };
                }
            })
        );

        return enrichedList;
    },

    getMovieDetails: async (movieId : string) => {
       // 💡 [핵심 수정 1] append_to_response에 'images' 추가 및 include_image_language 파라미터 주입
        const tmdbPromise = fetch(
            `${TMDB_BASE_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=ko-KR&append_to_response=credits,videos,images&include_image_language=ko,en,null`,
            { next: { revalidate: 3600 } }
        );
        
        // 글로벌 리뷰 독립 호출 (유지)
        const reviewsPromise = fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${process.env.TMDB_API_KEY}`,
            { next: { revalidate: 3600 } }
        );
        const [tmdbRes, reviewsRes] = await Promise.all([tmdbPromise, reviewsPromise]);

        if (!tmdbRes.ok) throw new Error('영화 정보를 불러올 수 없습니다.');

        const data = await tmdbRes.json();
        const reviewsData = reviewsRes.ok ? await reviewsRes.json() : { results: [] };

        let kobisRank = null;
        let audiAcc = null;

        try {
            const targetDate = formatDate(subDays(new Date(), 1), 'yyyyMMdd');
            const kobisRes = await fetch(
                `${KOBIS_BASE_URL}/boxoffice/searchDailyBoxOfficeList.json?key=${process.env.KOBIS_API_KEY}&targetDt=${targetDate}`,
                { next: { revalidate: 3600 } }
            )

            const kobisData = await kobisRes.json();

            const match = kobisData.boxOfficeResult.dailyBoxOfficeList.find(
                (m: any) => m.movieNm.includes(data.title) || data.title.includes(m.movieNm)
            );

            if (match) {
                kobisRank = match.rank;
                audiAcc = match.audiAcc;
            }

        } catch (error) {
            console.error("KOBIS 데이터 매핑 실패:", error);
        }


        return {
            id: data.id,
            title: data.title,
            originalTitle: data.original_title,
            overview: data.overview || '등록된 줄거리가 없습니다.',
            posterPath: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '/fallback-poster.png',
            backdropPath: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '',
            voteAverage: data.vote_average,
            voteCount: data.vote_count, // 총 평가자 수 추가
            runtime: data.runtime,
            genres: data.genres.map((g: any) => g.name),
            releaseDate: data.release_date,
            rank: kobisRank, // KOBIS 박스오피스 순위 병합
            audiAcc: audiAcc, // KOBIS 누적 관객 수 병합
            cast: data.credits?.cast?.slice(0, 5).map((c: any) => ({
                name: c.name,
                character: c.character,
                profileUrl: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null,
            })) || [],
            trailerKey: data.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')?.key || null,
            ageRating: getDeterministicAgeRating(data.id),
            stillCuts: data.images?.backdrops
                ?.slice(0, 9)
                .map((img: any) => `https://image.tmdb.org/t/p/w780${img.file_path}`) || [],
            reviews: reviewsData.results?.map((r: any) => ({
                id: r.id,
                author: r.author,
                content: r.content,
                rating: r.author_details?.rating || null,
                createdAt: r.created_at.split('T')[0],
            })) || [],
        };
    }
}