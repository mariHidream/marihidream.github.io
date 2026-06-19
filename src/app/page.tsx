import { movieService } from "@src/api/movieService";
import MovieSection from "@components/layout/features/main/MovieSection";
import VisualSlider from "@components/layout/features/main/VisualSlider";
import MainFooter from "@components/layout/MainFooter";
import MainHeader from "@components/layout/MainHeader";

export default async function Page() {
  // 1. 서비스 엔진 레이어를 통해 API 병렬 페칭 (성능 극대화)
  const [nowPlayingMovies, boxOfficeMovies] = await Promise.all([
    movieService.getNowPlaying(),
    movieService.getBoxOffice()
  ]);

  
  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col selection:bg-teal-500 selection:text-slate-950">
      {/* 영화관 전용 상단 네비게이션 헤더 */}
      <MainHeader />

      {/* 롯데시네마 앰비언트 스크린 스타일 히어로 섹션 */}
      <VisualSlider movies={nowPlayingMovies} />

      {/* 컨텐츠 1 영역: 거대 랭킹 오버레이 기반 박스오피스 섹션 */}
      <div className="flex-grow bg-slate-950">
        <MovieSection movies={boxOfficeMovies} />
      </div>

      {/* 공용 기업 명세 정보 푸터 */}
      <MainFooter />
    </div>
  );
}
