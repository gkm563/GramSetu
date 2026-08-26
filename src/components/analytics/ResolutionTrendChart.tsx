import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ResolutionTrendChartProps {
  complaints: any[];
}

export const ResolutionTrendChart: React.FC<ResolutionTrendChartProps> = ({ complaints }) => {
  // Aggregate complaints over the last 7 days or sample days
  const data = React.useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts: Record<string, { resolved: number; reported: number }> = {};

    days.forEach((d) => {
      counts[d] = { resolved: 0, reported: 0 };
    });

    complaints.forEach((c) => {
      try {
        const d = new Date(c.createdAt);
        const dayIndex = d.getDay(); // 0 is Sun
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
        if (counts[dayName]) {
          counts[dayName].reported++;
          if (c.status?.toLowerCase() === 'resolved') {
            counts[dayName].resolved++;
          }
        }
      } catch {}
    });

    return days.map((day) => ({
      day,
      Reported: counts[day].reported,
      Resolved: counts[day].resolved,
    }));
  }, [complaints]);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.5rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="Reported"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#colorReported)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Resolved"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorResolved)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
