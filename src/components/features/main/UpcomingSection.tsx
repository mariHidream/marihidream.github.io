"use client";

import { MovieBase } from "@/src/types/movie";
import { differenceInDays } from "date-fns";
import Link from "next/link";
import AgeRatingBadge from "@components/ui/AgeRatingBadge";
import { CalendarClock } from "lucide-react";


// 1. Swiper 모듈 임포트
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface UpcomingSectionProps {
    movies : MovieBase[];
}

export default function UpcomingSection ({movies} : UpcomingSectionProps) {

    if (!movies || movies.length === 0) return null;

    // D-Day 계산 헬퍼 함수
    const getDDay = (releaseDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(releaseDate);
        const diff = differenceInDays(targetDate, today);
        return diff > 0 ? `D-${diff}` : 'D-Day';
    };

    return (
        <section className="w-full max-w-7xl mx-auto py-12 bg-slate-950">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <CalendarClock className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">개봉 예정작</h3>
                </div>
            </div>

            {/* 가로 스크롤 (Horizontal Scroll) 컨테이너 */}
            <div className="w-full theme-swiper-wrapper">
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={24}
                    slidesPerView={2}
                    grabCursor={true}
                    pagination={{ clickable: true }}  
                    breakpoints={{
                        // 디바이스 해상도별 보여질 슬라이드 개수 반응형 제어
                        640: { slidesPerView: 3 },   // 태블릿 세로
                        768: { slidesPerView: 4 },   // 태블릿 가로
                        1024: { slidesPerView: 4.5 },  // 데스크톱
                    }}
                    className="pb-8 pt-2"
                >
                    {movies.map((movie) => (
                        <SwiperSlide key={movie.id} className="h-auto pb-12">
                            <Link 
                                href={`/movies/${movie.id}`} 
                                key={movie.id} 
                                className="group shrink-0 flex flex-col space-y-3 snap-start"
                            >
                                {/* 포스터 영역 */}
                                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900 shadow-md group-hover:border-slate-600 transition-all duration-300">
                                    <img 
                                        src={movie.posterPath} 
                                        alt={movie.title}
                                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                
                                    {/* 좌측 상단 연령 배지 */}
                                    <div className="absolute top-2 left-2 z-10 bg-slate-950/80 p-1 rounded backdrop-blur-sm">
                                        <AgeRatingBadge rating={movie.ageRating} />
                                    </div>

                                    {/* 우측 하단 D-Day 배지 */}
                                    <div className="absolute bottom-2 right-2 z-10 bg-blue-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md shadow-lg">
                                        {getDDay(movie.releaseDate)}
                                    </div>
                                </div>

                                {/* 영화 정보 */}
                                <div className="space-y-1 pt-1 px-1">
                                    <h4 className="text-base font-black text-slate-100 tracking-tight truncate group-hover:text-blue-400 transition-colors">
                                        {movie.title}
                                    </h4>
                                    <p className="text-xs font-bold text-slate-500">
                                        {movie.releaseDate} 개봉
                                    </p>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}
