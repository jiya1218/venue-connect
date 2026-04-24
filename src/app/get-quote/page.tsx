"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    ChevronRight, Phone, Search, Calendar, CheckCircle2,
    Lock, ArrowLeft, RefreshCw, Smile, ExternalLink
} from "lucide-react";
import { ReviewCarousel } from "@/components/seo/SEOCollectionViewParts";

// --- EXPANDED DATA ---
const CITIES_DATA: Record<string, string[]> = {
    "Ahmedabad": ["S.G. Highway", "Satellite", "Sindhu Bhavan", "C.G. Road", "Prahlad Nagar", "Vastrapur", "Bodakdev"],
    "Surat": ["Adajan", "Vesu", "Piplod", "Varachha", "Dumas Road", "Katargam", "City Light"],
    "Vadodara": ["Akota", "Alkapuri", "Gotri", "Old Padra Road", "Sayajigunj", "Fatehgunj", "Vasna"],
    "Rajkot": ["Kalawad Road", "Yagnik Road", "Race Course", "University Road", "Amin Marg", "Raiya Road"],
    "Gandhinagar": ["Sector 11", "Sector 21", "Infocity", "Sargasan", "Koba", "Gift City"],
    "Bhavnagar": ["Kalanala", "Waghawadi Road", "Ghogha Circle", "Vidhyanagar"],
};

