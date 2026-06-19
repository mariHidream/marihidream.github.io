"use client";

import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { BoxOfficeMovie } from "@/src/types/movie";
import { Star, TrendingUp } from "lucide-react";
import { useRouter } from 'next/navigation';



interface MovieSectionProps {
    movies : BoxOfficeMovie[];
}

export default function MovieSection ({ movies }: { movies: BoxOfficeMovie[] }) {
    const router = useRouter();
    const selectMovie = useMovieBookingStore((state) => state.selectMovie);

    const handleBookingRedirect = (id: number, title : string) => {
        selectMovie(id, title);
        router.push('/booking');
    }


    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-12 bg-slate-950">
            {/* 섹션 타이틀 헤더 */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-teal-500/10 rounded-xl border border-teal-500/20">
                        <TrendingUp className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">실시간 박스오피스 순위</h3>
                </div>
            </div>

            {/* 무비 카드 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.slice(0, 5).map((movie) => (
                    <div key={movie.id} className="group relative flex flex-col space-y-3">
                        
                        {/* 포스터 래퍼 */}
                        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900 shadow-md group-hover:shadow-teal-500/5 group-hover:border-slate-700 transition-all duration-300">
                            <img 
                                src={movie.posterPath} 
                                alt={movie.title}
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            {/* 마우스 오버 시 가상 액션 오버레이 레이어 */}
                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 gap-3 z-20">
                                <p className="text-slate-300 text-xs text-center line-clamp-4 px-2">
                                    {movie.overview}
                                </p>
                                <button 
                                    onClick={() => handleBookingRedirect(movie.id, movie.title)}
                                    className="w-4/5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm rounded-xl transition-all transform translate-y-2 group-hover:translate-y-0"
                                >
                                    즉시 예매
                                </button>
                            </div>

                            {/* 💡 [레퍼런스 고도화 포인트] 좌측 하단 거대 랭킹 타이포그래피 오버레이 */}
                            <div className="absolute bottom-[5px] right-2 font-serif font-black italic text-7xl md:text-8xl text-white select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] opacity-95 group-hover:text-teal-400 transition-colors z-10">
                                {movie.rank}
                            </div>
                        </div>

                        {/* 영화 기본 메타데이터 정보 리포트 */}
                        <div className="space-y-1.5 pt-1 px-1">
                            <h4 className="text-base font-black text-slate-100 tracking-tight truncate group-hover:text-white transition-colors">
                                {movie.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                                <div className="flex items-center gap-0.5 text-amber-400">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span>{movie.voteAverage.toFixed(1)}</span>
                                </div>
                                <span>•</span>
                                <span>누적 {Math.round(Number(movie.audiAcc) / 10000)}만 명</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    </section>
    );
}
