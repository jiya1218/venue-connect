import { z } from 'zod';

const indianPhone = z
  .string()
  .regex(/^\+91[6-9]\d{9}$/, 'Enter valid Indian mobile (+91XXXXXXXXXX)');

// ─── VENUE SCHEMAS ────────────────────────────────────────────────────────────

export const venueStep1Schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category_id: z.string().uuid('Please select a category'),
  city_id: z.string().uuid('Please select a city'),
  area_id: z.string().uuid('Please select an area'),
  price_range: z.enum(['budget', 'mid', 'premium', 'luxury'], {
    required_error: 'Please select a price range',
  }),
  capacity: z
    .number({ invalid_type_error: 'Enter a valid number' })
    .min(10, 'Minimum capacity is 10')
    .max(10000, 'Maximum capacity is 10,000')
    .optional(),
});

export const venueStep2Schema = z.object({
  description: z.string().min(100, 'Description must be at least 100 characters'),
  amenities: z.array(z.string()).optional(),
  contact_name: z.string().min(2, 'Contact name required'),
  contact_phone: indianPhone,
  contact_email: z.string().email('Enter a valid email'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

export const venueStep3Schema = z.object({
  images: z
    .array(z.string().url())
    .min(1, 'Upload at least 1 image')
    .max(10, 'Maximum 10 images allowed'),
});

export const venueFormSchema = venueStep1Schema
  .merge(venueStep2Schema)
  .merge(venueStep3Schema);

export type VenueStep1 = z.infer<typeof venueStep1Schema>;
export type VenueStep2 = z.infer<typeof venueStep2Schema>;
export type VenueStep3 = z.infer<typeof venueStep3Schema>;
export type VenueFormData = z.infer<typeof venueFormSchema>;

// ─── VENDOR SCHEMAS ───────────────────────────────────────────────────────────

export const vendorStep1Schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category_id: z.string().uuid('Please select a category'),
  city_id: z.string().uuid('Please select a city'),
  area_id: z.string().uuid('Please select an area'),
  price_range: z.enum(['budget', 'mid', 'premium', 'luxury'], {
    required_error: 'Please select a price range',
  }),
  experience_years: z
    .number({ invalid_type_error: 'Enter a valid number' })
    .min(0, 'Cannot be negative')
    .max(50, 'Maximum 50 years')
    .optional(),
});

export const vendorStep2Schema = z.object({
  description: z.string().min(100, 'Description must be at least 100 characters'),
  specialities: z.array(z.string()).optional(),
  contact_name: z.string().min(2, 'Contact name required'),
  contact_phone: indianPhone,
  contact_email: z.string().email('Enter a valid email'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

export const vendorStep3Schema = z.object({
  images: z
    .array(z.string().url())
    .min(1, 'Upload at least 1 image')
    .max(10, 'Maximum 10 images allowed'),
});

export const vendorFormSchema = vendorStep1Schema
  .merge(vendorStep2Schema)
  .merge(vendorStep3Schema);

export type VendorStep1 = z.infer<typeof vendorStep1Schema>;
export type VendorStep2 = z.infer<typeof vendorStep2Schema>;
export type VendorStep3 = z.infer<typeof vendorStep3Schema>;
export type VendorFormData = z.infer<typeof vendorFormSchema>;

// ─── Shared ───────────────────────────────────────────────────────────────────

export const PRICE_RANGE_OPTIONS = [
  { value: 'budget', label: '💰 Budget', sublabel: 'Under ₹50,000' },
  { value: 'mid', label: '💎 Mid-range', sublabel: '₹50K – ₹2L' },
  { value: 'premium', label: '✨ Premium', sublabel: '₹2L – ₹5L' },
  { value: 'luxury', label: '👑 Luxury', sublabel: '₹5L+' },
] as const;

export const VENUE_AMENITIES = [
  'Air Conditioning', 'Parking', 'WiFi', 'Catering', 'DJ / Sound System',
  'Projector / AV', 'Decoration', 'Valet Parking', 'Swimming Pool',
  'Outdoor Space', 'Green Room', 'Bar / Beverage', 'Bridal Suite', 'Generator Backup',
];
