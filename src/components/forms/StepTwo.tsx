'use client';

import { UseFormReturn } from 'react-hook-form';
import { useState, KeyboardEvent } from 'react';
import { User, Phone, Mail, Globe, X } from 'lucide-react';
import { VENUE_AMENITIES } from '@/lib/forms/schemas';

interface Props {
  form: UseFormReturn<any>;
  type: 'venue' | 'vendor';
}

export function StepTwo({ form, type }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const description = watch('description') ?? '';
  const amenities: string[] = watch('amenities') ?? [];
  const specialities: string[] = watch('specialities') ?? [];

  // Tag input state for vendor specialities
  const [tagInput, setTagInput] = useState('');

  const toggleAmenity = (item: string) => {
    const current: string[] = form.getValues('amenities') ?? [];
    if (current.includes(item)) {
      setValue('amenities', current.filter((a) => a !== item));
    } else {
      setValue('amenities', [...current, item]);
    }
  };

  const addTag = () => {
    const val = tagInput.trim();
    if (!val) return;
    const current: string[] = form.getValues('specialities') ?? [];
    if (!current.includes(val)) {
      setValue('specialities', [...current, val]);
    }
    setTagInput('');
  };

  const handleTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => {
    const current: string[] = form.getValues('specialities') ?? [];
    setValue('specialities', current.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs font-mono ${description.length >= 100 ? 'text-emerald-500' : 'text-gray-400'}`}>
            {description.length} / 100 min
          </span>
        </div>
        <textarea
          {...register('description')}
          rows={5}
          placeholder={
            type === 'venue'
              ? 'Describe your venue — ambiance, specialty, what makes it unique...'
              : 'Describe your services — style, approach, past work...'
          }
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white resize-none"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{String(errors.description.message)}</p>
        )}
      </div>

      {/* Amenities (venue) */}
      {type === 'venue' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amenities & Features
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {VENUE_AMENITIES.map((item) => (
              <label
                key={item}
                className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition-all
                  ${amenities.includes(item)
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-medium'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-200'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(item)}
                  onChange={() => toggleAmenity(item)}
                  className="accent-indigo-600"
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Specialities (vendor tag input) */}
      {type === 'vendor' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Specialities <span className="text-gray-400 font-normal">(press Enter or comma to add)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {specialities.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKey}
            onBlur={addTag}
            placeholder="e.g. Candid Photography, Drone Shoots..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
          />
        </div>
      )}

      {/* Contact Fields */}
      <div className="border-t border-gray-100 pt-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Contact Information</h3>
        <div className="space-y-4">
          {/* Contact Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                {...register('contact_name')}
                placeholder="Full name"
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              />
            </div>
            {errors.contact_name && (
              <p className="text-red-500 text-xs mt-1">{String(errors.contact_name.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                WhatsApp / Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  {...register('contact_phone')}
                  placeholder="+91XXXXXXXXXX"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                />
              </div>
              {errors.contact_phone && (
                <p className="text-red-500 text-xs mt-1">{String(errors.contact_phone.message)}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  {...register('contact_email')}
                  placeholder="you@example.com"
                  type="email"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                />
              </div>
              {errors.contact_email && (
                <p className="text-red-500 text-xs mt-1">{String(errors.contact_email.message)}</p>
              )}
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Website <span className="text-gray-400">(optional)</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                {...register('website')}
                placeholder="https://yourwebsite.com"
                type="url"
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              />
            </div>
            {errors.website && (
              <p className="text-red-500 text-xs mt-1">{String(errors.website.message)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
