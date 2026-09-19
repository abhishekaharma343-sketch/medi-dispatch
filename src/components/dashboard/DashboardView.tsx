import React from 'react';
import {
  Activity,
  Ambulance,
  BarChart3,
  BellRing,
  ChevronRight,
  History,
  MapPinned,
  Route,
} from 'lucide-react';

import { useDispatchContext } from '../../context/DispatchContext';
import { IndianAmbulanceAnimation } from '../home/IndianAmbulanceAnimation';
import { MediAssistAI } from '../ai/MediAssistAI';

export const DashboardView: React.FC = () => {
  const { setActiveTab, stats } = useDispatchContext();

  const features = [
    {
      id: 'requests',
      title: 'Emergency Requests',
      description: 'View and manage incoming emergencies',
      icon: BellRing,
      count: stats.pendingRequests,
      label: 'pending',
      card:
        'from-red-500/10 to-red-500/5 border-red-500/20',
      iconBox:
        'bg-red-500/10 text-red-400',
    },
    {
      id: 'ambulances',
      title: 'Ambulances',
      description: 'Check fleet availability and status',
      icon: Ambulance,
      count: stats.availableAmbulances,
      label: 'available',
      card:
        'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
      iconBox:
        'bg-emerald-500/10 text-emerald-400',
    },
    {
      id: 'map',
      title: 'Live Map',
      description: 'Track ambulances and emergency incidents',
      icon: MapPinned,
      count: null,
      label: 'GPS tracking',
      card:
        'from-blue-500/10 to-blue-500/5 border-blue-500/20',
      iconBox:
        'bg-blue-500/10 text-blue-400',
    },
    {
      id: 'trips',
      title: 'Active Trips',
      description: 'Monitor ongoing ambulance trips',
      icon: Route,
      count: stats.busyAmbulances,
      label: 'active',
      card:
        'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
      iconBox:
        'bg-cyan-500/10 text-cyan-400',
    },
    {
      id: 'history',
      title: 'Incident History',
      description: 'Review emergency incident history',
      icon: History,
      count: stats.completedTripsCount,
      label: 'completed',
      card:
        'from-slate-500/10 to-slate-500/5 border-slate-700',
      iconBox:
        'bg-slate-800 text-slate-300',
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'View operational performance data',
      icon: BarChart3,
      count: null,
      label: 'analytics',
      card:
        'from-violet-500/10 to-violet-500/5 border-violet-500/20',
      iconBox:
        'bg-violet-500/10 text-violet-400',
    },
  ];

  return (
    <div className="min-h-full w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8 text-center">

          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <Activity className="h-7 w-7 text-red-400" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            MEDI-Dispatch
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Emergency Response Control Center
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-xs font-medium text-emerald-400">
              System Online
            </span>
          </div>
        </div>

        {/* ================= AMBULANCE ANIMATION ================= */}
        <div className="mb-8">
          <IndianAmbulanceAnimation />
        </div>

        {/* ================= MEDI-ASSIST ================= */}
        <div className="mb-8">
          <MediAssistAI />
        </div>

        {/* ================= SERVICE TITLE ================= */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-slate-800" />

            <h2 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Control Center
            </h2>

            <span className="h-px w-8 bg-slate-800" />
          </div>
        </div>

        {/* ================= SERVICE CARDS ================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => setActiveTab(feature.id)}
                className={[
                  'group rounded-2xl border bg-gradient-to-br p-5 text-left',
                  'transition-all duration-200',
                  'hover:-translate-y-1 hover:border-slate-600',
                  'hover:bg-slate-900/80',
                  'focus:outline-none focus:ring-2 focus:ring-red-500/40',
                  feature.card,
                ].join(' ')}
              >

                {/* CARD TOP */}
                <div className="flex items-start justify-between">

                  <div
                    className={[
                      'flex h-11 w-11 items-center justify-center rounded-xl',
                      feature.iconBox,
                    ].join(' ')}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-slate-300" />
                </div>

                {/* CARD CONTENT */}
                <div className="mt-5">

                  <h3 className="text-sm font-bold text-slate-100">
                    {feature.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-400">
                    {feature.description}
                  </p>

                </div>

                {/* CARD FOOTER */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">

                  <span className="text-[11px] text-slate-500">
                    {feature.count !== null
                      ? `${feature.count} ${feature.label}`
                      : feature.label}
                  </span>

                  <span className="text-[11px] font-medium text-slate-500 transition-colors group-hover:text-slate-300">
                    Open
                  </span>

                </div>
              </button>
            );
          })}

        </div>

        {/* ================= BOTTOM INFO ================= */}
        <div className="mt-8 text-center">

          <p className="text-[11px] text-slate-600">
            Select a service above to open its control panel
          </p>

        </div>

      </div>
    </div>
  );
};