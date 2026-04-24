# VenueConnect — SEO Page Generation Master Prompt
### For Claude Opus 4.6 | Next.js 14 (App Router) + Supabase
### Migrated from: React 18 + Vite SPA → Next.js 14 SSR/SSG

---

## ⚠️ WHY WE ARE MIGRATING TO NEXT.JS

Your current stack is **React 18 + Vite** — a Client-Side Rendered (CSR) SPA.

**The core SEO problem with CSR:**
- Google crawls your page → receives a **blank HTML shell** (no content)
- All content loads only after JavaScript runs in the browser
- Googlebot sometimes waits for JS, often doesn't — **your meta tags, H1s, FAQs, and schema markup may never be indexed**
- You can verify this: open your site → right-click → **View Page Source** → almost no content visible

**What Next.js 14 (App Router) gives you:**

| Feature | React + Vite (current) | Next.js 14 (target) |
|---|---|---|
| Google sees full content | ❌ Empty HTML | ✅ Full HTML on first request |
| Meta tags reliably indexed | ⚠️ Unreliable | ✅ Always — via Metadata API |
| Schema markup indexed | ⚠️ Unreliable | ✅ Always |
| Core Web Vitals / Speed | Slower | ✅ Faster (RSC, streaming) |
| 3,000+ SEO pages ranking | Very unlikely | ✅ Yes |
| Pre-build all pages at deploy | N/A | ✅ generateStaticParams() |
| Auto-refresh when DB changes | N/A | ✅ ISR (revalidate) |

**Everything that stays the same:** Supabase, Tailwind CSS, shadcn/ui, lucide-react, framer-motion, TypeScript, all your brand colors and fonts — they all work identically in Next.js.

---

## CODEBASE SUMMARY

### Current Stack (React + Vite — what you have)

| Detail | Value |
|---|---|
| **Router** | `react-router-dom` v6 (BrowserRouter) |
| **Data fetching** | `useEffect` + `@tanstack/react-query` + Supabase client |
| **SEO Head** | `react-helmet-async` → `<Helmet>` |
| **Rendering** | Client-Side Rendering (CSR) — bad for SEO |
| **Build tool** | Vite |
| **Entry point** | `src/App.tsx` with `<Routes>` |
| **SEO page** | `src/pages/SEOLandingPage.tsx` |
| **SEO engine** | `src/lib/seoContentEngine.ts` |

### Target Stack (Next.js 14 — what we are migrating to)

| Detail | Value |
|---|---|
| **Router** | Next.js 14 App Router (file-based, `app/` directory) |
| **Data fetching** | `async/await` in Server Components — Supabase server client |
| **SEO Head** | Next.js `Metadata` API (`export const metadata`) — no Helmet needed |
| **Rendering** | SSG + ISR for SEO pages / SSR for dynamic / CSR for auth/dashboard |
| **Build tool** | Next.js built-in (Turbopack in dev) |
| **Entry point** | `app/layout.tsx` (root layout) |
| **SEO pages** | `app/[citySlug]/[categorySlug]/page.tsx` |
| **SEO engine** | `lib/seoContentEngine.ts` (same logic, adapted for server) |

### What stays identical (copy-paste from old project)

- `tailwind.config.ts` — copy as-is
- `src/index.css` → `app/globals.css` — copy content
- All `src/components/ui/` (shadcn) → `components/ui/` — copy as-is
- `src/lib/citiesData.ts` → `lib/citiesData.ts` — copy as-is
- `src/lib/seoConstants.ts` → `lib/seoConstants.ts` — copy as-is
- `src/lib/utils.ts` → `lib/utils.ts` — copy as-is
- Brand colors, fonts (Cormorant Garamond + Jost), Tailwind classes — identical

---

## PART 1 — MIGRATION GUIDE

> Give this entire Part 1 to Claude Opus 4.6 as a **separate first conversation**.
> Say: "Migrate my VenueConnect React+Vite project to Next.js 14 App Router following these instructions exactly."

---

