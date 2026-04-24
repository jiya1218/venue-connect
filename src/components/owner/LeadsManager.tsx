import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Mail, Phone, CalendarDays } from "lucide-react";

export default function LeadsManager() {
    const [leads, setLeads] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (leadId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('leads')
                .update({ status: newStatus })
                .eq('id', leadId);

            if (error) throw error;
            
            toast.success("Lead status updated");
            setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
        } catch (error) {
            console.error("Error updating lead:", error);
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;
    }

    if (leads.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Leads Yet</h3>
                <p className="text-slate-500 max-w-sm">When customers request a quote on your listings, their contact details will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Leads & Inquiries</h2>
                    <p className="text-sm text-slate-500">Manage {leads.length} customer inquiries across your listings.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[180px]">Customer</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>Event Details</TableHead>
                            <TableHead className="w-[300px]">Message</TableHead>
                            <TableHead className="w-[140px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id as string} className="group">
                                <TableCell className="font-medium align-top py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-900">{String(lead.customer_name)}</span>
                                        <span className="text-xs text-slate-400">
                                            {format(new Date(String(lead.created_at)), 'MMM d, yyyy h:mm a')}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <div className="flex flex-col gap-1.5 text-sm">
                                        {Boolean(lead.customer_phone) && (
                                            <a href={`tel:${lead.customer_phone}`} className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                                                <Phone className="w-3.5 h-3.5" /> {String(lead.customer_phone)}
                                            </a>
                                        )}
                                        <a href={`mailto:${lead.customer_email}`} className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                                            <Mail className="w-3.5 h-3.5" /> {String(lead.customer_email)}
                                        </a>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                                            {lead.event_date ? format(new Date(String(lead.event_date)), 'MMM d, yyyy') : 'No date set'}
                                        </div>
                                        <Badge variant="outline" className="w-fit text-[10px] uppercase font-semibold mt-1 bg-slate-50">
                                            {String(lead.listing_type)} Inquiry
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <p className="text-sm text-slate-600 line-clamp-3 hover:line-clamp-none transition-all">
                                        {lead.message ? String(lead.message) : "No additional message provided."}
                                    </p>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <Select 
                                        defaultValue={String(lead.status || 'new')} 
                                        onValueChange={(val) => updateLeadStatus(String(lead.id), val)}
                                    >
                                        <SelectTrigger className={`h-8 text-xs font-semibold ${
                                            lead.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            lead.status === 'contacted' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            'bg-green-50 text-green-700 border-green-200'
                                        }`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new" className="text-blue-700 font-medium">New</SelectItem>
                                            <SelectItem value="contacted" className="text-amber-700 font-medium">Contacted</SelectItem>
                                            <SelectItem value="closed" className="text-green-700 font-medium">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
