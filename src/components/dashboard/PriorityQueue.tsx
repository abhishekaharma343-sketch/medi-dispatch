import React from 'react';
import {
  AlertTriangle,
  Zap,
  Users,
  MapPin,
  Clock,
  Ambulance as AmbulanceIcon,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { EmergencyPriority, EmergencyRequest } from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const PriorityQueue: React.FC = () => {
  const { requests, openDispatchModal, openTimelineModal, stats, setActiveTab } = useDispatchContext();

  // Priority ranking order
  const priorityWeight: Record<EmergencyPriority, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  // Filter for active (non-completed/cancelled) incidents, sorted by priority and pending status
  const activeQueue = [...requests]
    .filter((r) => r.status !== 'COMPLETED' && r.status !== 'CANCELLED')
    .sort((a, b) => {
      // First sort by priority weight descending
      const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (pDiff !== 0) return pDiff;

      // Pending items take priority over already assigned items
      const aIsPending = a.status === 'PENDING' || a.status === 'NEW' ? 1 : 0;
      const bIsPending = b.status === 'PENDING' || b.status === 'NEW' ? 1 : 0;
      if (bIsPending !== aIsPending) return bIsPending - aIsPending;

      return 0;
    });

  const getPriorityBadge = (priority: EmergencyPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>🔴 Critical</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>🟠 High</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span>🟡 Medium</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>🟢 Low</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: EmergencyRequest['status']) => {
    switch (status) {
      case 'NEW':
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            PENDING DISPATCH
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            ASSIGNED
          </span>
        );
      case 'EN_ROUTE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            EN ROUTE
          </span>
        );
      case 'ARRIVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
            ON SCENE
          </span>
        );
      case 'PATIENT_PICKED_UP':
      case 'HOSPITAL_TRANSPORT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            HOSPITAL TRANSIT
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Emergency Priority Queue</h2>
            <p className="text-[11px] text-slate-400">Live triage ranking sorted by clinical acuity</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
            {activeQueue.length} Active
          </span>
          <button
            onClick={() => setActiveTab('requests')}
            className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 cursor-pointer font-medium"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Resource shortage banner within queue if active */}
      {stats.isResourceShortage && (
        <div className="px-3.5 py-2 bg-red-950/60 border-b border-red-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-semibold">{stats.shortageMessage}</span>
          </div>
          <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-1.5 py-0.5 rounded font-mono">
            High Demand
          </span>
        </div>
      )}

      {/* Queue List */}
      <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[480px]">
        {activeQueue.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-sm">No active emergency requests in queue.</p>
            <p className="text-xs text-slate-400 mt-1">Simulate incoming 911 calls from the top bar.</p>
          </div>
        ) : (
          activeQueue.map((incident, index) => {
            const isPending = incident.status === 'PENDING' || incident.status === 'NEW';
            const isCritical = incident.priority === 'CRITICAL';

            return (
              <div
                key={incident.id}
                className={`p-3.5 transition-all hover:bg-slate-800/50 ${
                  isCritical && isPending ? 'bg-red-950/20 border-l-4 border-l-red-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-3">
                    <span className="font-mono text-xs font-bold text-slate-400 pt-0.5">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => openTimelineModal(incident)}
                          className="font-mono font-bold text-xs text-slate-200 hover:text-cyan-400 cursor-pointer transition"
                        >
                          {incident.id}
                        </button>
                        <h4 className="font-semibold text-sm text-white">
                          {incident.emergencyType}
                        </h4>
                        {getPriorityBadge(incident.priority)}
                        {getStatusBadge(incident.status)}
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center space-x-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{incident.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{incident.requestTime}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>
                            {incident.numberOfPatients} {incident.numberOfPatients > 1 ? 'Patients' : 'Patient'}
                          </span>
                        </span>
                        <span className="text-slate-400 font-mono text-[11px] bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                          Req: {incident.requiredAmbulanceType}
                        </span>
                      </div>

                      {incident.notes && (
                        <p className="mt-1.5 text-xs text-slate-400 line-clamp-1 italic">
                          "{incident.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center space-x-2">
                    {isPending ? (
                      <button
                        onClick={() => openDispatchModal(incident)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold shadow-md shadow-red-950/50 cursor-pointer transition active:scale-95 border border-red-400/40"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Dispatch Now</span>
                      </button>
                    ) : (
                      <div className="text-right">
                        <div className="text-xs font-mono font-semibold text-cyan-400 flex items-center space-x-1 justify-end">
                          <AmbulanceIcon className="w-3.5 h-3.5" />
                          <span>{incident.assignedAmbulanceId}</span>
                        </div>
                        <button
                          onClick={() => openTimelineModal(incident)}
                          className="text-[11px] text-slate-400 hover:text-white cursor-pointer mt-0.5"
                        >
                          View Timeline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
