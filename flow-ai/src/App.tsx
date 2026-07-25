import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { AuthModal } from './components/AuthModal';

import { DashboardView } from './components/views/DashboardView';
import { TasksView } from './components/views/TasksView';
import { ClassesView } from './components/views/ClassesView';
import { AnnouncementsView } from './components/views/AnnouncementsView';
import { NotesView } from './components/views/NotesView';
import { AssignmentsView } from './components/views/AssignmentsView';
import { QuizzesView } from './components/views/QuizzesView';
import { MessagesView } from './components/views/MessagesView';
import { CalendarView } from './components/views/CalendarView';
import { ProgressView } from './components/views/ProgressView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { SubscriptionView } from './components/views/SubscriptionView';
import { ProfileView } from './components/views/ProfileView';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView, isAuthModalOpen, setIsAuthModalOpen } = useApp();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={(view) => setCurrentView(view)} />;
      case 'tasks':
        return <TasksView />;
      case 'classes':
        return <ClassesView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'notes':
        return <NotesView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'quizzes':
        return <QuizzesView />;
      case 'messages':
        return <MessagesView />;
      case 'calendar':
        return <CalendarView />;
      case 'progress':
        return <ProgressView />;
      case 'ai-assistant':
        return <AIAssistantView />;
      case 'subscription':
        return <SubscriptionView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView onNavigate={(view) => setCurrentView(view)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBFD] text-slate-800 flex flex-col font-sans selection:bg-pink-200 selection:text-pink-900">
      {/* Top Header */}
      <Header onOpenRoleModal={() => setIsRoleModalOpen(true)} onSelectTab={setCurrentView} />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Navigation Sidebar */}
        <Sidebar activeView={currentView} onSelectView={setCurrentView} />

        {/* View Viewport */}
        <main className="flex-1 min-w-0">{renderActiveView()}</main>
      </div>

      {/* Role Switcher Dialog */}
      <RoleSwitcherModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />

      {/* Firebase Authentication Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
