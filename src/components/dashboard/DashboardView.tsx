import React from 'react';
import {
  BellRing,
  Ambulance,
  MapPinned,
  Route,
  History,
  BarChart3,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';
import { IndianAmbulanceAnimation } from '../home/IndianAmbulanceAnimation';
import { MediAssistAI } from './ai/MediAssistAI';

export const DashboardView: React.FC = () => {
  const { setActiveTab, stats } = useDispatchContext();

  const features = [
    {
      id: 'requests',
      title: 'Emergency Requests',
      description: 'View and manage incoming emergencies',
      icon: BellRing,
      count: stats.pendingRequests,
      countLabel: 'pending',
      className: 'from-red-500/10 to-red-500/5 border-red-500/20',
      iconClass: 'bg-red-500/10 text-red-400',
    },
    {
      id: 'ambulances',
      title: 'Ambulances',
      description: 'Check fleet availability and status',
      icon: Ambulance,
      count: stats.availableAmbulances,
      countLabel: 'available',
      className:
        'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
      iconClass: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      id: 'map',
      title: 'Live Map',
      description: 'Track ambulances and incidents',
      icon: MapPinned,
      count: null,
      countLabel: 'GPS tracking',
      className: 'from-blue-500/10 to-blue-500/5 border-blue-500/20',
      iconClass: 'bg-blue-500/10 text-blue-400',
    },
    {
      id: 'trips',
      title: 'Active Trips',
      description: 'Monitor ongoing ambulance trips',
      icon: Route,
      count: stats.busyAmbulances,
      countLabel: 'active',
      className: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
      iconClass: 'bg-cyan-500/10 text-cyan-400',
    },
    {
      id: 'history',
      title: 'Incident History',
      description: 'Review completed emergency incidents',
      icon: History,
      count: stats.completedTripsCount,
      countLabel: 'completed',
      className: 'from-slate-500/10 to-slate-500/5 border-slate-700',
      iconClass: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'View operational performance data',
      icon: BarChart3,
      count: null,
      countLabel: 'analytics',
      className: 'from-violet-500/10 to-violet-500/5 border-violet-500/20',
      iconClass: 'bg-violet-500/10 text-violet-400',
    },
  ];

  return (
    <div className="min-h-full flex items-center justify-center p-5 sm:p-8">
      <div className="w-full max-w-5xl">

        {/* Home Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
            <Activity className="w-7 h-7 text-red-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            MEDI-Dispatch
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Emergency Response Control Center
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-xs font-medium text-emerald-400">
              System Online
            </span>
          </div>
        </div>

        {/* Animated Indian Ambulance */}
        <div className="mb-8">
          <IndianAmbulanceAnimation />
        </div>

        {/* MEDI-Assist AI */}
        <div className="mb-8">
          <MediAssistAI />
        </div>

        {/* Service Heading */}
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 text-center">
            Select a service
          </h2>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => setActiveTab(feature.id)}
                className={`group text-left p-5 rounded-2xl border bg-gradient-to-br ${feature.className} hover:border-slate-600 hover:bg-slate-900/80 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500/40`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${feature.iconClass}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-bold text-slate-100">
                    {feature.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-400">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {feature.count !== null
                      ? `${feature.count} ${feature.countLabel}`
                      : feature.countLabel}
                  </span>

                  <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                    Open
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Hint */}
        <p className="text-center text-[11px] text-slate-600 mt-8">
          Select any service above to open its control panel
        </p>
      </div>
    </div>
  );
};