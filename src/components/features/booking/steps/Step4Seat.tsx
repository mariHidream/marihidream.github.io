"use client";

import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { ChevronLeft, ChevronRight, Monitor } from "lucide-react";
import { useEffect } from "react";


const TICKET_PRICE = 15000; // 티켓 장당 가격 설정
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const COLS = 12; // 열 개수
const BOOKED_SEATS_MOCK = ['C5', 'C6', 'E8', 'E9', 'F12']; // 이미 예매된 좌석 (가상 데이터)

export default function Step4Seat (){
    const { selectedSeats, toggleSeat, setTotalPrice, nextStep, prevStep } = useMovieBookingStore();
    useEffect(()=>{
        setTotalPrice(selectedSeats.length * TICKET_PRICE);

    },[selectedSeats.length, setTotalPrice]);

    const handleSeatClick = (seatId: string, isBooked: boolean) => {
        if (isBooked) return;
        // 최대 4장까지만 예매 가능하도록 제한
        if (selectedSeats.length >= 4 && !selectedSeats.includes(seatId)) {
            alert('좌석은 최대 4개까지만 선택 가능합니다.');
            return;
        }
        toggleSeat(seatId);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <div className="flex justify-between items-end">
                <h2 className="text-2xl font-black text-white">원하시는 좌석을 선택해주세요</h2>
                <span className="text-sm text-slate-400">최대 4인 선택 가능</span>
            </div>
            
            {/* 범례 (Legend) */}
            <div className="flex items-center justify-center gap-6 text-xs font-bold bg-slate-950 py-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-700 rounded-sm" /> 예매 가능</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-teal-500 shadow-[0_0_10px_rgba(17,202,160,0.5)] rounded-sm" /> 선택됨</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center font-black text-[10px] rounded-sm">X</div> 예매 완료</div>
            </div>

            {/* 스크린 및 좌석 그리드 렌더러 */}
            <div className="w-full overflow-x-auto pb-4">
                <div className="min-w-[600px] flex flex-col items-center gap-8">
                    
                    {/* 스크린 커브드 디자인 */}
                    <div className="relative w-4/5 h-12 flex items-center justify-center">
                        <div className="absolute inset-0 border-t-4 border-slate-600 rounded-t-[50%] blur-[1px]" />
                        <div className="absolute top-0 w-3/4 h-8 bg-gradient-to-b from-white/10 to-transparent blur-md" />
                        <span className="text-slate-500 font-black tracking-[0.5em] flex items-center gap-2">
                        <Monitor className="w-4 h-4" /> SCREEN
                        </span>
                    </div>

                    {/* 좌석 배치도 */}
                    <div className="flex flex-col gap-3">
                        {ROWS.map((row) => (
                            <div key={row} className="flex items-center gap-6">
                                {/* 행 레이블 */}
                                <div className="w-6 text-center text-slate-500 font-black text-sm">{row}</div>
                                
                                <div className="flex gap-2">
                                    {Array.from({ length: COLS }).map((_, colIdx) => {
                                        const seatNumber = colIdx + 1;
                                        const seatId = `${row}${seatNumber}`;
                                        const isBooked = BOOKED_SEATS_MOCK.includes(seatId);
                                        const isSelected = selectedSeats.includes(seatId);

                                        // 복도(Aisle) 통로 생성: 4번과 8번 좌석 우측에 마진 부여
                                        const isAisle = seatNumber === 4 || seatNumber === 8;

                                        return (
                                            <button
                                                key={seatId}
                                                disabled={isBooked}
                                                onClick={() => handleSeatClick(seatId, isBooked)}
                                                className={`w-8 h-8 rounded-t-lg rounded-b-sm font-bold text-[11px] transition-all flex items-center justify-center ${isAisle ? 'mr-6' : ''} ${
                                                isBooked 
                                                    ? 'bg-slate-900 border border-slate-800 text-slate-700 cursor-not-allowed' 
                                                    : isSelected
                                                    ? 'bg-teal-500 text-slate-950 shadow-[0_0_12px_rgba(17,202,160,0.6)] scale-110 -translate-y-1'
                                                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                                }`}
                                            >
                                                {isBooked ? 'X' : seatNumber}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-grow" />

            {/* 하단 결제 금액 확인 및 네비게이션 */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                <button 
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" /> 이전 단계 (상영관 선택)
                </button>
                
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="text-xs text-slate-400 block">총 결제 예상 금액</span>
                        <span className="text-2xl font-black text-white">{(selectedSeats.length * TICKET_PRICE).toLocaleString()}원</span>
                    </div>
                    <button 
                        onClick={nextStep}
                        disabled={selectedSeats.length === 0}
                        className="flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-xl transition-all"
                    >
                        예매 확인 <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
