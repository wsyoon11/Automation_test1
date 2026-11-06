import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { Program } from './types';

// Student Views
import { StudentHome } from './components/student/StudentHome';
import { ProgramList } from './components/student/ProgramList';
import { MyPage } from './components/student/MyPage';
import { NoticeFaqView } from './components/student/NoticeFaqView';
import { ProgramDetailModal } from './components/student/ProgramDetailModal';
import { ApplicationModal } from './components/student/ApplicationModal';

// Operator Views
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { PlanApplicationForm } from './components/operator/PlanApplicationForm';
import { MyPlansList } from './components/operator/MyPlansList';
import { AttendanceManager } from './components/operator/AttendanceManager';
import { ResultReportForm } from './components/operator/ResultReportForm';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PlanApprovalManager } from './components/admin/PlanApprovalManager';
import { ProgramAdminList } from './components/admin/ProgramAdminList';
import { ParticipantManager } from './components/admin/ParticipantManager';
import { ResultApprovalManager } from './components/admin/ResultApprovalManager';
import { StatisticsManager } from './components/admin/StatisticsManager';
import { NoticeAdminManager } from './components/admin/NoticeAdminManager';
import { UserAndSystemManager } from './components/admin/UserAndSystemManager';

const AppContent: React.FC = () => {
  const { currentRole, activeTab, setActiveTab } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals and cross-view params
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [applyingProgram, setApplyingProgram] = useState<Program | null>(null);
  const [editingPlanProgram, setEditingPlanProgram] = useState<Program | null>(null);
  const [targetAttendanceProgramId, setTargetAttendanceProgramId] = useState<string | undefined>(
    undefined
  );
  const [targetReportProgramId, setTargetReportProgramId] = useState<string | undefined>(
    undefined
  );

  const renderCurrentView = () => {
    // 1. Student Views
    if (currentRole === 'student') {
      switch (activeTab) {
        case 'home':
          return (
            <StudentHome
              onSelectProgram={(p) => setSelectedProgram(p)}
              onOpenApply={(p) => setApplyingProgram(p)}
            />
          );
        case 'programs':
          return (
            <ProgramList
              onSelectProgram={(p) => setSelectedProgram(p)}
              onOpenApply={(p) => setApplyingProgram(p)}
            />
          );
        case 'mypage':
          return <MyPage onSelectProgram={(p) => setSelectedProgram(p)} />;
        case 'notices':
          return <NoticeFaqView />;
        default:
          return (
            <StudentHome
              onSelectProgram={(p) => setSelectedProgram(p)}
              onOpenApply={(p) => setApplyingProgram(p)}
            />
          );
      }
    }

    // 2. Operator Views
    if (currentRole === 'operator') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <OperatorDashboard
              onEditPlan={(p) => {
                setEditingPlanProgram(p);
                setActiveTab('apply-plan');
              }}
              onOpenAttendance={(progId) => {
                setTargetAttendanceProgramId(progId);
                setActiveTab('attendance');
              }}
              onOpenReport={(progId) => {
                setTargetReportProgramId(progId);
                setActiveTab('result-report');
              }}
            />
          );
        case 'apply-plan':
          return (
            <PlanApplicationForm
              initialProgram={editingPlanProgram}
              onFinished={() => {
                setEditingPlanProgram(null);
                setActiveTab('my-plans');
              }}
            />
          );
        case 'my-plans':
          return (
            <MyPlansList
              onEditPlan={(p) => {
                setEditingPlanProgram(p);
                setActiveTab('apply-plan');
              }}
              onNewPlan={() => {
                setEditingPlanProgram(null);
                setActiveTab('apply-plan');
              }}
            />
          );
        case 'attendance':
          return <AttendanceManager initialProgramId={targetAttendanceProgramId} />;
        case 'result-report':
          return (
            <ResultReportForm
              initialProgramId={targetReportProgramId}
              onFinished={() => setActiveTab('dashboard')}
            />
          );
        default:
          return (
            <OperatorDashboard
              onEditPlan={(p) => {
                setEditingPlanProgram(p);
                setActiveTab('apply-plan');
              }}
              onOpenAttendance={(progId) => {
                setTargetAttendanceProgramId(progId);
                setActiveTab('attendance');
              }}
              onOpenReport={(progId) => {
                setTargetReportProgramId(progId);
                setActiveTab('result-report');
              }}
            />
          );
      }
    }

    // 3. Admin Views
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            onGoToPlanReviews={() => setActiveTab('plan-reviews')}
            onGoToResultReviews={() => setActiveTab('result-reviews')}
            onGoToParticipants={() => setActiveTab('participants')}
            onGoToStatistics={() => setActiveTab('statistics')}
          />
        );
      case 'plan-reviews':
        return <PlanApprovalManager />;
      case 'programs-admin':
        return (
          <ProgramAdminList
            onSelectProgram={(p) => setSelectedProgram(p)}
            onAddNewProgram={() => {
              setEditingPlanProgram(null);
              setActiveTab('plan-reviews');
            }}
          />
        );
      case 'participants':
        return <ParticipantManager />;
      case 'result-reviews':
        return <ResultApprovalManager />;
      case 'statistics':
        return <StatisticsManager />;
      case 'notices-admin':
        return <NoticeAdminManager />;
      case 'system':
        return <UserAndSystemManager />;
      default:
        return (
          <AdminDashboard
            onGoToPlanReviews={() => setActiveTab('plan-reviews')}
            onGoToResultReviews={() => setActiveTab('result-reviews')}
            onGoToParticipants={() => setActiveTab('participants')}
            onGoToStatistics={() => setActiveTab('statistics')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      {/* Global Header */}
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Toast Alert Portal */}
      <ToastContainer />

      {/* Program Detail Modal */}
      <ProgramDetailModal
        isOpen={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        program={selectedProgram}
        onOpenApply={(p) => {
          setSelectedProgram(null);
          setApplyingProgram(p);
        }}
      />

      {/* Student Application Form Modal */}
      <ApplicationModal
        isOpen={!!applyingProgram}
        onClose={() => setApplyingProgram(null)}
        program={applyingProgram}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
