import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Eye, Edit, Store, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function MyListings() {
    const [venues, setVenues] = useState<Record<string, unknown>[]>([]);
    const [vendors, setVendors] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch Venues
            const { data: venuesData, error: venuesError } = await supabase
                .from('venues')
                .select('*')
                .eq('owner_id', user.id);

            if (venuesError) throw venuesError;
            setVenues(venuesData || []);

            // Fetch Vendors
            const { data: vendorsData, error: vendorsError } = await supabase
                .from('vendors')
                .select('*')
                .eq('owner_id', user.id);

            if (vendorsError) throw vendorsError;
            setVendors(vendorsData || []);

        } catch (error) {
            console.error("Error fetching listings:", error);
            toast.error("Failed to load listings");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;
    }

    const hasNoListings = venues.length === 0 && vendors.length === 0;

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">My Listings</h2>
                    <p className="text-sm text-slate-500">Manage your active venues and vendor profiles.</p>
                </div>
                <Link href="/list-venue">
                    <Button>Add New Listing</Button>
                </Link>
            </div>

            {hasNoListings && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                        <Store className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-slate-900 mb-2">No listings yet</h3>
                    <p className="text-slate-500 max-w-sm mb-6">List your business or vendor services to start receiving leads from customers.</p>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white font-medium shadow-md transition-all">
                        <Link href="/list-venue" className="gap-2 flex items-center">
                            <Building className="w-4 h-4"/> Create Your First Listing
                        </Link>
                    </Button>
                </div>
            )}

            {venues.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Building className="w-5 h-5 text-primary" /> My Venues
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {venues.map((venue, index) => (
                            <ListingCard key={String(venue.id) || index} data={venue} type="venue" />
                        ))}
                    </div>
                </div>
            )}

            {vendors.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2 mt-8">
                        <Store className="w-5 h-5 text-primary" /> My Vendor Services
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {vendors.map((vendor, index) => (
                            <ListingCard key={String(vendor.id) || index} data={vendor} type="vendor" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ListingCard({ data, type }: { data: Record<string, unknown>, type: 'venue'|'vendor' }) {
    // Assert properties as strings/arrays safely for rendering
    const name = data.name as string;
    const city = data.city as string;
    const id = data.id as string;
    const rating = data.rating as string | number;
    const images = data.images as string[];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="h-40 bg-slate-100 relative group overflow-hidden">
                {images && images.length > 0 ? (
                    <img src={images[0]} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">No Image</div>
                )}
                <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold uppercase tracking-wider rounded-md text-slate-700 shadow-sm">
                        {type}
                    </span>
                </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">{name}</h4>
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
                    <MapPin className="w-3.5 h-3.5" /> {city}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mt-auto text-sm">
                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                        <span className="block text-xs text-slate-500 mb-0.5">Rating</span>
                        <span className="font-semibold text-slate-900">{rating || 'New'}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                        <span className="block text-xs text-slate-500 mb-0.5">Views</span>
                        <span className="font-semibold text-slate-900">--</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 p-3 bg-slate-50/50 flex items-center justify-between gap-2">
                <Button variant="outline" size="sm" className="w-full bg-white gap-2 text-slate-600 hover:text-slate-900">
                    <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
                <Link href={`/${type}s/${id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full bg-white gap-2 text-slate-600 hover:text-primary hover:border-primary/30">
                        <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                </Link>
            </div>
        </div>
    );
}
