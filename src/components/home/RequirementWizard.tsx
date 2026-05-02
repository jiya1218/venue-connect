"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronRight, ChevronLeft, MapPin, Calendar, Users, 
    IndianRupee, Utensils, Building2, CheckCircle2, 
    Sparkles, Phone, Mail, User, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";


const OCCASIONS = [
    'Wedding', 'Birthday Party', 'Engagement', 'Corporate Event', 'Reception', 
    'Sangeet Ceremony', 'Haldi Ceremony', 'Mehendi Ceremony', 'Anniversary Party', 
    'Baby Shower', 'Bridal Shower', 'Bachelor Party', 'Kitty Party', 'Get Together', 
    'Family Function', 'Naming Ceremony', 'Aqueeqa Ceremony', 'Christian Communion', 
    'Cocktail Party', 'Cocktail Dinner', 'Pool Party', 'Garba Night', 'Holi Party', 
    'Freshers Party', 'Farewell Party', 'Adventure Party', 'Corporate Party', 
    'Corporate Training', 'Corporate Offsite', 'Conference', 'Seminar', 'Meeting', 
    'Training', 'Team Outing', 'Product Launch', 'Brand Promotion', 'Exhibition', 
    'Walk-in Interview', 'Business Dinner', 'Residential Conference', 'MICE', 
    'Musical Concert', 'Fashion Show', 'Stage Event', 'Game Watch', 'Annual Fest', 
    'Photo Shoots', 'Reunion', 'Class Reunion', 'Kids Birthday Party', 
    'First Birthday Party', 'Engagement Party', 'Reception Party'
];

const CITIES = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'];
const AREAS: Record<string, string[]> = {
    'Ahmedabad': ['Prahlad Nagar', 'Sindhu Bhavan', 'Satellite', 'Bodakdev', 'SG Highway', 'C G Road'],
    'Surat': ['Adajan', 'Vesu', 'Piplod', 'Varachha', 'Dumas'],
    'Vadodara': ['Alkapuri', 'Gotri', 'Akota', 'Sayajigunj'],
    'Rajkot': ['Kalavad Road', 'Yagnik Road', 'University Road'],
    'Gandhinagar': ['Sector 21', 'Kudasan', 'Sargasan', 'Raysan']
};
const SPACE_TYPES = [
    'Banquet Hall', 'Farmhouse', 'Party Plot', 'Hotel', 'Resort', 
    'Restaurant', 'Convention Center', 'Club', 'Rooftop Venue', 
    'Garden Venue', 'Heritage Venue', 'Luxury Venue'
];

const FOOD_TYPES = ['Only Veg', 'Veg + Non-Veg', 'Pure Veg (Jain)'];
const BUDGETS = ['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹1500', '₹1500 - ₹2000', 'Above ₹2000'];

