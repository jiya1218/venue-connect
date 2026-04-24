import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckCircle2, ChevronRight, MapPin, Phone, MessageCircle, Star, Info, Share2, Heart, Award, IndianRupee, Mail, Instagram, Globe, MessageSquare, Camera, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import GetQuoteModal from "@/components/GetQuoteModal";
import ReviewsList from "@/components/ReviewsList";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

// Import our listing components
import VenueGallery from "@/components/listing/VenueGallery";
import ListingHeaderActions from "@/components/listing/ListingHeaderActions";
import ListingDescription from "@/components/listing/ListingDescription";
import { 
  VendorQuickStats, 
  VendorServices, 
  VendorPortfolio, 
  VendorServiceAreas 
} from "@/components/listing/VendorSections";
import SimilarVendors from "@/components/listing/SimilarVendors";

interface PageProps {
  params: Promise<{ city: string; slug: string }>;
}

function slugify(value?: string | null): string {
        return (value || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
}

function vendorSlugCandidates(vendor: any): string[] {
    const name = vendor?.name || "";
    const area = vendor?.location || vendor?.city || "";
    return [
        slugify(vendor?.slug),
        slugify(name),
        slugify(`${name} in ${area}`),
        slugify(`${name}-${area}`),
    ].filter(Boolean);
}

async function findVendorRecord(cityParam: string, slugParam: string) {
    const supabase = await createClient();

    const { data: exactSlug } = await supabase
        .from('vendors')
        .select('*')
        .eq('slug', slugParam)
        .maybeSingle();

    if (exactSlug) {
        return exactSlug;
    }

    const cityGuess = cityParam.replace(/-/g, ' ');
    const { data: cityVendors } = await supabase
        .from('vendors')
        .select('*')
        .ilike('city', `%${cityGuess}%`)
        .limit(300);

    const matched = (cityVendors || []).find((v: any) =>
        vendorSlugCandidates(v).includes(slugify(slugParam))
    );

    return matched || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city, slug } = await params;
    const vendor = await findVendorRecord(city, slug);
  if (!vendor) return { title: "Vendor Not Found | VenueConnect" };

  return {
    title: `${vendor.name} - ${vendor.category} in ${vendor.city} | VenueConnect`,
    description: vendor.description || `Book ${vendor.name} for your next event. Verified ${vendor.category} in ${vendor.city} on VenueConnect.`,
    openGraph: {
      images: [vendor.image || ""],
    },
  };
}

