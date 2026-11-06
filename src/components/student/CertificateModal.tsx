import React from 'react';
import { Modal } from '../common/Modal';
import { StudentApplication, Program } from '../../types';
import { Printer, Award } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: StudentApplication | null;
  program?: Program;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  application,
  program,
}) => {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="비교과 프로그램 이수증" maxWidth="3xl">
      <div className="space-y-6">
        {/* Printable Certificate Sheet */}
        <div className="printable-area border-8 border-double border-[#183153] p-8 sm:p-12 bg-[#FCFDFD] text-center relative shadow-sm">
          {/* Top Decorative Border Marker */}
          <div className="absolute top-4 left-4 text-xs font-serif text-slate-400">
            제 {application.completionNumber || 'AISW-2026-0042'} 호
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-[#183153]/10 flex items-center justify-center text-[#183153]">
              <Award className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183153] tracking-wider mb-8 font-serif">
            이 수 증 (CERTIFICATE)
          </h2>

          <div className="max-w-md mx-auto text-left space-y-2 mb-8 text-sm sm:text-base text-slate-800">
            <div className="flex">
              <span className="w-24 font-semibold text-slate-500">성 명:</span>
              <span className="font-bold">{application.studentName}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-semibold text-slate-500">학 번:</span>
              <span>{application.studentNumber}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-semibold text-slate-500">소 속:</span>
              <span>{application.department} ({application.grade}학년)</span>
            </div>
            <div className="flex">
              <span className="w-24 font-semibold text-slate-500">프로그램:</span>
              <span className="font-bold text-[#183153]">{application.programTitle}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-semibold text-slate-500">이수시간:</span>
              <span>총 {application.totalHours || 25} 시간 (출석률 100%)</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif max-w-xl mx-auto mb-10">
            위 학생은 AI/SW 융합혁신사업단에서 주관한 상기 비교과 프로그램의 전 교육과정을 성실히 이수하였으므로 본 이수증을 수여합니다.
          </p>

          <div className="mt-8 text-sm text-slate-600 font-medium">
            2026년 10월 28일
          </div>

          {/* Official Signatory & Seal */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#183153] font-serif">
              AI/SW 융합혁신사업단장
            </span>
            <div className="w-12 h-12 rounded-full border-2 border-red-600 flex items-center justify-center text-red-600 text-[10px] font-bold rotate-[-12deg] tracking-tighter">
              사업단장<br />직인
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-[#183153] text-white hover:bg-[#183153]/90 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>이수증 인쇄 / PDF 저장</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
