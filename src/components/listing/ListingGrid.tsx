'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Building2, Sparkles, Phone } from 'lucide-react';
import Link from 'next/link';
import { VenueCard, VenueCardSkeleton, type VenueCardProps } from './VenueCard';
import { VendorCard, VendorCardSkeleton, type VendorCardProps } from './VendorCard';

interface ListingGridProps {
  venues: VenueCardProps[];
  vendors: VendorCardProps[];
  loading?: boolean;
  /** Current page slug for "list here" CTA links */
  locationLabel?: string;
  categoryLabel?: string;
}

type SortKey = 'popular' | 'newest' | 'price_asc' | 'rating';

const PRICE_ORDER = ['budget', 'mid', 'premium', 'luxury'];

function sortItems<T extends { avg_rating?: number; price_range: string }>(
  items: T[],
  sort: SortKey
): T[] {
  return [...items].sort((a, b) => {
    switch (sort) {
      case 'rating':
        return (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
      case 'price_asc':
        return PRICE_ORDER.indexOf(a.price_range) - PRICE_ORDER.indexOf(b.price_range);
      default:
        return 0; // server-side ordering for popular/newest
    }
  });
}

export function ListingGrid({
  venues,
  vendors,
  loading = false,
  locationLabel = 'this area',
  categoryLabel = 'services',
}: ListingGridProps) {
  const searchParams = useSearchParams();
  const priceFilter = searchParams.get('price') ?? '';
  const sortKey     = (searchParams.get('sort') ?? 'popular') as SortKey;
  const query       = (searchParams.get('q') ?? '').toLowerCase();

  // ── Client-side filtering ────────────────────────────────────────────────
  const filteredVenues = useMemo(() => {
    let items = venues;
    if (priceFilter) items = items.filter((v) => v.price_range === priceFilter);
    if (query) items = items.filter((v) =>
      v.name.toLowerCase().includes(query) ||
      v.city.toLowerCase().includes(query) ||
      v.area.toLowerCase().includes(query)
    );
    return sortItems(items, sortKey);
  }, [venues, priceFilter, query, sortKey]);

  const filteredVendors = useMemo(() => {
    let items = vendors;
    if (priceFilter) items = items.filter((v) => v.price_range === priceFilter);
    if (query) items = items.filter((v) =>
      v.name.toLowerCase().includes(query) ||
      v.city.toLowerCase().includes(query) ||
      v.area.toLowerCase().includes(query) ||
      (v.category ?? '').toLowerCase().includes(query)
    );
    return sortItems(items, sortKey);
  }, [vendors, priceFilter, query, sortKey]);

  const totalCount = filteredVenues.length + filteredVendors.length;

  // Loading skeletons
  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonSection count={6} />
        <SkeletonSection count={4} />
      </div>
    );
  }

  // Empty state — no results at all 
  if (!loading && totalCount === 0) {
    return (
      <EmptyState
        hasFilters={!!(priceFilter || query)}
        locationLabel={locationLabel}
        categoryLabel={categoryLabel}
      />
    );
  }

  return (
    <div className="space-y-12">
      {/* ── Venues Section ── */}
      {filteredVenues.length > 0 && (
        <section>
          <SectionHeader
            icon={<Building2 size={18} className="text-indigo-500" />}
            title="Venues"
            count={filteredVenues.length}
            accentColor="text-indigo-600"
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredVenues.map((v) => (
              <VenueCard key={v.slug} {...v} />
            ))}
          </div>
        </section>
      )}

      {/* ── Vendors / Service Providers Section ── */}
      {filteredVendors.length > 0 && (
        <section>
          <SectionHeader
            icon={<Phone size={18} className="text-rose-500" />}
            title="Service Providers"
            count={filteredVendors.length}
            accentColor="text-rose-600"
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredVendors.map((v) => (
              <VendorCard key={v.slug} {...v} />
            ))}
          </div>
        </section>
      )}

      {/* Filtered-away notice */}
      {totalCount === 0 && (priceFilter || query) && (
        <p className="text-center text-sm text-gray-400 py-4">
          No results match your current filters.{' '}
          <button
            onClick={() => window.history.replaceState(null, '', window.location.pathname)}
            className="text-indigo-500 underline"
          >
            Clear filters
          </button>
        </p>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({
  icon, title, count, accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  accentColor: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className={`text-xl font-bold text-gray-800`}>
          {title}
        </h2>
        <span className={`text-sm font-semibold ${accentColor} bg-current/10 px-2 py-0.5 rounded-full`}
          style={{ backgroundColor: 'currentColor', opacity: 1 }}>
          <span className="bg-white rounded-full px-2 py-0.5">{count}</span>
        </span>
      </div>
    </div>
  );
}

function EmptyState({
  hasFilters,
  locationLabel,
  categoryLabel,
}: {
  hasFilters: boolean;
  locationLabel: string;
  categoryLabel: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
        <Sparkles size={36} className="text-indigo-400" />
      </div>

      {hasFilters ? (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No results found</h2>
          <p className="text-gray-500 mb-6 text-sm max-w-sm">
            Try adjusting your filters or search term to find more {categoryLabel}.
          </p>
          <button
            onClick={() => window.history.replaceState(null, '', window.location.pathname)}
            className="bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-colors"
          >
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Be the first to list here!
          </h2>
          <p className="text-gray-500 max-w-md mb-8 text-sm">
            No {categoryLabel} are listed in {locationLabel} yet. Register your business
            now and reach thousands of potential customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/list-your-venue"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow"
            >
              <Building2 size={16} /> List Your Venue
            </Link>
            <Link
              href="/list-your-service"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-xl border border-indigo-200 text-sm hover:bg-indigo-50 transition-colors"
            >
              <Phone size={16} /> List Your Service
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function SkeletonSection({ count }: { count: number }) {
  return (
    <div>
      <div className="h-7 bg-gray-200 rounded-lg w-40 mb-5 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <VenueCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
