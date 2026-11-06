import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { Program } from '../../types';
import {
  Calendar,
  MapPin,
  Users,
  Award,
  BookOpen,
  User,
  Download,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ProgramDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onOpenApply: (program: Program) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  isOpen,
  onClose,
  program,
  onOpenApply,
}) => {
  const { studentApplications, currentRole, addToast } = useApp();

  if (!program) return null;

  // Check if current student already applied
  const existingApplication = studentApplications.find(
    (a) => a.programId === program.id && a.studentId === 'user-student-01' && a.status !== '취소'
  );

  const isRecruiting = program.status === '모집중';

  const handleDownloadPlan = () => {
    addToast(`"${program.title}" 세부 운영계획서(PDF) 다운로드가 시작되었습니다.`, 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={program.title}
      subtitle={`[${program.category}] 담당: ${program.operatorDepartment} ${program.operatorName}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Status & Key Meta Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#F8FAFC] border border-[#E3E8EF] rounded-xl">
          <div className="flex items-center gap-3">
            <StatusBadge status={program.status} size="md" />
            <span className="text-xs text-slate-500 font-medium">
              모집기간: {program.recruitStartDate} ~ {program.recruitEndDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-teal-50 text-teal-800 border border-teal-200">
              마일리지 {program.mileage}P
            </span>
            <button
              onClick={handleDownloadPlan}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>계획서 다운로드</span>
            </button>
          </div>
        </div>

        {/* 2-Column Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* Schedule & Location */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-[#183153] flex items-center gap-2 text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-blue-600" />
              운영 일정 및 장소
            </h4>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">교육 기간:</span>
                <span className="font-medium text-slate-800">
                  {program.operateStartDate} ~ {program.operateEndDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">교육 장소:</span>
                <span className="font-medium text-slate-800">{program.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">진행 방식:</span>
                <span className="font-medium text-slate-800">{program.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">모집 인원:</span>
                <span className="font-medium text-slate-800">
                  정원 {program.capacity}명 (현재 {program.appliedCount}명 지원)
                </span>
              </div>
            </div>
          </div>

          {/* Instructor & Target */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-[#183153] flex items-center gap-2 text-xs uppercase tracking-wider">
              <User className="w-4 h-4 text-teal-600" />
              강사 및 참여 대상
            </h4>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">초빙 강사:</span>
                <span className="font-medium text-slate-800">
                  {program.instructor.name} ({program.instructor.role})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">소속 기관:</span>
                <span className="font-medium text-slate-800">
                  {program.instructor.organization}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">참여 대상:</span>
                <span className="font-medium text-slate-800 text-right">
                  {program.targetAudience}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Program Description & Objectives */}
        <div className="space-y-3">
          <h4 className="font-bold text-[#183153] text-sm">프로그램 소개 및 목표</h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
            {program.description}
          </p>
        </div>

        {/* Key Competencies */}
        <div>
          <h4 className="font-bold text-[#183153] text-sm mb-2">함양 핵심역량</h4>
          <div className="flex flex-wrap gap-2">
            {program.competencies.map((comp, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full border border-blue-200"
              >
                #{comp}
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Syllabus Table */}
        <div className="space-y-2">
          <h4 className="font-bold text-[#183153] text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-600" />
            회차별 세부 교육과정
          </h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-16 text-center">회차</th>
                  <th className="py-2.5 px-3 w-28">일자/시간</th>
                  <th className="py-2.5 px-4">주제 및 세부 강의 내용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {program.syllabus.map((syl) => (
                  <tr key={syl.session} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {syl.session}회차
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      <div>{syl.date}</div>
                      <div className="text-slate-400">({syl.hours}시간)</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{syl.title}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{syl.content}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benefits & Notes */}
        <div className="p-4 bg-teal-50/50 border border-teal-200/60 rounded-xl space-y-2">
          <h4 className="font-bold text-teal-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600" />
            참여 혜택 및 유의사항
          </h4>
          <ul className="text-xs text-teal-900/80 space-y-1 list-disc list-inside">
            {program.benefits.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
            <li>총 교육시간의 80% 이상 출석 시에만 정식 수료 및 마일리지가 인정됩니다.</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            닫기
          </button>

          {currentRole === 'student' && (
            <div>
              {existingApplication ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    신청 완료 (상태: {existingApplication.status})
                  </span>
                </div>
              ) : isRecruiting ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenApply(program);
                  }}
                  className="px-6 py-2.5 text-xs sm:text-sm font-semibold bg-[#183153] hover:bg-[#183153]/90 text-white rounded-lg transition-all shadow-xs"
                >
                  지금 참여신청하기
                </button>
              ) : (
                <button
                  disabled
                  className="px-5 py-2 text-xs sm:text-sm font-medium bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed"
                >
                  {program.status === '모집예정' ? '모집 대기중' : '모집 마감'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
