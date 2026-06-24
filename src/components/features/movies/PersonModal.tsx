"use client";


import Modal from '@components/ui/Modal'; // 💡 공용 모달 껍데기 임포트
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';


interface PersonModalProps {
  personId: number | null;
  onClose: () => void;
}


export default function PersonModal ({personId , onClose} : PersonModalProps){

    const [personData , setPersonData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!personId) {
            setPersonData(null);
        return;
        }
        const fetchPerson = async () => {
            setIsLoading(true);
            try {
                // 💡 외부 API가 아닌 우리가 만든 안전한 내부 API 라우트를 호출합니다.
                const response = await fetch(`/api/person/${personId}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({})); // json 파싱 실패 대비
                    throw new Error(`[${response.status}] 서버 응답 에러: ${errorData.error || '알 수 없는 오류'}`);
                }
                const data = await response.json();
                setPersonData(data);
            } catch (error : any) {
                console.error("인물 상세 모달 에러:", error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPerson();
    }, [personId]);

    return (
        <Modal 
            isOpen={!!personId}
            onClose={onClose}
            title="인물 상세 정보"      
        >
            {isLoading || !personData ? (
                <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                    <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-4" />
                    <p className="text-slate-400 font-bold">인물 데이터를 분석하고 있습니다...</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* 1. 프로필 영역 (다크 테마 톤앤매너) */}
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-slate-950/50 p-8 rounded-2xl border border-slate-800">
                        <div className="w-40 h-40 shrink-0 rounded-full overflow-hidden border-4 border-slate-800 shadow-xl bg-slate-900">
                            {personData.profilePath ? (
                                <img src={personData.profilePath} alt={personData.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-black text-4xl">
                                    {personData.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-black text-white">{personData.name}</h2>
                            <p className="text-lg text-slate-400 font-medium">{personData.originalName}</p>
                            <div className="pt-4 flex flex-col gap-1.5 text-sm font-bold text-slate-500">
                                {personData.birthday && <span>출생: {personData.birthday.replace(/-/g, '.')}</span>}
                                {personData.placeOfBirth && <span>국적/출신: {personData.placeOfBirth.split(',').pop()}</span>}
                            </div>
                        </div>
                    </div>

                    {/* 2. 필모그래피 영역 */}
                    <section>
                        <h3 className="text-xl font-black text-white mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full" /> 주요 필모그래피
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                            {personData.filmography.map((movie: any) => (
                                <div key={movie.id} className="flex flex-col gap-2 group cursor-pointer">
                                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-sm">
                                        <img 
                                            src={movie.posterPath} 
                                            alt={movie.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    </div>
                                    <p className="text-xs font-bold text-slate-300 truncate text-center group-hover:text-teal-400 transition-colors">
                                        {movie.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. 포토 갤러리 영역 */}
                    {personData.photos.length > 0 && (
                        <section>
                            <h3 className="text-xl font-black text-white mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-teal-500 rounded-full" /> 포토 갤러리
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {personData.photos.map((url: string, idx: number) => (
                                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-950 shadow-sm border border-slate-800 group">
                                        <img 
                                            src={url} 
                                            alt={`갤러리 ${idx + 1}`} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            loading="lazy" 
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            )}
        </Modal>
    )
}

