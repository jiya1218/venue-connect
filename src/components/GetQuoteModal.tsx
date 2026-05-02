"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Users, IndianRupee, Utensils, Sparkles, Phone, Mail, User, CheckCircle2, ShieldCheck, Clock, ChevronDown, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface GetQuoteModalProps {
    businessName: string;
    listingId: string;
    listingType: 'venue' | 'vendor';
    ownerId?: string | null;
    triggerButton?: React.ReactNode;
    citySlug?: string;
    imageUrl?: string;
    location?: string;
}

const OCCASIONS = [
    'Wedding', 'Birthday Party', 'Engagement', 'Corporate Event', 'Reception',
    'Sangeet Ceremony', 'Haldi Ceremony', 'Mehendi Ceremony', 'Anniversary Party',
    'Baby Shower', 'Bridal Shower', 'Bachelor Party', 'Kitty Party', 'Get Together',
    'Family Function', 'Naming Ceremony', 'Cocktail Party', 'Pool Party',
    'Garba Night', 'Conference', 'Seminar', 'Product Launch', 'Team Outing',
];

const BUDGETS = [
    'Below ₹50,000', '₹50k – ₹1 Lakh', '₹1 Lakh – ₹2 Lakh',
    '₹2 Lakh – ₹5 Lakh', '₹5 Lakh – ₹10 Lakh', 'Above ₹10 Lakh',
];

const FOOD_TYPES = ['Veg Only', 'Non-Veg Only', 'Both (Veg & Non-Veg)', 'Pure Veg (Jain)'];

