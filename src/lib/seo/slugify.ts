/**
 * Converts a raw string into a URL-safe slug.
 * e.g. "Wedding Venues" → "wedding-venues"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric (except spaces & hyphens)
    .replace(/\s+/g, '-')            // replace whitespace with hyphens
    .replace(/-+/g, '-')             // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');        // strip leading/trailing hyphens
}

/**
 * Builds a canonical SEO slug combining category + location.
 * e.g. ("wedding-venues", "ahmedabad") → "wedding-venues-in-ahmedabad"
 * e.g. ("wedding-venues", "ahmedabad", "navrangpura") → "wedding-venues-in-navrangpura"
 */
export function buildSEOSlug(
  categorySlug: string,
  citySlug: string,
  areaSlug?: string,
  isVendor?: boolean
): string {
  const cSlug = slugify(categorySlug);
  const lSlug = slugify(citySlug);
  const aSlug = areaSlug ? slugify(areaSlug) : '';

  if (isVendor) {
    return aSlug ? `${lSlug}/${aSlug}/${cSlug}` : `${lSlug}/vendors/${cSlug}`;
  }
  return aSlug ? `${lSlug}/${aSlug}/${cSlug}` : `${lSlug}/${cSlug}`;
}

/**
 * Converts a slug back to a human-readable label.
 * e.g. "wedding-venues" → "Wedding Venues"
 */
export function unslugify(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
