# Venue Slug to Database Type Mapping Reference

This document shows the exact mapping used in the code to convert URL slugs to database venue types.

## Location in Code
File: `/src/app/(seo)/[...slug]/page.tsx`
Lines: 821-908

## Complete Mapping

### Venue Types (Basic)
```
'banquet-halls'           → Banquet Hall
'banquet-hall'            → Banquet Hall
'farmhouse'               → Farmhouse
'farmhouses'              → Farmhouse
'hotels'                  → Hotel
'hotel'                   → Hotel
'resorts'                 → Resort
'resort'                  → Resort
'party-plots'             → Party Plot
'party-plot'              → Party Plot
'lawn'                    → Lawn, Farmhouse
'lawns'                   → Lawn, Farmhouse
'convention-centre'       → Convention Center
'convention-centers'      → Convention Center
```

### Wedding & Ceremony Events
```
'wedding-venues'                      → Banquet Hall, Heritage Venue, Convention Center, Boutique Venue, Resort, Hotel, Farmhouse
'wedding-venue'                       → Banquet Hall, Heritage Venue, Convention Center, Boutique Venue, Resort, Hotel, Farmhouse
'engagement-venues'                   → Banquet Hall, Resort, Hotel, Heritage Venue
'reception-venues'                    → Banquet Hall, Resort, Hotel, Heritage Venue
'sangeet-ceremony-venues'             → Banquet Hall, Resort, Hotel, Heritage Venue, Farmhouse
'mehndi-ceremony-venues'              → Banquet Hall, Resort, Hotel, Heritage Venue, Farmhouse
'haldi-ceremony-venues'               → Banquet Hall, Resort, Hotel, Heritage Venue, Farmhouse
'ring-ceremony-venues'                → Banquet Hall, Resort, Hotel
'pre-wedding-mehendi-party-venues'    → Banquet Hall, Resort, Hotel, Farmhouse
'bridal-shower-venues'                → Banquet Hall, Resort, Hotel
```

### Birthday & Kid Events
```
'birthday-party-venues'               → Banquet Hall, Party Plot, Convention Center
'kids-birthday-party-venues'          → Banquet Hall, Party Plot, Convention Center
'first-birthday-party-venues'         → Banquet Hall, Party Plot
'childrens-party-venues'              → Banquet Hall, Party Plot, Convention Center
```

### Corporate & Business Events
```
'corporate-event-venues'              → Banquet Hall, Convention Center, Hotel
'corporate-party-venues'              → Banquet Hall, Convention Center, Hotel, Party Plot
'corporate-offsite-venues'            → Banquet Hall, Convention Center, Hotel, Resort, Farmhouse
'corporate-training-venues'           → Banquet Hall, Convention Center, Hotel
'product-launch-venues'               → Banquet Hall, Convention Center, Hotel
'conference-venues'                   → Convention Center, Banquet Hall, Hotel
'seminar-venues'                      → Convention Center, Banquet Hall, Hotel
'meeting-venues'                      → Convention Center, Banquet Hall, Hotel
'training-venues'                     → Convention Center, Banquet Hall, Hotel
'walkin-interview-venues'             → Banquet Hall, Convention Center, Hotel
'business-dinner-venues'              → Banquet Hall, Resort, Hotel
'award-ceremony-venues'               → Banquet Hall, Convention Center, Hotel
'stage-event-venues'                  → Convention Center, Banquet Hall, Hotel
'exhibition-venues'                   → Convention Center, Banquet Hall, Hotel
'fashion-show-venues'                 → Convention Center, Banquet Hall, Hotel
'musical-concert-venues'              → Convention Center, Banquet Hall, Hotel
'team-outing-venues'                  → Banquet Hall, Resort, Farmhouse, Hotel
'mice-venues'                         → Convention Center, Banquet Hall, Hotel, Resort
'residential-conference-venues'       → Banquet Hall, Convention Center, Hotel
```

### Family & Social Events
```
'baby-shower-venues'                  → Banquet Hall, Party Plot, Hotel
'naming-ceremony-venues'              → Banquet Hall, Hotel, Party Plot
'aqueeqa-ceremony-venues'             → Banquet Hall, Hotel, Party Plot
'christian-communion-venues'          → Banquet Hall, Hotel, Heritage Venue
'family-function-venues'              → Banquet Hall, Party Plot, Hotel, Farmhouse
'anniversary-party-venues'            → Banquet Hall, Party Plot, Hotel, Resort
'farewell-party-venues'               → Banquet Hall, Party Plot, Hotel, Convention Center
'reunion-party-venues'                → Banquet Hall, Party Plot, Hotel, Convention Center
'class-reunion-venues'                → Banquet Hall, Party Plot, Hotel, Convention Center
'get-together-venues'                 → Banquet Hall, Party Plot, Hotel
```

