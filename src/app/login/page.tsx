
"use client";

import { useAuthStore } from "@/src/store/useAuthStore";
import { useToastStore } from "@/src/store/useToastStore";
import { Film, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

// useSearchParams 제어를 위해 폼 컴퍼넌트 분리
function LoginForm(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const loginDetails = useAuthStore((state) => state.login);
    const showToast = useToastStore((state) => state.showToast);

    // 인증 후 이동할 목적지 추출 (없으면 메인 페이지로 지정)
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    // 폼 입력 상태 관리
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();

        if(!email || ! password) {
            showToast('이메일과 비밀번호를 모두 입력해 주세요.', 'error');
            return;
        }

        setIsLoading(true);

        try{
            // 앞서 구축한 백엔드 로그인 API 엔드포인트 호출
            const response = await fetch('/api/auth/login', {
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({email, password})
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || '로그인에 실패했습니다.');
            }

            // 1. Zustand 스토어에 유저 세션 정보 주입
            loginDetails(data.user);

            // 2. 글로벌 토스트 알림 트리거
            showToast(`${data.user.name}님, 환영합니다!`,'success');

            // 3. 의도했던 목적지 또는 메인 화면으로 리다이렉트
            router.push(callbackUrl);
            router.refresh(); // 미들웨어 쿠키 정합성 즉시 갱신을 위한 새로고침 유도

        } catch (e : any){
            showToast(e.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md shadow-sm">
                {/* 이메일 입력 필드 */}
                <div className="relative">
                    <label htmlFor="email-address" className="sr-only">이메일 주소</label>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-5 h-5" />
                    </div>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none relative block w-full pl-12 pr-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-bold transition-all"
                        placeholder="이메일 주소를 입력하세요"
                    />
                </div>

                {/* 비밀번호 입력 필드 */}
                <div className="relative">
                    <label htmlFor="password" className="sr-only">비밀번호</label>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-5 h-5" />
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none relative block w-full pl-12 pr-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-bold transition-all"
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>
            </div>

            {/* 서브밋 버튼 컨트롤바 */}
            <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-teal-500 transition-all shadow-lg shadow-teal-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <span className="flex items-center gap-1.5">
                        로그인 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                )}
            </button>

            {/* 하단 서브 링크 인터랙션 영역 */}
            <div className="flex items-center justify-center text-xs font-bold pt-2">
                <span className="text-slate-500">아직 회원이 아니신가요?</span>
                <Link 
                    href="/signup" 
                    className="ml-2 text-teal-400 hover:text-teal-300 underline transition-colors"
                >
                회원가입 하기
                </Link>
            </div>
        </form>
    )
}


export default function LoginPage(){
 return (
    <div className="flex-grow flex items-center justify-center bg-slate-950 px-4 py-24">
        <div className="max-w-md w-full space-y-8 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/60 backdrop-blur-md shadow-2xl">
            
            {/* 서비스 브랜딩 로고 헤더 */}
            <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-teal-400 mb-4 shadow-inner">
                    <Film className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">NEXT CINEMA</h2>
                <p className="mt-2 text-sm font-bold text-slate-400">
                    로그인 후 스마트한 예매 서비스를 이용해 보세요.
                </p>
            </div>


            {/* Suspense : 비동기 작업(데이터 페칭, 브라우저 URL 파싱 등)이 완료될 때까지 해당 컴포넌트의 렌더링을 잠시 멈추고(Suspend),
                그동안 사용자에게 대체 UI(Fallback - 예: 로딩 스피너)를 보여주는 장치 
            */}
            <Suspense 
                fallback={
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                    </div>
                }
            >
                <LoginForm />
            </Suspense>
        </div>
    </div>
    )
}
