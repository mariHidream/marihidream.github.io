"use client"

import * as ToastPrimitive from '@radix-ui/react-toast';
import { useToastStore } from '../../store/useToastStore';
import { cn } from "@/src/lib/utils";
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';



export default function ToastProvider () {
    const {open, message, type, setOpen} = useToastStore();

    return (
        <ToastPrimitive.Provider swipeDirection="right">
            <ToastPrimitive.Root
                open={open}
                onOpenChange={setOpen}
                duration={3000} // 3초 후 자동 닫힘
                className={cn(
                    "bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 grid grid-cols-[auto_1fr_auto] items-center gap-3 w-full max-w-sm pointer-events-auto",
                    // Radix UI 상태 기반 Tailwind 애니메이션
                    "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full data-[state=open]:fade-in",
                    "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full data-[state=closed]:fade-out",
                    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
                    "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform",
                    "data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full"
                )}
            >
                {/* 타입에 따른 좌측 아이콘 분기 */}
                {type === 'success' && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
                {type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {type === 'info' && <Info className="w-5 h-5 text-blue-400" />}

                {/* 메시지 내용 */}
                <ToastPrimitive.Description className="text-sm font-bold text-white">
                {message}
                </ToastPrimitive.Description>

                {/* 닫기 버튼 */}
                <ToastPrimitive.Close className="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800">
                    <X className="w-4 h-4" />
                </ToastPrimitive.Close>
            </ToastPrimitive.Root>

            {/* 💡 알림이 실제로 렌더링될 물리적 위치 (화면 우측 하단 고정) */}
            <ToastPrimitive.Viewport className="fixed bottom-0 right-0 p-6 flex flex-col gap-2 w-full max-w-[420px] m-0 list-none z-[100] outline-none pointer-events-none" />
        </ToastPrimitive.Provider>
    ) 
}