export default function GetQuotePage() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [citySlug, setCitySlug] = useState("Ahmedabad");
    const [selectedCity, setSelectedCity] = useState("Select City");
    const [formData, setFormData] = useState({
        occasion: "Wedding",
        location: "",
        date: "",
        guests: "",
        budget: "",
        name: "",
        email: "",
        mobile: "",
        otp: "",
        mealType: "Only Veg",
        drinkType: "Soft Drinks",
        services: ""
    });

    const today = new Date().toISOString().split('T')[0];

    // --- DIRECTORY LINKS (From Screenshot 2) ---
    const DIRECTORY_LINKS: Record<string, any> = {
        ahmedabad: [
            ["Banquet Hall in Ahmedabad", "Party Plot in Ahmedabad", "Lawn in Ahmedabad", "Resort in Ahmedabad"],
            ["Weddings in Ahmedabad", "Birthdays in Ahmedabad", "Corporate Event in Ahmedabad", "Social Mixer in Ahmedabad"],
            ["Catering in Ahmedabad", "Decorators in Ahmedabad", "Photography in Ahmedabad", "Mehendi in Ahmedabad"],
            ["Engagement in Ahmedabad", "Reception in Ahmedabad", "Cocktail Party in Ahmedabad", "Anniversary in Ahmedabad"]
        ]
    };
    const CITIES_LIST = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Vapi", "Anand", "Nadiad"];

    const handleNext = async () => {
        // Validation check for next steps
        if (step === 1) {
            if (selectedCity === "Select City" || !formData.date || formData.date < today) {
                alert("Please select a city and a valid future date.");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.name || !formData.mobile) {
                alert("Please fill in your name and mobile number.");
                return;
            }
            setStep(3);
        } else if (step === 3) {
            setStep(4); // OTP Step
        } else if (step === 4) {
            // DATABASE SAVE TRIGGER
            setIsSubmitting(true);
            try {
                const response = await fetch('/api/enquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formData,
                        city: selectedCity
                    })
                });
                
                const result = await response.json();
                if (result.success) {
                    setStep(5); // Success Step
                } else {
                    alert("Error saving inquiry: " + result.error);
                }
            } catch (err) {
                console.error("Submission failed:", err);
                alert("Submission failed. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <main className="min-h-screen bg-white font-sans text-slate-900">
            {/* 1. HERO & MULTI-STEP FORM */}
            <section className="relative min-h-[450px] flex items-center bg-white pt-16 pb-12 border-b border-slate-50">
                <div className="max-w-[1200px] mx-auto px-10 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left side: Content based on step */}
                    <div className="space-y-4">
                        {step <= 4 ? (
                            <div className="space-y-2">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Get Quotes</h1>
                                <p className="text-lg font-black text-primary uppercase tracking-tight leading-tight">
                                    {step === 4 ? "Verify Your Mobile" : "Get best suited venues & vendors for your event"}
                                </p>
                                <p className="text-sm font-bold text-slate-500 leading-relaxed max-w-sm">
                                    {step === 4 ? "Please enter the 4-digit code sent to your phone." : "Compare proposals and quotes from recommended venues. Select and Book the best."}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Smile className="text-green-500" size={48} />
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Thank You!</h1>
                                <p className="text-lg font-bold text-slate-500 leading-relaxed">Your inquiry has been successfully registered with VenueConnect.</p>
                            </div>
                        )}
                    </div>

                    {/* Right side: THE DYNAMIC FORM */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className={`bg-[#fdebea] p-4 rounded-md border border-red-50/50 w-full ${step === 5 ? 'max-w-[800px]' : 'max-w-[420px]'}`}>
                            <div className="bg-white rounded shadow-sm p-6">
                                
                                {/* --- STEP 1: INITIAL DETAILS --- */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Event / Occasion*</label>
                                            <div className="relative">
                                                <select 
                                                    value={formData.occasion}
                                                    onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                                                    className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium appearance-none bg-white focus:outline-none"
                                                >
                                                    <option>Wedding</option>
                                                    <option>Engagement</option>
                                                    <option>Birthday Party</option>
                                                    <option>Corporate Event</option>
                                                    <option>Anniversary</option>
                                                    <option>Social Mixer</option>
                                                    <option>Bachelor Party</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-slate-100"><ChevronRight className="rotate-90 text-slate-300" size={12} /></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">City*</label>
                                            <div className="relative">
                                                <select 
                                                    value={selectedCity}
                                                    onChange={(e) => setSelectedCity(e.target.value)}
                                                    className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium appearance-none bg-white focus:outline-none"
                                                >
                                                    <option>Select City</option>
                                                    {Object.keys(CITIES_DATA).map(c => <option key={c}>{c}</option>)}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-slate-100"><ChevronRight className="rotate-90 text-slate-300" size={12} /></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Preferred Location (s)*</label>
                                            <div className="relative">
                                                <select 
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                    className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium appearance-none bg-[#f1f3f4] focus:outline-none"
                                                >
                                                    <option value="">Your preferred location</option>
                                                    {selectedCity !== "Select City" && CITIES_DATA[selectedCity].map(l => <option key={l}>{l}</option>)}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronRight className="rotate-90 text-black" size={12} /></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Event Date*</label>
                                            <input 
                                                type="date" 
                                                min={today}
                                                value={formData.date}
                                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                                className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium focus:outline-none bg-white uppercase" 
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pt-1">
                                            <input type="checkbox" id="wa" className="w-4 h-4 accent-black rounded" defaultChecked />
                                            <label htmlFor="wa" className="text-[12px] font-black text-slate-900">Send me venue details on WhatsApp</label>
                                        </div>
                                        <button onClick={handleNext} className="w-full h-10 bg-[#ef3125] hover:bg-[#d92c21] text-white font-bold text-sm rounded shadow-lg shadow-red-500/10 transition-all">NEXT STEPS &gt;&gt;</button>
                                        <p className="text-center text-[11px] font-medium text-slate-600">By clicking on this button, you are accepting our <Link href="/terms" className="underline text-[#003d7b]">Terms & Condition</Link></p>
                                    </div>
                                )}

                                {/* --- STEP 2: PERSONAL DETAILS (IMAGE 1) --- */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Expected guests*</label>
                                            <input 
                                                type="text" 
                                                value={formData.guests}
                                                onChange={(e) => setFormData({...formData, guests: e.target.value})}
                                                placeholder="How many guests are you expecting ?" 
                                                className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium focus:outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Per Person Budget*</label>
                                            <div className="relative">
                                                <select 
                                                    value={formData.budget}
                                                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                                    className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium appearance-none bg-white focus:outline-none"
                                                >
                                                    <option value="">Select your per person budget</option>
                                                    <option>Below 500</option><option>500 - 1000</option><option>1000 - 2000</option><option>Above 2000</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-slate-100"><ChevronRight className="rotate-90 text-slate-300" size={12} /></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Your Name*</label>
                                            <input 
                                                type="text" 
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                placeholder="Your name" 
                                                className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium focus:outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Email ID*</label>
                                            <input 
                                                type="email" 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                placeholder="Your email address" 
                                                className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium focus:outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Mobile Number*</label>
                                            <div className="flex gap-2">
                                                <div className="relative w-24 shrink-0">
                                                    <select className="w-full h-10 border border-slate-200 rounded px-2 text-[13px] font-black appearance-none bg-[#f1f3f4] focus:outline-none">
                                                        <option>🇮🇳 +91</option>
                                                    </select>
                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronRight className="rotate-90 text-slate-600" size={10} /></div>
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={formData.mobile}
                                                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                                    placeholder="Your mobile number" 
                                                    className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium focus:outline-none" 
                                                />
                                            </div>
                                        </div>
                                        <button onClick={handleNext} className="w-full h-10 bg-[#ef3125] hover:bg-[#d92c21] text-white font-bold text-sm rounded shadow-lg shadow-red-500/10 transition-all uppercase">NEXT STEPS &gt;&gt;</button>
                                        <button onClick={() => setStep(1)} className="w-full text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-primary transition-colors"><ArrowLeft size={12}/> Edit Details</button>
                                    </div>
                                )}

                                {/* --- STEP 3: PREFERENCES (IMAGE 2) --- */}
                                {step === 3 && (
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Meal Type</label>
                                            <select 
                                                value={formData.mealType}
                                                onChange={(e) => setFormData({...formData, mealType: e.target.value})}
                                                className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium focus:outline-none bg-white"
                                            >
                                                <option>Only Veg</option><option>Both Veg & Non-Veg</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Drink Type</label>
                                            <select 
                                                value={formData.drinkType}
                                                onChange={(e) => setFormData({...formData, drinkType: e.target.value})}
                                                className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium focus:outline-none bg-white"
                                            >
                                                <option>Soft Drinks</option><option>Alcoholic Beverages</option><option>Both</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-black text-slate-900">Other Services</label>
                                            <div className="relative">
                                                <select 
                                                    value={formData.services || ""}
                                                    onChange={(e) => setFormData({...formData, services: e.target.value})}
                                                    className="w-full h-10 border border-slate-200 rounded px-3 text-[13px] font-medium appearance-none bg-[#f1f3f4] focus:outline-none"
                                                >
                                                    <option value="">Select services</option>
                                                    <option>Decoration</option>
                                                    <option>Catering</option>
                                                    <option>Photography</option>
                                                    <option>DJ / Sound</option>
                                                    <option>Makeup Artist</option>
                                                    <option>Choreographer</option>
                                                    <option>Gift / Favors</option>
                                                    <option>Invitations</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronRight className="rotate-90 text-black" size={14} /></div>
                                            </div>
                                        </div>
                                        <button onClick={handleNext} className="w-full h-10 bg-[#ef3125] hover:bg-[#d92c21] text-white font-bold text-sm rounded shadow-lg shadow-red-500/10 transition-all uppercase">NEXT STEPS &gt;&gt;</button>
                                        <button onClick={() => setStep(2)} className="w-full text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-primary transition-colors"><ArrowLeft size={12}/> Previous Step</button>
                                    </div>
                                )}

                                {/* --- STEP 4: OTP VERIFICATION --- */}
                                {step === 4 && (
                                    <div className="space-y-6">
                                        <div className="flex justify-center"><Lock className="text-primary" size={32} /></div>
                                        <div className="space-y-2 text-center">
                                            <p className="text-[13px] font-bold text-slate-600">Verification code sent to <span className="text-slate-900 font-black">+91 {formData.mobile}</span></p>
                                            <div className="flex justify-center gap-3">
                                                {[1,2,3,4].map(i => (
                                                    <input 
                                                        key={i} 
                                                        type="text" 
                                                        placeholder="-"
                                                        maxLength={1} 
                                                        className="w-12 h-12 border-2 border-slate-100 rounded-xl text-center text-xl font-black focus:border-primary focus:outline-none transition-all" 
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-2 font-bold uppercase italic">Hint: For testing, enter any 4 digits to verify.</p>
                                        </div>
                                        <button 
                                            disabled={isSubmitting}
                                            onClick={handleNext} 
                                            className="w-full h-12 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all uppercase"
                                        >
                                            {isSubmitting ? "Verifying & Saving..." : "Verify & Submit"}
                                        </button>
                                        <button className="w-full text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-primary transition-colors"><RefreshCw size={12}/> Resend Code</button>
                                    </div>
                                )}

                                {/* --- STEP 5: SUCCESS (IMAGE 3) --- */}
                                {step === 5 && (
                                    <div className="py-8 space-y-8 text-center animate-in zoom-in duration-500">
                                        <div className="flex justify-center"><img src="https://api.iconify.design/noto:smiling-face-with-smiling-eyes.svg" className="w-[120px] h-[120px]" alt="Smile" /></div>
                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-black text-[#1e8a00] uppercase tracking-tighter">CONGRATULATIONS !!</h2>
                                            <p className="text-[15px] font-bold text-slate-600 leading-relaxed max-w-lg mx-auto">
                                                Your inquiry has been saved, our customer support team is working on your requirements and shall come back to you in next few hours with the best-suited options. 
                                                <span className="inline-block animate-bounce ml-1">😊</span>
                                            </p>
                                        </div>
                                        <Link href="/venues" className="inline-flex h-12 bg-[#ef4444] hover:bg-[#dc2626] text-white px-10 items-center justify-center font-bold text-[15px] rounded-md transition-all shadow-xl shadow-red-500/20">
                                            Explore More Venues
                                        </Link>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CUSTOMER REVIEWS (Hidden on success to keep focus) */}
            {step < 5 && (
                <>
                    <section className="bg-white py-16 pt-0">
                        <div className="max-w-[1500px] mx-auto px-10 md:px-20 text-center">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 tracking-tight uppercase">What our clients have to say..</h2>
                            <ReviewCarousel />
                        </div>
                    </section>

                    <section className="bg-white py-24 border-t border-slate-50">
                        <div className="max-w-[1500px] mx-auto px-10 md:px-20 text-center space-y-16">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tight">Why Choose VenueConnect?</h2>
                                <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 text-left">
                                <div className="space-y-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                                    <h4 className="font-black text-xl text-primary uppercase">Expert Led</h4>
                                    <p className="text-slate-500 font-bold text-lg leading-relaxed">Our event experts personally curate recommendations based on your unique needs and budget.</p>
                                </div>
                                <div className="space-y-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                                    <h4 className="font-black text-xl text-primary uppercase">100% Free</h4>
                                    <p className="text-slate-500 font-bold text-lg leading-relaxed">There are no hidden charges. Our team works for you to find the best deals at zero cost.</p>
                                </div>
                                <div className="space-y-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                                    <h4 className="font-black text-xl text-primary uppercase">Best Prices</h4>
                                    <p className="text-slate-500 font-bold text-lg leading-relaxed">We leverage our network to unlock exclusive discounts and quotes you won't find anywhere else.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white py-24 pb-32 border-t border-slate-100">
                        <div className="max-w-[1300px] mx-auto px-10">
                            <div className="flex items-center justify-between border-b border-slate-100 mb-10 overflow-x-auto scrollbar-hide">
                                {CITIES_LIST.map((city) => (
                                    <button 
                                        key={city}
                                        className={`text-[15px] font-black transition-all whitespace-nowrap pb-4 relative ${city === "Ahmedabad" ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary' : 'text-black hover:opacity-70'}`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-2">
                                {DIRECTORY_LINKS["ahmedabad"].map((col: string[], colIdx: number) => (
                                    <div key={colIdx} className="space-y-1">
                                        {col.map((item: string) => (
                                            <Link key={item} href={`/ahmedabad`} className="block text-[14px] font-bold text-slate-500 hover:text-[#003d7b] transition-all leading-relaxed whitespace-nowrap">{item}</Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}