```
You are a senior Next.js 14 migration expert. Migrate the VenueConnect project from React 18 + Vite to Next.js 14 App Router. Follow every instruction precisely.

## SOURCE PROJECT DETAILS

Stack: React 18, Vite, TypeScript, Tailwind CSS v3, Supabase, react-router-dom v6, react-helmet-async, shadcn/ui, lucide-react, framer-motion
Brand primary color: hsl(320 65% 45%) — deep pink/magenta
Fonts: Cormorant Garamond (font-display), Jost (font-sans)
Supabase URL and anon key are in .env as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

## STEP 1 — CREATE THE NEXT.JS 14 PROJECT

Run this exact command:

npx create-next-app@latest venueconnect-next \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack

Then:
cd venueconnect-next

## STEP 2 — INSTALL ALL REQUIRED PACKAGES

npm install @supabase/supabase-js @supabase/ssr \
  @tanstack/react-query \
  lucide-react \
  framer-motion \
  sonner \
  clsx \
  tailwind-merge \
  class-variance-authority \
  swiper \
  next-themes \
  zod \
  react-hook-form \
  @hookform/resolvers \
  @tailwindcss/typography \
  tailwindcss-animate

Then install shadcn/ui:

npx shadcn@latest init

When prompted: Style = Default, Base color = Slate, CSS variables = Yes

Then add all components:

npx shadcn@latest add accordion alert alert-dialog avatar badge breadcrumb button card carousel checkbox dialog drawer dropdown-menu form input label popover radio-group scroll-area select separator sheet skeleton slider sonner switch table tabs textarea toast toggle tooltip

## STEP 3 — ENVIRONMENT VARIABLES

Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

Note: Rename VITE_SUPABASE_URL → NEXT_PUBLIC_SUPABASE_URL

## STEP 4 — THREE SUPABASE CLIENT FILES (Critical for Next.js SSR)

### File 1: src/lib/supabase/client.ts  (browser — Client Components)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### File 2: src/lib/supabase/server.ts  (server — Server Components)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
```

### File 3: src/middleware.ts  (root level — auth session refresh)
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options))
        },
      },
    }
  )
  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

## STEP 5 — TAILWIND CONFIG

Replace generated tailwind.config.ts with:

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
```

## STEP 6 — GLOBAL CSS

Replace src/app/globals.css with the full contents of the old src/index.css (copy exactly — it has the Google Fonts import, Tailwind directives, and all CSS variables including --primary: 320 65% 45%).

## STEP 7 — ROOT LAYOUT (src/app/layout.tsx)

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'VenueConnect — Find Venues & Vendors in Gujarat',
    template: '%s | VenueConnect',
  },
  description: 'Discover top-rated banquet halls, wedding photographers, and decorators in Gujarat.',
  metadataBase: new URL('https://venueconnect.in'),
  openGraph: { siteName: 'VenueConnect', type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

## STEP 8 — APP ROUTER FOLDER STRUCTURE

Create this inside src/app/:

```
src/app/
├── layout.tsx                       ← Root layout
├── globals.css                      ← Global styles
├── page.tsx                         ← Home (/)
├── sitemap.ts                       ← Auto-generated sitemap
├── robots.ts                        ← robots.txt
│
├── (static)/                        ← Route group — NO URL impact, prevents collisions
│   ├── venues/
│   │   ├── page.tsx                 ← /venues
│   │   └── [id]/page.tsx            ← /venues/[id]
│   ├── vendors/
│   │   ├── page.tsx                 ← /vendors
│   │   └── [id]/page.tsx            ← /vendors/[id]
│   ├── cities/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── faqs/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── dashboard/page.tsx
│   ├── profile/page.tsx
│   ├── e-invitations/page.tsx
│   ├── list-venue/page.tsx
│   ├── list-vendor/page.tsx
│   ├── list-business/page.tsx
│   ├── admin/page.tsx
│   └── owner/page.tsx
│
└── (seo)/                           ← Route group for SEO landing pages
    ├── [citySlug]/
    │   └── [categorySlug]/
    │       └── page.tsx             ← /ahmedabad/wedding-venues/
    ├── [citySlug]/
    │   └── [localitySlug]/
    │       └── [categorySlug]/
    │           └── page.tsx         ← /ahmedabad/satellite/banquet-halls/
    └── [eventSlug]-venue-near-me/
        └── page.tsx                 ← /wedding-venue-near-me/
```

The route groups (static) and (seo) prevent URL collisions between /venues and /[citySlug].

## STEP 9 — KEY MIGRATION RULES FOR EVERY FILE

### 1. Replace react-router-dom with Next.js navigation:
```typescript
// REMOVE
import { Link, useNavigate, useParams } from 'react-router-dom'
const navigate = useNavigate()
navigate('/venues')

// ADD
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
const router = useRouter()
router.push('/venues')
```

### 2. Replace react-helmet-async with Next.js Metadata API:
```typescript
// REMOVE (entire Helmet block)
import { Helmet } from 'react-helmet-async'
<Helmet><title>Page Title</title></Helmet>

