// Server Component — no directive needed

import { createClient } from "@/lib/supabase/server";
import VenueCard from "@/components/VenueCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SimilarVenuesProps {
  currentId: string;
  city: string;
  type: string;
}

export default async function SimilarVenues({ currentId, city, type }: SimilarVenuesProps) {
  const supabase = await createClient();
  
  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('city', city)
    .eq('type', type)
    .neq('id', currentId)
    .limit(3);

  if (!venues || venues.length === 0) return null;

  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-900">
          Similar venues in <span className="text-primary">{city}</span>
        </h2>
        <Link 
            href={`/${(city || 'ahmedabad').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}/${(type || 'banquet-hall').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} 
            className="flex items-center gap-2 text-primary font-bold hover:underline"
        >
          View more <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {venues.map((venue: any) => (
          <VenueCard key={venue.id} venue={{
            id: venue.id,
            name: venue.name,
            city: venue.city,
            capacity: `${venue.min_capacity || 0}-${venue.max_capacity || 0}`,
            rating: venue.rating || 0,
            reviews: venue.reviews || 0,
            image: venue.image || (venue.images && venue.images[0]) || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
            pricePerPlate: venue.veg_price_per_plate || 0,
            verified: venue.is_approved === true || venue.is_verified === true
          }} />
        ))}
      </div>
    </section>
  );
}
