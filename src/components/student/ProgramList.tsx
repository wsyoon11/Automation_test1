import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Program, ProgramCategory, ProgramStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import {
  Search,
  Filter,
  Calendar,
  Users,
  Award,
  BookOpen,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';

interface ProgramListProps {
  onSelectProgram: (program: Program) => void;
  onOpenApply: (program: Program) => void;
}

export const ProgramList: React.FC<ProgramListProps> = ({ onSelectProgram, onOpenApply }) => {
  const { programs, studentApplications } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'deadline' | 'mileage' | 'popular'>('deadline');

  const categories: (ProgramCategory | 'ALL')[] = [
    'ALL',
    'AI·빅데이터',
    '클라우드·SW',
    '산학연계 프로젝트',
    '취·창업 실무',
    '글로벌·자격증',
  ];

  const statuses = [
    { label: '전체', value: 'ALL' },
    { label: '모집중', value: '모집중' },
    { label: '모집예정', value: '모집예정' },
    { label: '운영중', value: '운영중' },
    { label: '운영종료', value: '운영종료' },
  ];

  // Filter and sort programs (only approved plans are shown to students)
  const filteredPrograms = useMemo(() => {
    return programs
      .filter((p) => p.planStatus === '승인완료') // Only public approved programs
      .filter((p) => {
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
        if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchSummary = p.summary.toLowerCase().includes(q);
          const matchInstructor = p.instructor.name.toLowerCase().includes(q);
          const matchComp = p.competencies.some((c) => c.toLowerCase().includes(q));
          if (!matchTitle && !matchSummary && !matchInstructor && !matchComp) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          // 모집중 first, then closest recruitEndDate
          if (a.status === '모집중' && b.status !== '모집중') return -1;
          if (b.status === '모집중' && a.status !== '모집중') return 1;
          return a.recruitEndDate.localeCompare(b.recruitEndDate);
        }
        if (sortBy === 'latest') {
          return b.createdAt.localeCompare(a.createdAt);
        }
        if (sortBy === 'mileage') {
          return b.mileage - a.mileage;
        }
        if (sortBy === 'popular') {
          return b.appliedCount - a.appliedCount;
        }
        return 0;
      });
  }, [programs, selectedCategory, selectedStatus, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Search Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
            비교과 프로그램 안내 & 신청
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            AI/SW 융합혁신사업단에서 개설한 정규 비교과 프로그램을 탐색하고 온라인으로 신청하세요.
          </p>
        </div>

        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="프로그램명, 강사명, 핵심역량(#AI, #클라우드) 검색..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#356FA5] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                지우기
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-[#356FA5]"
            >
              <option value="deadline">마감 임박순</option>
              <option value="latest">최신 등록순</option>
              <option value="mileage">마일리지 높은순</option>
              <option value="popular">신청 인원순</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Status Tabs */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">분야:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#183153] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? '전체 분야' : cat}
              </button>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">상태:</span>
            {statuses.map((st) => (
              <button
                key={st.value}
                onClick={() => setSelectedStatus(st.value)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStatus === st.value
                    ? 'bg-[#356FA5] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Program Result Grid */}
      <div className="space-y-3">
        <div className="text-xs text-slate-500 font-medium">
          총 <span className="font-bold text-[#183153]">{filteredPrograms.length}</span>개의 프로그램이 검색되었습니다.
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-700">해당 조건에 맞는 프로그램이 없습니다.</h3>
            <p className="text-xs text-slate-400">검색어 또는 필터 조건을 변경해 보세요.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrograms.map((prog) => {
              const fillPercentage = Math.round((prog.appliedCount / prog.capacity) * 100);
              const isApplied = studentApplications.some(
                (a) => a.programId === prog.id && a.studentId === 'user-student-01' && a.status !== '취소'
              );

              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-xl border border-[#E3E8EF] hover:border-[#356FA5] transition-all hover:shadow-md p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header meta */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {prog.category}
                      </span>
                      <StatusBadge status={prog.status} />
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onSelectProgram(prog)}
                      className="font-bold text-slate-900 hover:text-[#183153] transition-colors line-clamp-2 cursor-pointer text-sm sm:text-base leading-snug"
                    >
                      {prog.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {prog.summary}
                    </p>

                    {/* Capacity progress */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>모집 정원</span>
                        <span className="font-mono font-semibold">
                          {prog.appliedCount} / {prog.capacity}명 ({fillPercentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            fillPercentage >= 100 ? 'bg-amber-500' : 'bg-teal-500'
                          }`}
                          style={{ width: `${Math.min(100, fillPercentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Info rows */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">운영기간:</span>
                        <span className="font-medium text-slate-800">
                          {prog.operateStartDate} ~ {prog.operateEndDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">모집기간:</span>
                        <span className="font-medium text-slate-800">
                          {prog.recruitStartDate} ~ {prog.recruitEndDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">
                          {prog.location} ({prog.method})
                        </span>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                          +{prog.mileage}P
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-4 mt-2">
                    <button
                      onClick={() => onSelectProgram(prog)}
                      className="flex-1 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-center"
                    >
                      상세보기
                    </button>
                    {isApplied ? (
                      <span className="flex-1 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                        신청완료
                      </span>
                    ) : prog.status === '모집중' ? (
                      <button
                        onClick={() => onOpenApply(prog)}
                        className="flex-1 py-2 text-xs font-semibold text-white bg-[#183153] hover:bg-[#183153]/90 rounded-lg transition-colors text-center shadow-xs"
                      >
                        신청하기
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 py-2 text-xs font-medium text-slate-400 bg-slate-100 rounded-lg text-center cursor-not-allowed"
                      >
                        {prog.status === '모집예정' ? '모집예정' : '모집마감'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