### Party & Celebration Events
```
'pool-party-venues'                   → Resort, Hotel, Party Plot, Banquet Hall, Farmhouse
'kitty-party-venues'                  → Banquet Hall, Party Plot, Hotel
'cocktail-party-venues'               → Banquet Hall, Hotel, Resort, Party Plot
'cocktail-dinner-venues'              → Banquet Hall, Hotel, Resort
'garba-night-venues'                  → Banquet Hall, Party Plot, Convention Center, Farmhouse
'holi-party-venues'                   → Banquet Hall, Party Plot, Hotel
'freshers-party-venues'               → Banquet Hall, Party Plot, Convention Center
'bachelor-party-venues'               → Banquet Hall, Party Plot, Hotel, Resort
'adventure-party-venues'              → Resort, Farmhouse, Hotel
'group-dining-venues'                 → Banquet Hall, Hotel, Resort
'game-watch-venues'                   → Banquet Hall, Party Plot, Hotel
```

### Photo & Media Events
```
'photo-shoots-venues'                 → Banquet Hall, Hotel, Heritage Venue, Resort, Farmhouse
```

### Miscellaneous
```
'brand-promotion-venues'              → Convention Center, Banquet Hall, Hotel
'annual-fest-venues'                  → Convention Center, Banquet Hall, Hotel, Party Plot
```

## How the Mapping Works

1. **URL Parsing**: When user visits `/birthday-party-venues` or `/ahmedabad/birthday-party-venues`
2. **Slug Recognition**: Router extracts `birthday-party-venues` as the category slug
3. **Mapping Lookup**: Code looks up this slug in `VENUE_SLUG_TO_TYPES`
4. **Type Retrieval**: Gets array: `['Banquet Hall', 'Party Plot', 'Convention Center']`
5. **Database Query**: Executes: `SELECT * FROM venues WHERE type IN ('Banquet Hall', 'Party Plot', 'Convention Center')`
6. **City Filter** (if applicable): Adds: `AND city = 'Ahmedabad'`
7. **Results Display**: Shows matching venues

## Key Design Decisions

### Why Multiple Types for Single Occasion?
- **Wedding Venues**: Include all upscale venues (hotels, resorts, heritage venues)
- **Birthday Parties**: Include casual + professional venues (banquet halls, party plots, convention centers)
- **Corporate Events**: Focus on professional spaces (convention centers, hotels, banquet halls)
- **Pool Parties**: Emphasize venues with water features (resorts, hotels, farmhouses)

### Venue Type Priority
Most occasions are ordered by relevance:
1. Primary venue type (most appropriate)
2. Secondary types (also suitable)
3. Tertiary types (can accommodate if needed)

### Special Cases
- **Farmhouses**: Appear in outdoor/casual events (wedding, pool party, corporate offsite)
- **Heritage Venues**: Appear in wedding and formal events only
- **Convention Centers**: Appear in corporate, conferences, and large gatherings
- **Party Plots**: Appear in casual and celebration events

## Database Venue Type Values

These are the exact values that must exist in your database `venues.type` column:
- Banquet Hall
- Party Plot
- Convention Center
- Hotel
- Resort
- Farmhouse
- Heritage Venue
- Boutique Venue
- Lawn

If your database has different type values, this mapping needs to be updated to match.

## Adding New Events

To add a new occasion (e.g., `networking-event-venues`):

```typescript
const VENUE_SLUG_TO_TYPES: Record<string, string[]> = {
    // ... existing mappings ...
    'networking-event-venues': ['Convention Center', 'Banquet Hall', 'Hotel'],
};
```

Choose appropriate venue types based on:
- Event formality level
- Expected group size
- Venue amenities needed
- Similar existing events

## Notes
- All slugs use lowercase with hyphens
- Slug variants (singular/plural) are both included when appropriate
- The mapping gracefully handles unknown slugs (falls back to generic filter)
- City filtering is applied independently of this mapping
