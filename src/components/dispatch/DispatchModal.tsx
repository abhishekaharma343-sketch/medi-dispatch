import React, { useState, useMemo } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Shield,
  Navigation,
  Fuel,
  Users,
  Award,
  Sparkles,
  Info,
} from 'lucide-react';
import { Ambulance, EmergencyPriority, EmergencyRequest } from '../../types/dispatch';
import { calculateAmbulanceRecommendations } from '../../services/recommendation';
import { useDispatchContext } from '../../context/DispatchContext';

export const DispatchModal: React.FC = () => {
  const {
    selectedIncidentForDispatch,
    closeDispatchModal,
    ambulances,
    assignAmbulance,
  } = useDispatchContext();

  const [confirmTargetAmbulance, setConfirmTargetAmbulance] = useState<Ambulance | null>(null);

  const recommendations = useMemo(() => {
    if (!selectedIncidentForDispatch) return [];
    return calculateAmbulanceRecommendations(selectedIncidentForDispatch, ambulances);
  }, [selectedIncidentForDispatch, ambulances]);

  if (!selectedIncidentForDispatch) return null;

  const incident = selectedIncidentForDispatch;
  const topRecommended = recommendations.find((r) => r.isRecommended) || recommendations[0];

  const handleConfirmAssignment = () => {
    if (!confirmTargetAmbulance) return;
    assignAmbulance(incident.id, confirmTargetAmbulance.id);
    setConfirmTargetAmbulance(null);
  };

  const getPriorityBadge = (priority: EmergencyPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            🔴 Critical Priority
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
            🟠 High Priority
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
            🟡 Medium Priority
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            🟢 Low Priority
          </span>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-150 flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-extrabold text-white tracking-wide">
                    Dispatch Assignment Console
                  </span>
                  <span className="font-mono text-xs bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700 font-bold">
                    {incident.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Smart unit triage matching incident acuity with fleet availability & transit times
                </p>
              </div>
            </div>

            <button
              onClick={closeDispatchModal}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-5 space-y-5">
            {/* Incident Summary Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-bold text-lg text-white">{incident.emergencyType}</h3>
                  {getPriorityBadge(incident.priority)}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Call Logged: <span className="text-slate-200 font-bold">{incident.requestTime}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Location:</span>
                  <span className="text-slate-200 font-medium flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{incident.location}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Patient / Victims:</span>
                  <span className="text-slate-200 font-medium">
                    {incident.patientName} ({incident.numberOfPatients} patient)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Required Ambulance Tier:</span>
                  <span className="text-cyan-400 font-mono font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60 inline-block">
                    {incident.requiredAmbulanceType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Destination Hospital:</span>
                  <span className="text-slate-200 font-medium truncate block" title={incident.destinationHospitalName}>
                    {incident.destinationHospitalName || 'Metro Central Trauma Center'}
                  </span>
                </div>
              </div>

              {incident.notes && (
                <div className="mt-3 pt-2 border-t border-slate-800/60 text-xs text-slate-400 flex items-start space-x-1.5">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Triage Note:</strong> {incident.notes}
                  </span>
                </div>
              )}
            </div>

            {/* Smart Top Recommendation Spotlight */}
            {topRecommended && (
              <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/50 via-slate-950 to-slate-950 border-2 border-emerald-500/60 rounded-xl p-4 shadow-xl">
                <div className="absolute top-0 right-0 bg-emerald-600 text-white font-mono text-[11px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>TOP RECOMMENDED UNIT</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-2xl font-black text-white">
                        {topRecommended.ambulance.id}
                      </span>
                      <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                        Score: {topRecommended.overallScore}/100
                      </span>
                      <span className="text-xs font-mono text-slate-300">
                        ({topRecommended.ambulance.type})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs">
                      <div>
                        <span className="text-slate-400">Distance:</span>{' '}
                        <span className="font-bold text-white font-mono">
                          {topRecommended.distanceKm} km
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Est. Arrival (ETA):</span>{' '}
                        <span className="font-bold text-emerald-400 font-mono">
                          ~{topRecommended.etaMinutes} mins
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Driver:</span>{' '}
                        <span className="font-semibold text-slate-200">
                          {topRecommended.ambulance.driverName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>{' '}
                        <span className="font-bold text-emerald-400">
                          {topRecommended.ambulance.status}
                        </span>
                      </div>
                    </div>

                    {/* Recommendation reasons list */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {topRecommended.reasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded-md flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{reason}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Assign Button */}
                  <div className="shrink-0 flex items-center">
                    <button
                      onClick={() => setConfirmTargetAmbulance(topRecommended.ambulance)}
                      className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 cursor-pointer transition active:scale-95 flex items-center justify-center space-x-2 border border-emerald-400/40"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Assign {topRecommended.ambulance.id}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other Available & Fleet Units Ranked */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  All Units Ranked by Proximity & Suitability ({recommendations.length})
                </h4>
                <span className="text-[11px] text-slate-400">
                  Select any unit below to override recommendation
                </span>
              </div>

              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
                {recommendations.map((rec) => {
                  const amb = rec.ambulance;
                  const isAvail = amb.status === 'AVAILABLE';

                  return (
                    <div
                      key={amb.id}
                      className={`p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-800/40 transition ${
                        rec.isRecommended ? 'bg-emerald-950/15' : ''
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-sm text-white">{amb.id}</span>
                          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {amb.vehicleNumber}
                          </span>
                          <span className="text-xs font-semibold text-cyan-400 font-mono">
                            {amb.type}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                              isAvail
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {amb.status}
                          </span>
                          {rec.isRecommended && (
                            <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                              RECOMMENDED
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Navigation className="w-3 h-3 text-cyan-400" />
                            <strong className="text-slate-200">{rec.distanceKm} km away</strong>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <strong className="text-slate-200">~{rec.etaMinutes} min ETA</strong>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{amb.currentLocation}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span>
                              {amb.driverName} • {amb.medicalCrew.length} crew
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Manual Assignment Button */}
                      <div className="shrink-0 flex items-center justify-end">
                        <button
                          onClick={() => setConfirmTargetAmbulance(amb)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition flex items-center space-x-1.5 ${
                            isAvail
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600'
                              : 'bg-amber-950/40 text-amber-300 border border-amber-800/40 hover:bg-amber-900/50'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Assign {amb.id}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog Required By Prompt:
          "Assign Ambulance AMB-102 to Incident INC-2045?" */}
      {confirmTargetAmbulance && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-100">
          <div className="bg-slate-900 border border-red-500/50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/50 text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Dispatch Order</h3>
                <p className="text-xs text-slate-400">Official Computer Aided Dispatch Directive</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                Assign Ambulance{' '}
                <span className="text-red-400 font-mono font-bold text-base">
                  {confirmTargetAmbulance.id}
                </span>{' '}
                to Incident{' '}
                <span className="text-cyan-400 font-mono font-bold text-base">
                  {incident.id}
                </span>
                ?
              </p>
              <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                <div>
                  <strong>Target Incident:</strong> {incident.emergencyType} ({incident.priority})
                </div>
                <div>
                  <strong>Location:</strong> {incident.location}
                </div>
                <div>
                  <strong>Unit Crew:</strong> {confirmTargetAmbulance.driverName} & team
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmTargetAmbulance(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignment}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-red-950/60 transition cursor-pointer flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Dispatch Unit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
