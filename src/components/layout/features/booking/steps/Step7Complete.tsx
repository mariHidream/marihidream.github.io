"use client";

import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { CheckCircle2, Home, Receipt } from "lucide-react";
import { useRouter } from "next/navigation"

export default function Step7Complete(){

    const router = useRouter();
    const {selectedMovieTitle, selectedDate, selectedTheater, selectedSeats, resetBooking} = useMovieBookingStore();

    const handleGoMain = () => {
        resetBooking(); // 스토어 초기화 (1단계로 복귀 및 데이터 클리어)
        router.push('/');
    };

    const handleGoMyPage = () => {
        resetBooking();
        router.push('/mypage');
    };
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-700 h-full py-12">
            <div className="relative">
                <div className="absolute inset-0 bg-teal-500 blur-2xl opacity-20 rounded-full" />
                <CheckCircle2 className="w-24 h-24 text-teal-400 relative z-10" />
            </div>
            
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">예매가 완료되었습니다!</h2>
                <p className="text-slate-400">선택하신 영화의 예매 내역이 정상적으로 발권되었습니다.</p>
            </div>

            {/* 모바일 티켓 컨셉 UI */}
            <div className="w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-950 p-6 rounded-3xl border border-slate-700 shadow-2xl relative">
                <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-900 rounded-full border-r border-slate-700" />
            
                <div className="absolute -right-3 top-1/2 w-6 h-6 bg-slate-900 rounded-full border-l border-slate-700" />
                
                <h3 className="text-xl font-black text-white mb-6 border-b border-slate-700 pb-4">
                    {selectedMovieTitle}
                </h3>
                <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                        <span className="text-slate-500 text-sm">일시</span>
                        <span className="text-slate-200 font-bold">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 text-sm">상영관</span>
                        <span className="text-slate-200 font-bold">{selectedTheater}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 text-sm">좌석</span>
                        <span className="text-teal-400 font-black">{selectedSeats.join(', ')}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button onClick={handleGoMain} className="flex items-center gap-2 px-6 py-3 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-bold rounded-xl transition-all">
                    <Home className="w-4 h-4" /> 메인으로
                </button>
                <button onClick={handleGoMyPage} className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl transition-all">
                    <Receipt className="w-4 h-4" /> 예매 내역 확인
                </button>
            </div>
        </div>
    )
}
