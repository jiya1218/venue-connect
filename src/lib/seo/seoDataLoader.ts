import seoPages from '@/data/seo-pages-index.json';

export interface SEOPage {
  pageType: string;
  pageTitle: string;
  urlSlug: string;
  metaTitle: string;
  metaDescription: string;
  h1Tag: string;
  targetKeyword: string;
  secondaryKeywords: string;
  searchIntent: string;
  priority: string;
  sheet: string;
}

/**
 * Get SEO data for a URL slug
 * @param urlSlug - The URL slug (e.g., "/ahmedabad/wedding-venues/" or "ahmedabad/wedding-venues")
 * @returns SEO page data or null if not found
 */
export function getSEOPageData(urlSlug: string): SEOPage | null {
  // Normalize the slug: remove leading/trailing slashes
  const normalizedSlug = urlSlug.replace(/^\/+|\/+$/g, '');

  const pageData = (seoPages as Record<string, SEOPage>)[normalizedSlug];
  return pageData || null;
}

/**
 * Get SEO data by matching slug array segments
 * This handles various URL patterns
 */
export function getSEODataFromParsedSlug(
  categorySlug: string,
  citySlug: string,
  areaSlug?: string,
  isVendorSearch?: boolean
): SEOPage | null {
  // Try exact matches in order of specificity

  // 1. City + Area + Vendors + Category (vendor area page)
  if (areaSlug && isVendorSearch && citySlug !== 'all') {
    const slug = `${citySlug}/${areaSlug}/vendors/${categorySlug}`;
    let result = getSEOPageData(slug);
    if (result) return result;
  }

  // 2. City + Vendors + Category (vendor city page)
  if (isVendorSearch && citySlug !== 'all') {
    const slug = `${citySlug}/vendors/${categorySlug}`;
    let result = getSEOPageData(slug);
    if (result) return result;
  }

  // 3. City + Area + Category (venue area page)
  if (areaSlug && citySlug !== 'all') {
    const slug = `${citySlug}/${areaSlug}/${categorySlug}`;
    let result = getSEOPageData(slug);
    if (result) return result;
  }

  // 4. City + Category (venue city page)
  if (citySlug && citySlug !== 'all') {
    const slug = `${citySlug}/${categorySlug}`;
    let result = getSEOPageData(slug);
    if (result) return result;
  }

  // 5. Category alone (near-me pages or global pages)
  const slug = categorySlug;
  let result = getSEOPageData(slug);
  if (result) return result;

  return null;
}
