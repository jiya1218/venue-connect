# VenueConnect — Next.js Bug Audit & SEO Page Generation Master Prompt
### For Claude Opus 4.6 | Stack: Next.js 14 App Router + Supabase
### Status: Migration done ✅ | Bugs found: 15 🐛 | All fixable

---

## PART 1 — FULL BUG AUDIT (Fix these before generating SEO pages)

I read every file in your migrated Next.js codebase. Here are all 15 bugs found, ordered by severity, with exact file paths and fix instructions.

---

### 🔴 BUG 1 — CRITICAL: Wrong Next.js Version in package.json

**File:** `package.json`

**Problem:** You have `"next": "^16.2.2"` — Next.js 16 does not exist. The latest stable is Next.js 15. This means npm may resolve to an unstable/incorrect version, causing build failures.

**Fix:** Change the version:
```json
// WRONG
"next": "^16.2.2"

// CORRECT
"next": "^15.1.0"
```
Then run: `npm install`

---

### 🔴 BUG 2 — CRITICAL: `force-dynamic` on Root Layout Destroys All Static SEO Pages

**File:** `src/app/layout.tsx` — line 4

**Problem:**
```typescript
export const dynamic = 'force-dynamic';
```
This is placed at the top of your **root layout**, which wraps every single page on the site. `force-dynamic` forces server-side rendering on every request, disabling all static generation (`generateStaticParams`). This means your 3,400+ SEO pages will **never be pre-built** — they render dynamically on every request, making them slow and defeating the entire purpose of the Next.js migration.

**Fix:** Delete this line completely from `layout.tsx`. It should not exist there.

If you need dynamic rendering on a specific page (like the owner dashboard), add it only to that individual page file:
```typescript
// Add ONLY in src/app/owner/page.tsx or src/app/admin/page.tsx — NOT in layout.tsx
export const dynamic = 'force-dynamic';
```

---

### 🔴 BUG 3 — CRITICAL: `VenueCard.tsx` Missing `'use client'` Directive

**File:** `src/components/VenueCard.tsx`

**Problem:** This component uses `useState`, `useEffect`, and `createClient()` (browser Supabase client) for the favorites toggle — but has NO `'use client'` at the top. In Next.js App Router, any component using React hooks or browser APIs must declare `'use client'`. Without it, the build will either crash or the component will silently fail.

**Fix:** Add `'use client'` as the very first line:
```typescript
'use client';

import { Star, Users, MapPin, Send, CheckCircle2, Heart } from "lucide-react";
// ... rest of file unchanged
```

---

### 🔴 BUG 4 — CRITICAL: 6 More Components Missing `'use client'`

**Files with this problem (all use hooks but have no `'use client'`):**
- `src/components/VenueCard.tsx` — uses `useState`, `useEffect`, `createClient` ← also Bug 3
- `src/components/VendorCard.tsx` — uses `useState`, `useEffect`
- `src/components/ListingFilter.tsx` — uses `useSearchParams`, `useRouter`, `usePathname`
- `src/components/FloatingScrollToTop.tsx` — uses `useState`, `useEffect`
- `src/components/OccasionSlider.tsx` — uses `useState`, `useEffect`
- `src/components/SearchableCitySelect.tsx` — uses `useState`, `useEffect`
- `src/components/OTPVerification.tsx` — uses `useState`, `useEffect`

**Fix:** Add `'use client';` as the very first line of each file listed above.

---

### 🔴 BUG 5 — CRITICAL: Old Vite Supabase Client Still In Codebase

**File:** `src/integrations/supabase/client.ts`

**Problem:** This file uses `import.meta.env.VITE_SUPABASE_URL` — Vite-specific syntax. Next.js does not support `import.meta.env` — it uses `process.env`. If any component accidentally imports from `@/integrations/supabase/client` instead of `@/lib/supabase/client`, the build will crash in production.

