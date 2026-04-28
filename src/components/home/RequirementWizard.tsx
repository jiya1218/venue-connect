"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronRight, ChevronLeft, MapPin, Calendar, Users, 
    IndianRupee, Utensils, Building2, CheckCircle2, 
    Sparkles, Phone, Mail, User, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const STEPS = [
    { id: 'occasion', title: 'Select Occasion', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'city', title: 'Select City', icon: <MapPin className="w-5 h-5" /> },
    { id: 'area', title: 'Select Area', icon: <MapPin className="w-5 h-5" /> },
    { id: 'space', title: 'Space Type', icon: <Building2 className="w-5 h-5" /> },
    { id: 'food', title: 'Food Type', icon: <Utensils className="w-5 h-5" /> },
    { id: 'budget', title: 'Per Person Budget', icon: <IndianRupee className="w-5 h-5" /> },
    { id: 'guests', title: 'Expected Guests', icon: <Users className="w-5 h-5" /> },
    { id: 'date', title: 'Event Date', icon: <Calendar className="w-5 h-5" /> },
    { id: 'contact', title: 'Contact Details', icon: <User className="w-5 h-5" /> },
    { id: 'otp', title: 'Verify OTP', icon: <ShieldCheck className="w-5 h-5" /> }
];

const OCCASIONS = ['Wedding', 'Engagement', 'Birthday', 'Corporate', 'Anniversary', 'Social Party'];
const CITIES = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'];
const AREAS: Record<string, string[]> = {
    'Ahmedabad': ['Prahlad Nagar', 'Sindhu Bhavan', 'Satellite', 'Bodakdev', 'SG Highway', 'C G Road'],
    'Surat': ['Adajan', 'Vesu', 'Piplod', 'Varachha', 'Dumas'],
    'Vadodara': ['Alkapuri', 'Gotri', 'Akota', 'Sayajigunj'],
    'Rajkot': ['Kalavad Road', 'Yagnik Road', 'University Road'],
    'Gandhinagar': ['Sector 21', 'Kudasan', 'Sargasan', 'Raysan']
};
const SPACE_TYPES = ['Banquet Hall', 'Party Plot', 'Lawn', 'Resort', 'Hotel', 'Rooftop'];
const FOOD_TYPES = ['Only Veg', 'Veg + Non-Veg', 'Pure Veg (Jain)'];
const BUDGETS = ['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹1500', '₹1500 - ₹2000', 'Above ₹2000'];

