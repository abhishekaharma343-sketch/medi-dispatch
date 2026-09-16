import React, { useMemo, useState } from 'react';
import {
  Search,
  History,
  Download,
  Clock3,
  MapPin,
  Ambulance,
  CheckCircle2,
  ChevronRight,
  Hospital,
  FileClock,
} from 'lucide-react';
import { EmergencyPriority } from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

export const IncidentHistory: React.FC = () => {
  const { requests, openTimelineModal } = useDispatchContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'responseTime' | 'id'>('date');

  const filteredHistory = useMemo(() => {
    return requests
      .filter((req) => {
        const term = searchTerm.trim().toLowerCase();

        const matchesSearch =
          !term ||
          req.id.toLowerCase().includes(term) ||
          req.patientName.toLowerCase().includes(term) ||
          req.location.toLowerCase().includes(term) ||
          req.emergencyType.toLowerCase().includes(term) ||
          (req.assignedAmbulanceId &&
            req.assignedAmbulanceId.toLowerCase().includes(term));

        const matchesPriority =
          priorityFilter === 'ALL' || req.priority === priorityFilter;

        const matchesStatus =
          statusFilter === 'ALL' || req.status === statusFilter;

        return matchesSearch && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return b.requestTime.localeCompare(a.requestTime);
        }

        if (sortBy === 'responseTime') {
          return (
            (a.responseTimeMinutes ?? 999) -
            (b.responseTimeMinutes ?? 999)
          );
        }

        return b.id.localeCompare(a.id);
      });
  }, [requests, searchTerm, priorityFilter, statusFilter, sortBy]);

  const exportCSV = () => {
    const headers = [
      'Incident ID',
      'Priority',
      'Emergency Type',
      'Location',
      'Request Time',
      'Assigned Unit',
      'Driver',
      'Hospital',
      'Response Time (min)',
      'Duration (min)',
      'Final Status',
    ];

    const escapeCSV = (value: unknown) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = filteredHistory.map((incident) => [
      incident.id,
      incident.priority,
      incident.emergencyType,
      incident.location,
      incident.requestTime,
      incident.assignedAmbulanceId || 'None',
      incident.assignedDriver || 'None',
      incident.destinationHospitalName || 'Not Assigned',
      incident.responseTimeMinutes ?? 'N/A',
      incident.tripDurationMinutes ?? 'N/A',
      incident.status,
    ]);

    const csv = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `medi_dispatch_incidents_${Date.now()}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const getPriorityBadge = (priority: EmergencyPriority) => {
    const styles = {
      CRITICAL:
        'bg-red-500/10 text-red-300 border-red-500/20',
      HIGH:
        'bg-orange-500/10 text-orange-300 border-orange-500/20',
      MEDIUM:
        'bg-amber-500/10 text-amber-300 border-amber-500/20',
      LOW:
        'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    };

    const labels = {
      CRITICAL: 'Critical',
      HIGH: 'High',
      MEDIUM: 'Medium',
      LOW: 'Low',
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wide ${
          styles[priority]
        }`}
      >
        {labels[priority]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const completed = status === 'COMPLETED';

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wide ${
          completed
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            : 'bg-slate-800 text-slate-300 border-slate-700'
        }`}
      >
        {completed && <CheckCircle2 className="w-3 h-3" />}
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-full p-4 sm:p-5 lg:p-6 max-w-[1700px] mx-auto space-y-5">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <History className="w-4 h-4 text-cyan-400" />
            </div>

            <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-cyan-400">
              Records & Audit
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Incident History
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Review emergency records, response performance and completed
            ambulance missions.
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={filteredHistory.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Records
          </span>
          <p className="text-xl font-bold text-white mt-1">
            {filteredHistory.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Critical
          </span>
          <p className="text-xl font-bold text-red-400 mt-1">
            {
              filteredHistory.filter(
                (incident) => incident.priority === 'CRITICAL'
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Completed
          </span>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {
              filteredHistory.filter(
                (incident) => incident.status === 'COMPLETED'
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Avg Response
          </span>
          <p className="text-xl font-bold text-cyan-400 mt-1">
            {filteredHistory.length
              ? (
                  filteredHistory.reduce(
                    (sum, incident) =>
                      sum + (incident.responseTimeMinutes ?? 0),
                    0
                  ) / filteredHistory.length
                ).toFixed(1)
              : '0.0'}
            <span className="text-xs font-medium text-slate-500 ml-1">
              min
            </span>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search ID, patient, location, unit..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="HOSPITAL_TRANSPORT">Hospital Transport</option>
            <option value="PATIENT_PICKED_UP">Patient Picked Up</option>
            <option value="ARRIVED">Arrived</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="PENDING">Pending</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as 'date' | 'responseTime' | 'id'
              )
            }
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="date">Most Recent</option>
            <option value="responseTime">Response Time</option>
            <option value="id">Incident ID</option>
          </select>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="min-h-[360px] rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-center">
          <div className="text-center px-6">
            <FileClock className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <h2 className="text-base font-bold text-white">
              No Records Found
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Try changing your search or filter criteria.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden lg:block rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950/80 border-b border-slate-800">
                  <tr className="text-[9px] uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Incident</th>
                    <th className="px-4 py-3">Emergency</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Response</th>
                    <th className="px-4 py-3">Hospital</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Audit</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80">
                  {filteredHistory.map((incident) => (
                    <tr
                      key={incident.id}
                      className="hover:bg-slate-800/30 transition"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openTimelineModal(incident)}
                          className="text-left"
                        >
                          <span className="font-mono text-xs font-bold text-white hover:text-cyan-400 transition">
                            {incident.id}
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-1">
                            {incident.requestTime}
                          </span>
                        </button>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs font-semibold text-slate-200">
                          {incident.emergencyType}
                        </div>

                        <div className="mt-1">
                          {getPriorityBadge(incident.priority)}
                        </div>
                      </td>

                      <td className="px-4 py-3 max-w-[220px]">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />

                          <div className="min-w-0">
                            <p
                              className="text-xs text-slate-300 truncate"
                              title={incident.location}
                            >
                              {incident.location}
                            </p>

                            <p className="text-[9px] text-slate-600 font-mono mt-1">
                              {incident.latitude.toFixed(4)},{' '}
                              {incident.longitude.toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {incident.assignedAmbulanceId ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Ambulance className="w-3.5 h-3.5 text-cyan-400" />
                              <span className="text-xs font-mono font-bold text-cyan-300">
                                {incident.assignedAmbulanceId}
                              </span>
                            </div>

                            <span className="block text-[10px] text-slate-500 mt-1">
                              {incident.assignedDriver || 'Driver not recorded'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600">
                            Not assigned
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Clock3 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {incident.responseTimeMinutes != null
                              ? `${incident.responseTimeMinutes}m`
                              : 'N/A'}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 max-w-[180px]">
                        <div className="flex items-start gap-2">
                          <Hospital className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span
                            className="text-xs text-slate-300 truncate"
                            title={incident.destinationHospitalName || ''}
                          >
                            {incident.destinationHospitalName ||
                              'Not assigned'}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-slate-300">
                          {incident.tripDurationMinutes != null
                            ? `${incident.tripDurationMinutes}m`
                            : 'N/A'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {getStatusBadge(incident.status)}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openTimelineModal(incident)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-cyan-300 transition"
                        >
                          Timeline
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:hidden space-y-3">
            {filteredHistory.map((incident) => (
              <button
                key={incident.id}
                onClick={() => openTimelineModal(incident)}
                className="w-full text-left rounded-2xl border border-slate-800 bg-slate-900/80 p-4 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        {incident.id}
                      </span>

                      {getPriorityBadge(incident.priority)}
                    </div>

                    <p className="text-xs font-semibold text-slate-300 mt-1.5">
                      {incident.emergencyType}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-slate-400">
                      {incident.location}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Hospital className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-slate-400">
                      {incident.destinationHospitalName || 'Hospital not assigned'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[9px] uppercase text-slate-600 block">
                      Response
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {incident.responseTimeMinutes != null
                        ? `${incident.responseTimeMinutes}m`
                        : 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase text-slate-600 block">
                      Unit
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {incident.assignedAmbulanceId || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase text-slate-600 block">
                      Status
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">
                      {incident.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-600">
                    {incident.requestTime}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400">
                    View timeline
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};