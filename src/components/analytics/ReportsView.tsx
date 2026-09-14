import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Clock,
  Zap,
  Activity,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';

export const ReportsView: React.FC = () => {
  const { requests, ambulances } = useDispatchContext();

  // Metrics specified in prompt
  const avgResponseTime = '8.4 min';
  const avgDispatchTime = '1.2 min';
  const fleetUtilization = '78%';
  const criticalIncidentsCount = 24;
  const completedTripsCount = 156;
  const cancelledCount = 2;

  // Chart data: Incidents by Priority
  const priorityData = [
    { name: 'Critical', value: 24, color: '#ef4444' },
    { name: 'High', value: 48, color: '#f97316' },
    { name: 'Medium', value: 62, color: '#eab308' },
    { name: 'Low', value: 22, color: '#10b981' },
  ];

  // Chart data: Incidents by Emergency Type
  const typeData = [
    { type: 'Cardiac', count: 38 },
    { type: 'Accident', count: 32 },
    { type: 'Trauma', count: 26 },
    { type: 'Respiratory', count: 21 },
    { type: 'Stroke', count: 18 },
    { type: 'Pediatric', count: 12 },
    { type: 'Other', count: 9 },
  ];

  // Chart data: Hourly Dispatch Volume Trend
  const hourlyData = [
    { hour: '06:00', calls: 8, responseTime: 7.2 },
    { hour: '08:00', calls: 14, responseTime: 8.8 },
    { hour: '10:00', calls: 22, responseTime: 8.5 },
    { hour: '12:00', calls: 19, responseTime: 7.9 },
    { hour: '14:00', calls: 16, responseTime: 7.6 },
    { hour: '16:00', calls: 25, responseTime: 9.2 },
    { hour: '18:00', calls: 29, responseTime: 8.9 },
    { hour: '20:00', calls: 21, responseTime: 8.1 },
    { hour: '22:00', calls: 15, responseTime: 7.4 },
  ];

  // Chart data: Fleet Unit Utilization
  const unitUtilizationData = [
    { unit: 'AMB-101', rate: 82 },
    { unit: 'AMB-102', rate: 88 },
    { unit: 'AMB-103', rate: 74 },
    { unit: 'AMB-104', rate: 91 },
    { unit: 'AMB-105', rate: 25 },
    { unit: 'AMB-106', rate: 68 },
    { unit: 'AMB-107', rate: 85 },
    { unit: 'AMB-108', rate: 62 },
  ];

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-5">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Operational Analytics & Performance Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Key operational indicators: response latency, fleet efficiency, and clinical triage breakdowns
          </p>
        </div>
      </div>

      {/* KPI Headline Cards Required by Prompt */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Avg Response Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-white">{avgResponseTime}</div>
          <div className="text-[10px] text-emerald-400 font-medium">↓ 1.1m faster than target</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Avg Dispatch Latency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-white">{avgDispatchTime}</div>
          <div className="text-[10px] text-slate-400">Intake to unit roll</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Fleet Utilization</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-400">{fleetUtilization}</div>
          <div className="text-[10px] text-slate-400">Active mission uptime</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Critical Incidents</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-red-400">{criticalIncidentsCount}</div>
          <div className="text-[10px] text-red-400">High priority calls</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Completed Trips</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-white">{completedTripsCount}</div>
          <div className="text-[10px] text-teal-400">Successful hospital handovers</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Cancelled Calls</span>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-300">{cancelledCount}</div>
          <div className="text-[10px] text-slate-400">False alarms / Refusals</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Hourly Volume & Response Time */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Hourly Emergency Call Volume & Response Latency
              </h3>
              <p className="text-[11px] text-slate-400">
                Peak load occurs between 16:00 and 19:00 evening commute
              </p>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
              24-HR CAD CYCLE
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="calls"
                  name="Emergency Calls"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#callsGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="responseTime"
                  name="Avg Response Time (min)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#latencyGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Donut */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Incidents by Priority
            </h3>
            <p className="text-[11px] text-slate-400">Total 156 incidents classified</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            {priorityData.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                  <span className="text-slate-300">{p.name}</span>
                </span>
                <span className="font-bold text-white">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Types Bar Chart */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Incidents by Medical Category
            </h3>
            <p className="text-[11px] text-slate-400">
              Cardiac, vehicular collisions, and acute trauma represent the highest volume
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="type" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} name="Cases Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ambulance Fleet Utilization */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Ambulance Utilization by Unit (%)
            </h3>
            <p className="text-[11px] text-slate-400">
              Percentage of shift time deployed on active missions
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="unit" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="rate" fill="#10b981" radius={[6, 6, 0, 0]} name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
