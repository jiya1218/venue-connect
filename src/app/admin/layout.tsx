import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Globe, 
  Settings, 
  LogOut, 
  Users, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Database,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  let user: any = null;

  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect('/admin/login');
    
    user = session.user;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email !== adminEmail) redirect('/');
  }

  const NAV_ITEMS = [
    { href: '/admin?tab=dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin?tab=listings', label: 'Listings', icon: Database },
    { href: '/admin?tab=applications', label: 'Applications', icon: ClipboardList },
    { href: '/admin?tab=users', label: 'Users', icon: Users },
    { href: '/admin?tab=cities', label: 'Cities', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col shrink-0 z-20 shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                   <span className="font-display font-black text-xl tracking-tight block leading-none">VC Admin</span>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Control Panel</span>
                </div>
            </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link 
              key={href} 
              href={href} 
              className="flex items-center justify-between group px-4 py-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <div className="flex items-center gap-4">
                <Icon size={20} className="group-hover:text-primary transition-colors" />
                <span className="font-bold text-sm tracking-wide">{label}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3 mb-6 p-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-primary">
                    {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user?.email}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Administrator</p>
                </div>
            </div>
            <form action="/api/admin/logout" method="POST">
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                >
                    <LogOut size={16} /> Sign out
                </button>
            </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto relative">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-[3px]">Overview</h2>
              <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-slate-400 border border-slate-200">
                  <Search size={16} />
                  <input type="text" placeholder="Global search..." className="bg-transparent border-none focus:outline-none text-xs w-48 font-medium" />
              </div>
           </div>
           <div className="flex items-center gap-4">
               <div className="flex flex-col items-end">
                   <span className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                   <span className="text-[10px] text-slate-400 font-medium">System operational</span>
               </div>
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           </div>
        </header>

        <div className="p-8 pb-32">
            {children}
        </div>
      </main>

    </div>
  );
}