export default function RequirementWizard() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [otpValue, setOtpValue] = useState("");
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

    const nextStep = () => {
        if (step < STEPS.length - 1) setStep(s => s + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep(s => s - 1);
    };

    const isNextDisabled = () => {
        switch(step) {
            case 0: return !formData.occasion;
            case 1: return !formData.city;
            case 2: return !formData.area;
            case 3: return !formData.space_type;
            case 4: return !formData.food_type;
            case 5: return !formData.budget_per_person;
            case 6: return !formData.expected_guests;
            case 7: return !formData.event_date;
            case 8: return !formData.customer_name || !formData.customer_email || !formData.customer_phone;
            default: return false;
        }
    };

    const handleFinalSubmit = async () => {
        if (otpValue !== "123456") {
            toast.error("Invalid OTP. Use 123456 for testing.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('user_requirements').insert([
                {
                    ...formData,
                    expected_guests: parseInt(formData.expected_guests) || 0
                }
            ]);

            if (error) throw error;

            toast.success("Verified & Submitted!");
            setStep(STEPS.length);
        } catch (error: any) {
            toast.error("Error saving requirement");
        } finally {
            setLoading(false);
        }
    };

    if (step === STEPS.length) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] p-12 text-center text-white shadow-2xl"
            >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black mb-4">Request Sent!</h2>
                <p className="text-white/60 text-lg mb-10 max-w-sm mx-auto font-medium">Our event concierge will contact you shortly with curated quotes for your {formData.occasion}.</p>
                <Button onClick={() => window.location.reload()} className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs">
                    Start New Request
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Step Indicators */}
            <div className="flex gap-1.5 mb-10 px-4">
                {STEPS.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1 flex-1 rounded-full transition-all duration-700 ${i <= step ? 'bg-primary shadow-[0_0_10px_rgba(239,62,54,0.5)]' : 'bg-white/10'}`} 
                    />
                ))}
            </div>

            <motion.div 
                key={step}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
            >
                {/* Step Header */}
                <div className="flex items-center gap-3 mb-6 md:mb-6">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/40 transform -rotate-3 hover:rotate-0 transition-transform">
                        {STEPS[step].icon}
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[3px] text-white/40 mb-0.5">Wizard</p>
                        <h2 className="text-lg md:text-xl font-black text-white tracking-tight">{STEPS[step].title}</h2>
                    </div>
                </div>

                {/* Step Content */}
                <div className="min-h-[220px] md:min-h-[250px]">
                    {step === 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {OCCASIONS.map(o => (
                                <button
                                    key={o}
                                    onClick={() => { updateData({ occasion: o }); nextStep(); }}
                                    className={`p-5 rounded-2xl border-2 transition-all text-center font-bold text-sm ${formData.occasion === o ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'}`}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {CITIES.map(c => (
                                <button
                                    key={c}
                                    onClick={() => { updateData({ city: c }); nextStep(); }}
                                    className={`p-5 rounded-2xl border-2 transition-all text-center font-bold text-sm ${formData.city === c ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {AREAS[formData.city]?.map(a => (
                                <button
                                    key={a}
                                    onClick={() => { updateData({ area: a }); nextStep(); }}
                                    className={`p-4 rounded-2xl border-2 transition-all text-left font-bold text-xs ${formData.area === a ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'}`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {SPACE_TYPES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => { updateData({ space_type: s }); nextStep(); }}
                                    className={`p-5 rounded-2xl border-2 transition-all font-bold text-xs ${formData.space_type === s ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            {FOOD_TYPES.map(f => (
                                <button
                                    key={f}
                                    onClick={() => { updateData({ food_type: f }); nextStep(); }}
                                    className={`w-full p-6 rounded-2xl border-2 transition-all font-bold text-sm text-left flex items-center justify-between ${formData.food_type === f ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                                >
                                    {f}
                                    {formData.food_type === f && <CheckCircle2 className="w-5 h-5" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 5 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {BUDGETS.map(b => (
                                <button
                                    key={b}
                                    onClick={() => { updateData({ budget_per_person: b }); nextStep(); }}
                                    className={`p-6 rounded-2xl border-2 transition-all font-bold text-sm text-center ${formData.budget_per_person === b ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 6 && (
                        <div className="flex flex-col items-center justify-center h-full pt-10">
                            <input 
                                type="number" 
                                autoFocus
                                placeholder="e.g. 500"
                                value={formData.expected_guests}
                                onChange={e => updateData({ expected_guests: e.target.value })}
                                className="w-full bg-transparent text-center text-6xl font-black text-white placeholder:text-white/10 outline-none mb-4"
                            />
                            <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Total Guests Expected</p>
                        </div>
                    )}

                    {step === 7 && (
                        <div className="flex flex-col items-center justify-center h-full pt-10">
                            <input 
                                type="date" 
                                autoFocus
                                value={formData.event_date}
                                onChange={e => updateData({ event_date: e.target.value })}
                                className="w-full bg-transparent text-center text-5xl font-black text-white outline-none mb-4 [color-scheme:dark]"
                            />
                            <p className="text-white/30 font-bold uppercase tracking-widest text-xs">Preferred Event Date</p>
                        </div>
                    )}

                    {step === 8 && (
                        <div className="space-y-4 pt-4">
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Full Name"
                                    value={formData.customer_name}
                                    onChange={e => updateData({ customer_name: e.target.value })}
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-white font-bold outline-none focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all" 
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="email" 
                                    placeholder="Email Address"
                                    value={formData.customer_email}
                                    onChange={e => updateData({ customer_email: e.target.value })}
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-white font-bold outline-none focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all" 
                                />
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="tel" 
                                    placeholder="Contact Number"
                                    value={formData.customer_phone}
                                    onChange={e => updateData({ customer_phone: e.target.value })}
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-white font-bold outline-none focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all" 
                                />
                            </div>
                        </div>
                    )}

                    {step === 9 && (
                        <div className="flex flex-col items-center justify-center pt-6">
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-8 border border-primary/30">
                                <ShieldCheck className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3">One Last Step</h3>
                            <p className="text-white/50 font-medium mb-10 text-center">Enter the code sent to your phone <br/><span className="text-white font-bold">{formData.customer_phone}</span></p>
                            
                            <InputOTP
                                maxLength={6}
                                value={otpValue}
                                onChange={setOtpValue}
                            >
                                <InputOTPGroup className="gap-3">
                                    {[0,1,2,3,4,5].map(i => (
                                        <InputOTPSlot 
                                            key={i}
                                            index={i}
                                            className="w-12 h-16 md:w-14 md:h-20 bg-white/5 border-white/10 text-white font-black text-2xl rounded-2xl focus:ring-2 focus:ring-primary"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
                    {step > 0 ? (
                        <button onClick={prevStep} className="flex items-center gap-3 text-white/30 hover:text-white font-bold text-sm transition-all group uppercase tracking-widest">
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                        </button>
                    ) : <div />}
                    
                    {step === STEPS.length - 1 ? (
                        <Button 
                            onClick={handleFinalSubmit}
                            disabled={loading || otpValue.length < 6}
                            className="bg-primary hover:bg-primary/90 text-white h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 transform active:scale-95 transition-all"
                        >
                            {loading ? "Verifying..." : "Verify & Submit"}
                        </Button>
                    ) : (
                        <Button 
                            onClick={nextStep}
                            disabled={isNextDisabled()}
                            className="bg-white text-slate-900 hover:bg-slate-100 h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-white/10 transform active:scale-95 transition-all disabled:opacity-30"
                        >
                            Continue <ChevronRight className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
