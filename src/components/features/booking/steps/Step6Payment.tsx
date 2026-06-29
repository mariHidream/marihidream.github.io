"use client";

import { useMovieBookingStore } from "@/src/hooks/useMovieBookingStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useToastStore } from "@/src/store/useToastStore";
import { CreditCard, Loader2, Smartphone, Ticket, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PAYMENT_METHODS = [
  { id: 'card', name: '신용/체크카드', icon: CreditCard },
  { id: 'kakao', name: '카카오페이', icon: Smartphone },
  { id: 'toss', name: '토스페이', icon: Wallet },
];

export default function Step6Payment() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);
    
  const { 
    selectedMovieId, selectedMovieTitle, selectedMoviePosterPath, selectedDate, 
    selectedTheater, selectedSeats, totalPrice, 
    nextStep, prevStep 
  } = useMovieBookingStore();

  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    // 1. 유저 검증
    if (!isLoggedIn || !user?.email) {
      showToast('로그인이 필요합니다.', 'error');
      router.push('/login?callbackUrl=/booking');
      return;
    }

    setIsProcessing(true);

    try {
      // 2. 결제 API 서버 전송
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userEmail: user.email,
            selectedMovieId,
            selectedMovieTitle,
            selectedMoviePosterPath,
            selectedDate,
            selectedTheater,
            selectedSeats,
            totalPrice,
            paymentMethod: selectedMethod // 선택된 결제 수단도 백엔드로 전송 가능
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '결제에 실패했습니다.');
      }

      // 3. 결제 성공 시 다음 단계(Step 7)로 이동
      nextStep();

    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-white">결제 진행</h2>
        <p className="text-slate-400 text-sm">결제 수단을 선택하고 금액을 확인해 주세요.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">결제 수단</h3>
        <div className="grid grid-cols-3 gap-4">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex flex-col items-center justify-center py-6 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-teal-400 bg-teal-400/10 text-teal-400'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'animate-bounce' : ''}`} />
                <span className="text-sm font-bold">{method.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 최종 결제 금액 확인 요약바 */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex items-center justify-between shadow-xl">
        <span className="text-slate-400 font-bold flex items-center gap-2">
          <Ticket className="w-5 h-5" /> 총 결제 금액
        </span>
        <div className="text-3xl font-black text-teal-400">
          {totalPrice?.toLocaleString()} <span className="text-lg text-slate-500">원</span>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={prevStep}
          disabled={isProcessing}
          className="w-1/3 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors disabled:opacity-50"
        >
          이전 단계
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-2/3 flex justify-center items-center py-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 group"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2"><Loader2 className="w-6 h-6 animate-spin" /> 결제 처리 중...</span>
          ) : (
            <span className="flex items-center gap-2"><CreditCard className="w-6 h-6" /> 결제하기</span>
          )}
        </button>
      </div>
    </div>
  );
}