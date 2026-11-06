import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Program, PlanStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  ClipboardCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Calendar,
  Building,
  DollarSign,
  User,
  BookOpen,
} from 'lucide-react';

export const PlanApprovalManager: React.FC = () => {
  const { programs, reviewProgramPlan, addToast } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [reviewingProgram, setReviewingProgram] = useState<Program | null>(null);
  const [decision, setDecision] = useState<'승인완료' | '보완요청' | '반려'>('승인완료');
  const [reviewerComment, setReviewerComment] = useState<string>('');

  const statuses: { label: string; value: PlanStatus | 'ALL' }[] = [
    { label: '전체', value: 'ALL' },
    { label: '심사대기 (신청/검토)', value: 'PENDING' as any },
    { label: '승인완료', value: '승인완료' },
    { label: '보완요청', value: '보완요청' },
    { label: '반려', value: '반려' },
    { label: '임시저장', value: '임시저장' },
  ];

  const filteredPrograms = programs.filter((p) => {
    if (selectedStatus === 'PENDING') {
      if (p.planStatus !== '신청완료' && p.planStatus !== '검토중') return false;
    } else if (selectedStatus !== 'ALL') {
      if (p.planStatus !== selectedStatus) return false;
    }

    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.operatorName.toLowerCase().includes(q) ||
        p.operatorDepartment.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenReview = (prog: Program) => {
    setReviewingProgram(prog);
    setDecision('승인완료');
    setReviewerComment(
      prog.reviewComment ||
        '산업체 수요와 학생 전공 역량 강화를 위해 적합하며 소요 예산 편성이 타당하여 승인함.'
    );
  };

  const handleConfirmReview = () => {
    if (!reviewingProgram) return;

    if (!reviewerComment.trim()) {
      addToast('심사 의견을 반드시 입력해 주세요.', 'warning');
      return;
    }

    reviewProgramPlan(reviewingProgram.id, decision, reviewerComment.trim());
    setReviewingProgram(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
            비교과 운영계획서 심사 및 승인 관리
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            각 학과 및 부서에서 제출한 신규 비교과 프로그램 운영계획서를 검토하여 승인, 보완 요청 또는 반려 처리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
          <ClipboardCheck className="w-4 h-4 text-amber-600" />
          <span>심사 대기: {programs.filter((p) => p.planStatus === '신청완료' || p.planStatus === '검토중').length}건</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {statuses.map((st) => (
            <button
              key={st.value}
              onClick={() => setSelectedStatus(st.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedStatus === st.value
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="프로그램명, 담당자명, 학과 검색..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Application Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-24 text-center">심사상태</th>
                <th className="py-3 px-4 w-28">분야</th>
                <th className="py-3 px-6">프로그램명</th>
                <th className="py-3 px-4 w-32">담당자 / 소속</th>
                <th className="py-3 px-4 w-28 text-right">소요예산</th>
                <th className="py-3 px-4 w-24 text-center">신청일</th>
                <th className="py-3 px-4 w-28 text-center">심사액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    조건에 해당하는 운영계획서가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((prog, idx) => {
                  const isPending =
                    prog.planStatus === '신청완료' || prog.planStatus === '검토중';

                  return (
                    <tr
                      key={prog.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isPending ? 'bg-amber-50/30 font-medium' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={prog.planStatus} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{prog.category}</td>
                      <td className="py-3.5 px-6">
                        <div className="font-bold text-slate-900 line-clamp-1">
                          {prog.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {prog.summary}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div>{prog.operatorName}</div>
                        <div className="text-[11px] text-slate-400">
                          {prog.operatorDepartment}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800">
                        {(prog.budget || 0).toLocaleString()}원
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500 text-[11px]">
                        {prog.createdAt}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleOpenReview(prog)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isPending
                              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isPending ? '심사진행' : '상세/재심사'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Approval Modal */}
      {reviewingProgram && (
        <Modal
          isOpen={!!reviewingProgram}
          onClose={() => setReviewingProgram(null)}
          title={`운영계획서 심사: ${reviewingProgram.title}`}
          subtitle={`신청자: ${reviewingProgram.operatorName} (${reviewingProgram.operatorDepartment}) | 신청일자: ${reviewingProgram.createdAt}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Program Details Summary */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400">프로그램 분야:</span>{' '}
                  <strong className="text-slate-800">{reviewingProgram.category}</strong>
                </div>
                <div>
                  <span className="text-slate-400">모집 정원 / 마일리지:</span>{' '}
                  <strong className="text-slate-800">
                    {reviewingProgram.capacity}명 / {reviewingProgram.mileage}P
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">운영 기간:</span>{' '}
                  <strong className="text-slate-800">
                    {reviewingProgram.operateStartDate} ~ {reviewingProgram.operateEndDate}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">소요 예산:</span>{' '}
                  <strong className="text-slate-800 font-mono">
                    {(reviewingProgram.budget || 0).toLocaleString()} 원
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">운영 장소 / 방법:</span>{' '}
                  <strong className="text-slate-800">
                    {reviewingProgram.location} ({reviewingProgram.method})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">초빙 강사:</span>{' '}
                  <strong className="text-slate-800">
                    {reviewingProgram.instructor.name} ({reviewingProgram.instructor.organization})
                  </strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <span className="text-slate-400 block">운영 목적 및 세부 내용:</span>
                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200">
                  {reviewingProgram.description}
                </p>
              </div>

              {/* Syllabus list preview */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block mb-1">회차별 교육 계획:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {reviewingProgram.syllabus.map((s) => (
                    <div
                      key={s.session}
                      className="p-2 bg-white rounded border border-slate-200 text-[11px]"
                    >
                      <strong className="text-[#183153]">{s.session}회차:</strong> {s.title}
                      <span className="text-slate-400 block">
                        {s.date} ({s.hours}시간) - {s.content}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decision Controls */}
            <div className="space-y-4 pt-2">
              <h4 className="font-bold text-[#183153] text-sm">심사 결과 판정</h4>

              <div className="grid grid-cols-3 gap-3">
                <label
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-bold text-xs transition ${
                    decision === '승인완료'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === '승인완료'}
                    onChange={() => setDecision('승인완료')}
                    className="sr-only"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>승인완료 (정규 개설)</span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-bold text-xs transition ${
                    decision === '보완요청'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === '보완요청'}
                    onChange={() => setDecision('보완요청')}
                    className="sr-only"
                  />
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>보완요청 (수정 지시)</span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-bold text-xs transition ${
                    decision === '반려'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === '반려'}
                    onChange={() => setDecision('반려')}
                    className="sr-only"
                  />
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>반려 (개설 불가)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  심사 검토 의견 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="승인 사유, 예산 조정 권고사항, 또는 보완할 구체적 항목을 입력해 주세요."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewingProgram(null)}
                className="px-4 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className="px-6 py-2 text-xs sm:text-sm font-semibold bg-[#183153] hover:bg-[#183153]/90 text-white rounded-lg transition shadow-xs"
              >
                심사 결과 확정 및 등록
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
