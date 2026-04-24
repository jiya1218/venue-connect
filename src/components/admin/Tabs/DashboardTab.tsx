'use client';

import { useState, useEffect } from 'react';
import { Building2, Store, ClipboardList, Sparkles, TrendingUp, TrendingDown, Clock, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Stats {
  totalVenues: number;
  totalVendors: number;
  pendingApplications: number;
  newThisWeek: number;
  recentActivity: any[];
}

export default function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading statistics...</div>;

  const cards = [
    { label: 'Total Venues', value: stats?.totalVenues || 0, icon: <Building2 />, color: 'bg-blue-500', trend: '↑ 12%' },
    { label: 'Total Vendors', value: stats?.totalVendors || 0, icon: <Store />, color: 'bg-purple-500', trend: '↑ 8%' },
    { label: 'Pending Apps', value: stats?.pendingApplications || 0, icon: <ClipboardList />, color: 'bg-amber-500', trend: stats?.pendingApplications ? 'Attention' : 'Clean' },
    { label: 'New This Week', value: stats?.newThisWeek || 0, icon: <Sparkles />, color: 'bg-emerald-500', trend: 'New' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl ${card.color} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                    {card.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${card.trend.includes('↑') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    {card.trend}
                </span>
             </div>
             <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{card.label}</p>
             <h3 className="text-4xl font-display font-black text-slate-900">{card.value}</h3>
             
             {/* Decorative Background Icon */}
             <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity scale-150 rotate-12">
                {card.icon}
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" /> Recent Activity
                  </h3>
                  <Button variant="ghost" className="text-xs font-bold text-primary">View All History</Button>
              </div>
              
              <div className="space-y-6">
                  {stats?.recentActivity?.map((act) => (
                      <div key={act.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${act.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                  {act.status === 'approved' ? <CheckCircle2 size={18} /> : <X size={18} />}
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-slate-700">
                                      <span className="text-slate-400 font-medium">[{act.venue_type}]</span> {act.business_name}
                                  </p>
                                  <p className="text-xs text-slate-400 font-medium">Was {act.status} • {new Date(act.created_at).toLocaleDateString()}</p>
                              </div>
                          </div>
                      </div>
                  ))}
                  {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                      <p className="text-center py-10 text-slate-400 font-medium italic">No recent status changes recorded.</p>
                  )}
              </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-display font-bold mb-6">Quick Actions</h3>
                <div className="space-y-4">
                    <Button className="w-full h-14 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold transition-all justify-between px-6 group" onClick={() => window.location.href = '?tab=applications'}>
                        Review Pending ({stats?.pendingApplications || 0}) 
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">→</span>
                    </Button>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-bold justify-between px-6" onClick={() => window.location.href = '#tab=listings'}>
                        Manage Live Inventory
                        <span className="opacity-40">→</span>
                    </Button>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-bold justify-between px-6" onClick={() => window.location.href = '#tab=users'}>
                        Audit User Permissions
                        <span className="opacity-40">→</span>
                    </Button>
                </div>
              </div>
          </div>
      </div>

    </div>
  );
}
