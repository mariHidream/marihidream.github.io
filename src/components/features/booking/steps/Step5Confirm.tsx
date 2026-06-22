"use client";

import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { Calendar, ChevronLeft, ChevronRight, MapPin, Ticket, Users } from "lucide-react";


export default function Step5Confirm() {
    const { 
        selectedMovieTitle, 
        selectedDate, 
        selectedTheater, 
        selectedSeats, 
        totalPrice, 
        nextStep, 
        prevStep 
    } = useMovieBookingStore();
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <h2 className="text-2xl font-black text-white">결제 전 예매 내역을 확인해주세요</h2>
      
      {/* 예매 영수증(Receipt) 형태의 UI */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
        {/* 장식용 절취선 패턴 */}
        <div className="absolute top-0 left-0 w-full h-3 flex gap-2 overflow-hidden px-2 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-slate-900 rounded-full -mt-2 shrink-0" />
          ))}
        </div>

        <div className="space-y-6 pt-4">
          <div className="flex items-start gap-4 pb-6 border-b border-dashed border-slate-800">
            <Ticket className="w-8 h-8 text-teal-400 shrink-0" />
            <div>
              <p className="text-sm text-slate-500 font-bold mb-1">영화</p>
              <h3 className="text-2xl font-black text-white">{selectedMovieTitle}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-dashed border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 rounded-xl"><Calendar className="w-5 h-5 text-slate-400" /></div>
              <div>
                <p className="text-xs text-slate-500 font-bold">일시</p>
                <p className="text-sm font-bold text-slate-200">{selectedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 rounded-xl"><MapPin className="w-5 h-5 text-slate-400" /></div>
              <div>
                <p className="text-xs text-slate-500 font-bold">상영관</p>
                <p className="text-sm font-bold text-slate-200">{selectedTheater}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-2">
              <div className="p-3 bg-slate-900 rounded-xl"><Users className="w-5 h-5 text-slate-400" /></div>
              <div>
                <p className="text-xs text-slate-500 font-bold">인원 및 좌석 ({selectedSeats.length}명)</p>
                <p className="text-sm font-bold text-teal-400">{selectedSeats.join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-400 font-bold">최종 결제 금액</span>
            <span className="text-3xl font-black text-white">{totalPrice.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      <div className="flex-grow" />

      <div className="flex justify-between items-center pt-6 border-t border-slate-800">
        <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" /> 좌석 다시 선택
        </button>
        <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl transition-all">
          결제 진행하기 <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
    )
}
