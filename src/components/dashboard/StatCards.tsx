import React from 'react';
import {
  AlertOctagon,
  Clock,
  Ambulance,
  Radio,
  CheckCircle2,
  Navigation,
  FileText,
} from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';

export const StatCards: React.FC = () => {
  const { stats, setActiveTab } = useDispatchContext();

  const cards = [
    {
      id: 'total-req',
      label: 'Total Emergency Requests',
      value: stats.totalRequests,
      subtext: 'Today across all sectors',
      icon: FileText,
      color: 'from-slate-900 to-slate-950',
      borderColor: 'border-slate-800',
      iconColor: 'text-slate-300',
      badgeColor: 'bg-slate-800 text-slate-300',
      onClick: () => setActiveTab('requests'),
    },
    {
      id: 'critical-req',
      label: 'Critical Requests',
      value: stats.criticalRequests,
      subtext: stats.criticalRequests > 0 ? '🔴 Immediate response vital' : 'No critical emergencies',
      icon: AlertOctagon,
      color: 'from-red-950/40 to-slate-950',
      borderColor: stats.criticalRequests > 0 ? 'border-red-500/50' : 'border-slate-800',
      iconColor: 'text-red-400',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      pulse: stats.criticalRequests > 0,
      onClick: () => setActiveTab('requests'),
    },
    {
      id: 'pending-req',
      label: 'Pending Requests',
      value: stats.pendingRequests,
      subtext: 'Awaiting unit dispatch',
      icon: Clock,
      color: 'from-amber-950/40 to-slate-950',
      borderColor: stats.pendingRequests > 0 ? 'border-amber-500/40' : 'border-slate-800',
      iconColor: 'text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      onClick: () => setActiveTab('requests'),
    },
    {
      id: 'avail-amb',
      label: 'Available Ambulances',
      value: stats.availableAmbulances,
      subtext: '🟢 In service & station standby',
      icon: Ambulance,
      color: 'from-emerald-950/40 to-slate-950',
      borderColor: 'border-emerald-500/40',
      iconColor: 'text-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      onClick: () => setActiveTab('ambulances'),
    },
    {
      id: 'en-route',
      label: 'Ambulances En Route',
      value: stats.ambulancesEnRoute,
      subtext: '🔵 Siren / Emergency transit',
      icon: Navigation,
      color: 'from-blue-950/40 to-slate-950',
      borderColor: 'border-blue-500/40',
      iconColor: 'text-blue-400',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      onClick: () => setActiveTab('trips'),
    },
    {
      id: 'busy-amb',
      label: 'Busy / On Mission',
      value: stats.busyAmbulances,
      subtext: 'Engaged in emergency ops',
      icon: Radio,
      color: 'from-purple-950/40 to-slate-950',
      borderColor: 'border-purple-500/40',
      iconColor: 'text-purple-400',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      onClick: () => setActiveTab('ambulances'),
    },
    {
      id: 'completed-trips',
      label: 'Completed Trips',
      value: stats.completedTripsCount,
      subtext: 'Safely delivered to ER',
      icon: CheckCircle2,
      color: 'from-slate-900 to-slate-950',
      borderColor: 'border-slate-800',
      iconColor: 'text-teal-400',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      onClick: () => setActiveTab('history'),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className={`relative p-3.5 rounded-xl border bg-gradient-to-b ${card.color} ${card.borderColor} shadow-sm hover:shadow-md hover:border-slate-600 transition-all cursor-pointer select-none group flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-300 transition">
                {card.label}
              </span>
              <div
                className={`p-1.5 rounded-lg border bg-slate-900/80 ${card.borderColor} ${
                  card.pulse ? 'animate-pulse' : ''
                }`}
              >
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl lg:text-3xl font-extrabold font-mono text-white tracking-tight">
                {card.value}
              </span>
            </div>

            <div className="mt-1 text-[10px] text-slate-400 font-medium truncate">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
