'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, XCircle, Clock, Building2, User, Package, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditRequestsTab() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('edit_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast.error("Failed to load edit requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      // 1. Get the request details
      const req = requests.find(r => r.id === requestId);
      if (!req) return;

      // 2. If approved, update the live table
      if (action === 'approved') {
        const table = req.listing_type === 'vendor' ? 'vendors' : 'venues';
        const { error: updateError } = await supabase
          .from(table)
          .update({ [req.field_name]: req.new_value })
          .eq('id', req.listing_id);
        
        if (updateError) throw updateError;
      }

      // 3. Update request status
      const { error: statusError } = await supabase
        .from('edit_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (statusError) throw statusError;

      toast.success(`Request ${action} successfully`);
      fetchRequests();
    } catch (error: any) {
      toast.error("Action failed: " + error.message);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Processing requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sensitive Edit Requests</h1>
          <p className="text-slate-500 font-medium">Changes to business names, contact info, or plans require your approval.</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-2xl font-bold text-sm border border-amber-200">
          {requests.length} Pending Approval
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">All Clear!</h3>
          <p className="text-slate-400 mt-2">No pending sensitive edit requests at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-primary/20 transition-all">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                {req.field_name.includes('plan') ? <Package className="text-blue-500" /> : 
                 req.field_name.includes('name') ? <Building2 className="text-purple-500" /> : 
                 <User className="text-slate-400" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{req.listing_type} Edit</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{req.field_name.replace('_', ' ')}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-lg">Change requested for ID: ...{req.listing_id.slice(-6)}</h4>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                    <span className="block text-[8px] font-black text-rose-400 uppercase">Current Value</span>
                    <span className="font-bold text-rose-700 line-through opacity-60">{req.old_value || 'Empty'}</span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Clock size={16} className="animate-bounce-x" />
                  </div>
                  <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                    <span className="block text-[8px] font-black text-emerald-400 uppercase">Requested Value</span>
                    <span className="font-bold text-emerald-700">{req.new_value}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button 
                  onClick={() => handleAction(req.id, 'approved')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 px-6 rounded-xl"
                >
                  Approve
                </Button>
                <Button 
                  onClick={() => handleAction(req.id, 'rejected')}
                  variant="ghost"
                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold h-12 px-6 rounded-xl"
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
