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
import { Menu, X, ArrowLeft, Home } from 'lucide-react';

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

  const getPageName = () => {
    switch (activeTab) {
      case 'requests':
        return 'Emergency Requests';
      case 'ambulances':
        return 'Ambulances';
      case 'map':
        return 'Live Map';
      case 'trips':
        return 'Active Trips';
      case 'history':
        return 'Incident History';
      case 'reports':
        return 'Reports & Analytics';
      default:
        return 'Home';
    }
  };

  const showEmergencyBanner = activeTab !== 'dashboard';

  const goHome = () => {
    setActiveTab('dashboard');
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Header */}
      <Header />

      {/* Emergency Alert */}
      {showEmergencyBanner && <EmergencyBanner />}

      {/* Mobile Navigation */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 shrink-0 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-xs font-semibold text-slate-200 truncate">
            {getPageName()}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 active:bg-slate-600 transition-all shadow-sm"
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileMenuOpen ? (
            <>
              <X className="w-4 h-4" />
              <span className="text-xs font-bold">Close</span>
            </>
          ) : (
            <>
              <Menu className="w-4 h-4" />
              <span className="text-xs font-bold">Menu</span>
            </>
          )}
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex shrink-0">
          <Sidebar
            currentTab={activeTab}
            onSelectTab={setActiveTab}
          />
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 shadow-2xl">
              <div className="h-full overflow-y-auto pt-2">
                <Sidebar
                  currentTab={activeTab}
                  onSelectTab={(tab) => {
                    setActiveTab(tab);
                    setMobileMenuOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main View */}
        <main className="flex-1 overflow-y-auto bg-[#090d16] pb-12">
          {/* Back to Home */}
          {activeTab !== 'dashboard' && (
            <div className="sticky top-0 z-30 px-4 sm:px-6 py-3 bg-[#090d16]/95 backdrop-blur border-b border-slate-800">
              <button
                type="button"
                onClick={goHome}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          )}

          {renderActiveView()}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-4 py-4 text-center">
        <p className="text-xs text-slate-500">
          © 2026 MEDI-Dispatch. All Rights Reserved by Team ASR.
        </p>
      </footer>

      {/* Global Modals */}
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