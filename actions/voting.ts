'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

interface CastVoteInput {
  eventId: string;
  ballotItemId: string;
  staffId: string;
  isAnonymous: boolean;
}

export async function castVoteAction({ eventId, ballotItemId, staffId, isAnonymous }: CastVoteInput) {
  // Await the async createClient function
  const supabase = await createClient();

  const anonymousToken = isAnonymous 
    ? crypto.randomBytes(32).toString('hex') 
    : null;

  const { data, error } = await supabase.rpc('submit_cast_ballot', {
    p_event_id: eventId,
    p_ballot_item_id: ballotItemId,
    p_staff_id: staffId,
    p_anonymous_token: anonymousToken,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const result = data as { success: boolean; error?: string; timestamp?: string };

  if (!result.success) {
    return { success: false, error: result.error || 'Vote could not be registered.' };
  }

  revalidatePath(`/portal/vote/${eventId}`);
  revalidatePath(`/admin/dashboard`);
  return { success: true };
}