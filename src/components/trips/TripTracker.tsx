import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Ambulance,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  Hospital,
  MapPin,
  Navigation,
  Pause,
  Play,
  Route,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react';
import { RequestStatus } from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const TripTracker: React.FC = () => {
  const {
    trips,
    advanceTripStep,
    updateTripStage,
    openTimelineModal,
    requests,
  } = useDispatchContext();

  const [selectedTripId, setSelectedTripId] = useState(
    trips.length > 0 ? trips[0].id : ''
  );
  const [autoSimulate, setAutoSimulate] = useState(false);

  useEffect(() => {
    if (trips.length > 0 && !trips.some((trip) => trip.id === selectedTripId)) {
      setSelectedTripId(trips[0].id);
    }

    if (trips.length === 0) {
      setSelectedTripId('');
      setAutoSimulate(false);
    }
  }, [trips, selectedTripId]);

  const activeTrip = trips.find((trip) => trip.id === selectedTripId) || trips[0];

  const relatedIncident = activeTrip
    ? requests.find((request) => request.id === activeTrip.incidentId)
    : null;

  const stages: Array<{
    key: RequestStatus;
    title: string;
    short: string;
  }> = [
    {
      key: 'PENDING',
      title: 'Emergency Received',
      short: 'CAD Logged',
    },
    {
      key: 'ASSIGNED',
      title: 'Ambulance Assigned',
      short: 'Crew Notified',
    },
    {
      key: 'EN_ROUTE',
      title: 'En Route',
      short: 'Responding',
    },
    {
      key: 'ARRIVED',
      title: 'Arrived at Scene',
      short: 'Assessment',
    },
    {
      key: 'PATIENT_PICKED_UP',
      title: 'Patient Picked Up',
      short: 'Patient On Board',
    },
    {
      key: 'HOSPITAL_TRANSPORT',
      title: 'Hospital Transport',
      short: 'To Emergency Dept.',
    },
    {
      key: 'COMPLETED',
      title: 'Completed',
      short: 'ER Handover',
    },
  ];

  const currentStageIndex = activeTrip
    ? Math.max(
        0,
        stages.findIndex((stage) => stage.key === activeTrip.status)
      )
    : 0;

  useEffect(() => {
    if (!autoSimulate || !activeTrip || activeTrip.status === 'COMPLETED') {
      return;
    }

    const timer = setInterval(() => {
      advanceTripStep(activeTrip.id);
    }, 3500);

    return () => clearInterval(timer);
  }, [autoSimulate, activeTrip, advanceTripStep]);

  const tripStats = useMemo(() => {
    const total = trips.length;
    const enRoute = trips.filter((trip) => trip.status === 'EN_ROUTE').length;
    const arrived = trips.filter((trip) => trip.status === 'ARRIVED').length;
    const transporting = trips.filter(
      (trip) => trip.status === 'HOSPITAL_TRANSPORT'
    ).length;

    return {
      total,
      enRoute,
      arrived,
      transporting,
    };
  }, [trips]);

  const getStatusLabel = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return 'Received';
      case 'ASSIGNED':
        return 'Assigned';
      case 'EN_ROUTE':
        return 'En Route';
      case 'ARRIVED':
        return 'On Scene';
      case 'PATIENT_PICKED_UP':
        return 'Patient On Board';
      case 'HOSPITAL_TRANSPORT':
        return 'Hospital Transport';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  const getStatusClass = (status: RequestStatus) => {
    switch (status) {
      case 'EN_ROUTE':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'ARRIVED':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'PATIENT_PICKED_UP':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'HOSPITAL_TRANSPORT':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-full p-4 sm:p-5 lg:p-6 max-w-[1700px] mx-auto space-y-5">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Route className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-cyan-400">
              Operations
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Active Trips
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Monitor ambulance missions, patient transport and hospital handover.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
              Active
            </span>
            <span className="text-sm font-bold text-white">
              {tripStats.total}
            </span>
          </div>

          <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
              En Route
            </span>
            <span className="text-sm font-bold text-blue-400">
              {tripStats.enRoute}
            </span>
          </div>

          <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
              On Scene
            </span>
            <span className="text-sm font-bold text-amber-400">
              {tripStats.arrived}
            </span>
          </div>

          <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
              To Hospital
            </span>
            <span className="text-sm font-bold text-cyan-400">
              {tripStats.transporting}
            </span>
          </div>

          <button
            onClick={() => setAutoSimulate((value) => !value)}
            disabled={!activeTrip || activeTrip.status === 'COMPLETED'}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold border transition ${
              autoSimulate
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {autoSimulate ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400" />
            )}
            {autoSimulate ? 'Pause Simulation' : 'Auto Simulation'}
          </button>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="min-h-[420px] rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-5">
              <Route className="w-8 h-8 text-slate-500" />
            </div>

            <h2 className="text-lg font-bold text-white">
              No Active Trips
            </h2>

            <p className="text-sm text-slate-400 mt-2 leading-6">
              There are currently no ambulance missions in progress. Dispatch
              an ambulance from the Emergency Requests section to start a trip.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-5">
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-sm font-bold text-white">
                  Mission Queue
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select a trip to inspect live details
                </p>
              </div>

              <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                {trips.length} MISSIONS
              </span>
            </div>

            <div className="space-y-2.5">
              {trips.map((trip) => {
                const incident = requests.find(
                  (request) => request.id === trip.incidentId
                );
                const selected = activeTrip?.id === trip.id;

                return (
                  <button
                    key={trip.id}
                    onClick={() => {
                      setSelectedTripId(trip.id);
                      setAutoSimulate(false);
                    }}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      selected
                        ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white">
                            {trip.id}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
                            {trip.ambulanceId}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-300 mt-1 truncate">
                          {incident?.emergencyType || 'Emergency Incident'}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 px-2 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wide ${getStatusClass(
                          trip.status
                        )}`}
                      >
                        {getStatusLabel(trip.status)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                        <span className="text-xs text-slate-400 truncate">
                          {trip.pickupLocation}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <Hospital className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-xs text-slate-400 truncate">
                          {trip.destinationHospital}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <Navigation className="w-3 h-3 text-cyan-400" />
                        {trip.distanceRemainingKm} km
                      </span>

                      <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                        <Clock3 className="w-3 h-3" />
                        {trip.etaMinutes} min ETA
                      </span>

                      <ChevronRight
                        className={`w-3.5 h-3.5 transition ${
                          selected
                            ? 'text-cyan-400 translate-x-0.5'
                            : 'text-slate-600'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {activeTrip && (
            <section className="min-w-0 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
                <div className="p-5 border-b border-slate-800">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xl font-black text-white">
                          {activeTrip.id}
                        </span>

                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono font-bold text-cyan-300">
                          <Ambulance className="w-3.5 h-3.5" />
                          {activeTrip.ambulanceId}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wide ${getStatusClass(
                            activeTrip.status
                          )}`}
                        >
                          {getStatusLabel(activeTrip.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-400">
                        <span>
                          Incident:{' '}
                          <strong className="text-slate-200">
                            {activeTrip.incidentId}
                          </strong>
                        </span>

                        <span className="hidden sm:inline text-slate-700">
                          •
                        </span>

                        <span>
                          Driver:{' '}
                          <strong className="text-slate-200">
                            {activeTrip.driver}
                          </strong>
                        </span>

                        <span className="hidden sm:inline text-slate-700">
                          •
                        </span>

                        <span>
                          Crew:{' '}
                          <strong className="text-slate-200">
                            {activeTrip.crew.join(', ')}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {relatedIncident && (
                      <button
                        onClick={() => openTimelineModal(relatedIncident)}
                        className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        Audit Timeline
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-5 border-b border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Mission Progress
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Live lifecycle status
                      </p>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      STEP {currentStageIndex + 1} / {stages.length}
                    </span>
                  </div>

                  <div className="relative">
                    <div className="hidden lg:block absolute left-5 right-5 top-5 h-px bg-slate-800" />

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative">
                      {stages.map((stage, index) => {
                        const isPast = index < currentStageIndex;
                        const isCurrent = index === currentStageIndex;

                        return (
                          <div
                            key={stage.key}
                            className={`rounded-xl border p-3 min-h-[105px] ${
                              isCurrent
                                ? 'bg-cyan-500/10 border-cyan-500/40'
                                : isPast
                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                : 'bg-slate-950/50 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                                  isCurrent
                                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                    : isPast
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-900 text-slate-500 border-slate-700'
                                }`}
                              >
                                {isPast ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <span className="text-xs font-bold">
                                    {index + 1}
                                  </span>
                                )}
                              </div>

                              {isCurrent && (
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                              )}
                            </div>

                            <div className="mt-3">
                              <p className="text-[11px] font-bold text-slate-100 leading-4">
                                {stage.title}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">
                                {stage.short}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-950/30 border-b border-slate-800">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <h3 className="text-sm font-bold text-white">
                          Dispatcher Actions
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Confirm the current field milestone for this mission.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          updateTripStage(activeTrip.id, 'EN_ROUTE')
                        }
                        disabled={
                          activeTrip.status === 'EN_ROUTE' ||
                          currentStageIndex > 2
                        }
                        className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Mark En Route
                      </button>

                      <button
                        onClick={() =>
                          updateTripStage(activeTrip.id, 'ARRIVED')
                        }
                        disabled={currentStageIndex >= 3}
                        className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Mark Arrived
                      </button>

                      <button
                        onClick={() =>
                          updateTripStage(activeTrip.id, 'PATIENT_PICKED_UP')
                        }
                        disabled={currentStageIndex >= 4}
                        className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Patient On Board
                      </button>

                      <button
                        onClick={() =>
                          updateTripStage(activeTrip.id, 'HOSPITAL_TRANSPORT')
                        }
                        disabled={currentStageIndex >= 5}
                        className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Hospital Transport
                      </button>

                      <button
                        onClick={() =>
                          updateTripStage(activeTrip.id, 'COMPLETED')
                        }
                        disabled={activeTrip.status === 'COMPLETED'}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete Trip
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Navigation className="w-4 h-4 text-cyan-400" />
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Route Telemetry
                        </h3>
                        <p className="text-[10px] text-slate-500">
                          Current mission location
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="mt-0.5 w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-red-400" />
                        </div>

                        <div className="min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500">
                            Pickup Scene
                          </span>
                          <p className="text-xs font-semibold text-slate-200 mt-0.5">
                            {activeTrip.pickupLocation}
                          </p>
                        </div>
                      </div>

                      <div className="ml-3.5 h-4 border-l border-dashed border-slate-700" />

                      <div className="flex gap-3">
                        <div className="mt-0.5 w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Hospital className="w-3.5 h-3.5 text-emerald-400" />
                        </div>

                        <div className="min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500">
                            Destination Hospital
                          </span>
                          <p className="text-xs font-semibold text-emerald-300 mt-0.5">
                            {activeTrip.destinationHospital}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-slate-900 border border-slate-800 p-3">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500">
                            Current GPS Zone
                          </span>
                          <p className="text-xs font-mono font-semibold text-slate-200 mt-1 truncate">
                            {activeTrip.currentLocation}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-900 border border-slate-800 p-3">
                          <span className="text-[9px] uppercase tracking-wider text-slate-500">
                            Remaining
                          </span>
                          <p className="text-base font-bold text-white mt-0.5">
                            {activeTrip.distanceRemainingKm} km
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">
                          Estimated Arrival
                        </span>
                        <span className="text-sm font-bold font-mono text-emerald-400">
                          {activeTrip.etaMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <HeartPulse className="w-4 h-4 text-red-400" />
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Patient Telemetry
                        </h3>
                        <p className="text-[10px] text-slate-500">
                          On-board clinical monitoring
                        </p>
                      </div>
                    </div>

                    {activeTrip.vitals ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-center">
                            <span className="text-[9px] uppercase tracking-wider text-slate-500">
                              Heart Rate
                            </span>
                            <div className="flex items-center justify-center gap-1 mt-2">
                              <HeartPulse className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                              <span className="text-lg font-bold font-mono text-red-400">
                                {activeTrip.vitals.heartRate}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-600">
                              BPM
                            </span>
                          </div>

                          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-center">
                            <span className="text-[9px] uppercase tracking-wider text-slate-500">
                              Blood Pressure
                            </span>
                            <div className="mt-2">
                              <span className="text-lg font-bold font-mono text-cyan-400">
                                {activeTrip.vitals.bloodPressure}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-600">
                              mmHg
                            </span>
                          </div>

                          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-center">
                            <span className="text-[9px] uppercase tracking-wider text-slate-500">
                              SpO2
                            </span>
                            <div className="mt-2">
                              <span className="text-lg font-bold font-mono text-emerald-400">
                                {activeTrip.vitals.spO2}%
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-600">
                              Oxygen
                            </span>
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-[9px] uppercase tracking-wider text-slate-500">
                              Clinical Impression
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-200">
                            {activeTrip.vitals.condition}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-[180px] rounded-xl border border-dashed border-slate-800 bg-slate-900/40 flex items-center justify-center text-center px-5">
                        <div>
                          <HeartPulse className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                          <p className="text-xs font-semibold text-slate-400">
                            Patient telemetry not active
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            Vitals will appear when the patient is onboard.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                        Live Mission Monitoring
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{activeTrip.ambulanceId}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{activeTrip.destinationHospital}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};