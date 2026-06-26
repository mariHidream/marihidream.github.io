"use client";

import { useAuthStore } from "@/src/store/useAuthStore";
import { Armchair, Calendar, Film, Mail, QrCode, ShieldAlert, Ticket, User } from "lucide-react";

export default function MyPage() {
    const { user, isLoggedIn } = useAuthStore();

    if(!isLoggedIn || !user) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
                <h3 className="text-xl font-black text-white">접근 권한이 없습니다.</h3>
                <p className="text-sm text-slate-500 mt-2">로그인 세션이 만료되었거나 비정상적인 접근입니다.</p>
            </div>
        );
    }
    // 💡 [기획 반영] 마이페이지의 핵심 가치: 실시간 예매 데이터 템플릿 풀
    const mockBookingHistory = [
        {
            bookingId: "NX-20260626-883",
            title: "토이 스토리 5",
            posterPath: "https://image.tmdb.org/t/p/w500/AqrJx3nVVMlKWXGaPIH32GzjEJA.jpg", // 이전 스크린샷 연동 규격 가정
            date: "2026.06.28 (일)",
            time: "14:30 ~ 16:15",
            theater: "강남 4관 (LASER)",
            seats: "H열 12번, H열 13번",
            count: "일반 2명",
            status: "RESERVED" // 예매 완료 상태
        },
        {
            bookingId: "NX-20260612-401",
            title: "만달로리안과 그로구",
            posterPath: "https://image.tmdb.org/t/p/w500/tMP99wq45GQMoeZwITgjAS8Wihm.jpg",
            date: "2026.06.14 (일)",
            time: "19:00 ~ 21:06",
            theater: "코엑스 7관",
            seats: "F열 7번",
            count: "일반 1명",
            status: "WATCHED" // 관람 완료 상태
        }
    ];
    return (
       <div className="w-full max-w-5xl mx-auto px-6 py-12 space-y-10">
            
            {/* 1. 상단 미니 유저 프로필 카드 대시보드 */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/40 p-8 rounded-3xl border border-slate-800/80 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                    <User className="w-10 h-10" />
                </div>
                <div className="text-center sm:text-left space-y-1">
                    <h2 className="text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                        <span>{user.name}</span>
                        <span className="text-xs px-2.5 py-0.5 bg-teal-400/10 text-teal-400 border border-teal-400/20 rounded-md font-bold">일반회원</span>
                    </h2>
                    <p className="text-sm font-medium text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                        <Mail className="w-4 h-4 text-slate-600" /> 
                        {user.email}
                    </p>
                </div>
            </div>

            {/* 2. 메인 하단: 예매 히스토리 가시성 극대화 영역 */}
            <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-900">
                    <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
                        <Ticket className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">나의 예매 내역 ({mockBookingHistory.length}건)</h3>
                </div>

                <div className="flex flex-col gap-6">
                    {mockBookingHistory.map((ticket, index) => (
                        <div 
                            key={ticket.bookingId}
                            className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6 p-6 transition-all hover:border-slate-700"
                        >
                        {/* 영화 포스터 파트 */}
                        <div className="w-24 aspect-[3/4]  mx-auto md:mx-0 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shrink-0">
                            {ticket.posterPath ? (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                                    <img
                                        src={ticket.posterPath} 
                                        alt={ticket.title}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                                    <Film className="w-8 h-8" />
                                </div>
                            )}
                        </div>

                        {/* 티켓 예매 세부 데이터 내역 파트 */}
                        <div className="space-y-4 text-center md:text-left">
                            <div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                                    <span className="text-[10px] font-black font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
                                        정산ID: {ticket.bookingId}
                                    </span>
                                    {ticket.status === 'RESERVED' ? (
                                        <span className="text-[10px] font-bold bg-teal-500 text-slate-950 px-2 py-0.5 rounded">
                                            예매완료
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                                            관람완료
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-xl font-black text-white tracking-tight">{ticket.title}</h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm font-bold text-slate-400">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Calendar className="w-4 h-4 text-slate-600 shrink-0" />
                                    <span>{ticket.date} <span className="text-teal-400">{ticket.time}</span></span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Film className="w-4 h-4 text-slate-600 shrink-0" />
                                    <span>{ticket.theater}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 sm:col-span-2">
                                    <Armchair className="w-4 h-4 text-slate-600 shrink-0" />
                                    <span>{ticket.seats} <span className="text-slate-600 font-normal">({ticket.count})</span></span>
                                </div>
                            </div>
                        </div>

                        {/* 우측 스마트 모바일 티켓 입장용 바코드 오버레이 파트 */}
                        <div className="border-t md:border-t-0 md:border-l border-dashed border-slate-800 pt-6 md:pt-0 md:pl-8 flex flex-col items-center justify-center shrink-0">
                            {ticket.status === 'RESERVED' ? (
                                <div className="bg-white p-3 rounded-2xl shadow-xl border border-white/10 transition-transform hover:scale-105 cursor-pointer group relative">
                                    <QrCode className="w-20 h-20 text-slate-950" />
                                    <div className="absolute inset-0 bg-white/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-[10px] font-black text-teal-600 tracking-tighter shadow-sm">입장 전용</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="inline-flex items-center justify-center w-26 h-26 bg-slate-950/40 border border-slate-800/60 p-4 rounded-2xl text-slate-600 font-bold text-xs text-center select-none">
                                    사용 완료된<br />티켓입니다.
                                </div>
                            )}
                        </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}