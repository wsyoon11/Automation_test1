import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResultReport, ReportStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { PrintableReportModal } from '../common/PrintableReportModal';
import {
  FileCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Printer,
  DollarSign,
  Star,
  Users,
} from 'lucide-react';

export const ResultApprovalManager: React.FC = () => {
  const { resultReports, reviewResultReport, addToast } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [reviewingReport, setReviewingReport] = useState<ResultReport | null>(null);
  const [decision, setDecision] = useState<'승인완료' | '보완요청'>('승인완료');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [printingReport, setPrintingReport] = useState<ResultReport | null>(null);

  const filtered = resultReports.filter((r) => {
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.programTitle.toLowerCase().includes(q) ||
        r.operatorName.toLowerCase().includes(q) ||
        r.keyOutcomes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenReview = (rep: ResultReport) => {
    setReviewingReport(rep);
    setDecision('승인완료');
    setReviewComment(
      rep.reviewerComment ||
        '실제 참여율과 학생 만족도가 매우 우수하며 예산 정산 영수증 및 증빙이 완비되어 최종 승인함.'
    );
  };

  const handleConfirmReview = () => {
    if (!reviewingReport) return;
    if (!reviewComment.trim()) {
      addToast('검토 의견을 입력해 주세요.', 'warning');
      return;
    }

    reviewResultReport(reviewingReport.id, decision, reviewComment.trim());
    setReviewingReport(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
            운영실적 보고서 심사 및 성과 확정
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            프로그램 종료 후 운영 담당자가 제출한 실적 및 학생 만족도, 예산 집행 내역을 심사하고 승인합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
          <FileCheck className="w-4 h-4 text-rose-600" />
          <span>
            검토 대기: {resultReports.filter((r) => r.status === '제출완료' || r.status === '검토중').length}건
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['ALL', '제출완료', '검토중', '보완요청', '승인완료'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedStatus === st
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? '전체 상태' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="프로그램명, 담당자 검색..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5]"
          />
        </div>
      </div>

      {/* Report Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-24 text-center">보고상태</th>
                <th className="py-3 px-6">프로그램명</th>
                <th className="py-3 px-4 w-28">담당자</th>
                <th className="py-3 px-4 w-28 text-center">참여 / 수료</th>
                <th className="py-3 px-4 w-24 text-center">만족도</th>
                <th className="py-3 px-4 w-28 text-right">집행액</th>
                <th className="py-3 px-4 w-32 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    조회된 실적보고서가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((rep, idx) => {
                  const isPending = rep.status === '제출완료' || rep.status === '검토중';

                  return (
                    <tr
                      key={rep.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isPending ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={rep.status} />
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        {rep.programTitle}
                        <div className="text-[11px] text-slate-400 font-normal font-mono mt-0.5">
                          제출일시: {rep.submittedAt}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{rep.operatorName}</td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        {rep.actualAttendees}명 /{' '}
                        <strong className="text-teal-700">{rep.completedCount}명</strong>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-900">
                        ⭐ {rep.satisfactionScore}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800">
                        {(rep.budgetSpent || 0).toLocaleString()}원
                      </td>
                      <td className="py-3.5 px-4 text-center space-x-1">
                        <button
                          onClick={() => handleOpenReview(rep)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                            isPending
                              ? 'bg-rose-600 hover:bg-rose-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isPending ? '심사진행' : '상세/재심사'}
                        </button>
                        <button
                          onClick={() => setPrintingReport(rep)}
                          className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-md transition"
                          title="공식 보고서 인쇄"
                        >
                          <Printer className="w-3.5 h-3.5 inline" />
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

      {/* Review Modal */}
      {reviewingReport && (
        <Modal
          isOpen={!!reviewingReport}
          onClose={() => setReviewingReport(null)}
          title={`운영실적 심사: ${reviewingReport.programTitle}`}
          subtitle={`제출자: ${reviewingReport.operatorName} | 제출일: ${reviewingReport.submittedAt}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block">수료율</span>
                <span className="text-lg font-bold font-mono text-teal-700">
                  {reviewingReport.actualAttendees > 0
                    ? Math.round(
                        (reviewingReport.completedCount / reviewingReport.actualAttendees) * 100
                      )
                    : 0}
                  % ({reviewingReport.completedCount}/{reviewingReport.actualAttendees}명)
                </span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-800 block">학생 만족도</span>
                <span className="text-lg font-bold font-mono text-amber-900">
                  ⭐ {reviewingReport.satisfactionScore} / 5.00
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block">실집행 예산</span>
                <span className="text-lg font-bold font-mono text-slate-800">
                  {(reviewingReport.budgetSpent || 0).toLocaleString()}원
                </span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-800 block">예산 집행률</span>
                <span className="text-lg font-bold font-mono text-blue-900">
                  {Math.round(
                    (reviewingReport.budgetSpent / reviewingReport.budgetAllocated) * 100
                  )}
                  %
                </span>
              </div>
            </div>

            {/* Qualitative Outcomes */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div>
                <strong className="text-[#183153] block mb-1">핵심 운영 성과:</strong>
                <p className="bg-white p-3 rounded border border-slate-200 text-slate-700 leading-relaxed">
                  {reviewingReport.keyOutcomes}
                </p>
              </div>
              <div>
                <strong className="text-[#183153] block mb-1">학생 의견 및 후기 요약:</strong>
                <p className="bg-white p-3 rounded border border-slate-200 text-slate-700 leading-relaxed">
                  {reviewingReport.studentFeedbackSummary}
                </p>
              </div>
            </div>

            {/* Decision Radio */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-[#183153] text-sm">실적 심사 판정</h4>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-bold text-xs transition ${
                    decision === '승인완료'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportDecision"
                    checked={decision === '승인완료'}
                    onChange={() => setDecision('승인완료')}
                    className="sr-only"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>승인완료 (실적 확정 및 성과 통계 반영)</span>
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
                    name="reportDecision"
                    checked={decision === '보완요청'}
                    onChange={() => setDecision('보완요청')}
                    className="sr-only"
                  />
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>보완요청 (정산 영수증 또는 실적 보완)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  검토의견 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="실적 승인 사유 또는 보완 요청 의견을 작성하세요."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewingReport(null)}
                className="px-4 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className="px-6 py-2 text-xs sm:text-sm font-semibold bg-[#183153] hover:bg-[#183153]/90 text-white rounded-lg transition shadow-xs"
              >
                심사 확정
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Official Print Modal */}
      {printingReport && (
        <PrintableReportModal
          isOpen={!!printingReport}
          onClose={() => setPrintingReport(null)}
          report={printingReport}
        />
      )}
    </div>
  );
};
