import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Program } from '../../types';
import { Shield, CheckSquare, AlertCircle } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  program,
}) => {
  const { currentUser, applyForProgram } = useApp();

  const [motivation, setMotivation] = useState('');
  const [priorKnowledge, setPriorKnowledge] = useState('');
  const [consent, setConsent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!program) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!motivation.trim()) {
      setErrorMessage('지원 동기 및 학습 목표를 입력해 주세요.');
      return;
    }

    if (motivation.trim().length < 20) {
      setErrorMessage('지원 동기는 최소 20자 이상 구체적으로 작성해 주세요.');
      return;
    }

    if (!consent) {
      setErrorMessage('개인정보 수집 및 이용에 동의하셔야 신청이 가능합니다.');
      return;
    }

    const success = applyForProgram({
      programId: program.id,
      motivation: motivation.trim(),
      priorKnowledge: priorKnowledge.trim(),
    });

    if (success) {
      setMotivation('');
      setPriorKnowledge('');
      setConsent(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="비교과 프로그램 참여신청"
      subtitle={program.title}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Callout */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Program Key Summary Box */}
        <div className="p-4 bg-[#F5F7FA] border border-[#E3E8EF] rounded-xl text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">프로그램 분야:</span>
            <span className="font-semibold text-slate-800">{program.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">운영 기간:</span>
            <span className="font-medium text-slate-800">
              {program.operateStartDate} ~ {program.operateEndDate}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">모집 현황:</span>
            <span className="font-medium text-slate-800">
              정원 {program.capacity}명 (현재 {program.appliedCount}명 접수)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">부여 마일리지:</span>
            <span className="font-bold text-teal-700">{program.mileage} Point</span>
          </div>
        </div>

        {/* Student Information (Read-only verified profile) */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            신청자 기본정보 (학적 연동)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px]">성명</span>
              <span className="font-semibold text-slate-800">{currentUser.name}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px]">학번</span>
              <span className="font-semibold text-slate-800">{currentUser.studentNumber}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px]">학과 / 학년</span>
              <span className="font-semibold text-slate-800">
                {currentUser.affiliation} / {currentUser.grade}학년
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px]">연락처 / 이메일</span>
              <span className="font-semibold text-slate-800">
                {currentUser.phone} · {currentUser.email}
              </span>
            </div>
          </div>
        </div>

        {/* Application Questions */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              지원 동기 및 학습 목표 <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="본 프로그램에 지원하게 된 계기와 향후 진로 및 학습에 어떻게 활용할 계획인지 구체적으로 작성해 주세요 (최소 20자 이상)."
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#356FA5] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              선수 지식 및 관련 경험 (선택)
            </label>
            <input
              type="text"
              value={priorKnowledge}
              onChange={(e) => setPriorKnowledge(e.target.value)}
              placeholder="예: 파이썬 기초 문법, 딥러닝 개론 수강, Git 사용 경험 등"
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#356FA5] focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Privacy Consent Agreement */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#183153]">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>개인정보 수집 및 이용 동의 (필수)</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            AI/SW 융합혁신사업단은 비교과 프로그램 참가자 선발, 출석 확인, 수료증 발급 및 장학 마일리지 지급 관리를 위해 상기 학적 정보를 수집·이용합니다. 수집된 정보는 관련 규정에 따라 프로그램 종료 및 사업단 평가 완료 시까지 보관됩니다.
          </p>
          <label className="flex items-center gap-2 pt-1 text-xs text-slate-800 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-4 h-4 text-[#183153] rounded border-slate-300 focus:ring-[#183153]"
            />
            <span className="font-medium">위 개인정보 수집 및 이용 안내에 동의합니다.</span>
          </label>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold bg-[#183153] text-white hover:bg-[#183153]/90 rounded-lg transition-colors shadow-xs"
          >
            <CheckSquare className="w-4 h-4" />
            <span>참여신청서 제출</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
