import React from 'react';
import { AlertTriangle, ChevronRight, Zap } from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';

export const EmergencyBanner: React.FC = () => {
  const { stats, setActiveTab } = useDispatchContext();

  if (!stats.isResourceShortage) return null;

  return (
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-b border-red-500/50 px-4 py-2.5 flex items-center justify-between text-white shadow-lg animate-pulse transition-all">
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-red-600/40 rounded-lg border border-red-400/50 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-300 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-red-500 px-2 py-0.5 rounded text-white font-mono">
              Shortage Alert
            </span>
            <span className="font-semibold text-red-100 text-sm md:text-base">
              {stats.shortageMessage}
            </span>
          </div>
          <p className="text-xs text-red-300/90 hidden sm:block">
            Critical triage protocol in effect. Secondary mutual-aid standby recommended.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActiveTab('requests')}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md text-xs font-semibold shadow transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Triage Queue</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
