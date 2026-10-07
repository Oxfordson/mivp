import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0A2A6A] text-white flex flex-col justify-between p-6">
        <div>
          <div className="mb-8">
            <p className="text-xs uppercase font-mono tracking-widest text-blue-200">Motomedia</p>
            <h2 className="text-xl font-bold">MIVP Admin</h2>
          </div>
          <nav className="space-y-2 text-sm font-medium">
            <Link
              href="/admin/dashboard"
              className="block px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Analytics Dashboard
            </Link>
            <Link
              href="/admin/events"
              className="block px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              Manage Events
            </Link>
            <Link
              href="/admin/events/new"
              className="block px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              + Create Poll / Election
            </Link>
          </nav>
        </div>
        <div className="pt-6 border-t border-blue-900 text-xs text-blue-300">
          <Link href="/portal" className="hover:underline">
            Switch to Voter View
          </Link>
        </div>
      </aside>

      {/* Main Administrative Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}