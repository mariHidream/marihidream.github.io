"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen : boolean;
    onClose : () => void;
    title? : string;
    children : React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    return (
        // onOpenChange를 통해 모달 밖(오버레이)을 클릭하거나 Esc를 눌렀을 때의 닫힘 이벤트를 제어합니다.
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                {/* 1. 배경 딤(Dim) 처리 영역 */}
                <Dialog.Overlay className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

                {/* 2. 실제 모달 콘텐츠 컨테이너 (화면 정중앙 배치) */}
                <Dialog.Content className="fixed left-[50%] top-[50%] z-[200] w-full max-w-4xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] focus:outline-none">
                
                    {/* 공통 헤더 */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50 shrink-0">
                        <Dialog.Title className="text-xl font-black text-white">
                            {title}
                        </Dialog.Title>
                        
                        {/* 닫기 버튼 (Radix UI의 Close 컴포넌트와 결합) */}
                        <Dialog.Close asChild>
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <X className="w-6 h-6" />
                                <span className="sr-only">닫기</span> {/* 시각장애인용 스크린리더 텍스트 */}
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* 주입되는 가변 콘텐츠 영역 */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}