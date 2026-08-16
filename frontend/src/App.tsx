import React, { useState, useEffect } from 'react';
import { User, Workflow } from './types';
import { apiService } from './services/api';

// Components
import { SplashScreen } from './components/SplashScreen';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { CopilotDrawer } from './components/CopilotDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CommandCenter } from './pages/CommandCenter';
import { WorkflowGenerator } from './pages/WorkflowGenerator';
import { WorkflowBuilder } from './pages/WorkflowBuilder';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { MyTasksPage } from './pages/MyTasksPage';
import { DecisionPassportPage } from './pages/DecisionPassportPage';
import { PredictivePage } from './pages/PredictivePage';
import { WorkflowDnaPage } from './pages/WorkflowDnaPage';
import { WorkflowSimulator } from './pages/WorkflowSimulator';
import { DigitalTwin } from './pages/DigitalTwin';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { ExceptionsPage } from './pages/ExceptionsPage';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [inApp, setInApp] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedPassportId, setSelectedPassportId] = useState<string>('SCH-20481');
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | undefined>(undefined);

  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    email: 'student@forge.edu',
    full_name: 'Rahul Sharma',
    role: 'Student',
    is_active: true,
    student_id_no: 'STU-2026-881',
    cgpa: 8.7,
    attendance_pct: 89.0,
    annual_income: 320000.0,
  });

  const [copilotOpen, setCopilotOpen] = useState(false);

  const handleSwitchUser = async (email: string) => {
    const res = await apiService.login(email);
    setCurrentUser(res.user);
    // Auto adjust view if tab not allowed for role
    if (res.user.role === 'Student' && !['dashboard', 'applications'].includes(currentTab)) {
      setCurrentTab('dashboard');
    }
  };

  const handleNavigateToPassport = (appId: string) => {
    setSelectedPassportId(appId);
    setCurrentTab('passports');
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!inApp) {
    return (
      <LandingPage
        onExplore={() => setInApp(true)}
        onViewDemo={() => {
          setInApp(true);
          setCurrentTab('applications');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#892cdc] selection:text-white">
      {/* Navigation Header Topbar */}
      <Topbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={currentUser.role}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#040108] min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <CommandCenter
                currentUser={currentUser}
                onNavigate={(tab, param) => {
                  if (tab === 'passports' && param) setSelectedPassportId(param);
                  setCurrentTab(tab);
                }}
              />
            )}

            {currentTab === 'applications' && (
              <ApplicationsPage
                currentUser={currentUser}
                onNavigateToPassport={handleNavigateToPassport}
              />
            )}

            {currentTab === 'tasks' && (
              <MyTasksPage onNavigateToPassport={handleNavigateToPassport} />
            )}

            {currentTab === 'generator' && (
              <WorkflowGenerator
                onWorkflowCreated={(wf) => {
                  setActiveWorkflow(wf);
                  setCurrentTab('builder');
                }}
              />
            )}

            {currentTab === 'builder' && (
              <WorkflowBuilder
                initialWorkflow={activeWorkflow}
                onSaveWorkflow={() => setCurrentTab('dashboard')}
              />
            )}

            {currentTab === 'passports' && (
              <DecisionPassportPage
                applicationId={selectedPassportId}
                onBack={() => setCurrentTab('dashboard')}
              />
            )}

            {currentTab === 'predictions' && (
              <PredictivePage onNavigate={setCurrentTab} />
            )}

            {currentTab === 'dna' && <WorkflowDnaPage />}

            {currentTab === 'simulator' && <WorkflowSimulator />}

            {currentTab === 'digital-twin' && <DigitalTwin />}

            {currentTab === 'exceptions' && <ExceptionsPage />}

            {currentTab === 'audit-logs' && <AuditLogsPage />}
          </div>
        </main>
      </div>

      {/* AI Copilot Drawer */}
      <CopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        userRole={currentUser.role}
      />
    </div>
  );
}

export default App;
