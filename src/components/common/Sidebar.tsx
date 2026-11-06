import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  BookOpen,
  UserCheck,
  Bell,
  LayoutDashboard,
  FilePlus,
  FileText,
  Users,
  Award,
  BarChart3,
  ClipboardCheck,
  FolderKanban,
  FileCheck,
  PieChart,
  MessageSquare,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { currentRole, activeTab, setActiveTab, programs, studentApplications, resultReports } =
    useApp();

  // Compute live badges
  const pendingPlanReviews = programs.filter(
    (p) => p.planStatus === '신청완료' || p.planStatus === '검토중'
  ).length;

  const pendingResultReviews = resultReports.filter(
    (r) => r.status === '제출완료' || r.status === '검토중'
  ).length;

  const myApplicationsCount = studentApplications.filter(
    (a) => a.studentId === 'user-student-01' && a.status !== '취소'
  ).length;

  const operatorPlansRequiringRevision = programs.filter(
    (p) => p.planStatus === '보완요청'
  ).length;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = () => {
    if (currentRole === 'student') {
      return (
        <>
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            학생 서비스
          </div>
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'home'
                ? 'bg-[#183153] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 shrink-0" />
              <span>사업단 홈 & 안내</span>
            </div>
          </button>

          <button
            onClick={() => handleNavClick('programs')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'programs'
                ? 'bg-[#183153] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>프로그램 안내 & 신청</span>
            </div>
          </button>

          <button
            onClick={() => handleNavClick('mypage')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'mypage'
                ? 'bg-[#183153] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>마이페이지 (신청/이수)</span>
            </div>
            {myApplicationsCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">
                {myApplicationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('notices')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'notices'
                ? 'bg-[#183153] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 shrink-0" />
              <span>공지사항 & FAQ</span>
            </div>
          </button>
        </>
      );
    }

    if (currentRole === 'operator') {
      return (
        <>
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            운영 담당자 업무
          </div>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#356FA5] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>담당자 대시보드</span>
            </div>
          </button>

          <button
            onClick={() => handleNavClick('apply-plan')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'apply-plan'
                ? 'bg-[#356FA5] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <FilePlus className="w-4 h-4 shrink-0" />
              <span>운영계획 신청서 작성</span>
            </div>
          </button>

          <button
            onClick={() => handleNavClick('my-plans')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'my-plans'
                ? 'bg-[#356FA5] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 shrink-0" />
              <span>운영계획 신청 관리</span>
            </div>
            {operatorPlansRequiringRevision > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                보완 {operatorPlansRequiringRevision}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('attendance')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'attendance'
                ? 'bg-[#356FA5] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 shrink-0" />
              <span>참여자 및 출석부</span>
            </div>
          </button>

          <button
            onClick={() => handleNavClick('result-report')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'result-report'
                ? 'bg-[#356FA5] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 shrink-0" />
              <span>운영실적 등록 및 보고</span>
            </div>
          </button>
        </>
      );
    }

    // Admin Navigation
    return (
      <>
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          사업단 총괄 관리
        </div>
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-[#2A8C8C] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>관리자 종합 대시보드</span>
          </div>
        </button>

        <button
          onClick={() => handleNavClick('plan-reviews')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'plan-reviews'
              ? 'bg-[#2A8C8C] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <ClipboardCheck className="w-4 h-4 shrink-0" />
            <span>운영계획 심사 및 승인</span>
          </div>
          {pendingPlanReviews > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">
              {pendingPlanReviews}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNavClick('programs-admin')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'programs-admin'
              ? 'bg-[#2A8C8C] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <FolderKanban className="w-4 h-4 shrink-0" />
            <span>프로그램 통합 관리</span>
          </div>
        </button>

        <button
          onClick={() => handleNavClick('participants')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'participants'
              ? 'bg-[#2A8C8C] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>참여자 및 선발/수료</span>
          </div>
        </button>

        <button
          onClick={() => handleNavClick('result-reviews')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'result-reviews'
              ? 'bg-[#2A8C8C] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <FileCheck className="w-4 h-4 shrink-0" />
            <span>운영실적 심사 및 확정</span>
          </div>
          {pendingResultReviews > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
              {pendingResultReviews}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNavClick('statistics')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'statistics'
              ? 'bg-[#2A8C8C] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <PieChart className="w-4 h-4 shrink-0" />
            <span>성과 및 통계 분석</span>
          </div>
        </button>

        <button
          onClick={() => handleNavClick('notices-admin')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'notices-admin'
              ? 'bg-[#2A8C8C] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>공지사항/게시판 관리</span>
          </div>
        </button>

        <button
          onClick={() => handleNavClick('system')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'system'
              ? 'bg-[#2A8C8C] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 shrink-0" />
            <span>사용자 및 시스템 설정</span>
          </div>
        </button>
      </>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E3E8EF] shrink-0 min-h-[calc(100vh-4rem)] p-4 space-y-1">
        {renderNavLinks()}
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#183153]/30 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white p-4 space-y-1 shadow-xl">
            {renderNavLinks()}
          </div>
        </div>
      )}
    </>
  );
};
