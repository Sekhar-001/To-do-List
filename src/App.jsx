import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

import { DashboardView } from './components/dashboard/DashboardView';
import { TasksView } from './components/tasks/TasksView';
import { PlannerView } from './components/planner/PlannerView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { SyllabusView } from './components/syllabus/SyllabusView';
import { ExamsView } from './components/exams/ExamsView';
import { MockTestsView } from './components/mocktests/MockTestsView';
import { ResultsView } from './components/results/ResultsView';
import { QuestionsView } from './components/questions/QuestionsView';
import { NotesView } from './components/notes/NotesView';
import { GoalsView } from './components/goals/GoalsView';
import { RevisionView } from './components/revision/RevisionView';
import { AnalyticsView } from './components/analytics/AnalyticsView';

import { AuthScreen } from './components/auth/AuthScreen';
import { ProfileModal } from './components/profile/ProfileModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { InstallAppModal } from './components/common/InstallAppModal';
import { ToastContainer } from './components/common/ToastContainer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

const AppContent = () => {
  const {
    activeTab,
    firebaseUser,
    authLoading,
    isProfileModalOpen,
    setIsProfileModalOpen
  } = useApp();

  // If Firebase is checking initial auth state, show a fast, modern loader
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--accent-primary)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem auto'
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>
            Connecting to your Study Workspace...
          </p>
        </div>
      </div>
    );
  }

  // If user is not signed in to Firebase, show the Auth Gateway screen
  if (!firebaseUser) {
    return (
      <>
        <AuthScreen />
        <ToastContainer />
      </>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'planner':
        return <PlannerView />;
      case 'subjects':
        return <SubjectsView />;
      case 'syllabus':
        return <SyllabusView />;
      case 'exams':
        return <ExamsView />;
      case 'mocktests':
        return <MockTestsView />;
      case 'results':
        return <ResultsView />;
      case 'questions':
        return <QuestionsView />;
      case 'notes':
        return <NotesView />;
      case 'goals':
        return <GoalsView />;
      case 'revision':
        return <RevisionView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <TopBar />
        <main className="main-content">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global Modals, Bottom Navigation & Notifications */}
      <GlobalSearchModal />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <InstallAppModal />
      <ToastContainer />
      <MobileBottomNav />
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
