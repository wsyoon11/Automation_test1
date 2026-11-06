import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Notice, FAQ } from '../../types';
import { Modal } from '../common/Modal';
import {
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Eye,
  Calendar,
  User,
} from 'lucide-react';

export const NoticeFaqView: React.FC = () => {
  const { notices, faqs } = useApp();

  const [activeTab, setActiveTab] = useState<'notices' | 'faqs'>('notices');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(faqs[0]?.id || null);
  const [faqCategory, setFaqCategory] = useState<string>('ALL');

  const faqCategories = ['ALL', '신청 및 선발', '출석 및 수료', '마일리지 및 혜택', '운영 및 행정'];

  const filteredFaqs = faqs.filter(
    (f) => faqCategory === 'ALL' || f.category === faqCategory
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Tab switcher */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">공지사항 & 자주 묻는 질문</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            사업단의 최신 공지사항과 프로그램 이용에 관한 FAQ 및 문의처를 확인하세요.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-lg border border-[#E3E8EF] shrink-0">
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition ${
              activeTab === 'notices'
                ? 'bg-[#183153] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>사업단 공지사항</span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition ${
              activeTab === 'faqs'
                ? 'bg-[#183153] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>자주 묻는 질문 (FAQ)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'notices' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">번호</th>
                  <th className="py-3 px-4 w-24 text-center">구분</th>
                  <th className="py-3 px-6">제목</th>
                  <th className="py-3 px-4 w-28 text-center">작성자</th>
                  <th className="py-3 px-4 w-28 text-center">작성일</th>
                  <th className="py-3 px-4 w-20 text-center">조회수</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notices.map((notice, idx) => (
                  <tr
                    key={notice.id}
                    onClick={() => setSelectedNotice(notice)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                      {notice.isPinned ? (
                        <span className="font-bold text-rose-600">공지</span>
                      ) : (
                        notices.length - idx
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {notice.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        {notice.isPinned && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded shrink-0">
                            필독
                          </span>
                        )}
                        <span className="font-semibold text-slate-900 hover:text-[#183153] line-clamp-1">
                          {notice.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{notice.author}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                      {notice.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                      {notice.viewCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* FAQ Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFaqCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                  faqCategory === cat
                    ? 'bg-[#183153] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat === 'ALL' ? '전체 카테고리' : cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = expandedFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition"
                >
                  <button
                    onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                        Q
                      </span>
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                          [{faq.category}]
                        </span>
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    <div className="text-slate-400 shrink-0 ml-4">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-[#F8FAFC] text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <div className="flex items-start gap-3 pt-2">
                        <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center shrink-0 text-xs">
                          A
                        </span>
                        <div className="flex-1 whitespace-pre-line">{faq.answer}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contact & Inquiry Box */}
      <div className="bg-[#F8FAFC] border border-[#E3E8EF] rounded-xl p-6">
        <h3 className="text-sm font-bold text-[#183153] mb-3">사업단 비교과 운영팀 문의안내</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>전화: 02-1234-5678 (평일 09:00 ~ 18:00)</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>이메일: aisw_support@univ.ac.kr</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>위치: IT융합관 301호 사업단 총괄운영실</span>
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <Modal
          isOpen={!!selectedNotice}
          onClose={() => setSelectedNotice(null)}
          title={selectedNotice.title}
          subtitle={`[${selectedNotice.category}] 작성자: ${selectedNotice.author} | 일자: ${selectedNotice.createdAt} | 조회수: ${selectedNotice.viewCount}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            <div className="p-5 bg-white border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line min-h-[160px]">
              {selectedNotice.content}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-5 py-2 text-xs sm:text-sm font-semibold bg-[#183153] text-white rounded-lg hover:bg-[#183153]/90 transition"
              >
                목록으로
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
