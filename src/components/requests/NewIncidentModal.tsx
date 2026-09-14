import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  MapPin,
  User,
  Phone,
  Activity,
  Ambulance,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  EmergencyPriority,
  EmergencyType,
  AmbulanceType,
  EmergencyRequest,
} from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const NewIncidentModal: React.FC = () => {
  const { isNewIncidentModalOpen, closeNewIncidentModal, createEmergencyRequest, openDispatchModal } =
    useDispatchContext();

  const [emergencyType, setEmergencyType] = useState<EmergencyType>('Cardiac Emergency');
  const [priority, setPriority] = useState<EmergencyPriority>('CRITICAL');
  const [patientName, setPatientName] = useState('Arthur Mitchell (Age 52)');
  const [callerName, setCallerName] = useState('Bystander Officer');
  const [contactNumber, setContactNumber] = useState('+1 (555) 392-8810');
  const [location, setLocation] = useState('7th Ave & W 42nd St, Times Square');
  const [latitude, setLatitude] = useState(40.7565);
  const [longitude, setLongitude] = useState(-73.9865);
  const [numberOfPatients, setNumberOfPatients] = useState(1);
  const [requiredAmbulanceType, setRequiredAmbulanceType] = useState<AmbulanceType>('ALS');
  const [notes, setNotes] = useState('Patient collapsed with severe chest pressure, unconscious.');
  const [immediateDispatch, setImmediateDispatch] = useState(true);

  if (!isNewIncidentModalOpen) return null;

  const presets = [
    {
      name: 'Times Square',
      loc: '7th Ave & W 42nd St, Times Square',
      lat: 40.7565,
      lng: -73.9865,
    },
    {
      name: 'Grand Central',
      loc: '89 E 42nd St, Grand Central Concourse',
      lat: 40.7527,
      lng: -73.9772,
    },
    {
      name: 'Penn Station',
      loc: '7th Ave & W 31st St, Penn Station 8th Ave exit',
      lat: 40.7505,
      lng: -73.9934,
    },
    {
      name: 'Central Park South',
      loc: '59th St & 5th Ave, Grand Army Plaza',
      lat: 40.7645,
      lng: -73.973,
    },
    {
      name: 'Chelsea Market',
      loc: '75 9th Ave, Chelsea Market Concourse',
      lat: 40.7424,
      lng: -74.006,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createEmergencyRequest({
      patientName,
      callerName,
      contactNumber,
      emergencyType,
      priority,
      location,
      latitude,
      longitude,
      numberOfPatients,
      requiredAmbulanceType,
      notes,
    });

    if (immediateDispatch) {
      openDispatchModal(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Log New Emergency Call (CAD Ingestion)
              </h2>
              <p className="text-xs text-slate-400">Input 911 incident details for immediate dispatch</p>
            </div>
          </div>

          <button
            onClick={closeNewIncidentModal}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Emergency Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Emergency Type *
              </label>
              <select
                value={emergencyType}
                onChange={(e) => {
                  const val = e.target.value as EmergencyType;
                  setEmergencyType(val);
                  if (val === 'Cardiac Emergency' || val === 'Major Accident') {
                    setPriority('CRITICAL');
                    setRequiredAmbulanceType('ALS');
                  } else if (val === 'Stroke Alert') {
                    setPriority('CRITICAL');
                    setRequiredAmbulanceType('MICU');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Cardiac Emergency">Cardiac Emergency</option>
                <option value="Major Accident">Major Accident</option>
                <option value="Severe Trauma">Severe Trauma</option>
                <option value="Breathing Difficulty">Breathing Difficulty</option>
                <option value="Stroke Alert">Stroke Alert</option>
                <option value="Severe Injury">Severe Injury</option>
                <option value="Fall / Fracture">Fall / Fracture</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Pediatric Emergency">Pediatric Emergency</option>
                <option value="Obstetric / Maternity">Obstetric / Maternity</option>
              </select>
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority Level *
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as EmergencyPriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        isSelected
                          ? p === 'CRITICAL'
                            ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950'
                            : p === 'HIGH'
                            ? 'bg-orange-600 text-white border-orange-500'
                            : p === 'MEDIUM'
                            ? 'bg-yellow-600 text-white border-yellow-500'
                            : 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {p === 'CRITICAL' ? '🔴' : p === 'HIGH' ? '🟠' : p === 'MEDIUM' ? '🟡' : '🟢'}{' '}
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Patient / Victim Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. John Doe, Male, Age ~45"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>

            {/* Caller Name & Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Caller & Contact Number
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  placeholder="Caller Name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Callback Phone"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Location & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Location Address & Coordinates *
              </label>
              <div className="flex items-center space-x-1.5 text-[11px] text-cyan-400">
                <Sparkles className="w-3 h-3" />
                <span>Presets:</span>
                {presets.map((p) => (
                  <button
                    type="button"
                    key={p.name}
                    onClick={() => {
                      setLocation(p.loc);
                      setLatitude(p.lat);
                      setLongitude(p.lng);
                    }}
                    className="hover:underline text-slate-400 hover:text-white px-1 font-mono"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Street address, building, floor or intersection"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              required
            />

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
                <span className="text-slate-400 font-mono">LAT:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="bg-transparent text-white font-mono w-full focus:outline-none text-xs"
                />
              </div>
              <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
                <span className="text-slate-400 font-mono">LNG:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="bg-transparent text-white font-mono w-full focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Unit Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Required Ambulance Tier
              </label>
              <select
                value={requiredAmbulanceType}
                onChange={(e) => setRequiredAmbulanceType(e.target.value as AmbulanceType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="ALS">ALS - Advanced Life Support (Paramedic + Cardiac Telemetry)</option>
                <option value="BLS">BLS - Basic Life Support (EMT Basic + Oxygen/AED)</option>
                <option value="MICU">MICU - Mobile Intensive Care Unit (Critical Care / Physician)</option>
                <option value="NEONATAL">NEONATAL - Pediatric / Incubator Specialized</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Number of Patients / Casualties
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={numberOfPatients}
                onChange={(e) => setNumberOfPatients(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Clinical Triage Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Triage & Dispatch Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Clinical symptoms, access codes, scene hazards..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Prompt checkbox for immediate dispatch modal */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="immediateDispatch"
              checked={immediateDispatch}
              onChange={(e) => setImmediateDispatch(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="immediateDispatch" className="text-xs text-slate-300 cursor-pointer select-none">
              Immediately open <span className="text-red-400 font-bold">Smart Dispatch Engine</span> after creating
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeNewIncidentModal}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-red-950/50 transition cursor-pointer flex items-center space-x-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Log & Queue Incident</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