// ADD (in page.tsx — static export)
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Page Title', description: '...' }

// OR (dynamic — for SEO pages)
export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: `${params.city} Venues`, description: '...' }
}
```

### 3. Replace useEffect data fetching with Server Components:
```typescript
// REMOVE
const [venues, setVenues] = useState([])
useEffect(() => {
  supabase.from('venues').select('*').then(({ data }) => setVenues(data))
}, [])

// ADD — Server Component (no 'use client')
import { createServerSupabaseClient } from '@/lib/supabase/server'
export default async function Page() {
  const supabase = await createServerSupabaseClient()
  const { data: venues } = await supabase.from('venues').select('*')
  return <VenueList venues={venues} />
}
```

### 4. Add 'use client' to interactive components:
Any component using useState, useEffect, onClick, forms, framer-motion, or shadcn Dialog/Sheet/Accordion needs 'use client' at the very top.

Components that NEED 'use client':
- Navbar.tsx (mobile menu toggle)
- VenueCard.tsx (favorites, GetQuoteModal)
- GetQuoteModal.tsx, GetQuoteCTA.tsx
- ListingFilter.tsx
- HeroSearch.tsx, InstantMatch.tsx
- OTPVerification.tsx, SearchableCitySelect.tsx
- All Login, Register, Dashboard, Profile pages
- All owner/ and admin/ components

Components that can be Server (no 'use client'):
- Footer.tsx
- PageHeader.tsx
- HowItWorks.tsx, PricingPackages.tsx
- SEOLinksDirectory.tsx

### 5. Replace <img> with next/image:
```typescript
// REMOVE
<img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />

// ADD
import Image from 'next/image'
<Image src={venue.image} alt={venue.name} fill className="object-cover" />
```

## STEP 10 — COPY LIB FILES

| Old path | New path | Changes |
|---|---|---|
| src/lib/citiesData.ts | src/lib/citiesData.ts | None |
| src/lib/seoConstants.ts | src/lib/seoConstants.ts | None |
| src/lib/seoContentEngine.ts | src/lib/seoContentEngine.ts | See Part 2 |
| src/lib/utils.ts | src/lib/utils.ts | None |
| src/lib/cities.ts | src/lib/cities.ts | None |

## STEP 11 — NEXT.JS CONFIG (next.config.ts)

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
}

export default nextConfig
```

