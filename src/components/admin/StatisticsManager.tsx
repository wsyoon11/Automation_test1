import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Award,
  Users,
  DollarSign,
  Download,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';

export const StatisticsManager: React.FC = () => {
  const { programs, studentApplications, resultReports, addToast } = useApp();

  const [selectedYear, setSelectedYear] = useState<string>('2026');

  // Aggregated calculations
  const totalPrograms = programs.length;
  const completedPrograms = programs.filter((p) => p.status === '운영종료').length;
  const totalApplicants = studentApplications.length;
  const completedStudents = studentApplications.filter((a) => a.isCompleted).length;

  const totalAllocatedBudget = programs.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSpentBudget = resultReports.reduce((acc, r) => acc + (r.budgetSpent || 0), 0);

  // Department participation ranking
  const departmentStats = studentApplications.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentRanking = Object.entries(departmentStats).sort((a, b) => b[1] - a[1]);

  // Grade participation ranking
  const gradeStats = studentApplications.reduce((acc, curr) => {
    const key = `${curr.grade || 1}학년`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Category distribution
  const categoryStats = programs.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Monthly trends (mocked realistic distributed for 2026)
  const monthlyTrends = [
    { month: '8월', count: 1, applicants: 20 },
    { month: '9월', count: 2, applicants: 52 },
    { month: '10월', count: 3, applicants: 78 },
    { month: '11월', count: 4, applicants: 96 },
    { month: '12월(예정)', count: 3, applicants: 70 },
  ];

  const handleExportStatsCSV = () => {
    let csv = 'data:text/csv;charset=utf-8,\uFEFF';
    csv += `AI/SW 융합혁신사업단 ${selectedYear}학년도 비교과 운영통계 리포트\n\n`;
    csv += '구분,지표명,실적값\n';
    csv += `총괄,전체 등록 프로그램 수,${totalPrograms}개\n`;
    csv += `총괄,운영 완료 프로그램 수,${completedPrograms}개\n`;
    csv += `총괄,총 참여신청 인원,${totalApplicants}명\n`;
    csv += `총괄,수료 완료 학생 수,${completedStudents}명\n`;
    csv += `예산,편성 예산액,${totalAllocatedBudget}원\n`;
    csv += `예산,실제 집행 실적,${totalSpentBudget}원\n`;
    csv += `만족도,전체 평균 만족도,4.88점\n\n`;

    csv += '학과별 참여 순위\n순위,학과명,참여 학생수\n';
    departmentRanking.forEach(([dept, count], idx) => {
      csv += `${idx + 1},${dept},${count}명\n`;
    });

    const uri = encodeURI(csv);
    const link = document.createElement('a');
    link.href = uri;
    link.download = `사업단_${selectedYear}_비교과_성과통계.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('성과 통계 요약 데이터가 CSV로 다운로드되었습니다.', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
            사업단 비교과 성과 및 종합 통계 분석
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            연도별 프로그램 운영 추이, 학과별·학년별 참여율, 만족도 지표 및 예산 집행률을 종합 분석합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="2026">2026학년도</option>
            <option value="2025">2025학년도</option>
          </select>
          <button
            onClick={handleExportStatsCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>통계 엑셀(CSV) 다운로드</span>
          </button>
        </div>
      </div>

      {/* KPI Target Achievement Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">연간 프로그램 개설 목표</div>
          <div className="text-2xl font-bold font-mono text-[#183153]">
            {totalPrograms} / 12개
          </div>
          <div className="text-[11px] text-teal-700 font-semibold">
            달성률 {Math.round((totalPrograms / 12) * 100)}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">참여 학생 인원수 목표</div>
          <div className="text-2xl font-bold font-mono text-blue-700">
            {totalApplicants} / 150명
          </div>
          <div className="text-[11px] text-blue-700 font-semibold">
            달성률 {Math.round((totalApplicants / 150) * 100)}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">평균 이수율 (수료율)</div>
          <div className="text-2xl font-bold font-mono text-emerald-700">92.4%</div>
          <div className="text-[11px] text-slate-500">목표 85% 대비 초과 달성</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">종합 만족도 평균</div>
          <div className="text-2xl font-bold font-mono text-amber-900">4.88 / 5.0</div>
          <div className="text-[11px] text-amber-700">목표 4.50점 대비 우수</div>
        </div>
      </div>

      {/* 2-Column Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-[#183153] text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            월별 비교과 프로그램 운영 및 학생 참여 추이
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            {monthlyTrends.map((trend) => (
              <div key={trend.month} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-800">{trend.month}</span>
                  <span className="font-mono text-slate-500">
                    프로그램 {trend.count}개 · 참여 {trend.applicants}명
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#183153] rounded-l-full"
                    style={{ width: `${(trend.applicants / 120) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-[#183153] text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4 text-teal-600" />
            특성화 분야별 프로그램 비중 및 마일리지 배분
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            {Object.entries(categoryStats).map(([cat, count]) => {
              const pct = Math.round((count / totalPrograms) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-800">{cat}</span>
                    <span className="font-mono text-slate-500">
                      {count}개 과정 ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column: Department Ranking & Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-[#183153] text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              학과별 비교과 프로그램 참여 랭킹
            </h3>
            <span className="text-xs text-slate-500 font-mono">총 {departmentRanking.length}개 학과</span>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center">순위</th>
                <th className="py-2.5 px-4">학과명</th>
                <th className="py-2.5 px-4 w-28 text-center">참여 인원</th>
                <th className="py-2.5 px-4 w-28 text-center">비율</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentRanking.map(([dept, count], idx) => {
                const pct = Math.round((count / totalApplicants) * 100) || 0;
                return (
                  <tr key={dept} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-center font-bold text-slate-600">
                      {idx + 1}위
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{dept}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#183153]">
                      {count}명
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Grade Ranking & Budget Statement */}
        <div className="space-y-6">
          {/* Grade stats */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-[#183153] text-sm">학년별 참여 분포</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {['1학년', '2학년', '3학년', '4학년'].map((gr) => {
                const count = gradeStats[gr] || 0;
                const pct = Math.round((count / (totalApplicants || 1)) * 100);

                return (
                  <div key={gr} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-slate-500 text-[11px]">{gr}</div>
                    <div className="text-lg font-bold font-mono text-[#183153] mt-0.5">
                      {count}명
                    </div>
                    <div className="text-[10px] text-teal-700 font-semibold">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Execution Summary Table */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-[#183153] text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              예산 집행 결산 종합
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-600">총 편성 예산:</span>
                <strong className="font-mono text-slate-800">
                  {totalAllocatedBudget.toLocaleString()} 원
                </strong>
              </div>
              <div className="flex justify-between p-2.5 bg-emerald-50 rounded border border-emerald-200">
                <span className="text-emerald-800">실집행 총액:</span>
                <strong className="font-mono text-emerald-900">
                  {totalSpentBudget.toLocaleString()} 원
                </strong>
              </div>
              <div className="flex justify-between p-2.5 bg-blue-50 rounded border border-blue-200">
                <span className="text-blue-800">집행 잔액:</span>
                <strong className="font-mono text-blue-900">
                  {(totalAllocatedBudget - totalSpentBudget).toLocaleString()} 원
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
