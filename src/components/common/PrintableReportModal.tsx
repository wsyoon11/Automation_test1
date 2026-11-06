import React from 'react';
import { Modal } from './Modal';
import { ResultReport } from '../../types';
import { Printer, Download, Award, FileText } from 'lucide-react';

interface PrintableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ResultReport | null;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="비교과 프로그램 운영실적보고서 인쇄 및 출력"
      subtitle={`문서번호: AISW-REPORT-2026-${report.id.slice(-4)}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Printable Document Container */}
        <div className="printable-area border border-slate-300 p-8 sm:p-12 bg-white text-slate-900 shadow-xs space-y-6">
          {/* Header Title Lockup */}
          <div className="border-b-2 border-[#183153] pb-4 text-center space-y-1">
            <span className="text-xs font-serif tracking-widest text-slate-500 block">
              AI/SW 융합혁신사업단 공식 결과보고서
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183153] tracking-tight">
              비교과 프로그램 운영실적 및 성과결과서
            </h2>
            <div className="text-xs text-slate-400 font-mono pt-1">
              제출일자: {report.submittedAt || '2026-11-04'} | 승인일자: {report.reviewedAt || '심사진행중'}
            </div>
          </div>

          {/* Section 1: 기본 개요 표 */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#183153] text-xs uppercase tracking-wider">
              1. 프로그램 개요
            </h4>
            <table className="w-full text-xs border-collapse border border-slate-300">
              <tbody>
                <tr>
                  <th className="w-28 p-2.5 bg-slate-100 border border-slate-300 text-left font-semibold">
                    프로그램명
                  </th>
                  <td colSpan={3} className="p-2.5 border border-slate-300 font-bold text-[#183153]">
                    {report.programTitle}
                  </td>
                </tr>
                <tr>
                  <th className="p-2.5 bg-slate-100 border border-slate-300 text-left font-semibold">
                    운영 담당자
                  </th>
                  <td className="p-2.5 border border-slate-300">
                    {report.operatorName} (SW융합교육센터)
                  </td>
                  <th className="w-28 p-2.5 bg-slate-100 border border-slate-300 text-left font-semibold">
                    운영 방식
                  </th>
                  <td className="p-2.5 border border-slate-300">{report.actualMethod}</td>
                </tr>
                <tr>
                  <th className="p-2.5 bg-slate-100 border border-slate-300 text-left font-semibold">
                    실제 운영기간
                  </th>
                  <td className="p-2.5 border border-slate-300 font-mono">
                    {report.actualStartDate} ~ {report.actualEndDate}
                  </td>
                  <th className="p-2.5 bg-slate-100 border border-slate-300 text-left font-semibold">
                    실제 운영장소
                  </th>
                  <td className="p-2.5 border border-slate-300">{report.actualLocation}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: 학생 참여 및 수료 실적 */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#183153] text-xs uppercase tracking-wider">
              2. 참여 및 수료 실적
            </h4>
            <table className="w-full text-xs border-collapse border border-slate-300 text-center font-mono">
              <thead className="bg-slate-100 font-semibold text-slate-800">
                <tr>
                  <th className="p-2.5 border border-slate-300">모집 인원</th>
                  <th className="p-2.5 border border-slate-300">실제 참여</th>
                  <th className="p-2.5 border border-slate-300">이수 완료</th>
                  <th className="p-2.5 border border-slate-300">중도 탈락</th>
                  <th className="p-2.5 border border-slate-300">최종 수료율</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2.5 border border-slate-300">{report.recruitedCount}명</td>
                  <td className="p-2.5 border border-slate-300">{report.actualAttendees}명</td>
                  <td className="p-2.5 border border-slate-300 font-bold text-teal-700">
                    {report.completedCount}명
                  </td>
                  <td className="p-2.5 border border-slate-300 text-rose-600">
                    {report.dropoutsCount}명
                  </td>
                  <td className="p-2.5 border border-slate-300 font-bold text-[#183153]">
                    {report.actualAttendees > 0
                      ? Math.round((report.completedCount / report.actualAttendees) * 100)
                      : 0}
                    %
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: 학생 만족도 평점 */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#183153] text-xs uppercase tracking-wider">
              3. 학생 만족도 평가 결과 (5점 척도)
            </h4>
            <table className="w-full text-xs border-collapse border border-slate-300 text-center font-mono">
              <thead className="bg-slate-100 font-semibold text-slate-800">
                <tr>
                  <th className="p-2 border border-slate-300">교육과정</th>
                  <th className="p-2 border border-slate-300">강사 전문성</th>
                  <th className="p-2 border border-slate-300">실습 시설</th>
                  <th className="p-2 border border-slate-300">실무 활용도</th>
                  <th className="p-2 border border-slate-300 bg-amber-50 text-amber-900">
                    종합 평점
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-300">
                    {report.satisfactionBreakdown?.curriculum || 4.9}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {report.satisfactionBreakdown?.instructor || 4.95}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {report.satisfactionBreakdown?.facilities || 4.8}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {report.satisfactionBreakdown?.applicability || 4.88}
                  </td>
                  <td className="p-2 border border-slate-300 font-bold text-amber-900 bg-amber-50">
                    {report.satisfactionScore} / 5.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: 주요 성과 및 정성적 내용 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[#183153] uppercase tracking-wider">
              4. 주요 운영 성과 및 정성 분석
            </h4>
            <div className="p-3 bg-slate-50 border border-slate-300 rounded space-y-2 leading-relaxed">
              <div>
                <strong className="text-slate-800 block mb-0.5">· 주요 성과 및 산출물:</strong>
                <p className="text-slate-600">{report.keyOutcomes}</p>
              </div>
              <div>
                <strong className="text-slate-800 block mb-0.5">· 학생 의견 요약:</strong>
                <p className="text-slate-600">{report.studentFeedbackSummary}</p>
              </div>
              <div>
                <strong className="text-slate-800 block mb-0.5">· 개선사항 및 차기 발전방안:</strong>
                <p className="text-slate-600">
                  {report.improvementsNeeded} {report.futurePlans}
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: 예산 집행 결산 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[#183153] uppercase tracking-wider">
              5. 예산 집행 결산 요약
            </h4>
            <div className="flex justify-between items-center p-3 bg-slate-100 border border-slate-300 font-mono">
              <span>총 배정 예산: <strong>{(report.budgetAllocated || 0).toLocaleString()}원</strong></span>
              <span>총 집행 실적: <strong className="text-teal-700">{(report.budgetSpent || 0).toLocaleString()}원</strong></span>
              <span>집행 잔액: <strong>{((report.budgetAllocated || 0) - (report.budgetSpent || 0)).toLocaleString()}원</strong></span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 border-t border-slate-300 text-center space-y-4">
            <p className="text-xs text-slate-600 font-serif">
              위와 같이 2026학년도 비교과 프로그램의 운영실적 및 성과결과를 사실과 다름없이 보고합니다.
            </p>
            <div className="flex justify-around items-center pt-2">
              <div className="text-xs">
                <span className="text-slate-500">운영책임자:</span>{' '}
                <strong className="text-slate-800">{report.operatorName} (인)</strong>
              </div>
              <div className="text-xs">
                <span className="text-slate-500">사업단 총괄관리자:</span>{' '}
                <strong className="text-slate-800">박종호 (인)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            닫기
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold bg-[#183153] hover:bg-[#183153]/90 text-white rounded-lg transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>보고서 공식 인쇄 / PDF 저장</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
