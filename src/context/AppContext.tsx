import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Program,
  StudentApplication,
  AttendanceRecord,
  ResultReport,
  Notice,
  FAQ,
  AuditLog,
  ToastMessage,
  AttendanceStatus,
  StudentAppStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROGRAMS,
  INITIAL_STUDENT_APPLICATIONS,
  INITIAL_ATTENDANCE,
  INITIAL_REPORTS,
  INITIAL_NOTICES,
  INITIAL_FAQS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Entities
  programs: Program[];
  studentApplications: StudentApplication[];
  attendanceRecords: AttendanceRecord[];
  resultReports: ResultReport[];
  notices: Notice[];
  faqs: FAQ[];
  auditLogs: AuditLog[];
  toasts: ToastMessage[];
  
  // Navigation & Detail Modals
  selectedProgram: Program | null;
  setSelectedProgram: (prog: Program | null) => void;
  
  // Toast
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  // Student Actions
  applyForProgram: (input: {
    programId: string;
    motivation: string;
    priorKnowledge: string;
  }) => boolean;
  cancelStudentApplication: (appId: string) => void;
  
  // Operator Actions
  saveOrSubmitProgramPlan: (plan: Partial<Program>, isSubmit: boolean) => void;
  markAttendance: (
    programId: string,
    sessionIndex: number,
    sessionDate: string,
    studentId: string,
    studentName: string,
    studentNumber: string,
    department: string,
    status: AttendanceStatus,
    note?: string
  ) => void;
  saveOrSubmitResultReport: (report: Partial<ResultReport>, isSubmit: boolean) => void;
  
  // Admin Actions
  reviewProgramPlan: (
    programId: string,
    decision: '승인완료' | '보완요청' | '반려',
    comment: string
  ) => void;
  reviewResultReport: (
    reportId: string,
    decision: '승인완료' | '보완요청',
    comment: string
  ) => void;
  updateStudentAppStatus: (appId: string, status: StudentAppStatus) => void;
  deleteProgram: (programId: string) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt' | 'viewCount'>) => void;
  deleteNotice: (noticeId: string) => void;
  
  // System Tools
  resetToDemoData: () => void;
  exportDataAsJson: () => void;
  importDataFromJson: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'aisw_extracurricular_role',
  PROGRAMS: 'aisw_extracurricular_programs',
  STUDENT_APPS: 'aisw_extracurricular_student_apps',
  ATTENDANCE: 'aisw_extracurricular_attendance',
  REPORTS: 'aisw_extracurricular_reports',
  NOTICES: 'aisw_extracurricular_notices',
  FAQS: 'aisw_extracurricular_faqs',
  AUDIT_LOGS: 'aisw_extracurricular_audit_logs',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current active role
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'student';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Data states with LocalStorage persistence
  const [programs, setPrograms] = useState<Program[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [studentApplications, setStudentApplications] = useState<StudentApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_APPS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_APPLICATIONS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [resultReports, setResultReports] = useState<ResultReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [faqs] = useState<FAQ[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENT_APPS, JSON.stringify(studentApplications));
  }, [studentApplications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(resultReports));
  }, [resultReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Current simulated user
  const currentUser = INITIAL_USERS[currentRole];

  // Role switcher helper: also resets default active tab appropriately
  const setCurrentRole = (newRole: UserRole) => {
    setCurrentRoleState(newRole);
    if (newRole === 'student') setActiveTab('home');
    else if (newRole === 'operator') setActiveTab('dashboard');
    else if (newRole === 'admin') setActiveTab('dashboard');
    addToast(`${newRole === 'student' ? '학생' : newRole === 'operator' ? '운영 담당자' : '총괄 관리자'} 화면으로 전환되었습니다.`, 'info');
  };

  // Toast Helper
  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = (action: string, target: string, details?: string) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp,
      actorName: `${currentUser.name} (${currentRole === 'student' ? '학생' : currentRole === 'operator' ? '담당자' : '관리자'})`,
      actorRole: currentRole,
      action,
      target,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Student Actions
  const applyForProgram = ({
    programId,
    motivation,
    priorKnowledge,
  }: {
    programId: string;
    motivation: string;
    priorKnowledge: string;
  }): boolean => {
    const prog = programs.find((p) => p.id === programId);
    if (!prog) {
      addToast('프로그램 정보를 찾을 수 없습니다.', 'error');
      return false;
    }

    // Check duplicate
    const existing = studentApplications.find(
      (a) => a.programId === programId && a.studentId === currentUser.id && a.status !== '취소'
    );
    if (existing) {
      addToast('이미 신청하였거나 승인된 프로그램입니다.', 'warning');
      return false;
    }

    const now = new Date();
    const appliedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newApp: StudentApplication = {
      id: `app-st-${Date.now()}`,
      programId: prog.id,
      programTitle: prog.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNumber: currentUser.studentNumber || '2022145021',
      department: currentUser.affiliation,
      grade: currentUser.grade || 3,
      phone: currentUser.phone,
      email: currentUser.email,
      motivation,
      priorKnowledge,
      status: prog.appliedCount < prog.capacity ? '선정' : '대기',
      appliedAt,
    };

    setStudentApplications((prev) => [newApp, ...prev]);

    // Increase applied count
    setPrograms((prev) =>
      prev.map((p) => (p.id === programId ? { ...p, appliedCount: p.appliedCount + 1 } : p))
    );

    logAudit('프로그램 참여신청', prog.title, `신청자: ${currentUser.name} (선발상태: ${newApp.status})`);
    addToast(`"${prog.title}" 참여신청이 성공적으로 접수되었습니다.`, 'success');
    return true;
  };

  const cancelStudentApplication = (appId: string) => {
    const app = studentApplications.find((a) => a.id === appId);
    if (!app) return;

    setStudentApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: '취소' } : a))
    );

    setPrograms((prev) =>
      prev.map((p) =>
        p.id === app.programId ? { ...p, appliedCount: Math.max(0, p.appliedCount - 1) } : p
      )
    );

    logAudit('프로그램 신청 취소', app.programTitle, `신청자: ${currentUser.name}`);
    addToast('참여신청이 취소되었습니다.', 'info');
  };

  // Operator Actions
  const saveOrSubmitProgramPlan = (plan: Partial<Program>, isSubmit: boolean) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const newStatus = isSubmit ? '신청완료' : '임시저장';

    if (plan.id && programs.some((p) => p.id === plan.id)) {
      // Update existing
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === plan.id
            ? {
                ...p,
                ...plan,
                planStatus: newStatus,
                updatedAt: dateStr,
              }
            : p
        )
      );
      logAudit(
        isSubmit ? '운영계획서 제출' : '운영계획서 임시저장',
        plan.title || '비교과 프로그램',
        `상태: ${newStatus}`
      );
      addToast(
        isSubmit
          ? '운영계획서가 관리자 심사 큐로 제출되었습니다.'
          : '운영계획서가 임시저장되었습니다.',
        'success'
      );
    } else {
      // Create new
      const newId = `prog-${Date.now()}`;
      const newProgram: Program = {
        id: newId,
        title: plan.title || '새 비교과 프로그램',
        category: plan.category || 'AI·빅데이터',
        summary: plan.summary || '',
        description: plan.description || '',
        targetAudience: plan.targetAudience || '전 학과 재학생',
        capacity: plan.capacity || 30,
        appliedCount: 0,
        status: '모집예정',
        planStatus: newStatus,
        recruitStartDate: plan.recruitStartDate || dateStr,
        recruitEndDate: plan.recruitEndDate || dateStr,
        operateStartDate: plan.operateStartDate || dateStr,
        operateEndDate: plan.operateEndDate || dateStr,
        location: plan.location || '미정',
        method: plan.method || '대면',
        instructor: plan.instructor || {
          name: '',
          organization: '',
          role: '',
        },
        operatorId: currentUser.id,
        operatorName: currentUser.name,
        operatorDepartment: currentUser.affiliation,
        budget: plan.budget || 5000000,
        mileage: plan.mileage || 40,
        competencies: plan.competencies || ['SW융합역량', '문제해결능력'],
        objectives: plan.objectives || '',
        syllabus: plan.syllabus || [
          { session: 1, title: '오리엔테이션 및 기초', content: '개요 및 환경설정', date: dateStr, hours: 4 },
        ],
        benefits: plan.benefits || ['사업단 마일리지 부여', '이수증 발급'],
        createdAt: dateStr,
        updatedAt: dateStr,
      };

      setPrograms((prev) => [newProgram, ...prev]);
      logAudit(
        isSubmit ? '운영계획서 신규 제출' : '운영계획서 신규 임시저장',
        newProgram.title,
        `상태: ${newStatus}`
      );
      addToast(
        isSubmit
          ? '운영계획서가 사업단에 신규 제출되었습니다.'
          : '운영계획서가 임시저장되었습니다.',
        'success'
      );
    }
  };

  const markAttendance = (
    programId: string,
    sessionIndex: number,
    sessionDate: string,
    studentId: string,
    studentName: string,
    studentNumber: string,
    department: string,
    status: AttendanceStatus,
    note?: string
  ) => {
    const existingIndex = attendanceRecords.findIndex(
      (r) => r.programId === programId && r.sessionIndex === sessionIndex && r.studentId === studentId
    );

    const now = new Date();
    const recordedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (existingIndex >= 0) {
      setAttendanceRecords((prev) => {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          status,
          note: note !== undefined ? note : copy[existingIndex].note,
          recordedAt,
        };
        return copy;
      });
    } else {
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}-${Math.random().toString().slice(2, 5)}`,
        programId,
        sessionIndex,
        sessionDate,
        studentId,
        studentName,
        studentNumber,
        department,
        status,
        note,
        recordedAt,
      };
      setAttendanceRecords((prev) => [...prev, newRec]);
    }

    addToast(`${studentName} 학생 출석상태가 [${status}]로 갱신되었습니다.`, 'info');
  };

  const saveOrSubmitResultReport = (report: Partial<ResultReport>, isSubmit: boolean) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newStatus = isSubmit ? '제출완료' : '작성중';

    if (report.id && resultReports.some((r) => r.id === report.id)) {
      setResultReports((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? {
                ...r,
                ...report,
                status: newStatus,
                submittedAt: isSubmit ? dateStr : r.submittedAt,
              }
            : r
        )
      );
      logAudit(
        isSubmit ? '운영실적보고서 제출' : '운영실적보고서 임시저장',
        report.programTitle || '프로그램 실적',
        `상태: ${newStatus}`
      );
      addToast(
        isSubmit
          ? '운영실적보고서가 관리자 심사 큐로 제출되었습니다.'
          : '운영실적보고서가 저장되었습니다.',
        'success'
      );
    } else {
      const newReport: ResultReport = {
        id: `rep-${Date.now()}`,
        programId: report.programId || '',
        programTitle: report.programTitle || '',
        operatorId: currentUser.id,
        operatorName: currentUser.name,
        status: newStatus,
        submittedAt: isSubmit ? dateStr : undefined,
        actualStartDate: report.actualStartDate || now.toISOString().slice(0, 10),
        actualEndDate: report.actualEndDate || now.toISOString().slice(0, 10),
        actualLocation: report.actualLocation || '산학협력관 세미나실',
        actualMethod: report.actualMethod || '대면',
        recruitedCount: report.recruitedCount || 20,
        actualAttendees: report.actualAttendees || 19,
        completedCount: report.completedCount || 18,
        dropoutsCount: report.dropoutsCount || 1,
        satisfactionScore: report.satisfactionScore || 4.8,
        satisfactionBreakdown: report.satisfactionBreakdown || {
          curriculum: 4.8,
          instructor: 4.9,
          facilities: 4.7,
          applicability: 4.8,
        },
        keyOutcomes: report.keyOutcomes || '',
        studentFeedbackSummary: report.studentFeedbackSummary || '',
        improvementsNeeded: report.improvementsNeeded || '',
        futurePlans: report.futurePlans || '',
        budgetAllocated: report.budgetAllocated || 5000000,
        budgetSpent: report.budgetSpent || 4800000,
        budgetDetails: report.budgetDetails || [],
        photos: report.photos || [],
        attachments: report.attachments || [],
      };

      setResultReports((prev) => [newReport, ...prev]);
      logAudit(
        isSubmit ? '운영실적보고서 신규제출' : '운영실적보고서 신규작성',
        newReport.programTitle,
        `상태: ${newStatus}`
      );
      addToast(
        isSubmit
          ? '운영실적보고서가 관리자 심사 큐로 제출되었습니다.'
          : '운영실적보고서가 저장되었습니다.',
        'success'
      );
    }
  };

  // Admin Actions
  const reviewProgramPlan = (
    programId: string,
    decision: '승인완료' | '보완요청' | '반려',
    comment: string
  ) => {
    const prog = programs.find((p) => p.id === programId);
    if (!prog) return;

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);

    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id !== programId) return p;
        return {
          ...p,
          planStatus: decision,
          status: decision === '승인완료' ? '모집중' : p.status,
          reviewComment: comment,
          reviewedAt: dateStr,
          reviewedBy: `${currentUser.name} (${currentUser.affiliation})`,
          updatedAt: dateStr,
        };
      })
    );

    logAudit(`운영계획 심사 [${decision}]`, prog.title, `검토의견: ${comment}`);
    addToast(`"${prog.title}" 심사 결과가 [${decision}] 처리되었습니다.`, 'success');
  };

  const reviewResultReport = (
    reportId: string,
    decision: '승인완료' | '보완요청',
    comment: string
  ) => {
    const rep = resultReports.find((r) => r.id === reportId);
    if (!rep) return;

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);

    setResultReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          status: decision,
          reviewerComment: comment,
          reviewedAt: dateStr,
        };
      })
    );

    // If report approved, mark corresponding program as completed
    if (decision === '승인완료') {
      setPrograms((prev) =>
        prev.map((p) => (p.id === rep.programId ? { ...p, status: '운영종료' } : p))
      );
    }

    logAudit(`운영실적 심사 [${decision}]`, rep.programTitle, `검토의견: ${comment}`);
    addToast(`실적보고서 심사 결과가 [${decision}] 처리되었습니다.`, 'success');
  };

  const updateStudentAppStatus = (appId: string, status: StudentAppStatus) => {
    setStudentApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
    addToast(`학생 선발 상태가 [${status}]로 변경되었습니다.`, 'info');
  };

  const deleteProgram = (programId: string) => {
    const prog = programs.find((p) => p.id === programId);
    if (!prog) return;

    setPrograms((prev) => prev.filter((p) => p.id !== programId));
    logAudit('프로그램 삭제', prog.title);
    addToast(`"${prog.title}" 프로그램이 삭제되었습니다.`, 'info');
  };

  const addNotice = (noticeInput: Omit<Notice, 'id' | 'createdAt' | 'viewCount'>) => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const newNotice: Notice = {
      ...noticeInput,
      id: `not-${Date.now()}`,
      createdAt: dateStr,
      viewCount: 0,
    };
    setNotices((prev) => [newNotice, ...prev]);
    logAudit('공지사항 등록', newNotice.title);
    addToast('공지사항이 등록되었습니다.', 'success');
  };

  const deleteNotice = (noticeId: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
    addToast('공지사항이 삭제되었습니다.', 'info');
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PROGRAMS);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_APPS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);

    setPrograms(INITIAL_PROGRAMS);
    setStudentApplications(INITIAL_STUDENT_APPLICATIONS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setResultReports(INITIAL_REPORTS);
    setNotices(INITIAL_NOTICES);
    setAuditLogs(INITIAL_AUDIT_LOGS);

    addToast('시스템 데모 데이터가 초기 상태로 완벽히 복원되었습니다.', 'success');
  };

  const exportDataAsJson = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      programs,
      studentApplications,
      attendanceRecords,
      resultReports,
      notices,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aisw_extracurricular_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('시스템 전체 데이터가 JSON 파일로 백업되었습니다.', 'success');
  };

  const importDataFromJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.programs && Array.isArray(data.programs)) {
        setPrograms(data.programs);
        if (data.studentApplications) setStudentApplications(data.studentApplications);
        if (data.attendanceRecords) setAttendanceRecords(data.attendanceRecords);
        if (data.resultReports) setResultReports(data.resultReports);
        if (data.notices) setNotices(data.notices);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        addToast('데이터를 성공적으로 복원했습니다.', 'success');
        return true;
      }
      throw new Error('유효하지 않은 데이터 포맷');
    } catch {
      addToast('데이터 파싱 오류: 올바른 JSON 백업 파일을 선택하세요.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        activeTab,
        setActiveTab,
        programs,
        studentApplications,
        attendanceRecords,
        resultReports,
        notices,
        faqs,
        auditLogs,
        toasts,
        selectedProgram,
        setSelectedProgram,
        addToast,
        removeToast,
        applyForProgram,
        cancelStudentApplication,
        saveOrSubmitProgramPlan,
        markAttendance,
        saveOrSubmitResultReport,
        reviewProgramPlan,
        reviewResultReport,
        updateStudentAppStatus,
        deleteProgram,
        addNotice,
        deleteNotice,
        resetToDemoData,
        exportDataAsJson,
        importDataFromJson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
