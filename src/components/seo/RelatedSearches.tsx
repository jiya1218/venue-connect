import Link from 'next/link';
import { createPublicClient as createClient } from '@/lib/supabase/public';
import { MapPin, Tag } from 'lucide-react';

interface RelatedSearchesProps {
  categorySlug: string;
  categoryName: string;
  citySlug: string;
  cityName: string;
  areaSlug?: string;
}

interface LocationRow {
  id: string;
  city: string;
  city_slug: string;
  area: string;
  area_slug: string;
  lat: number | null;
  lng: number | null;
}

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  type: string;
}

/** Haversine distance in km between two lat/lng points */
function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Server component that fetches:
 *  1. Other categories available in the same city (cross-category links)
 *  2. Same category in nearby cities (proximity sorted if lat/lng available)
 *  3. Area sub-pages within the current city for the current category
 */
export async function RelatedSearches({
  categorySlug,
  categoryName,
  citySlug,
  cityName,
  areaSlug,
}: RelatedSearchesProps) {
  const supabase = await createClient();
  if (!supabase) return null;

  // ── Fetch current city location (for lat/lng) ─────────────────────────────
  const { data: currentCity } = await supabase
    .from('locations')
    .select('id, city, city_slug, lat, lng')
    .eq('city_slug', citySlug)
    .maybeSingle();

  // ── 1. Other categories in the same city ─────────────────────────────────
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, name, slug, type')
    .order('name');

  const otherCategories = (allCategories as CategoryRow[] ?? []).filter(
    (c) => c.slug !== categorySlug
  ).slice(0, 8);

  // ── 2. Same category in nearby cities ────────────────────────────────────
  const { data: allCities } = await supabase
    .from('locations')
    .select('id, city, city_slug, lat, lng')
    .neq('city_slug', citySlug)
    .order('city');

  // Deduplicate by city_slug
  const seen = new Set<string>();
  let nearbyCities = (allCities as LocationRow[] ?? []).filter((c) => {
    if (seen.has(c.city_slug)) return false;
    seen.add(c.city_slug);
    return true;
  });

  // Sort by proximity if lat/lng available
  if (currentCity?.lat && currentCity?.lng) {
    nearbyCities = nearbyCities
      .filter((c) => c.lat && c.lng)
      .sort((a, b) => {
        const da = haversineKm(currentCity.lat!, currentCity.lng!, a.lat!, a.lng!);
        const db = haversineKm(currentCity.lat!, currentCity.lng!, b.lat!, b.lng!);
        return da - db;
      });
  }
  nearbyCities = nearbyCities.slice(0, 8);

  // ── 3. Area sub-pages in the same city ────────────────────────────────────
  const { data: areas } = await supabase
    .from('locations')
    .select('id, area, area_slug')
    .eq('city_slug', citySlug)
    .order('area');

  const areaLinks = (areas as LocationRow[] ?? [])
    .filter((a) => a.area_slug !== areaSlug && a.area_slug)
    .slice(0, 10);

  const hasAny =
    otherCategories.length > 0 || nearbyCities.length > 0 || areaLinks.length > 0;

  if (!hasAny) return null;

  return (
    <section className="bg-gray-50 border-t py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ── Section 1: Other Categories in this City ── */}
        {otherCategories.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag size={14} />
              More in {cityName}
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}-in-${citySlug}`}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  {cat.name} in {cityName}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Section 2: Same Category in Nearby Cities ── */}
        {nearbyCities.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin size={14} />
              {categoryName} in Other Cities
            </h3>
            <div className="flex flex-wrap gap-2">
              {nearbyCities.map((city) => (
                <Link
                  key={city.city_slug}
                  href={`/${categorySlug}-in-${city.city_slug}`}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  {categoryName} in {city.city}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Section 3: Area Sub-pages in Same City ── */}
        {areaLinks.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin size={14} />
              {categoryName} by Area in {cityName}
            </h3>
            <div className="flex flex-wrap gap-2">
              {areaLinks.map((area) => (
                <Link
                  key={area.area_slug}
                  href={`/${categorySlug}-in-${area.area_slug}`}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-rose-400 hover:text-rose-600 transition-colors"
                >
                  {categoryName} in {area.area}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