**Fix — Option A (Recommended):** Delete the file entirely. Your new clients at `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, and `src/lib/supabase/static.ts` are correct.

**Fix — Option B:** Replace the content of the old file to redirect to the new one, so old imports don't break:
```typescript
// src/integrations/supabase/client.ts — redirect wrapper
export { createClient } from '@/lib/supabase/client';
```

Then search your entire codebase for any imports from `@/integrations/supabase/client` and replace with `@/lib/supabase/client` or `@/lib/supabase/server` as appropriate.

---

### 🔴 BUG 6 — CRITICAL: `.env` File Has Wrong Variable Names

**File:** `.env`

**Problem:** Your `.env` file still has the old Vite-style variable names alongside the new Next.js ones:
```
VITE_SUPABASE_URL=https://...        ← OLD (Vite only)
VITE_SUPABASE_ANON_KEY=eyJ...        ← OLD (Vite only)
NEXT_PUBLIC_SUPABASE_URL=https://... ← CORRECT (Next.js)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... ← CORRECT (Next.js)
```

The `VITE_` variables are harmless in Next.js (they're just ignored), but `VITE_WEBHOOK_URL` and `VITE_FAST2SMS_API_KEY` will not be accessible in Next.js. More importantly, you should rename `.env` to `.env.local` — Next.js reads `.env.local` for secrets, not `.env` (which is often committed to git).

**Fix:**
1. Rename `.env` → `.env.local`
2. Add `.env.local` to your `.gitignore` if not already there
3. Replace `VITE_WEBHOOK_URL` with `NEXT_PUBLIC_WEBHOOK_URL` in `.env.local` and everywhere it's used
4. Replace `VITE_FAST2SMS_API_KEY` with the correct Next.js name (keep it server-only — no `NEXT_PUBLIC_` prefix for secret keys)

---

### 🟠 BUG 7 — HIGH: Bare `<img>` Tags in SEO Page (Kills Core Web Vitals)

**File:** `src/app/(seo)/[...seoSegments]/page.tsx` — lines 142–144, 190–194

**Problem:** You are using bare HTML `<img>` tags for the hero background city image and the venue listing thumbnails. In Next.js, you must use `<Image>` from `next/image` for:
- Automatic WebP conversion (30–50% smaller file sizes)
- Lazy loading by default
- Prevents layout shift (CLS)
- Served through Next.js image optimization CDN

Bare `<img>` tags will hurt your Core Web Vitals score, which directly impacts SEO ranking.

**Fix — Hero image (line 142):**
```typescript
// REMOVE
import Image from 'next/image' // add this import at top

// BEFORE (line ~142)
<img 
  src={data.cityImage} 
  alt={`${cityTitle} scenery`} 
  className="w-full h-full object-cover opacity-30"
/>

// AFTER
<Image
  src={data.cityImage}
  alt={`Best ${formatTitle(categorySlug)} in ${cityTitle}`}
  fill
  className="object-cover opacity-30"
  priority
  sizes="100vw"
/>
```

**Fix — Venue listing thumbnails (line ~190):**
```typescript
// BEFORE
<img 
  src={listing.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80"} 
  alt={listing.name}
  className="w-full h-full object-cover"
/>

// AFTER
<Image
  src={listing.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80"}
  alt={`${listing.name} — ${formatTitle(categorySlug)} in ${cityTitle}`}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 192px"
/>
```
Also wrap the parent `<div>` with `className="relative"` so `fill` works correctly.

---

### 🟠 BUG 8 — HIGH: `next.config.mjs` Uses Deprecated `domains` (Will Break in Next.js 15)

**File:** `next.config.mjs`

**Problem:**
```javascript
images: {
  domains: ['images.unsplash.com', 'mxthfjlygtjnxxteohot.supabase.co'],
}
```
The `domains` key is deprecated and removed in Next.js 15. It must be replaced with `remotePatterns`.

**Fix — Replace the entire `next.config.mjs`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'mxthfjlygtjnxxteohot.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
};

export default nextConfig;
```

---

### 🟠 BUG 9 — HIGH: SEO Schema Markup Not Injected Into `<head>` (Google Won't See It)

**File:** `src/app/(seo)/[...seoSegments]/page.tsx` — around line 110

**Problem:**
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: data.faqSchema }}
/>
```
This `<script>` tag is placed inside the `<div className="min-h-screen">` body — **not inside `<head>`**. Google's structured data crawler expects JSON-LD to be in the `<head>`. Placing it in the body is technically allowed by the spec but is a bad practice and can cause Google to skip it.

**Fix:** In Next.js App Router, use the built-in way to inject scripts into `<head>` — either via `generateMetadata` or by placing the script **before** the main `<div>` wrapper so it renders at the top of the document:

The cleanest fix is to return the schema via the page fragment:
```typescript
export default async function ConsolidatedSEOPage({ params }: PageProps) {
  // ... existing logic ...
  
  return (
    <>
      {/* These go into <head> automatically in Next.js App Router */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: data.faqSchema }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      
      <div className="min-h-screen flex flex-col font-sans">
        {/* ... rest of page ... */}
      </div>
    </>
  );
}
```

Also add `BreadcrumbList` and `LocalBusiness` schemas — right now the SEO page only injects the FAQPage schema. You need all 4.

---

### 🟠 BUG 10 — HIGH: `generateStaticParams` Only Returns 2 Pages (Out of 3,400+)

**File:** `src/app/(seo)/[...seoSegments]/page.tsx` — bottom of file

**Problem:**
```typescript
export async function generateStaticParams() {
  // Minimal set for build-time safety
  return [
    { seoSegments: ['ahmedabad', 'wedding-venues'] },
    { seoSegments: ['banquet-halls-near-me-in-ahmedabad'] },
  ];
}
```
This was left as a placeholder. Only 2 of your 3,400+ SEO pages get pre-built at deploy time. All other pages render dynamically on every request — slow, and no pre-built HTML for Google.

**Fix — Replace with the full params generator:**
```typescript
import { citiesData } from '@/lib/citiesData';
import { VENUE_CATEGORIES, VENDOR_CATEGORIES, EVENT_TYPES, SEO_PRIORITY_CATEGORIES } from '@/lib/seoConstants';

