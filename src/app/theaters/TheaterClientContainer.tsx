"use client";

import { useMemo, useState } from "react";
import { TheaterItem } from "./page"
import { Film, Globe, MapPin, MonitorPlay, Phone, Search, Sparkles, Users } from "lucide-react";

interface Props {
    initialTheaters : TheaterItem[]
}

export default function TheaterClientContainer({ initialTheaters }: Props) {
    const [selectedRegion, setSelectedRegion] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand,  setSelectedBrand] = useState('전체'); 
    const [onlyImax, setOnlyImax] = useState(false);
    const [only4D, setOnly4D] = useState(false); 

    const BRANDS = ['전체', 'CGV', '메가박스', '롯데시네마', '기타'];

    // '광역단체' 목록을 추출하여 지역 필터 생성
    const regions = useMemo(()=>{
        const extracted = initialTheaters.map(t=>t.광역단체);
        const uniqueRegions = Array.from(new Set(extracted)).filter(Boolean);
        return ['전체', ...uniqueRegions];
    },[initialTheaters]);

    const filteredTheaters = useMemo(()=>{
        return initialTheaters.filter((theater)=>{
            if(theater. 영업상태 !== '영업') return false;

            const matchRegion = selectedRegion === '전체' || theater.광역단체 === selectedRegion;
            const matchQuery = 
                theater.영화상영관명.includes(searchQuery) || theater.주소.includes(searchQuery);

            let matchBrand = true;
            if (selectedBrand !== '전체') {
                if (selectedBrand === '기타') {
                    matchBrand = !theater.영화상영관명.includes('CGV') && 
                                !theater.영화상영관명.includes('메가박스') && 
                                !theater.영화상영관명.includes('롯데시네마');
                } else {
                    matchBrand = theater.영화상영관명.includes(selectedBrand);
                }
            }

            const matchImax = onlyImax ? theater["IMAX 상영관수"] > 0 : true;
            const match4D = only4D ? theater["4D 상영관수"] > 0 : true;

            return matchRegion && matchQuery && matchBrand && matchImax && match4D;

        });
    },[selectedRegion, searchQuery,selectedBrand, onlyImax, only4D, initialTheaters]);



    return (
        <div className="space-y-6">
            {/* 검색 및 필터 패널 */}
            <div className="space-y-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                
                {/* 상단: 검색 및 특별관 토글 */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-bold"
                        placeholder="극장명 또는 주소 검색"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setOnlyImax(!onlyImax)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition-all border ${
                            onlyImax ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                        }`}
                    >
                        <Film className="w-4 h-4" /> IMAX 보유
                    </button>
                    <button
                        onClick={() => setOnly4D(!only4D)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition-all border ${
                            only4D ? 'bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                        }`}
                    >
                        <Sparkles className="w-4 h-4" /> 4D 보유
                    </button>
                </div>
                </div>

                {/* 중단: 브랜드 필터 */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/50">
                <span className="text-sm font-bold text-slate-500 py-2 mr-2">브랜드</span>
                    {BRANDS.map((brand) => (
                        <button
                            key={brand}
                            onClick={() => setSelectedBrand(brand)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                selectedBrand === brand ? 'bg-slate-200 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>

                {/* 하단: 지역 필터 */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-bold text-slate-500 py-2 mr-2">지 역</span>
                    {regions.map((region) => (
                        <button
                            key={region}
                            onClick={() => setSelectedRegion(region)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                selectedRegion === region ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                        >
                            {region}
                        </button>
                    ))}
                </div>
            </div>

            {/* 한글 속성 기반 렌더링 카드 그리드 */}

            {filteredTheaters.length === 0 ? (
                <div className="py-20 text-center text-slate-500 font-bold border-2 border-dashed border-slate-800 rounded-2xl">
                조건에 맞는 극장이 없습니다. 필터를 변경해 보세요.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTheaters.map((theater, index) => {
                        return (
                            <div
                                key={theater.영화상영관코드 || index}
                                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-slate-600 transition-colors"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 text-[10px] font-black text-teal-400 border border-teal-400/20 bg-teal-400/10 rounded">
                                                {theater.광역단체}
                                            </span>
                                            {theater["IMAX 상영관수"] > 0 && (
                                                <span className="px-2 py-1 text-[10px] font-black bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                                                    IMAX
                                                </span>
                                            )}
                                            {theater["4D 상영관수"] > 0 && (
                                                <span className="px-2 py-1 text-[10px] font-black bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                                                    4DX
                                                </span>
                                            )}
                                            {theater["총 스크린수"] >= 10 && (
                                                <span className="px-2 py-1 text-[10px] font-black bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">
                                                    초대형
                                                </span>
                                            )}

                                        </div>
                                        <h3 className="text-xl font-black text-white tracking-tight">
                                            {theater.영화상영관명}
                                        </h3>
                                        <span className="text-[10px] font-medium text-slate-500">
                                            {theater.기초단체} · {theater.운영형태}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-slate-400 font-medium">
                                        <div className="flex items-start gap-2.5">
                                            <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                            <span className="leading-snug">{theater.주소}</span>
                                        </div>
                                        {theater.전화번호 && (
                                            <div className="flex items-center gap-2.5">
                                                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                                                <span>{theater.전화번호}</span>
                                            </div>
                                        )}
                                        {theater.홈페이지 && theater.홈페이지.trim() !== "" && (
                                            <div className="flex items-center gap-2.5 mt-2">
                                                <Globe className="w-4 h-4 text-teal-500 shrink-0" />
                                                <a 
                                                    href={theater.홈페이지.startsWith('http') ? theater.홈페이지 : `https://${theater.홈페이지}`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-teal-400 hover:text-teal-300 hover:underline underline-offset-4 transition-all"
                                                >
                                                    공식 홈페이지 이동
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 💡 대괄호 표기법법을 활용한 공백 포함 Key 안전 바인딩 */}
                                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
                                    <div className="flex items-center gap-1.5">
                                        <MonitorPlay className="w-4 h-4 text-teal-500" />
                                        <span>총 {theater["총 스크린수"]}관</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-teal-500" />
                                        <span>{theater["총 좌석수"]?.toLocaleString()}석</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}