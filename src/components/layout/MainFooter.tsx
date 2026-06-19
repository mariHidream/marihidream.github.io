
"use client";

import { Film } from "lucide-react";

export default function MainFooter () {
    return (    
        <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-500 text-xs py-12">
            <div className="max-w-7xl mx-auto px-6 space-y-6">
                {/* 상단 이용 약관 가이드 링크 */}
                <div className="flex flex-wrap gap-6 font-bold text-slate-400">
                    <span className="hover:text-slate-300 cursor-pointer">회사소개</span>
                    <span className="hover:text-slate-300 cursor-pointer">이용약관</span>
                    <span className="hover:text-slate-300 cursor-pointer text-slate-200 font-black">개인정보처리방침</span>
                    <span className="hover:text-slate-300 cursor-pointer">고객센터</span>
                </div>

                <div className="border-t border-slate-900/60 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2 leading-relaxed max-w-3xl">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 font-serif mb-1">
                            <Film className="w-4 h-4 text-teal-500" /> NEXT CINEMA
                        </div>
                        <p>서울특별시 송파구 올림픽로 | 대표이사 김프론 | 고객센터 1544-0000</p>
                        <p>사업자등록번호 000-00-00000 | 통신판매업신고번호 제2026-서울송파-0000호</p>
                        <p className="text-[10px] text-slate-600 tracking-wide mt-2">Copyright © NEXT CINEMA All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}