export async function generateStaticParams() {
  const params: { seoSegments: string[] }[] = [];

  citiesData.forEach((city) => {
    // City + Category pages (2-segment)
    [...VENUE_CATEGORIES, ...VENDOR_CATEGORIES, ...EVENT_TYPES].forEach((cat) => {
      params.push({ seoSegments: [city.slug, cat] });
    });

    // Near Me pages (1-segment)
    SEO_PRIORITY_CATEGORIES.forEach((core) => {
      params.push({ seoSegments: [`${core.slug}-near-me-in-${city.slug}`] });
    });

    // Hyper-local pages (3-segment)
    if (city.localities) {
      city.localities.forEach((locality) => {
        SEO_PRIORITY_CATEGORIES.forEach((core) => {
          params.push({ seoSegments: [city.slug, locality, core.slug] });
        });
      });
    }
  });

  return params;
}
```

---

### 🟠 BUG 11 — HIGH: `Navbar` and `Footer` Double-Rendered on Every SEO Page

**File:** `src/app/layout.tsx` + `src/app/(seo)/[...seoSegments]/page.tsx`

**Problem:** Your root `layout.tsx` already renders `<Navbar />` and `<Footer />` wrapping all pages. But your SEO page also imports and renders them again:
```typescript
// In (seo) page.tsx — DUPLICATES what layout.tsx already does
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// ...
return (
  <div>
    <Navbar />   ← renders a 2nd Navbar
    ...
    <Footer />   ← renders a 2nd Footer
  </div>
);
```
Users will see two navbars stacked on top of each other.

**Fix:** Remove the `<Navbar />` and `<Footer />` imports and JSX from the SEO page. The layout handles them automatically for every page.

```typescript
// REMOVE these imports from (seo)/[...seoSegments]/page.tsx
import Navbar from "@/components/Navbar";   // DELETE
import Footer from "@/components/Footer";   // DELETE

