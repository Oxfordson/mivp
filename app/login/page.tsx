// DO NOT put 'use client' here
import { Suspense } from 'react';
import LoginClient from './login-client'; // Import the client component you just created

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/allmen.jpeg')"
      }}
    >
      {/* Background Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] z-0" />

      {/* Next.js requires the boundary to be placed inside a Server Component */}
      <Suspense fallback={
        <div className="relative z-10 flex items-center justify-center h-64 w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E60000]"></div>
        </div>
      }>
        <LoginClient />
      </Suspense>
    </div>
  );
}