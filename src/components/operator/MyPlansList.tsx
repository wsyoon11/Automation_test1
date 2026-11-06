import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Program, PlanStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Eye,
} from 'lucide-react';

interface MyPlansListProps {
  onEditPlan: (program: Program) => void;
  onNewPlan: () => void;
}

export const MyPlansList: React.FC<MyPlansListProps> = ({ onEditPlan, onNewPlan }) => {
  const { programs, deleteProgram, setActiveTab } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Operator programs
  const myPrograms = programs.filter(
    (p) => p.operatorId === 'user-operator-01' || p.operatorName === '이서연'
  );

  const filtered = myPrograms.filter((p) => {
    if (selectedStatus !== 'ALL' && p.planStatus !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDelete = (prog: Program) => {
    if (window.confirm(`"${prog.title}" 계획서를 정말 삭제하시겠습니까?`)) {
      deleteProgram(prog.id);
    }
  };

  const statusOptions: { label: string; value: PlanStatus | 'ALL' }[] = [
    { label: '전체', value: 'ALL' },
    { label: '임시저장', value: '임시저장' },
    { label: '신청완료', value: '신청완료' },
    { label: '검토중', value: '검토중' },
    { label: '보완요청', value: '보완요청' },
    { label: '승인완료', value: '승인완료' },
    { label: '반려', value: '반려' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
            운영계획 신청 관리
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            신청한 운영계획서의 심사 현황을 조회하고 보완 요청에 따라 수정 및 재제출합니다.
          </p>
        </div>

        <button
          onClick={onNewPlan}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#356FA5] hover:bg-[#2e6293] text-white text-xs sm:text-sm font-semibold rounded-lg transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>신규 운영계획서 작성</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedStatus(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedStatus === opt.value
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="프로그램명 검색..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">조회된 운영계획서가 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((prog) => (
              <div key={prog.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={prog.planStatus} />
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {prog.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        작성일: {prog.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{prog.title}</h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>운영기간: <strong>{prog.operateStartDate} ~ {prog.operateEndDate}</strong></span>
                      <span>정원: <strong>{prog.capacity}명</strong></span>
                      <span>소요예산: <strong className="font-mono text-slate-700">{(prog.budget || 0).toLocaleString()}원</strong></span>
                      <span>마일리지: <strong className="text-teal-700">+{prog.mileage}P</strong></span>
                    </div>

                    {/* Admin Review Feedback Box if present */}
                    {prog.reviewComment && (
                      <div className={`mt-2 p-3 rounded-lg text-xs border ${
                        prog.planStatus === '보완요청'
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : prog.planStatus === '반려'
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        <span className="font-semibold block mb-0.5">
                          관리자 심사의견 ({prog.reviewedAt || '최근'}):
                        </span>
                        {prog.reviewComment}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {prog.planStatus === '보완요청' ? (
                      <button
                        onClick={() => onEditPlan(prog)}
                        className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition shadow-xs"
                      >
                        보완서 작성 및 재제출
                      </button>
                    ) : prog.planStatus === '임시저장' ? (
                      <>
                        <button
                          onClick={() => onEditPlan(prog)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>이어서 작성</span>
                        </button>
                        <button
                          onClick={() => handleDelete(prog)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>삭제</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onEditPlan(prog)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                      >
                        신청서 상세 열람
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
