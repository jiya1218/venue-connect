'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Check, 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Filter, 
  Menu,
  CheckSquare,
  Square,
  Clock,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ApplicationsTab() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'venue' | 'vendor'>('all');
  
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const supabase = createClient();

  useEffect(() => {
    fetchApplications();
  }, [typeFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let q = supabase
        .from('venue_applications')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (typeFilter !== 'all') {
        q = q.eq('venue_type', typeFilter);
      }

      const { data, error } = await q;
      if (error) throw error;
      setApplications(data || []);
      setSelectedIds([]); // Reset selection on refresh
    } catch (error) {
      console.error(error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (app: any) => {
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: app.id })
      });
      if (res.ok) {
        toast.success(`${app.business_name} is now LIVE!`);
        setApplications(applications.filter(a => a.id !== app.id));
      } else {
        const error = await res.json();
        throw new Error(error.error || "Approval failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) return;
    const toastId = toast.loading(`Launching ${selectedIds.length} listings live...`);
    
    let successCount = 0;
    for (const id of selectedIds) {
        try {
            const res = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: id })
            });
            if (res.ok) successCount++;
        } catch (e) {}
    }

    toast.dismiss(toastId);
    toast.success(`Successfully launched ${successCount} businesses!`);
    fetchApplications();
  };

  const handleReject = async (appId: string) => {
    if (!confirm("Are you sure you want to reject this application?")) return;
    try {
      const { error } = await supabase.from('venue_applications').update({ status: 'rejected' }).eq('id', appId);
      if (error) throw error;
      toast.success("Application rejected.");
      setApplications(applications.filter(a => a.id !== appId));
    } catch (error) {
      toast.error("Rejection failed");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
          <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display mb-1">Application Queue</h1>
              <p className="text-slate-400 font-medium text-sm">Review incoming business requests to verify legitimacy before listing.</p>
          </div>
          
          <div className="flex items-center gap-3">
              <select 
                className="h-12 px-4 rounded-xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
              >
                  <option value="all">Filter: ALL</option>
                  <option value="venue">Filter: VENUES</option>
                  <option value="vendor">Filter: VENDORS</option>
              </select>
              
              <Button 
                className={`h-12 px-6 rounded-xl font-bold transition-all ${selectedIds.length > 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400 pointer-events-none'}`}
                onClick={handleBatchApprove}
              >
                  <Sparkles size={16} className="mr-2" /> 
                  {selectedIds.length > 0 ? `Approve Selected (${selectedIds.length})` : 'Approve Selected'}
              </Button>
          </div>
      </div>

      {/* Queue Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                    {applications.length}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">Pending Requests</h2>
              </div>
              <button 
                className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                onClick={() => setSelectedIds(selectedIds.length === applications.length ? [] : applications.map(a => a.id))}
              >
                {selectedIds.length === applications.length ? 'Deselect All' : 'Select All'}
              </button>
          </div>

          <div className="divide-y divide-slate-50">
              {loading ? (
                  <div className="p-20 text-center">
                      <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-slate-400 font-medium">Fetching queue...</p>
                  </div>
              ) : applications.length === 0 ? (
                  <div className="p-32 text-center">
                       <CheckSquare size={64} className="text-emerald-100 mx-auto mb-6" />
                       <h3 className="text-2xl font-black text-slate-900 mb-2">Queue Clear!</h3>
                       <p className="text-slate-400 font-medium italic">There are no pending applications needing review.</p>
                  </div>
              ) : (
                  applications.map((app) => (
                      <div key={app.id} className={`group transition-all duration-300 ${selectedIds.includes(app.id) ? 'bg-primary/5' : 'hover:bg-slate-50/50'}`}>
                          <div className="p-8 flex items-center gap-8">
                                <button className="shrink-0 group" onClick={() => toggleSelect(app.id)}>
                                    {selectedIds.includes(app.id) ? (
                                        <CheckSquare className="w-6 h-6 text-primary" />
                                    ) : (
                                        <Square className="w-6 h-6 text-slate-200 group-hover:text-slate-300" />
                                    )}
                                </button>

                                <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                    <img src={app.images?.[0] || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-xl text-slate-900 font-display">{app.business_name}</h3>
                                        <Badge variant="outline" className={`rounded-lg border font-bold text-[9px] px-2 py-0.5 ${app.venue_type === 'vendor' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {app.venue_type.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-2"><MapPin size={12} className="text-primary" /> {app.city}</div>
                                        <div className="flex items-center gap-2"><Clock size={12} /> {new Date(app.created_at).toLocaleDateString()}</div>
                                        {app.vendor_category && <div className="flex items-center gap-2"><Briefcase size={12} /> {app.vendor_category}</div>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl text-slate-400 hover:text-slate-900" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                                        {expandedId === app.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </Button>
                                    <Button variant="ghost" className="h-12 w-12 p-0 rounded-xl text-rose-500 hover:bg-rose-50" onClick={() => handleReject(app.id)}>
                                        <X size={20} />
                                    </Button>
                                    <Button className="h-12 px-6 rounded-xl bg-slate-900 text-white font-black text-xs tracking-widest hover:bg-slate-800 transition-transform active:scale-95" onClick={() => handleApprove(app)}>
                                        LAUNCH
                                    </Button>
                                </div>
                          </div>

                          {expandedId === app.id && (
                              <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-slate-50/50 border border-slate-100 shadow-inner">
                                      <div className="space-y-4">
                                          <h4 className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">Contact Point</h4>
                                          <div className="space-y-2">
                                              <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Menu size={14} className="text-slate-300" /> {app.contact_person || 'N/A'}</p>
                                              <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Phone size={14} className="text-slate-300" /> {app.business_phone || 'N/A'}</p>
                                              <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Mail size={14} className="text-slate-300" /> {app.business_email || 'N/A'}</p>
                                          </div>
                                      </div>
                                      <div className="md:col-span-2 space-y-4">
                                          <h4 className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">Pitch / Description</h4>
                                          <p className="text-slate-600 font-light italic leading-relaxed text-sm">
                                              "{app.description || 'The owner provided no detailed description with this application.'}"
                                          </p>
                                          <div className="flex gap-3 overflow-x-auto pb-2">
                                              {app.images?.map((img: string, i: number) => (
                                                  <div key={i} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                                                      <img src={img} className="w-full h-full object-cover" />
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>
                  ))
              )}
          </div>
      </div>

    </div>
  );
}
