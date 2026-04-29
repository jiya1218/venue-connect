'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, Phone, Mail, Calendar, Building, User } from "lucide-react";
import { format } from "date-fns";

export default function LeadsTab() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .ilike('customer_email', 'PENDING_ADMIN_%')
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            // Fetch venue names manually for the leads found
            const venueIds = Array.from(new Set(data.map(l => l.listing_id))).filter(Boolean);
            if (venueIds.length > 0) {
                const { data: venuesData } = await supabase
                    .from('venues')
                    .select('id, name')
                    .in('id', venueIds);
                
                const venueMap = Object.fromEntries(venuesData?.map(v => [v.id, v.name]) || []);
                const enrichedLeads = data.map(l => ({
                    ...l,
                    venue_name: venueMap[l.listing_id] || 'Unknown Venue'
                }));
                setLeads(enrichedLeads);
            } else {
                setLeads(data || []);
            }
        } catch (error: any) {
            toast.error("Failed to fetch leads");
            console.error("Fetch Leads Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (lead: any) => {
        try {
            const cleanEmail = lead.customer_email.replace('PENDING_ADMIN_', '');
            const { error } = await supabase
                .from('leads')
                .update({ customer_email: cleanEmail })
                .eq('id', lead.id);

            if (error) throw error;
            toast.success("Lead approved and sent to venue owner");
            setLeads(leads.filter(l => l.id !== lead.id));
        } catch (error) {
            toast.error("Approval failed");
        }
    };

    const handleReject = async (leadId: string) => {
        try {
            const { error } = await supabase
                .from('leads')
                .update({ status: 'rejected' })
                .eq('id', leadId);

            if (error) throw error;
            toast.success("Lead rejected");
            setLeads(leads.map(l => l.id === leadId ? { ...l, status: 'rejected' } : l));
        } catch (error) {
            toast.error("Rejection failed");
        }
    };

    if (loading) return <div className="p-20 text-center">Loading leads...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Lead Management</h2>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {leads.filter(l => l.customer_email?.startsWith('PENDING_ADMIN_')).length} Pending Approval
                </Badge>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="font-black uppercase tracking-widest text-[10px]">Customer</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px]">Venue</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px]">Event Details</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px]">Status</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-slate-900 flex items-center gap-2">
                                            <User size={14} className="text-slate-400" /> {lead.customer_name}
                                        </span>
                                        <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5"><Phone size={12} /> {lead.customer_phone}</span>
                                            <span className="flex items-center gap-1.5"><Mail size={12} /> {lead.customer_email.replace('PENDING_ADMIN_', '')}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                        <Building size={16} className="text-primary" />
                                        {lead.venue_name || "Unknown Venue"}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                                        <span className="flex items-center gap-1.5 font-bold">
                                            <Calendar size={12} /> {lead.event_date ? format(new Date(lead.event_date), 'MMM dd, yyyy') : 'TBD'}
                                        </span>
                                        <p className="line-clamp-2 max-w-xs italic text-slate-400">
                                            {lead.message}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge 
                                        className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-lg ${
                                            lead.customer_email.startsWith('PENDING_ADMIN_') ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            lead.status === 'new' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                            'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}
                                    >
                                        {lead.customer_email.startsWith('PENDING_ADMIN_') ? 'Pending Admin' : lead.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {lead.customer_email.startsWith('PENDING_ADMIN_') && (
                                        <div className="flex items-center justify-end gap-2">
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleApprove(lead)}
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-9 w-9 p-0"
                                            >
                                                <Check size={18} />
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => handleReject(lead.id)}
                                                className="text-red-500 border-red-100 hover:bg-red-50 rounded-xl h-9 w-9 p-0"
                                            >
                                                <X size={18} />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
