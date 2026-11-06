# AI/SW 융합혁신사업단 비교과 프로그램 통합 운영관리 시스템 구현 계획

AI/SW 융합혁신사업단에서 운영하는 비교과 프로그램을 기획·신청부터 심사 승인, 학생 모집 및 참여, 출석 관리, 실적 보고 및 승인, 성과 통계 및 보고서 출력까지 전주기로 관리하는 실무형 통합 운영관리 웹 애플리케이션 구축 계획입니다.

## User Review & Critical Decisions

> [!IMPORTANT]
> 사용자가 Phase 1 질문을 통해 확인해 주신 핵심 설정 및 요구사항이 아래와 같이 시스템 설계에 전면 반영되었습니다.

- **사업단 명칭 및 특성화 분야**: `AI/SW 융합혁신사업단` (인공지능, 빅데이터, 클라우드, 풀스택, 오픈소스 등 디지털 신기술 및 산업체 연계 실무 프로젝트 중심)
- **사용자 권한 체험 방식**: 상단 고정 `Quick Role Switcher` (학생 `Student` ↔ 운영 담당자 `Operator` ↔ 총괄 관리자 `Admin`)를 제공하여 별도 번거로운 재로그인 없이 3개 핵심 사용자의 화면 및 권한별 워크플로우를 자유롭게 즉각 검증 가능
- **성과 및 통계 관리 범위**: 기본 참여/출석 수료율뿐만 아니라 사업단 핵심 KPI인 **역량 마일리지**, **학생 만족도(5점 척도 및 주관식 피드백)**, **예산 집행현황(계획 대비 집행 실적)**까지 포괄하는 고도화된 통계 대시보드 구축
- **데이터 영속성 및 확장 구조**: 초기 구동 시 실제 대학 사업단 수준의 완성도 높은 데모 데이터를 로드하며, 모든 수정/신청/승인/출석/실적 처리가 `localStorage`에 즉시 동기화되어 새로고침 후에도 유지됨 (언제든지 초기 데모 데이터로 복원 가능한 Reset 기능 및 데이터 백업/내보내기 기능 제공)

---

## 1. Overview & Core Concept

- **목적**: 대학 사업단과 학과/부서 간에 엑셀과 수기 공문으로 분산 처리되던 비교과 프로그램 업무를 단일 플랫폼으로 일원화하여 행정 소요를 대폭 절감하고 학생의 참여 편의성을 극대화
- **타깃 사용자 및 페르소나**:
  1. **학생 (Student)**: 비교과 프로그램 탐색, 필터/검색, 온라인 간편 신청, 신청 현황 확인, 이수증/마일리지 내역 확인
  2. **운영 담당자 (Operator)**: 비교과 운영계획서 작성 및 승인 신청, 보완요청 대응, 참여자 출석/수료 관리, 운영실적 보고서 작성 및 증빙자료 제출
  3. **총괄 관리자 (Admin)**: 전체 사업단 현황 모니터링, 운영계획 심사(승인/보완/반려), 운영실적 심사, 참여자 관리, 공지/FAQ 관리, 성과 통계 분석 및 Excel/인쇄용 보고서 출력
- **핵심 가치**:
  - 신청 → 심사 → 모집 → 출석 → 실적보고 → 성과통계로 이어지는 9단계 전주기 완결형 프로세스 구현
  - 클릭 한 번으로 모든 상태 전이(임시저장, 신청완료, 검토중, 보완요청, 승인완료, 반려)가 실시간 반영되는 상호작용성

---

## 2. User Experience & Visual Design

