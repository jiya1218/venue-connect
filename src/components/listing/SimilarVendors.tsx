import { createClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import VendorCard from "@/components/VendorCard";

interface SimilarVendorsProps {
  currentId: string;
  city: string;
  category: string;
}

export default async function SimilarVendors({ currentId, city, category }: SimilarVendorsProps) {
  const supabase = await createClient();
  
  const { data: vendors } = await supabase
    .from('vendors')
    .select('*')
    .eq('city', city)
    .eq('category', category)
    .neq('id', currentId)
    .limit(3);

  if (!vendors || vendors.length === 0) return null;

  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-900">
          Other <span className="text-primary">{category}</span> in <span className="text-primary">{city}</span>
        </h2>
        <Link 
            href={`/${(city || 'ahmedabad').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}/vendors/${(category || 'photographers').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} 
            className="flex items-center gap-2 text-primary font-bold hover:underline"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {vendors.map((vendor: any) => (
          <VendorCard key={vendor.id} vendor={{
            id: vendor.id,
            slug: vendor.slug,
            name: vendor.name,
            city: vendor.city,
            category: vendor.category,
            rating: vendor.rating,
            reviews: vendor.reviews,
            image: vendor.image || (vendor.images && vendor.images[0]) || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
            startingPrice: vendor.starting_price,
            verified: vendor.is_approved === true || vendor.is_verified === true
          }} />
        ))}
      </div>
    </section>
  );
}