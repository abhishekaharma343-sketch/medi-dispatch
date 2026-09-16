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

  const showEmergencyBanner = activeTab !== 'dashboard';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Header */}
      <Header />

      {/* Emergency Alert - hidden on clean homepage */}
      {showEmergencyBanner && <EmergencyBanner />}

      {/* Mobile Navigation */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-xs font-semibold text-slate-300">
            {activeTab === 'dashboard'
              ? 'Home'
              : activeTab === 'requests'
                ? 'Emergency Requests'
                : activeTab === 'ambulances'
                  ? 'Ambulances'
                  : activeTab === 'map'
                    ? 'Live Map'
                    : activeTab === 'trips'
                      ? 'Active Trips'
                      : activeTab === 'history'
                        ? 'Incident History'
                        : activeTab === 'reports'
                          ? 'Reports'
                          : 'Control Center'}
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          aria-label="Open navigation"
        >
          {mobileMenuOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
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
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-950 border-r border-slate-800 shadow-2xl">
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
          {renderActiveView()}
        </main>
      </div>

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
