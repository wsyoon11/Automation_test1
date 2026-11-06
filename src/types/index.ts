/**
 * University Extracurricular Program Management System
 * Core Data Models & TypeScript Types
 */

export type UserRole = 'student' | 'operator' | 'admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  affiliation: string; // e.g. "컴퓨터공학과" or "SW융합교육센터" or "사업단 운영본부"
  studentNumber?: string; // e.g. "2022145021"
  grade?: number; // 1, 2, 3, 4
  operatorTitle?: string; // e.g. "산학협력중점교수"
}

export type ProgramCategory = 
  | 'AI·빅데이터'
  | '클라우드·SW'
  | '산학연계 프로젝트'
  | '취·창업 실무'
  | '글로벌·자격증';

export type ProgramStatus = 
  | '모집예정' 
  | '모집중' 
  | '모집마감' 
  | '운영중' 
  | '운영종료';

export type PlanStatus = 
  | '임시저장'
  | '신청완료'
  | '검토중'
  | '보완요청'
  | '승인완료'
  | '반려';

export type StudentAppStatus = 
  | '신청완료'
  | '선정'
  | '대기'
  | '취소'
  | '이수완료'
  | '미이수';

export type ReportStatus = 
  | '작성중'
  | '제출완료'
  | '검토중'
  | '보완요청'
  | '승인완료';

export type AttendanceStatus = '출석' | '지각' | '결석';

export interface Program {
  id: string;
  title: string;
  category: ProgramCategory;
  summary: string;
  description: string;
  targetAudience: string;
  capacity: number;
  appliedCount: number;
  status: ProgramStatus;
  planStatus: PlanStatus;
  
  // Schedules
  recruitStartDate: string;
  recruitEndDate: string;
  operateStartDate: string;
  operateEndDate: string;
  
  // Logistics
  location: string;
  method: '대면' | '비대면' | '혼합(블렌디드)';
  instructor: {
    name: string;
    organization: string;
    role: string;
  };
  
  // Department & Operator
  operatorId: string;
  operatorName: string;
  operatorDepartment: string;
  
  // Budget & Benefits
  budget: number; // in KRW
  mileage: number; // 사업단 마일리지 포인트
  competencies: string[]; // e.g. ["문제해결능력", "SW융합역량", "협업능력"]
  
  // Syllabus & Objectives
  objectives: string;
  syllabus: {
    session: number;
    title: string;
    content: string;
    date: string;
    hours: number;
  }[];
  benefits: string[];
  
  // Review notes from Admin
  reviewComment?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface StudentApplication {
  id: string;
  programId: string;
  programTitle: string;
  studentId: string; // user id
  studentName: string;
  studentNumber: string;
  department: string;
  grade: number;
  phone: string;
  email: string;
  motivation: string;
  priorKnowledge: string;
  status: StudentAppStatus;
  appliedAt: string;
  attendedHours?: number;
  totalHours?: number;
  isCompleted?: boolean;
  completionNumber?: string; // 수료증 번호 (e.g. "AISW-2026-0042")
}

export interface AttendanceRecord {
  id: string;
  programId: string;
  sessionIndex: number;
  sessionDate: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  department: string;
  status: AttendanceStatus;
  note?: string;
  recordedAt: string;
}

export interface ResultReport {
  id: string;
  programId: string;
  programTitle: string;
  operatorId: string;
  operatorName: string;
  
  status: ReportStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewerComment?: string;
  
  // Operational Metrics
  actualStartDate: string;
  actualEndDate: string;
  actualLocation: string;
  actualMethod: string;
  
  recruitedCount: number;
  actualAttendees: number;
  completedCount: number;
  dropoutsCount: number;
  
  // Satisfaction Metrics (5.0 scale)
  satisfactionScore: number;
  satisfactionBreakdown: {
    curriculum: number;
    instructor: number;
    facilities: number;
    applicability: number;
  };
  
  // Qualitative Outcomes
  keyOutcomes: string;
  studentFeedbackSummary: string;
  improvementsNeeded: string;
  futurePlans: string;
  
  // Budget Breakdown
  budgetAllocated: number;
  budgetSpent: number;
  budgetDetails: {
    item: string;
    amount: number;
    note: string;
  }[];
  
  // Evidence attachments
  photos: {
    title: string;
    description: string;
  }[];
  attachments: {
    name: string;
    size: string;
    type: string;
  }[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  department: string;
  createdAt: string;
  isPinned: boolean;
  viewCount: number;
  category: '공지' | '모집' | '행사' | '성과';
  attachments?: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: '신청 및 선발' | '출석 및 수료' | '마일리지 및 혜택' | '운영 및 행정';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  target: string;
  details?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
