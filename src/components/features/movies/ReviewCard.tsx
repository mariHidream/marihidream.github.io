"use client";

import { useToastStore } from "@/src/store/useToastStore";
import { Check, Languages, Loader2, Star } from "lucide-react";
import { useState } from "react";


interface ReviewCardProps {
    reviews: {
        id : string;
        author : string;
        content : string;
        rating : number | null;
        createdAt : string;
    }
}


export default function ReviewCard ({review} : ReviewCardProps) {

    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showTranslated, setShowTranslated] = useState(false);
    const showToast = useToastStore((state) => state.showToast);


    const handleTranslate = async () => {
        // 이미 번역된 데이터가 있다면 상태만 스위칭하여 API 중복 호출 방지 (메모이제이션 역할)
        if (translatedText) {
            setShowTranslated(!showTranslated);
            return;
        }

        setIsTranslating(true);
        
        try {
            const response = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&q=${encodeURIComponent(review.content)}`
            );
            
            if (!response.ok) throw new Error('번역 실패');
            
            const data = await response.json();
            // 구글 번역 API 응답 구조 파싱 (문장 단위로 쪼개진 배열을 하나로 병합)
            const translated = data[0].map((item: any) => item[0]).join('');
            
            setTranslatedText(translated);
            setShowTranslated(true);
            showToast('AI 한국어 번역이 완료되었습니다.', 'success');

        } catch (error) {
            showToast('번역 서버와의 연결이 원활하지 않습니다.', 'error');
        } finally {
            setIsTranslating(false);
        }
    };


    return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 transition-all hover:border-slate-700">
      
      {/* 작성자 정보 및 평점 헤더 */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center text-teal-400 font-black text-lg border border-teal-500/10">
            {review.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-white block">{review.author}</span>
            <span className="text-xs text-slate-500">{review.createdAt}</span>
          </div>
        </div>
        
        {review.rating && (
          <span className="flex items-center gap-1.5 text-amber-400 font-black bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
            <Star className="w-4 h-4 fill-current" /> {review.rating.toFixed(1)}
          </span>
        )}
      </div>

      {/* 리뷰 본문 (원본 또는 번역본) */}
      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
        {showTranslated && translatedText ? translatedText : review.content}
      </p>

      {/* AI 번역 컨트롤 액션바 */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            showTranslated 
              ? 'bg-slate-800 text-teal-400 border border-slate-700' 
              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          {isTranslating ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> AI 번역 중...</>
          ) : showTranslated ? (
            <><Check className="w-3.5 h-3.5" /> 원문 보기</>
          ) : (
            <><Languages className="w-3.5 h-3.5" /> AI 한국어 번역</>
          )}
        </button>
      </div>
    </div>
  );

}