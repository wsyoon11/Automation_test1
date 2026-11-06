import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  RotateCcw,
  Menu,
  X,
  Sparkles,
  User,
} from 'lucide-react';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { currentRole, setCurrentRole, currentUser, resetToDemoData } = useApp();

  const handleRoleChange = (role: UserRole) => {
    if (currentRole === role) return;
    setCurrentRole(role);
    setIsMobileMenuOpen(false);
  };

  const handleReset = () => {
    if (window.confirm('데모 데이터를 초기 상태로 복원하시겠습니까? 신청 및 심사 내역이 처음으로 리셋됩니다.')) {
      resetToDemoData();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E3E8EF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#183153] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#183153] tracking-tight text-base sm:text-lg">
                  AI/SW 융합혁신사업단
                </span>
                <span className="hidden xl:inline-block text-[11px] font-medium text-teal-700 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded">
                  비교과 통합관리
                </span>
              </div>
              <p className="text-[11px] text-[#667085] hidden sm:block">
                비교과 프로그램 통합 운영관리 시스템
              </p>
            </div>
          </div>

          {/* Center: Quick Role Switcher (Crucial User Selection) */}
          <div className="hidden md:flex items-center bg-[#F5F7FA] p-1 rounded-lg border border-[#E3E8EF]">
            <span className="text-[11px] font-semibold text-[#667085] px-2.5 whitespace-nowrap">
              역할 전환:
            </span>
            <button
              onClick={() => handleRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentRole === 'student'
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'text-[#263445] hover:text-[#183153] hover:bg-white/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>학생 (Student)</span>
            </button>
            <button
              onClick={() => handleRoleChange('operator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentRole === 'operator'
                  ? 'bg-[#356FA5] text-white shadow-xs'
                  : 'text-[#263445] hover:text-[#356FA5] hover:bg-white/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>운영 담당자 (Operator)</span>
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentRole === 'admin'
                  ? 'bg-[#2A8C8C] text-white shadow-xs'
                  : 'text-[#263445] hover:text-[#2A8C8C] hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>총괄 관리자 (Admin)</span>
            </button>
          </div>

          {/* Right actions: Profile & Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active User Information */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <span className="font-semibold text-slate-800">{currentUser.name}</span>
                <span className="text-slate-500 text-[11px] ml-1.5">
                  ({currentUser.affiliation})
                </span>
              </div>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
              title="초기 샘플 데이터로 복원"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">데모 리셋</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200"
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Quick Role Switcher Strip */}
        <div className="md:hidden py-2 border-t border-slate-100 flex items-center justify-between gap-1">
          <button
            onClick={() => handleRoleChange('student')}
            className={`flex-1 py-1 text-center text-xs font-medium rounded ${
              currentRole === 'student' ? 'bg-[#183153] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            학생
          </button>
          <button
            onClick={() => handleRoleChange('operator')}
            className={`flex-1 py-1 text-center text-xs font-medium rounded ${
              currentRole === 'operator' ? 'bg-[#356FA5] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            담당자
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`flex-1 py-1 text-center text-xs font-medium rounded ${
              currentRole === 'admin' ? 'bg-[#2A8C8C] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            관리자
          </button>
        </div>
      </div>
    </header>
  );
};
