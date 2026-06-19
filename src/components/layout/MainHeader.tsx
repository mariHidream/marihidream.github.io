"use client";

import { useAuthStore } from '@/src/store/useAuthStore';
import { CalendarCheck, Film, Menu, User } from 'lucide-react';
import Link from 'next/link';

export default function MainHeader (){

    const {isAuthenticated, logout } = useAuthStore();

    return (
       <header className="w-full bg-slate-950/95 border-b border-slate-900 text-white sticky top-0 z-50 backdrop-blur-md">
            {/* 1. 최상단 서브 유틸리티 바 */}
            <div className="w-full border-b border-slate-900/50 text-xs text-slate-400">
                <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-end gap-6">
                    <Link href="/membership" className="hover:text-white transition-colors">멤버십</Link>
                    <Link href="/support" className="hover:text-white transition-colors">고객센터</Link>
                    {isAuthenticated ? (
                        <button onClick={() => logout()} className="hover:text-white transition-colors">로그아웃</button>
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
                    <Link href="/mypage" className="p-2 text-slate-300 hover:text-white transition-colors" title="마이페이지">
                        <User className="w-5 h-5" />
                    </Link>
                    <button className="p-2 text-slate-300 hover:text-white transition-colors md:hidden">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    )
}