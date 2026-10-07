'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { sendCustomOtp, verifyCustomOtp } from '@/actions/otp';

export default function LoginClient() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/portal';

  // Step 1: Validate Email & Request 6-digit OTP Code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const supabase = createClient();

    if (!cleanEmail.endsWith('@motomedia-group.com')) {
      const { data: staffMember, error: staffError } = await supabase
        .from('staff')
        .select('id, is_active, is_manually_enrolled')
        .eq('email', cleanEmail)
        .single();

      if (staffError || !staffMember || !staffMember.is_active || !staffMember.is_manually_enrolled) {
        setErrorMsg(
          'Access Restricted: Only @motomedia-group.com addresses or admin-authorized external staff are permitted.'
        );
        setLoading(false);
        return;
      }
    }

    const res = await sendCustomOtp(cleanEmail);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to dispatch security code.');
      setLoading(false);
      return;
    }

    setInfoMsg(`A 6-digit authentication code has been dispatched to ${cleanEmail}.`);
    setStep('otp');
    setLoading(false);
  };

  // Step 2: Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const res = await verifyCustomOtp(cleanEmail, otpCode.trim());

    if (!res.success) {
      setErrorMsg(res.error || 'Invalid or expired code. Please request a new one.');
      setLoading(false);
      return;
    }

    if (cleanEmail.includes('admin') && !searchParams.get('redirect')) {
      router.push('/admin/dashboard');
    } else {
      router.push(redirectPath);
    }
    router.refresh();
  };

  return (
    <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-8">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Image
          src="/logo.png"
          alt="Motomedia Logo"
          width={160}
          height={44}
          className="h-10 w-auto object-contain mb-3"
          priority
        />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff Voting Authentication</h1>
        <p className="text-xs text-slate-500 mt-1">Motomedia Independent Voting Portal (MIVP)</p>
      </div>

      {/* Step-by-Step Instructions Callout */}
      <div className="mb-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
        <strong className="block text-slate-800 font-semibold mb-1">Login Instructions:</strong>
        <ul className="list-disc list-inside space-y-1 text-[11px]">
          <li>Enter your motomedia email (<span className="font-mono text-slate-500"> @motomedia-group.com </span>).</li>
          <li>Admins will manually pre-enroll staff using gmail.</li>
          <li>Check your email inbox or spam folder for a one-time 6-digit access token.</li>
        </ul>
      </div>

      {/* Alert Notifications */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
          <span className="font-bold">Error:</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {infoMsg && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 flex items-start gap-2">
          <span className="font-bold">Notice:</span>
          <span>{infoMsg}</span>
        </div>
      )}

      {/* Step 1: Input Email */}
      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g henry@motomedia-group.com"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-transparent transition"
            />
          </div>
          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white py-2.5 font-semibold text-sm transition-all"
          >
            Send Security Code
          </Button>
        </form>
      ) : (
        /* Step 2: Input OTP */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">6-Digit Security Token</label>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-[11px] text-[#E60000] hover:underline font-medium"
              >
                Change Email
              </button>
            </div>
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              className="w-full tracking-widest text-center font-mono text-lg font-bold px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-transparent transition"
            />
          </div>
          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white py-2.5 font-semibold text-sm transition-all"
          >
            Verify & Enter Portal
          </Button>
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="text-xs text-slate-500 hover:text-slate-800 transition underline"
            >
              Did not receive the code? Resend
            </button>
          </div>
        </form>
      )}

      {/* Back Link */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 transition">
          ← Return to Landing Page
        </Link>
      </div>
    </div>
  );
}