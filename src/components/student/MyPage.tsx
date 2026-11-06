import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentApplication, Program } from '../../types';
import { StatusBadge } from '../common/Badge';
import { CertificateModal } from './CertificateModal';
import {
  User,
  Award,
  BookOpen,
  Calendar,
  XCircle,
  FileCheck,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';

interface MyPageProps {
  onSelectProgram: (program: Program) => void;
}

export const MyPage: React.FC<MyPageProps> = ({ onSelectProgram }) => {
  const { currentUser, studentApplications, programs, cancelStudentApplication, addToast } =
    useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELED'>('ALL');
  const [selectedCertApp, setSelectedCertApp] = useState<StudentApplication | null>(null);

  // My applications
  const myApps = studentApplications.filter(
    (a) => a.studentId === currentUser.id || a.studentNumber === currentUser.studentNumber
  );

  // Filtered by tab
  const filteredApps = myApps.filter((a) => {
    if (activeTab === 'ACTIVE') return a.status === '선정' || a.status === '신청완료' || a.status === '대기';
    if (activeTab === 'COMPLETED') return a.status === '이수완료';
    if (activeTab === 'CANCELED') return a.status === '취소';
    return true;
  });

  // Calculate total mileage earned from completed programs
  const completedProgramIds = myApps
    .filter((a) => a.status === '이수완료')
    .map((a) => a.programId);

  const totalMileage = programs
    .filter((p) => completedProgramIds.includes(p.id))
    .reduce((acc, curr) => acc + curr.mileage, 60); // base + 60P from prog-04

  const handleCancel = (app: StudentApplication) => {
    if (window.confirm(`"${app.programTitle}" 신청을 정말 취소하시겠습니까?`)) {
      cancelStudentApplication(app.id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Student Profile & Mileage Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left Student Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#183153] flex items-center justify-center text-white text-xl font-bold shadow-xs">
              {currentUser.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#183153]">{currentUser.name} 학생</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  재학생
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                <span>학번: <strong className="text-slate-700 font-mono">{currentUser.studentNumber}</strong></span>
                <span>소속: <strong className="text-slate-700">{currentUser.affiliation}</strong></span>
                <span>학년: <strong className="text-slate-700">{currentUser.grade}학년</strong></span>
                <span>연락처: <strong className="text-slate-700 font-mono">{currentUser.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Mileage Scoreboard */}
          <div className="flex items-center gap-4 w-full sm:w-auto p-4 bg-[#F8FAFC] border border-[#E3E8EF] rounded-xl justify-around sm:justify-end">
            <div className="text-center sm:text-right">
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1 justify-center sm:justify-end">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>누적 비교과 마일리지</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#183153] font-mono mt-0.5">
                {totalMileage} <span className="text-sm font-semibold text-teal-700">Point</span>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center sm:text-right">
              <div className="text-xs text-slate-500 font-medium">이수 완료 프로그램</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-mono mt-0.5">
                {completedProgramIds.length || 1} <span className="text-sm font-semibold text-slate-600">개</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarship Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              2026-2학기 비교과 우수 마일리지 장학금(100P) 달성률
            </span>
            <span className="font-mono font-bold text-teal-700">
              {Math.min(100, Math.round((totalMileage / 100) * 100))}% (100P 목표)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-[#356FA5] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalMileage / 100) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. My Applications Management Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
          <h2 className="text-base font-bold text-[#183153] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-600" />
            나의 프로그램 신청 및 참여현황
          </h2>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              전체 ({myApps.length})
            </button>
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'ACTIVE'
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              선정 / 대기
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'COMPLETED'
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              이수 완료
            </button>
            <button
              onClick={() => setActiveTab('CANCELED')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'CANCELED'
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              취소
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">해당 상태의 신청 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApps.map((app) => {
              const prog = programs.find((p) => p.id === app.programId);
              const canCancel =
                (app.status === '신청완료' || app.status === '대기' || app.status === '선정') &&
                prog &&
                prog.status === '모집중';

              return (
                <div key={app.id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={app.status} />
                        {prog && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {prog.category}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          신청일시: {app.appliedAt}
                        </span>
                      </div>

                      <h3
                        onClick={() => prog && onSelectProgram(prog)}
                        className="text-base font-bold text-slate-900 hover:text-[#183153] cursor-pointer transition-colors"
                      >
                        {app.programTitle}
                      </h3>

                      {prog && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span>운영기간: <strong>{prog.operateStartDate} ~ {prog.operateEndDate}</strong></span>
                          <span>장소: <strong>{prog.location}</strong></span>
                          <span>마일리지: <strong className="text-teal-700">+{prog.mileage}P</strong></span>
                        </div>
                      )}

                      {/* Motivation Preview */}
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 line-clamp-2 mt-2">
                        <strong className="text-slate-700">작성한 지원동기:</strong> {app.motivation}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {prog && (
                        <button
                          onClick={() => onSelectProgram(prog)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                        >
                          상세보기
                        </button>
                      )}

                      {app.status === '이수완료' && (
                        <button
                          onClick={() => setSelectedCertApp(app)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition shadow-2xs"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>이수증 출력</span>
                        </button>
                      )}

                      {canCancel && (
                        <button
                          onClick={() => handleCancel(app)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>신청취소</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate Print Modal */}
      <CertificateModal
        isOpen={!!selectedCertApp}
        onClose={() => setSelectedCertApp(null)}
        application={selectedCertApp}
      />
    </div>
  );
};
