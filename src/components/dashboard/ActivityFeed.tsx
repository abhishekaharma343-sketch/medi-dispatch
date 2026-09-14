import React from 'react';
import {
  BellRing,
  CheckCircle2,
  Navigation,
  MapPin,
  Ambulance,
  UserCheck,
  AlertTriangle,
  Radio,
  Clock,
} from 'lucide-react';
import { ActivityEvent } from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const ActivityFeed: React.FC = () => {
  const { activityLogs } = useDispatchContext();

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'NEW_REQUEST':
        return <BellRing className="w-3.5 h-3.5 text-rose-400" />;
      case 'AMBULANCE_ASSIGNED':
        return <Radio className="w-3.5 h-3.5 text-yellow-400" />;
      case 'DEPARTED':
        return <Navigation className="w-3.5 h-3.5 text-blue-400" />;
      case 'ARRIVED':
        return <MapPin className="w-3.5 h-3.5 text-orange-400" />;
      case 'PATIENT_PICKED_UP':
        return <UserCheck className="w-3.5 h-3.5 text-purple-400" />;
      case 'HOSPITAL_TRANSPORT':
        return <Ambulance className="w-3.5 h-3.5 text-indigo-400" />;
      case 'TRIP_COMPLETED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'AMBULANCE_AVAILABLE':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ALERT':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      {/* Feed Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Live Dispatch Event Log</h3>
            <p className="text-[11px] text-slate-400">Real-time control-room telemetry stream</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded font-bold">
          LIVE STREAM
        </span>
      </div>

      {/* Feed Stream */}
      <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[480px] p-2 space-y-1">
        {activityLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No recent events logged.</div>
        ) : (
          activityLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-lg hover:bg-slate-800/50 transition-colors flex items-start space-x-3 text-xs"
            >
              <div className="p-1.5 rounded-md bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                {getEventIcon(log.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 leading-snug font-medium break-words">
                  {log.message}
                </p>
                <div className="mt-1 flex items-center space-x-3 text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{log.timestamp}</span>
                  </span>
                  {log.incidentId && (
                    <span className="text-slate-400 font-semibold">{log.incidentId}</span>
                  )}
                  {log.ambulanceId && (
                    <span className="text-cyan-400 font-semibold">{log.ambulanceId}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
