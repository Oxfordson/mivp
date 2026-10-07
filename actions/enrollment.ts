'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface ManualEnrollInput {
  staffId: string;
  fullName: string;
  email: string;
  department: string;
  designation?: string;
}

export async function enrollManualStaffAction(input: ManualEnrollInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isAdmin =
    user?.app_metadata?.role === 'admin' ||
    user?.user_metadata?.is_admin === true;

  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin privileges required.' };
  }

  // Insert or update staff with manual enrollment flag
  const { error } = await supabase.from('staff').upsert(
    {
      staff_id: input.staffId.trim().toUpperCase(),
      email: input.email.trim().toLowerCase(),
      full_name: input.fullName.trim(),
      department: input.department.trim(),
      designation: input.designation?.trim() || null,
      is_manually_enrolled: true,
      is_active: true,
    },
    { onConflict: 'staff_id' }
  );

  if (error) {
    return { success: false, error: error.message };
  }

  // Pre-create Supabase auth user if needed, or allow OTP flow
  revalidatePath('/admin/dashboard');
  return { success: true };
}