// REMOVE from the JSX return
<Navbar />   // DELETE
<Footer />   // DELETE
```

---

### 🟡 BUG 12 — MEDIUM: `tailwind.config.ts` Missing `@tailwindcss/typography` Plugin

**File:** `tailwind.config.ts` — plugins array

**Problem:**
```typescript
plugins: [require("tailwindcss-animate")],
// @tailwindcss/typography is NOT here
```
Your SEO page uses `prose prose-slate prose-lg` Tailwind classes for the intro content block — these are from the `@tailwindcss/typography` plugin. Without the plugin these classes do nothing, so your intro paragraphs have no typography styling.

The package IS installed (it's in `devDependencies`) — it's just not registered in the config.

**Fix:** Add the plugin:
```typescript
plugins: [
  require("tailwindcss-animate"),
  require("@tailwindcss/typography"),  // ADD THIS
],
```

---

### 🟡 BUG 13 — MEDIUM: `tsconfig.app.json` Has Vite-Specific Settings That Break Next.js Build

**File:** `tsconfig.app.json`

**Problem:** This file still has Vite-era TypeScript settings:
```json
"types": ["vitest/globals"],      // Vite testing — not needed in Next.js
"allowImportingTsExtensions": true, // Vite bundler mode — breaks Next.js
"moduleResolution": "bundler",      // Vite bundler mode — wrong for Next.js
```
These settings are wrong for a Next.js project and can cause TypeScript errors during `next build`.

**Fix — Replace `tsconfig.app.json` entirely with:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

And replace the root `tsconfig.json` with:
```json
{
  "extends": "./tsconfig.app.json"
}
```

---

### 🟡 BUG 14 — MEDIUM: `seoContentEngine.ts` Content is Too Thin (2 Generic Paragraphs, Only 3 FAQs)

**File:** `src/lib/seoContentEngine.ts`

**Problem:** The current `generateSEOContent()` function produces:
- Only 2 generic template paragraphs (no city-specific content)
- Only 3 FAQs in the schema (not enough for Google's FAQ rich results — recommended 5+)
- No `LocalBusiness` schema
- No `BreadcrumbList` schema returned (only built for breadcrumb UI, not as a schema object)

This means Google sees thin, duplicate content across all pages and gives no ranking boost.

**Fix:** This is the core content improvement. The full fix is in Part 2 of this document (the Master Prompt for Claude Opus 4.6). The key additions are:
- City-specific intro paragraphs (see city context table in Part 2)
- 6 FAQs per page instead of 3
- Return `LocalBusiness` and `BreadcrumbList` as schema objects

---

### 🟡 BUG 15 — MEDIUM: Home Page (`page.tsx`) Has `'use client'` — Kills SSR on Home

**File:** `src/app/page.tsx` — line 1

**Problem:**
```typescript
"use client";
```
The home page is marked as a client component. This means the entire home page — hero, popular cities, featured venues, testimonials — renders client-side, not server-side. Google sees an empty shell for your most important page.

**Fix:** Remove `"use client"` from `page.tsx`. Each individual component that needs interactivity already has (or should have) its own `"use client"` directive. The page itself should be a Server Component.

```typescript
// REMOVE this line from src/app/page.tsx
"use client";  // DELETE

import HeroSearch from "@/components/HeroSearch";
// ... rest of file unchanged
```

---

## BUG SUMMARY TABLE

| # | Severity | File | Problem | Impact |
|---|---|---|---|---|
| 1 | 🔴 Critical | `package.json` | Next.js version `^16.2.2` doesn't exist | Build may fail |
| 2 | 🔴 Critical | `layout.tsx` | `force-dynamic` disables all static generation | All SEO pages slow, no pre-build |
| 3 | 🔴 Critical | `VenueCard.tsx` | Missing `'use client'` | Build crash or silent failure |
| 4 | 🔴 Critical | 6 components | Missing `'use client'` | Build crash or silent failure |
| 5 | 🔴 Critical | `integrations/supabase/client.ts` | Uses `import.meta.env.VITE_*` | Crash in production |
| 6 | 🔴 Critical | `.env` | Wrong variable names, wrong filename | Env vars not loaded |
| 7 | 🟠 High | SEO `page.tsx` | Bare `<img>` tags | Bad Core Web Vitals, hurts SEO rank |
| 8 | 🟠 High | `next.config.mjs` | Deprecated `domains` key | Breaks in Next.js 15 |
| 9 | 🟠 High | SEO `page.tsx` | Schema in body, only 1 schema | Google may miss structured data |
| 10 | 🟠 High | SEO `page.tsx` | Only 2 pages in `generateStaticParams` | 3,398+ pages render slowly |
| 11 | 🟠 High | SEO `page.tsx` + `layout.tsx` | Navbar + Footer double-rendered | Double navbar visible to users |
| 12 | 🟡 Medium | `tailwind.config.ts` | Missing `@tailwindcss/typography` | Prose styling broken |
| 13 | 🟡 Medium | `tsconfig.app.json` | Vite-era TS settings | TypeScript errors on build |
| 14 | 🟡 Medium | `seoContentEngine.ts` | Thin content, only 3 FAQs | No SEO ranking benefit |
| 15 | 🟡 Medium | `app/page.tsx` | `'use client'` on home page | Home page not server-rendered |

---

## FIX ORDER (Do in this exact sequence)

```
Step 1: Fix package.json → npm install
Step 2: Rename .env → .env.local, fix variable names
Step 3: Fix tsconfig.app.json (Vite settings → Next.js settings)
Step 4: Remove 'force-dynamic' from layout.tsx
Step 5: Remove 'use client' from app/page.tsx
Step 6: Add 'use client' to all 7 components listed in Bug 3+4
Step 7: Delete or redirect src/integrations/supabase/client.ts
Step 8: Fix next.config.mjs (domains → remotePatterns)
Step 9: Add @tailwindcss/typography to tailwind.config.ts plugins
Step 10: Fix <img> → <Image> in SEO page
Step 11: Remove double Navbar/Footer from SEO page
Step 12: Fix generateStaticParams in SEO page
Step 13: Add all 4 JSON-LD schemas to SEO page
Step 14: Run: npm run build → fix any remaining TypeScript errors
Step 15: Run: npm run dev → test /ahmedabad/wedding-venues/ → View Page Source
```

---

## VERIFICATION CHECKLIST (After applying all fixes)

Run `npm run build` — it must complete with 0 errors.

Then run `npm run dev` and check:
- [ ] `http://localhost:3000/` — Home page loads, View Page Source shows real content (not blank)
- [ ] `http://localhost:3000/ahmedabad/wedding-venues/` — SEO page loads
- [ ] View Page Source on SEO page → H1 visible in raw HTML
- [ ] View Page Source on SEO page → `<script type="application/ld+json">` visible in raw HTML
- [ ] Only ONE navbar visible on the SEO page (not two)
- [ ] No console error about `import.meta.env`
- [ ] No TypeScript errors in terminal

