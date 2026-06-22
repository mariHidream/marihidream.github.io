"use client"

import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";


// 가상의 상영관 데이터 구조
const THEATER_DATA = [
  { region: '서울', theaters: ['강남', '건대입구', '김포공항', '신림', '월드타워', '홍대입구'] },
  { region: '경기/인천', theaters: ['수원', '안산', '부천', '인천아시아드', '일산'] },
  { region: '충청/대전', theaters: ['대전', '청주', '천안'] },
  { region: '경상/부산', theaters: ['부산본점', '센텀시티', '대구', '창원'] },
];

export default function Step3Theater(){

    const {selectedTheater, selectTheater, nextStep, prevStep}  = useMovieBookingStore();
    const [activeRegion, setActiveRegion] = useState(THEATER_DATA[0].region);

    const activeTheaters = THEATER_DATA.find(d => d.region === activeRegion)?.theaters || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <h2 className="text-2xl font-black text-white">관람하실 상영관을 선택해주세요</h2>
        
            <div className="flex flex-col md:flex-row gap-6 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                
                {/* 1 Depth: 지역 선택 사이드바 */}
                <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-2 overflow-x-auto border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4 scrollbar-hide">
                    {THEATER_DATA.map((data) => (
                        <button
                            key={data.region}
                            onClick={() => setActiveRegion(data.region)}
                            className={`shrink-0 text-left px-4 py-3 rounded-xl font-bold transition-colors ${
                                activeRegion === data.region 
                                ? 'bg-slate-800 text-white' 
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                            }`}
                        >
                            {data.region}
                        </button>
                    ))}
                </div>

                {/* 2 Depth: 상세 지점 선택 그리드 */}
                <div className="w-full md:w-2/3 grid grid-cols-2 gap-3 content-start">
                    {activeTheaters.map((theater) => {
                        const isSelected = selectedTheater === theater;
                        return (
                        <button
                            key={theater}
                            onClick={() => selectTheater(theater)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                            isSelected 
                                ? 'border-teal-500 bg-teal-500/10 text-teal-400 font-black' 
                                : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600'
                            }`}
                        >
                            <MapPin className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-600'}`} />
                            {theater}
                        </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-grow" />

            {/* 하단 네비게이션 액션 */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                <button 
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" /> 이전 단계 (날짜 선택)
                </button>
                
                <button 
                    onClick={nextStep}
                    disabled={!selectedTheater}
                    className="flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black rounded-xl transition-all"
                >
                    좌석 선택 <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