const GetQuoteModal = ({ businessName, listingId, listingType, ownerId, triggerButton, citySlug, imageUrl, location }: GetQuoteModalProps) => {
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [minDate, setMinDate] = useState('');
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        occasion: '',
        date: '',
        guests: '',
        budget: '',
        foodType: '',
        name: '',
        phone: '',
        email: '',
    });

    useEffect(() => {
        setMounted(true);
        // Calculate tomorrow's date for 'min' attribute
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        setMinDate(`${yyyy}-${mm}-${dd}`);
    }, []);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollBarWidth > 0) {
                document.body.style.paddingRight = `${scrollBarWidth}px`;
            }
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => { 
            document.body.style.overflow = ''; 
            document.body.style.paddingRight = '';
        };
    }, [open]);

    const update = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        // Prevent event bubbling and default form behavior
        e.preventDefault();
        e.stopPropagation();
        
        if (loading) return;

        // Strict validation
        if (!formData.name || !formData.phone || !formData.occasion || !formData.date) {
            toast.error("Please fill all required fields (*)");
            return;
        }

        // Phone validation
        if (formData.phone.length < 10) {
            toast.error("Please enter a valid 10-digit mobile number");
            return;
        }

        // Date validation: No today, no past
        const selectedDate = new Date(formData.date);
        selectedDate.setHours(0, 0, 0, 0);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        if (selectedDate < tomorrow) {
            toast.error("Event date must be tomorrow or later");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Sending your enquiry...");

        try {
            const { error } = await supabase.from('leads').insert([{
                listing_id: listingId,
                listing_type: listingType,
                owner_id: ownerId || null,
                customer_name: formData.name,
                customer_email: `PENDING_ADMIN_${formData.email || 'no-email@venueconnect.com'}`,
                customer_phone: formData.phone,
                event_date: formData.date || null,
                message: [
                    formData.occasion && `Occasion: ${formData.occasion}`,
                    formData.guests && `Guests: ${formData.guests}`,
                    formData.budget && `Budget: ${formData.budget}`,
                    formData.foodType && `Food: ${formData.foodType}`,
                ].filter(Boolean).join(' | ') || 'Quote request',
                status: 'new',
            }]);
            
            if (error) throw error;
            
            toast.success("Enquiry sent successfully!", { id: toastId });
            setSubmitted(true);
        } catch (err: any) {
            toast.error("Submission failed. Please check your connection.", { id: toastId });
            console.error("Submission error:", err);
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setOpen(false);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ occasion: '', date: '', guests: '', budget: '', foodType: '', name: '', phone: '', email: '' });
        }, 300);
    };

    if (!mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
            onMouseDown={(e) => { 
                if (e.target === e.currentTarget) resetAndClose(); 
            }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" />

            {/* Modal Container - Premium Compact Layout */}
            <div 
                className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 flex flex-col md:flex-row min-h-[400px] md:min-h-[500px] max-h-[95vh]"
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* LEFT COLUMN: Image & Trust (30% width) */}
                <div className="hidden md:flex md:w-[30%] bg-slate-950 relative overflow-hidden flex-col border-r border-slate-800 shrink-0">
                    <div className="h-40 lg:h-48 relative overflow-hidden shrink-0 bg-slate-900">
                        <img 
                            src={imageUrl || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"} 
                            className="w-full h-full object-cover" 
                            alt={businessName} 
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Sparkles size={12} className="text-white" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[2px] text-white drop-shadow-md">VenueConnect</span>
                        </div>
                    </div>

                    <div className="relative z-10 p-6 flex flex-col flex-grow">
                        <div className="mb-6">
                            <h2 className="text-xl font-black text-white leading-tight mb-2">Get best quote from <span className="text-primary">{businessName}</span></h2>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest truncate">{location || citySlug || "Best location"}</p>
                        </div>

                        <div className="space-y-3 mt-auto">
                            <div className="h-px bg-white/10 w-full" />
                            <h3 className="text-[8px] font-black text-white/50 uppercase tracking-[3px]">Benefits</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { icon: <Clock size={12} />, text: "Fast Response" },
                                    { icon: <IndianRupee size={12} />, text: "Best Rates" },
                                    { icon: <ShieldCheck size={12} />, text: "100% Verified" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-white/70">
                                        <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                                            {item.icon}
                                        </div>
                                        <span className="text-[10px] font-bold tracking-wide">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Form */}
                <div className="flex-1 bg-white relative p-6 md:p-8 flex flex-col overflow-y-auto">
                    <button
                        type="button"
                        onClick={resetAndClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors z-20"
                    >
                        <X size={16} />
                    </button>

                    <div className="relative flex-grow flex flex-col">
                        {submitted ? (
                            <div className="my-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-7 h-7 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">Enquiry Sent!</h3>
                                <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                                    Our manager will contact you soon for <strong>{businessName}</strong>.
                                </p>
                                <Button
                                    onClick={resetAndClose}
                                    className="w-full max-w-[140px] h-9 bg-primary hover:bg-primary/90 text-white font-black rounded-lg uppercase tracking-widest text-[9px]"
                                >
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h3 className="text-xl font-black text-slate-900 mb-1">Event Enquiry</h3>
                                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Submit details to get direct manager quotes</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field label="Occasion *" icon={<Sparkles size={12} />}>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={formData.occasion}
                                                    onChange={e => update('occasion', e.target.value)}
                                                    className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-xs font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                                                >
                                                    <option value="">Select occasion</option>
                                                    {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                        </Field>

                                        <Field label="Event Date *" icon={<Calendar size={12} />}>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    required
                                                    min={minDate}
                                                    value={formData.date}
                                                    onChange={e => update('date', e.target.value)}
                                                    className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all [color-scheme:light] cursor-pointer"
                                                />
                                            </div>
                                        </Field>

                                        <Field label="No. of Guests" icon={<Users size={12} />}>
                                            <input
                                                type="number"
                                                placeholder="e.g. 200"
                                                value={formData.guests}
                                                onChange={e => update('guests', e.target.value)}
                                                className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </Field>

                                        <Field label="Budget Range" icon={<IndianRupee size={12} />}>
                                            <div className="relative">
                                                <select
                                                    value={formData.budget}
                                                    onChange={e => update('budget', e.target.value)}
                                                    className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-xs font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                                                >
                                                    <option value="">Select Budget</option>
                                                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                        </Field>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field label="Food Type" icon={<Utensils size={12} />}>
                                            <div className="relative">
                                                <select
                                                    value={formData.foodType}
                                                    onChange={e => update('foodType', e.target.value)}
                                                    className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-xs font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                                                >
                                                    <option value="">Select Food Preference</option>
                                                    {FOOD_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                        </Field>

                                        <Field label="Mobile Number *" icon={<Phone size={12} />}>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    required
                                                    pattern="[0-9]{10}"
                                                    maxLength={10}
                                                    placeholder="10 digit mobile"
                                                    value={formData.phone}
                                                    onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                    className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-10 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px] tracking-tight">+91</span>
                                            </div>
                                        </Field>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field label="Full Name *" icon={<User size={12} />}>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter your name"
                                                value={formData.name}
                                                onChange={e => update('name', e.target.value)}
                                                className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </Field>

                                        <Field label="Email ID" icon={<Mail size={12} />}>
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={e => update('email', e.target.value)}
                                                className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </Field>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black rounded-xl uppercase tracking-[1px] text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                'Get Free Quotes Now'
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center gap-3 text-slate-200">
                                        <div className="flex items-center gap-1">
                                            <ShieldCheck size={9} />
                                            <span className="text-[7px] font-bold uppercase tracking-widest">100% Secure</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={9} />
                                            <span className="text-[7px] font-bold uppercase tracking-widest">Direct Manager</span>
                                        </div>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Trigger Container */}
            <div 
                className="w-full h-full"
                onClick={(e) => { 
                    e.stopPropagation(); 
                    e.preventDefault(); 
                    setOpen(true); 
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
            >
                {triggerButton || (
                    <button className="w-full flex-1 bg-[#EF3E36] text-white h-8 md:h-11 rounded-lg md:rounded-xl font-black text-[9px] md:text-[12px] uppercase tracking-wide md:tracking-widest hover:bg-[#D9362F] transition-all transform active:scale-95 shadow-md shadow-primary/20">
                        Get Quote
                    </button>
                )}
            </div>

            {/* Modal Portal */}
            {open && createPortal(modalContent, document.body)}
        </>
    );
};

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[1px] text-slate-400 pl-1">
                <span className="text-primary/50">{icon}</span>
                {label}
            </label>
            {children}
        </div>
    );
}

export default GetQuoteModal;
