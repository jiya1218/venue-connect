"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    MapPin, Search, Star, ChevronRight, ChevronLeft, 
    Sparkles, Users2, ArrowLeft, Building2, Camera, Utensils, Music, Palette, Quote, Building
} from "lucide-react";
import { GUJARAT_CITIES, VENDOR_TYPES } from "@/lib/constants";

interface SEOVendorHubViewProps {
    citySlug: string;
    locationLabel: string;
    vendors: any[];
}

const REVIEWS = [
  { name: "Amarya", text: "We recently hosted our child's first birthday with the help of VenueConnect and it was a very memorable...", title: "Wonderful Experience !", rating: 5 },
  { name: "Siddharth", text: "Found the perfect photographer for my sister's wedding. The process was smooth and the quality was top-notch.", title: "Extremely Professional", rating: 5 },
  { name: "Meera", text: "Great experience booking my pre-wedding shoot. The vendor was very cooperative and understanding.", title: "Saved my day!", rating: 5 },
];

const CATEGORY_ICONS: Record<string, string> = {
    "Photography": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80",
    "Catering": "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80",
    "Decorators": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80",
    "Makeup and Hair": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
    "Mehendi": "https://images.unsplash.com/photo-1610173827002-62c0f1f05d04?w=400&q=80",
    "DJ": "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80",
};

