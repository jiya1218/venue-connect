-- Backfill invalid slugs for venues and vendors.
-- Invalid means NULL, empty, or UUID-like value.
-- Run this once in Supabase SQL Editor.

begin;

-- Ensure slugs are unique across each table.
create unique index if not exists venues_slug_unique_idx on public.venues (slug) where slug is not null;
create unique index if not exists vendors_slug_unique_idx on public.vendors (slug) where slug is not null;

with venue_candidates as (
  select
    v.id,
    v.created_at,
    nullif(
      trim(both '-' from regexp_replace(lower(
        coalesce(nullif(v.name, ''), 'venue') || ' in ' || coalesce(nullif(v.location, ''), nullif(v.city, ''), 'gujarat')
      ), '[^a-z0-9]+', '-', 'g')),
      ''
    ) as base_slug
  from public.venues v
  where v.slug is null
     or v.slug = ''
     or v.slug ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
), ranked_venues as (
  select
    vc.id,
    coalesce(vc.base_slug, 'venue') as base_slug,
    row_number() over (partition by coalesce(vc.base_slug, 'venue') order by vc.created_at nulls last, vc.id) as rn
  from venue_candidates vc
)
update public.venues v
set slug = case
  when rv.rn = 1 then rv.base_slug
  else rv.base_slug || '-' || left(v.id::text, 8)
end
from ranked_venues rv
where rv.id = v.id;

with vendor_candidates as (
  select
    v.id,
    v.created_at,
    nullif(
      trim(both '-' from regexp_replace(lower(
        coalesce(nullif(v.name, ''), 'vendor') || ' in ' || coalesce(nullif(v.location, ''), nullif(v.city, ''), 'gujarat')
      ), '[^a-z0-9]+', '-', 'g')),
      ''
    ) as base_slug
  from public.vendors v
  where v.slug is null
     or v.slug = ''
     or v.slug ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
), ranked_vendors as (
  select
    vc.id,
    coalesce(vc.base_slug, 'vendor') as base_slug,
    row_number() over (partition by coalesce(vc.base_slug, 'vendor') order by vc.created_at nulls last, vc.id) as rn
  from vendor_candidates vc
)
update public.vendors v
set slug = case
  when rv.rn = 1 then rv.base_slug
  else rv.base_slug || '-' || left(v.id::text, 8)
end
from ranked_vendors rv
where rv.id = v.id;

commit;

-- Optional verification queries:
-- select id, slug, city from public.venues where slug is null or slug = '' or slug ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' limit 50;
-- select id, slug, city from public.vendors where slug is null or slug = '' or slug ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' limit 50;
