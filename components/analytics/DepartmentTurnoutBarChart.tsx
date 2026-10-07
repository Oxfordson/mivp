'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DepartmentTurnoutView } from '@/types/database.types';

export default function DepartmentTurnoutBarChart({ data }: { data: DepartmentTurnoutView[] }) {
  const formattedData = data.map((item) => ({
    department: item.department,
    Turnout: item.participation_rate,
    Voted: item.actual_voters_count,
    Accredited: item.accredited_count,
  }));

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Departmental Turnout Rate (%)</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="department" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} unit="%" domain={[0, 100]} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              // FIX: Cast as any to bypass Recharts strict generic mismatch
              formatter={((value: any, name: any) => [name === 'Turnout' ? `${value}%` : value, name]) as any}
            />
            <Bar dataKey="Turnout" fill="#0A2A6A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}