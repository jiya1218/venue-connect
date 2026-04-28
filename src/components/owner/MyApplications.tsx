"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Clock, CheckCircle, XCircle, Info, Building2 } from "lucide-react";

export default function MyApplications() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('venue_applications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;

    if (applications.length === 0) return null;

    return (
        <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> My Applications
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                    <div key={app.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{app.business_name}</h4>
                                <p className="text-xs text-slate-500 capitalize">{app.venue_type} Application</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <StatusBadge status={app.status} />
                            <p className="text-[10px] text-slate-400 font-medium">{new Date(app.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'pending':
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100">
                    <Clock size={12} /> Pending Review
                </span>
            );
        case 'approved':
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                    <CheckCircle size={12} /> Approved
                </span>
            );
        case 'rejected':
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
                    <XCircle size={12} /> Rejected
                </span>
            );
        default:
            return <span className="text-xs font-bold text-slate-400">{status}</span>;
    }
}
