import React from 'react';
import {
  LayoutDashboard,
  BellRing,
  Ambulance,
  MapPin,
  Route,
  History,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { stats, t } = useDispatchContext();

  const navItems = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
      badge: stats.pendingRequests > 0 ? `${stats.pendingRequests} Pnd` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'requests',
      label: t('emergencyRequests'),
      icon: BellRing,
      badge: stats.criticalRequests > 0 ? `${stats.criticalRequests} Crit` : undefined,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse',
    },
    {
      id: 'ambulances',
      label: t('ambulances'),
      icon: Ambulance,
      badge: `${stats.availableAmbulances} Avail`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'map',
      label: t('liveMap'),
      icon: MapPin,
      badge: 'GPS',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'trips',
      label: t('activeTrips'),
      icon: Route,
      badge: stats.busyAmbulances > 0 ? `${stats.busyAmbulances} Active` : undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'history',
      label: t('incidentHistory'),
      icon: History,
      badge: `${stats.completedTripsCount} Done`,
      badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
    },
    {
      id: 'reports',
      label: t('reports'),
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/90 flex flex-col justify-between shrink-0 select-none">
      {/* Main Navigation Links */}
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
          {t('dispatchNav')}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-red-600/15 text-red-300 border border-red-500/30 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-red-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fleet Status Summary Widget at Bottom */}
      <div className="p-3 m-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span className="flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>{t('fleetReadiness')}</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            {stats.availableAmbulances}/{stats.availableAmbulances + stats.busyAmbulances} {t('units')}
          </span>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{
              width: `${
                ((stats.availableAmbulances /
                  Math.max(1, stats.availableAmbulances + stats.busyAmbulances)) *
                  100) || 0
              }%`,
            }}
          />
          <div
            className="bg-cyan-500 h-full transition-all duration-500"
            style={{
              width: `${
                ((stats.ambulancesEnRoute /
                  Math.max(1, stats.availableAmbulances + stats.busyAmbulances)) *
                  100) || 0
              }%`,
            }}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-500"
            style={{
              width: `${
                ((stats.transportingAmbulances /
                  Math.max(1, stats.availableAmbulances + stats.busyAmbulances)) *
                  100) || 0
              }%`,
            }}
          />
        </div>

        <div className="grid grid-cols-3 text-[10px] font-mono text-center pt-1 border-t border-slate-800 text-slate-400">
          <div>
            <span className="text-emerald-400 font-bold block">{stats.availableAmbulances}</span>
            <span>{t('avail')}</span>
          </div>
          <div>
            <span className="text-cyan-400 font-bold block">{stats.ambulancesEnRoute}</span>
            <span>{t('enRoute')}</span>
          </div>
          <div>
            <span className="text-amber-400 font-bold block">{stats.transportingAmbulances}</span>
            <span>{t('atHosp')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