export default async function VendorDetailsPage({ params }: PageProps) {
    const { city, slug } = await params;
        const supabase = await createClient();
        const vendor = await findVendorRecord(city, slug);

    if (!vendor) {
    notFound();
  }

        const { data: profile } = vendor.owner_id
            ? await supabase
                    .from('profiles')
                    .select('phone_number, full_name, email')
                    .eq('id', vendor.owner_id)
                    .maybeSingle()
            : { data: null };

        const vendorWithProfile = { ...vendor, profiles: profile };

    const canonicalSlug = slugify(vendor.slug) || slugify(`${vendor.name} in ${vendor.location || vendor.city}`);
    const canonicalCity = slugify(vendor.city) || city;
    // Always redirect to the new flattened URL: /[city]/[slug]
    return redirect(`/${canonicalCity}/${canonicalSlug}`);

    const images = vendorWithProfile.images && vendorWithProfile.images.length > 0 ? vendorWithProfile.images : [vendorWithProfile.image].filter(Boolean);
    const isApproved = vendorWithProfile.is_approved === true || vendorWithProfile.is_verified === true;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <main className="pb-20">
        
        {/* Breadcrumb & Quick Actions Header */}
        <div className="bg-white border-b border-slate-100">
            <div className="container px-4 py-4 mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
                <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/vendors" className="hover:text-primary transition-colors">Vendors</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href={`/vendors?category=${encodeURIComponent(vendor.category)}`} className="hover:text-primary transition-colors">{vendor.category}</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-slate-900 truncate max-w-[150px]">{vendor.name}</span>
                </nav>
                <div className="hidden md:block">
                  <ListingHeaderActions listing={vendor} type="vendor" />
                </div>
            </div>
        </div>

        <div className="container px-4 md:px-6 mx-auto max-w-7xl mt-8">
          
          {/* Main Title Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    {/* Logo/Avatar initials */}
                    <div className="hidden md:flex w-24 h-24 rounded-3xl bg-white border border-slate-100 shadow-xl items-center justify-center overflow-hidden shrink-0">
                        {vendor.logo_url ? (
                            <img src={vendor.logo_url} alt={vendor.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-black text-primary">{vendor.name.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                {vendor.name}
                            </h1>
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-[2px] uppercase">
                                {vendor.category}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-1.5">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(vendor.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-slate-700 underline">{vendor.reviews || 0} Reviews</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 font-light">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="text-lg">{vendor.city}, Gujarat</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Header Actions */}
                <div className="md:hidden border-t pt-6 w-full flex items-center justify-between">
                     <div className="flex w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-lg items-center justify-center overflow-hidden shrink-0">
                        {vendor.logo_url ? (
                            <img src={vendor.logo_url} alt={vendor.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xl font-black text-primary">{vendor.name.charAt(0)}</span>
                        )}
                    </div>
                    <ListingHeaderActions listing={vendor} type="vendor" />
                </div>
            </div>
          </div>

          {/* Section 1: Gallery */}
          <VenueGallery 
            images={images} 
            name={vendorWithProfile.name} 
            overlay={
                <div className="flex flex-col gap-2">
                    <div className="bg-slate-900/80 backdrop-blur-md text-white px-5 py-2 rounded-2xl text-[10px] font-black tracking-[2px] uppercase w-fit">
                        {vendorWithProfile.category}
                    </div>
                    {isApproved && (
                        <div className="bg-emerald-500 text-white px-5 py-2 rounded-2xl text-[10px] font-black tracking-[2px] uppercase flex items-center gap-2 w-fit shadow-xl shadow-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" /> Verified Professional
                        </div>
                    )}
                </div>
            }
          />

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Left Column: Extensive Details */}
            <div className="lg:col-span-8">
              
              {/* Section 3: Quick Stats */}
              <VendorQuickStats vendor={vendorWithProfile} />

              {/* Section 4: About */}
              <ListingDescription description={vendorWithProfile.description} title="Business Profile" />

              {/* Section 5: Services */}
              <VendorServices vendor={vendorWithProfile} />

              {/* Section 6: Portfolio (Full Grid) */}
              <VendorPortfolio images={images} name={vendorWithProfile.name} />

              {/* Section 7: Service Areas */}
              <VendorServiceAreas vendor={vendorWithProfile} />

              {/* Section 9: Reviews */}
              <ReviewsList listingId={vendorWithProfile.id} listingType="vendor" />

              {/* Section 10: Similar Vendors */}
              <SimilarVendors currentId={vendorWithProfile.id} city={vendorWithProfile.city} category={vendorWithProfile.category} />

            </div>

            {/* Right Column: Sticky Contact Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                
                {/* Contact Card */}
                <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 overflow-hidden relative border border-slate-100">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                                {vendor.logo_url ? (
                                    <img src={vendor.logo_url} alt={vendor.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl font-black text-primary">{vendor.name.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-bold text-slate-900">{vendor.name}</h3>
                                <p className="text-primary text-[10px] font-black uppercase tracking-widest">{vendor.category}</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <IndianRupee className="w-10 h-10 text-primary p-2 rounded-xl bg-primary/10" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Starting Price</p>
                                    <p className="text-xl font-black text-slate-900">₹{vendor.starting_price?.toLocaleString('en-IN') || 'Consult'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <GetQuoteModal 
                                businessName={vendor.name} 
                                listingId={vendor.id}
                                listingType="vendor"
                                ownerId={vendor.owner_id}
                                triggerButton={
                                    <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-xl shadow-primary/40 transition-all active:scale-95 group">
                                        Check Availability <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                }
                            />

                            {vendor.profiles?.phone_number && (
                                <a 
                                    href={`tel:${vendor.profiles.phone_number}`}
                                    className="w-full h-14 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                                >
                                    <Phone className="w-4 h-4" /> Call Vendor
                                </a>
                            )}
                            
                            <a 
                                href={`https://wa.me/91${vendor.profiles?.phone_number || ''}?text=Hi, I found you on VenueConnect and want to enquire about your ${vendor.category} services.`}
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
                <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Info className="w-20 h-20" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-primary mb-3">Expert Insight</p>
                    <p className="text-sm font-light text-slate-300 leading-relaxed mb-6">Booking vendors directly through VenueConnect ensures you get the **official rates** and audited service quality.</p>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700" />
                            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-600" />
                            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 capitalize">150+ users enquired this week</span>
                    </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex items-center gap-4">
            <a 
                href={`tel:${vendor.profiles?.phone_number || ''}`}
                className="w-14 h-14 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-900"
            >
                <Phone className="w-6 h-6" />
            </a>
            <div className="flex-grow">
                <GetQuoteModal 
                    businessName={vendor.name} 
                    listingId={vendor.id}
                    listingType="vendor"
                    ownerId={vendor.owner_id}
                    triggerButton={
                        <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-lg shadow-primary/20">
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

  const { data } = await supabase.from('vendors').select('slug, city').limit(200);
  return data
    ?.filter((v: any) => v.slug && v.city)
    .map((v: any) => ({
            city: slugify(v.city),
      slug: v.slug,
    })) || [];
}
