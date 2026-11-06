# AI/SW 융합혁신사업단 비교과 통합운영관리 시스템 백엔드 연동 API 명세서

본 문서는 향후 본 프론트엔드 웹 애플리케이션을 Node.js/Express, Spring Boot 또는 Firebase/PostgreSQL 백엔드 서버와 연동하기 위한 RESTful API 명세입니다.

---

## 1. 인증 및 권한 (Authentication & RBAC)

모든 보호된 엔드포인트는 `Authorization: Bearer <JWT_TOKEN>` 헤더를 검증합니다.

| 역할 (Role) | 설명 | 허용 권한 |
| :--- | :--- | :--- |
| `STUDENT` | 재학생 | 프로그램 조회, 참여신청, 마이페이지, 이수증 발급 |
| `OPERATOR` | 프로그램 운영 담당자 (교직원/외래강사) | 운영계획서 신청/수정, 참여자 출석부 등록, 실적보고서 제출 |
| `ADMIN` | 사업단 총괄 관리자 | 운영계획 심사, 실적보고 심사, 프로그램 및 참여자 총괄, 성과 통계 |

---

## 2. API 엔드포인트 명세

### A. 프로그램 및 운영계획 (Programs & Plans)

#### 1) `GET /api/v1/programs`
- **설명**: 공개 승인된 비교과 프로그램 목록 조회 (필터 및 검색 지원)
- **Query Params**:
  - `category`: `AI·빅데이터` | `클라우드·SW` | `산학연계 프로젝트` | `취·창업 실무` | `글로벌·자격증`
  - `status`: `모집중` | `모집예정` | `운영중` | `운영종료`
  - `search`: 검색어 (제목, 강사명)
  - `page`, `limit`
- **Response**: `200 OK` (Program[] Array & Total count)

#### 2) `GET /api/v1/programs/:id`
- **설명**: 프로그램 세부 정보 및 회차별 커리큘럼(Syllabus) 조회
- **Response**: `200 OK` (Program Entity)

#### 3) `POST /api/v1/plans`
- **설명**: [Operator] 신규 운영계획서 신청 또는 임시저장
- **Body**:
  ```json
  {
    "title": "LLM 파인튜닝 실무 부트캠프",
    "category": "AI·빅데이터",
    "summary": "...",
    "description": "...",
    "targetAudience": "...",
    "capacity": 30,
    "recruitStartDate": "2026-11-01",
    "recruitEndDate": "2026-11-15",
    "operateStartDate": "2026-11-20",
    "operateEndDate": "2026-12-18",
    "location": "IT융합관 402호",
    "method": "대면",
    "instructor": { "name": "...", "organization": "...", "role": "..." },
    "budget": 7500000,
    "mileage": 50,
    "syllabus": [...],
    "isSubmit": true
  }
  ```
- **Response**: `201 Created`

#### 4) `PUT /api/v1/plans/:id/review`
- **설명**: [Admin] 운영계획서 심사 (승인완료 / 보완요청 / 반려)
- **Body**:
  ```json
  {
    "decision": "승인완료",
    "reviewComment": "소요 예산 편성이 적절하여 승인함."
  }
  ```
- **Response**: `200 OK`

---

### B. 학생 참여신청 (Student Applications)

#### 1) `POST /api/v1/programs/:id/applications`
- **설명**: [Student] 비교과 프로그램 참가 신청
- **Body**:
  ```json
  {
    "motivation": "자연어처리 실무 포트폴리오를 작성하기 위해 지원합니다.",
    "priorKnowledge": "파이썬 기초 문법 숙지",
    "privacyConsent": true
  }
  ```
- **Response**: `201 Created`

#### 2) `GET /api/v1/students/me/applications`
- **설명**: [Student] 나의 신청내역, 선발상태(선정/대기), 이수 및 마일리지 조회
- **Response**: `200 OK`

#### 3) `DELETE /api/v1/applications/:id`
- **설명**: [Student] 참여 신청 취소 (모집 마감 전 가능)
- **Response**: `200 OK`

#### 4) `PATCH /api/v1/admin/applications/:id/status`
- **설명**: [Admin] 학생 선발 상태 일괄 변경 (`선정`, `대기`, `이수완료`, `미이수`)
- **Body**: `{ "status": "이수완료" }`
- **Response**: `200 OK`

---

### C. 출석 관리 (Attendance)

#### 1) `GET /api/v1/programs/:id/sessions/:sessionIndex/attendance`
- **설명**: [Operator/Admin] 특정 회차 수강생 출석부 조회
- **Response**: `200 OK` (AttendanceRecord[] Array)

#### 2) `POST /api/v1/programs/:id/sessions/:sessionIndex/attendance`
- **설명**: [Operator] 학생 출석 상태 실시간 기록/갱신
- **Body**:
  ```json
  {
    "studentId": "user-student-01",
    "status": "출석",
    "note": ""
  }
  ```
- **Response**: `200 OK`

---

### D. 운영실적 보고 (Result Reports)

#### 1) `POST /api/v1/programs/:id/reports`
- **설명**: [Operator] 프로그램 종료 후 운영실적 보고서 작성 및 제출
- **Body**:
  ```json
  {
    "actualAttendees": 28,
    "completedCount": 26,
    "satisfactionScore": 4.88,
    "satisfactionBreakdown": { "curriculum": 4.9, "instructor": 4.95, "facilities": 4.8, "applicability": 4.87 },
    "keyOutcomes": "...",
    "studentFeedbackSummary": "...",
    "budgetSpent": 7200000,
    "budgetDetails": [...],
    "isSubmit": true
  }
  ```
- **Response**: `201 Created`

#### 2) `PUT /api/v1/reports/:id/review`
- **설명**: [Admin] 운영실적 보고서 심사 및 성과 확정
- **Body**: `{ "decision": "승인완료", "reviewerComment": "성과 우수 승인" }`
- **Response**: `200 OK`

---

### E. 성과 및 통계 (Statistics)

#### 1) `GET /api/v1/admin/statistics?year=2026`
- **설명**: [Admin] 사업단 연간/월별 운영 통계, 학과별 참여 랭킹, 예산 집행률 요약
- **Response**: `200 OK` (KPI Summary Object)
