import { movieService } from "@/src/api/movieService";
import MovieDetailClient from "@/src/components/features/movies/MovieDetailClient";
import AgeRatingBadge from "@components/ui/AgeRatingBadge";



interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: PageProps) {

    const resolvedParams = await params;
    const movieId = resolvedParams.id;

    const movieDetails = await movieService.getMovieDetails(movieId);

    return (
        <div className="w-full min-h-screen bg-slate-950 pb-20">
            {/* 1. 상단 비주얼 히어로 영역 (서버 렌더링) */}
            <div className="relative w-full h-[500px]">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm"
                    style={{ backgroundImage: `url(${movieDetails.backdropPath})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                
                {/* 영화 정보 메타데이터 레이어 */}
                <div className="absolute bottom-0 left-0 w-full">
                    <div className="max-w-6xl mx-auto px-6 flex items-end gap-8 translate-y-12">
                        <img 
                            src={movieDetails.posterPath} 
                            alt={movieDetails.title}
                            className="w-56 rounded-2xl shadow-2xl border-2 border-slate-800"
                        />
                        <div className="pb-4 space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black text-white">{movieDetails.title}</h1>
                            <div className="flex items-center gap-4 text-sm font-bold text-slate-300">
                                <AgeRatingBadge rating={movieDetails.ageRating} showText={true} />
                                <span>{movieDetails.releaseDate} 개봉</span>
                                <span>•</span>
                                <span>{movieDetails.runtime}분</span>
                                <span>•</span>
                                <div className="flex gap-2">
                                    {movieDetails.genres.map((genre: string) => (
                                        <span key={genre} className="px-2 py-1 bg-slate-800 rounded-md text-xs">{genre}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 하단 탭 및 인터랙션 영역 (클라이언트 컴포넌트에 데이터 위임) */}
            <div className="max-w-6xl mx-auto px-6 mt-24">
                <MovieDetailClient movie={movieDetails} />
            </div>
        </div>
    );
};
