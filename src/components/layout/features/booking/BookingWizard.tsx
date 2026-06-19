"use client";

import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { useEffect } from "react";
import Step1Movie from "./steps/Step1Movie";
import Step2Date from "./steps/Step2Date";
import Step3Theater from "./steps/Step3Theater";
import Step4Seat from "./steps/Step4Seat";
import Step5Confirm from "./steps/Step5Confirm";
import Step6Payment from "./steps/Step6Payment";
import Step7Complete from "./steps/Step7Complete";

interface BookingWizardProps {
  movies: MovieBase[];
}


export default function BookingWizard ({movies} : BookingWizardProps) {
    const { currentStep, selectedMovieTitle, selectedDate, resetBooking } = useMovieBookingStore();

    // 페이지 이탈 또는 컴포넌트 언마운트 시 예매 상태 초기화 방어 로직
    useEffect(() => {
        return () => resetBooking();
    }, [resetBooking]);

    // 스텝 인디케이터 라벨
    const stepLabels = ['영화', '날짜', '상영관', '좌석', '확인', '결제', '완료'];

    return (
       <div className="flex flex-col lg:flex-row gap-8 items-start">
        
            {/* 좌측: 메인 프로세스 영역 (전체 너비의 2/3) */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
                
                {/* 프로그레스 인디케이터 바 */}
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                    {stepLabels.map((label, idx) => {
                        const stepNum = idx + 1;
                        const isActive = currentStep === stepNum;
                        const isPassed = currentStep > stepNum;
                        return (
                        <div key={label} className="flex flex-col items-center gap-2 relative z-10 w-full">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                isActive ? 'bg-teal-500 text-slate-950 shadow-[0_0_10px_rgba(17,202,160,0.5)]' :
                                isPassed ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-500'
                                }`}
                            >
                                {stepNum}
                            </div>
                            <span className={`text-xs font-bold ${isActive ? 'text-teal-400' : 'text-slate-500'}`}>
                                {label}
                            </span>
                        </div>
                        );
                    })}
                </div>

                {/* 뷰 스위칭 렌더러 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 min-h-[500px] shadow-xl">
                    {currentStep === 1 && <Step1Movie movies={movies} />}
                    {currentStep === 2 && <Step2Date />}
                    {currentStep === 3 && <Step3Theater />}
                    {currentStep === 4 && <Step4Seat />}
                    {currentStep === 5 && <Step5Confirm />}
                    {currentStep === 6 && <Step6Payment />}
                    {currentStep === 7 && <Step7Complete />}
                </div>
            </div>

            {/* 우측: 실시간 예매 요약 사이드바 (Sticky) */}
            <div className="w-full lg:w-1/3 bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-xl">
                <h3 className="text-xl font-black text-white mb-6 border-b border-slate-800 pb-4">예매 요약</h3>
                
                <div className="space-y-4 text-sm font-medium text-slate-300">
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                        <span className="text-slate-500">선택 영화</span>
                        <span className="text-teal-400 font-bold">{selectedMovieTitle || '미선택'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                        <span className="text-slate-500">관람 일자</span>
                        <span className="text-white">{selectedDate || '미선택'}</span>
                    </div>
                    {/* 극장, 좌석, 금액 등은 이후 스텝에서 채워집니다. */}
                </div>
            </div>
        </div>
    );
}