---

## PART 2 — SEO PAGE CONTENT IMPROVEMENT PROMPT

> After all 15 bugs are fixed, use this prompt to upgrade `seoContentEngine.ts` with rich, unique content per city.
> Copy everything in the code block into a new Claude Opus 4.6 conversation.

---

```
You are a senior Next.js 14 developer and SEO content expert working on venueconnect.in.

All Next.js migration bugs have been fixed. Now improve the SEO content engine to produce rich, unique, city-specific content for every page that Google will rank highly.

## YOUR TASK

Rewrite `src/lib/seoContentEngine.ts` to produce:
1. City-specific intro content (not generic templates)
2. 6 unique FAQs per page (currently only 3 generic ones)
3. All 4 JSON-LD schema objects (currently only FAQPage)
4. Proper Open Graph image URLs

Keep the existing function signature `generateSEOContent()` intact — the SEO page already calls it. You are expanding what it returns, not breaking the interface.

## CURRENT FUNCTION SIGNATURE (do not break this)

```typescript
export const generateSEOContent = (
  baseUrl: string,
  citySlug: string,
  categorySlug?: string,
  localitySlug?: string,
  eventSlug?: string,
  isNearMe: boolean = false
): SEOData
```

## EXPAND THE SEOData INTERFACE to include:

```typescript
export interface SEOData {
  // Existing (keep these)
  title: string;
  description: string;
  h1: string;
  heroSubtitle: string;
  content: string;           // HTML string — expand to 3 paragraphs
  faqSchema: string;         // JSON string for <script> tag
  cityImage?: string;
  breadcrumbs: { name: string, item: string }[];
  
