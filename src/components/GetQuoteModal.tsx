"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface GetQuoteModalProps {
    businessName: string;
    listingId: string;
    listingType: 'venue' | 'vendor';
    ownerId?: string | null;
    triggerButton?: React.ReactNode;
}

const GetQuoteModal = ({ businessName, listingId, listingType, ownerId, triggerButton }: GetQuoteModalProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('leads').insert([
                {
                    listing_id: listingId,
                    listing_type: listingType,
                    owner_id: ownerId || null,
                    customer_name: name,
                    customer_phone: phone,
                    message: `Quote request from VenueConnect`
                }
            ]);

            if (error) throw error;

            toast.success(`Request sent!`, {
                description: "They will contact you shortly.",
            });

            setName("");
            setPhone("");
            setOpen(false);
        } catch (error: any) {
            toast.error("Failed to send request", {
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md text-base h-12">
                        Request Pricing Details
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[340px] max-h-[calc(100vh-120px)] overflow-y-auto p-0 border-none bg-transparent">
                <div className="bg-rose-50 rounded-2xl p-4 shadow-lg">
                    <h2 className="text-lg font-serif font-bold text-slate-900 mb-4">Get Callback</h2>

                    <form onSubmit={handleSubmit} className="space-y-2.5">
                        <div>
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full h-9 px-3 rounded-lg border border-slate-200 outline-none focus:border-primary text-xs bg-white" 
                            />
                        </div>

                        <div>
                            <input 
                                type="tel" 
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Mobile Number"
                                className="w-full h-9 px-3 rounded-lg border border-slate-200 outline-none focus:border-primary text-xs bg-white" 
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="!h-7 w-full mt-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-tight shadow-sm py-0 px-2"
                        >
                            {loading ? "Sending..." : "Get Quotes"}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                        50K+ Happy Families
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GetQuoteModal;
