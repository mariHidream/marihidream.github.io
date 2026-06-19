"use client"

import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { addDays, format, isSaturday, isSunday, isToday } from "date-fns";
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";


export default function Step2Date() {
    const { selectedDate, selectDate, nextStep, prevStep } = useMovieBookingStore();

    // 오늘부터 14일치 날짜 배열 생성
    const dateList = useMemo(() => {
        return Array.from({ length: 14 }).map((_, idx) => addDays(new Date(), idx));
    }, []);

    const handleNext = () => {
        if (selectedDate) nextStep();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <h2 className="text-2xl font-black text-white">관람 일자를 선택해주세요</h2>
            
            {/* 가로 스크롤 날짜 선택기 */}
            <div className="flex gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x">
                {dateList.map((date) => {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    const dayOfWeek = format(date, 'E', { locale: ko });
                    const dayNumber = format(date, 'd');
                    const isSelected = selectedDate === formattedDate;
                    
                    let textColor = 'text-slate-300';
                    if (isSunday(date)) textColor = 'text-red-400';
                    if (isSaturday(date)) textColor = 'text-blue-400';
                    
                    return (
                        <button
                            key={formattedDate}
                            onClick={() => selectDate(formattedDate)}
                            className={`snap-center shrink-0 w-20 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                                isSelected 
                                ? 'border-teal-500 bg-teal-500 text-slate-950 font-black shadow-[0_0_15px_rgba(17,202,160,0.3)]' 
                                : 'border-slate-800 bg-slate-950 hover:border-slate-600'
                            }`}
                        >
                            <span className={`text-sm font-bold ${isSelected ? 'text-slate-800' : textColor}`}>
                                {isToday(date) ? '오늘' : dayOfWeek}
                            </span>
                            <span className={`text-2xl ${isSelected ? 'font-black' : 'font-bold text-white'}`}>
                                {dayNumber}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="flex-grow" />

            {/* 하단 네비게이션 액션 */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                <button 
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" /> 이전 단계 (영화 선택)
                </button>
                
                <button 
                onClick={handleNext}
                disabled={!selectedDate}
                className="flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-xl transition-all"
                >
                상영관 선택 <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            </div>
    )
}
