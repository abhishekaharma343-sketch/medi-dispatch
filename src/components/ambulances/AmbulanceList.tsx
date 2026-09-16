import React, { useMemo, useState } from 'react';
import {
  Ambulance as AmbulanceIcon,
  Search,
  Fuel,
  Users,
  MapPin,
  Clock,
  Wrench,
  CheckCircle2,
  Radio,
  LayoutGrid,
  List,
  ChevronRight,
} from 'lucide-react';
import {
  Ambulance,
  AmbulanceStatus,
} from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const AmbulanceList: React.FC = () => {
  const {
    ambulances,
    updateAmbulanceStatus,
    openTimelineModal,
    requests,
  } = useDispatchContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredAmbulances = useMemo(() => {
    return ambulances.filter((amb) => {
      const term = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !term ||
        amb.id.toLowerCase().includes(term) ||
        amb.vehicleNumber.toLowerCase().includes(term) ||
        amb.driverName.toLowerCase().includes(term) ||
        amb.currentLocation.toLowerCase().includes(term) ||
        amb.medicalCrew.some((crew) =>
          crew.toLowerCase().includes(term)
        );

      const matchesStatus =
        statusFilter === 'ALL' || amb.status === statusFilter;

      const matchesType =
        typeFilter === 'ALL' || amb.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [ambulances, searchTerm, statusFilter, typeFilter]);

  const availableCount = ambulances.filter(
    (amb) => amb.status === 'AVAILABLE'
  ).length;

  const activeCount = ambulances.filter(
    (amb) =>
      amb.status === 'ASSIGNED' ||
      amb.status === 'EN_ROUTE' ||
      amb.status === 'AT_INCIDENT' ||
      amb.status === 'TRANSPORTING'
  ).length;

  const maintenanceCount = ambulances.filter(
    (amb) => amb.status === 'MAINTENANCE'
  ).length;

  const getStatusBadge = (status: AmbulanceStatus) => {
    const config = {
      AVAILABLE: {
        label: 'Available',
        className:
          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-400',
      },
      ASSIGNED: {
        label: 'Assigned',
        className:
          'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
        dot: 'bg-yellow-400',
      },
      EN_ROUTE: {
        label: 'En Route',
        className:
          'bg-blue-500/10 text-blue-300 border-blue-500/20',
        dot: 'bg-blue-400',
      },
      AT_INCIDENT: {
        label: 'At Incident',
        className:
          'bg-orange-500/10 text-orange-300 border-orange-500/20',
        dot: 'bg-orange-400',
      },
      TRANSPORTING: {
        label: 'Transporting',
        className:
          'bg-purple-500/10 text-purple-300 border-purple-500/20',
        dot: 'bg-purple-400',
      },
      MAINTENANCE: {
        label: 'Maintenance',
        className:
          'bg-slate-800 text-slate-400 border-slate-700',
        dot: 'bg-slate-500',
      },
    }[status];

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-semibold ${config.className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1700px] mx-auto space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Ambulances
              </h1>

              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                {filteredAmbulances.length} units
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Monitor fleet availability, location and active assignments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'cards'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-white'
                }`}
                title="Card view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-white'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fleet Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Total Fleet
            </p>
            <p className="text-lg font-bold text-white mt-0.5">
              {ambulances.length}
            </p>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-emerald-500/70">
              Available
            </p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">
              {availableCount}
            </p>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-blue-400/70">
              On Mission
            </p>
            <p className="text-lg font-bold text-blue-400 mt-0.5">
              {activeCount}
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Maintenance
            </p>
            <p className="text-lg font-bold text-slate-400 mt-0.5">
              {maintenanceCount}
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />

            <input
              type="text"
              placeholder="Search ambulance, vehicle, driver or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="AT_INCIDENT">At Incident</option>
            <option value="TRANSPORTING">Transporting</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
          >
            <option value="ALL">All Types</option>
            <option value="ALS">ALS</option>
            <option value="BLS">BLS</option>
            <option value="MICU">MICU</option>
            <option value="NEONATAL">Neonatal</option>
          </select>
        </div>
      </div>

      {/* No Results */}
      {filteredAmbulances.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl py-16 text-center">
          <AmbulanceIcon className="w-8 h-8 text-slate-700 mx-auto" />

          <h3 className="text-sm font-semibold text-slate-300 mt-4">
            No ambulances found
          </h3>

          <p className="text-xs text-slate-600 mt-1">
            Try changing your search or filters.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAmbulances.map((amb: Ambulance) => {
            const isAvailable = amb.status === 'AVAILABLE';
            const isMaintenance = amb.status === 'MAINTENANCE';

            const activeIncident = requests.find(
              (request) => request.id === amb.currentIncidentId
            );

            return (
              <div
                key={amb.id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden transition hover:border-slate-700 ${
                  isAvailable
                    ? 'border-emerald-500/20'
                    : 'border-slate-800'
                }`}
              >
                {/* Main */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isAvailable
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <AmbulanceIcon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">
                            {amb.id}
                          </span>

                          <span className="text-[10px] font-mono text-slate-500">
                            {amb.vehicleNumber}
                          </span>
                        </div>

                        <span className="text-[10px] text-cyan-400 font-semibold">
                          {amb.type}
                        </span>
                      </div>
                    </div>

                    {getStatusBadge(amb.status)}
                  </div>

                  {/* Location */}
                  <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-300">
                          {amb.currentLocation}
                        </p>

                        <p className="text-[10px] text-slate-600 mt-1">
                          Base: {amb.baseStation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Driver */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-600">
                        <Radio className="w-3 h-3" />
                        Driver
                      </div>

                      <p className="text-xs font-semibold text-slate-300 mt-1 truncate">
                        {amb.driverName}
                      </p>
                    </div>

                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-600">
                        <Users className="w-3 h-3" />
                        Crew
                      </div>

                      <p className="text-xs font-semibold text-slate-300 mt-1">
                        {amb.medicalCrew.length} members
                      </p>
                    </div>
                  </div>

                  {/* Active Incident */}
                  {activeIncident && (
                    <div className="mt-3 flex items-center justify-between bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-blue-400/70">
                          Active Incident
                        </p>

                        <p className="text-xs font-mono font-bold text-blue-300 mt-1">
                          {activeIncident.id}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          openTimelineModal(activeIncident)
                        }
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        View
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom */}
                <div className="px-4 py-3 bg-slate-950 border-t border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Fuel className="w-3.5 h-3.5 text-amber-400" />
                        {amb.fuelLevel}%
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {amb.lastUpdated}
                      </span>
                    </div>

                    {isAvailable ? (
                      <button
                        onClick={() =>
                          updateAmbulanceStatus(
                            amb.id,
                            'MAINTENANCE'
                          )
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold transition"
                      >
                        <Wrench className="w-3 h-3" />
                        Maintenance
                      </button>
                    ) : isMaintenance ? (
                      <button
                        onClick={() =>
                          updateAmbulanceStatus(
                            amb.id,
                            'AVAILABLE'
                          )
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold transition"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Available
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-600">
                        On mission
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 border-b border-slate-800">
                <tr className="text-[10px] uppercase tracking-wider text-slate-600">
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Mission</th>
                  <th className="px-4 py-3">Fuel</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {filteredAmbulances.map((amb: Ambulance) => (
                  <tr
                    key={amb.id}
                    className="hover:bg-slate-800/30 transition"
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono font-bold text-white">
                        {amb.id}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        {amb.vehicleNumber}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-xs text-cyan-400 font-semibold">
                      {amb.type}
                    </td>

                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-xs text-slate-300 truncate">
                        {amb.currentLocation}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-300">
                      {amb.driverName}
                    </td>

                    <td className="px-4 py-3">
                      {getStatusBadge(amb.status)}
                    </td>

                    <td className="px-4 py-3 text-xs font-mono text-blue-300">
                      {amb.currentIncidentId || '—'}
                    </td>

                    <td className="px-4 py-3 text-xs font-mono">
                      <span
                        className={
                          amb.fuelLevel < 40
                            ? 'text-red-400 font-bold'
                            : 'text-slate-300'
                        }
                      >
                        {amb.fuelLevel}%
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      {amb.status === 'AVAILABLE' ? (
                        <button
                          onClick={() =>
                            updateAmbulanceStatus(
                              amb.id,
                              'MAINTENANCE'
                            )
                          }
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold"
                        >
                          Maintenance
                        </button>
                      ) : amb.status === 'MAINTENANCE' ? (
                        <button
                          onClick={() =>
                            updateAmbulanceStatus(
                              amb.id,
                              'AVAILABLE'
                            )
                          }
                          className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                        >
                          Make Available
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-600">
                          On mission
                        </span>
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