"use client";

import Modal from "@/src/components/ui/Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/Tabs";
import { CheckCircle2, HelpCircle, Megaphone, MessageSquare, Lock, ChevronDown, Send } from "lucide-react";
import { useState } from "react"

const NOTICES = [
  { id: 1, title: '[안내] 시스템 점검에 따른 예매 서비스 일시 중단 안내', date: '2026. 06. 28' },
  { id: 2, title: '[공지] 2026년 VIP 멤버십 선정 기준 및 혜택 변경 안내', date: '2026. 05. 15' },
  { id: 3, title: '[이벤트] 여름 방학 맞이 청소년 심야 영화 할인 프로모션', date: '2026. 05. 01' },
];

const FAQS = [
  { id: 1, category: '예매/결제', question: '예매 취소는 언제까지 가능한가요?', answer: '영화 상영 시간 20분 전까지 홈페이지 및 모바일 앱을 통해 취소하실 수 있습니다. 단, 부분 취소는 불가하며 전체 취소 후 재예매 하셔야 합니다.' },
  { id: 2, category: '멤버십', question: '포인트 적립은 결제 금액의 몇 %인가요?', answer: '일반 등급은 결제 금액의 5%, VIP 등급은 10%, VVIP 등급은 15%가 포인트로 적립됩니다. 포인트는 관람일 다음 날 일괄 적립됩니다.' },
  { id: 3, category: '영화관이용', question: '외부 음식물 반입이 가능한가요?', answer: '강한 냄새로 인해 다른 관람객에게 불편을 줄 수 있는 음식(햄버거, 피자 등)을 제외한 스낵 및 음료는 반입이 가능합니다.' },
];

export default function SupportPage() {
    // UI 상태 관리
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // 폼 상태 관리
    const [inquiryType, setInquiryType] = useState('예매/결제');
    const [inquiryContent, setInquiryContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 임시 유저 인증 상태
    const isLoggedIn = true; // 실제 구현 시에는 인증 상태를 확인하는 로직 필요
    const user = {email: 'test@test.com'}

    const toggleFaq = (id: number) => {
        setOpenFaqId(openFaqId === id ? null : id);
    }

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!inquiryContent.trim()) {
            alert('문의 내용을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/support/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user?.email, type: inquiryType, content: inquiryContent }),
            });

            if (response.ok) {
                setInquiryType('예매/결제 문의');
                setInquiryContent('');
                setShowSuccessModal(true); // 💡 모달 오픈 트리거
            } else {
                alert("접수 중 문제가 발생했습니다.");
            }

        }catch (error) {

            console.error("Submit Error:", error);
            alert("서버와 통신할 수 없습니다.");

        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-12 space-y-8 relative">
      
            {/* 헤더 영역 */}
            <div className="space-y-2 border-b border-slate-800 pb-8 text-center md:text-left">
                <h1 className="text-3xl font-black text-white tracking-tight">고객센터</h1>
                <p className="text-slate-400 font-medium">무엇을 도와드릴까요? 궁금하신 점을 빠르게 해결해 드립니다.</p>
            </div>

            {/* 💡 Radix UI 기반 공통 Tabs 컴포넌트 적용 */}
            <Tabs defaultValue="FAQ" className="w-full min-h-[500px]">
                <TabsList>
                    <TabsTrigger value="FAQ"><HelpCircle className="w-4 h-4 mr-2" />자주 묻는 질문</TabsTrigger>
                    <TabsTrigger value="NOTICE"><Megaphone className="w-4 h-4 mr-2" />공지사항</TabsTrigger>
                    <TabsTrigger value="INQUIRY"><MessageSquare className="w-4 h-4 mr-2" />1:1 문의</TabsTrigger>
                </TabsList>

                {/* 1. FAQ 콘텐츠 */}
                <TabsContent value="FAQ" className="space-y-4">
                    {FAQS.map((faq) => (
                        <div key={faq.id} className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden">
                            <button
                                onClick={() => toggleFaq(faq.id)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/40 transition-colors focus:outline-none"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-teal-500 font-black">Q.</span>
                                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                        {faq.category}
                                    </span>
                                    <span className="text-white font-bold">{faq.question}</span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaqId === faq.id ? 'rotate-180' : ''}`} />
                            </button>
                        
                            {openFaqId === faq.id && (
                                <div className="p-5 text-slate-300 font-medium leading-relaxed bg-slate-900/60 border-t border-slate-800 flex gap-3">
                                    <span className="text-slate-500 font-black">A.</span>
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </TabsContent>

                {/* 2. 공지사항 콘텐츠 */}
                <TabsContent value="NOTICE">
                    <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden divide-y divide-slate-800">
                        {NOTICES.map((notice) => (
                            <div key={notice.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                <span className="text-white font-bold group-hover:text-teal-400 transition-colors">
                                    {notice.title}
                                </span>
                                <span className="text-sm text-slate-500 mt-2 md:mt-0 font-medium">
                                    {notice.date}
                                </span>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* 3. 1:1 문의 콘텐츠 */}
                <TabsContent value="INQUIRY">
                    <div className="border border-slate-800 rounded-xl bg-slate-900/40 p-6 md:p-8">
                        {!isLoggedIn ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                                    <Lock className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-black text-white">로그인이 필요합니다</h3>
                                <p className="text-slate-400 font-medium">1:1 문의를 남기시려면 먼저 로그인을 진행해 주세요.</p>
                                <button className="mt-4 px-6 py-3 bg-teal-500 text-slate-950 font-black rounded-xl hover:bg-teal-400 transition-colors">
                                    로그인 하러 가기
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleInquirySubmit}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">문의 유형</label>
                                    <select 
                                        value={inquiryType}
                                        onChange={(e) => setInquiryType(e.target.value)}
                                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none font-medium cursor-pointer"
                                    >
                                        <option value="예매/결제 문의">예매/결제 문의</option>
                                        <option value="영화관 시설 문의">영화관 시설 문의</option>
                                        <option value="포인트/멤버십 문의">포인트/멤버십 문의</option>
                                        <option value="기타 불편사항">기타 불편사항</option>
                                    </select>
                                </div>
                                    
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">문의 내용</label>
                                    <textarea 
                                        rows={6}
                                        value={inquiryContent}
                                        onChange={(e) => setInquiryContent(e.target.value)}
                                        className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none font-medium resize-none placeholder-slate-600"
                                        placeholder="문의하실 내용을 상세히 적어주시면 더욱 빠르고 정확한 답변이 가능합니다."
                                    />
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-teal-500 text-slate-950 font-black rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                        {isSubmitting ? '접수 중...' : '문의 접수하기'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </TabsContent>
            </Tabs>


            {/* 💡 사용자의 공통 Modal 컴포넌트 적용 */}
            <Modal 
                isOpen={showSuccessModal} 
                onClose={() => setShowSuccessModal(false)}
                title="문의 접수 완료"
            >
                <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-teal-400" />
                </div>
                <p className="text-slate-300 font-medium leading-relaxed mb-8">
                    고객님의 소중한 의견이 정상적으로 접수되었습니다.<br/>
                    담당자 확인 후 가입하신 이메일로 답변드리겠습니다.
                </p>
                <button 
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full max-w-xs mx-auto py-3 bg-teal-500 text-slate-950 font-black rounded-xl hover:bg-teal-400 transition-colors"
                >
                    확인
                </button>
                </div>
            </Modal>

        </div>
    )
}