export default function RequirementWizard() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        occasion: '',
        city: '',
        area: '',
        space_type: '',
        food_type: '',
        budget_per_person: '',
        expected_guests: '',
        event_date: '',
        customer_name: '',
        customer_email: '',
        customer_phone: ''
    });

    const supabase = createClient();

    const updateData = (fields: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const isSubmitDisabled = () => {
        return (
            !formData.occasion || !formData.city || !formData.area || 
            !formData.space_type || !formData.food_type || !formData.budget_per_person || 
            !formData.expected_guests || !formData.event_date || 
            !formData.customer_name || !formData.customer_email || !formData.customer_phone
        );
    };

    const handleFinalSubmit = async () => {
        setLoading(true);
        try {
            // 1. Save to Supabase
            const { error } = await supabase.from('user_requirements').insert([
                {
                    ...formData,
                    expected_guests: parseInt(formData.expected_guests) || 0
                }
            ]);

            if (error) throw error;

            // 2. Sync to Google Sheets
            const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
            if (GOOGLE_SHEETS_URL) {
                try {
                    await fetch(GOOGLE_SHEETS_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'text/plain' },
                        body: JSON.stringify(formData)
                    });
                } catch (sheetError) {
                    console.error("Sheet Sync Error:", sheetError);
                }
            }

            toast.success("Request Submitted Successfully!");
            setSubmitted(true);
        } catch (error: any) {
            toast.error("Error submitting request: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-12 text-center text-white shadow-2xl h-[520px] flex flex-col justify-center"
            >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black mb-4 uppercase tracking-wider">Submitted!</h2>
                <p className="text-white/60 text-base mb-10 max-w-sm mx-auto font-medium leading-relaxed">
                    Thank you! Our event concierge will contact you shortly with the best options for your {formData.occasion}.
                </p>
                <Button onClick={() => window.location.reload()} className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs">
                    New Request
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-6 md:p-8 shadow-2xl md:h-[580px] flex flex-col relative overflow-hidden"
            >
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[4px] text-primary mb-1">Instant Quote</p>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Share Your Requirements</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <div className="col-span-2">
                            <SelectField label="Occasion" icon={<Sparkles />} value={formData.occasion} options={OCCASIONS} onChange={(v: string) => updateData({ occasion: v })} />
                        </div>
                        
                        <SelectField label="City" icon={<MapPin />} value={formData.city} options={CITIES} onChange={(v: string) => updateData({ city: v, area: '' })} />
                        <SelectField label="Area" icon={<MapPin />} value={formData.area} options={AREAS[formData.city] || []} onChange={(v: string) => updateData({ area: v })} disabled={!formData.city} />
                        
                        <SelectField label="Venue Type" icon={<Building2 />} value={formData.space_type} options={SPACE_TYPES} onChange={(v: string) => updateData({ space_type: v })} />
                        <SelectField label="Food Type" icon={<Utensils />} value={formData.food_type} options={FOOD_TYPES} onChange={(v: string) => updateData({ food_type: v })} />
                        
                        <SelectField label="Budget/Person" icon={<IndianRupee />} value={formData.budget_per_person} options={BUDGETS} onChange={(v: string) => updateData({ budget_per_person: v })} />
                        <InputField label="Guests" icon={<Users />} type="number" value={formData.expected_guests} onChange={(v: string) => updateData({ expected_guests: v })} placeholder="e.g. 200" />
                        
                        <div className="col-span-2">
                            <InputField label="Event Date" icon={<Calendar />} type="date" value={formData.event_date} onChange={(v: string) => updateData({ event_date: v })} />
                        </div>

                        <div className="col-span-2">
                            <InputField label="Full Name" icon={<User />} value={formData.customer_name} onChange={(v: string) => updateData({ customer_name: v })} placeholder="Rahul Sharma" />
                        </div>
                        
                        <InputField label="Mobile" icon={<Phone />} value={formData.customer_phone} onChange={(v: string) => updateData({ customer_phone: v })} placeholder="98765 43210" />
                        <InputField label="Email" icon={<Mail />} value={formData.customer_email} onChange={(v: string) => updateData({ customer_email: v })} placeholder="rahul@example.com" />
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-6">
                        <p className="text-[10px] text-white/40 font-medium leading-relaxed italic text-center">
                            By clicking submit, you agree to our terms and allow our partners to contact you with event quotes.
                        </p>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 shrink-0">
                    <Button 
                        onClick={handleFinalSubmit}
                        disabled={loading || isSubmitDisabled()}
                        className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </Button>
                </div>
            </motion.div>


            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(239,62,54,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(239,62,54,0.4); }
            `}</style>
        </div>
    );
}

function SelectField({ label, icon, value, options, onChange, disabled = false }: any) {
    return (
        <div className={`space-y-1 ${disabled ? 'opacity-30 pointer-events-none' : ''}`}>
            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 pl-1">
                {icon && <span className="text-primary/60 scale-75">{icon}</span>} {label}
            </label>
            <div className="relative group">
                <select 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all appearance-none cursor-pointer text-[11px] md:text-xs"
                    suppressHydrationWarning
                >
                    <option value="" className="text-slate-900">Select {label}</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt} className="text-slate-900">{opt}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-hover:text-white transition-colors pointer-events-none" />
            </div>
        </div>
    );
}

function InputField({ label, icon, value, onChange, type = "text", placeholder }: any) {
    return (
        <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 pl-1">
                {icon && <span className="text-primary/60 scale-75">{icon}</span>} {label}
            </label>
            <div className="relative group">
                <input 
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all text-[11px] md:text-xs [color-scheme:dark]"
                    suppressHydrationWarning
                />
            </div>
        </div>
    );
}
