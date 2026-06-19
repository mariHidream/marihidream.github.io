import { format, subDays } from "date-fns";
import { BoxOfficeMovie, MovieBase } from "@src/types/movie";



const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const KOBIS_BASE_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest';


const getTargetDate = () => format(subDays(new Date(), 1), 'yyyyMMdd');


export const movieService = {
    // 1. 비쥬얼 영역용: 현재 상영중인 영화 (TMDB Now Playing)
    getNowPlaying : async (): Promise<MovieBase[]> => {

        const res = await fetch(
            `${TMDB_BASE_URL}/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=ko-KR&page=1`,
            { next: { revalidate: 3600 }}
        )

        const data = await res.json();

        return (data.results || []).slice(0, 5).map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            backdropPath: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            overview: movie.overview,
            voteAverage: movie.vote_average,
            releaseDate: movie.release_date,
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
                };
                }
            })
        );

        return enrichedList;
    }
}