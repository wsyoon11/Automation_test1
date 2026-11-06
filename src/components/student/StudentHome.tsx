import React from 'react';
import { useApp } from '../../context/AppContext';
import { Program } from '../../types';
import { StatusBadge } from '../common/Badge';
import {
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  Award,
  Users,
  Bell,
  Calendar,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface StudentHomeProps {
  onSelectProgram: (program: Program) => void;
  onOpenApply: (program: Program) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ onSelectProgram, onOpenApply }) => {
  const { programs, notices, setActiveTab, studentApplications } = useApp();

  const recruitingPrograms = programs.filter((p) => p.status === '모집중');
  const recentNotices = notices.slice(0, 4);

  // Student stats
  const myCompletedCount = studentApplications.filter(
    (a) => a.studentId === 'user-student-01' && a.isCompleted
  ).length;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Visual Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#183153] via-[#214370] to-[#356FA5] text-white p-6 sm:p-10 shadow-lg">
        {/* Background Subtle Geometry */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-80 h-80 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-teal-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026학년도 AI/SW 융합인재양성 비교과 통합포털</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            신기술 실무 역량을 키우고,<br />
            비교과 마일리지로 도약하세요
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            초거대 AI(LLM) 파인튜닝, AWS 클라우드 자격증 대비, 카카오 엔터프라이즈 산학 프로젝트 등 산업 현장이 원하는 최고의 실무 비교과 교육을 제공합니다.
          </p>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('programs')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#183153] font-bold text-xs sm:text-sm transition-all shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>모집 프로그램 탐색하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('mypage')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-all backdrop-blur-sm"
            >
              <span>나의 신청내역 & 마일리지</span>
            </button>
          </div>
        </div>

        {/* Hero KPI Numbers Strip */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-300">
              {recruitingPrograms.length}개
            </div>
            <div className="text-xs text-slate-300 mt-0.5">현재 모집 중</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {programs.length}개
            </div>
            <div className="text-xs text-slate-300 mt-0.5">전체 운영 프로그램</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-300">
              4.85 / 5.0
            </div>
            <div className="text-xs text-slate-300 mt-0.5">평균 학생 만족도</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              최대 80P
            </div>
            <div className="text-xs text-slate-300 mt-0.5">역량 마일리지 부여</div>
          </div>
        </div>
      </div>

      {/* 2. Urgent / Active Recruiting Programs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#183153] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              지금 모집 중인 추천 프로그램
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              선착순 및 심사 선발로 진행되니 모집 일정을 확인하고 서둘러 신청하세요.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('programs')}
            className="text-xs font-semibold text-[#356FA5] hover:underline flex items-center gap-1"
          >
            <span>전체보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recruitingPrograms.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-sm">
              현재 모집 중인 프로그램이 없습니다.
            </div>
          ) : (
            recruitingPrograms.map((prog) => {
              const fillPercentage = Math.round((prog.appliedCount / prog.capacity) * 100);

              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-xl border border-[#E3E8EF] hover:border-[#356FA5] transition-all hover:shadow-md p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {prog.category}
                      </span>
                      <StatusBadge status={prog.status} />
                    </div>

                    <h3
                      onClick={() => onSelectProgram(prog)}
                      className="font-bold text-slate-900 group-hover:text-[#183153] transition-colors line-clamp-2 cursor-pointer text-sm sm:text-base leading-snug"
                    >
                      {prog.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {prog.summary}
                    </p>

                    {/* Progress Bar of Capacity */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>모집 현황</span>
                        <span className="font-mono font-semibold">
                          {prog.appliedCount} / {prog.capacity}명 ({fillPercentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, fillPercentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>모집마감: {prog.recruitEndDate}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">{prog.location}</span>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                          +{prog.mileage}P
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 mt-2">
                    <button
                      onClick={() => onSelectProgram(prog)}
                      className="flex-1 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-center"
                    >
                      상세보기
                    </button>
                    <button
                      onClick={() => onOpenApply(prog)}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-[#183153] hover:bg-[#183153]/90 rounded-lg transition-colors text-center shadow-xs"
                    >
                      참여신청
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Notices & Core Competency Framework */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Official Notices */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#183153] flex items-center gap-2 text-base">
              <Bell className="w-4 h-4 text-blue-600" />
              사업단 주요 공지사항
            </h3>
            <button
              onClick={() => setActiveTab('notices')}
              className="text-xs text-[#356FA5] hover:underline flex items-center gap-1"
            >
              <span>더보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setActiveTab('notices')}
                className="py-3 flex items-start justify-between gap-4 hover:bg-slate-50/60 rounded-lg px-2 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {notice.isPinned && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                        중요
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-slate-500">
                      [{notice.category}]
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#183153] line-clamp-1">
                      {notice.title}
                    </h4>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {notice.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info: Extracurricular Process & Mileage */}
        <div className="bg-[#F8FAFC] border border-[#E3E8EF] rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-[#183153] flex items-center gap-2 text-base">
            <Award className="w-4 h-4 text-teal-600" />
            비교과 마일리지 혜택
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            비교과 프로그램을 80% 이상 출석 이수 시 적립되는 사업단 마일리지로 학기말 장학 혜택을 누리세요!
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">누적 150P 이상 달성</span>
              <span className="font-bold text-teal-700">장학금 50만원</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">누적 100P 이상 달성</span>
              <span className="font-bold text-teal-700">장학금 30만원</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">누적 50P 이상 달성</span>
              <span className="font-bold text-teal-700">우수 이수 인증서</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => setActiveTab('mypage')}
              className="w-full py-2 bg-[#183153] text-white rounded-lg text-xs font-semibold hover:bg-[#183153]/90 transition"
            >
              내 마일리지 현황 확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
