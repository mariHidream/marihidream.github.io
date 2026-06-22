"use client";

import AgeRatingBadge from "@components/ui/AgeRatingBadge";
import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { MovieBase } from "@/src/types/movie";
import { Check } from "lucide-react";




export default function Step1Movie({movies}: {movies: MovieBase[]}) {

    const { selectedMovieId, selectMovie } = useMovieBookingStore();
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-white">관람하실 영화를 선택해주세요</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {movies.map((movie) => {
                    const isSelected = selectedMovieId === movie.id;
                    return (
                        <button
                            key={movie.id}
                            onClick={() => selectMovie(movie.id, movie.title)}
                            className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all overflow-hidden ${
                                isSelected 
                                ? 'border-teal-500 bg-teal-500/10' 
                                : 'border-slate-800 bg-slate-950/50 hover:border-slate-600'
                            }`}
                        >
                        <div className="relative w-full aspect-[3/4] mb-3 shadow-md overflow-hidden rounded-lg"> {/* 이미지 래퍼 생성 */}
                            <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover" />
                            
                            {/* 💡 좌측 상단 연령 고정 오버레이 배지 */}
                            <div className="absolute top-2 left-2 z-10 bg-slate-950/80 p-1 rounded backdrop-blur-sm">
                                <AgeRatingBadge rating={movie.ageRating} />
                            </div>
                        </div>
                        <span className={`text-sm font-bold truncate w-full text-center ${isSelected ? 'text-teal-400' : 'text-slate-300'}`}>
                            {movie.title}
                        </span>

                        {/* 선택 시 체크 마크 오버레이 */}
                        {isSelected && (
                            <div className="absolute top-4 right-4 bg-teal-500 text-slate-950 p-1 rounded-full shadow-lg">
                                <Check className="w-4 h-4 font-bold" />
                            </div>
                        )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
