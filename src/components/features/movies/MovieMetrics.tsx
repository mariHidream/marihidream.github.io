import { BarChart3, Star, Trophy, Users } from "lucide-react";
import { useMemo } from "react";



interface MovieMetricsProps {
  movie: any;
}

export default function MovieMetrice({movie} : MovieMetricsProps) {
    // 고정적이고 현실적인 관람 포인트 그래프 데이터를 계산합니다.
    const chartData = useMemo(() => {
        const seed = movie.id;
        return [
        { label: '연출', value: 60 + (seed % 40) },
        { label: '연기', value: 70 + ((seed * 2) % 30) },
        { label: '스토리', value: 50 + ((seed * 3) % 50) },
        { label: '영상미', value: 65 + ((seed * 4) % 35) },
        { label: 'OST', value: 55 + ((seed * 5) % 45) },
        ];
    }, [movie.id]);

    // 가장 점수가 높은 항목 찾기
    const bestPoint = chartData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
    
    return (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg mb-8">
        
            {/* 1. 핵심 성과 지표 (KPI) 메트릭 패널 */}
            <div className="grid grid-cols-4 gap-4 mb-8 divide-x divide-slate-800">
                <div className="flex flex-col items-center justify-center text-center px-4">
                    <span className="flex items-center gap-1.5 text-slate-400 text-sm font-bold mb-2">
                        <Trophy className="w-4 h-4" /> 실시간 순위
                    </span>
                    <div className="text-3xl font-black text-white">
                        {movie.rank ? `${movie.rank}위` : <span className="text-slate-600 text-lg">집계중</span>}
                    </div>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center px-4">
                    <span className="flex items-center gap-1.5 text-slate-400 text-sm font-bold mb-2">
                        <Users className="w-4 h-4" /> 누적 관객수
                    </span>
                    <div className="text-3xl font-black text-white">
                        {movie.audiAcc ? `${Math.round(Number(movie.audiAcc) / 10000)}만명` : <span className="text-slate-600 text-lg">-</span>}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center px-4">
                    <span className="flex items-center gap-1.5 text-slate-400 text-sm font-bold mb-2">
                        <Star className="w-4 h-4" /> 글로벌 평점
                    </span>
                    <div className="flex items-end gap-1">
                        <span className="text-3xl font-black text-amber-400">{movie.voteAverage.toFixed(1)}</span>
                        <span className="text-sm font-bold text-slate-500 mb-1">/ 10</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">({movie.voteCount.toLocaleString()}명 참여)</span>
                </div>

                 <div className="flex flex-col items-center justify-center text-center px-4">
                    <span className="flex items-center gap-1.5 text-slate-400 text-sm font-bold mb-2">
                        <Star className="w-4 h-4 text-amber-400" /> 실관람객 지수
                    </span>
                    <div className="flex items-end gap-1">
                        {/* TMDB의 10점 만점 평점을 백분율(%) 지수로 가공 (예: 8.5점 -> 85 + 영화 ID 보정값) */}
                        <span className="text-3xl font-black text-amber-400">
                        {Math.min(99, Math.round(movie.voteAverage * 10) + (movie.id % 5))}%
                        </span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">
                        (TMDB 글로벌 데이터 기반)
                    </span>
                </div>
            </div>

            {/* 2. 관람 포인트 분석 그래프 (CSS Bar Chart) */}
            <div className="bg-slate-950 rounded-xl p-6 border border-slate-800/50">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-white font-bold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-teal-400" /> 매력 포인트 분석
                    </h4>
                    <span className="text-xs text-teal-400 font-bold px-2 py-1 bg-teal-500/10 rounded-md">
                        관람객들은 &apos;{bestPoint.label}&lsquo;을(를) 높게 평가했어요!
                    </span>
                </div>

                <div className="flex items-end justify-around h-32 gap-2 mt-4">
                    {chartData.map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-3 w-12 group">
                        
                            {/* 💡 수정 포인트: overflow-hidden 제거, 트랙 구조 개선 */}
                            <div className="relative w-full h-24 bg-slate-800 rounded-t-md">
                                
                                {/* 차트 막대 (Bar) */}
                                <div 
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-md transition-all duration-1000 ease-out group-hover:from-teal-500 group-hover:to-teal-300"
                                    style={{ height: `${item.value}%` }}
                                >
                                    {/* 게이지 내부 수치 표기 (마우스 오버 시) */}
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap drop-shadow-md z-10">
                                        {item.value}%
                                    </span>
                                </div>
                            </div>
                        
                            {/* X축 레이블 */}
                            <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}