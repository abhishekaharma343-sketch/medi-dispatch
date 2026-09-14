import React from 'react';
import {
  X,
  Clock,
  MapPin,
  Ambulance,
  Hospital,
  User,
  CheckCircle2,
  FileText,
  Printer,
  Shield,
  Phone,
} from 'lucide-react';
import { EmergencyRequest } from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const IncidentTimelineModal: React.FC = () => {
  const { selectedIncidentForTimeline, closeTimelineModal } = useDispatchContext();

  if (!selectedIncidentForTimeline) return null;

  const incident = selectedIncidentForTimeline;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-white">
                  CAD Audit Trail & Incident Timeline
                </span>
                <span className="font-mono text-xs bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700 font-bold">
                  {incident.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verifiable chronological record for emergency response and medical oversight
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              title="Print Incident Audit"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={closeTimelineModal}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-5">
          {/* Incident Overview Card */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-base font-bold text-white block">
                  {incident.emergencyType}
                </span>
                <span className="text-xs text-slate-400">
                  Patient: <strong className="text-slate-200">{incident.patientName}</strong>
                </span>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block">FINAL STATUS</span>
                <span className="font-bold text-emerald-400">{incident.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Scene Location:</span>
                <span className="text-slate-200 font-medium flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{incident.location}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Assigned Unit & Crew:</span>
                <span className="text-cyan-300 font-medium font-mono flex items-center space-x-1">
                  <Ambulance className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{incident.assignedAmbulanceId || 'None assigned'}</span>
                </span>
                {incident.assignedDriver && (
                  <span className="text-[11px] text-slate-400 block">
                    Driver: {incident.assignedDriver}
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Receiving Hospital:</span>
                <span className="text-emerald-300 font-medium flex items-center space-x-1">
                  <Hospital className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{incident.destinationHospitalName || 'Metro Central ER'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Chronological Timeline Required by Prompt:
              Example timeline:
              10:42 PM — Emergency request received
              10:43 PM — Ambulance AMB-102 assigned
              10:45 PM — Ambulance departed
              10:53 PM — Ambulance arrived
              10:57 PM — Patient picked up
              11:10 PM — Arrived at hospital
              11:12 PM — Trip completed */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">
              Chronological Audit Trail ({incident.timeline.length} Events)
            </h4>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {incident.timeline.map((evt, idx) => (
                <div key={evt.id || idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 shadow group-hover:border-slate-700 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {evt.time}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        By: {evt.actor}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-200 font-medium">
                      {evt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-end shrink-0">
          <button
            onClick={closeTimelineModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
