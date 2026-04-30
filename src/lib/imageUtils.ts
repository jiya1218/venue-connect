export const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80";

/**
 * Robustly resolves the best image URL from a listing.
 * We prioritize the primary image if it exists and isn't a "null" string.
 * Variety enrichment is handled by imageEnricher.ts.
 */
export function getListingImage(listing: any, fallback: string = DEFAULT_PLACEHOLDER): string {
    if (!listing) return fallback;

    const isInvalid = (url: any) => {
        if (!url || typeof url !== 'string' || url === 'null' || url === 'undefined' || url.trim() === '') return true;
        // Basic check for common broken patterns
        if (url.includes('no-image') || url.includes('placeholder-image')) return true;
        return false;
    };

    // 1. Check primary image
    if (!isInvalid(listing.image)) return listing.image;

    // 2. Check gallery fallbacks
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
        const firstGallery = listing.images.find(img => !isInvalid(img));
        if (firstGallery) return firstGallery;
    }

    // 3. Last resort: Return a deterministic variety fallback if listing has a name
    if (listing.name) {
        const hash = listing.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const varietyId = ['1519167758481-83f550bb49b3', '1517457373958-b7bdd4587205', '1523585322415-3843e914364c', '1470225620780-dba8ba36b745'][hash % 4];
        return `https://images.unsplash.com/photo-${varietyId}?w=800&q=80`;
    }

    return fallback;
}

/**
 * Returns a variety-based fallback URL based on a string (usually listing name).
 */
export function getVarietyFallback(name: string = ''): string {
    const hash = name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const varietyId = [
        '1519167758481-83f550bb49b3', 
        '1517457373958-b7bdd4587205', 
        '1523585322415-3843e914364c', 
        '1470225620780-dba8ba36b745',
        '1511795409834-ef04bbd61622',
        '1511285560929-80b456fea0bc'
    ][hash % 6];
    return `https://images.unsplash.com/photo-${varietyId}?w=800&q=80`;
}
