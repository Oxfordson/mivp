import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default async function VoterPortalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Find staff profile
  const { data: staff } = await supabase
    .from('staff')
    .select('*')
    .eq('email', user?.email || '')
    .single();

  // Fetch all active/upcoming events
  const { data: events } = await supabase
    .from('voting_events')
    .select('*')
    .in('status', ['active', 'upcoming'])
    .order('start_time', { ascending: true });

  // Fetch staff accreditations
  const { data: accreditations } = await supabase
    .from('event_accreditations')
    .select('*')
    .eq('staff_id', staff?.id || '');

  const accredMap = new Map(accreditations?.map((a) => [a.event_id, a]) || []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Motomedia Voting Portal</h1>
            <p className="text-sm text-slate-500">
              Authenticated as: <strong className="text-slate-800">{staff?.full_name || user?.email}</strong> ({staff?.department || 'Department Unassigned'})
            </p>
          </div>
          <span className="text-xs px-3 py-1 bg-slate-200 text-slate-700 rounded-full font-mono font-medium">
            Staff ID: {staff?.staff_id || 'N/A'}
          </span>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Available Ballots & Polls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {events?.map((evt) => {
              const accred = accredMap.get(evt.id);
              const hasVoted = accred?.has_voted;
              const isAccredited = accred?.is_accredited && accred?.is_eligible;

              return (
                <div key={evt.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono uppercase bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-semibold">
                        {evt.category}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${evt.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {evt.status}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg text-slate-900 mt-3">{evt.title}</h3>
                    {evt.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{evt.description}</p>}

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                      <p>Closes: {format(parseISO(evt.end_time), 'PPp')}</p>
                      <p>Type: {evt.is_anonymous ? 'Anonymous Ballot (Zero-Knowledge)' : 'Open Ballot'}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {hasVoted ? (
                        <span className="text-xs font-semibold text-emerald-600">Ballot Cast</span>
                      ) : isAccredited ? (
                        <span className="text-xs font-semibold text-blue-600">Accredited</span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-600">Accreditation Pending</span>
                      )}
                    </div>

                    {hasVoted ? (
                      <span className="text-xs text-slate-400 font-medium">Completed</span>
                    ) : evt.status === 'active' && isAccredited ? (
                      <Link
                        href={`/portal/vote/${evt.id}`}
                        className="px-4 py-2 bg-[#0A2A6A] hover:bg-[#071d49] text-white text-xs font-semibold rounded-lg transition"
                      >
                        Enter Ballot
                      </Link>
                    ) : (
                      <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed">
                        {evt.status !== 'active' ? 'Not Open' : 'Not Accredited'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {(!events || events.length === 0) && (
              <p className="text-sm text-slate-400 col-span-2 py-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                No active elections or polls scheduled at this moment.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}