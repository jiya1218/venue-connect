# VenueConnect — Gujarat's Premier Venue & Vendor Marketplace

A modern, full-stack venue discovery and listing platform built with **Next.js 15**, **TypeScript**, **Supabase**, and **Tailwind CSS**.

---

## 🎯 Features

- **18+ Homepage Sections** — Full marketplace experience including search, city explorer, trending venues, testimonials, and more
- **Venue & Vendor Discovery** — Search by city, area, type, capacity, price range, and amenities
- **SEO-Optimised City Pages** — Dynamic catch-all routes for `/{event-type}-venues-in-{city}` patterns
- **Admin Dashboard** — Approve / reject venue & vendor applications, bulk import, and SEO page management
- **Listing Forms** — Multi-step forms for venue owners and service vendors with image upload and package selection
- **Owner Dashboard** — Manage listings, track leads, and view analytics
- **Blog** — Static blog posts with SSG
- **Auth** — Supabase Auth with OTP, email, and Google sign-in
- **Rate Limiting** — Server-side rate limiting on all API routes
- **Sitemap + Robots** — Auto-generated SEO files

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |

---

## 📦 Installation

```bash
# Install dependencies (uses bun)
bun install

# Copy env file and fill in your Supabase credentials
cp .env.example .env.local

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

---

## 🗄️ Database Setup

1. Open your **Supabase Dashboard → SQL Editor**
2. Run `FINAL_SETUP_RUN_THIS.sql` — this creates all tables, RLS policies, auth triggers, and seeds demo data
3. (Optional) Run `supabase_fix_storage_public.sql` to configure public storage access for images
4. (Optional) Run `supabase/migrations/003_view_count_and_indexing_queue.sql` for view tracking and SEO indexing queue

---

## 🎨 Design System

- **Primary Color**: Deep Magenta / Pink (`#9b1f6b`)
- **Heading Font**: Cormorant Garamond
- **Body Font**: Jost
- **Components**: shadcn/ui (Radix-based) with custom Tailwind variants
- **Responsive**: Mobile-first, with bottom nav on mobile

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (forms)/          # List-your-venue + List-your-service multi-step forms
│   ├── (seo)/            # Catch-all SEO landing pages
│   ├── admin/            # Admin dashboard (login, pending, bulk-import)
│   ├── api/              # API routes (submit-venue, submit-vendor, admin/*)
│   ├── blog/             # Static blog
│   ├── cities/           # City explorer
│   ├── venues/           # Venue listing + detail pages
│   ├── vendors/          # Vendor listing + detail pages
│   ├── dashboard/        # User dashboard
│   ├── owner/            # Owner dashboard
│   └── ...
├── components/           # Shared UI components
│   ├── ui/               # shadcn/ui primitives
│   ├── forms/            # Multi-step form sub-components
│   ├── listing/          # Venue/vendor detail components
│   ├── seo/              # SEO page components
│   └── ...
├── lib/
│   ├── supabase/         # Supabase client (browser + server)
│   ├── forms/            # Zod validation schemas
│   ├── seo/              # SEO page generator + slugify
│   ├── citiesData.ts     # All Gujarat city/district data
│   ├── blog-data.ts      # Static blog posts
│   └── ...
└── middleware.ts         # Auth middleware
```

---

## 🌟 Homepage Sections

1. Hero with smart search (Event + City + Area)
2. Occasion Slider
3. Vendor Categories (30+ categories)
4. Event Type Explorer
5. Popular Cities across Gujarat
6. Trending Venues
7. Browse by Venue Type
8. Featured & Verified Venues
9. Venue Mood/Style Discovery
10. Get Quote CTA
11. Recently Added Venues
12. How It Works (4 steps)
13. Venue Owner CTA
14. Local Area Discovery (SEO)
15. Event Gallery
16. Testimonials
17. Popular Searches (SEO)
18. Stats Band + Footer

---

## 🔐 Admin Access

Navigate to `/admin/login` and use your configured admin credentials.

---

## 📝 License

All rights reserved © 2026 VenueConnect

---

## 📧 Contact

- **Email**: info@venueconnect.in
- **Phone**: +91 98765 43210
- **Location**: Ahmedabad, Gujarat, India
