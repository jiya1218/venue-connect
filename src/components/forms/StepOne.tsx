'use client';

import { UseFormReturn, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { VenueStep1, PRICE_RANGE_OPTIONS } from '@/lib/forms/schemas';
import { slugify } from '@/lib/seo/slugify';
import { Building2, ChevronDown } from 'lucide-react';

interface Category { id: string; name: string; slug: string }
interface City { id: string; city: string; city_slug: string }
interface Area { id: string; area: string; area_slug: string }

interface Props {
  form: UseFormReturn<any>;
  type: 'venue' | 'vendor';
}

export function StepOne({ form, type }: Props) {
  const { register, watch, control, formState: { errors } } = form;
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const name = watch('name') ?? '';
  const cityId = watch('city_id');
  const slugPreview = name ? slugify(name) : '';

  // Fetch categories + cities on mount
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase
      .from('categories')
      .select('id, name, slug')
      .eq('type', type)
      .order('name')
      .then(({ data }) => setCategories(data ?? []));

    supabase
      .from('locations')
      .select('id, city, city_slug')
      .order('city')
      .then(({ data }) => {
        // Deduplicate cities
        const seen = new Set<string>();
        const unique = (data ?? []).filter((r: City) => {
          if (seen.has(r.city_slug)) return false;
          seen.add(r.city_slug);
          return true;
        });
        setCities(unique);
      });
  }, [type]);

  // Dynamic area loading when city changes
  useEffect(() => {
    if (!cityId) { setAreas([]); return; }
    const supabase = createClient();
    if (!supabase) return;

    setLoadingAreas(true);
    // Find city_slug from selected city UUID
    const city = cities.find((c) => c.id === cityId);
    if (!city) { setLoadingAreas(false); return; }

    supabase
      .from('locations')
      .select('id, area, area_slug')
      .eq('city_slug', city.city_slug)
      .order('area')
      .then(({ data }) => {
        setAreas(data ?? []);
        setLoadingAreas(false);
      });
  }, [cityId, cities]);

  return (
    <div className="space-y-6">
      {/* Name + Slug Preview */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {type === 'venue' ? 'Venue Name' : 'Business Name'} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            {...register('name')}
            placeholder={type === 'venue' ? 'e.g. The Grand Palace' : 'e.g. Raj Photography'}
            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1">{String(errors.name.message)}</p>}
        {slugPreview && (
          <p className="text-xs text-gray-400 mt-1.5 font-mono">
            🔗 venueconnect.in/{type}s/<span className="text-indigo-500">{slugPreview}</span>
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            {...register('category_id')}
            className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white appearance-none"
          >
            <option value="">Select a category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
        {errors.category_id && <p className="text-red-500 text-xs mt-1">{String(errors.category_id.message)}</p>}
      </div>

      {/* City + Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register('city_id')}
              className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white appearance-none"
            >
              <option value="">Select city...</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.city}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          {errors.city_id && <p className="text-red-500 text-xs mt-1">{String(errors.city_id.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Area <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register('area_id')}
              disabled={!cityId || loadingAreas}
              className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{loadingAreas ? 'Loading...' : 'Select area...'}</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.area}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          {errors.area_id && <p className="text-red-500 text-xs mt-1">{String(errors.area_id.message)}</p>}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Price Range <span className="text-red-500">*</span>
        </label>
        <Controller
          name="price_range"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRICE_RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 text-center transition-all text-sm cursor-pointer
                    ${field.value === opt.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-200'
                    }`}
                >
                  <span className="text-xl mb-1">{opt.label.split(' ')[0]}</span>
                  <span className="font-semibold">{opt.label.split(' ').slice(1).join(' ')}</span>
                  <span className="text-xs text-gray-400">{opt.sublabel}</span>
                </button>
              ))}
            </div>
          )}
        />
        {errors.price_range && <p className="text-red-500 text-xs mt-1">{String(errors.price_range.message)}</p>}
      </div>

      {/* Capacity (venues) / Experience Years (vendors) */}
      {type === 'venue' ? (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Capacity (guests)
          </label>
          <input
            type="number"
            {...register('capacity', { valueAsNumber: true })}
            placeholder="e.g. 500"
            min={10}
            max={10000}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
          />
          {errors.capacity && <p className="text-red-500 text-xs mt-1">{String(errors.capacity.message)}</p>}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Years of Experience
          </label>
          <input
            type="number"
            {...register('experience_years', { valueAsNumber: true })}
            placeholder="e.g. 5"
            min={0}
            max={50}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
          />
          {errors.experience_years && <p className="text-red-500 text-xs mt-1">{String(errors.experience_years.message)}</p>}
        </div>
      )}
    </div>
  );
}