### A. 디자인 시스템 & 컬러 팔레트 (지침 완벽 준수)
- **Primary**: Deep Navy Blue (`#183153`) - 헤더, 사이드바 하이라이트, 주요 버튼
- **Secondary**: Slate Blue (`#356FA5`) - 액티브 서브메뉴, 필터 탭 활성화, 보조 액션
- **Accent**: Teal (`#2A8C8C`) - 주요 강조 배지, 역량 마일리지 지표, 성과 달성 그래프
- **Background**: Soft Gray Canvas (`#F5F7FA`) - 눈의 피로도를 낮추는 공공·대학 행정 시스템 표준 배경
- **Surface**: Pure White (`#FFFFFF`) - 카드, 데이터 테이블, 모달 컨테이너
- **Text Primary**: Dark Gray (`#263445`), **Text Secondary**: Neutral Gray (`#667085`), **Border**: Light Gray (`#E3E8EF`)
- **Semantic Feedback**: Success(Emerald Green), Warning(Amber), Danger(Rose Red)

### B. 타이포그래피 & 레이아웃 구조
- **글꼴**: 한글 가독성이 뛰어난 Pretendard 및 시스템 산세리프 폰트 적용
- **숫자 및 데이터 정렬**: 통계 수치, 예산액, 학번, 날짜는 모두 `tabular-nums` 및 고정폭 정렬을 적용하여 세로 정렬 불일치 방지
- **반응형 3단 뷰포트**:
  - **PC (1280px+)**: 좌측 고정 사이드바(260px) + 상단 롤스위처 헤더(64px) + 중앙 광폭 작업 영역
  - **태블릿 (768px~1279px)**: 축소형 사이드바 또는 상단 서브네비게이션 전환
  - **모바일 (~767px)**: 슬라이드 오버 햄버거 메뉴, 카드형 데이터 뷰 전환, 터치 친화적 버튼 높이(min 44px)

### C. 주요 3대 사용자 인터페이스 영역 구성
```
┌────────────────────────────────────────────────────────────────────────┐
│ [Top Global Bar]  AI/SW 융합혁신사업단   [Role: 학생 / 담당자 / 관리자] [Reset Data] │
├────────────────────────┬───────────────────────────────────────────────┤
│ [Sidebar / Nav]        │ [Main Viewport: Context-Aware Workspace]      │
│  - 대시보드            │                                               │
│  - 프로그램 관리/안내  │  · 학생: 공지배너, 추천 프로그램, 마이페이지  │
│  - 신청/실적 관리      │  · 담당자: 계획서 신청폼, 참여자 출석부, 보고서│
│  - 성과 및 통계        │  · 관리자: KPI 카드, 심사 큐, 엑셀/보고서 다운│
└────────────────────────┴───────────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

- **결정 1: 상단 퀵 롤 스위처(Role Switcher) 탑재**
  - *선택 이유*: 평가자 및 실무자가 로그아웃/로그인 반복 없이 "학생이 신청한 건"을 "관리자가 승인"하고 "담당자가 출석 체크"한 뒤 "실적을 제출"하는 전체 흐름을 30초 내에 직관적으로 시연 가능
  - *대안 검토*: 전통적인 로그인 폼만 제공할 경우 데모 시연 시 계정 암호 기억 및 반복 전환 비용 발생
- **결정 2: 반응형 반응성 로컬 스토리지 상태 엔진 (Store Architecture)**
  - *선택 이유*: 브라우저 새로고침 시에도 모든 신청 데이터, 출석 체크 결과, 승인 상태 변경, 신규 작성 보고서가 영구 유지되며, 언제든 '데모 초기화(Reset)' 버튼으로 원본 시드 데이터 복구 가능
  - *백엔드 호환성*: 순수 JavaScript 함수형 리듀서 및 서비스 레이어로 설계되어 향후 Express/REST API나 Firestore 엔드포인트로 1:1 교체 가능하도록 구조화
- **결정 3: 모달 기반의 세부 심사 및 인쇄 미리보기/출력 지원**
  - *선택 이유*: 운영계획서 상세 검토창에서 관리자가 의견(승인/보완사유/반려사유)을 입력하고 결재 이력을 남길 수 있으며, 실적보고서는 즉시 브라우저 인쇄 모달 또는 CSV/Excel 내보내기가 가능하도록 제작

---

## 4. Technical Architecture & Data Strategy

### A. 시스템 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          User Interface Layer                           │
├────────────────────┬─────────────────────────────┬──────────────────────┤
│  Student Portal    │     Operator Portal         │     Admin Console    │
│  - Program Browser │  - Plan Application Wizard  │  - Dashboard & KPIs  │
│  - Detail & Apply  │  - Attendance Roster Grid   │  - Plan Approval     │
│  - My Applications │  - Result Report Submitter  │  - Result Approval   │
│  - Mileage & Cert  │  - Participant Excel Export │  - Analytics & Stats │
├────────────────────┴─────────────────────────────┴──────────────────────┤
│               Shared UI Components & Navigation Framework               │
│   (Header, Role Switcher, Sidebar, Data Table, Modal, Toast, StatCard)   │
├─────────────────────────────────────────────────────────────────────────┤
│                   Application State & Business Logic                    │
│   (useAppStore: Programs, Applications, Attendance, Reports, Logs)      │
├─────────────────────────────────────────────────────────────────────────┤
│                       Data Layer & LocalStorage                         │
│   (Seed Generator ↔ Reactive LocalStorage Adapter ↔ Export/Import)      │
└─────────────────────────────────────────────────────────────────────────┘
```

