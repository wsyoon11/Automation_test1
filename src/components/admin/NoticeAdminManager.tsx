import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Notice } from '../../types';
import { Modal } from '../common/Modal';
import {
  MessageSquare,
  Plus,
  Trash2,
  Pin,
  Search,
  Bell,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const NoticeAdminManager: React.FC = () => {
  const { notices, addNotice, deleteNotice, addToast } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'공지' | '모집' | '행사' | '성과'>('공지');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotices = notices.filter((n) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.author.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      addToast('공지 제목과 본문을 입력해 주세요.', 'warning');
      return;
    }

    addNotice({
      title: title.trim(),
      content: content.trim(),
      category,
      isPinned,
      author: '박종호 (총괄관리자)',
      department: 'AI/SW 융합혁신사업단',
    });

    setTitle('');
    setContent('');
    setIsPinned(false);
    setIsCreateModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`"${title}" 공지사항을 삭제하시겠습니까?`)) {
      deleteNotice(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
            공지사항 및 게시판 운영관리
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            사업단의 공식 모집 공고, 선발 결과, 성과 발표 및 FAQ를 등록·수정합니다.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#183153] hover:bg-[#183153]/90 text-white text-xs sm:text-sm font-semibold rounded-lg transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>신규 공지사항 등록</span>
        </button>
      </div>

      {/* Notice Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="공지 제목 검색..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-mono">
            총 {filteredNotices.length}개 등록
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-20 text-center">구분</th>
                <th className="py-3 px-6">공지 제목</th>
                <th className="py-3 px-4 w-28 text-center">작성자</th>
                <th className="py-3 px-4 w-24 text-center">등록일</th>
                <th className="py-3 px-4 w-20 text-center">상단고정</th>
                <th className="py-3 px-4 w-20 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotices.map((n, idx) => (
                <tr key={n.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {n.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    {n.isPinned && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded mr-1.5">
                        필독
                      </span>
                    )}
                    {n.title}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-600">{n.author}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                    {n.createdAt}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {n.isPinned ? (
                      <span className="text-rose-600 font-bold">고정중</span>
                    ) : (
                      <span className="text-slate-400">일반</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDelete(n.id, n.title)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="공지 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="신규 공지사항 작성"
          subtitle="사업단 공식 포털 및 학생 대시보드에 노출됩니다."
          maxWidth="2xl"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  공지 제목 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: [안내] 2026-2학기 비교과 마일리지 장학금 지급 일정"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  카테고리 구분
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="공지">일반공지</option>
                  <option value="모집">선발/모집</option>
                  <option value="행사">행사/워크숍</option>
                  <option value="성과">성과공유</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                공지 본문 내용 <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="상세 공지 내용을 작성해 주세요."
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5]"
                required
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-slate-300 text-[#183153]"
                />
                <span>게시판 최상단에 고정 (필독 배지 부여)</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-[#183153] text-white rounded-lg hover:bg-[#183153]/90 shadow-xs"
              >
                공지사항 등록
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
