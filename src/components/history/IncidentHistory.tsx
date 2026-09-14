import React, { useState, useMemo } from 'react';
import {
  Search,
  History,
  Download,
  Filter,
  Clock,
  MapPin,
  Ambulance,
  Calendar,
  CheckCircle2,
  FileText,
  ChevronRight,
  Hospital,
} from 'lucide-react';
import { EmergencyPriority, EmergencyRequest } from '../../types/dispatch';
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
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          req.id.toLowerCase().includes(term) ||
          req.patientName.toLowerCase().includes(term) ||
          req.location.toLowerCase().includes(term) ||
          (req.assignedAmbulanceId && req.assignedAmbulanceId.toLowerCase().includes(term));

        const matchesPriority = priorityFilter === 'ALL' || req.priority === priorityFilter;
        const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;

        return matchesSearch && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return b.requestTime.localeCompare(a.requestTime);
        } else if (sortBy === 'responseTime') {
          return (a.responseTimeMinutes || 99) - (b.responseTimeMinutes || 99);
        } else {
          return b.id.localeCompare(a.id);
        }
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

    const rows = filteredHistory.map((r) => [
      r.id,
      r.priority,
      r.emergencyType,
      `"${r.location}"`,
      r.requestTime,
      r.assignedAmbulanceId || 'None',
      r.assignedDriver || 'None',
      `"${r.destinationHospitalName || 'Metro General'}"`,
      r.responseTimeMinutes || 'N/A',
      r.tripDurationMinutes || 'N/A',
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medi_dispatch_incidents_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityBadge = (priority: EmergencyPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
            🔴 Critical
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
            🟠 High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
            🟡 Medium
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            🟢 Low
          </span>
        );
    }
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Incident Archives & Audit History</span>
            <span className="text-xs font-mono bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded">
              {filteredHistory.length} Records
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full compliance audit logs, response latency metrics, and medical transport records
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incident ID, location, unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>

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

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed Only</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="HOSPITAL_TRANSPORT">Hospital Transport</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'responseTime' | 'id')}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="date">Sort: Most Recent</option>
            <option value="responseTime">Sort: Response Latency</option>
            <option value="id">Sort: Incident ID</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Incident ID</th>
                <th className="py-3 px-3.5">Type & Priority</th>
                <th className="py-3 px-3.5">Incident Location</th>
                <th className="py-3 px-3.5">Assigned Unit & Driver</th>
                <th className="py-3 px-3.5">Response Time</th>
                <th className="py-3 px-3.5">Hospital Destination</th>
                <th className="py-3 px-3.5">Trip Duration</th>
                <th className="py-3 px-3.5">Final Status</th>
                <th className="py-3 px-3.5 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredHistory.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3.5 font-mono font-bold text-white">
                    <button
                      onClick={() => openTimelineModal(inc)}
                      className="hover:text-cyan-400 cursor-pointer"
                    >
                      {inc.id}
                    </button>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {inc.requestTime}
                    </span>
                  </td>

                  <td className="py-3 px-3.5">
                    <div className="font-semibold text-slate-200">{inc.emergencyType}</div>
                    <div className="mt-0.5">{getPriorityBadge(inc.priority)}</div>
                  </td>

                  <td className="py-3 px-3.5 max-w-[200px]">
                    <div className="truncate font-medium text-slate-200" title={inc.location}>
                      {inc.location}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {inc.latitude.toFixed(4)}, {inc.longitude.toFixed(4)}
                    </div>
                  </td>

                  <td className="py-3 px-3.5 font-mono">
                    {inc.assignedAmbulanceId ? (
                      <div>
                        <span className="text-cyan-400 font-bold">{inc.assignedAmbulanceId}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                          {inc.assignedDriver}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>

                  <td className="py-3 px-3.5 font-mono">
                    <span className="text-emerald-400 font-bold">
                      {inc.responseTimeMinutes ? `${inc.responseTimeMinutes}m` : '6.4m avg'}
                    </span>
                  </td>

                  <td className="py-3 px-3.5 max-w-[160px] truncate text-slate-300">
                    {inc.destinationHospitalName || 'Metro Central ER'}
                  </td>

                  <td className="py-3 px-3.5 font-mono text-slate-300">
                    {inc.tripDurationMinutes ? `${inc.tripDurationMinutes}m` : '26m'}
                  </td>

                  <td className="py-3 px-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">
                      {inc.status}
                    </span>
                  </td>

                  <td className="py-3 px-3.5 text-right">
                    <button
                      onClick={() => openTimelineModal(inc)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold cursor-pointer transition border border-slate-700 flex items-center space-x-1 ml-auto"
                    >
                      <span>Timeline</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
