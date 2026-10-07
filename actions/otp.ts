'use server';

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Helper to get Resend instance dynamically on request
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable.');
  }
  return new Resend(apiKey);
}

// Helper to get Supabase Admin client dynamically on request
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
  }

  return createClient(url, serviceRoleKey);
}

export async function sendCustomOtp(email: string) {
  try {
    const resend = getResendClient();
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Generate 6-digit code
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes lifetime

    // 2. Clear old tokens and save new one
    await supabaseAdmin.from('auth_tokens').delete().eq('email', email);
    const { error: dbError } = await supabaseAdmin.from('auth_tokens').insert({
      email,
      token,
      expires_at: expiresAt.toISOString(),
    });

    if (dbError) throw new Error(`Database registry failed: ${dbError.message}`);

    // 3. Email code via Resend
    await resend.emails.send({
      from: 'MIVP Auth <onboarding@resend.dev>', // Free tier default address
      to: email,
      subject: `${token} is your MIVP Security Code`,
      html: `<p>Your security code for the Motomedia portal is <strong>${token}</strong>. It will expire in 5 minutes.</p>`,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

export async function verifyCustomOtp(email: string, token: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('auth_tokens')
      .select('*')
      .eq('email', email)
      .eq('token', token)
      .single();

    if (error || !data) return { success: false, error: 'Invalid or expired code.' };

    const isExpired = new Date() > new Date(data.expires_at);
    if (isExpired) return { success: false, error: 'Code has expired.' };

    // Delete token after successful verification
    await supabaseAdmin.from('auth_tokens').delete().eq('email', email);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Verification failed.' };
  }
}