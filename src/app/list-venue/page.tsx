"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { citiesData } from "@/lib/citiesData";
import DistrictCitySelect from "@/components/DistrictCitySelect";
import PricingPackages from "@/components/PricingPackages";
import { Check, Loader2, ArrowLeft, Building2, MapPin, Users, IndianRupee, Info, Clock, Utensils, ShieldCheck, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MultiImageUpload from "@/components/MultiImageUpload";

export default function ListVenuePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        // Step 1: Basic info
        contactName: "",
        mobile: "",
        
        // Step 3: Detailed info
        businessName: "",
        city: "",
        address: "",
        venueType: "Banquet Hall",
        minCapacity: "",
        maxCapacity: "",
        roomsCount: "",
        vegPrice: "",
        nonVegPrice: "",
        description: "",
        hasAc: false,
        hasWifi: false,
        alcoholServed: false,
        cateringPolicy: "Internal & External",
        advancePayment: "25",
        operatingHours: "09:00 AM - 11:00 PM",
        amenities: [] as string[],
        cuisines: [] as string[],
        images: [] as string[]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity) 
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleCuisineToggle = (cuisine: string) => {
        setFormData(prev => ({
            ...prev,
            cuisines: prev.cuisines.includes(cuisine) 
                ? prev.cuisines.filter(c => c !== cuisine)
                : [...prev.cuisines, cuisine]
        }));
    };

    const handleStep1Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handleFinalSubmit = async (pkg: string) => {
        setIsSubmitting(true);
        const finalData = { ...formData, selectedPackage: pkg };

        try {
            // 1. Send data to Webhook (Google Sheets + Email)
            const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
            if (webhookUrl) {
                try {
                    await fetch(webhookUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'Comprehensive Venue Application',
                            ...finalData
                        })
                    });
                } catch (webhookErr) {
                    console.error("Webhook failed:", webhookErr);
                }
            }

            // 2. Insert to Supabase venue_applications
            const { error: supabaseErr } = await supabase.from('venue_applications').insert([{
                business_name: formData.businessName,
                contact_person: formData.contactName,
                business_phone: formData.mobile,
                address: formData.address,
                city: formData.city,
                venue_type: formData.venueType,
                min_capacity: parseInt(formData.minCapacity) || 0,
                max_capacity: parseInt(formData.maxCapacity) || 0,
                rooms_count: parseInt(formData.roomsCount) || 0,
                veg_price_per_plate: parseInt(formData.vegPrice) || 0,
                nonveg_price_per_plate: parseInt(formData.nonVegPrice) || 0,
                description: formData.description + `\n\nSelected Package: ${pkg}`,
                has_ac: formData.hasAc,
                has_wifi: formData.hasWifi,
                alcohol_served: formData.alcoholServed,
                catering_policy: formData.cateringPolicy,
                advance_payment_percentage: parseInt(formData.advancePayment) || 0,
                operating_hours: formData.operatingHours,
                amenities: formData.amenities,
                cuisines: formData.cuisines,
                images: formData.images,
                status: 'pending'
            }]);

            if (supabaseErr) throw supabaseErr;

            setIsSubmitted(true);
            toast.success("Application submitted successfully!");
            
            setTimeout(() => {
                router.push('/');
            }, 5000);

        } catch (err: any) {
            toast.error("Submission failed: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white transition-all placeholder:text-gray-400";
    const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <main className="flex-grow py-12 px-4 flex justify-center items-start pt-20">
                {isSubmitted ? (
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Received!</h2>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto">
                            Thank you for listing your venue with us. Our team will verify your details and get back to you within 24-48 hours.
                        </p>
                        <Button onClick={() => router.push('/')} className="bg-slate-900 hover:bg-slate-800 text-white px-8 h-12 rounded-lg">
                            Back to Home
                        </Button>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl">
                        {/* Progress Stepper */}
                        <div className="mb-10 flex justify-center">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        step === s ? "bg-red-600 text-white shadow-lg shadow-red-200 scale-110" : 
                                        step > s ? "bg-green-500 text-white" : "bg-white text-slate-300 border-2 border-slate-200"
                                    }`}>
                                        {step > s ? <Check className="w-5 h-5" /> : s}
                                    </div>
                                    {s < 3 && <div className={`w-12 h-0.5 mx-2 rounded-full transition-all duration-300 ${step > s ? "bg-green-500" : "bg-slate-200"}`}></div>}
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            
                            {/* Step 1: Basic Contact */}
                            {step === 1 && (
                                <div className="p-8 md:p-12 animate-in slide-in-from-right duration-300">
                                    <div className="text-center mb-10">
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 uppercase tracking-tight">Add Contact Information</h2>
                                        <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
                                        <p className="text-slate-500 mt-4 text-sm font-medium">Business notifications and leads will be sent to this contact.</p>
                                    </div>

                                    <form onSubmit={handleStep1Submit} className="space-y-6 max-w-xl mx-auto">
                                        <div className="space-y-4">
                                            <div>
                                                <label className={labelCls}>Contact Person Name *</label>
                                                <input 
                                                    type="text" 
                                                    name="contactName" 
                                                    value={formData.contactName} 
                                                    onChange={handleChange} 
                                                    placeholder="e.g. Rahul Sharma" 
                                                    className={inputCls} 
                                                    required 
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className={labelCls}>Mobile Number *</label>
                                                <div className="flex bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 overflow-hidden transition-all">
                                                    <div className="flex items-center px-4 bg-slate-50 border-r border-gray-200 text-slate-500 text-sm font-bold">
                                                        +91
                                                    </div>
                                                    <input 
                                                        type="tel" 
                                                        name="mobile" 
                                                        value={formData.mobile} 
                                                        onChange={handleChange} 
                                                        placeholder="Enter 10 digit mobile number" 
                                                        className="w-full px-4 py-3 text-slate-700 focus:outline-none placeholder:text-gray-400 bg-transparent" 
                                                        required 
                                                        pattern="[0-9]{10}"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <Button 
                                                type="submit" 
                                                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                Continue to Business Details
                                            </Button>
                                            <p className="text-[10px] text-center text-slate-400 mt-4 px-4">
                                                By proceeding, you agree to VenueConnect's Terms & Privacy Policy and consent to receive updates.
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Step 2: Detailed Business Info */}
                            {step === 2 && (
                                <div className="p-8 md:p-12 animate-in slide-in-from-bottom duration-500">
                                    <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Business Details</h2>
                                            <p className="text-slate-500 text-sm mt-1">Provide comprehensive information to attract more clients.</p>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
                                            <ShieldCheck className="w-4 h-4" /> Verified Lead
                                        </div>
                                    </div>

                                    <form onSubmit={handleDetailsSubmit} className="space-y-10">
                                        
                                        {/* Basic Info Section */}
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800"><Building2 className="w-5 h-5 text-red-600"/> General Information</h3>
                                                
                                                <div>
                                                    <label className={labelCls}>Venue / Business Name *</label>
                                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="e.g. Royal Grand Palace" className={inputCls} required />
                                                </div>

                                                <div>
                                                    <label className={labelCls}>Venue Type *</label>
                                                    <select name="venueType" value={formData.venueType} onChange={handleChange} className={inputCls} required>
                                                        <option value="Banquet Hall">Banquet Hall</option>
                                                        <option value="Hotel">Hotel</option>
                                                        <option value="Marriage Garden">Marriage Garden</option>
                                                        <option value="Resort">Resort</option>
                                                        <option value="Farmhouse">Farmhouse</option>
                                                        <option value="Convention Center">Convention Center</option>
                                                        <option value="Rooftop">Rooftop</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className={labelCls}>District & City *</label>
                                                    <DistrictCitySelect 
                                                        onSelect={(val) => setFormData({ ...formData, city: val })}
                                                        initialValue={formData.city}
                                                    />
                                                    <input type="hidden" name="city" value={formData.city} required />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800"><MapPin className="w-5 h-5 text-red-600"/> Location Details</h3>
                                                
                                                <div>
                                                    <label className={labelCls}>Full Address *</label>
                                                    <textarea 
                                                        name="address" 
                                                        value={formData.address} 
                                                        onChange={handleChange} 
                                                        placeholder="Building No, Street name, Near Landmark, Pincode" 
                                                        className={`${inputCls} h-[135px] resize-none`} 
                                                        required 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="border-slate-100" />

                                        {/* Capacity & Pricing */}
                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800"><Users className="w-5 h-5 text-red-600"/> Guest Capacity</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={labelCls}>Min Guest *</label>
                                                        <input type="number" name="minCapacity" value={formData.minCapacity} onChange={handleChange} placeholder="e.g. 100" className={inputCls} required />
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>Max Guest *</label>
                                                        <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} placeholder="e.g. 1500" className={inputCls} required />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Room Count (If any)</label>
                                                    <input type="number" name="roomsCount" value={formData.roomsCount} onChange={handleChange} placeholder="Total rooms for stay" className={inputCls} />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800"><IndianRupee className="w-5 h-5 text-red-600"/> Plate Pricing</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={labelCls}>Veg. Plate Price *</label>
                                                        <input type="number" name="vegPrice" value={formData.vegPrice} onChange={handleChange} placeholder="₹ Per Plate" className={`${inputCls} text-green-700 font-bold`} required />
                                                    </div>
                                                    <div>
                                                        <label className={labelCls}>Non-Veg. Plate Price</label>
                                                        <input type="number" name="nonVegPrice" value={formData.nonVegPrice} onChange={handleChange} placeholder="₹ Per Plate" className={`${inputCls} text-red-700 font-bold`} />
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2 rounded border border-dashed">
                                                    * Base prices used for initial search comparisons.
                                                </p>
                                            </div>
                                        </div>

                                        <hr className="border-slate-100" />

                                        {/* Amenities & Features */}
                                        <div className="space-y-8">
                                            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800"><Info className="w-5 h-5 text-red-600"/> Amenities & Facilities</h3>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {["Air Conditioned", "Free WiFi", "Parking Space", "Alcohol Served", "Valet Parking", "Power Backup", "Changing Rooms", "Lift", "Live Music", "Dj Space", "Decoration Provided", "Security"].map((item) => (
                                                    <label key={item} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                                        formData.amenities.includes(item) ? "bg-red-50 border-red-500 text-red-700 font-semibold" : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                                                    }`}>
                                                        <input 
                                                            type="checkbox" 
                                                            className="hidden" 
                                                            checked={formData.amenities.includes(item)}
                                                            onChange={() => handleAmenityToggle(item)}
                                                        />
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${formData.amenities.includes(item) ? "bg-red-600 border-red-600" : "bg-white border-slate-300"}`}>
                                                            {formData.amenities.includes(item) && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                                                        </div>
                                                        <span className="text-sm">{item}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Cuisines */}
                                        <div className="space-y-6">
                                            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800"><Utensils className="w-5 h-5 text-red-600"/> Cuisines Available</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {["Gujarati", "North Indian", "South Indian", "Chinese", "Italian", "Mughlai", "Continental", "Mexican", "Street Food"].map((c) => (
                                                    <button 
                                                        key={c}
                                                        type="button"
                                                        onClick={() => handleCuisineToggle(c)}
                                                        className={`px-5 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                                                            formData.cuisines.includes(c) ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-200" : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                                                        }`}
                                                    >
                                                        {c}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Policies */}
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800"><Clock className="w-5 h-5 text-red-600"/> Operating Policies</h3>
                                                
                                                <div>
                                                    <label className={labelCls}>Business Hours</label>
                                                    <input type="text" name="operatingHours" value={formData.operatingHours} onChange={handleChange} className={inputCls} />
                                                </div>

                                                <div>
                                                    <label className={labelCls}>Catering Policy</label>
                                                    <select name="cateringPolicy" value={formData.cateringPolicy} onChange={handleChange} className={inputCls}>
                                                        <option value="Only Internal">Only Internal Catering</option>
                                                        <option value="Only External">External Catering Allowed</option>
                                                        <option value="Internal & External">Both Allowed</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <h3 className="text-lg font-bold text-white opacity-0">Spacer</h3>
                                                
                                                <div>
                                                    <label className={labelCls}>Advance Payment Required (%)</label>
                                                    <div className="relative">
                                                        <input type="number" name="advancePayment" value={formData.advancePayment} onChange={handleChange} className={inputCls} />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">Alcohol Allowed?</p>
                                                        <p className="text-xs text-slate-500">Do you permit serving alcohol at events?</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" name="alcoholServed" checked={formData.alcoholServed} onChange={handleChange} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                            <div className="space-y-4">
                                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800"><ImageIcon className="w-5 h-5 text-red-600"/> Venue Gallery / Photos</h3>
                                                <MultiImageUpload 
                                                    onImagesChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))} 
                                                    maxImages={8} 
                                                />
                                            </div>

                                        {/* Description */}
                                        <div className="space-y-4">
                                            <label className={labelCls}>Business Description / Highlights</label>
                                            <textarea 
                                                name="description" 
                                                value={formData.description} 
                                                onChange={handleChange} 
                                                placeholder="Describe your venue, unique features, awards, or special packages..." 
                                                className={`${inputCls} h-32`} 
                                            />
                                        </div>

                                        <div className="pt-8 flex flex-col sm:flex-row gap-4">
                                            <button 
                                                type="button" 
                                                onClick={() => setStep(1)}
                                                className="w-full sm:w-1/3 h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                            >
                                                Edit Contact Info
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="w-full sm:w-2/3 h-14 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded-xl shadow-xl shadow-red-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                Choose Package
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            )}

                            {/* Step 3: Package Selection */}
                            {step === 3 && (
                                <div className="p-4 md:p-8 animate-in zoom-in duration-500">
                                    <div className="mb-6 flex items-center">
                                        <button onClick={() => setStep(2)} className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-2">
                                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                                        </button>
                                        <span className="text-sm font-bold text-slate-500">Back to Business Details</span>
                                    </div>
                                    <div className="text-center mb-10">
                                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Select your plan</h2>
                                        <p className="text-slate-500 mt-2">Get verified leads and manage your venues efficiently.</p>
                                    </div>
                                    <PricingPackages onSelect={handleFinalSubmit} isLoading={isSubmitting} />
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
