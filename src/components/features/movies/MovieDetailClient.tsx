"use client";

import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { useToastStore } from "@/src/store/useToastStore";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/Tabs";
import { CalendarCheck, ImageIcon, Share2, User } from "lucide-react";
import MovieMetrics from "./MovieMetrics";
import ReviewCard from "./ReviewCard";
import { useState } from "react";
import ImageLightbox from "./ImageLightbox";


export default function MovieDetailClient({ movie }: { movie: any }) {
  const router = useRouter();
  const selectMovie = useMovieBookingStore((state) => state.selectMovie);
  const showToast = useToastStore((state) => state.showToast);

  // 💡 2. 라이트박스 제어용 전역 인덱스 상태 선언 (null은 닫힌 상태, 숫자는 열린 상태의 이미지 순서)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleBooking = () => {
    selectMovie(movie.id, movie.title);
    router.push('/booking');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('영화 상세 주소가 복사되었습니다.', 'success');
  };

  return (
    <div className="flex flex-col md:flex-row gap-12">
      
        {/* 좌측 메인 탭 컨텐츠 영역 (2/3) */}
        <div className="w-full md:w-2/3">

            {/* 💡 1. 여기에 시각화 그래프 패널을 최상단에 배치합니다 */}
            <MovieMetrics movie={movie} />

            <Tabs defaultValue="info" className="w-full">
                <TabsList>
                    <TabsTrigger value="info">상세정보</TabsTrigger>
                    <TabsTrigger value="cast">출연진/감독</TabsTrigger>
                    <TabsTrigger value="trailer">예고편</TabsTrigger>
                    <TabsTrigger value="reviews">관람평 ({movie.reviews?.length || 0})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="text-slate-300 leading-relaxed space-y-6 pt-4">
                    <h3 className="text-xl font-bold text-white mb-4">줄거리 요약</h3>
                    <p className="text-lg font-medium">{movie.overview}</p>
                    <h3 className="text-xl font-bold text-white mb-4">스틸컷 ({movie.stillCuts.length})</h3>
                    <div className="pt-4">
                        {movie.stillCuts && movie.stillCuts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {movie.stillCuts.map((url: string, idx: number) => (
                                    <div 
                                        key={idx} 
                                        // 💡 3. 이미지 그리드를 클릭했을 때 해당 스틸컷의 고유 인덱스 번호를 상태에 주입하여 모달 오픈
                                        onClick={() => setLightboxIndex(idx)}
                                        className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md group cursor-pointer"
                                    >
                                        <img 
                                            src={url} 
                                            alt={`${movie.title} 스틸컷 ${idx + 1}`} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors duration-300 flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full py-16 flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-slate-800">
                                <ImageIcon className="w-10 h-10 text-slate-700 mb-4" />
                                <span className="text-slate-500 font-bold">등록된 스틸컷 이미지가 없습니다.</span>
                            </div>
                        )}
                    </div>
                </TabsContent>
            
                <TabsContent value="cast" className="pt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {movie.cast.map((actor: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
                                {actor.profilePath ? (
                                    <img src={actor.profilePath} alt={actor.name} className="w-12 h-12 rounded-full object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                        <User className="w-6 h-6" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-white">{actor.name}</p>
                                    <p className="text-xs text-slate-500">{actor.character}</p>
                                </div>
                            </div>
                        ))}
                    </div> 
                </TabsContent>

                <TabsContent value="trailer" className="pt-4">
                    {movie.trailerKey ? (
                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${movie.trailerKey}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
                        <div className="aspect-video w-full bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 font-bold border border-slate-800">
                            등록된 예고편이 없습니다.
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="reviews" className="pt-4 space-y-4">
                    {movie.reviews && movie.reviews.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {/* 우측 상단 안내 문구 */}
                            <div className="flex justify-end mb-2">
                                <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full">
                                    해외 관람객의 리뷰는 AI 번역을 지원합니다.
                                </span>
                            </div>
                            
                            {/* 개별 리뷰 카드 마운트 */}
                            {movie.reviews.map((review: any) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full py-16 flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-slate-800">
                            <span className="text-slate-400 font-bold mb-2">아직 등록된 관람평이 없습니다.</span>
                            <span className="text-sm text-slate-600">첫 번째 관람평을 남겨보세요!</span>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>

        {/* 우측 액션 패널 (1/3) */}
        <div className="w-full md:w-1/3 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <span className="text-slate-400 font-bold">관람객 평점</span>
                    <span className="text-3xl font-black text-amber-400">{movie.voteAverage.toFixed(1)}</span>
                </div>
            
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleBooking}
                        className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-lg rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                    >
                        <CalendarCheck className="w-5 h-5" /> 예매하기
                    </button>
                    <button 
                        onClick={handleShare}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Share2 className="w-4 h-4" /> 공유하기
                    </button>
                </div>
            </div>
        </div>

        {/* 💡 4. 컴포넌트 최하단에 스틸컷 라이트박스 모달 마운트 */}
        <ImageLightbox 
            images={movie.stillCuts || []} 
            currentIndex={lightboxIndex} 
            onClose={() => setLightboxIndex(null)} 
            onIndexChange={setLightboxIndex} 
        />
    </div>
  );
}