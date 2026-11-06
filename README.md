# 대학 사업단(AI/SW 융합혁신사업단) 비교과 프로그램 통합 운영관리 시스템

대학 사업단에서 운영하는 비교과 프로그램을 기획·신청부터 관리자 심사 승인, 학생 모집 및 참여, 출석 관리, 실적 보고, 성과 통계 및 보고서 출력까지 전주기로 관리하는 실무형 통합 웹 애플리케이션입니다.

---

## 1. 주요 특징 및 핵심 워크플로우

1. **상단 원클릭 퀵 롤 스위처 (Quick Role Switcher)**
   - 헤더 상단 버튼으로 **학생 (Student)** ↔ **운영 담당자 (Operator)** ↔ **총괄 관리자 (Admin)**를 즉시 전환하여 3개 사용자의 전주기 업무 흐름을 자유롭게 체험 가능
2. **학생 서비스 (Student Portal)**
   - 신기술 비교과 프로그램 목록 탐색, 분야별/상태별 필터 및 실시간 검색
   - 상세 커리큘럼(Syllabus) 및 초빙 강사 정보 확인
   - 개인정보 수집·이용 동의 기반 온라인 간편 신청
   - 마이페이지: 신청 내역 조회, 신청 취소, 역량 마일리지 적립 현황, **공식 이수증 발급 및 인쇄**
3. **운영 담당자 서비스 (Operator Portal)**
   - 4단계 입력 폼을 통한 신규 운영계획서 작성 (임시저장, 미리보기, 최종 제출)
   - 관리자의 **보완 요청 의견 확인 및 수정 후 재제출** 지원
   - 회차별 참여자 출석부 실시간 기록 (출석/지각/결석 원클릭 토글, CSV 다운로드)
   - 프로그램 종료 후 운영실적 등록 (만족도 5점 척도, 주요 성과, 예산 집행 결산)
4. **사업단 관리자 서비스 (Admin Console)**
   - 핵심 운영 KPI 카드 및 시각화 대시보드
   - 운영계획서 심사 큐 (승인완료, 보완요청, 반려 및 검토의견 등록)
   - 참여자 종합 관리 및 일괄 선발/수료 처리
   - 운영실적 보고서 심사 및 **공식 결과보고서 인쇄/PDF 출력**
   - 연도별/월별 추이, 학과별 참여 랭킹, 만족도 분석, 예산 집행률 통계 및 CSV 다운로드
   - 데이터 백업(JSON Export), 복원(JSON Import), 원본 데모 초기화(Reset) 및 감사 로그(Audit Logs)

---

## 2. 디자인 시스템 및 기술 스택

- **디자인 토큰**:
  - Primary: `#183153` (Navy Blue)
  - Secondary: `#356FA5` (Slate Blue)
  - Accent: `#2A8C8C` (Teal)
  - Background: `#F5F7FA` (Light Gray)
  - Surface: `#FFFFFF` (White)
  - Typography: Pretendard 웹폰트 적용
- **기술 스택**:
  - React 19 + TypeScript
  - Tailwind CSS v4
  - Lucide React Icons
  - LocalStorage 영속성 데이터 엔진
  - 브라우저 인쇄(`window.print()`) 최적화 CSS (@media print)

---

## 3. 실행 및 설치 방법

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build
```

---

## 4. 백엔드 및 데이터베이스 연동 안내

상세한 RESTful API 명세는 [`docs/api-spec.md`](docs/api-spec.md)에 기술되어 있으며, 프론트엔드의 `AppContext` 액션 핸들러와 1:1로 매핑되어 있습니다.
