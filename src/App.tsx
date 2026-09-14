import React, { useState } from 'react';
import { DispatchProvider, useDispatchContext } from './context/DispatchContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { DashboardView } from './components/dashboard/DashboardView';
import { RequestList } from './components/requests/RequestList';
import { AmbulanceList } from './components/ambulances/AmbulanceList';
import { LiveMap } from './components/map/LiveMap';
import { TripTracker } from './components/trips/TripTracker';
import { IncidentHistory } from './components/history/IncidentHistory';
import { ReportsView } from './components/analytics/ReportsView';
import { DispatchModal } from './components/dispatch/DispatchModal';
import { NewIncidentModal } from './components/requests/NewIncidentModal';
import { IncidentTimelineModal } from './components/history/IncidentTimelineModal';
import { Menu, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useDispatchContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'requests':
        return <RequestList />;
      case 'ambulances':
        return <AmbulanceList />;
      case 'map':
        return <LiveMap />;
      case 'trips':
        return <TripTracker />;
      case 'history':
        return <IncidentHistory />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* 1. Header with Clock & Simulator Controls */}
      <Header />

      {/* 2. Critical Shortage Alert Banner (Conditional) */}
      <EmergencyBanner />

      {/* Mobile Navigation Toggle Bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          Nav: <span className="text-red-400">{activeTab.toUpperCase()}</span>
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Workspace Layout (Sidebar + Active View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex shrink-0">
          <Sidebar currentTab={activeTab} onSelectTab={setActiveTab} />
        </div>

        {/* Mobile Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 w-64 bg-slate-950 border-r border-slate-800 h-full flex flex-col justify-between">
              <Sidebar
                currentTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Operational Scrollable View */}
        <main className="flex-1 overflow-y-auto bg-[#090d16] pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals Mounted at Root */}
      <DispatchModal />
      <NewIncidentModal />
      <IncidentTimelineModal />
    </div>
  );
};

export default function App() {
  return (
    <DispatchProvider>
      <MainContent />
    </DispatchProvider>
  );
}
