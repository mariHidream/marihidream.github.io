import { format, formatDate, subDays } from "date-fns";
import { BoxOfficeMovie, MovieBase } from "@src/types/movie";


const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const KOBIS_BASE_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest';


const getTargetDate = () => format(subDays(new Date(), 1), 'yyyyMMdd');


const extractAgeRating = (releaseDatesResults: any[]): 'ALL' | '12' | '15' | '19' => {
    if (!releaseDatesResults || !Array.isArray(releaseDatesResults)) return 'ALL';

    // 1. 한국(KR) 데이터 탐색, 없으면 미국(US) 데이터 폴백
    let targetCountry = releaseDatesResults.find((r) => r.iso_3166_1 === 'KR');
    if (!targetCountry) {
        targetCountry = releaseDatesResults.find((r) => r.iso_3166_1 === 'US');
    }

    if (!targetCountry || !targetCountry.release_dates || targetCountry.release_dates.length === 0) {
        return 'ALL';
    }

    // 2. certification 값이 비어있지 않은 첫 번째 데이터 추출
    const certObj = targetCountry.release_dates.find((d: any) => d.certification !== '');
    const rawCert = certObj ? certObj.certification.toUpperCase() : '';

    // 3. TMDB 문자열을 우리 시스템 규격으로 정규화 (Normalization)
    if (rawCert === '') return 'ALL';
    if (rawCert.includes('ALL') || rawCert === 'G' || rawCert === '전체관람가') return 'ALL';
    if (rawCert.includes('12') || rawCert === 'PG' || rawCert === '12세 이상 관람가') return '12';
    if (rawCert.includes('15') || rawCert === 'PG-13' || rawCert === '15세 이상 관람가') return '15';
    if (rawCert.includes('18') || rawCert.includes('19') || rawCert === 'R' || rawCert === 'NC-17' || rawCert.includes('청소년')) return '19';

    return 'ALL'; // 알 수 없는 포맷 방어
}

const fetchAgeRatingForList = async (movieId: number): Promise<'ALL' | '12' | '15' | '19'> => {
    try {
        const res = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/release_dates?api_key=${process.env.TMDB_API_KEY}`,
            { next: { revalidate: 3600 } }
        );
        const data = await res.json();
        return extractAgeRating(data.results);
    } catch {
        return 'ALL';
    }
};

export const movieService = {
    // 1. 현재 상영중인 영화 (TMDB Now Playing)
    getNowPlaying : async (limit?: number): Promise<MovieBase[]> => {

        const res = await fetch(
            `${TMDB_BASE_URL}/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=ko-KR&region=KR&page=1`,
            { next: { revalidate: 3600 }}
        )

        const data = await res.json();

        let movies = (data.results || []).filter((movie: any) => movie.backdrop_path !== null);
        
        movies = movies.filter((movie: any) => movie.popularity > 50 || movie.vote_count > 10);


        // 💡 limit 인자가 전달된 경우에만 해당 개수만큼 자릅니다.
        if (limit) {
            movies = movies.slice(0, limit);
        }
       
        const enrichedMovies = await Promise.all(
            movies.map(async (movie: any) => {
                const ageRating = await fetchAgeRatingForList(movie.id);
                return {
                    id: movie.id,
                    title: movie.title,
                    posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    backdropPath: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                    overview: movie.overview,
                    voteAverage: movie.vote_average,
                    releaseDate: movie.release_date,
                    ageRating: ageRating, // 추출된 실제 등급 주입
                };
            })
        );

        return enrichedMovies;

    },
    // 2. 국내 일별 박스오피스 (KOBIS + TMDB)
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
                    const tmdbId = tmdbMovie?.id;

                    // 💡 검색된 TMDB ID가 있으면 해당 영화의 등급을 가져옵니다.
                    const ageRating = tmdbId ? await fetchAgeRatingForList(tmdbId) : 'ALL';

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
                        ageRating: ageRating,
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
                        ageRating: 'ALL',
                    };
                }
            })
        );

        return enrichedList;
    },
    // 3. 영화 상세 정보
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

        // 💡 위에서 만든 헬퍼 함수로 응답 데이터 안의 release_dates를 파싱합니다.
        const actualAgeRating = extractAgeRating(data.release_dates?.results);

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
                id: c.id,
                name: c.name, // 배우 이름
                character: c.character, // 배역 이름
                profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null, //프로필 이미지
            })) || [],
            trailerKey: data.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')?.key || null,
            ageRating: actualAgeRating, // 💡 실제 파싱된 등급 주입
            stillCuts: data.images?.backdrops?.map(
                (img: any) => `https://image.tmdb.org/t/p/w780${img.file_path}`
            ) || [],
            reviews: reviewsData.results?.map((r: any) => ({
                id: r.id,
                author: r.author,
                content: r.content,
                rating: r.author_details?.rating || null,
                createdAt: r.created_at.split('T')[0],
            })) || [],
        };
    },
    // 4. 개봉 예정작 (Upcoming)
    getUpcoming : async (limit?: number): Promise<MovieBase[]> => {
        const res = await fetch(
            `${TMDB_BASE_URL}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=ko-KR&region=KR&page=1`,
            { next: { revalidate: 3600 } }
        );

        const data = await res.json();
        const today = new Date().toISOString().split('T')[0];

        // 필터 및 개봉일 기준 오름차순 정렬
        let movies = (data.results || [])
            .filter((movie: any) => movie.poster_path !== null && movie.release_date > today)
            .sort((a: any, b: any) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());

        // 💡 limit 인자가 전달된 경우에만 해당 개수만큼 자릅니다.
        if (limit) {
            movies = movies.slice(0, limit);
        }

        // 💡 병렬(Promise.all)로 각 영화의 연령 등급을 별도로 가져와 매핑합니다.
        const enrichedMovies = await Promise.all(
            movies.map(async (movie: any) => {
                const ageRating = await fetchAgeRatingForList(movie.id);
                return {
                    id: movie.id,
                    title: movie.title,
                    posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    backdropPath: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '',
                    overview: movie.overview,
                    voteAverage: movie.vote_average,
                    releaseDate: movie.release_date,
                    ageRating: ageRating, // 추출된 실제 등급 주입
                };
            })
        );

        return enrichedMovies;
    },
    getPersonDetails : async (personId : number) => {
        const res = await fetch(
         `${TMDB_BASE_URL}/person/${personId}?api_key=${process.env.TMDB_API_KEY}&language=ko-KR&append_to_response=movie_credits,images`,
            { next: { revalidate: 3600 } }
        );
        
        if (!res.ok) throw new Error('인물 정보를 불러올 수 없습니다.');
        const data = await res.json();

        return {
            id: data.id,
            name: data.name,
            originalName: data.original_name,
            profilePath: data.profile_path ? `https://image.tmdb.org/t/p/w500${data.profile_path}` : null,
            birthday: data.birthday, // ex: "1956-07-09"
            placeOfBirth: data.place_of_birth, // ex: "Concord, California, USA"
            // 필모그래피: 인지도가 높은(popularity) 순으로 최대 12개 추출
            filmography: data.movie_credits?.cast
                ?.filter((m: any) => m.poster_path)
                .sort((a: any, b: any) => b.popularity - a.popularity)
                .map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    posterPath: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                })) || [],
                
            // 갤러리 (배우 개인 사진)
            photos: data.images?.profiles
                ?.slice(0, 10)
                .map((img: any) => `https://image.tmdb.org/t/p/w500${img.file_path}`) || [],
        };
    }
}