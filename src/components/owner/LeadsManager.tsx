import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Mail, Phone, CalendarDays, X as CloseIcon } from "lucide-react";

export default function LeadsManager() {
    const [leads, setLeads] = useState<Record<string, any>[]>([]);
    const [loading, setLoading] = useState(true);
    const [quota, setQuota] = useState({ used: 0, total: 50 });
    const supabase = createClient();

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const { data: { user } } = await (supabase.auth.getUser() as any);
            if (!user) return;

            // Fetch leads
            const { data: leadsData, error: leadsError } = await supabase
                .from('leads')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (leadsError) throw leadsError;
            setLeads(leadsData || []);

            // Fetch quota from venues/vendors
            const { data: venueData } = await supabase.from('venues').select('leads_quota, leads_used').eq('owner_id', user.id).limit(1);
            if (venueData && venueData[0]) {
                setQuota({ used: venueData[0].leads_used, total: venueData[0].leads_quota });
            } else {
                const { data: vendorData } = await supabase.from('vendors').select('leads_quota, leads_used').eq('owner_id', user.id).limit(1);
                if (vendorData && vendorData[0]) {
                    setQuota({ used: vendorData[0].leads_used, total: vendorData[0].leads_quota });
                }
            }

        } catch (error) {
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (leadId: string, newStatus: string) => {
        try {
            const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
            if (error) throw error;
            toast.success("Status updated");
            setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        } catch (error) {
            toast.error("Update failed");
        }
    };

    if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;

    const isOverQuota = (index: number) => {
        // Simple logic: if index >= total quota, blur it
        // Note: index is 0-based, so for 50 leads, index 50 (the 51st) is over quota
        return index >= quota.total;
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Leads & Inquiries</h2>
                    <p className="text-sm text-slate-500">Manage your customer inquiries.</p>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                        <span>Lead Usage</span>
                        <span>{quota.used} / {quota.total === 999999 ? '∞' : quota.total}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all ${quota.used >= quota.total ? 'bg-red-500' : 'bg-primary'}`} 
                            style={{ width: `${Math.min((quota.used / quota.total) * 100, 100)}%` }} 
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead>Event Details</TableHead>
                                <TableHead className="w-[300px]">Message</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 italic">No inquiries yet.</TableCell></TableRow>
                            ) : (
                                leads.map((lead, idx) => {
                                    const blurred = isOverQuota(idx);
                                    return (
                                        <TableRow key={lead.id} className={`group ${blurred ? 'bg-slate-50/50' : ''}`}>
                                            <TableCell className="align-top py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`font-bold ${blurred ? 'blur-sm select-none' : 'text-slate-900'}`}>{lead.customer_name}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                                        {format(new Date(lead.created_at), 'MMM d, h:mm a')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    {blurred ? (
                                                        <div className="text-xs font-bold text-red-500 flex items-center gap-1">
                                                            <CloseIcon className="w-3 h-3" /> Quota Exceeded
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <a href={`tel:${lead.customer_phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors font-medium">
                                                                <Phone className="w-3.5 h-3.5" /> {lead.customer_phone}
                                                            </a>
                                                            <a href={`mailto:${lead.customer_email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors font-medium">
                                                                <Mail className="w-3.5 h-3.5" /> {lead.customer_email}
                                                            </a>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-6">
                                                <div className="flex flex-col gap-1 text-sm text-slate-600 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                                                        {lead.event_date ? format(new Date(lead.event_date), 'MMM d, yyyy') : 'TBD'}
                                                    </div>
                                                    <Badge variant="outline" className="w-fit text-[9px] font-black uppercase tracking-tighter bg-slate-50 border-slate-200">
                                                        {lead.listing_type}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-6">
                                                <p className={`text-sm text-slate-600 line-clamp-2 ${blurred ? 'blur-md select-none' : ''}`}>
                                                    {lead.message || "No message provided."}
                                                </p>
                                            </TableCell>
                                            <TableCell className="align-top py-6">
                                                <Select defaultValue={lead.status || 'new'} onValueChange={(v) => updateLeadStatus(lead.id, v)}>
                                                    <SelectTrigger className="h-8 text-[10px] font-bold uppercase tracking-widest w-[110px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="new">New</SelectItem>
                                                        <SelectItem value="contacted">Contacted</SelectItem>
                                                        <SelectItem value="closed">Closed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            
            {leads.length > quota.total && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600"><Mail className="w-6 h-6" /></div>
                        <div>
                            <h4 className="font-bold text-slate-900">Unlock Hidden Leads</h4>
                            <p className="text-sm text-slate-600">You have {leads.length - quota.total} new inquiries that are currently hidden.</p>
                        </div>
                    </div>
                    <Button onClick={() => window.location.href='/pricing'} className="bg-amber-600 hover:bg-amber-700 text-white font-black h-12 px-8 rounded-xl shadow-lg shadow-amber-200">
                        Upgrade Your Plan
                    </Button>
                </div>
            )}
        </div>
    );
}
