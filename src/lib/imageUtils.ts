import { getEnrichedImage } from './imageEnricher';

export const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80";

/**
 * Robustly resolves the best image URL from a listing.
 * We prioritize the primary image if it exists and isn't a "null" string.
 * Variety enrichment is handled by imageEnricher.ts.
 */
export function getListingImage(listing: any, fallback: string = DEFAULT_PLACEHOLDER): string {
    return getEnrichedImage(listing);
}

/**
 * Returns a variety-based fallback URL based on a string (usually listing name).
 */
export function getVarietyFallback(name: string = ''): string {
    const hash = name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const varietyId = [
        '1519167758481-83f550bb49b3', 
        '1517457373958-b7bdd4587205', 
        '1501281668695-021443857e0e', 
        '1470225620780-dba8ba36b745',
        '1511795409834-ef04bbd61622',
        '1511285560929-80b456fea0bc'
    ][hash % 6];
    return `https://images.unsplash.com/photo-${varietyId}?w=800&q=80`;
}
