import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Shield,
  Download,
  Upload,
  RotateCcw,
  History,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileCode,
} from 'lucide-react';

export const UserAndSystemManager: React.FC = () => {
  const { auditLogs, resetToDemoData, exportDataAsJson, importDataFromJson, addToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [auditFilter, setAuditFilter] = useState('');

  const filteredLogs = auditLogs.filter((l) => {
    if (!auditFilter) return true;
    const q = auditFilter.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.target.toLowerCase().includes(q) ||
      l.actorName.toLowerCase().includes(q)
    );
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDataFromJson(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
          사용자 권한 및 시스템 환경 설정
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          사업단 공통 정책, 백업 및 복원, 보안 감사 이력을 종합 관리합니다.
        </p>
      </div>

      {/* 2-Column System Settings & Backup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Group Basic Config */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-[#183153] text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Settings className="w-4 h-4 text-blue-600" />
            사업단 기본 환경 설정
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">사업단 공식 명칭</span>
              <input
                type="text"
                readOnly
                value="AI/SW 융합혁신사업단 (디지털 신기술 및 실무 프로젝트 중심)"
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block mb-0.5">기준 운영연도 / 학기</span>
                <input
                  type="text"
                  readOnly
                  value="2026학년도 2학기"
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                />
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">최소 수료 출석 기준율</span>
                <input
                  type="text"
                  readOnly
                  value="총 수업시간의 80% 이상"
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                />
              </div>
            </div>

            <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-lg text-teal-900 leading-relaxed text-[11px]">
              <strong>💡 시스템 정책 안내:</strong> 본 시스템은 프론트엔드 반응형 프로토타입 상태이며, LocalStorage를 통해 신청, 출석, 심사 및 실적보고 데이터가 영구 보존됩니다.
            </div>
          </div>
        </div>

        {/* Data Backup, Export & Reset */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-[#183153] text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            데이터 백업 및 초기화 정책
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">전체 데이터 JSON 내보내기</div>
                <div className="text-[11px] text-slate-500">
                  프로그램, 신청자, 출석부, 실적보고서를 백업 파일로 저장합니다.
                </div>
              </div>
              <button
                onClick={exportDataAsJson}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#183153] text-white rounded-lg hover:bg-[#183153]/90 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>백업</span>
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">백업 파일 불러오기 및 복원</div>
                <div className="text-[11px] text-slate-500">
                  이전에 저장한 JSON 백업 파일로 시스템 상태를 복원합니다.
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>복원</span>
              </button>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-rose-900">시스템 원본 데모 데이터 리셋</div>
                <div className="text-[11px] text-rose-700">
                  모든 변경사항을 지우고 초기 완성형 데모 데이터로 복원합니다.
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('초기 데모 데이터로 복원하시겠습니까?')) {
                    resetToDemoData();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>초기화</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log / Activity Trail */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <h3 className="font-bold text-[#183153] text-sm">
              시스템 활동 및 변경 감사 이력 (Audit Logs)
            </h3>
          </div>

          <input
            type="text"
            value={auditFilter}
            onChange={(e) => setAuditFilter(e.target.value)}
            placeholder="활동 내역, 사용자 검색..."
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 w-40">일시</th>
                <th className="py-2.5 px-4 w-36">수행자</th>
                <th className="py-2.5 px-4 w-32">활동 구분</th>
                <th className="py-2.5 px-6">대상 프로그램 / 내역</th>
                <th className="py-2.5 px-6">세부 정보</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 text-slate-400 font-normal">{log.timestamp}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">{log.actorName}</td>
                  <td className="py-2.5 px-4">
                    <span className="font-sans px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-6 font-sans font-medium text-slate-900">
                    {log.target}
                  </td>
                  <td className="py-2.5 px-6 font-sans text-slate-500 text-[11px]">
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
