import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Program, ProgramStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  FolderKanban,
  Search,
  Plus,
  Trash2,
  Calendar,
  Users,
  Edit,
  ExternalLink,
} from 'lucide-react';

interface ProgramAdminListProps {
  onSelectProgram: (prog: Program) => void;
  onAddNewProgram: () => void;
}

export const ProgramAdminList: React.FC<ProgramAdminListProps> = ({
  onSelectProgram,
  onAddNewProgram,
}) => {
  const { programs, deleteProgram, saveOrSubmitProgramPlan, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filtered = programs.filter((p) => {
    if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.operatorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (prog: Program, newStatus: ProgramStatus) => {
    saveOrSubmitProgramPlan({ ...prog, status: newStatus }, true);
    addToast(`"${prog.title}" 운영상태가 [${newStatus}]로 변경되었습니다.`, 'info');
  };

  const handleDelete = (prog: Program) => {
    if (
      window.confirm(
        `"${prog.title}" 프로그램을 시스템에서 영구 삭제하시겠습니까? 관련 신청 데이터에 영향이 있을 수 있습니다.`
      )
    ) {
      deleteProgram(prog.id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
            프로그램 통합 등록 및 상태 관리
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            사업단의 모든 비교과 프로그램을 조회하고 모집 상태(모집예정, 모집중, 운영중, 운영종료)를 수동 전환합니다.
          </p>
        </div>

        <button
          onClick={onAddNewProgram}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#183153] hover:bg-[#183153]/90 text-white text-xs sm:text-sm font-semibold rounded-lg transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>신규 프로그램 등록</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', '모집예정', '모집중', '모집마감', '운영중', '운영종료'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedStatus === st
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? '전체 상태' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="프로그램명, 담당자 검색..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Program Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-24 text-center">운영상태</th>
                <th className="py-3 px-4 w-28">분야</th>
                <th className="py-3 px-6">프로그램명</th>
                <th className="py-3 px-4 w-32">담당자 / 소속</th>
                <th className="py-3 px-4 w-28 text-center">모집현황</th>
                <th className="py-3 px-4 w-36 text-center">상태 즉시 변경</th>
                <th className="py-3 px-4 w-20 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prog, idx) => (
                <tr key={prog.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={prog.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{prog.category}</td>
                  <td className="py-3.5 px-6">
                    <div
                      onClick={() => onSelectProgram(prog)}
                      className="font-bold text-slate-900 hover:text-[#183153] cursor-pointer line-clamp-1"
                    >
                      {prog.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      교육기간: {prog.operateStartDate} ~ {prog.operateEndDate} | {prog.location}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{prog.operatorName}</div>
                    <div className="text-[11px] text-slate-400">
                      {prog.operatorDepartment}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="font-bold text-[#183153]">{prog.appliedCount}</span> /{' '}
                    {prog.capacity}명
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <select
                      value={prog.status}
                      onChange={(e) => handleStatusChange(prog, e.target.value as ProgramStatus)}
                      className="text-[11px] p-1 border border-slate-300 rounded bg-white font-medium text-slate-700 focus:ring-1 focus:ring-[#356FA5]"
                    >
                      <option value="모집예정">모집예정</option>
                      <option value="모집중">모집중</option>
                      <option value="모집마감">모집마감</option>
                      <option value="운영중">운영중</option>
                      <option value="운영종료">운영종료</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDelete(prog)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                      title="프로그램 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
