import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import {
  BarChart3,
  Users,
  BookOpen,
  ClipboardCheck,
  FileCheck,
  TrendingUp,
  DollarSign,
  Award,
  ArrowRight,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface AdminDashboardProps {
  onGoToPlanReviews: () => void;
  onGoToResultReviews: () => void;
  onGoToParticipants: () => void;
  onGoToStatistics: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onGoToPlanReviews,
  onGoToResultReviews,
  onGoToParticipants,
  onGoToStatistics,
}) => {
  const { programs, studentApplications, resultReports } = useApp();

  // Metrics
  const totalPrograms = programs.length;
  const recruitingPrograms = programs.filter((p) => p.status === '모집중').length;
  const completedPrograms = programs.filter((p) => p.status === '운영종료').length;
  const totalApplications = studentApplications.length;
  const completedStudents = studentApplications.filter((a) => a.isCompleted).length;

  const pendingPlanReviews = programs.filter(
    (p) => p.planStatus === '신청완료' || p.planStatus === '검토중'
  );

  const pendingResultReviews = resultReports.filter(
    (r) => r.status === '제출완료' || r.status === '검토중'
  );

  // Category counts
  const categoryCounts = programs.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Budget sum
  const totalBudget = programs.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSpent = resultReports.reduce((acc, r) => acc + (r.budgetSpent || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with System Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
              사업단 비교과 통합운영 총괄 대시보드
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              2026학년도 정규사업
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            전체 프로그램 운영 현황, 학생 참여율, 운영계획 및 실적 심사 대기열을 실시간 모니터링합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGoToStatistics}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#183153] hover:bg-[#183153]/90 text-white rounded-lg transition shadow-xs"
          >
            <BarChart3 className="w-4 h-4" />
            <span>상세 성과통계 분석</span>
          </button>
        </div>
      </div>

      {/* 2. Core Operational KPIs (8 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>전체 등록 프로그램</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#183153]">
            {totalPrograms}
            <span className="text-xs font-normal text-slate-500 ml-1">개</span>
          </div>
          <div className="text-[11px] text-teal-700 font-medium">모집중 {recruitingPrograms}개</div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>총 참여신청 학생수</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700">
            {totalApplications}
            <span className="text-xs font-normal text-slate-500 ml-1">명</span>
          </div>
          <div className="text-[11px] text-slate-500">선발/수료 완료 {completedStudents}명</div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>운영계획 심사 대기</span>
            <ClipboardCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600">
            {pendingPlanReviews.length}
            <span className="text-xs font-normal text-slate-500 ml-1">건</span>
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            {pendingPlanReviews.length > 0 ? '즉시 심사 필요' : '심사 완료됨'}
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>운영실적 심사 대기</span>
            <FileCheck className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600">
            {pendingResultReviews.length}
            <span className="text-xs font-normal text-slate-500 ml-1">건</span>
          </div>
          <div className="text-[11px] text-rose-700 font-medium">
            {pendingResultReviews.length > 0 ? '보고서 검토 대기' : '정산 완료'}
          </div>
        </div>
      </div>

      {/* 3. Urgent Processing Queues: Plan Reviews & Result Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Review Queue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#183153] flex items-center gap-2 text-sm sm:text-base">
              <ClipboardCheck className="w-4 h-4 text-amber-600" />
              운영계획 심사 대기 목록 ({pendingPlanReviews.length}건)
            </h3>
            <button
              onClick={onGoToPlanReviews}
              className="text-xs font-semibold text-[#356FA5] hover:underline flex items-center gap-1"
            >
              <span>전체 심사관리</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingPlanReviews.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              심사 대기 중인 운영계획서가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPlanReviews.map((prog) => (
                <div
                  key={prog.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                        {prog.category}
                      </span>
                      <StatusBadge status={prog.planStatus} />
                    </div>
                    <h4 className="font-bold text-slate-900">{prog.title}</h4>
                    <div className="text-slate-500">
                      신청자: {prog.operatorName} ({prog.operatorDepartment}) | 예산: {(prog.budget || 0).toLocaleString()}원
                    </div>
                  </div>
                  <button
                    onClick={onGoToPlanReviews}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition shrink-0"
                  >
                    심사하기
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Result Review Queue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#183153] flex items-center gap-2 text-sm sm:text-base">
              <FileCheck className="w-4 h-4 text-rose-600" />
              운영실적 검토 대기 목록 ({pendingResultReviews.length}건)
            </h3>
            <button
              onClick={onGoToResultReviews}
              className="text-xs font-semibold text-[#356FA5] hover:underline flex items-center gap-1"
            >
              <span>전체 실적관리</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingResultReviews.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              검토 대기 중인 실적보고서가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingResultReviews.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={rep.status} />
                      <span className="text-[11px] text-slate-400 font-mono">
                        제출일: {rep.submittedAt}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900">{rep.programTitle}</h4>
                    <div className="text-slate-500">
                      수료 {rep.completedCount}명 / 만족도 <strong>{rep.satisfactionScore}점</strong> | 집행액: {(rep.budgetSpent || 0).toLocaleString()}원
                    </div>
                  </div>
                  <button
                    onClick={onGoToResultReviews}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition shrink-0"
                  >
                    실적 검토
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Visual Charts: Categories & Budget & Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-[#183153] text-sm">분야별 프로그램 구성 비율</h3>
          <div className="space-y-3 text-xs">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalPrograms) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{cat}</span>
                    <span className="font-mono text-slate-500">
                      {count}개 ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#356FA5] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Execution Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-[#183153] text-sm">사업단 예산 집행 총괄</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
              <span className="text-slate-500">총 편성 예산</span>
              <span className="font-mono font-bold text-slate-800 text-sm">
                {totalBudget.toLocaleString()} 원
              </span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
              <span className="text-emerald-700 font-medium">총 집행 실적</span>
              <span className="font-mono font-bold text-emerald-900 text-sm">
                {totalSpent.toLocaleString()} 원
              </span>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-slate-600">
                <span>예산 집행률</span>
                <span className="font-mono font-bold text-teal-700">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full"
                  style={{
                    width: `${totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Satisfaction Rating Highlights */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-[#183153] text-sm">학생 만족도 종합 평점</h3>
          <div className="text-center p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
            <div className="text-3xl font-black font-mono text-amber-900">4.88</div>
            <div className="text-xs text-amber-700">전체 프로그램 5.0 만점 기준</div>
            <div className="text-[11px] text-slate-500 pt-1">
              강사 전문성 4.97 | 실무 활용도 4.91 | 시설 4.82
            </div>
          </div>
          <button
            onClick={onGoToStatistics}
            className="w-full py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition"
          >
            학과별/학년별 분석 리포트 보기
          </button>
        </div>
      </div>
    </div>
  );
};
