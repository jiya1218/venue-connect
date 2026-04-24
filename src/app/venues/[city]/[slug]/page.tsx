import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckCircle2, ChevronRight, MapPin, Phone, MessageCircle, Star, Info, Share2, Heart, Building2, Store, IndianRupee, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GetQuoteModal from "@/components/GetQuoteModal";
import ReviewsList from "@/components/ReviewsList";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

// Import our new listing components
import VenueGallery from "@/components/listing/VenueGallery";
import ListingHeaderActions from "@/components/listing/ListingHeaderActions";
import ListingDescription from "@/components/listing/ListingDescription";
import { 
  QuickInfoBar, 
  PricingDetails, 
  AmenitiesGrid, 
  SpacesCapacity, 
  CateringPolicy, 
  LocationMap 
} from "@/components/listing/VenueSections";
import SimilarVenues from "@/components/listing/SimilarVenues";

interface PageProps {
  params: Promise<{ city: string; slug: string }>;
}

function slugifyCity(city?: string | null): string {
    return (city || "").trim().toLowerCase().replace(/\s+/g, "-");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: venue } = await supabase
        .from('venues')
        .select('name, description, image, city')
        .eq('slug', slug)
        .single();
  if (!venue) return { title: "Venue Not Found | VenueConnect" };

  return {
    title: `${venue.name} - ${venue.city} | Best Wedding Venues in Gujarat`,
    description: venue.description || `Book ${venue.name} in ${venue.city} for your next event. Best prices and verified details on VenueConnect.`,
    openGraph: {
      images: [venue.image || ""],
    },
  };
}

