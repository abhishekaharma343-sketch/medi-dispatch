import React from 'react';
import {
  LayoutDashboard,
  BellRing,
  Ambulance,
  MapPin,
  Route,
  History,
  BarChart3,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { stats, t } = useDispatchContext();

  const navItems = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
    },
    {
      id: 'requests',
      label: t('emergencyRequests'),
      icon: BellRing,
      badge: stats.pendingRequests > 0 ? stats.pendingRequests : undefined,
    },
    {
      id: 'ambulances',
      label: t('ambulances'),
      icon: Ambulance,
      badge:
        stats.availableAmbulances > 0
          ? stats.availableAmbulances
          : undefined,
    },
    {
      id: 'map',
      label: t('liveMap'),
      icon: MapPin,
    },
    {
      id: 'trips',
      label: t('activeTrips'),
      icon: Route,
      badge: stats.busyAmbulances > 0 ? stats.busyAmbulances : undefined,
    },
    {
      id: 'history',
      label: t('incidentHistory'),
      icon: History,
    },
    {
      id: 'reports',
      label: t('reports'),
      icon: BarChart3,
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-slate-950 border-r border-slate-800 flex-col">
      {/* Header */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Ambulance className="w-5 h-5 text-red-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              MEDI-Dispatch
            </h2>

            <p className="text-[10px] text-slate-500 mt-0.5">
              Control Center
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Navigation
        </p>

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                  isActive
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-red-400'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />

                <span className="flex-1 text-sm font-medium">
                  {item.label}
                </span>

                {item.badge !== undefined && (
                  <span
                    className={`min-w-6 h-5 px-1.5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-red-400/70" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* System Status */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <span className="text-xs font-semibold text-emerald-400">
              System Online
            </span>
          </div>

          <p className="text-[10px] text-slate-500 mt-2 leading-4">
            Emergency dispatch services are operational.
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="px-3 pb-4">
        <button
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
            currentTab === 'settings'
              ? 'bg-slate-800 text-white'
              : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};