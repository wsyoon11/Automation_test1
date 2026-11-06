import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentAppStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import {
  UserCheck,
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  XCircle,
  Award,
} from 'lucide-react';

export const ParticipantManager: React.FC = () => {
  const { studentApplications, programs, updateStudentAppStatus, addToast } = useApp();

  const [selectedProgramId, setSelectedProgramId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);

  const filteredApps = studentApplications.filter((app) => {
    if (selectedProgramId !== 'ALL' && app.programId !== selectedProgramId) return false;
    if (selectedStatus !== 'ALL' && app.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.studentName.toLowerCase().includes(q) ||
        app.studentNumber.includes(q) ||
        app.department.toLowerCase().includes(q) ||
        app.programTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppIds(filteredApps.map((a) => a.id));
    } else {
      setSelectedAppIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedAppIds.includes(id)) {
      setSelectedAppIds(selectedAppIds.filter((i) => i !== id));
    } else {
      setSelectedAppIds([...selectedAppIds, id]);
    }
  };

  const handleBulkStatusChange = (newStatus: StudentAppStatus) => {
    if (selectedAppIds.length === 0) {
      addToast('선택된 학생이 없습니다.', 'warning');
      return;
    }

    selectedAppIds.forEach((id) => {
      updateStudentAppStatus(id, newStatus);
    });

    addToast(`선택한 ${selectedAppIds.length}명의 상태가 [${newStatus}]로 일괄 변경되었습니다.`, 'success');
    setSelectedAppIds([]);
  };

  const handleExportCSV = () => {
    let csv = 'data:text/csv;charset=utf-8,\uFEFF';
    csv += '학번,성명,소속학과,학년,연락처,이메일,신청프로그램,선발상태,신청일시\n';

    filteredApps.forEach((a) => {
      csv += `${a.studentNumber},${a.studentName},${a.department},${a.grade},${a.phone},${a.email},"${a.programTitle}",${a.status},${a.appliedAt}\n`;
    });

    const uri = encodeURI(csv);
    const link = document.createElement('a');
    link.href = uri;
    link.download = `사업단_참여자명단_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('참여자 데이터가 CSV로 다운로드되었습니다.', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
            참여자 및 선발·수료 종합 관리
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            프로그램별 학생 참여 신청 내역을 조회하고 선발(선정/대기) 및 최종 수료 처리를 일괄 수행합니다.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition shadow-xs shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>참여자 전체 엑셀(CSV) 다운로드</span>
        </button>
      </div>

      {/* Filter and Bulk Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Program filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">전체 프로그램</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
            {['ALL', '선정', '대기', '이수완료', '취소'].map((st) => (
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

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="학생명, 학번, 학과 검색..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#356FA5]"
            />
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedAppIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs">
            <span className="font-semibold text-blue-900">
              선택된 학생: {selectedAppIds.length}명
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleBulkStatusChange('선정')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition"
              >
                일괄 [선정]
              </button>
              <button
                onClick={() => handleBulkStatusChange('대기')}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition"
              >
                일괄 [대기]
              </button>
              <button
                onClick={() => handleBulkStatusChange('이수완료')}
                className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded font-medium transition"
              >
                일괄 [이수완료]
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredApps.length > 0 && selectedAppIds.length === filteredApps.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#183153]"
                  />
                </th>
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-4 w-28">학번</th>
                <th className="py-3 px-4 w-24">성명</th>
                <th className="py-3 px-4">학과 / 학년</th>
                <th className="py-3 px-4 w-32">연락처</th>
                <th className="py-3 px-6">신청 프로그램명</th>
                <th className="py-3 px-4 w-24 text-center">선발상태</th>
                <th className="py-3 px-4 w-32 text-center">상태 변경</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    조회된 신청자가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app, idx) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedAppIds.includes(app.id)}
                        onChange={() => handleToggleSelect(app.id)}
                        className="rounded border-slate-300 text-[#183153]"
                      />
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {app.studentNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#183153]">{app.studentName}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {app.department} ({app.grade}학년)
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{app.phone}</td>
                    <td className="py-3 px-6 font-medium text-slate-900 line-clamp-1">
                      {app.programTitle}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateStudentAppStatus(app.id, e.target.value as StudentAppStatus)
                        }
                        className="text-[11px] p-1 border border-slate-300 rounded bg-white text-slate-700"
                      >
                        <option value="신청완료">신청완료</option>
                        <option value="선정">선정</option>
                        <option value="대기">대기</option>
                        <option value="이수완료">이수완료</option>
                        <option value="미이수">미이수</option>
                        <option value="취소">취소</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
