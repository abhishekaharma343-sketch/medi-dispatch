import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  PlusCircle,
  PhoneCall,
  Activity,
  RotateCcw,
  Radio,
  Flame,
} from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';

export const Header: React.FC = () => {
  const {
    soundEnabled,
    toggleSound,
    openNewIncidentModal,
    simulateIncoming911Call,
    simulateSurge,
    resetToSampleData,
    stats,
  } = useDispatchContext();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const localTimeFormatted = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const utcTimeFormatted = currentTime.toUTCString().slice(17, 25);

  return (
    <header className="bg-slate-950/95 backdrop-blur border-b border-slate-800 text-slate-100 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-md">
      {/* Brand & Tagline */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-red-950/50">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-red-400 via-rose-300 to-white bg-clip-text text-transparent">
              MEDI-Dispatch
            </span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE CAD</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
            Faster Response. Smarter Dispatch. Saving Lives.
          </p>
        </div>
      </div>

      {/* Control Room Live Clock */}
      <div className="hidden lg:flex items-center space-x-4 bg-slate-900/90 border border-slate-800/80 px-3.5 py-1.5 rounded-lg shadow-inner">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
            LOCAL TIME (EDT)
          </span>
          <span className="text-sm font-mono font-bold text-white tracking-widest">
            {localTimeFormatted}
          </span>
        </div>
        <div className="h-6 w-px bg-slate-800"></div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
            UTC TIME
          </span>
          <span className="text-sm font-mono font-semibold text-slate-300 tracking-widest">
            {utcTimeFormatted}Z
          </span>
        </div>
        <div className="h-6 w-px bg-slate-800"></div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono text-emerald-400 font-semibold">ONLINE</span>
        </div>
      </div>

      {/* Quick Action Simulator Controls */}
      <div className="flex items-center space-x-2">
        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Alert Audio' : 'Unmute Alert Audio'}
          className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center justify-center ${
            soundEnabled
              ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
              : 'bg-slate-900 border-red-900/50 text-slate-500 hover:bg-slate-800'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
        </button>

        {/* Simulate 911 Call */}
        <button
          onClick={simulateIncoming911Call}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-red-950/40 border border-red-400/40 cursor-pointer transition active:scale-95"
          title="Simulate realistic emergency call arrival"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Simulate 911 Call</span>
          <span className="sm:hidden">911</span>
        </button>

        {/* Simulate Surge Test */}
        <button
          onClick={simulateSurge}
          className="flex items-center space-x-1 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold cursor-pointer transition active:scale-95"
          title="Simulate multi-casualty surge event"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Surge Test</span>
        </button>

        {/* Manual Incident */}
        <button
          onClick={openNewIncidentModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Create Incident</span>
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={resetToSampleData}
          title="Reset back to initial demo dataset"
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Operator Profile */}
        <div className="hidden xl:flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-amber-300">
            04
          </div>
          <div className="text-left">
            <div className="text-[11px] font-bold text-slate-200 leading-tight">S. Jenkins</div>
            <div className="text-[9px] text-slate-400 font-mono">Console 04 (Active)</div>
          </div>
        </div>
      </div>
    </header>
  );
};
