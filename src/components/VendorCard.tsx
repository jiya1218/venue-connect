'use client';

import { Star, MapPin, Send, CheckCircle2, IndianRupee, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface VendorData {
    id: string;
    slug?: string;
    name: string;
    category: string;
    city: string;
    rating: number;
    reviews: number;
    startingPrice: number;
    image: string;
    featured?: boolean;
    verified?: boolean;
    owner_id?: string;
}

interface VendorCardProps {
    vendor: VendorData;
}

function slugifyCity(city?: string): string {
    return (city || '').trim().toLowerCase().replace(/\s+/g, '-');
}

const VendorCard = ({ vendor }: VendorCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const detailHref = vendor.slug
        ? `/vendors/${slugifyCity(vendor.city)}/${vendor.slug}`
        : `/vendors?city=${encodeURIComponent(vendor.city || '')}`;

    useEffect(() => {
        checkFavoriteStatus();
    }, [vendor.id]);

    const checkFavoriteStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsLoading(false);
            return;
        }

        const { data } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('vendor_id', vendor.id)
            .single();

        if (data) {
            setIsFavorite(true);
        }
        setIsLoading(false);
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to vendor page
        e.stopPropagation();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            toast.error("Please login to save favorites");
            return;
        }

        if (isFavorite) {
            // Remove from favorites
            const { error } = await supabase
                .from('user_favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('vendor_id', vendor.id);

            if (!error) {
                setIsFavorite(false);
                toast.success("Removed from favorites");
            }
        } else {
            // Add to favorites
            const { error } = await supabase
                .from('user_favorites')
                .insert({
                    user_id: user.id,
                    vendor_id: vendor.id,
                    item_type: 'vendor',
                    item_data: vendor
                });

            if (!error) {
                setIsFavorite(true);
                toast.success("Saved to favorites!");
            } else {
                toast.error("Error saving favorite");
                console.error(error);
            }
        }
    };

    return (
        <Link href={detailHref} className="block group h-full">
            <div className="bg-white rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">
                
                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    disabled={isLoading}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${isFavorite
                        ? 'bg-rose-500/90 text-white hover:bg-rose-600'
                        : 'bg-white/70 text-gray-700 hover:bg-white hover:text-rose-500'
                        }`}
                >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <div className="relative h-32 sm:h-56 overflow-hidden">
                    <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-1 sm:gap-2">
                        {vendor.featured && (
                            <span className="px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full bg-primary text-[8px] sm:text-xs font-semibold text-white">
                                Premium
                            </span>
                        )}
                        <span className="px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-[8px] sm:text-xs font-semibold text-white truncate max-w-[80px] sm:max-w-none">
                            {vendor.category}
                        </span>
                    </div>

                    {(vendor.verified || vendor.owner_id) && (
                        <div className={`absolute top-2 sm:top-3 right-8 sm:right-12 flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border ${vendor.owner_id ? 'border-amber-200' : ''}`}>
                            <CheckCircle2 className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${vendor.owner_id ? 'text-amber-500' : 'text-blue-500'}`} />
                            {vendor.owner_id && <span className="text-[7px] sm:text-[10px] font-bold text-amber-700 uppercase tracking-wider hidden sm:inline">Verified Lister</span>}
                        </div>
                    )}

                    <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1.5 rounded-full bg-foreground/80 backdrop-blur-sm text-white text-[9px] sm:text-xs font-semibold">
                        <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                        {vendor.rating} <span className="text-white/60">({vendor.reviews})</span>
                    </div>
                </div>

                <div className="p-3 sm:p-5 flex flex-col flex-grow">
                    <h3 className="font-display font-semibold text-foreground text-sm sm:text-xl leading-tight group-hover:text-primary transition-colors mb-1 sm:mb-2 line-clamp-1">
                        {vendor.name}
                    </h3>

                    <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-4 flex-grow">
                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
                            <span className="truncate">{vendor.city}</span>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                            <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
                            <span className="line-clamp-1">From <strong className="text-foreground">₹{vendor.startingPrice.toLocaleString('en-IN')}</strong></span>
                        </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary text-[10px] sm:text-xs h-7 sm:h-9">
                        <Send className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" /> Message
                    </Button>
                </div>
            </div>
        </Link>
    );
};

export default VendorCard;
