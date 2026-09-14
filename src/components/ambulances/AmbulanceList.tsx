import React, { useState, useMemo } from 'react';
import {
  Ambulance as AmbulanceIcon,
  Search,
  Filter,
  Fuel,
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  Radio,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { Ambulance, AmbulanceStatus, AmbulanceType } from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const AmbulanceList: React.FC = () => {
  const { ambulances, updateAmbulanceStatus, openTimelineModal, requests } = useDispatchContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredAmbulances = useMemo(() => {
    return ambulances.filter((amb) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        amb.id.toLowerCase().includes(term) ||
        amb.vehicleNumber.toLowerCase().includes(term) ||
        amb.driverName.toLowerCase().includes(term) ||
        amb.currentLocation.toLowerCase().includes(term) ||
        amb.medicalCrew.some((c) => c.toLowerCase().includes(term));

      const matchesStatus = statusFilter === 'ALL' || amb.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || amb.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [ambulances, searchTerm, statusFilter, typeFilter]);

  const getStatusBadge = (status: AmbulanceStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🟢 Available</span>
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span>🟡 Assigned</span>
          </span>
        );
      case 'EN_ROUTE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>🔵 En Route</span>
          </span>
        );
      case 'AT_INCIDENT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span>🟠 At Incident</span>
          </span>
        );
      case 'TRANSPORTING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>🟣 Transporting</span>
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span>⚫ Maintenance</span>
          </span>
        );
    }
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-4">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Ambulance Fleet Management</span>
            <span className="text-xs font-mono bg-slate-800 border border-slate-700 text-emerald-400 px-2 py-0.5 rounded">
              {filteredAmbulances.length} Units Online
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of vehicle telemetry, operational status, and paramedic crew deployments
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
              viewMode === 'cards' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cards View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
              viewMode === 'table' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search unit ID, vehicle reg, driver, crew..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Unit Statuses</option>
            <option value="AVAILABLE">🟢 Available Only</option>
            <option value="ASSIGNED">🟡 Assigned</option>
            <option value="EN_ROUTE">🔵 En Route</option>
            <option value="AT_INCIDENT">🟠 At Incident</option>
            <option value="TRANSPORTING">🟣 Transporting</option>
            <option value="MAINTENANCE">⚫ Maintenance / Offline</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Vehicle Types</option>
            <option value="ALS">ALS - Advanced Life Support</option>
            <option value="BLS">BLS - Basic Life Support</option>
            <option value="MICU">MICU - Mobile Intensive Care</option>
            <option value="NEONATAL">NEONATAL - Critical Pediatric</option>
          </select>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAmbulances.map((amb) => {
            const isAvailable = amb.status === 'AVAILABLE';
            const isMaint = amb.status === 'MAINTENANCE';
            const activeIncident = requests.find((r) => r.id === amb.currentIncidentId);

            return (
              <div
                key={amb.id}
                className={`bg-slate-900/90 border rounded-xl overflow-hidden shadow-lg flex flex-col justify-between transition-all hover:border-slate-700 ${
                  isAvailable
                    ? 'border-emerald-500/30'
                    : isMaint
                    ? 'border-slate-800 opacity-75'
                    : 'border-slate-800'
                }`}
              >
                {/* Card Top */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-extrabold text-base text-white">
                          {amb.id}
                        </span>
                        <span className="font-mono text-[11px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                          {amb.vehicleNumber}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold mt-0.5 block">
                        Tier: {amb.type}
                      </span>
                    </div>

                    {getStatusBadge(amb.status)}
                  </div>

                  {/* Location & Station */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-start space-x-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="font-medium">{amb.currentLocation}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-5">
                      Base: {amb.baseStation}
                    </div>
                  </div>

                  {/* Driver & Crew */}
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-[11px] text-slate-400">Driver:</span>
                      <span className="font-semibold text-slate-200">{amb.driverName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Medical Crew:</span>
                      <div className="space-y-0.5">
                        {amb.medicalCrew.map((crew, i) => (
                          <span
                            key={i}
                            className="text-[11px] text-slate-300 block truncate font-mono"
                          >
                            • {crew}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Current Incident Badge if engaged */}
                  {activeIncident && (
                    <div className="p-2 bg-blue-950/40 border border-blue-800/40 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-blue-400 font-mono block">
                          Assigned Incident
                        </span>
                        <span className="font-bold text-slate-200">{activeIncident.id}</span>
                      </div>
                      <button
                        onClick={() => openTimelineModal(activeIncident)}
                        className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  )}

                  {/* Equipment */}
                  <div className="text-[11px] text-slate-400 truncate">
                    <span className="text-slate-400">Equipment:</span> {amb.equipmentRating}
                  </div>
                </div>

                {/* Card Bottom / Actions */}
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Fuel className="w-3.5 h-3.5 text-amber-400" />
                      <span>{amb.fuelLevel}%</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{amb.lastUpdated}</span>
                    </span>
                  </div>

                  {/* Quick Maintenance / Available Toggle for Demo */}
                  {isAvailable ? (
                    <button
                      onClick={() => updateAmbulanceStatus(amb.id, 'MAINTENANCE')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-sans font-semibold transition cursor-pointer"
                    >
                      Set Maint
                    </button>
                  ) : isMaint ? (
                    <button
                      onClick={() => updateAmbulanceStatus(amb.id, 'AVAILABLE')}
                      className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-sans font-bold transition cursor-pointer"
                    >
                      Restore Unit
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">Dispatched</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Unit ID</th>
                  <th className="py-3 px-3.5">Plate / Type</th>
                  <th className="py-3 px-3.5">Current Location</th>
                  <th className="py-3 px-3.5">Driver & Crew</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Active Mission</th>
                  <th className="py-3 px-3.5">Fuel</th>
                  <th className="py-3 px-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAmbulances.map((amb) => (
                  <tr key={amb.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-white text-sm">
                      {amb.id}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-mono text-slate-200">{amb.vehicleNumber}</div>
                      <div className="text-[10px] text-cyan-400 font-semibold">{amb.type}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="text-slate-200 font-medium">{amb.currentLocation}</div>
                      <div className="text-[10px] text-slate-400">Base: {amb.baseStation}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-medium text-slate-200">{amb.driverName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                        {amb.medicalCrew.join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-3.5">{getStatusBadge(amb.status)}</td>
                    <td className="py-3 px-3.5 font-mono">
                      {amb.currentIncidentId ? (
                        <span className="text-yellow-400 font-bold">{amb.currentIncidentId}</span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-mono">
                      <span className={amb.fuelLevel < 40 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                        {amb.fuelLevel}%
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      {amb.status === 'AVAILABLE' ? (
                        <button
                          onClick={() => updateAmbulanceStatus(amb.id, 'MAINTENANCE')}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold cursor-pointer"
                        >
                          Maintenance
                        </button>
                      ) : amb.status === 'MAINTENANCE' ? (
                        <button
                          onClick={() => updateAmbulanceStatus(amb.id, 'AVAILABLE')}
                          className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Make Available
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">In Mission</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