  // NEW — add these
  introParagraph1: string;   // 120-150 words, target keyword in sentence 1
  introParagraph2: string;   // 100-130 words, venue tips for this event type
  introParagraph3: string;   // 80-100 words, VenueConnect value prop + soft CTA
  faqs: Array<{ question: string; answer: string }>; // 6 items
  breadcrumbSchema: string;  // JSON-LD string
  localBusinessSchema: string; // JSON-LD string
  webPageSchema: string;     // JSON-LD string
}
```

## INPUT DATA (from Excel — fill in for each page)

- City: {CITY} (e.g. "Ahmedabad")
- City Slug: {CITY_SLUG} (e.g. "ahmedabad")
- Event/Category: {EVENT_OR_CATEGORY} (e.g. "Wedding")
- Category Slug: {CATEGORY_SLUG} (e.g. "wedding-venues")
- URL Slug: {URL_SLUG} (e.g. "/ahmedabad/wedding-venues/")
- Meta Title: {META_TITLE}
- Meta Description: {META_DESCRIPTION}
- H1 Tag: {H1_TAG}
- Target Keyword: {TARGET_KEYWORD}
- Secondary Keywords: {SECONDARY_KEYWORDS}
- Priority: {PRIORITY}

## CONTENT RULES

### Intro Paragraph 1 (120-150 words)
- First sentence MUST contain the exact target keyword
- Mention the city by name 3+ times
- Include 2 secondary keywords naturally
- Include real city-specific context from the table below — not generic filler

### Intro Paragraph 2 (100-130 words)
- Tips for choosing a {event type} venue specifically
- Mention: capacity, catering, indoor vs outdoor, budget, location in city
- Include 1 secondary keyword

### Intro Paragraph 3 (80-100 words)
- VenueConnect value proposition
- Mention: free quotes, 100+ verified listings, compare prices, instant leads
- End with: "Browse our verified list below and get a free quote today."

### City Context (use real facts — never generic)
| City | Key facts to weave into intro content |
|---|---|
| Ahmedabad | UNESCO World Heritage old city (Pols walled area), Sabarmati riverfront, GIFT City corporate hub, SG Highway, Bodakdev & Prahlad Nagar as premium event zones, largest city in Gujarat |
| Surat | India's diamond & textile capital, super-affluent business families known for extravagant multi-day celebrations, Vesu & Adajan as upscale areas, fastest-growing city in India |
| Vadodara | Gujarat's cultural capital (Baroda), Navratri epicentre of India, Laxmi Vilas Palace as iconic heritage backdrop, MS University arts culture, Alkapuri & Fatehgunj as prime event belts |
| Rajkot | Kathiawadi warmth & hospitality, traditional Gujarati wedding culture, 150 Ft Ring Road commercial hub, Kalawad Road & Gondal Road event areas, Saurashtra's largest city |
| Gandhinagar | Gujarat's planned capital, Mahatma Mandir (one of India's largest convention centres), GIFT City proximity, IT sector and government corporate events, clean sector-based layout |
| Bhavnagar | Port city, Takhteshwar Temple as landmark, steel industry professional community, tight-knit family celebration traditions, Saurashtra's cultural hub |
| Jamnagar | Home of Reliance's oil refinery (world's largest), Lakhota Lake scenic setting, Jadeja royal heritage, traditional Saurashtra culture |
| Anand | Milk capital of India (Amul HQ + NDDB), Anand Agricultural University, growing FMCG and cooperative sector corporate events |
| Junagadh | Gateway to Gir forest (Asia's only wild lions), Girnar mountain pilgrimage, historic Nawabi architecture, deeply traditional Gujarati celebrations |
| Gandhidham | Kandla port trade hub, major logistics & industrial city serving entire Kutch region, growing B2B and trade show events |
| Navsari | South Gujarat's cultural heartland, significant Parsi Zoroastrian heritage, sugarcane and tobacco trading town, rich community celebration traditions |
| Morbi | World's #1 ceramic tiles exporter, strong industrial community, business conferences and trade exhibitions are primary demand drivers |
| Bhuj | Kutch headquarters, rebuilt and modernised after 2001 earthquake, Rann Utsav tourism hub, vibrant Kutchi embroidery and craft culture |
| Valsad | South Gujarat residential city, gateway to Daman, growing urban celebrations driven by NRI-origin and diaspora families |
| Palanpur | Diamond cutting and polishing hub of North Gujarat, Banaskantha district centre, Rajasthani-influenced cultural celebration traditions |
| Dahod | Tribal district of East Gujarat, government development focus under major schemes, growing community ceremonial and religious events |

## FAQ RULES — Generate exactly 6, all city+event specific

Topic order:
1. Average cost of {event} venues in {city} — give real ₹ range, mention seasonal variation
2. How many verified {event} venues on VenueConnect in {city} — use real venue count from citiesData
3. Best areas/localities in {city} for {event} venues — name 3-4 actual areas from citiesData
4. What to look for in a {event} venue in {city} — 4-5 event-specific facility tips
5. How to book via VenueConnect — 3-step process: Browse → Get Quote → Confirm
6. Is VenueConnect free — yes, explain the free quote model

Each answer: minimum 3 full sentences. Include target or secondary keyword in at least 3 answers.

## SCHEMA RULES — Return as JSON strings

### webPageSchema (new)
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{META_TITLE}",
  "description": "{META_DESCRIPTION}",
  "url": "https://venueconnect.in{URL_SLUG}",
  "inLanguage": "en-IN",
  "dateModified": "YYYY-MM-DD",
  "isPartOf": { "@type": "WebSite", "name": "VenueConnect", "url": "https://venueconnect.in" }
}
```

