"use client";

import { useMovieBookingStore } from '@/src/hooks/useMovieBookingStore';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useToastStore } from '@/src/store/useToastStore';
import { AlertTriangle, CalendarCheck, Film, LogOut, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Modal from '../ui/Modal';

export default function Header (){

    const router = useRouter();
    const {user, isLoggedIn, logout} = useAuthStore();
    const showToast = useToastStore((state) => state.showToast);
    const selectedMovieId = useMovieBookingStore((state) => state.selectedMovieId);

    // 로그아웃 모달 오픈 상태
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutConfirm = async () => {
        setIsLoggingOut(true);
        try {
            // 1. 백엔드 보안 쿠키 제거 요청
            await fetch('/api/auth/logout', { method: 'POST' });

            // 2. 프론트엔드 전역 상태 초기화
            logout();
            showToast('안전하게 로그아웃 되었습니다.', 'success');
            
            setIsLogoutModalOpen(false);
            router.push('/');
            router.refresh();

        } catch (error) {
            showToast('로그아웃 처리 중 오류가 발생했습니다.', 'error');
        } finally{
            setIsLoggingOut(false);
        }

    }

    return (
        <>
       <header className="w-full bg-slate-950/95 border-b border-slate-900 text-white sticky top-0 z-50 backdrop-blur-md">
            {/* 1. 최상단 서브 유틸리티 바 */}
            <div className="w-full border-b border-slate-900/50 text-xs text-slate-400">
                <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-end gap-6">
                    <Link href="/membership" className="hover:text-white transition-colors">멤버십</Link>
                    <Link href="/support" className="hover:text-white transition-colors">고객센터</Link>
                    {isLoggedIn ? (
                        <button 
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="hover:text-white transition-colors">로그아웃</button>
                    ) : (
                        <Link href="/login" className="hover:text-white transition-colors">로그인</Link>
                    )}
                </div>
            </div>

            {/* 2. 메인 네비게이션 바 */}
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* 로고 */}
                <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-wider text-teal-400 font-serif">
                    <Film className="w-6 h-6 text-teal-400" />
                    NEXT CINEMA
                </Link>

                {/* 주 메뉴 영역 */}
                <nav className="hidden md:flex items-center gap-8 text-base font-bold text-slate-200">
                    <Link href="/booking" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                        <CalendarCheck className="w-4 h-4" /> 예매
                    </Link>
                    <Link href="/movies" className="hover:text-teal-400 transition-colors">영화</Link>
                    <Link href="/theaters" className="hover:text-teal-400 transition-colors">영화관</Link>
                    <Link href="/events" className="hover:text-teal-400 transition-colors">이벤트</Link>
                </nav>

                {/* 우측 마이페이지 / 전체메뉴 */}
                <div className="flex items-center gap-4">
                     {isLoggedIn && user ? (
                        <>
                            <Link href="/mypage" className="p-2 text-slate-300 hover:text-white transition-colors" title="마이페이지">
                                <User className="w-5 h-5" />
                            </Link>
                        </>
                    ) : (
                        <></>
                    )}
                    <button className="p-2 text-slate-300 hover:text-white transition-colors md:hidden">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>

        {/* 💡 [재사용성 증명] 공용 Radix UI Modal 기반 로그아웃 가드 팝업 */}
      <Modal 
        isOpen={isLogoutModalOpen} 
        onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)}
        title="세션 종료 확인"
      >
        <div className="space-y-6 py-2 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800">
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-black text-white">정말 로그아웃 하시겠습니까?</h4>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                현재 <span className="text-slate-200 font-bold">{user?.email}</span> 계정으로 로그인되어 있습니다.
              </p>
              {/* 아이디어 2번: 예매 컨텍스트 감지 경고 노출 */}
              {selectedMovieId && (
                <p className="text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md inline-block mt-2 animate-pulse">
                  ⚠️ 주의: 현재 진행 중인 영화 예매 설정 정보가 파기됩니다.
                </p>
              )}
            </div>
          </div>

          {/* 모달 하단 버튼 액션 바 */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              disabled={isLoggingOut}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleLogoutConfirm}
              disabled={isLoggingOut}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          </div>
        </div>
      </Modal>
      </>
    )
}