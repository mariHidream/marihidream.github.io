"use client";

import { useToastStore } from "@/src/store/useToastStore";
import { Film, Lock, Loader2, Mail, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


export default function SignupPage(){
    const router = useRouter();
    const showToast = useToastStore((state) => state.showToast);

    // 폼 입력 상태
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 이메일 유효성 검사 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!name || !email || !password || !passwordConfirm){
            showToast('모든 항목을 입력해 주세요.', 'error');
            return;
        }

        if(!emailRegex.test(email)){
            showToast('올바른 이메일 형식을 입력해 주세요,','error');
            return;
        }

        if(password.length < 8) {
            showToast('비밀번호는 8자리 이상이어야 합니다.','error');
            return;
        }

        if(password !== passwordConfirm) {
            showToast('비밀번호가 일치하지 않습니다', 'error');
            return;
        } 

        setIsLoading(true);

        try{
            // 💡 1단계에서 구축한 회원가입 API 엔드포인트 호출
            const response = await fetch('/api/auth/signup',{
                method: 'POST',
                headers : {'Content-Type' : 'application/json'},
                body: JSON.stringify({name, email, password}),
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || '회원가입에 실패했습니다.')
            }

            showToast('회원가입이 완료되었습니다. 로그인해 주세요.', 'success');
            router.push('/login');

        } catch(error : any){
            showToast('error.message', 'error');
        } finally{
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center bg-slate-950 px-4 py-16">
            <div className="max-w-md w-full space-y-8 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/60 backdrop-blur-md shadow-2xl">
                
                {/* 서비스 브랜딩 로고 헤더 */}
                <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-teal-400 mb-4 shadow-inner">
                        <Film className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">회원가입</h2>
                    <p className="mt-2 text-sm font-bold text-slate-400">
                        NEXT CINEMA의 멤버가 되어 모든 혜택을 누리세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="space-y-4">
                        
                        {/* 이름 입력 */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none relative block w-full pl-12 pr-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-bold transition-all"
                                placeholder="이름 (닉네임)"
                            />
                        </div>

                        {/* 이메일 입력 */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full pl-12 pr-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-bold transition-all"
                                placeholder="이메일 주소 (로그인 ID)"
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full pl-12 pr-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-bold transition-all"
                                placeholder="비밀번호 (8자리 이상)"
                            />
                        </div>

                        {/* 비밀번호 확인 입력 */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                required
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                className="appearance-none relative block w-full pl-12 pr-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-bold transition-all"
                                placeholder="비밀번호 다시 입력"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-teal-500 transition-all shadow-lg shadow-teal-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> 회원 가입하기
                            </span>
                        )}
                    </button>

                    <div className="flex items-center justify-center text-xs font-bold pt-2">
                        <span className="text-slate-500">이미 계정이 있으신가요?</span>
                        <Link 
                            href="/login" 
                            className="ml-2 text-teal-400 hover:text-teal-300 underline transition-colors"
                        >
                            로그인 하기
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}