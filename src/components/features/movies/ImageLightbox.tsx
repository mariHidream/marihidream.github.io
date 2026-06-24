"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect } from "react";


interface ImageLightboxProps {
    images : string[];
    currentIndex : number | null;
    onClose : () => void;
    onIndexChange : (index: number) => void;
} 

export default function ImageLightbox({images , currentIndex , onClose, onIndexChange}:ImageLightboxProps){
    
    // 이전 이미지로 이동 (무한 루프 방어 코드)
    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        onIndexChange((currentIndex-1 + images.length) % images.length);
    }

    // 다음 이미지로 이동 (무한 루프 방어 코드)
    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        onIndexChange((currentIndex + 1) % images.length);
    }


    useEffect(()=>{
        const handleKeyDown = (event : KeyboardEvent) => {
            if(event.key === 'Escape') onClose();
            if(event.key === 'ArrowLeft') handlePrev();
            if(event.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);

    }, [currentIndex]);

    // 모달이 닫혀있는 상태(null)이면 렌더링하지 않음
    if (currentIndex === null || images.length === 0) return null;

    const currentImageUrl = images[currentIndex];


    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[150] flex items-center justify-center animate-in fade-in duration-300 pointer-events-auto"
        >
            {/* 닫기 버튼 */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-3 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-20"
            >
                <X className="w-6 h-6" />
            </button>

            {/* 중앙 메인 미디어 프레임 */}
            <div className="relative max-w-5xl w-full max-h-[80vh] px-16 flex items-center justify-center">
                
                {/* 좌측 이동 화살표 */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 p-4 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* 메인 고화질 스틸컷 이미지 */}
                <img 
                    src={currentImageUrl} 
                    alt={`확대된 스틸컷 ${currentIndex + 1}`}
                    onClick={(e) => e.stopPropagation()} // 이미지 자체를 클릭했을 때는 꺼지지 않도록 처리
                    className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-slate-800/50 animate-in zoom-in-95 duration-300 select-none"
                />

                {/* 우측 이동 화살표 */}
                <button
                    onClick={handleNext}
                    className="absolute right-4 p-4 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* 하단 현재 인디케이터 수치 표기 */}
            <div className="absolute bottom-6 px-4 py-2 bg-slate-900/60 border border-slate-800 backdrop-blur-sm text-slate-400 text-xs font-bold rounded-full select-none">
                <span className="text-white">{currentIndex + 1}</span> / {images.length}
            </div>
        </div>
    )
}