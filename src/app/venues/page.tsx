import { Suspense } from "react";
import Link from "next/link";
import { 
    MapPin, Star, ChevronRight, Sparkles, Building2, 
    ShieldCheck, ArrowRight, Grid3X3, ArrowUpDown, Filter,
    Building, Store, Phone, Users2, Eye, Heart, Globe2, ArrowLeft, Search
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { unslugify } from "@/lib/seo/slugify";
import ListingFilter from '@/components/ListingFilter';
import { Button } from "@/components/ui/button";

import { ReviewCarousel, BlogsCarousel } from "@/components/seo/SEOCollectionViewParts";
import { SafeImage } from "@/components/ui/SafeImage";
import CitySelect from "@/components/CitySelect";

export const revalidate = 3600;

async function fetchData(sParams: any = {}) {
    const supabase = await createClient();
    let query = supabase.from('venues').select('*').eq('is_active', true);
    
    if (sParams.city) query = query.ilike('city', `%${unslugify(sParams.city)}%`);
    if (sParams.type) query = query.ilike('type', `%${unslugify(sParams.type)}%`);
    if (sParams.q) {
        const q = sParams.q;
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,type.ilike.%${q}%`);
    }
    if (sParams.food && sParams.food !== 'Any') {
        if (sParams.food === 'Only Veg' || sParams.food === 'Pure Veg') query = query.ilike('food_type', '%Veg%').not('food_type', 'ilike', '%Non-Veg%');
        else if (sParams.food === 'Non-Veg') query = query.ilike('food_type', '%Non-Veg%');
    }
    
    // Budget
    if (sParams.budget) {
        if (sParams.budget === 'Under ₹1000') query = query.lt('veg_price_per_plate', 1000);
        else if (sParams.budget === '₹1000 - ₹1500') query = query.gte('veg_price_per_plate', 1000).lte('veg_price_per_plate', 1500);
        else if (sParams.budget === '₹1500 - ₹2000') query = query.gte('veg_price_per_plate', 1500).lte('veg_price_per_plate', 2000);
        else if (sParams.budget === 'Above ₹2000') query = query.gt('veg_price_per_plate', 2000);
    }
    
    // Capacity
    if (sParams.capacity) {
        if (sParams.capacity === 'Under 100') query = query.lt('max_capacity', 100);
        else if (sParams.capacity === '100 - 500') query = query.gte('max_capacity', 100).lte('max_capacity', 500);
        else if (sParams.capacity === '500 - 1000') query = query.gte('max_capacity', 500).lte('max_capacity', 1000);
        else if (sParams.capacity === 'Above 1000') query = query.gt('max_capacity', 1000);
    }
    
    // Rating
    if (sParams.rating && sParams.rating !== 'Any') {
        const r = parseFloat(sParams.rating);
        if (!isNaN(r)) query = query.gte('rating', r);
    }
    
    // Cuisine
    if (sParams.cuisine) {
        const cuisineList = sParams.cuisine.split(',');
        query = query.overlaps('cuisines', cuisineList);
    }

    const { data: venues } = await query.order('rating', { ascending: false }).limit(60);
    return (venues || []).map((v: any) => ({ ...v, locations: { city: v.city, area: v.location } }));
}

export default async function VenuesPage({ searchParams }: { searchParams: Promise<any> }) {
    const sParams = await searchParams;
    const allVenues = await fetchData(sParams);
    const displayVenues = allVenues.slice(0, 16); 
    const topRated = allVenues.slice(0, 4); 

    const OCCASIONS = ['Wedding', 'Engagement', 'Birthday Party', 'Corporate Event', 'Anniversary', 'Pre-Wedding', 'Pool Party', 'Kitty Party'];

    return (
        <main className="min-h-screen bg-white">
            
            {/* 1. CINEMATIC HERO HEADER | Optimized for Mobile */}
            <section className="relative h-[180px] md:h-[320px] flex items-center overflow-hidden bg-slate-900 border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img 
                      src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80" 
                      className="w-full h-full object-cover opacity-30 md:opacity-40 scale-105" 
                      alt="Venues Background" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-slate-950/80" />
                </div>

                <div className="max-w-[1300px] mx-auto px-6 md:px-10 relative z-10 w-full">
                    <div className="flex flex-col items-center md:items-start w-full">
                        <nav className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[4px] text-[#EF3E36] mb-6">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight size={10} className="text-white/20" />
                            <span className="text-white">Venues across Gujarat</span>
                        </nav>
                        
                        <div className="max-w-3xl mb-4 md:mb-10 text-center md:text-left">
                            <h1 className="text-xl md:text-5xl font-black text-white uppercase tracking-[4px] md:tracking-[8px] leading-tight mb-2 md:mb-0">
                                Global <span className="text-[#EF3E36] italic tracking-[2px]">Venues</span> Hub
                            </h1>
                        </div>

                        {/* Compact Search Bar (Desktop) | Single Line Bar (Mobile) */}
                        <div className="bg-white md:bg-white/10 backdrop-blur-xl rounded-full shadow-2xl flex flex-row items-center overflow-hidden w-full max-w-4xl border-2 md:border-4 border-white/10 group/searchbox transition-all duration-500 hover:border-white/20 h-11 md:h-16 px-1">
                            <div className="flex-[8] flex items-center px-4 md:px-6 h-full border-r border-slate-100 md:border-white/10">
                                <Search className="text-slate-400 md:text-white/60 w-4 h-4 md:w-5 md:h-5 mr-3 md:mr-4 shrink-0" />
                                <select className="w-full bg-transparent border-none focus:ring-0 text-slate-900 md:text-white font-bold text-[11px] md:text-sm appearance-none cursor-pointer">
                                    <option value="" className="text-slate-900">Search Venues...</option>
                                    {OCCASIONS.map(o => <option key={o} value={o} className="text-slate-900">{o}</option>)}
                                </select>
                            </div>
                            <button className="flex-[2] bg-[#EF3E36] hover:bg-[#D9362F] text-white font-black uppercase tracking-widest text-[10px] md:text-xs h-9 md:h-full px-4 md:px-8 transition-all rounded-full md:rounded-none">
                                Go
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. ELITE DISCOVERY SCANNER (Sticky Filters) - NOT STICKY ON MOBILE */}
            <div className="hidden md:block sticky top-20 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <ListingFilter type="venues" />
            </div>
            <div className="md:hidden z-40 bg-white border-b border-slate-100 shadow-sm">
                <ListingFilter type="venues" />
            </div>

            <div className="max-w-[1800px] mx-auto px-4 md:px-20 py-8 md:py-16">
                
                {/* 3. MAIN RECOMMENDATION GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 mb-12 md:mb-24">
                    {displayVenues.map((v: any) => (
                        <div key={v.id} className="bg-white rounded-xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col hover:-translate-y-2">
                             <div className="relative h-32 md:h-52 overflow-hidden shrink-0">
                                <SafeImage 
                                    src={v.image || (v.images && v.images[0])} 
                                    alt={v.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <button className="absolute top-2 md:top-4 right-2 md:right-4 z-10 w-7 md:w-9 h-7 md:h-9 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#EF3E36] transition-all">
                                    <Heart size={16} />
                                </button>
                                <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[9px] md:text-xs">
                                        <Users2 size={10} className="opacity-80"/>
                                        <span className="font-bold hidden sm:inline">{v.min_capacity || 0}-{v.max_capacity || 500}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[9px] md:text-xs">
                                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                        <span className="font-black">{v.rating || '4.8'}</span>
                                    </div>
                                </div>
                             </div>
                             <div className="p-3 md:p-5 flex flex-col flex-grow text-left">
                                <h3 className="text-sm md:text-[16px] font-black text-slate-950 leading-tight mb-1 md:mb-2 line-clamp-1">{v.name}</h3>
                                <p className="text-[10px] md:text-[12px] font-bold text-slate-400 flex items-center gap-1 mb-2 md:mb-4 text-left">
                                    <MapPin size={10}/> <span className="line-clamp-1">{v.location || v.city}</span>
                                </p>
                                <div className="pt-2 md:pt-4 border-t border-slate-50 flex items-center justify-between mt-auto gap-1">
                                    <div className="space-y-0.5 text-left">
                                        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</p>
                                        <p className="text-sm md:text-[15px] font-black text-slate-900">₹{v.veg_price_per_plate || '750'}</p>
                                    </div>
                                    <Link href={`/${(v.city || 'ahmedabad').toLowerCase().replace(/\s+/g, '-')}/${v.slug}`} className="h-7 md:h-10 px-2 md:px-4 bg-slate-950 text-white rounded-lg md:rounded-xl flex items-center justify-center font-black text-[9px] md:text-[10px] uppercase tracking-widest transform active:scale-95 transition-all">
                                        View
                                    </Link>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>

                {/* SECTION 1: TOP RATED VENUES */}
                <div className="mb-12 md:mb-24">
                    <div className="mb-6 md:mb-12">
                        <h2 className="text-lg md:text-2xl font-black text-slate-900 uppercase">Top rated venues</h2>
                        <div className="w-16 h-1 bg-[#EF3E36] mt-2 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                        {topRated.slice(0, 2).map((v: any) => (
                            <Link key={`top-${v.id}`} href={`/${(v.city || 'ahmedabad').toLowerCase().replace(/\s+/g, '-')}/${v.slug}`} className="group bg-slate-50/50 rounded-xl md:rounded-[2.5rem] p-3 md:p-5 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                                <div className="relative h-28 md:h-44 rounded-lg md:rounded-[2rem] overflow-hidden mb-2 md:mb-5">
                                    <SafeImage 
                                        src={v.image || (v.images && v.images[0])} 
                                        alt={v.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-white/95 px-2 md:px-3 py-0.5 md:py-1 rounded-full flex items-center gap-1 shadow-lg">
                                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-[10px] md:text-xs font-black">{v.rating || '4.8'}</span>
                                    </div>
                                </div>
                                <h4 className="text-xs md:text-[15px] font-black text-slate-900 group-hover:text-[#EF3E36] transition-colors line-clamp-1">{v.name}</h4>
                                <p className="text-[10px] md:text-[12px] text-slate-400 font-bold flex items-center gap-1 mt-0.5 md:mt-1 mb-2"><MapPin size={9}/> {v.city}</p>
                                <p className="text-xs md:text-sm font-black text-slate-900">₹{v.veg_price_per_plate || '750'} <span className="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-widest">/ plate</span></p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* SECTION 2: TABLE + CALLBACK */}
                <div className="mb-10 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 uppercase">Venue Price Guide</h2>
                    <div className="w-20 h-1 bg-[#EF3E36] rounded-full" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16 md:mb-24">
                    <div className="lg:col-span-8 overflow-x-auto no-scrollbar">
                        <div className="rounded-xl md:rounded-[2.5rem] border border-slate-200/60 shadow-xl bg-white overflow-hidden">
                            <div className="bg-slate-900 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[1.5px] md:tracking-[3px] flex items-center">
                                <div className="px-3 md:px-8 py-2 md:py-5 flex-[5]">Venue Name</div>
                                <div className="px-1 md:px-8 py-2 md:py-5 flex-[3] text-center">Capacity</div>
                                <div className="px-3 md:px-8 py-2 md:py-5 flex-[3] text-right">Price</div>
                            </div>
                            <div className="max-h-[300px] md:max-h-[500px] overflow-y-auto no-scrollbar scroll-smooth">
                                <table className="w-full text-left border-collapse">
                                    <tbody className="divide-y divide-slate-100">
                                        {allVenues.slice(0, 15).map((v: any) => (
                                            <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group flex items-center">
                                                <td className="px-3 md:px-8 py-2 md:py-5 flex-[5] font-bold text-slate-900 group-hover:text-[#EF3E36] transition-colors text-[10px] md:text-sm line-clamp-1">{v.name}</td>
                                                <td className="px-1 md:px-8 py-2 md:py-5 flex-[3] text-slate-500 font-bold text-center text-[9px] md:text-xs">{v.min_capacity || 50}-{v.max_capacity || 1000}</td>
                                                <td className="px-3 md:px-8 py-2 md:py-5 flex-[3] text-right font-black text-slate-900 text-[10px] md:text-sm">₹{v.veg_price_per_plate || '600'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 lg:sticky lg:top-28 transition-all">
                        <div className="bg-rose-50 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-[#EF3E36]/10 text-slate-900">
                            <h3 className="text-base md:text-xl font-black mb-3 md:mb-6 text-slate-900 text-center md:text-left">Get Expert's Callback</h3>
                            <form className="space-y-1.5 md:space-y-4">
                                <div className="grid grid-cols-2 gap-1.5 md:gap-4">
                                    <select className="w-full h-10 md:h-14 bg-white border border-slate-200 rounded-lg md:rounded-2xl px-3 text-[10px] md:text-sm focus:ring-2 focus:ring-primary appearance-none">
                                        <option>Occasion</option>
                                        {OCCASIONS.map(o => <option key={o}>{o}</option>)}
                                    </select>
                                    <input required type="date" className="w-full h-10 md:h-14 bg-white border border-slate-200 rounded-lg md:rounded-2xl px-3 text-[10px] md:text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 md:gap-4">
                                    <input type="number" placeholder="No. of Guests" className="w-full h-10 md:h-14 bg-white border border-slate-200 rounded-lg md:rounded-2xl px-3 text-[10px] md:text-sm focus:ring-2 focus:ring-primary" />
                                    <select className="w-full h-10 md:h-14 bg-white border border-slate-200 rounded-lg md:rounded-2xl px-3 text-[10px] md:text-sm appearance-none focus:ring-2 focus:ring-primary">
                                        <option>Budget Range</option>
                                        <option>Below 500</option>
                                        <option>500-1000</option>
                                        <option>1000-1500</option>
                                        <option>Above 1500</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 md:gap-4">
                                    <select className="w-full h-10 md:h-14 bg-white border border-slate-200 rounded-lg md:rounded-2xl px-3 text-[10px] md:text-sm appearance-none focus:ring-2 focus:ring-primary">
                                        <option>Food Type</option>
                                        <option>Only Veg</option>
                                        <option>Veg + Non-Veg</option>
                                    </select>
                                    <select className="w-full h-10 md:h-14 bg-white border border-slate-200 rounded-lg md:rounded-2xl px-3 text-[10px] md:text-sm appearance-none focus:ring-2 focus:ring-primary">
                                        <option>Soft Drinks</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                                <input required type="text" placeholder="Full Name" className="w-full h-10 md:h-14 bg-white border border-slate-200 rounded-lg md:rounded-2xl px-4 md:px-6 text-[10px] md:text-sm focus:ring-2 focus:ring-primary" />
                                <input required type="tel" placeholder="Mobile" className="w-full h-10 md:h-14 bg-white border border-slate-200 rounded-lg md:rounded-2xl px-4 md:px-6 text-[10px] md:text-sm focus:ring-2 focus:ring-primary" />
                                <button type="submit" className="w-full h-11 md:h-14 bg-[#EF3E36] hover:bg-[#D9362F] text-white font-black rounded-lg md:rounded-2xl shadow-lg shadow-primary/20 transform active:scale-95 transition-all uppercase tracking-widest text-[10px] md:text-[12px]">Get Quotes Now</button>
                            </form>
                            <p className="mt-6 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Trusted by 50k+ Happy Families</p>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: 3 SERVICE RECOMMENDATIONS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-24">
                    {[
                        { title: 'Need a Caterer?', desc: 'Best Food Experts', color: 'from-sky-50 to-blue-100', text: 'text-blue-600', link: '/ahmedabad/vendors/caterers/' },
                        { title: 'Looking for a Venue?', desc: 'Premium Locations', color: 'from-amber-50 to-orange-100', text: 'text-orange-600', link: '/venues/' },
                        { title: 'Birthday Planner?', desc: 'Birthday Specialists', color: 'from-pink-50 to-rose-100', text: 'text-rose-600', link: '/ahmedabad/vendors/decorators/' }
                    ].map((s) => (
                        <div key={s.title} className={`p-8 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br ${s.color} border border-white/50 group hover:shadow-xl transition-all relative overflow-hidden cursor-pointer`}>
                            <Link href={s.link} className="absolute inset-0 z-20" />
                            <div className="relative z-10 text-left">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Services</p>
                                <h4 className={`text-xl font-black ${s.text} mb-4`}>{s.title}</h4>
                                <span className="flex items-center gap-2 text-sm font-bold text-slate-900 underline underline-offset-4 decoration-slate-300 group-hover:decoration-[#EF3E36] transition-all">Browse Now <ArrowRight size={14}/></span>
                            </div>
                            <div className="absolute top-0 right-0 p-8 text-slate-900/5 transition-transform hidden sm:block"><Sparkles size={80} /></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION 4: FULL WIDTH HAVE A SPACE? */}
            <section className="bg-slate-900 py-3 md:py-8 px-4 md:px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-center">
                    <h2 className="text-base md:text-2xl font-medium text-white italic" style={{ fontFamily: 'serif' }}>Have a Space ?</h2>
                    <Link href="/list-business">
                        <Button className="bg-white hover:bg-slate-100 text-slate-900 font-black px-5 md:px-8 h-8 md:h-12 rounded-lg md:rounded-xl text-[11px] md:text-sm transition-all border-none uppercase tracking-widest">
                            List with VenueConnect
                        </Button>
                    </Link>
                </div>
            </section>

            {/* SECTION 5: DISCOVERY CONTENT (Strictly below Partners Bar) */}
            <section className="bg-white py-8 px-4 md:py-16 md:px-6">
                <div className="max-w-[1800px] mx-auto px-4 md:px-14 space-y-4 md:space-y-12">
                    <div className="text-sm md:text-base text-slate-600 leading-snug md:leading-relaxed space-y-2 md:space-y-4">
                        <p className="font-medium text-sm md:text-base">
                            Gujarat stands as a beacon of history and modernity. With its strategic location and state-of-the-art infrastructure, the state has evolved into a premier destination for events and celebrations, drawing visitors from every corner of the nation. From the bustling streets of Ahmedabad to the royal heritage of Rajkot, discovery never ends.
                        </p>
                        <p className="font-medium text-sm md:text-base">
                            Whether you're planning a corporate gathering, a social soirée, or the wedding of a lifetime, Gujarat's blend of heritage and modernity provides the perfect backdrop for every occasion. With its cosmopolitan charm and unmatched hospitality, our platform invites you to revel in the magic of your special moments.
                        </p>
                    </div>

                    <div className="hidden md:block pt-12 border-t border-slate-100">
                        <h3 className="text-lg font-black text-slate-900 mb-8 uppercase tracking-wider">Explore Popular Destinations</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-4">
                            {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Vapi', 'Anand', 'Nadiad', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Mehsana'].map(city => (
                                <Link key={city} href={`/${city.toLowerCase()}`} className="font-bold text-slate-400 hover:text-[#EF3E36] transition-colors block pb-1 border-b border-transparent hover:border-[#EF3E36]/30">
                                    Best Venues in {city}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* EVENT PLANNING INSPIRATION SECTION */}
            <section className="bg-white py-8 md:py-12 border-t border-slate-50 relative">
                <div className="max-w-[1800px] mx-auto text-center px-4 md:px-20">
                    <div className="mb-8 md:mb-16">
                        <h2 className="text-xl md:text-4xl font-black text-slate-800 mb-2 md:mb-4 tracking-tight">Event Planning Inspiration & Ideas</h2>
                        <p className="text-[#EF3E36] font-bold text-sm md:text-lg tracking-tight">Get inspired with the latest event trends and party ideas</p>
                    </div>

                    <div className="relative group/carousel mx-auto">
                        <BlogsCarousel />
                    </div>
                </div>
            </section>

            {/* SECTION 7: TRUST & MARKETPLACE HUB (Panoramic Sync) */}
            <section className="bg-white py-24 px-6 border-t border-slate-100">
                <div className="max-w-[1800px] mx-auto px-6 md:px-20 space-y-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
                        <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Venue Spaces", val: "5000+", icon: <Building className="text-purple-500" /> },
                                { label: "Happy Users", val: "50k+", icon: <Users2 className="text-rose-400" /> },
                                { label: "Cities", val: "20+", icon: <Globe2 className="text-amber-500" /> },
                                { label: "Vendors", val: "450+", icon: <Store className="text-blue-500" /> }
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-50 flex flex-col items-center text-center space-y-3 min-h-[140px] justify-center">
                                    <div className="w-10 h-10 flex items-center justify-center">{s.icon}</div>
                                    <div>
                                        <p className="text-lg font-black text-slate-900">{s.val}</p>
                                        <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-tighter">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-7">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase">Fastest Growing Venue and Vendor Booking MarketPlace</h2>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">Since our launch, we have built a trusted ecosystem for business and experience. Our mission is Making Happy Occasions Happier!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 8: GLOBAL DIRECTORY (Panoramic Sync) */}
            <section className="bg-white pt-6 md:pt-24 pb-12 border-t border-slate-100">
                <div className="max-w-[1080px] mx-auto px-6">
                    {/* City Selection Directory — Dropdown on Mobile */}
                    <div className="md:hidden pt-4 pb-8">
                        <CitySelect />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-1 mb-16">
                        {[
                            ['Banquet Hall', 'Party Plot', 'Lawn', 'Resort'],
                            ['Wedding Venues', 'Birthday Party', 'Corporate Event', 'Social Mixer'],
                            ['Caterers', 'Decorators', 'Photographers', 'Mehndi Artists'],
                            ['Engagement Hall', 'Reception Venue', 'Cocktail Party', 'Anniversary']
                        ].map((list, colIdx) => (
                            <div key={colIdx} className="space-y-1">
                                {list.map(item => (
                                    <Link key={item} href={`/venues`} className="block text-[14px] font-bold text-slate-500 hover:text-black transition-all leading-relaxed">
                                        {item} Venue
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
