import React from 'react';
import { Ambulance as AmbulanceIcon, Fuel, Users, ChevronRight, Activity } from 'lucide-react';
import { Ambulance, AmbulanceStatus } from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const FleetQuickView: React.FC = () => {
  const { ambulances, setActiveTab } = useDispatchContext();

  const getStatusBadge = (status: AmbulanceStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AVAILABLE</span>
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            <span>ASSIGNED</span>
          </span>
        );
      case 'EN_ROUTE':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>EN ROUTE</span>
          </span>
        );
      case 'AT_INCIDENT':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            <span>AT SCENE</span>
          </span>
        );
      case 'TRANSPORTING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>TRANSPORT</span>
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            <span>OFFLINE / MAINT</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <AmbulanceIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Ambulance Fleet Status</h3>
            <p className="text-[11px] text-slate-400">Active telemetry and readiness overview</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('ambulances')}
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer font-medium"
        >
          <span>Fleet Grid</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5">
        {ambulances.map((amb) => (
          <div
            key={amb.id}
            className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-sm text-white">{amb.id}</span>
                <span className="text-[10px] font-mono text-slate-400 ml-2">({amb.type})</span>
              </div>
              {getStatusBadge(amb.status)}
            </div>

            <div className="text-xs text-slate-300 truncate">
              📍 {amb.currentLocation}
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center space-x-1 truncate max-w-[130px]" title={amb.driverName}>
                <Users className="w-3 h-3 text-slate-400" />
                <span>{amb.driverName}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Fuel className="w-3 h-3 text-amber-400" />
                <span className={amb.fuelLevel < 40 ? 'text-red-400 font-bold' : ''}>
                  {amb.fuelLevel}%
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
