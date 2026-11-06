import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Program, ProgramCategory } from '../../types';
import { Modal } from '../common/Modal';
import {
  FileText,
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';

interface PlanApplicationFormProps {
  initialProgram?: Program | null;
  onFinished: () => void;
}

export const PlanApplicationForm: React.FC<PlanApplicationFormProps> = ({
  initialProgram,
  onFinished,
}) => {
  const { saveOrSubmitProgramPlan, addToast } = useApp();

  const [title, setTitle] = useState(initialProgram?.title || '');
  const [category, setCategory] = useState<ProgramCategory>(
    initialProgram?.category || 'AI·빅데이터'
  );
  const [summary, setSummary] = useState(initialProgram?.summary || '');
  const [description, setDescription] = useState(initialProgram?.description || '');
  const [objectives, setObjectives] = useState(initialProgram?.objectives || '');
  const [targetAudience, setTargetAudience] = useState(
    initialProgram?.targetAudience || 'SW/AI 관련 학과 2~4학년 재학생'
  );
  const [capacity, setCapacity] = useState(initialProgram?.capacity || 30);
  const [method, setMethod] = useState<'대면' | '비대면' | '혼합(블렌디드)'>(
    initialProgram?.method || '대면'
  );
  const [location, setLocation] = useState(initialProgram?.location || 'IT융합관 402호 실습실');

  const [recruitStartDate, setRecruitStartDate] = useState(
    initialProgram?.recruitStartDate || '2026-11-15'
  );
  const [recruitEndDate, setRecruitEndDate] = useState(
    initialProgram?.recruitEndDate || '2026-11-28'
  );
  const [operateStartDate, setOperateStartDate] = useState(
    initialProgram?.operateStartDate || '2026-12-05'
  );
  const [operateEndDate, setOperateEndDate] = useState(
    initialProgram?.operateEndDate || '2026-12-30'
  );

  const [instructorName, setInstructorName] = useState(
    initialProgram?.instructor?.name || '박지훈 수석컨설턴트'
  );
  const [instructorOrg, setInstructorOrg] = useState(
    initialProgram?.instructor?.organization || '카카오 엔터프라이즈'
  );
  const [instructorRole, setInstructorRole] = useState(
    initialProgram?.instructor?.role || '클라우드 인프라 아키텍트'
  );

  const [budget, setBudget] = useState(initialProgram?.budget || 6500000);
  const [mileage, setMileage] = useState(initialProgram?.mileage || 40);

  const [syllabus, setSyllabus] = useState(
    initialProgram?.syllabus || [
      { session: 1, title: '환경설정 및 기본 아키텍처 개요', content: '개발 툴체인 구축 및 오리엔테이션', date: '2026-12-05', hours: 4 },
      { session: 2, title: '도메인 특화 핵심 실무 핸즈온 1', content: '데이터 수집 및 전처리 파이프라인 구축', date: '2026-12-12', hours: 4 },
      { session: 3, title: '도메인 특화 핵심 실무 핸즈온 2', content: '알고리즘 튜닝 및 모델 최적화', date: '2026-12-19', hours: 4 },
      { session: 4, title: '최종 프로젝트 발표 및 코드리뷰', content: '결과물 데모 및 산업체 전문가 평가', date: '2026-12-26', hours: 4 },
    ]
  );

  const [benefitsText, setBenefitsText] = useState(
    initialProgram?.benefits?.join('\n') ||
      '사업단 마일리지 40점 부여\n사업단장 명의 우수 이수증 수여\n클라우드 실습 인프라 전액 지원'
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Syllabus session controls
  const handleAddSession = () => {
    const nextSessionNum = syllabus.length + 1;
    setSyllabus([
      ...syllabus,
      {
        session: nextSessionNum,
        title: `제 ${nextSessionNum}회차 실습 세션`,
        content: '세부 교육 내용 입력',
        date: operateStartDate,
        hours: 4,
      },
    ]);
  };

  const handleRemoveSession = (idx: number) => {
    if (syllabus.length <= 1) {
      addToast('최소 1회차 이상의 교육과정이 필요합니다.', 'warning');
      return;
    }
    const updated = syllabus
      .filter((_, i) => i !== idx)
      .map((item, i) => ({ ...item, session: i + 1 }));
    setSyllabus(updated);
  };

  const handleSessionChange = (idx: number, field: string, val: any) => {
    const updated = [...syllabus];
    updated[idx] = { ...updated[idx], [field]: val };
    setSyllabus(updated);
  };

  const validateForm = () => {
    if (!title.trim()) {
      setErrorMessage('프로그램명을 입력해 주세요.');
      return false;
    }
    if (!summary.trim()) {
      setErrorMessage('프로그램 요약을 입력해 주세요.');
      return false;
    }
    if (!description.trim()) {
      setErrorMessage('프로그램 세부 운영내용을 입력해 주세요.');
      return false;
    }
    if (!objectives.trim()) {
      setErrorMessage('운영 목적 및 기대효과를 입력해 주세요.');
      return false;
    }
    if (!instructorName.trim()) {
      setErrorMessage('강사 성명을 입력해 주세요.');
      return false;
    }
    if (budget <= 0) {
      setErrorMessage('소요 예산액을 올바르게 입력해 주세요.');
      return false;
    }
    return true;
  };

  const handleSave = (isSubmit: boolean) => {
    setErrorMessage('');
    if (isSubmit && !validateForm()) {
      return;
    }

    const benefits = benefitsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const planData: Partial<Program> = {
      id: initialProgram?.id,
      title: title.trim(),
      category,
      summary: summary.trim(),
      description: description.trim(),
      objectives: objectives.trim(),
      targetAudience: targetAudience.trim(),
      capacity: Number(capacity),
      method,
      location: location.trim(),
      recruitStartDate,
      recruitEndDate,
      operateStartDate,
      operateEndDate,
      instructor: {
        name: instructorName.trim(),
        organization: instructorOrg.trim(),
        role: instructorRole.trim(),
      },
      budget: Number(budget),
      mileage: Number(mileage),
      syllabus,
      benefits,
    };

    saveOrSubmitProgramPlan(planData, isSubmit);
    onFinished();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Page Title & Status */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
              {initialProgram ? '운영계획서 수정 및 보완' : '신규 비교과 운영계획서 신청'}
            </h1>
            {initialProgram && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                상태: {initialProgram.planStatus}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            신규 비교과 교육과정의 운영 목적, 예산, 세부 커리큘럼을 작성하여 사업단에 심사를 요청합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>미리보기</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>임시저장</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-[#356FA5] hover:bg-[#2e6293] text-white rounded-lg transition shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{initialProgram?.planStatus === '보완요청' ? '보완 후 재제출' : '최종 제출'}</span>
          </button>
        </div>
      </div>

      {/* Admin Review Feedback Box if revision requested */}
      {initialProgram?.planStatus === '보완요청' && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-1.5 text-xs text-amber-900">
          <div className="font-bold flex items-center gap-2 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>관리자 보완 요청 의견</span>
          </div>
          <p className="p-3 bg-white rounded-lg border border-amber-200 leading-relaxed">
            {initialProgram.reviewComment || '지적된 항목을 충실히 보완하여 재제출 바랍니다.'}
          </p>
          <p className="text-[11px] text-amber-700 mt-1">
            * 검토 의견을 반영하여 내용을 수정한 후 [보완 후 재제출] 버튼을 클릭하세요.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 text-xs sm:text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: 기본 정보 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-[#183153] text-sm border-b border-slate-100 pb-2">
          1. 프로그램 기본 정보
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              프로그램명 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 실무형 온디바이스 AI 경량화 배포 프로젝트"
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              프로그램 분야 <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProgramCategory)}
              className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden bg-white"
            >
              <option value="AI·빅데이터">AI·빅데이터</option>
              <option value="클라우드·SW">클라우드·SW</option>
              <option value="산학연계 프로젝트">산학연계 프로젝트</option>
              <option value="취·창업 실무">취·창업 실무</option>
              <option value="글로벌·자격증">글로벌·자격증</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            프로그램 한 줄 요약 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="학생 목록 및 포털 카드에 노출될 핵심 요약 문구"
            className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              운영 목적 및 교육 목표 <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="본 비교과 과정을 개설하게 된 배경과 학생들의 기대 성과"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              세부 운영 내용 <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="구체적인 실습 툴, 프로젝트 주제, 평가 방식 등"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: 대상, 정원, 운영 방식 및 일정 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-[#183153] text-sm border-b border-slate-100 pb-2">
          2. 대상, 일정 및 장소 정보
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              참여 대상 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="예: 컴퓨터/SW/인공지능 재학생"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              모집 정원 (명) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={5}
              max={200}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              진행 방식 <span className="text-rose-500">*</span>
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden bg-white"
            >
              <option value="대면">대면 (오프라인 실습)</option>
              <option value="비대면">비대면 (온라인 화상/원격)</option>
              <option value="혼합(블렌디드)">혼합 (대면 + 온라인 블렌디드)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              운영 장소 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: IT융합관 402호 AI실습실"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                모집 시작일
              </label>
              <input
                type="date"
                value={recruitStartDate}
                onChange={(e) => setRecruitStartDate(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                모집 마감일
              </label>
              <input
                type="date"
                value={recruitEndDate}
                onChange={(e) => setRecruitEndDate(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              교육 운영 시작일
            </label>
            <input
              type="date"
              value={operateStartDate}
              onChange={(e) => setOperateStartDate(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              교육 운영 종료일
            </label>
            <input
              type="date"
              value={operateEndDate}
              onChange={(e) => setOperateEndDate(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: 강사 및 예산/마일리지 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-[#183153] text-sm border-b border-slate-100 pb-2">
          3. 강사 정보 및 소요 예산
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              강사 성명 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder="예: 김현수 수석"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              소속 기관/기업 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={instructorOrg}
              onChange={(e) => setInstructorOrg(e.target.value)}
              placeholder="예: 삼성전자 연구소"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              직급 / 전문분야
            </label>
            <input
              type="text"
              value={instructorRole}
              onChange={(e) => setInstructorRole(e.target.value)}
              placeholder="예: AI 모델링 전문가"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              소요 예산 (원, VAT 포함) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step={100000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
            />
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {(budget || 0).toLocaleString()} 원
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              부여 역량 마일리지 (Point) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={10}
              max={100}
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
            />
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              권장: 20시간 미만(30P), 20~40시간(50P), 40시간 이상 프로젝트(80P)
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            참여 혜택 (줄바꿈으로 구분)
          </label>
          <textarea
            rows={3}
            value={benefitsText}
            onChange={(e) => setBenefitsText(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
          />
        </div>
      </div>

      {/* SECTION 4: 회차별 실습 커리큘럼 (Syllabus) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-bold text-[#183153] text-sm">
            4. 회차별 세부 운영 일정 및 강의 계획
          </h3>
          <button
            type="button"
            onClick={handleAddSession}
            className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>회차 추가</span>
          </button>
        </div>

        <div className="space-y-3">
          {syllabus.map((syl, idx) => (
            <div
              key={syl.session}
              className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#183153]">{syl.session}회차</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSession(idx)}
                  className="text-slate-400 hover:text-rose-600 transition"
                  title="회차 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={syl.title}
                    onChange={(e) => handleSessionChange(idx, 'title', e.target.value)}
                    placeholder="강의 주제"
                    className="w-full p-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={syl.date}
                    onChange={(e) => handleSessionChange(idx, 'date', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white font-mono"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={syl.hours}
                    onChange={(e) => handleSessionChange(idx, 'hours', Number(e.target.value))}
                    placeholder="교육시간"
                    className="w-full p-2 border border-slate-300 rounded bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={syl.content}
                  onChange={(e) => handleSessionChange(idx, 'content', e.target.value)}
                  placeholder="세부 실습 및 강의 내용"
                  className="w-full p-2 border border-slate-300 rounded bg-white text-[11px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onFinished}
          className="px-5 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
        >
          취소하고 목록으로
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition"
          >
            임시저장
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-6 py-2 text-xs sm:text-sm font-semibold bg-[#356FA5] hover:bg-[#2e6293] text-white rounded-lg transition shadow-xs"
          >
            {initialProgram?.planStatus === '보완요청' ? '보완 후 재제출' : '최종 제출'}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`[미리보기] ${title || '제목 미정'}`}
          subtitle={`분야: ${category} | 정원: ${capacity}명 | 예산: ${(budget || 0).toLocaleString()}원`}
          maxWidth="3xl"
        >
          <div className="space-y-4 text-xs text-slate-800">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h4 className="font-bold text-[#183153]">운영 개요 및 요약</h4>
              <p>{summary || '요약이 입력되지 않았습니다.'}</p>
              <h4 className="font-bold text-[#183153] pt-2">운영 목적</h4>
              <p>{objectives || '목적이 입력되지 않았습니다.'}</p>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700">커리큘럼 일정</div>
              <div className="divide-y divide-slate-100">
                {syllabus.map((s) => (
                  <div key={s.session} className="p-3 flex justify-between">
                    <div>
                      <strong className="text-[#183153]">{s.session}회차:</strong> {s.title}
                      <p className="text-[11px] text-slate-500">{s.content}</p>
                    </div>
                    <div className="text-right text-[11px] font-mono text-slate-500">
                      {s.date} ({s.hours}시간)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-[#183153] text-white font-semibold rounded-lg text-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