### breadcrumbSchema (already used in UI — now also return as string)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://venueconnect.in" },
    { "@type": "ListItem", "position": 2, "name": "{CITY} Venues", "item": "https://venueconnect.in/{CITY_SLUG}" },
    { "@type": "ListItem", "position": 3, "name": "{H1_TAG}", "item": "https://venueconnect.in{URL_SLUG}" }
  ]
}
```

### localBusinessSchema (new)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "VenueConnect — {H1_TAG}",
  "description": "{META_DESCRIPTION}",
  "url": "https://venueconnect.in{URL_SLUG}",
  "telephone": "+91-9601015102",
  "priceRange": "₹₹–₹₹₹",
  "areaServed": {
    "@type": "City",
    "name": "{CITY}",
    "addressRegion": "Gujarat",
    "addressCountry": "IN"
  },
  "serviceType": "{TARGET_KEYWORD}"
}
```

### faqSchema (expand to 6 FAQs — same format as existing)

## OUTPUT: Full updated `src/lib/seoContentEngine.ts`

Return the complete file. Keep all existing code — only expand the SEOData interface and the generateSEOContent() return object with the new fields. Do not change the function signature.

## QA CHECKLIST

- [ ] Existing function signature unchanged
- [ ] SEOData interface expanded with all new fields
- [ ] introParagraph1 starts with exact target keyword
- [ ] City-specific facts used in paragraph 1 (not generic)
- [ ] Exactly 6 FAQs generated
- [ ] Each FAQ answer is 3+ sentences
- [ ] All 4 schema strings returned (faqSchema, breadcrumbSchema, localBusinessSchema, webPageSchema)
- [ ] No TypeScript errors
```

---

## PART 3 — HOW TO USE (Full Workflow)

### Step A — Fix all 15 bugs (do once)
Follow the bug fixes in Part 1 in the exact order listed in the Fix Order section.

### Step B — Verify build passes
```bash
npm run build
# Must complete with 0 errors
```

### Step C — Generate improved SEO content (one conversation per page type)
1. Open a new Claude Opus 4.6 conversation
2. Paste the Part 2 prompt
3. Fill in the 11 `{VARIABLES}` from your Excel row:

| Variable | Excel Column | Example |
|---|---|---|
| `{CITY}` | Sheet name | Ahmedabad |
| `{CITY_SLUG}` | Derived | ahmedabad |
| `{EVENT_OR_CATEGORY}` | Derived from title | Wedding |
| `{CATEGORY_SLUG}` | From URL in Col C | wedding-venues |
| `{URL_SLUG}` | Column C | /ahmedabad/wedding-venues/ |
| `{META_TITLE}` | Column D | Best Wedding Venues in Ahmedabad \| Book & Compare Prices - VenueConnect |
| `{META_DESCRIPTION}` | Column E | Find the best wedding venues in Ahmedabad... |
| `{H1_TAG}` | Column F | Best Wedding Venues in Ahmedabad |
| `{TARGET_KEYWORD}` | Column G | wedding venues in Ahmedabad |
| `{SECONDARY_KEYWORDS}` | Column H | wedding hall Ahmedabad, wedding venue booking Ahmedabad... |
| `{PRIORITY}` | Column J | High |

4. Save the returned `seoContentEngine.ts` into your project
5. Test `npm run dev` → open the URL → View Page Source → confirm H1 and paragraphs visible
6. Move to the next Excel row

### Step D — Priority page order
Start with these 4 pages to validate the full flow, then expand:

| City | Category Slug | URL | Why |
|---|---|---|---|
| Ahmedabad | wedding-venues | /ahmedabad/wedding-venues/ | Highest search volume |
| Ahmedabad | birthday-party-venues | /ahmedabad/birthday-party-venues/ | 2nd highest |
| Surat | wedding-venues | /surat/wedding-venues/ | Gujarat's 2nd city |
| Vadodara | wedding-venues | /vadodara/wedding-venues/ | Gujarat's 3rd city |

---

## QUICK REFERENCE — Package Versions (Correct)

```json
{
  "next": "^15.1.0",
  "@supabase/ssr": "^0.5.0",
  "@supabase/supabase-js": "^2.45.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

---

*Document prepared for VenueConnect (venueconnect.in) — April 2026*
*Stack: Next.js 15 App Router + Supabase + Tailwind CSS + shadcn/ui*
*Bugs found: 15 | Critical: 6 | High: 5 | Medium: 4*
