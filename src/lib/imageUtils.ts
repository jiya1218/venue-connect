export const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";

/**
 * Robustly resolves the best image URL from a listing,
 * handling "null" strings, empty values, and gallery fallbacks.
 * Also detects generic placeholders and ensures variety.
 */
export function getListingImage(listing: any, fallback: string = DEFAULT_PLACEHOLDER): string {
    if (!listing) return fallback;

    const placeholderIds = [
        '1519167758481-83f550bb49b3', '1555244162-803834f70033', '1519225421980-715cb0215aed',
        '1537633552985-df8429e8048b', '1511285560929-80b456fea0bc', '1505373877841-825f7d46678',
        '1487412720507-e7ab37603c6f', '1610173827002-62c0f1f05d04', '1516280440614-37939bbacd81'
    ];

    const isInvalid = (url: any) => {
        if (!url || typeof url !== 'string' || url === 'null' || url === 'undefined' || url.trim() === '') return true;
        // If it's a common generic placeholder, treat as invalid to trigger variety/fallback
        if (placeholderIds.some(id => url.includes(id))) return true;
        return false;
    };

    // Check primary image
    if (!isInvalid(listing.image)) return listing.image;

    // Check gallery fallback
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
        const firstGallery = listing.images[0];
        if (!isInvalid(firstGallery)) return firstGallery;
    }

    return fallback;
}
