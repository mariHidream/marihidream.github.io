"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { useMovieBookingStore } from '@/src/hooks/useMovieBookingStore';

export default function Step7Complete() {
  const router = useRouter();
  const resetBooking = useMovieBookingStore((state) => state.resetBooking);

  // 💡 유저가 완료 화면을 벗어날 때(언마운트 시) 스토어를 초기화하여 다음 예매를 준비시킵니다.
  useEffect(() => {
    return () => {
      resetBooking();
    };
  }, [resetBooking]);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center border-4 border-teal-500/20 mb-2">
        <CheckCircle2 className="w-12 h-12 text-teal-400" />
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white">예매가 완료되었습니다!</h2>
        <p className="text-slate-400 font-medium">
          예매하신 티켓은 마이페이지에서 확인하실 수 있습니다.
        </p>
      </div>

      <div className="flex gap-4 pt-8">
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
        >
          홈으로 가기
        </button>
        <button 
          onClick={() => router.push('/mypage')}
          className="px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl shadow-lg shadow-teal-500/20 transition-all"
        >
          예매 내역 확인
        </button>
      </div>
    </div>
  );
}