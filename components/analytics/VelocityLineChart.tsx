'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { VotingTimeSeriesView } from '@/types/database.types';
import { format, parseISO } from 'date-fns';

export default function VelocityLineChart({ data }: { data: VotingTimeSeriesView[] }) {
  // Aggregate hourly totals across departments
  const aggregatedMap = data.reduce((acc, curr) => {
    const hourKey = curr.vote_hour;
    acc[hourKey] = (acc[hourKey] || 0) + Number(curr.total_votes);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(aggregatedMap).map(([hour, count]) => {
    let formattedHour = hour;
    try {
      formattedHour = format(parseISO(hour), 'HH:mm');
    } catch {
      // Fallback if parsing fails
    }
    return {
      hour: formattedHour,
      Votes: count,
    };
  });

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Voting Velocity (Hourly Timeline)</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A2A6A" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0A2A6A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey="Votes"
              stroke="#0A2A6A"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#velocityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}