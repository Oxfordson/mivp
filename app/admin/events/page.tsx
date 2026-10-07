import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from('voting_events')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Voting Events & Polls</h1>
          <p className="text-sm text-slate-500">Configure timeframes, categories, and session status</p>
        </div>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 bg-[#0A2A6A] hover:bg-[#071d49] text-white text-sm font-medium rounded-lg transition"
        >
          + New Event
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-600">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Mode</th>
              <th className="p-4">Status</th>
              <th className="p-4">Timeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events?.map((evt) => (
              <tr key={evt.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-medium text-slate-900">{evt.title}</td>
                <td className="p-4 font-mono text-xs uppercase text-slate-600">{evt.category}</td>
                <td className="p-4 text-slate-600 text-xs">
                  {evt.is_anonymous ? 'Anonymous' : 'Open'}
                </td>
                <td className="p-4">
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize bg-slate-100 text-slate-800">
                    {evt.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-slate-500">
                  {format(parseISO(evt.start_time), 'MMM d, HH:mm')} - {format(parseISO(evt.end_time), 'MMM d, HH:mm')}
                </td>
              </tr>
            ))}
            {(!events || events.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No events created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}