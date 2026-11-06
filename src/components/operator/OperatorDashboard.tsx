import React from 'react';
import { useApp } from '../../context/AppContext';
import { Program } from '../../types';
import { StatusBadge } from '../common/Badge';
import {
  FilePlus,
  Users,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface OperatorDashboardProps {
  onEditPlan: (program: Program) => void;
  onOpenAttendance: (programId: string) => void;
  onOpenReport: (programId: string) => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  onEditPlan,
  onOpenAttendance,
  onOpenReport,
}) => {
  const { programs, resultReports, setActiveTab } = useApp();

  // Operator's programs (simulated as operator user-operator-01)
  const myPrograms = programs.filter(
    (p) => p.operatorId === 'user-operator-01' || p.operatorName === '이서연'
  );

  const pendingPlans = myPrograms.filter(
    (p) => p.planStatus === '신청완료' || p.planStatus === '검토중'
  );

  const revisionNeededPlans = myPrograms.filter((p) => p.planStatus === '보완요청');
  const approvedPlans = myPrograms.filter((p) => p.planStatus === '승인완료');
  const runningPrograms = myPrograms.filter((p) => p.status === '운영중');
  const finishedPrograms = myPrograms.filter((p) => p.status === '운영종료');

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
              프로그램 운영 담당자 대시보드
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              이서연 교수 (SW융합교육센터)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            비교과 운영계획서 신청, 출석부 관리, 운영실적 보고 업무를 한곳에서 처리합니다.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('apply-plan')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#356FA5] hover:bg-[#2e6293] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-xs shrink-0"
        >
          <FilePlus className="w-4 h-4" />
          <span>신규 운영계획서 작성</span>
        </button>
      </div>

      {/* 2. Urgent Callout: 보완 요청 건 */}
      {revisionNeededPlans.length > 0 && (
        <div className="p-5 bg-amber-50/70 border border-amber-300 rounded-xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>관리자 보완 요청이 접수된 프로그램이 있습니다 ({revisionNeededPlans.length}건)</span>
          </div>
          <div className="space-y-2">
            {revisionNeededPlans.map((prog) => (
              <div
                key={prog.id}
                className="p-4 bg-white rounded-lg border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{prog.title}</div>
                  <div className="text-amber-800 bg-amber-50 p-2 rounded border border-amber-200/60">
                    <strong>관리자 검토의견:</strong> {prog.reviewComment || '세부 내역을 보완해 주시기 바랍니다.'}
                  </div>
                </div>
                <button
                  onClick={() => onEditPlan(prog)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition shrink-0"
                >
                  보완서 작성 및 재제출
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Operational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">내가 신청한 계획</div>
          <div className="text-2xl font-bold font-mono text-[#183153] mt-1">
            {myPrograms.length}
            <span className="text-xs font-normal text-slate-500 ml-1">건</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">승인 대기 중</div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1">
            {pendingPlans.length}
            <span className="text-xs font-normal text-slate-500 ml-1">건</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">보완 요청</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {revisionNeededPlans.length}
            <span className="text-xs font-normal text-slate-500 ml-1">건</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">현재 운영 중</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {runningPrograms.length}
            <span className="text-xs font-normal text-slate-500 ml-1">건</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">실적 보고 완료</div>
          <div className="text-2xl font-bold font-mono text-teal-700 mt-1">
            {resultReports.filter((r) => r.status === '승인완료').length}
            <span className="text-xs font-normal text-slate-500 ml-1">건</span>
          </div>
        </div>
      </div>

      {/* 4. Active Programs Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Running Programs: Attendance Management */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#183153] flex items-center gap-2 text-sm sm:text-base">
              <Users className="w-4 h-4 text-blue-600" />
              현재 운영 중 프로그램 (출석 관리)
            </h3>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-semibold text-[#356FA5] hover:underline flex items-center gap-1"
            >
              <span>출석부 바로가기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {runningPrograms.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              현재 운영 중인 프로그램이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {runningPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                      {prog.category}
                    </span>
                    <h4 className="font-bold text-slate-900">{prog.title}</h4>
                    <div className="text-slate-500">
                      수강인원: {prog.appliedCount}명 / {prog.location}
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenAttendance(prog.id)}
                    className="px-3.5 py-2 bg-[#356FA5] hover:bg-[#2e6293] text-white font-semibold rounded-lg transition shrink-0"
                  >
                    출석 체크
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Finished Programs: Result Reporting */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#183153] flex items-center gap-2 text-sm sm:text-base">
              <Award className="w-4 h-4 text-teal-600" />
              운영 종료 프로그램 (실적 보고서 제출)
            </h3>
            <button
              onClick={() => setActiveTab('result-report')}
              className="text-xs font-semibold text-[#356FA5] hover:underline flex items-center gap-1"
            >
              <span>실적보고 전체보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {finishedPrograms.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              운영 종료된 프로그램이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {finishedPrograms.map((prog) => {
                const report = resultReports.find((r) => r.programId === prog.id);

                return (
                  <div
                    key={prog.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                          {prog.category}
                        </span>
                        {report && <StatusBadge status={report.status} />}
                      </div>
                      <h4 className="font-bold text-slate-900">{prog.title}</h4>
                      <div className="text-slate-500">
                        종료일: {prog.operateEndDate} · 이수 정원 {prog.capacity}명
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenReport(prog.id)}
                      className={`px-3.5 py-2 font-semibold rounded-lg transition shrink-0 ${
                        report?.status === '승인완료'
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      {report ? (report.status === '승인완료' ? '보고서 열람' : '보고서 수정') : '실적 작성'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
