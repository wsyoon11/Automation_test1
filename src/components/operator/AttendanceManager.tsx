import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Program, AttendanceStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import {
  Users,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';

interface AttendanceManagerProps {
  initialProgramId?: string;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  initialProgramId,
}) => {
  const { programs, studentApplications, attendanceRecords, markAttendance, addToast } = useApp();

  // Active or approved programs
  const availablePrograms = programs.filter(
    (p) => p.status === '운영중' || p.status === '모집마감' || p.status === '운영종료'
  );

  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    initialProgramId || availablePrograms[0]?.id || ''
  );

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);
  const syllabus = selectedProgram?.syllabus || [];

  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(1);

  // Selected program participants (only those with status '선정' or '이수완료')
  const participants = studentApplications.filter(
    (a) => a.programId === selectedProgramId && (a.status === '선정' || a.status === '이수완료')
  );

  const currentSession = syllabus.find((s) => s.session === selectedSessionIndex);

  // Current session attendance map
  const sessionAttendance = attendanceRecords.filter(
    (r) => r.programId === selectedProgramId && r.sessionIndex === selectedSessionIndex
  );

  const presentCount = sessionAttendance.filter((r) => r.status === '출석').length;
  const lateCount = sessionAttendance.filter((r) => r.status === '지각').length;
  const absentCount = sessionAttendance.filter((r) => r.status === '결석').length;

  const attendanceRate =
    participants.length > 0
      ? Math.round(((presentCount + lateCount * 0.5) / participants.length) * 100)
      : 0;

  const handleStatusChange = (student: typeof participants[0], newStatus: AttendanceStatus) => {
    if (!selectedProgram || !currentSession) return;
    markAttendance(
      selectedProgram.id,
      selectedSessionIndex,
      currentSession.date,
      student.studentId,
      student.studentName,
      student.studentNumber,
      student.department,
      newStatus
    );
  };

  const handleExportCSV = () => {
    if (!selectedProgram) return;

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += `프로그램명,${selectedProgram.title}\n`;
    csvContent += `회차,제 ${selectedSessionIndex}회차 (${currentSession?.date || ''})\n\n`;
    csvContent += '학번,성명,소속학과,학년,연락처,출석상태,비고\n';

    participants.forEach((p) => {
      const rec = sessionAttendance.find((r) => r.studentId === p.studentId);
      const status = rec?.status || '미체크';
      const note = rec?.note || '';
      csvContent += `${p.studentNumber},${p.studentName},${p.department},${p.grade},${p.phone},${status},${note}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${selectedProgram.title}_${selectedSessionIndex}회차_출석부.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('출석부 데이터가 CSV 파일로 정상 다운로드되었습니다.', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Program Selector */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#183153]">
            참여자 명단 및 실시간 출석부 관리
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            강의 및 실습 회차별로 학생들의 출석, 지각, 결석을 기록하고 공식 출석부를 출력합니다.
          </p>
        </div>

        {/* Program Selector Dropdown */}
        <div className="w-full md:w-80">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            관리할 프로그램 선택:
          </label>
          <select
            value={selectedProgramId}
            onChange={(e) => {
              setSelectedProgramId(e.target.value);
              setSelectedSessionIndex(1);
            }}
            className="w-full text-xs sm:text-sm p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:ring-2 focus:ring-[#356FA5]"
          >
            {availablePrograms.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.status}] {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedProgram ? (
        <div className="space-y-6">
          {/* Program Overview & Session Tabs */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedProgram.category}
                </span>
                <h2 className="text-base font-bold text-[#183153] mt-1">
                  {selectedProgram.title}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  장소: {selectedProgram.location} | 강사: {selectedProgram.instructor.name}
                </div>
              </div>

              {/* CSV Export Action */}
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>당일 출석부 CSV 다운로드</span>
              </button>
            </div>

            {/* Session Tabs (회차 선택) */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600">실습 회차 선택:</div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {syllabus.map((s) => (
                  <button
                    key={s.session}
                    onClick={() => setSelectedSessionIndex(s.session)}
                    className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition border ${
                      selectedSessionIndex === s.session
                        ? 'bg-[#183153] text-white border-[#183153] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    제 {s.session}회차 ({s.date})
                  </button>
                ))}
              </div>
            </div>

            {/* Current Session Summary Bar */}
            {currentSession && (
              <div className="p-4 bg-[#F8FAFC] border border-[#E3E8EF] rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#183153]">
                    {currentSession.session}회차: {currentSession.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {currentSession.content} ({currentSession.hours}시간)
                  </div>
                </div>

                {/* Scoreboard */}
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div>
                    <span className="text-slate-500">수강 정원:</span>{' '}
                    <strong className="text-slate-800">{participants.length}명</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700">출석:</span>{' '}
                    <strong className="text-emerald-800 font-mono">{presentCount}</strong>
                  </div>
                  <div>
                    <span className="text-amber-700">지각:</span>{' '}
                    <strong className="text-amber-800 font-mono">{lateCount}</strong>
                  </div>
                  <div>
                    <span className="text-rose-700">결석:</span>{' '}
                    <strong className="text-rose-800 font-mono">{absentCount}</strong>
                  </div>
                  <div className="pl-2 border-l border-slate-200 font-bold text-[#183153]">
                    출석률: <span className="font-mono text-teal-700">{attendanceRate}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Participants Attendance Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-[#183153] text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                선정 참여자 출석 명부 ({participants.length}명)
              </h3>
              <span className="text-[11px] text-slate-500">
                버튼 클릭 시 실시간으로 출석 상태가 반영 및 저장됩니다.
              </span>
            </div>

            {participants.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                선정된 참여 학생이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F8FAFC] text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4 w-28">학번</th>
                      <th className="py-3 px-4 w-24">성명</th>
                      <th className="py-3 px-4">학과 / 학년</th>
                      <th className="py-3 px-4 w-32">연락처</th>
                      <th className="py-3 px-6 w-56 text-center">출석 체크 (선택)</th>
                      <th className="py-3 px-4 w-24 text-center">현재상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {participants.map((student, idx) => {
                      const record = sessionAttendance.find(
                        (r) => r.studentId === student.studentId
                      );
                      const currentStatus = record?.status;

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 text-center font-mono text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                            {student.studentNumber}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#183153]">
                            {student.studentName}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {student.department} ({student.grade}학년)
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500">
                            {student.phone}
                          </td>

                          {/* Quick Attendance Action Buttons */}
                          <td className="py-3 px-6 text-center">
                            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                              <button
                                onClick={() => handleStatusChange(student, '출석')}
                                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                                  currentStatus === '출석'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-emerald-700'
                                }`}
                              >
                                출석
                              </button>
                              <button
                                onClick={() => handleStatusChange(student, '지각')}
                                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                                  currentStatus === '지각'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-amber-700'
                                }`}
                              >
                                지각
                              </button>
                              <button
                                onClick={() => handleStatusChange(student, '결석')}
                                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                                  currentStatus === '결석'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-rose-700'
                                }`}
                              >
                                결석
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            {currentStatus ? (
                              <StatusBadge status={currentStatus} />
                            ) : (
                              <span className="text-[11px] text-slate-400 font-medium">
                                미체크
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-sm">
          관리 가능한 프로그램이 없습니다.
        </div>
      )}
    </div>
  );
};
