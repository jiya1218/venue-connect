'use client';

import { UseFormReturn } from 'react-hook-form';
import { ImageUpload } from './ImageUpload';

interface Props {
  form: UseFormReturn<any>;
  type: 'venue' | 'vendor';
}

export function StepThree({ form, type }: Props) {
  const { setValue, watch, formState: { errors } } = form;
  const images: string[] = watch('images') ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          {type === 'venue' ? 'Venue Photos' : 'Portfolio / Work Samples'}{' '}
          <span className="text-red-500">*</span>
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Upload up to 10 high-quality photos. First image will be the cover.
          Supported formats: JPG, PNG, WebP. Max 5MB each.
        </p>

        <ImageUpload
          bucket={type === 'venue' ? 'venue-images' : 'vendor-images'}
          maxFiles={10}
          value={images}
          onChange={(urls) => setValue('images', urls, { shouldValidate: true })}
        />

        {errors.images && (
          <p className="text-red-500 text-xs mt-2">{String(errors.images.message)}</p>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-indigo-700 mb-2">📸 Photo Tips</h4>
        <ul className="text-xs text-indigo-600 space-y-1 list-disc list-inside">
          <li>Use bright, well-lit photos for best results</li>
          <li>Show different angles and areas of your {type === 'venue' ? 'venue' : 'work'}</li>
          <li>Include at least one landscape/wide shot as the cover</li>
          <li>Avoid blurry or dark images — they reduce inquiries</li>
        </ul>
      </div>
    </div>
  );
}
