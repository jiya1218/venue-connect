import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Star, ArrowRight, IndianRupee } from 'lucide-react';

export interface VenueCardProps {
  name: string;
  slug: string;
  city: string;
  area: string;
  images: string[];
  price_range: string;
  capacity?: number;
  avg_rating?: number;
  review_count?: number;
  is_verified?: boolean;
}

const PRICE_LABELS: Record<string, { label: string; color: string }> = {
  budget:  { label: 'Budget',    color: 'bg-emerald-100 text-emerald-700' },
  mid:     { label: 'Mid-range', color: 'bg-sky-100 text-sky-700' },
  premium: { label: 'Premium',   color: 'bg-violet-100 text-violet-700' },
  luxury:  { label: 'Luxury',    color: 'bg-amber-100 text-amber-700' },
};

export function VenueCard({
  name, slug, city, area, images, price_range,
  capacity, avg_rating, review_count, is_verified,
}: VenueCardProps) {
  const coverImage = images?.[0];
  const price = PRICE_LABELS[price_range] ?? { label: price_range, color: 'bg-gray-100 text-gray-600' };
  const rating = avg_rating ?? 0;
  const reviews = review_count ?? 0;

  return (
    <Link
      href={`/venues/${city?.toLowerCase()}/${slug}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full"
    >
      {/* Image */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden flex-shrink-0">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-3xl sm:text-5xl opacity-20">🏛️</span>
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {is_verified && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-emerald-500 text-white text-[8px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1 shadow-sm">
            ✓ Verified
          </span>
        )}

        <span className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-[8px] sm:text-[11px] font-semibold px-1.5 sm:px-2.5 py-0.5 rounded-full shadow-sm ${price.color}`}>
          {price.label}
        </span>

        {capacity && (
          <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
            <Users size={10} className="sm:w-[11px]" />
            {capacity.toLocaleString()} guests
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2 sm:p-4">
        <h3 className="font-bold text-gray-900 text-xs sm:text-base leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-[9px] sm:text-xs mt-1 sm:mt-1.5">
          <MapPin size={10} className="flex-shrink-0 text-indigo-400 sm:w-[11px]" />
          <span className="line-clamp-1">{area}, {city}</span>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2.5">
          {rating > 0 ? (
            <>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={10}
                    className={`${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} sm:w-[12px]`}
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
              <span className="text-[10px] sm:text-xs text-gray-400">({reviews})</span>
            </>
          ) : (
            <span className="text-[10px] sm:text-xs text-gray-400 italic">No reviews</span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-2 sm:pt-3 flex items-center justify-between border-t border-gray-100 mt-2 sm:mt-3">
          <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-gray-400 font-medium">
            <IndianRupee size={10} className="sm:w-[11px]" />
            <span>Price on enquiry</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:gap-2 transition-all">
            Details <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Skeleton loading state */
export function VenueCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-32 sm:h-48 bg-gray-200" />
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-2 sm:h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-2 sm:h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-6 sm:h-8 bg-gray-100 rounded-xl mt-2 sm:mt-4" />
      </div>
    </div>
  );
}