export default async function VenueDetailsPage({ params }: PageProps) {
    const { city, slug } = await params;
    const supabase = await createClient();
    const { data: venue } = await supabase
        .from('venues')
        .select('*, profiles:owner_id(phone_number, full_name)')
        .eq('slug', slug)
        .single();

    if (!venue) {
    notFound();
  }

    const canonicalSlug = venue.slug || venue.id;
    const canonicalCity = slugifyCity(venue.city) || city;
    // Always redirect to the new flattened URL: /[city]/[slug]
    return redirect(`/${canonicalCity}/${canonicalSlug}`);

  const images = venue.images && venue.images.length > 0 ? venue.images : [venue.image].filter(Boolean);
  const isApproved = venue.is_approved === true || venue.is_verified === true;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <main className="pb-24 md:pb-20">
        
        {/* Breadcrumb & Quick Actions Header */}
         <div className="bg-white border-b border-slate-100">
             <div className="container px-3 md:px-4 py-3 md:py-4 mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 md:gap-4">
                 <nav className="flex items-center gap-1 md:gap-2 text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                     <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                     <ChevronRight className="w-3 h-3 flex-shrink-0" />
                     <Link href="/venues" className="hover:text-primary transition-colors">Venues</Link>
                     <ChevronRight className="w-3 h-3 flex-shrink-0" />
                     <Link href={`/${(venue.city || '').toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors">{venue.city}</Link>
                     <ChevronRight className="w-3 h-3 flex-shrink-0" />
                     <span className="text-slate-900 truncate max-w-[120px] md:max-w-[150px]">{venue.name}</span>
                 </nav>
                 <div className="hidden md:block">
                   <ListingHeaderActions listing={venue} type="venue" />
                 </div>
             </div>
         </div>

        <div className="container px-3 md:px-6 mx-auto max-w-7xl mt-4 md:mt-8">
          
          {/* Main Title Section */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                <div className="w-full">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                        <h1 className="font-display text-2xl md:text-6xl font-black text-slate-900 leading-tight">
                            {venue.name}
                        </h1>
                        {isApproved && (
                            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black tracking-[2px] uppercase shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 className="w-4 h-4" /> Verified
                            </div>
                        )}
                        <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black tracking-[2px] uppercase">
                            {venue.type || "Banquet Hall"}
                        </span>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <Link href="#reviews" className="flex items-center gap-1.5 group">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 md:w-4 h-3 md:h-4 ${i < Math.floor(venue.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                                ))}
                            </div>
                            <span className="text-xs md:text-sm font-bold text-slate-700 underline group-hover:text-primary transition-colors">{venue.reviews || 0} Reviews</span>
                        </Link>
                        <div className="flex items-start gap-2 text-slate-500 font-light">
                            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs md:text-lg">{venue.address || `${venue.location || ''}, ${venue.city}`}</span>
                        </div>
                    </div>
                </div>

                {/* Mobile Header Actions */}
                <div className="md:hidden border-t pt-6 w-full">
                    <ListingHeaderActions listing={venue} type="venue" />
                </div>
            </div>
          </div>

          {/* Section 1: Gallery */}
          <VenueGallery images={images} name={venue.name} />

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
            
            {/* Left Column: Extensive Details */}
            <div className="lg:col-span-8">
              
              {/* Section 3: Quick Info */}
              <QuickInfoBar venue={venue} />

              {/* Section 4: About */}
              <ListingDescription description={venue.description} title="About the Venue" />

              {/* Section 5: Pricing */}
              <PricingDetails venue={venue} />

              {/* Section 6: Amenities */}
              <AmenitiesGrid venue={venue} />

              {/* Section 7: Spaces & Capacity */}
              <SpacesCapacity venue={venue} />

              {/* Section 8: Catering & Food */}
              <CateringPolicy venue={venue} />

              {/* Section 9: Map */}
              <LocationMap venue={venue} />

              {/* Section 10: Reviews */}
              <ReviewsList listingId={venue.id} listingType="venue" />

              {/* Section 11: Similar Venues */}
              <SimilarVenues currentId={venue.id} city={venue.city} type={venue.type} />

            </div>

            {/* Right Column: Sticky Enquiry Bar - Hidden on mobile, sticky on desktop */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-32 space-y-6">
                
                {/* Contact Card */}
                <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-300 overflow-hidden relative border border-slate-800">
                    {/* Decorative element */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                        <div className="mb-8">
                            <span className="text-primary font-black uppercase tracking-[3px] text-[10px] mb-2 block">Premium Quote</span>
                            <h3 className="text-3xl font-display font-bold text-white mb-2">Check Availability</h3>
                            <p className="text-slate-400 font-light text-sm">Response guaranteed within 24 hours directly from venue manager.</p>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <IndianRupee className="w-10 h-10 text-white p-2 rounded-xl bg-primary/20" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Starting Price</p>
                                    <p className="text-xl font-black text-white">₹{venue.veg_price_per_plate}/plate</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <Users2 className="w-10 h-10 text-white p-2 rounded-xl bg-blue-500/20" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Seating Capacity</p>
                                    <p className="text-xl font-black text-white">{venue.min_capacity}-{venue.max_capacity} Guests</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <GetQuoteModal 
                                businessName={venue.name} 
                                listingId={venue.id}
                                listingType="venue"
                                ownerId={venue.owner_id}
                                triggerButton={
                                    <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-xl shadow-primary/40 transition-all active:scale-95 group">
                                        Send Free Enquiry <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                }
                            />

                            {venue.profiles?.phone_number && (
                                <a 
                                    href={`tel:${venue.profiles.phone_number}`}
                                    className="w-full h-14 rounded-2xl border border-slate-700 bg-white/5 text-slate-300 font-bold text-sm hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
                                >
                                    <Phone className="w-4 h-4" /> Call Manager
                                </a>
                            )}
                            
                            <a 
                                href={`https://wa.me/91${venue.profiles?.phone_number || ''}?text=Hi, I am interested in ${venue.name} found on VenueConnect.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold text-sm hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-3 border border-emerald-500/20"
                            >
                                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* Info Tip */}
                <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-200/50 flex items-center justify-center shrink-0">
                        <Info className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Expert Tip</p>
                        <p className="text-[11px] text-amber-900/60 leading-relaxed font-medium">Venues get booked 6-8 months in advance for auspicious dates. Book early to secure your preferred date!</p>
                    </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 p-2.5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex items-center gap-3">
            <a 
                href={`tel:${venue.profiles?.phone_number || ''}`}
                className="w-11 h-11 rounded-lg border border-slate-200 flex items-center justify-center text-slate-900 flex-shrink-0"
            >
                <Phone className="w-5 h-5" />
            </a>
            <div className="flex-grow">
                <GetQuoteModal 
                    businessName={venue.name} 
                    listingId={venue.id}
                    listingType="venue"
                    ownerId={venue.owner_id}
                    triggerButton={
                        <Button className="!h-8 w-full rounded-md bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 py-0 px-3">
                            Check Availability
                        </Button>
                    }
                />
            </div>
      </div>

    </div>
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const { createClient: createStaticClient } = await import("@/lib/supabase/static");
  const supabase = createStaticClient();

  if (!supabase) return [];

  const { data } = await supabase.from('venues').select('slug, city').limit(200);
  return data
    ?.filter((v: any) => v.slug && v.city)
    .map((v: any) => ({
      city: v.city.toLowerCase(),
      slug: v.slug,
    })) || [];
}
