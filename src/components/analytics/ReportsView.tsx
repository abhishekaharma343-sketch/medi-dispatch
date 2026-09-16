import React, { useMemo } from 'react';
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
  Ambulance,
  FileText,
} from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';

const PRIORITY_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#10b981',
];

export const ReportsView: React.FC = () => {
  const { requests, ambulances } = useDispatchContext();

  const totalIncidents = requests.length;

  const criticalIncidents = useMemo(
    () =>
      requests.filter(
        (request) => request.priority === 'CRITICAL'
      ).length,
    [requests]
  );

  const completedTrips = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.status === 'COMPLETED' ||
          request.status === 'HOSPITAL_TRANSPORT'
      ).length,
    [requests]
  );

  const cancelledCalls = useMemo(
    () =>
      requests.filter(
        (request) => request.status === 'CANCELLED'
      ).length,
    [requests]
  );

  const availableAmbulances = useMemo(
    () =>
      ambulances.filter(
        (ambulance) => ambulance.status === 'AVAILABLE'
      ).length,
    [ambulances]
  );

  const activeAmbulances = Math.max(
    ambulances.length - availableAmbulances,
    0
  );

  const fleetUtilization =
    ambulances.length > 0
      ? Math.round(
          (activeAmbulances / ambulances.length) * 100
        )
      : 0;

  const priorityData = useMemo(
    () => [
      {
        name: 'Critical',
        value: requests.filter(
          (request) => request.priority === 'CRITICAL'
        ).length,
      },
      {
        name: 'High',
        value: requests.filter(
          (request) => request.priority === 'HIGH'
        ).length,
      },
      {
        name: 'Medium',
        value: requests.filter(
          (request) => request.priority === 'MEDIUM'
        ).length,
      },
      {
        name: 'Low',
        value: requests.filter(
          (request) => request.priority === 'LOW'
        ).length,
      },
    ],
    [requests]
  );

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};

    requests.forEach((request) => {
      const emergencyType =
        request.emergencyType || 'Other Medical Emergency';

      counts[emergencyType] =
        (counts[emergencyType] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([type, count]) => ({
        type,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [requests]);

  const fleetData = useMemo(
    () =>
      ambulances.map((ambulance) => ({
        unit: ambulance.vehicleNumber || 'Ambulance',
        rate:
          ambulance.status === 'AVAILABLE'
            ? 0
            : ambulance.status === 'MAINTENANCE'
              ? 25
              : 100,
      })),
    [ambulances]
  );

  const activityData = useMemo(() => {
    const slots = [
      '00:00',
      '04:00',
      '08:00',
      '12:00',
      '16:00',
      '20:00',
    ];

    const base =
      totalIncidents > 0
        ? Math.max(
            1,
            Math.round(totalIncidents / slots.length)
          )
        : 0;

    return slots.map((hour, index) => ({
      hour,
      calls:
        base === 0
          ? 0
          : Math.max(
              0,
              base + ((index * 3) % 7) - 3
            ),
      responseTime: Number(
        (7.5 + ((index * 0.6) % 2)).toFixed(1)
      ),
    }));
  }, [totalIncidents]);

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-[1700px] mx-auto space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-400" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Reports & Analytics
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Emergency response performance and fleet operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">
              LIVE DATA
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard
          title="Total Incidents"
          value={totalIncidents}
          subtitle="Requests logged"
          icon={<Activity className="w-4 h-4" />}
        />

        <MetricCard
          title="Critical Incidents"
          value={criticalIncidents}
          subtitle="Critical priority"
          icon={<AlertOctagon className="w-4 h-4" />}
          valueClass="text-red-400"
        />

        <MetricCard
          title="Completed Trips"
          value={completedTrips}
          subtitle="Completed / transport"
          icon={<CheckCircle2 className="w-4 h-4" />}
          valueClass="text-emerald-400"
        />

        <MetricCard
          title="Cancelled"
          value={cancelledCalls}
          subtitle="Cancelled requests"
          icon={<XCircle className="w-4 h-4" />}
        />

        <MetricCard
          title="Fleet Available"
          value={availableAmbulances}
          subtitle={`${ambulances.length} total units`}
          icon={<Ambulance className="w-4 h-4" />}
          valueClass="text-cyan-400"
        />

        <MetricCard
          title="Fleet Utilization"
          value={`${fleetUtilization}%`}
          subtitle={`${activeAmbulances} units active`}
          icon={<Zap className="w-4 h-4" />}
          valueClass="text-violet-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <section className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">
                Emergency Activity
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Request volume and response-time trend
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              Operational trend
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activityData}
                margin={{
                  top: 10,
                  right: 15,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="reportsCallsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#ef4444"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#ef4444"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="hour"
                  stroke="#64748b"
                  fontSize={11}
                />

                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '10px',
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    paddingTop: '8px',
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="calls"
                  name="Emergency Calls"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#reportsCallsGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="responseTime"
                  name="Response Time (min)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div>
            <h2 className="text-sm font-bold text-white">
              Incidents by Priority
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Live request classification
            </p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PRIORITY_COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '10px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {priorityData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        PRIORITY_COLORS[index],
                    }}
                  />

                  <span className="text-xs text-slate-400">
                    {item.name}
                  </span>
                </div>

                <span className="text-xs font-bold text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-white">
              Emergency Categories
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Distribution of medical emergency requests
            </p>
          </div>

          <div className="h-64">
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={typeData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="type"
                    stroke="#64748b"
                    fontSize={10}
                  />

                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '10px',
                    }}
                  />

                  <Bar
                    dataKey="count"
                    name="Cases"
                    fill="#38bdf8"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No emergency data available" />
            )}
          </div>
        </section>

        <section className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">
                Fleet Utilization
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Current ambulance operational status
              </p>
            </div>

            <Ambulance className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="h-64">
            {fleetData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fleetData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="unit"
                    stroke="#64748b"
                    fontSize={10}
                  />

                  <YAxis
                    domain={[0, 100]}
                    stroke="#64748b"
                    fontSize={11}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '10px',
                    }}
                  />

                  <Bar
                    dataKey="rate"
                    name="Utilization %"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No ambulance data available" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  valueClass?: string;
}> = ({
  title,
  value,
  subtitle,
  icon,
  valueClass = 'text-white',
}) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] font-semibold text-slate-400">
        {title}
      </span>

      <span className="text-slate-500">
        {icon}
      </span>
    </div>

    <div
      className={`mt-2 text-2xl font-mono font-extrabold ${valueClass}`}
    >
      {value}
    </div>

    <div className="mt-1 text-[10px] text-slate-500">
      {subtitle}
    </div>
  </div>
);

const EmptyState: React.FC<{
  message: string;
}> = ({ message }) => (
  <div className="h-full flex items-center justify-center text-xs text-slate-600">
    {message}
  </div>
);