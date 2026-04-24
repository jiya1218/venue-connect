'use client';

import { Star, Users, MapPin, Send, CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import GetQuoteModal from "./GetQuoteModal";

export interface VenueData {
    id: string;
    slug?: string;
    name: string;
    city: string;
    area?: string;
    capacity: string;
    rating: number;
    reviews: number;
    image: string;
    featured?: boolean;
    verified?: boolean;
    amenities?: string[];
    venueType?: string;
    pricePerPlate?: number;
    owner_id?: string;
}

interface VenueCardProps {
    venue: VenueData;
}

function slugifyCity(city?: string): string {
    return (city || '').trim().toLowerCase().replace(/\s+/g, '-');
}

const VenueCard = ({ venue }: VenueCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const detailHref = venue.slug
        ? `/${slugifyCity(venue.city)}/${venue.slug}`
        : `/${slugifyCity(venue.city)}`;

    useEffect(() => {
        checkFavoriteStatus();
    }, [venue.id]);

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
            .eq('venue_id', venue.id)
            .single();

        if (data) {
            setIsFavorite(true);
        }
        setIsLoading(false);
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to venue page
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
                .eq('venue_id', venue.id);

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
                    venue_id: venue.id,
                    item_type: 'venue',
                    item_data: venue
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
        <div className="bg-white rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col relative group">
            <Link href={detailHref} className="block relative">
                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    disabled={isLoading}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isFavorite
                        ? 'bg-rose-500/90 text-white hover:bg-rose-600'
                        : 'bg-white/70 text-gray-700 hover:bg-white hover:text-rose-500'
                        }`}
                >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <div className="relative h-32 sm:h-56 overflow-hidden">
                    <img
                        src={venue.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'}
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {venue.featured && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary text-[8px] sm:text-xs font-semibold text-white z-10">
                            Featured
                        </span>
                    )}
                    {(venue.verified || venue.owner_id) && (
                        <div className={`absolute top-8 sm:top-12 right-2 sm:right-3 flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-sm z-10 border ${venue.owner_id ? 'border-amber-200 shadow-sm' : ''}`}>
                            <CheckCircle2 className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${venue.owner_id ? 'text-amber-500' : 'text-green-600'}`} />
                            <span className={`text-[7px] sm:text-[10px] font-medium uppercase tracking-wider ${venue.owner_id ? 'text-amber-700 font-bold' : 'text-foreground'}`}>
                                {venue.owner_id ? 'Lister' : 'Verified'}
                            </span>
                        </div>
                    )}
                    <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-foreground/80 backdrop-blur-sm text-white text-[9px] sm:text-xs font-semibold z-10">
                        <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                        {venue.rating} <span className="text-white/60">({venue.reviews})</span>
                    </div>
                </div>
            </Link>

            <div className="p-3 sm:p-5 flex flex-col flex-grow relative overflow-hidden bg-white">
                <Link href={detailHref}  className="block hover:text-primary transition-colors">
                    <h3 className="font-display font-semibold text-foreground text-sm sm:text-xl leading-tight mb-1 sm:mb-2 z-10 relative truncate">
                        {venue.name}
                    </h3>

                    <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-4">
                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
                            <span className="truncate">{venue.area ? `${venue.area}, ` : ""}{venue.city}</span>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
                            <span className="line-clamp-1">{venue.capacity} Guests</span>
                        </div>
                    </div>
                </Link>

                <div className="mt-auto pt-1 sm:pt-2 space-y-2 sm:space-y-3">
                    {/* The GetQuoteModal CTA is always visible on mobile, and part of the card on desktop */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <GetQuoteModal 
                            businessName={venue.name}
                            listingId={venue.id}
                            listingType="venue"
                            ownerId={venue.owner_id}
                            triggerButton={
                                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-3 sm:py-6 text-[10px] sm:text-sm shadow-md transition-transform active:scale-[0.98] h-auto">
                                    GET FREE QUOTES
                                </Button>
                            }
                        />
                    </div>

                    <div className="hidden sm:flex items-center justify-center gap-2 text-[11px] sm:text-xs text-blue-500 font-semibold uppercase tracking-wider">
                        <Link href={`${detailHref}#amenities`} className="hover:text-blue-700 transition-colors">Amenities</Link>
                        <span className="text-gray-300">|</span>
                        <Link href={`${detailHref}#about`} className="hover:text-blue-700 transition-colors">Best For</Link>
                        <span className="text-gray-300">|</span>
                        <Link href={`${detailHref}#photos`} className="hover:text-blue-700 transition-colors">Photos</Link>
                        <span className="text-gray-300">|</span>
                        <Link href={`${detailHref}#reviews`} className="hover:text-blue-700 transition-colors">Reviews</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueCard;
