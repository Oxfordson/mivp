import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import BallotCard from '@/components/voting/BallotCard';
import Link from 'next/link';

export default async function VotePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch staff record
  const { data: staff } = await supabase
    .from('staff')
    .select('*')
    .eq('email', user.email!)
    .single();

  if (!staff) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold">Staff profile record not found for your account.</p>
      </div>
    );
  }

  // Fetch event details
  const { data: event } = await supabase
    .from('voting_events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (!event || event.status !== 'active') {
    redirect('/portal');
  }

  // Check accreditation
  const { data: accreditation } = await supabase
    .from('event_accreditations')
    .select('*')
    .eq('event_id', eventId)
    .eq('staff_id', staff.id)
    .single();

  if (!accreditation?.is_accredited || !accreditation?.is_eligible) {
    return (
      <div className="p-12 text-center max-w-md mx-auto mt-12 bg-white border border-slate-200 rounded-2xl">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Accreditation Required</h2>
        <p className="text-sm text-slate-500 mb-6">You are not accredited or your eligibility was revoked for this voting session.</p>
        <Link href="/portal" className="text-sm text-blue-600 font-medium hover:underline">
          Return to Portal
        </Link>
      </div>
    );
  }

  if (accreditation.has_voted) {
    return (
      <div className="p-12 text-center max-w-md mx-auto mt-12 bg-white border border-slate-200 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          ✓
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Vote Already Recorded</h2>
        <p className="text-sm text-slate-500 mb-6">Your vote was captured and locked with an immutable timestamp.</p>
        <Link href="/portal" className="text-sm text-blue-600 font-medium hover:underline">
          Return to Portal
        </Link>
      </div>
    );
  }

  // Fetch Ballot Items
  const { data: items } = await supabase
    .from('ballot_items')
    .select('*')
    .eq('event_id', eventId)
    .order('display_order', { ascending: true });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/portal" className="text-xs text-slate-500 hover:text-slate-800 transition">
            ← Back to Portal
          </Link>
          <div className="flex justify-between items-baseline mt-2">
            <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
            <span className="text-xs font-mono uppercase bg-slate-200 px-2 py-0.5 rounded">
              {event.is_anonymous ? 'Anonymous' : 'Open'}
            </span>
          </div>
          {event.description && <p className="text-sm text-slate-500 mt-1">{event.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items?.map((item) => (
            <BallotCard
              key={item.id}
              item={item}
              eventId={event.id}
              staffId={staff.id}
              isAnonymous={event.is_anonymous}
              disabled={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}