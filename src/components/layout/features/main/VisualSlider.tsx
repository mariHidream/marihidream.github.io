"use client";


import { useRouter } from 'next/navigation';
import { MovieBase } from '@/src/types/movie';
import { useMovieBookingStore } from '@/src/hooks/useMovieBookingStore';

// 1. Swiper 코어 및 필수 모듈 임포트
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// 2. Swiper 필수 스타일시트 로드 (Next.js App Router 규격)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface VisualSliderProps {
  movies: MovieBase[];
}

export default function VisualSlider({ movies }: VisualSliderProps) {
   const router = useRouter();
    const selectMovie = useMovieBookingStore((state) => state.selectMovie);

    if (movies.length === 0) return null;

    const handleBookingRedirect = (id: number, title: string) => {
      selectMovie(id, title);
      router.push('/booking');
    };

    return (
      <div className="relative w-full bg-slate-950 overflow-hidden theme-swiper-wrapper">
        
        {/* Swiper 컨테이너 선언 */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]} // 사용할 모듈 주입
          spaceBetween={0}                            // 슬라이드 간 간격
          slidesPerView={1}                           // 한 번에 보일 슬라이드 수
          loop={true}                                 // 무한 루프 활성화
          autoplay={{
            delay: 5000,                              // 5초 주기 자동 재생
            disableOnInteraction: false,              // 사용자 드래그 후에도 자동 재생 유지
          }}
          navigation={true}                           // 기본 좌우 화살표 활성화
          pagination={{ clickable: true }}            // 바닥 인디케이터 도트 활성화 (클릭 가능)
          className="w-full h-[774px]"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} className="relative w-full h-full flex items-center justify-center">
              
              {/* 앰비언트 광원 레이어 (배경 블러 처리) */}
              <div 
                className="absolute inset-0 bg-cover bg-top opacity-45 scale-110"
                style={{ backgroundImage: `url(${movie.backdropPath})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

              {/* 슬라이더 메인 컨텐츠 슬롯 */}
              <div className="relative w-full max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-11 gap-8 items-center z-10 h-full">
                
                {/* 좌측 메타데이터 뷰 */}
                <div className="md:col-span-7 space-y-6 text-left">
                  <span className="inline-block px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold text-xs rounded-full tracking-wide">
                    NOW PLAYING
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    {movie.title}
                  </h2>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl line-clamp-3 font-medium">
                    {movie.overview}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-2">
                    <button 
                      onClick={() => handleBookingRedirect(movie.id, movie.title)}
                      className="px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-base rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                      예매하러 가기
                    </button>
                  </div>
                </div>

                {/* 우측 시네마 미디어 카드 */}
                <div className="md:col-span-4 relative w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl group">
                  <img 
                    src={movie.posterPath} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
}