const HIRE_SERVICES = [
    { title: "Mehndi Artists", img: "https://images.unsplash.com/photo-1610173827002-62c0f1f05d04?w=600&q=80", path: "mehendi" },
    { title: "Bridal Wear", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80", path: "bridal-wear" },
    { title: "Groom Wear", img: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=600&q=80", path: "groom-wear" },
    { title: "Decorators", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80", path: "decorators" },
    { title: "Photographers", img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80", path: "photography" },
    { title: "Makeup Artists", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80", path: "makeup-and-hair" },
];

const BLOGS = [
    { title: "Event Lighting Ideas That Completely...", text: "Lighting is one of the most powerful yet oft...", date: "Friday Mar 27, 2026", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80", slug: "event-lighting-ideas" },
    { title: "How Couples Are Blending Festiviti...", text: "Indian weddings have always been grand, vibr...", date: "Tuesday Apr 14, 2026", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", slug: "blending-festivities" },
];

export function SEOVendorHubView({ citySlug, locationLabel, vendors }: SEOVendorHubViewProps) {
    const [searchCategory, setSearchCategory] = useState("");
    const [searchCity, setSearchCity] = useState(citySlug || 'ahmedabad');
    const [catIndex, setCatIndex] = useState(0);

    const handleSearch = () => {
        const city = searchCity.toLowerCase();
        const category = searchCategory.toLowerCase().replace(/[\s']+/g, '-');
        
        const isAllCities = searchCity === 'All Cities';
        const isAllVendors = !searchCategory || searchCategory === 'All Vendors';

        if (isAllCities) {
            window.location.href = isAllVendors ? '/all/vendors' : `/${category}`;
        } else {
            window.location.href = `/${city}/vendors/${isAllVendors ? 'vendors' : category}`;
        }
    };

    const [topVendorsIndex, setTopVendorsIndex] = useState(0);
    const [reviewsIndex, setReviewsIndex] = useState(0);

    const chunkArray = (arr: any[], size: number) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const vendorRows = chunkArray(vendors, Math.ceil(vendors.length / 2));

    const PRIORITY_CATEGORIES = Object.keys(CATEGORY_ICONS);
    const displayCategories = [...PRIORITY_CATEGORIES, ...PRIORITY_CATEGORIES];

    return (
        <main className="min-h-screen bg-white font-sans text-slate-900">
            {/* HERO SECTION */}
            <section className="relative h-[240px] md:h-[280px] flex items-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80" 
                        className="w-full h-full object-cover opacity-40 scale-105" 
                        alt="" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
                </div>

                <div className="max-w-[1800px] mx-auto px-6 md:px-20 relative z-10 w-full">
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[4px] text-primary/80 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={10} className="text-white/20" />
                        <span className="text-white">Vendors in {locationLabel}</span>
                    </nav>
                    
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-[4px] md:tracking-[8px] leading-[1.2] mb-10">
                        Event Professionals<br/><span className="text-primary italic tracking-[2px]">in {locationLabel}</span>
                    </h1>

                    <div className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-stretch overflow-hidden w-full max-w-6xl border-2 md:border-4 border-white/10 group/searchbox transition-all duration-500 hover:border-white/20">
                       <div className="flex-[7] flex items-center px-4 md:px-10 py-3 md:py-6 border-b md:border-b-0 md:border-r border-white/10">
                           <Search className="text-white/60 w-4 h-4 md:w-5 md:h-5 mr-3 md:mr-5 group-hover/searchbox:text-primary transition-colors" />
                           <select 
                               className="w-full bg-transparent border-none focus:ring-0 text-white font-bold text-xs md:text-sm appearance-none cursor-pointer"
                               value={searchCategory}
                               onChange={(e) => setSearchCategory(e.target.value)}
                           >
                               <option value="" className="text-slate-900 font-sans tracking-normal">What are you looking for?</option>
                               <option value="All Vendors" className="text-slate-900 font-bold bg-slate-50 uppercase tracking-tighter">-- All Vendors --</option>
                               {VENDOR_TYPES.map(t => (
                                   <option key={t} value={t} className="text-slate-900 font-sans tracking-normal">{t}</option>
                               ))}
                           </select>
                       </div>
                       <div className="flex-[3] flex items-center px-4 md:px-10 py-3 border-b md:border-b-0 md:border-r border-white/10 bg-white/5">
                           <MapPin className="text-white/60 w-4 h-4 md:w-5 md:h-5 mr-3 md:mr-4" />
                           <select 
                               className="w-full bg-transparent border-none focus:ring-0 text-white font-black text-[9px] md:text-[11px] uppercase tracking-[3px] md:tracking-[5px] appearance-none cursor-pointer"
                               value={searchCity}
                               onChange={(e) => setSearchCity(e.target.value)}
                           >
                               <option value="All Cities" className="text-slate-900 font-bold">ALL CITIES</option>
                               {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'].map(c => (
                                   <option key={c} value={c} className="text-slate-900 font-sans tracking-normal">{c}</option>
                               ))}
                           </select>
                       </div>
                       <button onClick={handleSearch} className="flex-[2] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[3px] md:tracking-[5px] text-[9px] md:text-[10px] px-6 md:px-12 transition-all h-10 md:h-full min-h-[40px] md:min-h-[64px]">
                           SEARCH
                       </button>
                   </div>
                </div>
            </section>



            {/* CATEGORY SWIPER */}
            <section className="py-4 bg-white relative border-b border-slate-50 overflow-hidden">
                <div className="max-w-[1800px] mx-auto px-10 md:px-20 relative">
                     <button onClick={() => setCatIndex(prev => Math.max(0, prev - 1))} className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 border-2 border-slate-900 rounded-full flex items-center justify-center bg-white hover:bg-slate-900 hover:text-white transition-all z-10 shadow-xl"><ArrowLeft size={16}/></button>
                     <button onClick={() => setCatIndex(prev => prev + 1)} className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 border-2 border-slate-900 rounded-full flex items-center justify-center bg-white hover:bg-slate-900 hover:text-white transition-all z-10 shadow-xl"><ChevronRight size={16}/></button>

                    <div className="overflow-hidden">
                        <div 
                            className="flex items-start gap-8 py-1 px-1 transition-transform duration-1000"
                            style={{ transform: `translateX(-${catIndex * 160}px)` }}
                        >
                            {displayCategories.map((name, idx) => (
                                <Link key={`${name}-${idx}`} href={`/${citySlug}/vendors/${name.toLowerCase().replace(/[\s/]+/g, '-')}`} className="flex-shrink-0 flex flex-col items-center gap-2 group">
                                    <div className="w-32 h-20 rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                                        <img src={CATEGORY_ICONS[name] || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt=""/>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TOP VENDORS SCROLLABLE (Double Line) */}
            <section className="py-14 bg-white relative group">
                <div className="max-w-[1800px] mx-auto px-10 md:px-20">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Top Rated Professionals in {locationLabel}</h2>
                        <div className="flex gap-4">
                             <button onClick={() => setTopVendorsIndex(prev => Math.max(0, prev - 1))} className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"><ChevronLeft size={20}/></button>
                             <button onClick={() => setTopVendorsIndex(prev => prev + 1)} className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"><ChevronRight size={20}/></button>
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <div 
                            className="flex gap-6 transition-transform duration-700"
                            style={{ transform: `translateX(-${topVendorsIndex * 350}px)` }}
                        >
                            {/* Two Rows of Vendors */}
                            <div className="flex flex-col gap-6">
                                <div className="flex gap-6">
                                    {vendors.slice(0, Math.ceil(vendors.length / 2)).map((v, i) => (
                                        <VendorCard key={`row1-${i}`} v={v} citySlug={citySlug} locationLabel={locationLabel} />
                                    ))}
                                </div>
                                <div className="flex gap-6">
                                    {vendors.slice(Math.ceil(vendors.length / 2)).map((v, i) => (
                                        <VendorCard key={`row2-${i}`} v={v} citySlug={citySlug} locationLabel={locationLabel} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* REVIEWS SECTION - Optimized Mobile Spacing */}
            <section className="py-16 md:py-20 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="max-w-[1800px] mx-auto px-4 md:px-20">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 md:mb-16 gap-6 px-2 md:px-0">
                        <div className="text-left">
                            <p className="text-primary font-black uppercase tracking-[4px] text-[10px] md:text-xs mb-3">Testimonials</p>
                            <h2 className="text-2xl md:text-5xl font-black tracking-tight leading-tight uppercase">What our clients <br/> have to say..</h2>
                        </div>
                        <div className="flex gap-3 md:gap-4">
                            <button onClick={() => setReviewsIndex(prev => Math.max(0, prev - 1))} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all"><ChevronLeft size={20}/></button>
                            <button onClick={() => setReviewsIndex(prev => prev + 1)} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all"><ChevronRight size={20}/></button>
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <div 
                            className="flex gap-4 md:gap-8 transition-transform duration-700"
                            style={{ transform: `translateX(-${reviewsIndex * (typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 33.33)}%)` }}
                        >
                            {REVIEWS.map((r, i) => (
                                <div key={i} className="min-w-full md:min-w-[calc(33.33%-22px)] bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/10 flex flex-col gap-4 md:gap-6 group hover:bg-white/10 transition-all">
                                    <div className="flex gap-1">
                                        {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} className="fill-primary text-primary" />)}
                                    </div>
                                    <h4 className="text-lg md:text-xl font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">{r.title}</h4>
                                    <p className="text-white/60 font-bold text-xs md:text-sm leading-relaxed italic">"{r.text}"</p>
                                    <div className="mt-2 md:mt-4 flex items-center gap-3 md:gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-xs md:text-base">{r.name.charAt(0)}</div>
                                        <div>
                                            <p className="font-black text-[11px] md:text-sm uppercase tracking-widest">{r.name}</p>
                                            <p className="text-[9px] font-bold text-white/30">Verified Client</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function VendorCard({ v, citySlug, locationLabel }: { v: any, citySlug: string, locationLabel: string }) {
    return (
        <Link href={`/${v.city?.toLowerCase() || citySlug}/vendors/${v.slug}`} className="min-w-[320px] group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2">
            <div className="relative h-48 overflow-hidden">
                <img src={v.image || (v.images && v.images[0]) || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={v.name}/>
                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[11px] font-black">{v.rating || '4.8'}</span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-lg font-black text-slate-950 mb-1 group-hover:text-primary transition-colors truncate">{v.name}</h3>
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-4 uppercase tracking-wider"><MapPin size={12} className="text-primary"/> {v.location || v.area || locationLabel}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-primary bg-primary/5 px-3 py-1 rounded-lg">{v.vendor_type || v.category}</span>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-300 uppercase">Starting</span>
                        <span className="text-sm font-black text-slate-900">₹{v.starting_price || '15,000'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
