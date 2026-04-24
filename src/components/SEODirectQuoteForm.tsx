"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Phone, User, Send } from "lucide-react";

interface SEODirectQuoteFormProps {
    city: string;
    category: string;
}

export default function SEODirectQuoteForm({ city, category }: SEODirectQuoteFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('leads').insert([
                {
                    customer_name: name,
                    customer_phone: phone,
                    listing_type: category.includes('photographer') || category.includes('makeup') ? 'vendor' : 'venue',
                    message: `SEO Lead from ${city} for ${category}. User requested a direct quote.`,
                    status: 'new'
                }
            ]);

            if (error) throw error;

            toast.success("Request Sent!", {
                description: `Top ${category} in ${city} will contact you shortly.`,
            });
            setName("");
            setPhone("");
        } catch (error: any) {
            toast.error("Failed to send request", {
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide flex items-center gap-1">
                    <User className="w-3 h-3" /> Full Name
                </label>
                <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all shadow-sm text-sm" 
                    placeholder="e.g. John Doe" 
                />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Contact No (WhatsApp)
                </label>
                <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all shadow-sm text-sm" 
                    placeholder="+91" 
                />
            </div>
            <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 mt-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-lg shadow-lg shadow-primary/20 uppercase tracking-widest flex items-center justify-center gap-2"
            >
                {loading ? "Sending..." : (
                    <>
                        <Send className="w-4 h-4" /> Connect Now
                    </>
                )}
            </Button>
            <p className="text-[10px] text-center text-slate-400 mt-4 leading-tight italic">
                By clicking "Connect Now", you agree to be contacted by verified businesses.
            </p>
        </form>
    );
}
