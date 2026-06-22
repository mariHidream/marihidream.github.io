"use client";


interface AgeRatingBadgeProps {
  rating: 'ALL' | '12' | '15' | '19';
  showText?: boolean; // 텍스트 전체 표출 여부 (예: "15" vs "15세 관람가")
}


export default function AgeRatingBadge({ rating, showText = false }: AgeRatingBadgeProps) {
  const config = {
    ALL: { bg: 'bg-green-600', text: '전체', fullText: '전체 관람가' },
    12: { bg: 'bg-amber-500', text: '12', fullText: '12세 이상 관람가' },
    15: { bg: 'bg-orange-500', text: '15', fullText: '15세 이상 관람가' },
    19: { bg: 'bg-red-600', text: '19', fullText: '청소년 관람불가' },
  };

  const current = config[rating] || config['ALL'];

  if (showText) {
    return (
      <div className="flex items-center gap-2">
        <span className={`w-5 h-5 ${current.bg} text-slate-950 font-black text-[11px] rounded flex items-center justify-center select-none`}>
          {current.text}
        </span>
        <span className="text-sm font-bold text-slate-300">{current.fullText}</span>
      </div>
    );
  }

  return (
    <span className={`w-5 h-5 ${current.bg} text-slate-950 font-black text-[11px] rounded flex items-center justify-center select-none shadow-sm shrink-0`}>
      {current.text}
    </span>
  );
}