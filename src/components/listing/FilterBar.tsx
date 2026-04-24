'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const PRICE_CHIPS = [
  { value: 'budget',  label: '💰 Budget' },
  { value: 'mid',     label: '💎 Mid-range' },
  { value: 'premium', label: '✨ Premium' },
  { value: 'luxury',  label: '👑 Luxury' },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest',  label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'rating',  label: 'Highest Rated' },
];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPrice = searchParams.get('price') ?? '';
  const currentSort  = searchParams.get('sort')  ?? 'popular';
  const currentQ     = searchParams.get('q')     ?? '';

  /** Helper: merge a param update into the current URL and push */
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val) params.set(key, val);
        else params.delete(key);
      });
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const togglePrice = (val: string) => {
    updateParams({ price: currentPrice === val ? '' : val });
  };

  const hasActiveFilters = currentPrice || currentQ || currentSort !== 'popular';

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div
      className={`bg-white border border-gray-100 rounded-2xl shadow-sm p-4 transition-opacity ${
        isPending ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            defaultValue={currentQ}
            placeholder="Search venues or vendors..."
            onChange={(e) => updateParams({ q: e.target.value })}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative flex-shrink-0">
          <SlidersHorizontal
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="pl-8 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price chips */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-xs font-semibold text-gray-500 mr-1">Price:</span>
        {PRICE_CHIPS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => togglePrice(chip.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
              ${currentPrice === chip.value
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
          >
            {chip.label}
          </button>
        ))}

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Pending indicator */}
      {isPending && (
        <div className="mt-2 h-0.5 rounded-full bg-indigo-200 overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full animate-[shimmer_1s_ease-in-out_infinite]" style={{ width: '60%' }} />
        </div>
      )}
    </div>
  );
}
