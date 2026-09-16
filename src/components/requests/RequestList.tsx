import React, { useMemo, useState } from 'react';
import {
  Search,
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
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'id'>('priority');
  const [showFilters, setShowFilters] = useState(false);

  const emergencyTypes: EmergencyType[] = [
    'Road Accident',
    'Cardiac Emergency',
    'Breathing Difficulty',
    'Stroke',
    'Pregnancy / Maternity',
    'Burns',
    'Trauma',
    'Unconscious Patient',
    'Other Medical Emergency',
  ];

  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        const term = searchTerm.toLowerCase().trim();

        const matchesSearch =
          !term ||
          req.id.toLowerCase().includes(term) ||
          req.patientName.toLowerCase().includes(term) ||
          req.callerName.toLowerCase().includes(term) ||
          req.location.toLowerCase().includes(term) ||
          req.contactNumber.toLowerCase().includes(term);

        const matchesPriority =
          priorityFilter === 'ALL' || req.priority === priorityFilter;

        const matchesStatus =
          statusFilter === 'ALL' || req.status === statusFilter;

        const matchesType =
          typeFilter === 'ALL' || req.emergencyType === typeFilter;

        return (
          matchesSearch &&
          matchesPriority &&
          matchesStatus &&
          matchesType
        );
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
        }

        if (sortBy === 'time') {
          return b.requestTime.localeCompare(a.requestTime);
        }

        return b.id.localeCompare(a.id);
      });
  }, [
    requests,
    searchTerm,
    priorityFilter,
    statusFilter,
    typeFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setSortBy('priority');
  };

  const getPriorityBadge = (priority: EmergencyPriority) => {
    const config = {
      CRITICAL: {
        label: 'Critical',
        className:
          'bg-red-500/10 text-red-400 border-red-500/20',
        dot: 'bg-red-500',
      },
      HIGH: {
        label: 'High',
        className:
          'bg-orange-500/10 text-orange-400 border-orange-500/20',
        dot: 'bg-orange-500',
      },
      MEDIUM: {
        label: 'Medium',
        className:
          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        dot: 'bg-yellow-500',
      },
      LOW: {
        label: 'Low',
        className:
          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-500',
      },
    }[priority];

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold ${config.className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: RequestStatus) => {
    const config: Record<
      RequestStatus,
      { label: string; className: string }
    > = {
      NEW: {
        label: 'Pending Dispatch',
        className:
          'bg-amber-500/10 text-amber-300 border-amber-500/20',
      },
      PENDING: {
        label: 'Pending Dispatch',
        className:
          'bg-amber-500/10 text-amber-300 border-amber-500/20',
      },
      ASSIGNED: {
        label: 'Assigned',
        className:
          'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
      },
      EN_ROUTE: {
        label: 'En Route',
        className:
          'bg-blue-500/10 text-blue-300 border-blue-500/20',
      },
      ARRIVED: {
        label: 'At Scene',
        className:
          'bg-orange-500/10 text-orange-300 border-orange-500/20',
      },
      PATIENT_PICKED_UP: {
        label: 'Patient On Board',
        className:
          'bg-purple-500/10 text-purple-300 border-purple-500/20',
      },
      HOSPITAL_TRANSPORT: {
        label: 'Hospital Transport',
        className:
          'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      },
      COMPLETED: {
        label: 'Completed',
        className:
          'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      },
      CANCELLED: {
        label: 'Cancelled',
        className:
          'bg-slate-800 text-slate-400 border-slate-700',
      },
    };

    const item = config[status];

    return (
      <span
        className={`inline-flex px-2 py-1 rounded-md border text-[10px] font-semibold uppercase tracking-wide ${item.className}`}
      >
        {item.label}
      </span>
    );
  };

  const pendingCount = requests.filter(
    (req) => req.status === 'PENDING' || req.status === 'NEW'
  ).length;

  const criticalCount = requests.filter(
    (req) =>
      req.priority === 'CRITICAL' &&
      (req.status === 'PENDING' || req.status === 'NEW')
  ).length;

  return (
    <div className="p-4 sm:p-5 max-w-[1700px] mx-auto space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Emergency Requests
              </h1>

              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                {filteredRequests.length} active records
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review incoming emergencies and dispatch the nearest available ambulance.
            </p>
          </div>

          <button
            onClick={openNewIncidentModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Emergency
          </button>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Total
            </p>
            <p className="text-lg font-bold text-white mt-0.5">
              {requests.length}
            </p>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-amber-500/70">
              Pending
            </p>
            <p className="text-lg font-bold text-amber-400 mt-0.5">
              {pendingCount}
            </p>
          </div>

          <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-red-400/70">
              Critical
            </p>
            <p className="text-lg font-bold text-red-400 mt-0.5">
              {criticalCount}
            </p>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-blue-400/70">
              Showing
            </p>
            <p className="text-lg font-bold text-blue-400 mt-0.5">
              {filteredRequests.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />

            <input
              type="text"
              placeholder="Search incident, patient, location or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500/50"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2 text-slate-500 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters((value) => !value)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
              showFilters
                ? 'bg-slate-800 border-slate-600 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white text-xs transition"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="lg:hidden">Reset</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Dispatch</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="EN_ROUTE">En Route</option>
              <option value="ARRIVED">At Scene</option>
              <option value="PATIENT_PICKED_UP">Patient On Board</option>
              <option value="HOSPITAL_TRANSPORT">Hospital Transport</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
            >
              <option value="ALL">All Emergency Types</option>

              {emergencyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as 'priority' | 'time' | 'id'
                )
              }
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
            >
              <option value="priority">Sort by Priority</option>
              <option value="time">Sort by Time</option>
              <option value="id">Sort by Incident ID</option>
            </select>
          </div>
        )}
      </div>

      {/* Request List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="py-16 px-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center">
              <Search className="w-5 h-5 text-slate-500" />
            </div>

            <h3 className="text-sm font-semibold text-slate-300 mt-4">
              No emergency requests found
            </h3>

            <p className="text-xs text-slate-600 mt-1">
              Try changing your search or filters.
            </p>

            <button
              onClick={resetFilters}
              className="mt-4 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden xl:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 border-b border-slate-800">
                  <tr className="text-[10px] uppercase tracking-wider text-slate-600">
                    <th className="px-4 py-3">Incident</th>
                    <th className="px-4 py-3">Emergency</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Ambulance</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredRequests.map((req: EmergencyRequest) => {
                    const isPending =
                      req.status === 'PENDING' ||
                      req.status === 'NEW';

                    const isCritical =
                      req.priority === 'CRITICAL';

                    return (
                      <tr
                        key={req.id}
                        className={`hover:bg-slate-800/40 transition ${
                          isCritical && isPending
                            ? 'bg-red-950/10'
                            : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openTimelineModal(req)}
                            className="text-xs font-mono font-bold text-white hover:text-red-400 transition"
                          >
                            {req.id}
                          </button>

                          <p className="text-[10px] text-slate-600 mt-1">
                            {req.requiredAmbulanceType}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p className="text-xs font-semibold text-slate-200">
                            {req.emergencyType}
                          </p>

                          <div className="mt-1.5">
                            {getPriorityBadge(req.priority)}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-xs text-slate-200">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            {req.patientName}
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mt-1">
                            <Phone className="w-3 h-3" />
                            {req.contactNumber}
                          </div>
                        </td>

                        <td className="px-4 py-3 max-w-[260px]">
                          <div className="flex items-start gap-1.5 text-xs text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />

                            <span className="truncate" title={req.location}>
                              {req.location}
                            </span>
                          </div>

                          <p className="text-[9px] text-slate-600 font-mono mt-1 ml-5">
                            {req.latitude.toFixed(4)}, {req.longitude.toFixed(4)}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          {getStatusBadge(req.status)}
                        </td>

                        <td className="px-4 py-3">
                          {req.assignedAmbulanceId ? (
                            <div>
                              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
                                <AmbulanceIcon className="w-3.5 h-3.5" />
                                {req.assignedAmbulanceId}
                              </div>

                              <p className="text-[10px] text-slate-600 mt-1">
                                {req.assignedDriver}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-600">
                              Not assigned
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {isPending ? (
                            <button
                              onClick={() => openDispatchModal(req)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition active:scale-95"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              Dispatch
                            </button>
                          ) : (
                            <button
                              onClick={() => openTimelineModal(req)}
                              className="inline-flex items-center gap-1 px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                            >
                              View
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Tablet / Mobile */}
            <div className="xl:hidden divide-y divide-slate-800">
              {filteredRequests.map((req: EmergencyRequest) => {
                const isPending =
                  req.status === 'PENDING' ||
                  req.status === 'NEW';

                const isCritical =
                  req.priority === 'CRITICAL';

                return (
                  <div
                    key={req.id}
                    className={`p-4 ${
                      isCritical && isPending
                        ? 'bg-red-950/10'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          onClick={() => openTimelineModal(req)}
                          className="text-xs font-mono font-bold text-white hover:text-red-400"
                        >
                          {req.id}
                        </button>

                        <h3 className="text-sm font-bold text-slate-200 mt-1">
                          {req.emergencyType}
                        </h3>
                      </div>

                      {getPriorityBadge(req.priority)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-600">
                          Patient
                        </p>

                        <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {req.patientName}
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mt-1">
                          <Phone className="w-3 h-3" />
                          {req.contactNumber}
                        </div>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-600">
                          Location
                        </p>

                        <div className="flex items-start gap-1.5 text-xs text-slate-300 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {req.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(req.status)}

                        {req.assignedAmbulanceId && (
                          <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                            <AmbulanceIcon className="w-3 h-3" />
                            {req.assignedAmbulanceId}
                          </span>
                        )}
                      </div>

                      {isPending ? (
                        <button
                          onClick={() => openDispatchModal(req)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Dispatch
                        </button>
                      ) : (
                        <button
                          onClick={() => openTimelineModal(req)}
                          className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                        >
                          View
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-[9px] text-slate-600 font-mono">
                      <Clock className="w-3 h-3" />
                      {req.requestTime}
                      <span>•</span>
                      <Users className="w-3 h-3" />
                      {req.numberOfPatients} patient(s)
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};