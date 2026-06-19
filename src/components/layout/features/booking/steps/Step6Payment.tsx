"use client";

import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { ChevronLeft, CreditCard, Loader2, Smartphone, Wallet } from "lucide-react";
import { useState } from "react";

const PAYMENT_METHODS = [
  { id: 'card', name: '신용/체크카드', icon: CreditCard },
  { id: 'kakao', name: '카카오페이', icon: Smartphone },
  { id: 'toss', name: '토스페이', icon: Wallet },
];


export default function Step6Payment (){
    const {totalPrice, nextStep, prevStep} = useMovieBookingStore();
    const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
    const [isProcessing, setIsProcessing] = useState(false);

    // 가상의 결제 비동기 프로세스
    const handlePayment = async () => {
        setIsProcessing(true);
        // 실제 PG사 연동 시 이곳에 결제 검증 로직이 들어갑니다.
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setIsProcessing(false);
        nextStep(); // 결제 완료 후 7단계로 이동
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <h2 className="text-2xl font-black text-white">결제 수단을 선택해주세요</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;
                    return (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            disabled={isProcessing}
                            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${
                                isSelected 
                                ? 'border-teal-500 bg-teal-500/10 text-teal-400' 
                                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600'
                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Icon className="w-8 h-8" />
                            <span className="font-bold">{method.name}</span>
                        </button>
                    );
                })}
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 font-bold">결제 예정 금액</span>
                <span className="text-2xl font-black text-teal-400">{totalPrice.toLocaleString()}원</span>
            </div>

            <div className="flex-grow" />

            <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                <button onClick={prevStep} disabled={isProcessing} className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white disabled:opacity-50 transition-colors">
                    <ChevronLeft className="w-5 h-5" /> 이전 (내역 확인)
                </button>
                <button 
                    onClick={handlePayment} 
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-10 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> 결제 진행 중...</>
                    ) : (
                        `${totalPrice.toLocaleString()}원 결제하기`
                    )}
                </button>
            </div>
        </div>
    )
}
