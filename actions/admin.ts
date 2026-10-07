'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function pauseResumeEvent(eventId: string, newStatus: 'active' | 'paused' | 'completed') {
  // FIX: Await the async createClient function
  const supabase = await createClient();

  const { error } = await supabase
    .from('voting_events')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', eventId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function invalidateVoteAction(voteId: string, reason: string) {
  // FIX: Await the async createClient function
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { data, error } = await supabase.rpc('admin_invalidate_vote', {
    p_admin_id: user.id,
    p_vote_id: voteId,
    p_reason: reason,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/dashboard');
  return { success: true };
}