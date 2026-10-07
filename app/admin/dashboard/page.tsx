import { createClient } from '@/lib/supabase/server';
import DepartmentTurnoutBarChart from '@/components/analytics/DepartmentTurnoutBarChart';
import { DepartmentTurnoutView, VoteTallyView } from '@/types/database.types';

// Force dynamic rendering to bypass static prerendering errors with async Supabase calls
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Await the async createClient function
  const supabase = await createClient();

  // 1. Fetch current active events
  const { data: events } = await supabase
    .from('voting_events')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. Fetch Department Analytics View
  const { data: deptData } = await supabase
    .from('view_departmental_voting_behavior')
    .select('*');

  // 3. Fetch Candidate / Ballot Tallies View
  const { data: tallyData } = await supabase
    .from('view_ballot_tallies')
    .select('*');

  const departmentMetrics = (deptData as DepartmentTurnoutView[]) || [];
  const tallies = (tallyData as VoteTallyView[]) || [];

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">MIVP Operations & Analytics</h1>
          <p className="text-sm text-slate-500">Real-time voting verification, turnout velocity, and tally ledger</p>
        </div>
        <div className="flex gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            System Live
          </span>
        </div>
      </div>

      {/* Main Charts & Tallies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DepartmentTurnoutBarChart data={departmentMetrics} />

        {/* Live Tallies Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-4">Live Valid Tally</h3>
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {tallies.map((item) => (
                <div key={item.ballot_item_id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-slate-800">{item.item_name}</span>
                    <span className="ml-2 text-xs text-slate-400 capitalize">({item.target_type})</span>
                  </div>
                  <span className="font-mono font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded">
                    {item.valid_vote_count} votes
                  </span>
                </div>
              ))}
              {tallies.length === 0 && (
                <p className="text-xs text-slate-400 py-6 text-center">No votes logged yet.</p>
              )}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
            <span>Invalidated votes omitted</span>
            <span>Refreshes on mutation</span>
          </div>
        </div>
      </div>
    </div>
  );
}