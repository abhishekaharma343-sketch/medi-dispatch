import React, { useState } from 'react';
import {
  Route,
  Navigation,
  Clock,
  MapPin,
  Ambulance as AmbulanceIcon,
  CheckCircle2,
  Play,
  Pause,
  Activity,
  Heart,
  Hospital as HospitalIcon,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { ActiveTrip, RequestStatus } from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const TripTracker: React.FC = () => {
  const { trips, advanceTripStep, updateTripStage, openTimelineModal, requests } =
    useDispatchContext();

  const [selectedTripId, setSelectedTripId] = useState<string>(
    trips.length > 0 ? trips[0].id : ''
  );

  const [autoSimulate, setAutoSimulate] = useState<boolean>(false);

  // Active selected trip
  const activeTrip = trips.find((t) => t.id === selectedTripId) || trips[0];
  const relatedIncident = activeTrip
    ? requests.find((r) => r.id === activeTrip.incidentId)
    : null;

  const stages: Array<{
    key: RequestStatus;
    title: string;
    sub: string;
  }> = [
    { key: 'PENDING', title: 'Emergency Received', sub: 'CAD Logged' },
    { key: 'ASSIGNED', title: 'Ambulance Assigned', sub: 'Crew Notified' },
    { key: 'EN_ROUTE', title: 'En Route', sub: 'Siren / Lights' },
    { key: 'ARRIVED', title: 'Arrived at Scene', sub: 'Assessment Active' },
    { key: 'PATIENT_PICKED_UP', title: 'Patient Picked Up', sub: 'Stabilized in Unit' },
    { key: 'HOSPITAL_TRANSPORT', title: 'Hospital Transport', sub: 'In Transit to ER' },
    { key: 'COMPLETED', title: 'Completed', sub: 'ER Handover Done' },
  ];

  const currentStageIndex = activeTrip
    ? stages.findIndex((s) => s.key === activeTrip.status)
    : 0;

  // Auto progression effect for demo
  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (autoSimulate && activeTrip) {
      timer = setInterval(() => {
        advanceTripStep(activeTrip.id);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [autoSimulate, activeTrip, advanceTripStep]);

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-4">
      {/* Title & Trip Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Mission & Trip Lifecycle Tracking</span>
            <span className="text-xs font-mono bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 px-2 py-0.5 rounded">
              {trips.length} In Progress
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry, stage progression, and patient vital monitoring from dispatch to hospital handover
          </p>
        </div>

        {/* Demo Auto-advance Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoSimulate(!autoSimulate)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
              autoSimulate
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {autoSimulate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{autoSimulate ? 'Pause Auto Demo' : 'Auto-Step Simulation'}</span>
          </button>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <Route className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Active Emergency Trips</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All assigned ambulances have completed their missions. Use the priority queue or simulate a new 911 emergency to initiate a trip.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Trip Selector Cards */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
              Active Missions ({trips.length})
            </h3>

            <div className="space-y-2.5">
              {trips.map((trip) => {
                const isSelected = activeTrip?.id === trip.id;
                const inc = requests.find((r) => r.id === trip.incidentId);

                return (
                  <div
                    key={trip.id}
                    onClick={() => {
                      setSelectedTripId(trip.id);
                      setAutoSimulate(false);
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                        : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-sm text-white">
                            {trip.id}
                          </span>
                          <span className="text-xs font-mono bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800/40">
                            {trip.ambulanceId}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-300 mt-0.5 block">
                          {inc?.emergencyType || 'Emergency Incident'}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
                        {trip.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1">
                      <div className="flex items-center space-x-1 truncate text-slate-300">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{trip.pickupLocation}</span>
                      </div>
                      <div className="flex items-center space-x-1 truncate text-cyan-300/90">
                        <HospitalIcon className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{trip.destinationHospital}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800 text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Navigation className="w-3 h-3 text-cyan-400" />
                        <span>{trip.distanceRemainingKm} km</span>
                      </span>
                      <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                        <Clock className="w-3 h-3" />
                        <span>ETA: {trip.etaMinutes}m</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Mission Tracker for Selected Trip */}
          {activeTrip && (
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
                {/* Mission Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-2xl font-black text-white">
                        {activeTrip.id}
                      </span>
                      <span className="font-mono text-sm font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                        Unit: {activeTrip.ambulanceId}
                      </span>
                      <span className="font-mono text-sm font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Incident: {activeTrip.incidentId}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
                      <span>
                        Lead Driver: <strong className="text-slate-200">{activeTrip.driver}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Crew: <strong className="text-slate-200">{activeTrip.crew.join(', ')}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {relatedIncident && (
                      <button
                        onClick={() => openTimelineModal(relatedIncident)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition border border-slate-700"
                      >
                        Full Audit Timeline
                      </button>
                    )}
                  </div>
                </div>

                {/* Visual 7-Stage Stepper Required by Prompt:
                    Emergency Received → Ambulance Assigned → En Route → Arrived → Patient Picked Up → Hospital Transport → Completed */}
                <div className="py-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                    Mission Phase Progress
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {stages.map((stage, idx) => {
                      const isPast = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div
                          key={stage.key}
                          className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                            isCurrent
                              ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-950/50'
                              : isPast
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-300'
                              : 'bg-slate-950/40 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                                isCurrent
                                  ? 'bg-cyan-500 text-slate-950 animate-pulse'
                                  : isPast
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isPast ? '✓' : idx + 1}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold uppercase text-cyan-400 font-mono animate-pulse">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-white leading-tight">
                              {stage.title}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{stage.sub}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dispatcher Manual Stage Advancement Controls */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      Dispatcher Command Actions
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Manually trigger state changes or confirm telemetry milestones
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => updateTripStage(activeTrip.id, 'EN_ROUTE')}
                      disabled={activeTrip.status === 'EN_ROUTE'}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold cursor-pointer transition"
                    >
                      Mark En Route
                    </button>
                    <button
                      onClick={() => updateTripStage(activeTrip.id, 'ARRIVED')}
                      disabled={activeTrip.status === 'ARRIVED'}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold cursor-pointer transition"
                    >
                      Mark Arrived
                    </button>
                    <button
                      onClick={() => updateTripStage(activeTrip.id, 'PATIENT_PICKED_UP')}
                      disabled={activeTrip.status === 'PATIENT_PICKED_UP'}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold cursor-pointer transition"
                    >
                      Patient Picked Up
                    </button>
                    <button
                      onClick={() => updateTripStage(activeTrip.id, 'HOSPITAL_TRANSPORT')}
                      disabled={activeTrip.status === 'HOSPITAL_TRANSPORT'}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold cursor-pointer transition"
                    >
                      Hospital Transport
                    </button>
                    <button
                      onClick={() => updateTripStage(activeTrip.id, 'COMPLETED')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer transition flex items-center space-x-1 shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete Trip</span>
                    </button>
                  </div>
                </div>

                {/* Location Telemetry & Patient Vitals Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Route Details */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-2">
                      <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Navigation & Route Telemetry</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Pickup Scene:</span>
                        <span className="font-semibold text-white flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span>{activeTrip.pickupLocation}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Destination Hospital:</span>
                        <span className="font-semibold text-emerald-300 flex items-center space-x-1">
                          <HospitalIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{activeTrip.destinationHospital}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Current GPS Zone:</span>
                        <span className="text-slate-300 font-mono">
                          {activeTrip.currentLocation}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                        <div className="bg-slate-900 p-2 rounded-lg">
                          <span className="text-slate-400 block text-[10px]">REMAINING DISTANCE</span>
                          <span className="text-base font-bold text-white">
                            {activeTrip.distanceRemainingKm} km
                          </span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg">
                          <span className="text-slate-400 block text-[10px]">ESTIMATED ARRIVAL</span>
                          <span className="text-base font-bold text-emerald-400">
                            ~{activeTrip.etaMinutes} mins
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Vitals Card */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-2">
                      <Activity className="w-3.5 h-3.5 text-red-400" />
                      <span>On-Board Telemetry & Vitals</span>
                    </h4>

                    {activeTrip.vitals ? (
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                            <span className="text-[10px] text-slate-400 block font-mono">
                              HEART RATE
                            </span>
                            <span className="text-xl font-bold font-mono text-red-400 flex items-center justify-center space-x-1">
                              <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                              <span>{activeTrip.vitals.heartRate}</span>
                            </span>
                            <span className="text-[9px] text-slate-400">BPM</span>
                          </div>

                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                            <span className="text-[10px] text-slate-400 block font-mono">
                              BLOOD PRESSURE
                            </span>
                            <span className="text-xl font-bold font-mono text-cyan-400">
                              {activeTrip.vitals.bloodPressure}
                            </span>
                            <span className="text-[9px] text-slate-400">mmHg</span>
                          </div>

                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                            <span className="text-[10px] text-slate-400 block font-mono">
                              O2 SATURATION
                            </span>
                            <span className="text-xl font-bold font-mono text-emerald-400">
                              {activeTrip.vitals.spO2}%
                            </span>
                            <span className="text-[9px] text-slate-400">SpO2</span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-mono">
                            CLINICAL IMPRESSION
                          </span>
                          <span className="font-semibold text-slate-200">
                            {activeTrip.vitals.condition}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        Telemetry standing by for unit arrival on scene.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
