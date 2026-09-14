import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Zap,
  Clock,
  MapPin,
  Phone,
  User,
  Users,
  Ambulance as AmbulanceIcon,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import {
  EmergencyRequest,
  EmergencyPriority,
  RequestStatus,
  EmergencyType,
} from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const RequestList: React.FC = () => {
  const {
    requests,
    openDispatchModal,
    openTimelineModal,
    openNewIncidentModal,
  } = useDispatchContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'id'>('priority');

  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        // Search term matching ID, patient, caller, location
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          req.id.toLowerCase().includes(term) ||
          req.patientName.toLowerCase().includes(term) ||
          req.callerName.toLowerCase().includes(term) ||
          req.location.toLowerCase().includes(term) ||
          req.contactNumber.toLowerCase().includes(term);

        // Priority filter
        const matchesPriority = priorityFilter === 'ALL' || req.priority === priorityFilter;

        // Status filter
        const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;

        // Emergency Type filter
        const matchesType = typeFilter === 'ALL' || req.emergencyType === typeFilter;

        return matchesSearch && matchesPriority && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const weights: Record<EmergencyPriority, number> = {
            CRITICAL: 4,
            HIGH: 3,
            MEDIUM: 2,
            LOW: 1,
          };
          return weights[b.priority] - weights[a.priority];
        } else if (sortBy === 'time') {
          return b.requestTime.localeCompare(a.requestTime);
        } else {
          return b.id.localeCompare(a.id);
        }
      });
  }, [requests, searchTerm, priorityFilter, statusFilter, typeFilter, sortBy]);

  const getPriorityBadge = (priority: EmergencyPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>🔴 Critical</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>🟠 High</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span>🟡 Medium</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>🟢 Low</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'NEW':
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            PENDING DISPATCH
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
            ASSIGNED
          </span>
        );
      case 'EN_ROUTE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse">
            EN ROUTE
          </span>
        );
      case 'ARRIVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
            ARRIVED AT SCENE
          </span>
        );
      case 'PATIENT_PICKED_UP':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            PATIENT ON BOARD
          </span>
        );
      case 'HOSPITAL_TRANSPORT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            HOSPITAL TRANSPORT
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            CANCELLED
          </span>
        );
    }
  };

  const emergencyTypes: EmergencyType[] = [
    'Cardiac Emergency',
    'Major Accident',
    'Severe Trauma',
    'Breathing Difficulty',
    'Stroke Alert',
    'Severe Injury',
    'Fall / Fracture',
    'Medical Emergency',
    'Pediatric Emergency',
    'Obstetric / Maternity',
  ];

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-4">
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Emergency Request Management</span>
            <span className="text-xs font-mono bg-slate-800 border border-slate-700 text-cyan-400 px-2 py-0.5 rounded">
              {filteredRequests.length} Incidents
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor, triage, and execute rapid dispatch assignments for incoming 911 incidents
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={openNewIncidentModal}
            className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold shadow-md shadow-red-950/40 border border-red-400/30 cursor-pointer transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Emergency Request</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ID, patient, location, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">🔴 Critical Only</option>
            <option value="HIGH">🟠 High</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="LOW">🟢 Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Dispatch</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="ARRIVED">Arrived Scene</option>
            <option value="PATIENT_PICKED_UP">Patient Picked Up</option>
            <option value="HOSPITAL_TRANSPORT">Hospital Transport</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Emergency Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Incident Types</option>
            {emergencyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'time' | 'id')}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="priority">Sort: Clinical Priority</option>
            <option value="time">Sort: Request Time</option>
            <option value="id">Sort: Incident ID</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Incident ID</th>
                <th className="py-3 px-3.5">Priority & Type</th>
                <th className="py-3 px-3.5">Patient / Caller</th>
                <th className="py-3 px-3.5">Location & Coordinates</th>
                <th className="py-3 px-3.5">Time / Patients</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Assigned Unit</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No emergency requests match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isPending = req.status === 'PENDING' || req.status === 'NEW';
                  const isCritical = req.priority === 'CRITICAL';

                  return (
                    <tr
                      key={req.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isCritical && isPending ? 'bg-red-950/20' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="py-3 px-3.5 font-mono font-bold text-white">
                        <button
                          onClick={() => openTimelineModal(req)}
                          className="hover:text-cyan-400 cursor-pointer flex items-center space-x-1"
                        >
                          <span>{req.id}</span>
                        </button>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          Req: {req.requiredAmbulanceType}
                        </span>
                      </td>

                      {/* Priority & Type */}
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-slate-100">{req.emergencyType}</div>
                        <div className="mt-1">{getPriorityBadge(req.priority)}</div>
                      </td>

                      {/* Patient & Caller */}
                      <td className="py-3 px-3.5">
                        <div className="font-medium text-slate-200 flex items-center space-x-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{req.patientName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{req.contactNumber}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3.5 max-w-[240px]">
                        <div className="text-slate-200 font-medium truncate flex items-center space-x-1" title={req.location}>
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{req.location}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {req.latitude.toFixed(4)}, {req.longitude.toFixed(4)}
                        </div>
                      </td>

                      {/* Time & Patients */}
                      <td className="py-3 px-3.5 font-mono">
                        <div className="flex items-center space-x-1 text-slate-300">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{req.requestTime}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400 mt-0.5 text-[11px]">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>{req.numberOfPatients} Victim(s)</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5">{getStatusBadge(req.status)}</td>

                      {/* Assigned Unit */}
                      <td className="py-3 px-3.5 font-mono">
                        {req.assignedAmbulanceId ? (
                          <div>
                            <span className="text-cyan-400 font-bold flex items-center space-x-1">
                              <AmbulanceIcon className="w-3.5 h-3.5" />
                              <span>{req.assignedAmbulanceId}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[130px]" title={req.assignedDriver}>
                              Driver: {req.assignedDriver}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {isPending ? (
                            <button
                              onClick={() => openDispatchModal(req)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs shadow cursor-pointer transition flex items-center space-x-1"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Dispatch</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => openTimelineModal(req)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition border border-slate-700 flex items-center space-x-1"
                            >
                              <span>Audit</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
