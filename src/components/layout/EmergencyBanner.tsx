import React from 'react';
import { AlertTriangle, ChevronRight, Zap } from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';

export const EmergencyBanner: React.FC = () => {
  const { stats, setActiveTab } = useDispatchContext();

  if (!stats.isResourceShortage) return null;

  return (
    <div className="bg-red-950/60 border-b border-red-500/30 px-4 py-2 flex items-center justify-between gap-4 text-white">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 shrink-0 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-red-400" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-300 border border-red-500/20 px-2 py-0.5 rounded">
              Resource Alert
            </span>

            <span className="text-xs sm:text-sm font-semibold text-red-100 truncate">
              {stats.shortageMessage}
            </span>
          </div>

          <p className="hidden sm:block text-[11px] text-red-300/70 mt-0.5">
            Critical triage protocol active. Additional ambulance support may be required.
          </p>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('requests')}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition active:scale-95"
      >
        <Zap className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Triage Queue</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};