## STEP 12 — VERCEL CONFIG (vercel.json — replace old one)

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install"
}
```

## STEP 13 — AUTO SITEMAP (src/app/sitemap.ts)

```typescript
import { MetadataRoute } from 'next'
import { citiesData } from '@/lib/citiesData'
import { EVENT_TYPES, VENUE_CATEGORIES, VENDOR_CATEGORIES } from '@/lib/seoConstants'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://venueconnect.in'
  const now = new Date().toISOString()
  const entries: MetadataRoute.Sitemap = []

  citiesData.forEach(city => {
    const allCategories = [
      ...EVENT_TYPES.map(e => e + '-venues'),
      ...VENUE_CATEGORIES,
      ...VENDOR_CATEGORIES,
    ]
    allCategories.forEach(cat => {
      entries.push({
        url: `${base}/${city.slug}/${cat}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })
  })

  return entries
}
```

## STEP 14 — VERIFY MIGRATION

Run: npm run dev

Check:
- [ ] http://localhost:3000/ — Home page loads
- [ ] http://localhost:3000/venues — Venues listing loads
- [ ] http://localhost:3000/ahmedabad/wedding-venues — SEO page loads
- [ ] Right-click → View Page Source on the SEO page → H1 and intro content visible in raw HTML
- [ ] No console errors about react-router-dom or react-helmet-async

If View Page Source shows the H1 and body content (not a blank shell) → migration is successful.
```

---

## PART 2 — SEO PAGE GENERATION PROMPT

> Use this for each page after migration is complete.
> Copy everything in the code block below into a new Claude Opus 4.6 conversation.
> Fill in the `{VARIABLES}` from your Excel sheet row.

---

```
You are a senior Next.js 14 developer and SEO expert working on venueconnect.in — a Gujarat-based venue & vendor discovery platform migrated from React+Vite to Next.js 14 App Router.

## YOUR TASK

Build a complete, production-ready Next.js 14 SSR/SSG SEO landing page for the following Excel row. Google must be able to read all content from the raw HTML — no client-side rendering for content.

---

## INPUT PAGE DATA (from Excel)

- **Page Type:** {PAGE_TYPE}
- **City:** {CITY}
- **City Slug:** {CITY_SLUG}
- **Event / Category:** {EVENT_OR_CATEGORY}
- **Category Slug:** {CATEGORY_SLUG}
- **URL Slug:** {URL_SLUG}
- **Meta Title:** {META_TITLE}
- **Meta Description:** {META_DESCRIPTION}
- **H1 Tag:** {H1_TAG}
- **Target Keyword:** {TARGET_KEYWORD}
- **Secondary Keywords:** {SECONDARY_KEYWORDS}
- **Search Intent:** {SEARCH_INTENT}
- **Priority:** {PRIORITY}

---

## TECH STACK

- Next.js 14 App Router (NO react-router-dom, NO react-helmet-async)
- TypeScript — no `any` types
- Tailwind CSS v3 — brand primary: hsl(320 65% 45%)
- Supabase via `@supabase/ssr` — server client for SEO pages
- shadcn/ui components (already installed)
- lucide-react icons
- framer-motion (Client Components only)
- `next/image` for ALL images
- `next/link` for ALL internal links

## BRAND

- Primary: `hsl(320 65% 45%)` → `bg-primary`, `text-primary`, `border-primary`
- Accent: `bg-pink-600`, `hover:bg-pink-700`
- Backgrounds: `bg-white`, `bg-slate-50`
- Headings: `font-display` (Cormorant Garamond serif)
- Body: `font-sans` (Jost sans-serif)

## PATH ALIASES

- `@/components/` → src/components/
- `@/lib/` → src/lib/
- `@/components/ui/` → shadcn/ui

---

## OUTPUT 1: `src/lib/seoContentEngine.ts` (add to existing file)

Add the ExcelPageData interface, SEOPageData interface, and generatePageSEOContent() function.

```typescript
export interface ExcelPageData {
  pageType: string;
  city: string;
  citySlug: string;
  eventOrCategory: string;
  categorySlug: string;
  urlSlug: string;
  metaTitle: string;
  metaDescription: string;
  h1Tag: string;
  targetKeyword: string;
  secondaryKeywords: string;
  searchIntent: string;
  priority: string;
}

export interface SEOPageData {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  heroSubtitle: string;
  introParagraph1: string;    // 120-150 words — city-specific, target keyword in sentence 1
  introParagraph2: string;    // 100-130 words — venue tips for this event type
  introParagraph3: string;    // 80-100 words — VenueConnect value prop + soft CTA
  faqs: Array<{ question: string; answer: string }>; // exactly 6 FAQs
  relatedLinks: Array<{ text: string; url: string }>; // exactly 10 internal links
  nearMeLink?: { text: string; url: string };
  breadcrumbs: Array<{ name: string; item: string }>;
  canonicalUrl: string;
  cityImage: string;
  faqSchemaJson: object;           // plain object — Next.js serializes it
  localBusinessSchemaJson: object;
  breadcrumbSchemaJson: object;
  webPageSchemaJson: object;
}

export function generatePageSEOContent(pageData: ExcelPageData): SEOPageData {
  // Use citiesData to get city image and localities
  // Generate unique city-specific intro using city context notes below
  // Generate 6 city+event specific FAQs (see FAQ rules)
  // Generate 10 related links (see related links rules)
  // Build 4 schema objects (plain objects, not JSON strings)
}
```

City context for intro paragraphs — make every city UNIQUE:
| City | Key facts to weave in |
|---|---|
| Ahmedabad | UNESCO World Heritage old city (Pols), Sabarmati riverfront, GIFT City corporate hub, SG Highway, Bodakdev & Prahlad Nagar as premium zones |
| Surat | India's diamond & textile capital, affluent community known for extravagant celebrations, Vesu & Adajan as upscale event hubs |
| Vadodara | Gujarat's cultural capital, Navratri hub, Laxmi Vilas Palace heritage, Alkapuri & Fatehgunj as event areas |
| Rajkot | Kathiawadi warmth, traditional Gujarati culture, 150 Ft Ring Road, Kalawad Road & Gondal Road event belts |
| Gandhinagar | Gujarat's planned capital, Mahatma Mandir convention centre, GIFT City, IT sector corporate events |
| Bhavnagar | Port city, Takhteshwar Temple, steel industry, strong family celebration traditions |
| Jamnagar | Reliance oil refinery city, Lakhota Lake, Jadeja royal heritage, Saurashtra culture |
| Anand | Milk capital (Amul HQ), NDDB, cooperative sector corporate events |
| Junagadh | Gateway to Gir forest, Girnar pilgrimage, Nawabi architecture, traditional events |
| Gandhidham | Kandla port trade hub, industrial city for Kutch, growing B2B events |
| Navsari | South Gujarat cultural hub, Parsi heritage, rich celebration traditions |
| Morbi | Ceramic tiles capital of world, industrial community, business conferences |
| Bhuj | Kutch HQ, post-earthquake modern city, Rann Utsav tourism, Kutchi culture |
| Valsad | South Gujarat residential city, gateway to Daman, NRI-origin family events |
| Palanpur | Diamond cutting hub of North Gujarat, Rajasthani-influenced culture |
| Dahod | Tribal district of East Gujarat, government development, community events |

---

## OUTPUT 2: `src/app/(seo)/[citySlug]/[categorySlug]/page.tsx`

This file must NOT have 'use client' — it is a Server Component.

```typescript
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generatePageSEOContent } from '@/lib/seoContentEngine'
import { citiesData } from '@/lib/citiesData'
import { formatSlug } from '@/lib/seoConstants'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEOLinksDirectory from '@/components/SEOLinksDirectory'
import BreadcrumbNav from '@/components/seo/BreadcrumbNav'
import HeroSection from '@/components/seo/HeroSection'
import StatsBand from '@/components/seo/StatsBand'
import IntroContent from '@/components/seo/IntroContent'
import VenueFiltersClient from '@/components/seo/VenueFiltersClient'
import VenueListServer from '@/components/seo/VenueListServer'
import FAQSection from '@/components/seo/FAQSection'
import LeadFormCard from '@/components/seo/LeadFormCard'
import RelatedPagesSection from '@/components/seo/RelatedPagesSection'
import NearMeCrossLink from '@/components/seo/NearMeCrossLink'

// ISR: rebuild this page every hour when venue data changes
export const revalidate = 3600

interface PageProps {
  params: { citySlug: string; categorySlug: string }
}

// generateMetadata runs server-side — Google sees these tags in raw HTML
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cityData = citiesData.find(c => c.slug === params.citySlug)
  if (!cityData) return {}

  const pageData = {
    pageType: 'Event + City',
    city: cityData.name,
    citySlug: params.citySlug,
    eventOrCategory: formatSlug(params.categorySlug.replace('-venues', '')),
    categorySlug: params.categorySlug,
    urlSlug: `/${params.citySlug}/${params.categorySlug}/`,
    metaTitle: '{META_TITLE}',       // ← replace with actual Excel value
    metaDescription: '{META_DESCRIPTION}', // ← replace with actual Excel value
    h1Tag: '{H1_TAG}',               // ← replace with actual Excel value
    targetKeyword: '{TARGET_KEYWORD}',
    secondaryKeywords: '{SECONDARY_KEYWORDS}',
    searchIntent: '{SEARCH_INTENT}',
    priority: '{PRIORITY}',
  }

  const seo = generatePageSEOContent(pageData)

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: { canonical: seo.canonicalUrl },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: seo.canonicalUrl,
      siteName: 'VenueConnect',
      type: 'website',
      images: [{ url: seo.cityImage, alt: seo.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: [seo.cityImage],
    },
    robots: { index: true, follow: true },
  }
}

// Pre-build all city+category combinations at deploy time
export async function generateStaticParams() {
  const params: { citySlug: string; categorySlug: string }[] = []
  const allSlugs = [
    'wedding-venues', 'birthday-party-venues', 'engagement-venues',
    'corporate-event-venues', 'reception-venues', 'sangeet-ceremony-venues',
    'banquet-halls', 'farmhouses', 'hotels', 'resorts', 'party-plots',
    'photographers', 'caterers', 'decorators', 'djs', 'makeup-artists',
    // add all from seoConstants EVENT_TYPES, VENUE_CATEGORIES, VENDOR_CATEGORIES
  ]
  citiesData.forEach(city => {
    allSlugs.forEach(slug => params.push({ citySlug: city.slug, categorySlug: slug }))
  })
  return params
}

export default async function SEOLandingPage({ params }: PageProps) {
  const { citySlug, categorySlug } = params

  const cityData = citiesData.find(c => c.slug === citySlug)
  if (!cityData) notFound()

  // Build pageData object from params + Excel values
  const pageData = { /* same as in generateMetadata above */ }
  const seo = generatePageSEOContent(pageData)

  // Fetch venues on the SERVER — not in useEffect
  const supabase = await createServerSupabaseClient()
  const catSearch = categorySlug.replace(/-venues$/, '').replace(/-/g, ' ')
  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .ilike('city', `%${cityData.name}%`)
    .ilike('type', `%${catSearch}%`)
    .limit(12)

  const schemas = [
    seo.webPageSchemaJson,
    seo.breadcrumbSchemaJson,
    seo.localBusinessSchemaJson,
    seo.faqSchemaJson,
  ]

  return (
    <>
      {/* 4 JSON-LD schemas — injected into <head> server-side */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <BreadcrumbNav breadcrumbs={seo.breadcrumbs} />
        <HeroSection
          h1={seo.h1}
          heroSubtitle={seo.heroSubtitle}
          cityImage={seo.cityImage}
          city={cityData.name}
          venueCount={cityData.venues}
        />
        <StatsBand venueCount={cityData.venues} />

        <main className="flex-1 py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <IntroContent p1={seo.introParagraph1} p2={seo.introParagraph2} p3={seo.introParagraph3} />
                <VenueFiltersClient citySlug={citySlug} />
                <section id="listing-section" className="mt-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-pink-600 pl-4">
                    Verified {formatSlug(categorySlug)} in {cityData.name}
                  </h2>
                  <VenueListServer venues={venues || []} citySlug={citySlug} />
                </section>
                {seo.nearMeLink && <NearMeCrossLink link={seo.nearMeLink} />}
                <FAQSection faqs={seo.faqs} city={cityData.name} category={pageData.eventOrCategory} />
              </div>
              <aside className="lg:col-span-1">
                <LeadFormCard city={cityData.name} categorySlug={categorySlug} />
              </aside>
            </div>
          </div>
        </main>

        <RelatedPagesSection relatedLinks={seo.relatedLinks} city={cityData.name} />
        <SEOLinksDirectory city={citySlug} />
        <Footer />
      </div>
    </>
  )
}
```

---

## OUTPUT 3: Sub-components to create in src/components/seo/

**BreadcrumbNav.tsx** — Server Component (no 'use client')
- Breadcrumb: Home > {City} Venues > {H1}
- Uses Next.js `<Link>`, hidden on mobile

**HeroSection.tsx** — `'use client'` (framer-motion animation)
- Dark hero (bg-slate-900) with city image via `next/image` (fill, opacity-30)
- H1 exact from Excel — font-black text-white text-4xl md:text-6xl
- Subheadline — text-slate-300
- Trust pills: ✅ 100+ Verified | ⭐ 4.8 Rated | 🔒 Free Quotes
- Primary CTA: "Get Free Quotes" (bg-pink-600) — scrollTo #listing-section
- Secondary CTA: "Explore {count}+ Options" (outline white)

**StatsBand.tsx** — Server Component
- 4-column white band: Verified Venues / 4.8★ Rating / ₹0 Booking Fee / <12hrs Response

**IntroContent.tsx** — Server Component
- `<article className="prose prose-slate prose-lg max-w-none mb-12">`
- Renders 3 paragraphs — all SSR — Google indexes every word
- Do NOT add 'use client' — this content must be server-rendered

**VenueFiltersClient.tsx** — `'use client'`
- Filter pills: venue type, capacity, price range, area
- Uses `useSearchParams()` + `useRouter()` from `next/navigation`
- Updates URL query params when filters change

**VenueListServer.tsx** — Server Component
- Accepts pre-fetched `venues` array
- Renders `<VenueCardSSR />` for each venue
- Skeleton (animate-pulse, 3 cards) shown during Suspense
- Empty state: "No venues found — Explore All Venues →" link to /venues

**FAQSection.tsx** — `'use client'`
- shadcn/ui `<Accordion>` (needs client for open/close)
- H2: "FAQs — {category} Venues in {city}"
- Renders all 6 FAQs

**LeadFormCard.tsx** — `'use client'`
- Sticky sidebar card
- Fields: Full Name, WhatsApp Number
- Submit → insert to Supabase `leads` table via browser client
- Trust line: ✅ No Spam | 🔒 Data Safe | 📞 Instant Callback

**RelatedPagesSection.tsx** — Server Component
- Grid of 10 links using Next.js `<Link>`
- H2: "Explore More in {city}"

**NearMeCrossLink.tsx** — Server Component
- Pink banner: "Find {event} Venues Near Me →"

---

## OUTPUT 4: JSON-LD Schemas (as plain objects inside generatePageSEOContent)

```typescript
webPageSchemaJson: {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": metaTitle,
  "description": metaDescription,
  "url": `https://venueconnect.in${urlSlug}`,
  "inLanguage": "en-IN",
  "dateModified": new Date().toISOString().split('T')[0],
  "isPartOf": { "@type": "WebSite", "name": "VenueConnect", "url": "https://venueconnect.in" }
}

breadcrumbSchemaJson: {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://venueconnect.in" },
    { "@type": "ListItem", "position": 2, "name": `${city} Venues`, "item": `https://venueconnect.in/${citySlug}` },
    { "@type": "ListItem", "position": 3, "name": h1Tag, "item": `https://venueconnect.in${urlSlug}` }
  ]
}

localBusinessSchemaJson: {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": `VenueConnect — ${h1Tag}`,
  "description": metaDescription,
  "url": `https://venueconnect.in${urlSlug}`,
  "priceRange": "₹₹–₹₹₹",
  "areaServed": {
    "@type": "City", "name": city, "addressRegion": "Gujarat", "addressCountry": "IN"
  },
  "serviceType": targetKeyword
}

faqSchemaJson: {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(f => ({
    "@type": "Question",
    "name": f.question,
    "acceptedAnswer": { "@type": "Answer", "text": f.answer }
  }))
}
```

---

## FAQ RULES — 6 Required Topics

1. **Price** — "What is the average cost of {event} venues in {city}?" → ₹ range, mention seasonal variation (Navratri peak etc.)
2. **Count** — "How many {event} venues are on VenueConnect in {city}?" → Use real number from citiesData
3. **Areas** — "Which areas in {city} are best for {event} venues?" → Name 3-4 actual localities from citiesData
4. **Facilities** — "What to look for in a {event} venue in {city}?" → 4–5 event-specific tips
5. **Process** — "How do I book a {event} venue in {city} via VenueConnect?" → 3 steps: Browse → Quote → Confirm
6. **Cost to use** — "Is VenueConnect free for finding {event} venues?" → Yes — free quote model explained

Each answer: minimum 3 sentences. Target keyword in at least 3 answers.

---

## RELATED LINKS RULES — 10 Required Links

- 4 links: Other popular events in same city (e.g. birthday-party-venues, engagement-venues, corporate-event-venues, reception-venues)
- 3 links: Venue types in same city (e.g. banquet-halls, farmhouses, hotels)
- 2 links: Vendor types in same city (e.g. photographers, caterers)
- 1 link: Same event in next biggest city (Ahmedabad → Surat, Surat → Vadodara etc.)

All links: `/{citySlug}/{category-slug}` pattern.

---

## OUTPUT 5: Sitemap Entry

```xml
<url>
  <loc>https://venueconnect.in{URL_SLUG}</loc>
  <lastmod>{TODAY_YYYY-MM-DD}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>{0.9 if High, 0.7 if Medium}</priority>
</url>
```

---

## CODE QUALITY RULES

- No 'use client' on page.tsx — must be a Server Component
- No 'use client' on IntroContent.tsx — content must be SSR
- `next/image` for all images — never bare `<img>`
- `next/link` for all internal links — never bare `<a>`
- TypeScript throughout — no `any`
- `@/` path aliases — never relative paths
- `animate-pulse` skeletons for loading states
- Friendly empty states — not raw errors

---

## QA CHECKLIST

- [ ] page.tsx has NO 'use client' — it is a Server Component
- [ ] generateMetadata() is exported and returns full Metadata object
- [ ] generateStaticParams() returns all city+category combinations
- [ ] Meta title 50–60 chars — matches Excel Meta Title exactly
- [ ] Meta description 150–160 chars — matches Excel Meta Description exactly
- [ ] H1 exactly matches Excel H1 Tag field
- [ ] Target keyword in H1, first sentence of paragraph 1, and 2+ more times
- [ ] Secondary keywords appear naturally in intro
- [ ] Canonical URL: https://venueconnect.in{URL_SLUG}
- [ ] All 4 JSON-LD schemas injected server-side
- [ ] Supabase query uses createServerSupabaseClient() — not useEffect
- [ ] next/image for all images
- [ ] next/link for all internal links
- [ ] 6 FAQs — city+event specific, 3+ sentences each
- [ ] 10 related links with correct URL pattern
- [ ] VenueFiltersClient.tsx has 'use client'
- [ ] FAQSection.tsx has 'use client'
- [ ] LeadFormCard.tsx has 'use client'
- [ ] IntroContent.tsx has NO 'use client'
- [ ] Loading skeleton with animate-pulse present
- [ ] Empty state with fallback link present
- [ ] export const revalidate = 3600 present in page.tsx
- [ ] Sitemap XML entry at end of response
- [ ] View Page Source would show full H1 + intro content in raw HTML
```

---

## HOW TO USE THIS DOCUMENT

### Full workflow — start to finish

**Phase 0 — Do once: Migration**
1. Open a new Claude Opus 4.6 conversation
2. Paste the entire **Part 1 prompt** (Migration Guide section above)
3. Follow the generated output — build the new Next.js project
4. Verify with View Page Source on `/ahmedabad/wedding-venues/` — must show full HTML

**Phase 1+ — Repeat for each Excel row: SEO Pages**
1. Open a new Claude Opus 4.6 conversation
2. Paste the **Part 2 prompt**
3. Fill in the 13 `{VARIABLES}`:

| Variable | Excel Column | Example |
|---|---|---|
| `{PAGE_TYPE}` | Column A | Event + City |
| `{CITY}` | Sheet name | Ahmedabad |
| `{CITY_SLUG}` | Derived | ahmedabad |
| `{EVENT_OR_CATEGORY}` | Derived | Wedding |
| `{CATEGORY_SLUG}` | From URL in Col C | wedding-venues |
| `{URL_SLUG}` | Column C | /ahmedabad/wedding-venues/ |
| `{META_TITLE}` | Column D | Best Wedding Venues in Ahmedabad \| Book & Compare Prices - VenueConnect |
| `{META_DESCRIPTION}` | Column E | Find the best wedding venues in Ahmedabad... |
| `{H1_TAG}` | Column F | Best Wedding Venues in Ahmedabad |
| `{TARGET_KEYWORD}` | Column G | wedding venues in Ahmedabad |
| `{SECONDARY_KEYWORDS}` | Column H | wedding hall Ahmedabad, wedding venue booking Ahmedabad... |
| `{SEARCH_INTENT}` | Column I | Navigational / Transactional |
| `{PRIORITY}` | Column J | High |

4. Send to Claude Opus 4.6 → save the output files → test → next row

---

## IMPLEMENTATION PRIORITY ORDER

| Phase | When | What | Pages |
|---|---|---|---|
| **0** | Week 1 | Next.js migration | Full project |
| **1** | Week 2 | 4 high-volume pages to prove template | 4 |
| **2** | Month 1–2 | All events for top 5 cities | 275 |
| **3** | Month 2–3 | All events for remaining 11 cities | 605 |
| **4** | Month 2–3 | All 89 Near Me pages | 89 |
| **5** | Month 4+ | Venue types + Vendor categories | 544 |
| **6** | Month 4+ | Hyper-local area pages | ~1,920 |

---

## NEAR ME PAGES — SPECIAL INSTRUCTIONS

For rows from the **"Near Me (All Gujarat)"** sheet, add this to Part 2:

```
NEAR ME PAGE — ADDITIONAL INSTRUCTIONS:
- File: src/app/(seo)/[eventSlug]-venue-near-me/page.tsx
- Breadcrumb: Home > Near Me > {H1 Tag} — no specific city
- Intro: Write about Gujarat broadly, mention 3–4 major cities
- Supabase query: do NOT filter by city — fetch top venues Gujarat-wide
- LocalBusiness schema areaServed: Gujarat state (not a city)
- Filters: replace "Area" with "Select City" dropdown (all 16 cities)
- Related links: 8 city-specific versions of this same event type
- Sitemap priority: 0.7 (Medium)
- generateStaticParams: one entry per event type slug
```

---

## TOTAL PAGE COUNT

| Category | Pages |
|---|---|
| 16 cities × 55 events | 880 |
| 16 cities × 12 venue types | 192 |
| 16 cities × 22 vendor categories | 352 |
| 16 cities × ~15 localities × 8 categories | ~1,920 |
| Near Me (Gujarat-wide) | 89 |
| **Total** | **~3,433** |

All pre-rendered at build time via `generateStaticParams()`. Google gets full SSR HTML for every page. ISR (`revalidate = 3600`) auto-refreshes pages when your Supabase data changes — no manual redeploy needed.

---

*Document prepared for VenueConnect (venueconnect.in) — April 2026*
*Migration: React 18 + Vite SPA → Next.js 14 App Router*
*Supabase backend unchanged | Tailwind + shadcn/ui unchanged | All brand assets unchanged*
