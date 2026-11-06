import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Program, ResultReport } from '../../types';
import { Modal } from '../common/Modal';
import {
  Award,
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  DollarSign,
  Star,
  CheckCircle2,
} from 'lucide-react';

interface ResultReportFormProps {
  initialProgramId?: string;
  onFinished: () => void;
}

export const ResultReportForm: React.FC<ResultReportFormProps> = ({
  initialProgramId,
  onFinished,
}) => {
  const { programs, resultReports, saveOrSubmitResultReport, addToast } = useApp();

  // Programs that are finished or running
  const eligiblePrograms = programs.filter(
    (p) => p.status === '운영종료' || p.status === '운영중'
  );

  const [selectedProgId, setSelectedProgId] = useState<string>(
    initialProgramId || eligiblePrograms[0]?.id || ''
  );

  const targetProgram = programs.find((p) => p.id === selectedProgId);
  const existingReport = resultReports.find((r) => r.programId === selectedProgId);

  // Form states
  const [actualStartDate, setActualStartDate] = useState(
    existingReport?.actualStartDate || targetProgram?.operateStartDate || '2026-09-20'
  );
  const [actualEndDate, setActualEndDate] = useState(
    existingReport?.actualEndDate || targetProgram?.operateEndDate || '2026-10-25'
  );
  const [actualLocation, setActualLocation] = useState(
    existingReport?.actualLocation || targetProgram?.location || '산학협력관 세미나실'
  );
  const [actualMethod, setActualMethod] = useState(
    existingReport?.actualMethod || targetProgram?.method || '대면'
  );

  const [recruitedCount, setRecruitedCount] = useState(
    existingReport?.recruitedCount || targetProgram?.appliedCount || 20
  );
  const [actualAttendees, setActualAttendees] = useState(
    existingReport?.actualAttendees || 19
  );
  const [completedCount, setCompletedCount] = useState(
    existingReport?.completedCount || 18
  );
  const [dropoutsCount, setDropoutsCount] = useState(
    existingReport?.dropoutsCount || 1
  );

  const [satisfactionScore, setSatisfactionScore] = useState(
    existingReport?.satisfactionScore || 4.85
  );
  const [breakdownCurriculum, setBreakdownCurriculum] = useState(
    existingReport?.satisfactionBreakdown?.curriculum || 4.9
  );
  const [breakdownInstructor, setBreakdownInstructor] = useState(
    existingReport?.satisfactionBreakdown?.instructor || 4.95
  );
  const [breakdownFacilities, setBreakdownFacilities] = useState(
    existingReport?.satisfactionBreakdown?.facilities || 4.8
  );
  const [breakdownApplicability, setBreakdownApplicability] = useState(
    existingReport?.satisfactionBreakdown?.applicability || 4.88
  );

  const [keyOutcomes, setKeyOutcomes] = useState(
    existingReport?.keyOutcomes ||
      '총 5개 팀의 프로젝트 완성 및 산업체 멘토의 최종 평가 완료. 우수 학생 2명 산학협력 기업 인턴십 추천 확정.'
  );
  const [studentFeedbackSummary, setStudentFeedbackSummary] = useState(
    existingReport?.studentFeedbackSummary ||
      '실무 현업 개발자의 생생한 코드 리뷰와 시스템 아키텍처 설계를 직접 실습할 수 있어 역량 향상에 매우 큰 도움이 되었다는 평가가 많았음.'
  );
  const [improvementsNeeded, setImprovementsNeeded] = useState(
    existingReport?.improvementsNeeded ||
      '실습 인프라 계정 사전 발급 과정에서 초기 1일간 세팅 지연이 있었음.'
  );
  const [futurePlans, setFuturePlans] = useState(
    existingReport?.futurePlans ||
      '차기 학기에는 교육 시작 3일 전 사전 온보딩 가이드를 배포하여 실습 준비 시간을 단축할 계획임.'
  );

  const [budgetAllocated, setBudgetAllocated] = useState(
    existingReport?.budgetAllocated || targetProgram?.budget || 8000000
  );
  const [budgetSpent, setBudgetSpent] = useState(
    existingReport?.budgetSpent || 7850000
  );

  const [budgetDetails, setBudgetDetails] = useState(
    existingReport?.budgetDetails || [
      { item: '전문 강사료 및 멘토링 수당', amount: 4500000, note: '강사 1인, 멘토 2인 수당 지급' },
      { item: '학생 실습 클라우드 서버 인프라비', amount: 1850000, note: '팀별 서버 호스팅 비용 실비' },
      { item: '교육 교재 인쇄 및 다과비', amount: 800000, note: '교재 25부 인쇄 및 간식' },
      { item: '우수 이수자 시상 상품', amount: 700000, note: '우수 2팀 온누리상품권' },
    ]
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Sync when selecting a different program
  useEffect(() => {
    if (targetProgram) {
      const rep = resultReports.find((r) => r.programId === targetProgram.id);
      if (rep) {
        setActualStartDate(rep.actualStartDate);
        setActualEndDate(rep.actualEndDate);
        setActualLocation(rep.actualLocation);
        setActualMethod(rep.actualMethod);
        setRecruitedCount(rep.recruitedCount);
        setActualAttendees(rep.actualAttendees);
        setCompletedCount(rep.completedCount);
        setDropoutsCount(rep.dropoutsCount);
        setSatisfactionScore(rep.satisfactionScore);
        setKeyOutcomes(rep.keyOutcomes);
        setStudentFeedbackSummary(rep.studentFeedbackSummary);
        setImprovementsNeeded(rep.improvementsNeeded);
        setFuturePlans(rep.futurePlans);
        setBudgetAllocated(rep.budgetAllocated);
        setBudgetSpent(rep.budgetSpent);
        setBudgetDetails(rep.budgetDetails);
      } else {
        setActualStartDate(targetProgram.operateStartDate);
        setActualEndDate(targetProgram.operateEndDate);
        setActualLocation(targetProgram.location);
        setActualMethod(targetProgram.method);
        setRecruitedCount(targetProgram.appliedCount);
        setBudgetAllocated(targetProgram.budget);
        setBudgetSpent(Math.round(targetProgram.budget * 0.95));
      }
    }
  }, [selectedProgId, targetProgram, resultReports]);

  const handleAddBudgetItem = () => {
    setBudgetDetails([
      ...budgetDetails,
      { item: '신규 집행 항목', amount: 500000, note: '집행 내역 메모' },
    ]);
  };

  const handleRemoveBudgetItem = (idx: number) => {
    setBudgetDetails(budgetDetails.filter((_, i) => i !== idx));
  };

  const handleBudgetItemChange = (idx: number, field: string, val: any) => {
    const updated = [...budgetDetails];
    updated[idx] = { ...updated[idx], [field]: val };
    setBudgetDetails(updated);
  };

  const handleSave = (isSubmit: boolean) => {
    if (!targetProgram) return;

    const reportData: Partial<ResultReport> = {
      id: existingReport?.id,
      programId: targetProgram.id,
      programTitle: targetProgram.title,
      actualStartDate,
      actualEndDate,
      actualLocation,
      actualMethod,
      recruitedCount: Number(recruitedCount),
      actualAttendees: Number(actualAttendees),
      completedCount: Number(completedCount),
      dropoutsCount: Number(dropoutsCount),
      satisfactionScore: Number(satisfactionScore),
      satisfactionBreakdown: {
        curriculum: Number(breakdownCurriculum),
        instructor: Number(breakdownInstructor),
        facilities: Number(breakdownFacilities),
        applicability: Number(breakdownApplicability),
      },
      keyOutcomes,
      studentFeedbackSummary,
      improvementsNeeded,
      futurePlans,
      budgetAllocated: Number(budgetAllocated),
      budgetSpent: Number(budgetSpent),
      budgetDetails,
      photos: [
        { title: '실습 및 프로젝트 진행 장면', description: '참여 학생들의 핸즈온 실습 및 멘토 피드백' },
        { title: '최종 성과발표회 기념촬영', description: '수료자 및 강사진 단체 기념사진' },
      ],
      attachments: [
        { name: `${targetProgram.title}_운영결과보고서.pdf`, size: '4.2 MB', type: 'application/pdf' },
        { name: '출석부_및_수료증명.xlsx', size: '650 KB', type: 'application/vnd.ms-excel' },
      ],
    };

    saveOrSubmitResultReport(reportData, isSubmit);
    onFinished();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header and Program Selector */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
              비교과 프로그램 운영실적 보고서 작성
            </h1>
            {existingReport && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                상태: {existingReport.status}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            프로그램 종료 후 실제 참여 인원, 만족도 평가 결과, 예산 집행 내역을 등록하여 관리자 승인을 받습니다.
          </p>
        </div>

        {/* Program Selector */}
        <div className="w-full md:w-72">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            실적을 등록할 프로그램:
          </label>
          <select
            value={selectedProgId}
            onChange={(e) => setSelectedProgId(e.target.value)}
            className="w-full text-xs sm:text-sm p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:ring-2 focus:ring-[#356FA5]"
          >
            {eligiblePrograms.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.status}] {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {targetProgram ? (
        <div className="space-y-6">
          {/* SECTION 1: 실제 운영 개요 및 참여 실적 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-[#183153] text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              1. 실제 운영 개요 및 참여·수료 실적
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  실제 교육 기간
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={actualStartDate}
                    onChange={(e) => setActualStartDate(e.target.value)}
                    className="text-xs p-2 border border-slate-300 rounded-lg font-mono"
                  />
                  <input
                    type="date"
                    value={actualEndDate}
                    onChange={(e) => setActualEndDate(e.target.value)}
                    className="text-xs p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    실제 운영 장소
                  </label>
                  <input
                    type="text"
                    value={actualLocation}
                    onChange={(e) => setActualLocation(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    운영 방식
                  </label>
                  <input
                    type="text"
                    value={actualMethod}
                    onChange={(e) => setActualMethod(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Numeric Roster Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 block">모집/신청 인원</span>
                <input
                  type="number"
                  value={recruitedCount}
                  onChange={(e) => setRecruitedCount(Number(e.target.value))}
                  className="w-full text-lg font-bold font-mono text-slate-800 bg-transparent"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-[11px] text-blue-700 block">실제 참여 인원</span>
                <input
                  type="number"
                  value={actualAttendees}
                  onChange={(e) => setActualAttendees(Number(e.target.value))}
                  className="w-full text-lg font-bold font-mono text-blue-900 bg-transparent"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-[11px] text-emerald-700 block">최종 수료 인원</span>
                <input
                  type="number"
                  value={completedCount}
                  onChange={(e) => setCompletedCount(Number(e.target.value))}
                  className="w-full text-lg font-bold font-mono text-emerald-900 bg-transparent"
                />
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <span className="text-[11px] text-rose-700 block">중도 탈락 / 미수료</span>
                <input
                  type="number"
                  value={dropoutsCount}
                  onChange={(e) => setDropoutsCount(Number(e.target.value))}
                  className="w-full text-lg font-bold font-mono text-rose-900 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: 학생 만족도 설문 결과 (5.0 척도) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-[#183153] text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              2. 학생 만족도 조사 결과 (5점 척도)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-center sm:col-span-1">
                <span className="text-[11px] font-bold text-amber-800 block">종합 만족도</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="5"
                  value={satisfactionScore}
                  onChange={(e) => setSatisfactionScore(Number(e.target.value))}
                  className="w-full text-2xl font-black font-mono text-amber-900 text-center bg-transparent mt-1"
                />
                <span className="text-[10px] text-amber-600 block">/ 5.00 만점</span>
              </div>

              <div className="sm:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block text-[11px]">교육과정 적절성</span>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={breakdownCurriculum}
                    onChange={(e) => setBreakdownCurriculum(Number(e.target.value))}
                    className="w-full text-sm font-bold font-mono text-slate-800 bg-transparent mt-1"
                  />
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block text-[11px]">강사 전문성/열의</span>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={breakdownInstructor}
                    onChange={(e) => setBreakdownInstructor(Number(e.target.value))}
                    className="w-full text-sm font-bold font-mono text-slate-800 bg-transparent mt-1"
                  />
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block text-[11px]">실습 시설/환경</span>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={breakdownFacilities}
                    onChange={(e) => setBreakdownFacilities(Number(e.target.value))}
                    className="w-full text-sm font-bold font-mono text-slate-800 bg-transparent mt-1"
                  />
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block text-[11px]">진로/실무 활용도</span>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={breakdownApplicability}
                    onChange={(e) => setBreakdownApplicability(Number(e.target.value))}
                    className="w-full text-sm font-bold font-mono text-slate-800 bg-transparent mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: 주요 운영 성과 및 정성적 분석 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-[#183153] text-sm border-b border-slate-100 pb-2">
              3. 주요 운영 성과 및 피드백 분석
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  주요 운영 내용 및 정량/정성 성과
                </label>
                <textarea
                  rows={3}
                  value={keyOutcomes}
                  onChange={(e) => setKeyOutcomes(e.target.value)}
                  placeholder="예: 최종 프로젝트 산출물, 논문/특허 출원, 취업/인턴십 연계 성과 등"
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  학생 주요 의견 및 수기 요약
                </label>
                <textarea
                  rows={2}
                  value={studentFeedbackSummary}
                  onChange={(e) => setStudentFeedbackSummary(e.target.value)}
                  placeholder="참여 학생들의 주관식 만족도 설문 피드백 핵심 내용"
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    운영상 미비점 및 개선사항
                  </label>
                  <textarea
                    rows={2}
                    value={improvementsNeeded}
                    onChange={(e) => setImprovementsNeeded(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    향후 차기 프로그램 발전방안
                  </label>
                  <textarea
                    rows={2}
                    value={futurePlans}
                    onChange={(e) => setFuturePlans(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: 예산 집행 결산 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-[#183153] text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                4. 예산 집행 결산 내역
              </h3>
              <button
                type="button"
                onClick={handleAddBudgetItem}
                className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>집행 항목 추가</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block">배정 예산</span>
                <span className="text-base font-bold font-mono text-slate-800">
                  {budgetAllocated.toLocaleString()} 원
                </span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-emerald-700 block">실집행 총액</span>
                <input
                  type="number"
                  step={10000}
                  value={budgetSpent}
                  onChange={(e) => setBudgetSpent(Number(e.target.value))}
                  className="w-full text-base font-bold font-mono text-emerald-900 bg-transparent"
                />
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-700 block">예산 집행률</span>
                <span className="text-base font-bold font-mono text-blue-900">
                  {Math.round((budgetSpent / budgetAllocated) * 100)} %
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {budgetDetails.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs"
                >
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => handleBudgetItemChange(idx, 'item', e.target.value)}
                    placeholder="지출 항목명"
                    className="flex-1 p-2 border border-slate-300 rounded bg-white"
                  />
                  <input
                    type="number"
                    step={10000}
                    value={item.amount}
                    onChange={(e) =>
                      handleBudgetItemChange(idx, 'amount', Number(e.target.value))
                    }
                    placeholder="금액"
                    className="w-32 p-2 border border-slate-300 rounded bg-white font-mono text-right"
                  />
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => handleBudgetItemChange(idx, 'note', e.target.value)}
                    placeholder="비고"
                    className="w-48 p-2 border border-slate-300 rounded bg-white text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBudgetItem(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onFinished}
              className="px-5 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              취소
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition"
              >
                임시저장
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-6 py-2 text-xs sm:text-sm font-semibold bg-[#2A8C8C] hover:bg-[#247c7c] text-white rounded-lg transition shadow-xs"
              >
                실적보고서 최종 제출
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-sm">
          실적을 보고할 수 있는 프로그램이 없습니다.
        </div>
      )}
    </div>
  );
};
