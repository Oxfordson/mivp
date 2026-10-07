import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div 
      className="min-h-screen flex flex-col relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        // A sophisticated modern corporate architectural background. 
        // Replace this URL with '/background.jpg' and place your image in the public folder.
        backgroundImage: "url('/allstaff.jpeg')" 
      }}
    >
      {/* Deep overlay to ensure the foreground elements pop and maintain high readability */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] z-0"></div>

      {/* Navigation Header - Glassmorphism style */}
      <header className="relative z-10 bg-white/90 backdrop-blur-md border-b border-white/20 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          {/* 
            Ensure you have a 'logo.png' in your 'public' folder. 
            Adjust width and height values as needed for your specific logo aspect ratio.
          */}
          <Image 
            src="/logo.png" 
            alt="Motomedia Logo" 
            width={180} 
            height={48} 
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--moto-red)] flex items-center gap-2">
            
            Secure Voting Portal
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 bg-white/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/20">
          
          {/* Left Side - Dark Branding Panel */}
          <div className="bg-[var(--moto-black)]/95 p-12 flex flex-col justify-center text-[var(--moto-white)] relative overflow-hidden">
            {/* Subtle red accent glow in the background of the dark panel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--moto-red)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10">
              
              <h1 className="text-4xl font-bold leading-tight mb-6 tracking-tight">
                Motomedia <br /> Independent <br /> Voting Portal
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Real-time accreditation, cryptographic ballot security, and behavioral voting analytics for departmental and general elections.
              </p>
              <div className="mt-auto pt-8 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 font-mono tracking-widest">AUTHORIZED PERSONNEL ONLY</p>
              </div>
            </div>
          </div>

          {/* Right Side - Action Panel */}
          <div className="p-12 flex flex-col justify-center bg-white/50">
            <h2 className="text-2xl font-bold text-[var(--moto-black)] mb-2 tracking-tight">Access Portal</h2>
            <p className="text-sm text-slate-500 mb-8">
              Authenticate using your motomedia credentials to view your eligibility and cast your ballots.
            </p>

            <div className="space-y-4">
              <Link 
                href="/login"
                className="w-full flex justify-center items-center py-3 px-4 bg-[var(--moto-red)] hover:bg-[#CC0000] text-white font-semibold rounded-lg shadow-md shadow-red-900/20 transition-all focus:ring-4 focus:ring-red-100 active:scale-[0.98]"
              >
                Staff Login
              </Link>
              
              <Link 
                href="/admin/dashboard"
                className="w-full flex justify-center items-center py-3 px-4 bg-slate-100 hover:bg-slate-200 text-[var(--moto-black)] font-semibold rounded-lg transition-all active:scale-[0.98]"
              >
                Admin Dashboard
              </Link>
            </div>

        
          </div>

        </div>
      </main>
    </div>
  );
}