### B. 핵심 데이터 엔티티 모델 (Entities)
1. **Program**: `id`, `title`, `category` (AI·빅데이터/소프트웨어/산학프로젝트/취창업/글로벌), `targetAudience`, `capacity`, `appliedCount`, `status` (모집예정/모집중/마감/운영중/종료), `period`, `recruitPeriod`, `location`, `method` (대면/비대면/혼합), `instructor`, `budget`, `description`, `competencies`, `mileage`
2. **ProgramApplication (운영계획 신청)**: `id`, `programId`, `operatorName`, `department`, `submittedAt`, `status` (임시저장/신청완료/검토중/보완요청/승인완료/반려), `reviewComments`, `history`
3. **StudentApplication (학생 신청)**: `id`, `programId`, `studentId`, `studentName`, `department`, `grade`, `phone`, `email`, `motivation`, `appliedAt`, `status` (신청완료/선정/대기/취소/이수/미이수)
4. **AttendanceRecord (출석부)**: `id`, `programId`, `studentId`, `sessionIndex`, `sessionDate`, `status` (출석/지각/결석)
5. **ResultReport (운영실적 보고서)**: `id`, `programId`, `operatorName`, `actualParticipants`, `completedCount`, `satisfactionScore` (5점 만점), `outcomesSummary`, `studentFeedback`, `budgetSpent`, `submittedAt`, `status` (제출완료/검토중/보완요청/승인완료)
6. **AuditLog**: `id`, `timestamp`, `actor`, `action`, `targetTitle`

### C. 구현 상세 일정 및 화면 모듈 매핑
1. **공통 기반 모듈**: 타입 정의(`types/index.ts`), 풍부한 초기 시드 데이터(`data/initialData.ts`), 로컬스토리지 상태 관리 훅(`hooks/useAppStore.ts`), 네비게이션 및 헤더 컴포넌트
2. **학생 포털 모듈**: 메인 배너 및 추천 프로그램, 검색/카테고리/모집상태 필터링 그리드, 프로그램 상세 모달/페이지, 간편 신청 폼(유효성 검사 및 동의 절차), 마이페이지(신청내역/취소/마일리지)
3. **운영 담당자 모듈**: 대시보드(진행 상태별 건수), 운영계획서 신청 폼(임시저장, 미리보기, 제출), 참여자 명단 조회 및 실시간 출석 체크 테이블, 운영실적 등록 폼(만족도, 성과, 증빙, 예산집행)
4. **관리자 콘솔 모듈**: 핵심 지표 KPI 카드, 운영계획 심사 큐(원클릭 승인/보완/반려 사유 입력), 운영실적 심사 큐, 종합 성과 및 통계 분석 차트(월별/분야별/학과별/만족도 추이), 참여자 엑셀/CSV 다운로드 및 인쇄용 실적보고서 모달
5. **검증 및 빌드**: TypeScript 타입 무결성 검증, 린트 검사, 반응형 화면 테스트 및 dev server 재기동
